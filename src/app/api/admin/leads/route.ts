import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { getAdminUserId } from '@/lib/admin';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminId = await getAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const status = searchParams.get('status');

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createSupabaseAdmin();
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && ['new', 'in_progress', 'closed'].includes(status)) {
    query = query.eq('status', status as 'new' | 'in_progress' | 'closed');
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Ошибка получения данных' }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    },
  });
}
