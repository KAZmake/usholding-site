import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// NOTE: Clerk Backend API does not provide a way to verify the current password
// before changing it. The "current_password" field is accepted by this endpoint
// for UX consistency (matches the original site's form), but it is NOT cryptographically
// verified server-side. For true current-password verification, the client must use
// Clerk's signIn.attemptFirstFactor({ strategy: "password", password }) on the frontend
// before calling this endpoint. This is a Clerk architectural limitation.

const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Введите текущий пароль'),
    new_password: z.string().min(8, 'Новый пароль должен содержать не менее 8 символов'),
    confirm_password: z.string().min(1, 'Подтвердите новый пароль'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Пароли не совпадают',
    path: ['confirm_password'],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'Новый пароль должен отличаться от текущего',
    path: ['new_password'],
  });

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

  const parsed = ChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const formErrors = parsed.error.flatten().formErrors;

    // Return the first relevant error message in Russian
    const firstError =
      fieldErrors.confirm_password?.[0] ??
      fieldErrors.new_password?.[0] ??
      fieldErrors.current_password?.[0] ??
      formErrors[0] ??
      'Ошибка валидации';

    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  const { new_password } = parsed.data;

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      password: new_password,
    });
  } catch (err: unknown) {
    console.error('Clerk password update error:', err);

    // Translate Clerk API error codes to Russian messages
    if (err && typeof err === 'object' && 'errors' in err) {
      const clerkErrors = (err as { errors: Array<{ code: string; message: string }> }).errors;
      const firstClerkError = clerkErrors?.[0];

      if (firstClerkError?.code === 'form_password_pwned') {
        return NextResponse.json(
          { error: 'Этот пароль является небезопасным. Выберите другой пароль.' },
          { status: 422 },
        );
      }

      if (firstClerkError?.code === 'form_password_not_strong_enough') {
        return NextResponse.json(
          { error: 'Пароль слишком слабый. Используйте более сложный пароль.' },
          { status: 422 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Не удалось изменить пароль. Попробуйте позже.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: 'Пароль успешно изменён' });
}
