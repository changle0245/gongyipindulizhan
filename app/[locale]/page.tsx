import { useTranslations } from 'next-intl';
import { getAllProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();
  const products = getAllProducts();
  const categories = getCategories();

  // 每个分类显示最多4个产品
  const featuredProducts = products.slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-4">
              {t('home.subtitle')}
            </p>
            <p className="text-lg text-zinc-400 mb-8">
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-zinc-900 hover:bg-zinc-100">
                <Link href={`/${locale}/products`}>
                  {t('common.products')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href={`/${locale}/contact`}>
                  {t('common.contact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.browseByCategory')}</h2>
            <p className="text-zinc-600">{t('home.allCategories')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-zinc-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 rounded-full flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                    <span className="text-2xl group-hover:text-white">🏺</span>
                  </div>
                  <h3 className="font-semibold mb-2">
                    {category.name[locale as 'en' | 'zh' | 'ar']}
                  </h3>
                  <p className="text-sm text-zinc-600 line-clamp-2">
                    {category.description[locale as 'en' | 'zh' | 'ar']}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('home.featuredProducts')}</h2>
              <p className="text-zinc-600">
                {products.length}+ {t('common.products')}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/${locale}/products`}>
                {t('common.viewDetails')}
              </Link>
            </Button>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-zinc-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-zinc-600">No products available yet</p>
              <p className="text-sm text-zinc-500 mt-2">
                Upload products through the admin panel to get started
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Order?
          </h2>
          <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
            Contact us today for a free quote. We&apos;re here to help you find the perfect metal craft products for your needs.
          </p>
          <Button size="lg" asChild className="bg-white text-zinc-900 hover:bg-zinc-100">
            <Link href={`/${locale}/quote`}>
              Request a Quote
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
