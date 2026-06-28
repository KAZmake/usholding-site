import { PortfolioForm } from '@/components/admin/PortfolioForm';
import Link from 'next/link';

export const metadata = { title: 'Новый проект | Админ | US Holding' };

export default function NewPortfolioPage() {
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
          marginBottom: 28,
        }}
      >
        Новый проект
      </h1>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '32px 36px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-border)',
        }}
      >
        <PortfolioForm mode="create" />
      </div>
    </div>
  );
}
