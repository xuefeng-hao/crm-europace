'use client';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">统计报表</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 贷款总额卡片 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">贷款总额</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">¥1,234,567</p>
          <p className="mt-2 text-sm text-gray-500">较上月增长 12%</p>
        </div>

        {/* 客户数量卡片 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">客户总数</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">156</p>
          <p className="mt-2 text-sm text-gray-500">本月新增 23 位</p>
        </div>

        {/* 申请通过率卡片 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">申请通过率</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">85%</p>
          <p className="mt-2 text-sm text-gray-500">较上月提升 5%</p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">月度贷款趋势</h3>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          图表将在这里显示
        </div>
      </div>

      {/* 最近申请列表 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">最近申请</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申请日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">张三</td>
                <td className="px-6 py-4 whitespace-nowrap">¥100,000</td>
                <td className="px-6 py-4 whitespace-nowrap">审核中</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-05</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">李四</td>
                <td className="px-6 py-4 whitespace-nowrap">¥200,000</td>
                <td className="px-6 py-4 whitespace-nowrap">已通过</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-03-04</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 