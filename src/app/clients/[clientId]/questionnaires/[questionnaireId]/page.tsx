import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';

interface Props {
  params: {
    clientId: string;
    questionnaireId: string;
  };
}

export default async function QuestionnairePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: params.questionnaireId,
      clientId: params.clientId,
    },
    include: {
      client: true,
    },
  });

  if (!questionnaire) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{questionnaire.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                客户: {questionnaire.client.name}
              </p>
            </div>
            {questionnaire.status !== '已完成' && (
              <Link
                href={`/clients/${params.clientId}/questionnaires/${params.questionnaireId}/answer`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                填写问卷
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">问卷信息</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">描述</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {questionnaire.description || '-'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">状态</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      questionnaire.status === '已完成'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {questionnaire.status}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">创建时间</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(questionnaire.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">更新时间</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(questionnaire.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">问题列表</h2>
          <div className="space-y-6">
            {questionnaire.questions.map((question: any, index: number) => (
              <div key={question.id} className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.title}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h3>

                {question.type === 'text' && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>文本回答</p>
                    {questionnaire.responses?.find((r: any) => r.questionId === question.id)
                      ?.answer || '-'}
                  </div>
                )}

                {(question.type === 'radio' || question.type === 'checkbox') && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      {question.type === 'radio' ? '单选' : '多选'}选项：
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {question.options?.map((option: string) => (
                        <li key={option} className="text-sm text-gray-900">
                          {option}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>已选答案：</p>
                      {question.type === 'radio' ? (
                        <p>
                          {questionnaire.responses?.find(
                            (r: any) => r.questionId === question.id
                          )?.answer || '-'}
                        </p>
                      ) : (
                        <ul className="list-disc list-inside">
                          {questionnaire.responses
                            ?.find((r: any) => r.questionId === question.id)
                            ?.answer?.map((answer: string) => (
                              <li key={answer}>{answer}</li>
                            )) || <li>-</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 