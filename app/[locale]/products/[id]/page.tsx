import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAllProducts, getProductById, getProductsByCategory } from '@/lib/data/products';
import { ImageMagnifier } from '@/components/products/image-magnifier';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({
  params: { locale, id }
}: {
  params: { locale: string; id: string }
}) {
  const t = useTranslations();
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const lang = locale as 'en' | 'zh' | 'ar';
  const relatedProducts = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/products`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.products')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image with Magnifier */}
                <div className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                  <ImageMagnifier
                    src={product.images[0]}
                    alt={product.name[lang]}
                    className="w-full"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-md overflow-hidden border border-zinc-200 cursor-pointer hover:border-zinc-400 transition"
                      >
                        <Image
                          src={image}
                          alt={`${product.name[lang]} ${index + 2}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-zinc-100 rounded-lg flex items-center justify-center">
                <span className="text-zinc-400">No Image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.name[lang]}
              </h1>
              <p className="text-lg text-zinc-600">
                {product.description[lang]}
              </p>
            </div>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('product.specifications')}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-zinc-600">
                      {t('product.dimensions')}
                    </span>
                    <span>{product.specifications.dimensions[lang]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-zinc-600">
                      {t('product.material')}
                    </span>
                    <span>{product.specifications.material[lang]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-zinc-600">
                      {t('product.craftsmanship')}
                    </span>
                    <span>{product.specifications.craftsmanship[lang]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-zinc-600">
                      {t('product.price')}
                    </span>
                    <span className="font-semibold">
                      {product.specifications.price}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-zinc-600">
                      {t('product.moq')}
                    </span>
                    <span>{product.specifications.moq}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                {t('product.addToQuoteList')}
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link href={`/${locale}/contact`}>
                  {t('product.contactUs')}
                </Link>
              </Button>
            </div>

            {/* SEO Keywords */}
            {product.seoKeywords && product.seoKeywords.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-600 mb-2">
                  Keywords:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.seoKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">
              {t('product.relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
