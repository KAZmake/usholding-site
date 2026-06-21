'use client';

import { useState } from 'react';
import { companies } from '@/data/companies';
import type { Company } from '@/data/companies';
import { CompanyCard } from './CompanyCard';
import { CompanyModal } from './CompanyModal';

export function Companies() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <>
      <section
        id="companies"
        style={{
          padding: '90px 60px',
          background: 'var(--white)',
        }}
        className="companies-section"
      >
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 50,
          }}
          className="companies-head"
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--orange)',
                marginBottom: 14,
              }}
            >
              Структура группы
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-family-serif)',
                fontSize: 'clamp(30px,4vw,50px)',
                fontWeight: 600,
                color: 'var(--navy)',
                lineHeight: 1.15,
                marginBottom: 14,
              }}
            >
              Наши компании
            </h2>
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: 'var(--text-light)',
              maxWidth: 320,
            }}
          >
            Нажмите на карточку для подробной информации
          </p>
        </div>

        {/* Companies grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 1,
            background: 'var(--gray-border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
          className="companies-grid"
        >
          {companies.map((company) => (
            <CompanyCard key={company.key} company={company} onClick={setSelectedCompany} />
          ))}
        </div>
      </section>

      {/* Modal */}
      <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />

      <style>{`
        @media (max-width: 1100px) {
          .companies-section {
            padding: 60px 24px !important;
          }
          .companies-grid {
            grid-template-columns: repeat(2,1fr) !important;
          }
          .companies-head {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 640px) {
          .companies-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
