import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/server';

const contactSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(200),
  email: z.string().email('Некорректный email').max(200),
  phone: z.string().max(50).optional().default(''),
  message: z.string().min(1, 'Сообщение обязательно').max(5000),
  company: z.string().max(200).optional().default(''),
  direction: z.string().max(200).optional().default(''),
  botcheck: z.string().max(0).optional().default(''),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Слишком много запросов. Попробуйте позже.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ошибка валидации', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, phone, message, company, direction, botcheck } = parsed.data;

  if (botcheck) {
    return NextResponse.json({ success: true });
  }

  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY ?? '';

  const [web3Result, supabaseResult] = await Promise.allSettled([
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject: 'Новая заявка с сайта US Holding',
        from_name: 'US Holding Site',
        name,
        email,
        phone,
        company,
        direction,
        message,
      }),
    }),
    createSupabaseAdmin()
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        message: `${direction ? `[${direction}] ` : ''}${company ? `(${company}) ` : ''}${message}`,
      }),
  ]);

  const web3Ok = web3Result.status === 'fulfilled' && web3Result.value.ok;
  const supaOk = supabaseResult.status === 'fulfilled' && !supabaseResult.value.error;

  if (!web3Ok && !supaOk) {
    return NextResponse.json(
      { error: 'Не удалось отправить заявку. Попробуйте позже или напишите на info@usholding.kz' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
