'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  { src: '/images/astana.jpg', alt: 'Здание' },
  { src: '/images/start1.jpg', alt: 'Стройка' },
  { src: '/images/start2.jpg', alt: 'Проектирование' },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '100px 60px 60px',
        background:
          'linear-gradient(135deg,var(--navy-dark) 0%,var(--navy) 55%,var(--navy-mid) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="hero-section"
    >
      {/* Background texture image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/astana.jpg"
          alt=""
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
          priority
          sizes="100vw"
          aria-hidden="true"
        />
      </div>

      {/* Radial gradient overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 15% 85%,rgba(232,146,58,.18) 0%,transparent 50%),radial-gradient(circle at 85% 15%,rgba(255,255,255,.04) 0%,transparent 50%)',
          zIndex: 0,
        }}
      />

      {/* Left: content */}
      <div style={{ position: 'relative', zIndex: 1 }} className="hero-content-block">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(232,146,58,.15)',
            border: '1px solid rgba(232,146,58,.4)',
            color: 'var(--orange-light)',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            marginBottom: 28,
            animation: 'fadeUp .8s .2s ease both',
          }}
        >
          ⬡ Группа компаний · Астана, Казахстан
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: 'clamp(40px,5vw,70px)',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 24,
            animation: 'fadeUp .8s .4s ease both',
          }}
        >
          Строим
          <br />
          <span style={{ color: 'var(--orange-light)' }}>будущее</span>
          <br />
          сегодня
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,.75)',
            maxWidth: 480,
            marginBottom: 40,
            animation: 'fadeUp .8s .6s ease both',
          }}
        >
          US Holding — вертикально интегрированная группа из 17 компаний, охватывающих полный цикл
          строительства и управления недвижимостью.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            animation: 'fadeUp .8s .8s ease both',
          }}
        >
          <a
            href="#companies"
            className="btn-hp"
            style={{
              padding: '14px 30px',
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontFamily: 'var(--font-family-sans)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all .3s',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Наши компании
          </a>
          <a
            href="#contact"
            className="btn-hg"
            style={{
              padding: '14px 30px',
              background: 'rgba(255,255,255,.1)',
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,.3)',
              borderRadius: 8,
              fontFamily: 'var(--font-family-sans)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .3s',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Обсудить проект
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 56,
            animation: 'fadeUp .8s 1s ease both',
          }}
          className="hero-stats"
        >
          {[
            { num: '17', label: 'Направлений' },
            { num: '360°', label: 'Покрытие цикла' },
            { num: '2014', label: 'Год основания' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontSize: 40,
                  fontWeight: 600,
                  color: 'var(--orange-light)',
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: image carousel */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          paddingLeft: 40,
          animation: 'fadeUp .8s .5s ease both',
        }}
        className="hero-visual-block"
      >
        {/* Main large image */}
        <div
          style={{
            width: '100%',
            height: 300,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === current ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 100vw, 50vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Two smaller images below */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginTop: 14,
          }}
        >
          <div
            style={{
              height: 150,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              position: 'relative',
            }}
          >
            <Image
              src="/images/start1.jpg"
              alt="Стройка"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1100px) 50vw, 25vw"
            />
          </div>
          <div
            style={{
              height: 150,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              position: 'relative',
            }}
          >
            <Image
              src="/images/start2.jpg"
              alt="Проектирование"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1100px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Active projects badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 178,
            left: 60,
            background: '#fff',
            borderRadius: 10,
            padding: '10px 18px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              background: '#22C55E',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--navy)',
            }}
          >
            Активные проекты
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-hp:hover {
          background: var(--orange-dark) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(232,146,58,.4);
        }
        .btn-hg:hover {
          background: rgba(255,255,255,.2) !important;
        }
        @media (max-width: 1100px) {
          .hero-section {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 60px !important;
          }
          .hero-visual-block {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hero-stats {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
