'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = '仪表盘' }: HeaderProps) {
  // 添加侧边栏切换功能
  const toggleSidebar = () => {
    // 侧边栏切换逻辑
    console.log('Toggle sidebar');
  };

  // 添加通知切换功能
  const toggleNotifications = () => {
    // 通知切换逻辑
    console.log('Toggle notifications');
  };

  // 添加用户菜单切换功能
  const toggleUserMenu = () => {
    // 用户菜单切换逻辑
    console.log('Toggle user menu');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex-1 flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-black rounded-md hover:text-black hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <div className="text-lg font-medium text-black">
            {title}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleNotifications}
              className="p-2 text-black rounded-md hover:text-black hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            
            <button
              onClick={toggleUserMenu}
              className="p-2 text-black rounded-md hover:text-black hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 