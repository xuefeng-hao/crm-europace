'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: '🏠' },
  { name: '客户管理', href: '/clients', icon: '👥' },
  { name: '贷款申请', href: '/applications', icon: '📝' },
  { name: '统计报表', href: '/reports', icon: '📊' },
  { name: '用户管理', href: '/users', icon: '👤' },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 如果是登录页面，只显示内容，不显示侧边栏
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        {/* 侧边栏 */}
        <div className="flex flex-col w-64 bg-white border-r">
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-xl font-semibold">贷款顾问 CRM</span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <span className="mr-3">🚪</span>
              退出登录
            </button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
} 