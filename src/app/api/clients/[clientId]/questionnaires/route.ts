import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const questionnaires = await prisma.questionnaire.findMany({
      where: {
        clientId: params.clientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questionnaires);
  } catch (error) {
    console.error('获取问卷列表失败:', error);
    return NextResponse.json(
      { error: '获取问卷列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, description, questions } = data;

    const questionnaire = await prisma.questionnaire.create({
      data: {
        title,
        description,
        questions,
        status: '进行中',
        clientId: params.clientId,
      },
    });

    return NextResponse.json(questionnaire);
  } catch (error) {
    console.error('创建问卷失败:', error);
    return NextResponse.json(
      { error: '创建问卷失败' },
      { status: 500 }
    );
  }
} 