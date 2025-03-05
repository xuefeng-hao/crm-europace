'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  title: string;
  type: 'text' | 'radio' | 'checkbox' | 'select';
  options?: string[];
  required: boolean;
}

interface Client {
  id: string;
  name: string;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  questions: Question[];
}

export default function QuestionnairePage({
  params,
}: {
  params: { clientId: string; questionnaireId: string };
}) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const { clientId, questionnaireId } = params;

  useEffect(() => {
    async function fetchQuestionnaire() {
      try {
        const response = await fetch(`/api/clients/${clientId}/questionnaires/${questionnaireId}`);
        if (!response.ok) {
          throw new Error('获取问卷详情失败');
        }
        const data = await response.json();
        setQuestionnaire(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取问卷详情失败');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestionnaire();
  }, [clientId, questionnaireId]);

  const handlePublish = async () => {
    if (!questionnaire) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/questionnaires/${questionnaireId}/publish`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('发布问卷失败');
      }
      
      const updatedQuestionnaire = await response.json();
      setQuestionnaire(updatedQuestionnaire);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布问卷失败');
    } finally {
      setIsPublishing(false);
    }
  };

  const getQuestionTypeText = (type: string): string => {
    switch (type) {
      case 'text':
        return '文本';
      case 'radio':
        return '单选';
      case 'checkbox':
        return '多选';
      case 'select':
        return '下拉选择';
      default:
        return type;
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  if (error || !questionnaire) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-black mb-4">
          {error || '问卷不存在'}
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-black">{questionnaire.title}</h1>
              <p className="mt-1 text-sm text-black">
                {questionnaire.description || '无描述'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/clients/${clientId}/questionnaires/${questionnaireId}/answer`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                填写问卷
              </Link>
              <button
                onClick={handlePublish}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                disabled={isPublishing}
              >
                {isPublishing ? '发布中...' : '发布问卷'}
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-black">问卷信息</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-black">描述</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    {questionnaire.description || '无描述'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-black">状态</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        questionnaire.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {questionnaire.status === 'PUBLISHED' ? '已发布' : '草稿'}
                    </span>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-black">创建时间</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    {new Date(questionnaire.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-black">更新时间</dt>
                  <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                    {new Date(questionnaire.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-black mb-4">问题列表</h2>
            
            {questionnaire.questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-black mb-4">
                  {index + 1}. {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                
                <div className="mt-2 text-sm text-black">
                  <p>类型: {getQuestionTypeText(question.type)}</p>
                </div>
                
                {question.options && question.options.length > 0 && (
                  <>
                    <p className="text-sm text-black mb-2">选项:</p>
                    <ul className="list-disc pl-5">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className="text-sm text-black">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                <div className="mt-4 text-sm text-black">
                  <p>必填: {question.required ? '是' : '否'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 