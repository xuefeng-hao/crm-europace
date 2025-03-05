import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

interface Props {
  params: {
    clientId: string;
  };
}

export default async function NewQuestionnairePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return notFound();
  }

  const client = await prisma.client.findUnique({
    where: {
      id: params.clientId,
    },
  });

  if (!client) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">创建问卷</h1>
          <p className="mt-1 text-sm text-gray-500">
            为客户 {client.name} 创建一个新的问卷
          </p>
        </div>
        <QuestionnaireForm clientId={params.clientId} />
      </div>
    </div>
  );
} 