import { assertAdmin } from '@/lib/admin';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await assertAdmin();

  return (
    <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>
      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          background: 'var(--navy)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Link href="/" style={{ display: 'block', marginBottom: 8 }}>
            <Image
              src="/logo/US Holding.svg"
              alt="US Holding"
              width={110}
              height={34}
              style={{ filter: 'brightness(0) invert(1)', height: 34, width: 'auto' }}
            />
          </Link>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Панель администратора
          </span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {[
            { href: '/admin', label: 'Обзор', icon: '⊞' },
            { href: '/admin/portfolio', label: 'Портфолио', icon: '◈' },
            { href: '/admin/companies', label: 'Компании', icon: '⊡' },
            { href: '/admin/leads', label: 'Заявки', icon: '✉' },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 2,
                transition: 'background 0.15s',
              }}
              className="admin-nav-link"
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <Link
            href="/"
            style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13 }}
          >
            ← На сайт
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: 240,
          minHeight: '100vh',
          padding: '32px 40px',
        }}
      >
        {children}
      </main>

      <style>{`
        .admin-nav-link:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        @media (max-width: 768px) {
          aside { width: 200px !important; }
          main { margin-left: 200px !important; padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
