import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product;
  locale: string;
  onAddToQuote?: (productId: string) => void;
}

/**
 * 产品卡片组件
 */
export function ProductCard({ product, locale, onAddToQuote }: ProductCardProps) {
  const t = useTranslations();
  const lang = locale as 'en' | 'zh' | 'ar';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${locale}/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name[lang]}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* 分类徽章 */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">
              {product.category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/${locale}/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name[lang]}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description[lang]}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{t('product.moq')}</span>
          <span className="font-medium">{product.specifications.moq}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1" variant="outline">
          <Link href={`/${locale}/products/${product.id}`}>
            {t('common.viewDetails')}
          </Link>
        </Button>
        {onAddToQuote && (
          <Button
            onClick={() => onAddToQuote(product.id)}
            className="flex-1"
          >
            {t('common.addToQuote')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
