'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  address?: string;
  notes?: string;
}

export default function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/clients/${params.clientId}`);
        if (!response.ok) {
          throw new Error('获取客户信息失败');
        }
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('获取客户信息失败:', error);
        setError('获取客户信息失败');
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [params.clientId]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {error || '客户信息不存在'}
        </h3>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          返回上一页
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">客户详情</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          返回列表
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">姓名</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.name}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">邮箱</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.email}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">电话</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.status}</dd>
            </div>

            {client.address && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">地址</dt>
                <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
              </div>
            )}

            {client.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">备注</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {client.notes}
                </dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">创建时间</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(client.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 