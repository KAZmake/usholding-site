import { CompanyForm } from '@/components/admin/CompanyForm';
import Link from 'next/link';

export const metadata = { title: 'Новая компания | Админ | US Holding' };

export default function NewCompanyPage() {
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
          marginBottom: 28,
        }}
      >
        Новая компания
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
        <CompanyForm mode="create" />
      </div>
    </div>
  );
}
