// ===== src/app/api/reset-password/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const getQuestionSchema = z.object({
  email: z.string().email(),
  step: z.literal('get-question'),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  secretAnswer: z.string().min(1),
  newPassword: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  step: z.literal('reset-password'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.step === 'get-question') {
      const { email } = getQuestionSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email },
        select: { secretQuestion: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { secretQuestion: user.secretQuestion },
        { status: 200 }
      );
    }

    if (body.step === 'reset-password') {
      const { email, secretAnswer, newPassword } = resetPasswordSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        );
      }

      // 秘密の質問の答えを検証
      const isValidAnswer = await bcrypt.compare(secretAnswer, user.secretAnswer);

      if (!isValidAnswer) {
        return NextResponse.json(
          { error: '秘密の質問の答えが正しくありません' },
          { status: 401 }
        );
      }

      // 新しいパスワードをハッシュ化して更新
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email },
        data: { password: hashedNewPassword },
      });

      // 既存のセッションを全て削除
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json(
        { message: 'パスワードがリセットされました' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: '無効なリクエストです' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    
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
