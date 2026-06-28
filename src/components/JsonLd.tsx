import { companies } from '@/data/companies';

/**
 * JSON-LD structured data for the Organization schema.
 * Sub-organizations are derived from the canonical companies data source
 * so there is a single source of truth — no manual duplication.
 */
export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://usholding.kz/#organization',
    name: 'US Holding',
    alternateName: 'USH',
    url: 'https://usholding.kz',
    logo: 'https://usholding.kz/logo/US%20Holding.svg',
    description:
      'US Holding — вертикально интегрированная группа из 17 компаний, охватывающих полный цикл строительства и управления недвижимостью в Казахстане.',
    foundingDate: '2014',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Астана',
      addressRegion: 'Казахстан',
      addressCountry: 'KZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://usholding.kz/#contact',
    },
    subOrganization: companies.map((company) => ({
      '@type': 'Organization',
      name: `US ${company.name}`,
      description: company.tagline,
      logo: `https://usholding.kz${company.logoFile}`,
      parentOrganization: {
        '@id': 'https://usholding.kz/#organization',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
