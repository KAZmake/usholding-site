import type { PortfolioProject } from '@/data/portfolio';

interface PortfolioCardProps {
  project: PortfolioProject;
}

// Gradient placeholder colors per project index (replacing base64 SVG placeholders from original)
const placeholderGradients = [
  'linear-gradient(135deg,#122952 0%,#1B3A6B 100%)',
  'linear-gradient(135deg,#1B3A6B 0%,#234987 100%)',
  'linear-gradient(135deg,#122952 0%,#2E5FA3 100%)',
  'linear-gradient(135deg,#234987 0%,#1B3A6B 100%)',
  'linear-gradient(135deg,#1B3A6B 0%,#122952 100%)',
  'linear-gradient(135deg,#2E5FA3 0%,#234987 100%)',
];

const projectIndexMap: Record<string, number> = {
  azhar: 0,
  'prime-office': 1,
  'logistics-complex': 2,
  'apartments-design': 3,
  'mfk-central': 4,
  'new-city': 5,
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  const gradientIndex = projectIndexMap[project.id] ?? 0;
  const gradient = placeholderGradients[gradientIndex];

  return (
    <div
      className="pcard-item"
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        background: '#fff',
        transition: 'all .3s',
        cursor: 'pointer',
      }}
    >
      {/* Image / placeholder */}
      <div
        style={{
          height: 200,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient placeholder (original used base64 SVG — replaced with CSS gradient) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform .4s',
          }}
          className="pcard-placeholder"
          aria-label={project.imageAlt}
        >
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {project.title}
          </div>
        </div>

        {/* Category tag */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'var(--orange)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {project.tag}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: 8,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--gray)',
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <span>📍 {project.location}</span>
          <span>🏗 {project.builder}</span>
          <span>{project.year}</span>
        </div>
      </div>

      <style>{`
        .pcard-item:hover {
          transform: translateY(-5px) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        .pcard-item:hover .pcard-placeholder {
          transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  );
}
