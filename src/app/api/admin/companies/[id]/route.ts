import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { getAdminUserId } from '@/lib/admin';

const CompanyUpdateSchema = z.object({
  slug: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(500).optional(),
  tagline: z.string().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  card_tagline: z.string().max(500).nullable().optional(),
  card_description: z.string().nullable().optional(),
  services: z.array(z.string().max(500)).optional(),
  tags: z.array(z.string().max(200)).optional(),
  logo_file: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный формат запроса' }, { status: 400 });
  }

  const parsed = CompanyUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('companies')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка обновления компании' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Компания не найдена' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { id } = await params;

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('companies').delete().eq('id', id);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка удаления компании' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
