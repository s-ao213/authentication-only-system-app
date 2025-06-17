// ===== src/app/api/signup/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  secretQuestion: z.string().min(1, '秘密の質問を選択してください'),
  secretAnswer: z.string().min(1, '秘密の質問の答えを入力してください'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, secretQuestion, secretAnswer } = signupSchema.parse(body);

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードと秘密の質問の答えをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecretAnswer = await bcrypt.hash(secretAnswer, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        secretQuestion,
        secretAnswer: hashedSecretAnswer,
      },
    });

    return NextResponse.json(
      { 
        message: 'ユーザー登録が完了しました',
        userId: user.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
