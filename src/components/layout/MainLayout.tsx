'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
  { name: '客户管理', href: '/clients', icon: UsersIcon },
  { name: '贷款申请', href: '/applications', icon: DocumentTextIcon },
  { name: '统计报表', href: '/reports', icon: ChartBarIcon },
  { name: '用户管理', href: '/users', icon: UserGroupIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <span className="text-xl font-semibold">贷款顾问 CRM</span>
              <button
                type="button"
                className="-mr-2 p-2 text-black hover:text-black"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-gray-100 text-black'
                        : 'text-black hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive ? 'text-black' : 'text-black group-hover:text-black'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-50 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6 text-black group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <span className="text-xl font-semibold">贷款顾问 CRM</span>
          </div>
          <nav className="flex flex-1 flex-col space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-black hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-black' : 'text-black group-hover:text-black'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center rounded-md px-2 py-2 text-sm font-medium text-black hover:bg-gray-50 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6 text-black group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </nav>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="px-4 text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 