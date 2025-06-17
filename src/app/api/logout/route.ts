// ===== src/app/api/logout/route.ts =====
import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
  try {
    await deleteSession();
    
    return NextResponse.json(
      { message: 'ログアウトしました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    );
  }
}
