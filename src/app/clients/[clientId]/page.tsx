'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <h3 className="text-lg font-medium text-black mb-4">
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
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <div className="flex space-x-2">
          <Link
            href={`/clients/${client.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            编辑客户
          </Link>
          <Link
            href={`/clients/${client.id}/questionnaires/new`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            创建问卷
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-black">客户信息</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">姓名</dt>
              <dd className="mt-1 text-sm text-black">{client.name}</dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">邮箱</dt>
              <dd className="mt-1 text-sm text-black">{client.email}</dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">电话</dt>
              <dd className="mt-1 text-sm text-black">{client.phone}</dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">状态</dt>
              <dd className="mt-1 text-sm text-black">{client.status}</dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">地址</dt>
              <dd className="mt-1 text-sm text-black">{client.address}</dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">备注</dt>
              <dd className="mt-1 text-sm text-black whitespace-pre-wrap">
                {client.notes || '无'}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-black">创建时间</dt>
              <dd className="mt-1 text-sm text-black">
                {new Date(client.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 