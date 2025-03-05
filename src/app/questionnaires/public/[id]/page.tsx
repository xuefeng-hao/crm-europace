'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Section {
  title: string;
  fields: {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  }[];
}

interface QuestionnaireData {
  id: string;
  title: string;
  sections: Section[];
  description?: string;
}

export default function PublicQuestionnairePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestionnaire();
  }, [params.id]);

  const fetchQuestionnaire = async () => {
    try {
      const response = await fetch(`/api/questionnaires/public/${params.id}`);
      if (!response.ok) {
        throw new Error('问卷不存在或已关闭');
      }
      const data = await response.json();
      setQuestionnaire(data);
      // 初始化表单数据
      const initialData: Record<string, any> = {};
      data.sections.forEach((section: Section) => {
        section.fields.forEach(field => {
          initialData[field.id] = '';
        });
      });
      setFormData(initialData);
    } catch (error) {
      console.error('获取问卷失败:', error);
      setError(error instanceof Error ? error.message : '获取问卷失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/questionnaires/public/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('提交问卷失败');
      }

      // 提交成功后显示感谢页面
      router.push(`/questionnaires/public/${params.id}/thanks`);
    } catch (error) {
      console.error('提交问卷失败:', error);
      setError(error instanceof Error ? error.message : '提交问卷失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-black">加载中...</p>
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
        <h3 className="text-lg font-medium text-black mb-4">
          {error || '问卷不存在'}
        </h3>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              {questionnaire.title}
            </h1>

            {questionnaire.description && (
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                {questionnaire.description}
              </h2>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {questionnaire.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-6">
                  <h2 className="text-xl font-medium text-gray-900">
                    {section.title}
                  </h2>

                  <div className="space-y-6">
                    {section.fields.map(field => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        {field.type === 'select' && field.options ? (
                          <select
                            id={field.id}
                            value={formData[field.id]}
                            onChange={e => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="">请选择</option>
                            {field.options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            id={field.id}
                            value={formData[field.id]}
                            onChange={e => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                            rows={3}
                            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={formData[field.id]}
                            onChange={e => handleInputChange(field.id, e.target.value)}
                            required={field.required}
                            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? '提交中...' : '提交问卷'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 