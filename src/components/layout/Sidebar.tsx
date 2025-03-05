'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  title: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  {
    title: '仪表盘',
    href: '/dashboard',
  },
  {
    title: '客户管理',
    href: '/clients',
  },
  {
    title: '问卷管理',
    href: '/questionnaires',
  },
  {
    title: '贷款申请',
    href: '/applications',
  },
  {
    title: '设置',
    href: '/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">贷款顾问 CRM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">管理员</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 