'use client';

import { useState, FormEvent } from 'react';

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? 'bce70d0b-dc4c-405a-90f4-09c84959d4a0';

const directions = [
  'US Holding — общие вопросы',
  'US Development — девелопмент',
  'US Capital — инвестиции',
  'US Academy — корпоративный университет',
  'US Project — проектирование',
  'US Design — дизайн и ландшафт',
  'US Quality — контроль качества',
  'US Construction — генеральный подряд',
  'US Engineering — инфраструктура',
  'US Systems — инженерные системы',
  'US Industry — промышленное строительство',
  'US Prime — фит-аут и отделка',
  'US Trade — снабжение',
  'US Logistics — механизация и логистика',
  'US Sales — продажи и аренда',
  'US Media — маркетинг и PR',
  'US Service — управление объектами',
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);

    const data = new FormData(form);
    const body: Record<string, string> = {};
    data.forEach((value, key) => {
      if (typeof value === 'string') body[key] = value;
    });
    body['access_key'] = WEB3FORMS_KEY;
    body['subject'] = 'Новая заявка с сайта US Holding';
    body['from_name'] = 'US Holding Site';

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert(
        'Произошла ошибка. Пожалуйста, попробуйте ещё раз или напишите нам на info@usholding.kz',
      );
    }
  }

  return (
    <section
      id="contact"
      style={{
        padding: '90px 60px',
        background: 'var(--white)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'start',
      }}
      className="contact-section"
    >
      {/* Left: contact details */}
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
          Контакты
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
          Обсудим ваш проект
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'var(--text-light)',
            maxWidth: 600,
          }}
        >
          Расскажите о задаче — предложим комплексное решение силами наших компаний
        </p>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {[
            {
              label: 'Головной офис',
              val: 'Казахстан, г. Караганда, пр. Абдирова, строение 32/1, офис 203',
              sub: null,
            },
            {
              label: 'Email',
              val: 'info@usholding.kz',
              sub: null,
              href: 'mailto:info@usholding.kz',
            },
            {
              label: 'Телефон',
              val: '+7 (700) 000-00-00',
              sub: null,
            },
            {
              label: 'Режим работы',
              val: 'Пн–Пт: 09:00 — 18:00',
              sub: 'По предварительной записи',
            },
          ].map(({ label, val, sub, href }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.15em',
                  textTransform: 'uppercase',
                  color: 'var(--orange)',
                  marginBottom: 5,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>
                {href ? (
                  <a href={href} style={{ color: 'var(--navy)', textDecoration: 'none' }}>
                    {val}
                  </a>
                ) : (
                  val
                )}
              </div>
              {sub && <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 2 }}>{sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div
        style={{
          background: 'var(--off-white)',
          borderRadius: 18,
          padding: 44,
        }}
        className="cform-box"
      >
        <h3
          style={{
            fontFamily: 'var(--font-family-serif)',
            fontSize: 26,
            color: 'var(--navy)',
            marginBottom: 28,
            fontWeight: 400,
          }}
        >
          Оставить заявку
        </h3>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <div
              style={{
                fontFamily: 'var(--font-family-serif)',
                fontSize: 26,
                color: 'var(--navy)',
                marginBottom: 10,
              }}
            >
              Заявка отправлена!
            </div>
            <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.7 }}>
              Наш менеджер свяжется с вами в течение 1 рабочего дня.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}
              className="frow"
            >
              <div>
                <label style={labelStyle}>Имя *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  required
                  style={inputStyle}
                  className="form-input"
                />
              </div>
              <div>
                <label style={labelStyle}>Компания</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Название компании"
                  style={inputStyle}
                  className="form-input"
                />
              </div>
            </div>

            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}
              className="frow"
            >
              <div>
                <label style={labelStyle}>Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (___) ___-__-__"
                  required
                  style={inputStyle}
                  className="form-input"
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  style={inputStyle}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Направление</label>
              <select name="direction" style={inputStyle} className="form-input">
                <option value="">Выберите компанию группы</option>
                {directions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Сообщение</label>
              <textarea
                name="message"
                placeholder="Опишите ваш проект..."
                style={{ ...inputStyle, height: 90, resize: 'vertical' }}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-submit-form"
              style={{
                width: '100%',
                padding: 14,
                background: 'var(--navy)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontFamily: 'var(--font-family-sans)',
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all .3s',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .form-input:focus {
          border-color: var(--navy) !important;
          outline: none;
        }
        .btn-submit-form:hover:not(:disabled) {
          background: var(--navy-dark) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 1100px) {
          .contact-section {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 60px 24px !important;
          }
        }
        @media (max-width: 640px) {
          .frow {
            grid-template-columns: 1fr !important;
          }
          .cform-box {
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-light)',
  marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1.5px solid var(--gray-border)',
  background: '#fff',
  fontFamily: 'var(--font-family-sans)',
  fontSize: 13,
  color: 'var(--text)',
  transition: 'border-color .2s',
  outline: 'none',
  boxSizing: 'border-box',
};
