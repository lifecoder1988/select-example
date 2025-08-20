'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface DataItem {
  pid: string;
  name: string;
  datasource: string;
}

interface SearchableSelectProps {
  onSelect?: (item: DataItem | null) => void;
  placeholder?: string;
  className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  onSelect,
  placeholder = '请选择...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [allData, setAllData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // 防抖搜索词
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // 客户端模糊搜索，限制最多显示500条
  const filteredData = useMemo(() => {
    let filtered = allData;
    
    // 模糊搜索
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = allData.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.datasource.toLowerCase().includes(searchLower)
      );
    }
    
    // 限制最多显示500条
    return filtered.slice(0, 500);
  }, [allData, debouncedSearchTerm]);
  
  // 加载所有数据
  const loadAllData = useCallback(async () => {
    if (allData.length > 0) return; // 避免重复加载
    
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setAllData(result.data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [allData.length]);
  
  // 强制刷新数据
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setAllData(result.data);
    } catch (error) {
      console.error('刷新数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 初始加载数据
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);
  

  
  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  const handleItemSelect = (item: DataItem) => {
    setSelectedItem(item);
    setSearchTerm(item.name);
    setIsOpen(false);
    onSelect?.(item);
  };
  
  const handleInputFocus = () => {
    setIsOpen(true);
    refreshData(); // 聚焦时异步刷新数据
  };
  
  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm('');
    onSelect?.(null);
    inputRef.current?.focus();
  };
  
  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
        />
        
        {/* 清除按钮 */}
        {selectedItem && (
          <button
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* 下拉箭头 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* 下拉选项 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* 搜索结果统计 */}
          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在加载数据...
              </div>
            ) : (
              <>
                {debouncedSearchTerm ? (
                   <span>找到 <strong>{filteredData.length > 500 ? '500+' : filteredData.length}</strong> 条匹配结果{filteredData.length > 500 ? ' (最多显示500条)' : ''}</span>
                 ) : (
                   <span>显示前 500 条数据 (共 <strong>{allData.length}</strong> 条)</span>
                 )}
              </>
            )}
          </div>
          
          <div
            ref={listRef}
            className="max-h-48 overflow-y-auto"
          >
            {filteredData.length === 0 && !loading ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                {debouncedSearchTerm ? '未找到匹配结果' : '暂无数据'}
              </div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.pid}
                  onClick={() => handleItemSelect(item)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                     {debouncedSearchTerm ? (
                       // 高亮搜索关键词
                       <span dangerouslySetInnerHTML={{
                         __html: item.name.replace(
                           new RegExp(`(${debouncedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                           '<mark class="bg-yellow-200">$1</mark>'
                         )
                       }} />
                     ) : (
                       item.name
                     )}
                   </div>
                   <div className="text-sm text-gray-500 mt-1">
                     数据源: 
                     {debouncedSearchTerm ? (
                       <span dangerouslySetInnerHTML={{
                         __html: item.datasource.replace(
                           new RegExp(`(${debouncedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                           '<mark class="bg-yellow-200">$1</mark>'
                         )
                       }} />
                     ) : (
                       item.datasource
                     )}
                     {' | ID: '}{item.pid.slice(0, 8)}...
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;