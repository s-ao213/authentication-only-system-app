// ===== src/app/api/session/route.ts =====
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          userId: session.userId,
          email: session.email,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
