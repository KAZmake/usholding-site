import { createSupabaseAdmin } from '@/lib/supabase/server';
import { PortfolioForm } from '@/components/admin/PortfolioForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Редактировать проект | Админ | US Holding' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({ params }: Props) {
  const { id } = await params;

  const supabase = createSupabaseAdmin();
  const { data: project, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/admin/portfolio"
          style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}
        >
          ← Назад к портфолио
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
        Редактировать проект
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 28, fontSize: 14 }}>{project.title}</p>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '32px 36px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-border)',
        }}
      >
        <PortfolioForm mode="edit" id={id} initial={project} />
      </div>
    </div>
  );
}
