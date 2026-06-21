import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type UserProfileExtra = Database['public']['Tables']['user_profile_extra']['Row'];
type UserProfileExtraUpsert = Database['public']['Tables']['user_profile_extra']['Insert'];

const UpdateProfileSchema = z.object({
  phone: z.string().max(50).nullable().optional(),
  position: z.string().max(200).nullable().optional(),
  department: z.string().max(200).nullable().optional(),
});

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const [clerkUser, supabase] = await Promise.all([
    currentUser(),
    Promise.resolve(createSupabaseAdmin()),
  ]);

  const { data: extra, error } = await supabase
    .from('user_profile_extra')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle<UserProfileExtra>();

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных профиля' }, { status: 500 });
  }

  // extra is null when the profile row doesn't exist yet (first login)

  const primaryEmail = clerkUser?.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;

  return NextResponse.json({
    clerk_user_id: userId,
    first_name: clerkUser?.firstName ?? null,
    last_name: clerkUser?.lastName ?? null,
    email: primaryEmail ?? null,
    phone: extra?.phone ?? null,
    position: extra?.position ?? null,
    department: extra?.department ?? null,
  });
}

export async function PUT(request: Request): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный формат запроса' }, { status: 400 });
  }

  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.issues },
      { status: 422 },
    );
  }

  const { phone, position, department } = parsed.data;

  const supabase = createSupabaseAdmin();

  const upsertPayload: UserProfileExtraUpsert = {
    clerk_user_id: userId,
    updated_at: new Date().toISOString(),
  };

  if (phone !== undefined) upsertPayload.phone = phone;
  if (position !== undefined) upsertPayload.position = position;
  if (department !== undefined) upsertPayload.department = department;

  const { data, error } = await supabase
    .from('user_profile_extra')
    .upsert(upsertPayload, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single<UserProfileExtra>();

  if (error) {
    console.error('Supabase upsert error:', error);
    return NextResponse.json({ error: 'Не удалось сохранить данные профиля' }, { status: 500 });
  }

  return NextResponse.json(data);
}
