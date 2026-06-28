import { createSupabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'Панель администратора | US Holding' };

async function getStats() {
  const supabase = createSupabaseAdmin();

  const [companiesRes, portfolioRes, leadsRes, newLeadsRes] = await Promise.all([
    supabase.from('companies').select('id', { count: 'exact', head: true }),
    supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  return {
    companies: companiesRes.count ?? 0,
    portfolio: portfolioRes.count ?? 0,
    leads: leadsRes.count ?? 0,
    newLeads: newLeadsRes.count ?? 0,
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Компании',
      value: stats.companies,
      href: '/admin/companies',
      description: 'Направления холдинга',
      color: 'var(--navy)',
    },
    {
      title: 'Портфолио',
      value: stats.portfolio,
      href: '/admin/portfolio',
      description: 'Реализованные проекты',
      color: 'var(--navy-mid)',
    },
    {
      title: 'Заявки',
      value: stats.leads,
      href: '/admin/leads',
      description: `${stats.newLeads} новых`,
      color: stats.newLeads > 0 ? 'var(--orange)' : 'var(--gray)',
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-family-serif)',
          fontSize: 28,
          color: 'var(--navy)',
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        Обзор
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: 32, fontSize: 15 }}>
        Управление контентом сайта US Holding
      </p>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: 'block',
              background: '#fff',
              borderRadius: 12,
              padding: '24px 28px',
              boxShadow: 'var(--shadow)',
              textDecoration: 'none',
              border: '1px solid var(--gray-border)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            className="admin-stat-card"
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: card.color,
                fontFamily: 'var(--font-family-serif)',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              {card.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{card.description}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px 28px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-border)',
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: 16,
          }}
        >
          Быстрые действия
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/portfolio/new" className="admin-action-btn">
            + Добавить проект
          </Link>
          <Link href="/admin/leads" className="admin-action-btn admin-action-btn--secondary">
            Просмотреть заявки
          </Link>
        </div>
      </div>

      <style>{`
        .admin-stat-card:hover {
          box-shadow: var(--shadow-lg) !important;
          transform: translateY(-2px);
        }
        .admin-action-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          border-radius: 8px;
          background: var(--navy);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .admin-action-btn:hover { background: var(--navy-dark) !important; }
        .admin-action-btn--secondary {
          background: var(--light-bg) !important;
          color: var(--navy) !important;
          border: 1.5px solid var(--gray-border);
        }
        .admin-action-btn--secondary:hover {
          background: var(--gray-border) !important;
        }
      `}</style>
    </div>
  );
}
