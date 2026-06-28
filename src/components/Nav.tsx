'use client';

import Image from 'next/image';
import Link from 'next/link';

// Nav is client component because future Clerk auth state will be read here.
// For now it renders the static navigation bar with login button placeholder.

export function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 60px',
        background: 'rgba(255,255,255,0.98)',
        borderBottom: '1px solid var(--gray-border)',
        boxShadow: '0 2px 16px rgba(27,58,107,0.08)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <Image
          src="/logo/US Holding.svg"
          alt="US Holding"
          width={120}
          height={38}
          style={{ height: 38, width: 'auto', display: 'block' }}
          priority
        />
      </Link>

      {/* Nav links */}
      <ul
        style={{
          display: 'flex',
          gap: 4,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
        className="nav-links-list"
      >
        {[
          { href: '#about', label: 'О холдинге' },
          { href: '#companies', label: 'Компании' },
          { href: '#portfolio', label: 'Портфолио' },
          { href: '#why', label: 'Преимущества' },
          { href: '#contact', label: 'Контакты' },
        ].map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                color: 'var(--text-light)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all .2s',
                display: 'block',
              }}
              className="nav-link-item"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Mail button */}
        <a
          href="https://outlook.office.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Корпоративная почта"
          className="btn-mail-nav"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 18px',
            borderRadius: 8,
            background: 'var(--light-bg)',
            border: '1.5px solid var(--gray-border)',
            color: 'var(--navy)',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all .2s',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 14 }}>✉</span> Почта
        </a>

        {/* Login button (placeholder — Clerk replaces this in Phase 3) */}
        <button
          className="btn-login"
          style={{
            padding: '9px 20px',
            borderRadius: 8,
            border: '1.5px solid var(--navy)',
            background: 'transparent',
            color: 'var(--navy)',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onClick={() => {
            // Phase 3: replace with Clerk redirectToSignIn
          }}
        >
          Войти
        </button>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .nav-links-list { display: none !important; }
        }
        .nav-link-item:hover {
          background: var(--light-bg);
          color: var(--navy);
        }
        .btn-mail-nav:hover {
          background: var(--navy) !important;
          color: #fff !important;
          border-color: var(--navy) !important;
        }
        .btn-login:hover {
          background: var(--navy) !important;
          color: #fff !important;
        }
      `}</style>
    </nav>
  );
}
