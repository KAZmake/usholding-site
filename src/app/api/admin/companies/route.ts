import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { getAdminUserId } from '@/lib/admin';

const CompanySchema = z.object({
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(500),
  tagline: z.string().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  card_tagline: z.string().max(500).nullable().optional(),
  card_description: z.string().nullable().optional(),
  services: z.array(z.string().max(500)).optional(),
  tags: z.array(z.string().max(200)).optional(),
  logo_file: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export async function GET(): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка получения данных' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный формат запроса' }, { status: 400 });
  }

  const parsed = CompanySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('companies')
    .insert({
      ...parsed.data,
      services: parsed.data.services ?? [],
      tags: parsed.data.tags ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка создания компании' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
