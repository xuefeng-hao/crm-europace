'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  type: 'text' | 'radio' | 'checkbox';
  title: string;
  options?: string[];
  required: boolean;
}

interface QuestionnaireFormProps {
  clientId: string;
  initialData?: {
    title: string;
    description?: string;
    questions: Question[];
  };
}

export default function QuestionnaireForm({ clientId, initialData }: QuestionnaireFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/clients/${clientId}/questionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error('提交失败');
      }

      router.push(`/clients/${clientId}`);
      router.refresh();
    } catch (error) {
      console.error('提交问卷失败:', error);
      alert('提交问卷失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        title: '',
        required: false,
      },
    ]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-black">
          问卷标题
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-black">
          问卷描述
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-black">问题列表</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            添加问题
          </button>
        </div>

        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between">
              <div className="flex-grow space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black">问题标题</label>
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => updateQuestion(index, { title: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">问题类型</label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(index, { type: e.target.value as Question['type'] })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="text">文本</option>
                    <option value="radio">单选</option>
                    <option value="checkbox">多选</option>
                  </select>
                </div>

                {(question.type === 'radio' || question.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-black">选项</label>
                    <textarea
                      value={question.options?.join('\n') || ''}
                      onChange={(e) =>
                        updateQuestion(index, {
                          options: e.target.value.split('\n').filter((o) => o.trim()),
                        })
                      }
                      placeholder="每行一个选项"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-black">必填</label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="ml-4 text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? '提交中...' : '提交'}
        </button>
      </div>
    </form>
  );
} 