'use client';

import { useEffect } from 'react';
import type { Company } from '@/data/companies';

interface CompanyModalProps {
  company: Company | null;
  onClose: () => void;
}

export function CompanyModal({ company, onClose }: CompanyModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (company) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [company]);

  if (!company) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(18,41,82,.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`US ${company.name}`}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          maxWidth: 660,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'modalIn .3s ease',
          boxShadow: '0 24px 80px rgba(18,41,82,.25)',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%)',
            padding: '36px 44px 28px',
            borderRadius: '18px 18px 0 0',
            position: 'relative',
          }}
          className="modal-head-responsive"
        >
          {/* Company logo mark */}
          <div
            style={{
              width: 52,
              height: 52,
              background: '#fff',
              borderRadius: 11,
              border: '2.5px solid var(--orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--navy)',
              fontWeight: 800,
              fontSize: 15,
              marginBottom: 18,
            }}
          >
            US
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(232,146,58,.9)',
              marginBottom: 7,
            }}
          >
            {company.label}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-family-serif)',
              fontSize: 40,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            <span style={{ color: 'var(--orange-light)' }}>US</span> {company.name}
          </div>

          <div
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,.65)',
              marginTop: 8,
            }}
          >
            {company.tagline}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="modal-close-btn"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.2)',
              color: '#fff',
              width: 34,
              height: 34,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
              transition: 'all .2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '36px 44px 44px' }} className="modal-body-responsive">
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: 'var(--text-light)',
              marginBottom: 28,
            }}
          >
            {company.desc}
          </p>

          <div>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--orange)',
                marginBottom: 18,
              }}
            >
              Услуги и компетенции
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 9,
                padding: 0,
                margin: 0,
              }}
              className="svc-list-responsive"
            >
              {company.svc.map((service) => (
                <li
                  key={service}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-light)',
                    padding: '9px 14px 9px 32px',
                    background: 'var(--off-white)',
                    borderRadius: 7,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 11,
                      color: 'var(--orange)',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.95) translateY(14px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,.2) !important;
        }
        @media (max-width: 640px) {
          .modal-head-responsive {
            padding: 22px !important;
          }
          .modal-body-responsive {
            padding: 20px !important;
          }
          .svc-list-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
