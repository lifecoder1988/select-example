import { NextRequest, NextResponse } from 'next/server';

// 生成测试数据的函数
function generateTestData(count: number) {
  const data = [];
  const datasources = ['ironbank', 'database', 'api', 'file', 'cache'];
  const nameTemplates = [
    '测试RAG问答', '数据分析报告', '用户行为统计', '系统性能监控', '业务流程优化',
    '机器学习模型', '自然语言处理', '图像识别算法', '推荐系统优化', '搜索引擎优化',
    '数据可视化', '实时数据处理', '批量数据导入', '数据清洗任务', '数据备份恢复'
  ];
  
  for (let i = 0; i < count; i++) {
    const nameTemplate = nameTemplates[i % nameTemplates.length];
    const datasource = datasources[i % datasources.length];
    
    data.push({
      pid: `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
      name: `${nameTemplate}_${String(i + 1).padStart(6, '0')}`,
      datasource: datasource
    });
  }
  
  return data;
}

// 缓存数据
let cachedData: any[] | null = null;

function getData() {
  if (!cachedData) {
    cachedData = generateTestData(20000);
  }
  return cachedData;
}

export async function GET(request: NextRequest) {
  try {
    const allData = getData();
    
    return NextResponse.json({
      data: allData,
      total: allData.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}