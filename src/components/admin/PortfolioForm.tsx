'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/supabase/types';

type PortfolioProject = Database['public']['Tables']['portfolio_projects']['Row'];

interface PortfolioFormProps {
  initial?: Partial<PortfolioProject>;
  mode: 'create' | 'edit';
  id?: string;
}

interface FormState {
  slug: string;
  title: string;
  tag: string;
  location: string;
  builder: string;
  year: string;
  image_url: string;
  image_alt: string;
  sort_order: string;
}

export function PortfolioForm({ initial, mode, id }: PortfolioFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    tag: initial?.tag ?? '',
    location: initial?.location ?? '',
    builder: initial?.builder ?? '',
    year: initial?.year ?? '',
    image_url: initial?.image_url ?? '',
    image_alt: initial?.image_alt ?? '',
    sort_order: String(initial?.sort_order ?? 0),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      tag: form.tag.trim(),
      location: form.location.trim(),
      builder: form.builder.trim(),
      year: form.year.trim(),
      image_url: form.image_url.trim() || null,
      image_alt: form.image_alt.trim() || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    try {
      const url = mode === 'create' ? '/api/admin/portfolio' : `/api/admin/portfolio/${id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(json.error ?? 'Ошибка сохранения');
        return;
      }

      router.push('/admin/portfolio');
      router.refresh();
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid var(--gray-border)',
    fontSize: 14,
    color: 'var(--text)',
    fontFamily: 'var(--font-family-sans)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-light)',
    marginBottom: 6,
  };

  const fields: Array<{
    name: keyof FormState;
    label: string;
    required?: boolean;
    type?: string;
    hint?: string;
  }> = [
    { name: 'title', label: 'Название проекта', required: true },
    {
      name: 'slug',
      label: 'Slug (URL-идентификатор)',
      required: true,
      hint: 'Только латиница, цифры и дефис',
    },
    { name: 'tag', label: 'Тег / категория', required: true },
    { name: 'location', label: 'Локация', required: true },
    { name: 'builder', label: 'Застройщик / подрядчик', required: true },
    { name: 'year', label: 'Год', required: true },
    { name: 'image_url', label: 'URL изображения', hint: 'Полный URL или путь /images/...' },
    { name: 'image_alt', label: 'Alt-текст изображения' },
    { name: 'sort_order', label: 'Порядок сортировки', type: 'number' },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: 18 }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: 'var(--orange)' }}> *</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              style={fieldStyle}
            />
            {field.hint && (
              <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>{field.hint}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '11px 28px',
            borderRadius: 8,
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Сохранение...' : mode === 'create' ? 'Создать' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '11px 24px',
            borderRadius: 8,
            background: 'var(--light-bg)',
            color: 'var(--navy)',
            border: '1.5px solid var(--gray-border)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
