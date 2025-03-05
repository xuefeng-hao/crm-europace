import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.json();

    // 1. 获取问卷信息
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        sections: true,
      },
    });

    if (!questionnaire) {
      return new NextResponse('问卷不存在', { status: 404 });
    }

    // 2. 从表单数据中提取客户信息
    const sections = JSON.parse(questionnaire.sections as string);
    const personalInfo = sections.find((s: any) => s.title === '个人信息');
    if (!personalInfo) {
      return new NextResponse('问卷格式错误', { status: 400 });
    }

    const emailField = personalInfo.fields.find((f: any) => f.id === 'email');
    const nameField = personalInfo.fields.find((f: any) => f.id === 'name');
    const phoneField = personalInfo.fields.find((f: any) => f.id === 'phone');

    if (!emailField || !formData[emailField.id]) {
      return new NextResponse('邮箱是必填项', { status: 400 });
    }

    // 3. 查找或创建客户
    const email = formData[emailField.id];
    let client = await prisma.client.findUnique({
      where: { email },
    });

    if (!client) {
      // 创建新客户
      client = await prisma.client.create({
        data: {
          email,
          name: formData[nameField?.id] || '未命名',
          phone: formData[phoneField?.id] || '',
          status: 'potential',
        },
      });
    }

    // 4. 保存问卷回答
    const response = await prisma.questionnaireResponse.create({
      data: {
        questionnaireId: questionnaire.id,
        clientId: client.id,
        responses: JSON.stringify(formData),
      },
    });

    return NextResponse.json({
      message: '问卷提交成功',
      responseId: response.id,
    });
  } catch (error) {
    console.error('提交问卷失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 