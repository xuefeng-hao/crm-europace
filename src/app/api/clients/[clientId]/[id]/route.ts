import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: params.clientId,
      },
      include: {
        questionnaires: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: '客户不存在' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('获取客户失败:', error);
    return NextResponse.json(
      { error: '获取客户失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const client = await prisma.client.update({
      where: {
        id: params.clientId,
      },
      data,
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('更新客户失败:', error);
    return NextResponse.json(
      { error: '更新客户失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    await prisma.client.delete({
      where: {
        id: params.clientId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除客户失败:', error);
    return NextResponse.json(
      { error: '删除客户失败' },
      { status: 500 }
    );
  }
} 