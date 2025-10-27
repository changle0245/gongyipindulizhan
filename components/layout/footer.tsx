import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();

  const quickLinks = [
    { name: t('common.home'), href: `/${locale}` },
    { name: t('common.products'), href: `/${locale}/products` },
    { name: t('common.categories'), href: `/${locale}/categories` },
    { name: t('common.contact'), href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Metal Crafts
            </h3>
            <p className="text-sm mb-4">
              {t('home.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t('footer.contact')}
            </h3>
            <div className="text-sm space-y-2">
              <p>Email: info@metalcrafts.com</p>
              <p>WeChat: metalcrafts</p>
              <p>WhatsApp: +86 123 4567 8900</p>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
