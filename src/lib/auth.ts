import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'fallback-secret');

export interface SessionData {
  userId: string;
  email: string;
}

export async function createSession(userId: string, email: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const sessionToken = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .sign(secret);

  await prisma.session.create({
    data: {
      id: sessionToken.slice(-20), // Use last 20 chars as session ID
      userId,
      expiresAt,
    },
  });

  const cookieStore = cookies();
  (await cookieStore).set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });

  return sessionToken;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('session')?.value;

  if (!sessionToken) return null;

  try {
    const { payload } = await jwtVerify(sessionToken, secret);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('session')?.value;

  if (sessionToken) {
    try {
      await prisma.session.delete({
        where: { id: sessionToken.slice(-20) },
      });
    } catch {
      // Session might not exist in DB, ignore error
    }
  }

  (await cookieStore).delete('session');
}