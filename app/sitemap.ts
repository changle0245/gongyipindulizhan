import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import { locales } from '@/i18n/request';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const products = getAllProducts();
  const categories = getCategories();

  const routes: MetadataRoute.Sitemap = [];

  // Add home pages for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
  });

  // Add product pages for each locale
  products.forEach((product) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/products/${product.id}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Add category pages for each locale
  categories.forEach((category) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // Add other pages
  locales.forEach((locale) => {
    routes.push(
      {
        url: `${baseUrl}/${locale}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/${locale}/quote`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      }
    );
  });

  return routes;
}
