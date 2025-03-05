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

interface Response {
  questionId: string;
  answer: string | string[];
}

interface QuestionnaireAnswerFormProps {
  clientId: string;
  questionnaireId: string;
  questions: Question[];
  initialResponses?: Response[];
}

export default function QuestionnaireAnswerForm({
  clientId,
  questionnaireId,
  questions,
  initialResponses = [],
}: QuestionnaireAnswerFormProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>(initialResponses);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/clients/${clientId}/questionnaires/${questionnaireId}/responses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('提交失败');
      }

      router.push(`/clients/${clientId}/questionnaires/${questionnaireId}`);
      router.refresh();
    } catch (error) {
      console.error('提交问卷回答失败:', error);
      alert('提交问卷回答失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (questionId: string, answer: string | string[]) => {
    const newResponses = [...responses];
    const index = newResponses.findIndex((r) => r.questionId === questionId);
    if (index >= 0) {
      newResponses[index] = { questionId, answer };
    } else {
      newResponses.push({ questionId, answer });
    }
    setResponses(newResponses);
  };

  const getResponse = (questionId: string) => {
    return responses.find((r) => r.questionId === questionId)?.answer || '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.title}
            {question.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h3>

          {question.type === 'text' && (
            <textarea
              value={getResponse(question.id) as string}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              required={question.required}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          )}

          {question.type === 'radio' && question.options && (
            <div className="space-y-4">
              {question.options.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`${question.id}-${option}`}
                    name={question.id}
                    value={option}
                    checked={getResponse(question.id) === option}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    required={question.required}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'checkbox' && question.options && (
            <div className="space-y-4">
              {question.options.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${question.id}-${option}`}
                    value={option}
                    checked={(getResponse(question.id) as string[])?.includes(option)}
                    onChange={(e) => {
                      const currentAnswers = (getResponse(question.id) as string[]) || [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter((a) => a !== option);
                      updateResponse(question.id, newAnswers);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

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