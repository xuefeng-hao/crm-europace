'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">仪表盘</h1>
      <p>欢迎回来, {session?.user?.name || '用户'}!</p>
    </div>
  );
} 