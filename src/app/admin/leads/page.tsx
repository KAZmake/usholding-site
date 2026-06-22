import { createSupabaseAdmin } from '@/lib/supabase/server';
import { LeadStatusSelect } from '@/components/admin/LeadStatusSelect';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { Database } from '@/lib/supabase/types';

export const metadata = { title: 'Заявки | Админ | US Holding' };

type Lead = Database['public']['Tables']['leads']['Row'];

const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function getLeads(page: number, status?: string) {
  const supabase = createSupabaseAdmin();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status && ['new', 'in_progress', 'closed'].includes(status)) {
    query = query.eq('status', status as Lead['status']);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return { leads: [], total: 0, totalPages: 0 };
  }

  return {
    leads: data ?? [],
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const status = sp.status;

  const { leads, total, totalPages } = await getLeads(page, status);

  const newCount = leads.filter((l) => l.status === 'new').length;

  const filterLinks: Array<{ label: string; value: string | undefined }> = [
    { label: 'Все', value: undefined },
    { label: 'Новые', value: 'new' },
    { label: 'В работе', value: 'in_progress' },
    { label: 'Закрытые', value: 'closed' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: 26,
            color: 'var(--navy)',
            marginBottom: 4,
          }}
        >
          Заявки
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: 14 }}>
          {total} заяв{total === 1 ? 'ка' : 'ок'} всего
          {newCount > 0 && (
            <span
              style={{
                marginLeft: 8,
                padding: '2px 10px',
                borderRadius: 20,
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {newCount} новых
            </span>
          )}
        </p>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {filterLinks.map(({ label, value }) => {
          const isActive = status === value || (!status && !value);
          const href = value ? `/admin/leads?status=${value}` : '/admin/leads';
          return (
            <a
              key={label}
              href={href}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                background: isActive ? 'var(--navy)' : '#fff',
                color: isActive ? '#fff' : 'var(--text-light)',
                border: '1px solid',
                borderColor: isActive ? 'var(--navy)' : 'var(--gray-border)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </a>
          );
        })}
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
        {leads.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--gray)' }}>
            Нет заявок по выбранному фильтру
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
                {['Дата', 'Имя', 'Email', 'Телефон', 'Сообщение', 'Статус', ''].map((h) => (
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
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => {
                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom:
                        index < leads.length - 1 ? '1px solid var(--gray-border)' : 'none',
                    }}
                    className="admin-table-row"
                  >
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 12,
                        color: 'var(--gray)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatDate(lead.created_at)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                        {lead.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                      <a
                        href={`mailto:${lead.email}`}
                        style={{ color: 'var(--navy)', textDecoration: 'none' }}
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: 'var(--text-light)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {lead.phone ?? '—'}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        fontSize: 13,
                        color: 'var(--text-light)',
                        maxWidth: 300,
                      }}
                    >
                      <div
                        style={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {lead.message}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <LeadStatusSelect id={lead.id} status={lead.status} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <DeleteButton
                        id={lead.id}
                        apiPath="/api/admin/leads"
                        label={`${lead.name} — ${lead.email}`}
                        redirectTo={`/admin/leads${status ? `?status=${status}` : ''}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/leads?page=${p}${status ? `&status=${status}` : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                background: p === page ? 'var(--navy)' : '#fff',
                color: p === page ? '#fff' : 'var(--text-light)',
                border: '1px solid',
                borderColor: p === page ? 'var(--navy)' : 'var(--gray-border)',
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .admin-table-row:hover { background: var(--off-white); }
      `}</style>
    </div>
  );
}
