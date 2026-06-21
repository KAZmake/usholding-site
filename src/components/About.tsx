import Image from 'next/image';

export function About() {
  const values = [
    {
      icon: '🔗',
      title: 'Полная интеграция',
      desc: '17 компаний работают как единый механизм',
    },
    {
      icon: '💎',
      title: 'Контроль качества',
      desc: 'Собственный технадзор на каждом объекте',
    },
    {
      icon: '⚡',
      title: 'Оперативность',
      desc: 'Оптимизированная логистика и снабжение',
    },
    {
      icon: '🏆',
      title: 'Надёжность',
      desc: 'Полная ответственность перед клиентом',
    },
  ];

  return (
    <section
      id="about"
      style={{
        padding: '90px 60px',
        background: 'var(--off-white)',
      }}
      className="about-section"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
        className="about-grid"
      >
        {/* Left: images */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}
          className="about-imgs"
        >
          {/* Tall left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                height: 440,
              }}
            >
              <Image
                src="/images/holding1.jpg"
                alt="Объект строительства"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 0vw, 25vw"
              />
            </div>
          </div>

          {/* Right column — two images stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                height: 210,
              }}
            >
              <Image
                src="/images/holding2.jpg"
                alt="Офис"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 0vw, 25vw"
              />
            </div>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                height: 210,
              }}
            >
              <Image
                src="/images/holding3.webp"
                alt="Проект"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 0vw, 25vw"
              />
            </div>
          </div>
        </div>

        {/* Right: text content */}
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
            О холдинге
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
            Единая экосистема строительства
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.9,
              color: 'var(--text-light)',
              margin: '22px 0 28px',
            }}
          >
            US Holding объединяет 17 специализированных компаний, охватывающих весь жизненный цикл
            объекта — от поиска земли до управления готовой недвижимостью.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.9,
              color: 'var(--text-light)',
              margin: '0 0 28px',
            }}
          >
            Вертикальная интеграция позволяет контролировать качество на каждом этапе,
            оптимизировать сроки и предлагать клиентам комплексное решение под одной крышей.
          </p>

          {/* Values grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
            }}
            className="avals-grid"
          >
            {values.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="aval-card"
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 18,
                  border: '1px solid var(--gray-border)',
                  transition: 'all .3s',
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', marginBottom: 5 }}
                >
                  {title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .aval-card:hover {
          border-color: var(--orange) !important;
          box-shadow: var(--shadow) !important;
        }
        @media (max-width: 1100px) {
          .about-section {
            padding: 60px 24px !important;
          }
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .about-imgs {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .avals-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
