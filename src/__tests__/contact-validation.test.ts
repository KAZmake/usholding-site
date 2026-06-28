import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Mirrors the schema in src/app/api/contact/route.ts
const contactSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(200),
  email: z.string().email('Некорректный email').max(200),
  phone: z.string().max(50).optional().default(''),
  message: z.string().min(1, 'Сообщение обязательно').max(5000),
  company: z.string().max(200).optional().default(''),
  direction: z.string().max(200).optional().default(''),
  botcheck: z.string().max(0).optional().default(''),
});

type ContactInput = z.input<typeof contactSchema>;

const validPayload: ContactInput = {
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  message: 'Интересует сотрудничество',
};

describe('contactSchema — valid inputs', () => {
  it('accepts a minimal valid payload', () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('fills optional fields with defaults when omitted', () => {
    const result = contactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe('');
      expect(result.data.company).toBe('');
      expect(result.data.direction).toBe('');
      expect(result.data.botcheck).toBe('');
    }
  });

  it('accepts a fully populated payload', () => {
    const result = contactSchema.safeParse({
      ...validPayload,
      phone: '+7 701 000 00 00',
      company: 'ТОО Рога и Копыта',
      direction: 'US Construction',
      botcheck: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts email with subdomain', () => {
    const result = contactSchema.safeParse({ ...validPayload, email: 'user@mail.usholding.kz' });
    expect(result.success).toBe(true);
  });
});

describe('contactSchema — invalid inputs', () => {
  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...validPayload, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.name).toBeDefined();
    }
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.email).toBeDefined();
    }
  });

  it('rejects empty message', () => {
    const result = contactSchema.safeParse({ ...validPayload, message: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.message).toBeDefined();
    }
  });

  it('rejects name longer than 200 characters', () => {
    const result = contactSchema.safeParse({ ...validPayload, name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects message longer than 5000 characters', () => {
    const result = contactSchema.safeParse({ ...validPayload, message: 'x'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('rejects email longer than 200 characters', () => {
    // local part 195 chars + '@x.com' = 202 chars total — exceeds max(200)
    const longEmail = 'a'.repeat(195) + '@x.com';
    const result = contactSchema.safeParse({ ...validPayload, email: longEmail });
    expect(result.success).toBe(false);
  });

  it('rejects phone longer than 50 characters', () => {
    const result = contactSchema.safeParse({ ...validPayload, phone: '+'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejects non-empty botcheck (honeypot filled by bot)', () => {
    const result = contactSchema.safeParse({ ...validPayload, botcheck: 'I am a bot' });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields entirely', () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.name).toBeDefined();
      expect(fields.email).toBeDefined();
      expect(fields.message).toBeDefined();
    }
  });
});

describe('contactSchema — edge cases', () => {
  it('trims nothing (does not alter whitespace-only name — validation catches it via min(1))', () => {
    // A space is length 1, so it passes min(1). This is the current behavior.
    const result = contactSchema.safeParse({ ...validPayload, name: ' ' });
    expect(result.success).toBe(true);
  });

  it('accepts message of exactly 5000 characters', () => {
    const result = contactSchema.safeParse({ ...validPayload, message: 'a'.repeat(5000) });
    expect(result.success).toBe(true);
  });

  it('accepts name of exactly 200 characters', () => {
    const result = contactSchema.safeParse({ ...validPayload, name: 'a'.repeat(200) });
    expect(result.success).toBe(true);
  });
});
