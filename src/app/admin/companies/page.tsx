import { createSupabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { Database } from '@/lib/supabase/types';

export const metadata = { title: 'Компании | Админ | US Holding' };

type Company = Database['public']['Tables']['companies']['Row'];

async function getCompanies(): Promise<Company[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return data ?? [];
}

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

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
            Компании
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: 14 }}>
            {companies.length} направлен{companies.length === 1 ? 'ие' : 'ий'}
          </p>
        </div>
        <Link
          href="/admin/companies/new"
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
          + Добавить компанию
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
        {companies.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--gray)' }}>
            Нет компаний.{' '}
            <Link href="/admin/companies/new" style={{ color: 'var(--navy)' }}>
              Добавить первую
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
                {['#', 'Название', 'Slug', 'Теги', 'Услуги', 'Действия'].map((h) => (
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
              {companies.map((company, index) => (
                <tr
                  key={company.id}
                  style={{
                    borderBottom:
                      index < companies.length - 1 ? '1px solid var(--gray-border)' : 'none',
                  }}
                  className="admin-table-row"
                >
                  <td
                    style={{
                      padding: '14px 16px',
                      color: 'var(--gray)',
                      fontSize: 13,
                      width: 48,
                    }}
                  >
                    {company.sort_order}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                      {company.name}
                    </div>
                    {company.card_tagline && (
                      <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>
                        {company.card_tagline}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '14px 16px',
                      fontSize: 12,
                      color: 'var(--gray)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {company.slug}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {company.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: 'var(--light-bg)',
                            color: 'var(--navy)',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {company.tags.length > 2 && (
                        <span style={{ fontSize: 11, color: 'var(--gray)', alignSelf: 'center' }}>
                          +{company.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                    {company.services.length} услуг
                    {company.services.length === 1 ? 'а' : 'и'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        href={`/admin/companies/${company.id}/edit`}
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
                        id={company.id}
                        apiPath="/api/admin/companies"
                        label={company.name}
                        redirectTo="/admin/companies"
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
