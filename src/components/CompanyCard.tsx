import Image from 'next/image';
import type { Company } from '@/data/companies';

interface CompanyCardProps {
  company: Company;
  onClick: (company: Company) => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div
      onClick={() => onClick(company)}
      className="cocard-item"
      style={{
        background: '#fff',
        padding: '28px 24px',
        cursor: 'pointer',
        transition: 'all .25s',
        position: 'relative',
        overflow: 'hidden',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(company);
        }
      }}
      aria-label={`Открыть информацию о US ${company.name}`}
    >
      {/* Bottom accent line (appears on hover via CSS) */}
      <div
        className="cocard-accent"
        style={{
          content: "''",
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--orange)',
          transform: 'scaleX(0)',
          transition: 'transform .3s',
          transformOrigin: 'left',
        }}
      />

      {/* Arrow (appears on hover) */}
      <div
        className="cocard-arrow"
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          color: 'var(--orange)',
          fontSize: 16,
          opacity: 0,
          transform: 'translate(-4px,4px)',
          transition: 'all .25s',
        }}
        aria-hidden="true"
      >
        →
      </div>

      {/* Company logo */}
      <div style={{ marginBottom: 14 }}>
        <Image
          src={company.logoFile}
          alt={`US ${company.name}`}
          width={160}
          height={48}
          style={{
            width: 'auto',
            maxWidth: '100%',
            maxHeight: 48,
            objectFit: 'contain',
            objectPosition: 'left center',
            display: 'block',
          }}
        />
      </div>

      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '.15em',
          textTransform: 'uppercase',
          color: 'var(--gray-light)',
          marginBottom: 10,
          display: 'block',
        }}
      >
        {company.cardTagline}
      </span>

      <p
        style={{
          fontSize: 12,
          lineHeight: 1.7,
          color: 'var(--gray)',
          margin: 0,
        }}
      >
        {company.cardDesc}
      </p>

      <style>{`
        .cocard-item:hover {
          background: var(--light-bg) !important;
        }
        .cocard-item:hover .cocard-accent {
          transform: scaleX(1) !important;
        }
        .cocard-item:hover .cocard-arrow {
          opacity: 1 !important;
          transform: translate(0,0) !important;
        }
      `}</style>
    </div>
  );
}
