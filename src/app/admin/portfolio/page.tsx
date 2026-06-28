import { createSupabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { Database } from '@/lib/supabase/types';

export const metadata = { title: 'Портфолио | Админ | US Holding' };

type PortfolioProject = Database['public']['Tables']['portfolio_projects']['Row'];

async function getProjects(): Promise<PortfolioProject[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return data ?? [];
}

export default async function AdminPortfolioPage() {
  const projects = await getProjects();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-family-serif)',
              fontSize: 26,
              color: 'var(--navy)',
              marginBottom: 4,
            }}
          >
            Портфолио
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: 14 }}>
            {projects.length} проект{projects.length === 1 ? '' : 'ов'}
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 8,
            background: 'var(--navy)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          + Добавить проект
        </Link>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-border)',
          overflow: 'hidden',
        }}
      >
        {projects.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--gray)' }}>
            Нет проектов.{' '}
            <Link href="/admin/portfolio/new" style={{ color: 'var(--navy)' }}>
              Добавить первый
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--off-white)',
                  borderBottom: '1px solid var(--gray-border)',
                }}
              >
                {['#', 'Название', 'Тег', 'Локация', 'Год', 'Действия'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--gray)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  style={{
                    borderBottom:
                      index < projects.length - 1 ? '1px solid var(--gray-border)' : 'none',
                  }}
                  className="admin-table-row"
                >
                  <td
                    style={{ padding: '14px 16px', color: 'var(--gray)', fontSize: 13, width: 48 }}
                  >
                    {project.sort_order}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                      {project.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>
                      {project.slug}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: 'var(--light-bg)',
                        color: 'var(--navy)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {project.tag}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                    {project.location}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                    {project.year}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        href={`/admin/portfolio/${project.id}/edit`}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 6,
                          background: 'var(--light-bg)',
                          color: 'var(--navy)',
                          textDecoration: 'none',
                          fontSize: 13,
                          fontWeight: 600,
                          border: '1px solid var(--gray-border)',
                        }}
                      >
                        Изменить
                      </Link>
                      <DeleteButton
                        id={project.id}
                        apiPath="/api/admin/portfolio"
                        label={project.title}
                        redirectTo="/admin/portfolio"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .admin-table-row:hover { background: var(--off-white); }
      `}</style>
    </div>
  );
}
