'use client';

import React, { useState } from 'react';
import SearchableSelect from '@/components/SearchableSelect';

interface DataItem {
  pid: string;
  name: string;
  datasource: string;
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const handleSelect = (item: DataItem | null) => {
    setSelectedItem(item);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            智能下拉选择框示例
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            支持模糊搜索的下拉选择组件，数据来源于API，包含10万条记录，
            支持实时搜索、分页加载和无限滚动功能。
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择数据项
            </label>
            <SearchableSelect
              onSelect={handleSelect}
              placeholder="请输入关键词搜索或点击选择..."
              className="max-w-md"
            />
          </div>

          {/* 选中结果显示 */}
          {selectedItem && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                已选择的项目
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">名称:</span>
                  <span className="text-gray-900">{selectedItem.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">数据源:</span>
                  <span className="text-gray-900">{selectedItem.datasource}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-20">ID:</span>
                  <span className="text-gray-900 font-mono text-sm">{selectedItem.pid}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 功能特性说明 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">模糊搜索</h3>
            </div>
            <p className="text-gray-600">
              支持按名称和数据源进行模糊搜索，实时返回匹配结果，搜索响应快速流畅。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">大数据量</h3>
            </div>
            <p className="text-gray-600">
              处理10万条数据记录，通过分页和虚拟滚动技术确保良好的性能表现。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">高性能</h3>
            </div>
            <p className="text-gray-600">
              采用防抖技术和懒加载策略，减少不必要的API请求，提升用户体验。
            </p>
          </div>
        </div>

        {/* 技术栈说明 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">技术栈</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Next.js 14',
              'React 18',
              'TypeScript',
              'Tailwind CSS',
              'API Routes',
              '防抖搜索',
              '无限滚动',
              '响应式设计'
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}