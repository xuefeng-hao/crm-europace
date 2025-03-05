'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
  { name: '客户管理', href: '/clients', icon: UserGroupIcon },
  { name: '贷款申请', href: '/applications', icon: DocumentTextIcon },
  { name: '统计报表', href: '/reports', icon: ChartBarIcon },
  { name: '用户管理', href: '/users', icon: ClipboardDocumentListIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex h-16 flex-shrink-0 items-center bg-white px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">贷款问询 CRM</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-base font-medium rounded-md
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-6 w-6 flex-shrink-0
                    ${
                      isActive
                        ? 'text-blue-700'
                        : 'text-gray-600 group-hover:text-blue-600'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 