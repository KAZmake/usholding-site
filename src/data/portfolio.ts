export interface PortfolioProject {
  id: string;
  title: string;
  tag: string;
  location: string;
  builder: string;
  year: string;
  imageSrc: string | null;
  imageAlt: string;
}

// NOTE: Original index.html used base64 SVG placeholders instead of real photos.
// This is a known bug in the source — placeholder images replaced with null
// so that real images can be wired in once available (Phase 2 / Supabase Storage).
// The gradient placeholder rendering is done in PortfolioCard component.
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'azhar',
    title: 'ЖК «Ажар»',
    tag: 'Жилая',
    location: 'г. Уральск',
    builder: 'US Construction',
    year: '2025',
    imageSrc: null,
    imageAlt: 'ЖК «Ажар»',
  },
  {
    id: 'prime-office',
    title: 'Офисный центр «Прайм»',
    tag: 'Коммерческая',
    location: 'Астана',
    builder: 'US Construction',
    year: '2025',
    imageSrc: null,
    imageAlt: 'Офисный центр «Прайм»',
  },
  {
    id: 'logistics-complex',
    title: 'Логистический комплекс',
    tag: 'Промышленная',
    location: 'г. Караганда',
    builder: 'US Industry',
    year: '2025',
    imageSrc: null,
    imageAlt: 'Логистический комплекс',
  },
  {
    id: 'apartments-design',
    title: 'Дизайнерская отделка апартаментов',
    tag: 'Отделка',
    location: 'Астана',
    builder: 'US Prime',
    year: '2025',
    imageSrc: null,
    imageAlt: 'Дизайнерская отделка апартаментов',
  },
  {
    id: 'mfk-central',
    title: 'МФК «Центральный»',
    tag: 'Девелопмент',
    location: 'г. Караганда',
    builder: 'US Development',
    year: 'В работе',
    imageSrc: null,
    imageAlt: 'МФК «Центральный»',
  },
  {
    id: 'new-city',
    title: 'Квартал «Новый город»',
    tag: 'Проектирование',
    location: 'Астана',
    builder: 'US Design',
    year: 'В работе',
    imageSrc: null,
    imageAlt: 'Квартал «Новый город»',
  },
];
