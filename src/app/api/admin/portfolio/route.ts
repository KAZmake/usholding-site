import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { getAdminUserId } from '@/lib/admin';

const PortfolioSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  tag: z.string().min(1).max(200),
  location: z.string().min(1).max(500),
  builder: z.string().min(1).max(500),
  year: z.string().min(1).max(20),
  image_url: z.string().url().nullable().optional(),
  image_alt: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export async function GET(): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('portfolio_projects')
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

  const parsed = PortfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка создания проекта' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
