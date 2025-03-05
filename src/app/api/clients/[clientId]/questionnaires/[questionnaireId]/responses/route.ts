import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string; questionnaireId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { responses } = data;

    const questionnaire = await prisma.questionnaire.update({
      where: {
        id: params.questionnaireId,
        clientId: params.clientId,
      },
      data: {
        responses,
        status: '已完成',
      },
    });

    return NextResponse.json(questionnaire);
  } catch (error) {
    console.error('提交问卷回答失败:', error);
    return NextResponse.json(
      { error: '提交问卷回答失败' },
      { status: 500 }
    );
  }
} 