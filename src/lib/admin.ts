import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function assertAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/');
  }

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (role !== 'admin') {
    redirect('/');
  }

  return userId;
}

export async function getAdminUserId(): Promise<string | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) return null;

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (role !== 'admin') return null;

  return userId;
}
