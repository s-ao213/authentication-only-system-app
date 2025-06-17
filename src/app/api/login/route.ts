// ===== src/app/api/login/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/auth';
import { sendLoginNotification } from '@/lib/mail';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // セッション作成
    await createSession(user.id, user.email);

    // ログイン通知メール送信（非同期で実行）
    try {
      await sendLoginNotification(user.email);
    } catch (mailError) {
      console.error('Failed to send login notification:', mailError);
      // メール送信失敗してもログインは成功とする
    }

    return NextResponse.json(
      { message: 'ログインに成功しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
