import Image from 'next/image';

const footerColumns = [
  {
    heading: 'Стратегическое управление и развитие',
    links: [
      { label: 'US Holding', key: 'holding' },
      { label: 'US Development', key: 'development' },
      { label: 'US Capital', key: 'capital' },
      { label: 'US Academy', key: 'academy' },
    ],
  },
  {
    heading: 'Проектирование и контроль качества',
    links: [
      { label: 'US Project', key: 'project' },
      { label: 'US Design', key: 'design' },
      { label: 'US Quality', key: 'quality' },
    ],
  },
  {
    heading: 'Строительство, инженерия и снабжение',
    links: [
      { label: 'US Construction', key: 'construction' },
      { label: 'US Engineering', key: 'engineering' },
      { label: 'US Systems', key: 'systems' },
      { label: 'US Industry', key: 'industry' },
      { label: 'US Prime', key: 'prime' },
      { label: 'US Trade', key: 'trade' },
      { label: 'US Logistics', key: 'logistics' },
    ],
  },
  {
    heading: 'Продажи, маркетинг и сервис',
    links: [
      { label: 'US Sales', key: 'sales' },
      { label: 'US Media', key: 'media' },
      { label: 'US Service', key: 'service' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--navy-dark)',
        padding: '56px 60px',
      }}
      className="footer-section"
    >
      {/* Top grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 44,
        }}
        className="footer-top"
      >
        {/* Logo + tagline */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <Image
              src="/logo/US Holding-footer.svg"
              alt="US Holding"
              width={160}
              height={40}
              style={{ height: 40, width: 'auto', display: 'block' }}
            />
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,.5)',
              lineHeight: 1.7,
              maxWidth: 260,
              margin: 0,
            }}
          >
            Вертикально интегрированная группа компаний полного цикла строительства и управления
            недвижимостью.
          </p>
        </div>

        {/* Link columns */}
        {footerColumns.map(({ heading, links }) => (
          <div key={heading}>
            <h5
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: 'var(--orange)',
                marginBottom: 18,
                margin: '0 0 18px',
              }}
            >
              {heading}
            </h5>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
              }}
            >
              {links.map(({ label }) => (
                <li key={label}>
                  <a
                    href="#companies"
                    className="footer-link"
                    style={{
                      color: 'rgba(255,255,255,.6)',
                      textDecoration: 'none',
                      fontSize: 13,
                      transition: 'color .2s',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,.1)',
          paddingTop: 26,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="footer-bottom"
      >
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,.4)',
          }}
        >
          © 2014–2026 US Holding. Все права защищены.
        </div>
        <div style={{ display: 'flex', gap: 22 }}>
          {[
            { label: 'Конфиденциальность', href: '#' },
            { label: 'Условия', href: '#' },
            { label: 'Контакты', href: '#contact' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="footer-link"
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,.4)',
                textDecoration: 'none',
                transition: 'color .2s',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: rgba(255,255,255,.8) !important;
        }
        @media (max-width: 1100px) {
          .footer-section {
            padding: 36px 24px !important;
          }
          .footer-top {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-top {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 14px !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
