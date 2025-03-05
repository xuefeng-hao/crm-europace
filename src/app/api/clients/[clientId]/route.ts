import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('未授权访问', { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: params.clientId,
      },
    });

    if (!client) {
      return new NextResponse('客户不存在', { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('获取客户详情失败:', error);
    return new NextResponse('获取客户详情失败', { status: 500 });
  }
} 