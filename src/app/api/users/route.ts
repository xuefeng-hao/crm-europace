import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log('API - 获取用户列表 - 未授权访问');
      return new NextResponse('未授权访问', { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return new NextResponse('获取用户列表失败', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse('未授权访问', { status: 401 });
    }

    const data = await request.json();

    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) {
      return new NextResponse('姓名、邮箱和密码都是必填项', { status: 400 });
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.trim() },
    });

    if (existingUser) {
      return new NextResponse('该邮箱已被注册', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        password: hashedPassword,
        role: data.role || 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('创建用户失败:', error);
    return new NextResponse('创建用户失败', { status: 500 });
  }
} 