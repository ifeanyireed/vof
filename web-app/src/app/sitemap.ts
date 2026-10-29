import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vonf.org';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/about',
    '/programs',
    '/donate',
    '/contact',
    '/volunteer',
    '/apply',
    '/apply/scholarship',
    '/apply/skills',
    '/outreach-reports',
    '/financial-reports',
    '/gallery',
    '/blog',
    '/support',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/blog' || route === '/donate' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/donate' || route === '/about' || route === '/programs' ? 0.9 : 0.8,
  }));
}
