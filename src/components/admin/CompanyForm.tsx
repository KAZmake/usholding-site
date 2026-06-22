'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/supabase/types';

type Company = Database['public']['Tables']['companies']['Row'];

interface CompanyFormProps {
  initial?: Partial<Company>;
  mode: 'create' | 'edit';
  id?: string;
}

interface FormState {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  card_tagline: string;
  card_description: string;
  services: string;
  tags: string;
  logo_file: string;
  sort_order: string;
}

export function CompanyForm({ initial, mode, id }: CompanyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    slug: initial?.slug ?? '',
    name: initial?.name ?? '',
    tagline: initial?.tagline ?? '',
    description: initial?.description ?? '',
    card_tagline: initial?.card_tagline ?? '',
    card_description: initial?.card_description ?? '',
    services: (initial?.services ?? []).join('\n'),
    tags: (initial?.tags ?? []).join(', '),
    logo_file: initial?.logo_file ?? '',
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

    const services = form.services
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      card_tagline: form.card_tagline.trim() || null,
      card_description: form.card_description.trim() || null,
      services,
      tags,
      logo_file: form.logo_file.trim() || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    try {
      const url = mode === 'create' ? '/api/admin/companies' : `/api/admin/companies/${id}`;
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

      router.push('/admin/companies');
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
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-light)',
    marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="name" style={labelStyle}>
              Название <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={fieldStyle}
            />
          </div>
          <div>
            <label htmlFor="slug" style={labelStyle}>
              Slug <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              style={fieldStyle}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tagline" style={labelStyle}>
            Слоган (полная карточка)
          </label>
          <input
            id="tagline"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="description" style={labelStyle}>
            Описание (полная карточка)
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="card_tagline" style={labelStyle}>
            Слоган (превью карточка)
          </label>
          <input
            id="card_tagline"
            name="card_tagline"
            value={form.card_tagline}
            onChange={handleChange}
            style={fieldStyle}
          />
        </div>

        <div>
          <label htmlFor="card_description" style={labelStyle}>
            Описание (превью карточка)
          </label>
          <textarea
            id="card_description"
            name="card_description"
            value={form.card_description}
            onChange={handleChange}
            rows={3}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="services" style={labelStyle}>
            Услуги (каждая с новой строки)
          </label>
          <textarea
            id="services"
            name="services"
            value={form.services}
            onChange={handleChange}
            rows={5}
            placeholder="Строительство жилых объектов&#10;Ремонтные работы&#10;..."
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label htmlFor="tags" style={labelStyle}>
            Теги (через запятую)
          </label>
          <input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Строительство, Инжиниринг"
            style={fieldStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="logo_file" style={labelStyle}>
              Файл логотипа
            </label>
            <input
              id="logo_file"
              name="logo_file"
              value={form.logo_file}
              onChange={handleChange}
              placeholder="logo/company.svg"
              style={fieldStyle}
            />
          </div>
          <div>
            <label htmlFor="sort_order" style={labelStyle}>
              Порядок сортировки
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              style={fieldStyle}
            />
          </div>
        </div>
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
