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
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-black">贷款问询 CRM</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-black hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span
                    className={`${
                      isActive ? 'text-blue-700' : 'text-black group-hover:text-black'
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lg">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-black">管理员</p>
            <p className="text-xs text-black">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 