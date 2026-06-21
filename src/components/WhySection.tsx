const advantages = [
  {
    num: '01',
    icon: '🔗',
    title: 'Полный цикл',
    text: 'От поиска земли до управления объектом — одна группа, одна ответственность.',
  },
  {
    num: '02',
    icon: '💎',
    title: 'Собственный QA/QC',
    text: 'US Quality работает независимо от строительного подразделения на каждом объекте.',
  },
  {
    num: '03',
    icon: '⚡',
    title: 'Скорость',
    text: 'Собственное снабжение и парк техники исключают простои и ускоряют стройку.',
  },
  {
    num: '04',
    icon: '📊',
    title: 'Прозрачность',
    text: 'US Capital структурирует финансирование и обеспечивает открытую отчётность.',
  },
  {
    num: '05',
    icon: '🏗️',
    title: 'Любая сложность',
    text: 'Жильё, офисы, промышленные объекты — реализуем проекты любого масштаба.',
  },
  {
    num: '06',
    icon: '🤝',
    title: 'Долгосрочно',
    text: 'US Service и US Sales сопровождают объект после сдачи — мы с вами навсегда.',
  },
];

export function WhySection() {
  return (
    <section
      id="why"
      style={{
        padding: '90px 60px',
        background: 'var(--navy)',
      }}
      className="why-section"
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--orange-light)',
            marginBottom: 14,
          }}
        >
          Преимущества
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: 'clamp(30px,4vw,50px)',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          Почему выбирают US Holding
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,.65)',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Мы закрываем весь цикл — от идеи до эксплуатации
        </p>
      </div>

      {/* Advantages grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 22,
          marginTop: 50,
        }}
        className="why-grid"
      >
        {advantages.map(({ num, icon, title, text }) => (
          <div
            key={num}
            className="wcard-item"
            style={{
              background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 14,
              padding: '32px 26px',
              transition: 'all .3s',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-family-serif)',
                fontSize: 44,
                color: 'rgba(232,146,58,.2)',
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              {num}
            </div>
            <span style={{ fontSize: 30, marginBottom: 14, display: 'block' }}>{icon}</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              {title}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,.6)', margin: 0 }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .wcard-item:hover {
          background: rgba(255,255,255,.09) !important;
          border-color: rgba(232,146,58,.4) !important;
        }
        @media (max-width: 1100px) {
          .why-section {
            padding: 60px 24px !important;
          }
          .why-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
