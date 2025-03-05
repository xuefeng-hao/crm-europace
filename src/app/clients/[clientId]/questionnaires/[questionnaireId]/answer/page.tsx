import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import QuestionnaireAnswerForm from '@/components/questionnaire/QuestionnaireAnswerForm';

interface Props {
  params: {
    clientId: string;
    questionnaireId: string;
  };
}

export default async function QuestionnaireAnswerPage({ params }: Props) {
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
          <h1 className="text-2xl font-semibold text-gray-900">{questionnaire.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            客户: {questionnaire.client.name}
          </p>
        </div>
        <QuestionnaireAnswerForm
          clientId={params.clientId}
          questionnaireId={params.questionnaireId}
          questions={questionnaire.questions}
          initialResponses={questionnaire.responses}
        />
      </div>
    </div>
  );
} 