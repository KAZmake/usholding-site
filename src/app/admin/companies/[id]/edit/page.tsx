import { createSupabaseAdmin } from '@/lib/supabase/server';
import { CompanyForm } from '@/components/admin/CompanyForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Редактировать компанию | Админ | US Holding' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: Props) {
  const { id } = await params;

  const supabase = createSupabaseAdmin();
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !company) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/admin/companies"
          style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}
        >
          ← Назад к компаниям
        </Link>
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-family-serif)',
          fontSize: 26,
          color: 'var(--navy)',
          marginBottom: 4,
        }}
      >
        Редактировать компанию
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 28, fontSize: 14 }}>{company.name}</p>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '32px 36px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-border)',
        }}
      >
        <CompanyForm mode="edit" id={id} initial={company} />
      </div>
    </div>
  );
}
