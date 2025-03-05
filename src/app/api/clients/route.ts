import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse('未授权访问', { status: 401 });
    }

    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('获取客户列表失败:', error);
    return new NextResponse('获取客户列表失败', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse('未授权访问', { status: 401 });
    }

    const data = await request.json();

    if (!data.name?.trim() || !data.email?.trim()) {
      return new NextResponse('姓名和邮箱是必填项', { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
        notes: data.notes?.trim() || null,
        status: data.status || '潜在',
        user: {
          connect: {
            email: session.user.email!
          }
        }
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('创建客户失败:', error);
    return new NextResponse('创建客户失败', { status: 500 });
  }
} 