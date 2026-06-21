import { portfolioProjects } from '@/data/portfolio';
import { PortfolioCard } from './PortfolioCard';

export function Portfolio() {
  return (
    <section
      id="portfolio"
      style={{
        padding: '90px 60px',
        background: 'var(--off-white)',
      }}
      className="portfolio-section"
    >
      {/* Section header */}
      <div style={{ textAlign: 'center' }}>
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
          Наши работы
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
          Портфолио проектов
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'var(--text-light)',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Реализованные и текущие объекты группы компаний
        </p>
      </div>

      {/* Projects grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 22,
          marginTop: 50,
        }}
        className="portfolio-grid"
      >
        {portfolioProjects.map((project) => (
          <PortfolioCard key={project.id} project={project} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .portfolio-section {
            padding: 60px 24px !important;
          }
          .portfolio-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
