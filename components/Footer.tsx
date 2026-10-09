import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiArrowRight, FiFacebook, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const { language } = useAppStore();
  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);
  const t = translations[language];

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          const slugToKey: Record<string, string> = {
            herbs: t.nav.herbs,
            spices: t.nav.spices,
            seeds: t.nav.seeds,
            'dried-flowers': t.nav.driedFlowers,
            'herbal-teas': t.nav.herbalTeas,
            botanicals: t.nav.botanicals,
          };
          setCategories(
            data
              .filter((c: any) => c.is_active !== false)
              .map((c: any) => ({
                id: c._id || c.id,
                order: c.order ?? 0,
                slug: c.slug,
                label: slugToKey[c.slug] || (language === 'en' ? c.name_en : c.name_ar),
              }))
              .sort((a: any, b: any) => a.order - b.order)
          );
        }
      } catch {
        // fallback silently
      }
    })();
  }, [language]);

  const footerText = {
    eyebrow: language === 'en' ? 'Global Botanical Trade' : 'التجارة النباتية العالمية',
    headline:
      language === 'en'
        ? 'Premium botanical updates, sourcing notes, and product releases.'
        : 'تحديثات نباتية فاخرة وملاحظات توريد وإصدارات منتجات جديدة.',
    emailPlaceholder: language === 'en' ? 'Your corporate email address' : 'البريد الإلكتروني للشركة',
    subscribe: language === 'en' ? 'Subscribe' : 'اشترك',
    intro:
      language === 'en'
        ? 'Exporting premium herbs, spices, seeds, and botanical ingredients with careful sourcing, strict quality control, and professional international handling.'
        : 'نصدر أعشابًا وتوابل وبذورًا ومكونات نباتية فاخرة مع توريد دقيق ورقابة صارمة على الجودة وتعامل دولي احترافي.',
    tagline: language === 'en' ? 'From Egyptian farms to global markets.' : 'من المزارع المصرية إلى الأسواق العالمية.',
    products: language === 'en' ? 'Categories' : 'الفئات',
    company: language === 'en' ? 'Company' : 'الشركة',
    contact: language === 'en' ? 'Contact' : t.nav.contact,
    rights: language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.',
    terms: language === 'en' ? 'Terms' : 'الشروط',
    privacy: language === 'en' ? 'Privacy' : 'الخصوصية',
    faqs: language === 'en' ? 'FAQs' : 'الأسئلة الشائعة',
  };

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      role="contentinfo"
      className={`w-full bg-surface-container-lowest text-on-surface border-t border-outline-variant/30 ${language === 'ar' ? 'rtl' : ''}`}
    >
      <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl lg:py-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand Info (4 cols) */}
          <div className="flex flex-col lg:col-span-4">
            <Link href="/" className="mb-space-md flex items-center gap-space-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary font-bold">
                <span className="font-headline-sm text-[20px] tracking-tight">OH</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm leading-none text-on-surface tracking-tight">
                  HerboJet
                </span>
                <span className="mt-0.5 font-label-sm text-label-sm uppercase tracking-widest text-primary">
                  Botanicals Egypt
                </span>
              </div>
            </Link>
            <p className="mb-space-md font-body-md text-body-md text-on-surface-variant md:max-w-sm">
              {footerText.intro}
            </p>
            <p className="mb-space-lg font-label-md text-label-md text-primary">
              {footerText.tagline}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: FiFacebook, href: '#' },
                { Icon: FiTwitter, href: '#' },
                { Icon: FiInstagram, href: '#' },
                { Icon: FiLinkedin, href: '#' },
                { Icon: FaTiktok, href: '#' },
              ].map(({ Icon, href }, index) => (
                <a key={index} href={href} className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories (3 cols) */}
          <div className="flex flex-col lg:col-span-3">
            <h4 className="mb-space-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              {footerText.products}
            </h4>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.id}`} className="font-label-lg text-label-lg text-on-surface transition-colors hover:text-primary">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company (2 cols) */}
          <div className="flex flex-col lg:col-span-2">
            <h4 className="mb-space-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              {footerText.company}
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="font-label-lg text-label-lg text-on-surface transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact (3 cols) */}
          <div className="flex flex-col lg:col-span-3">
            <h4 className="mb-space-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              {footerText.contact}
            </h4>
            <ul className="flex flex-col gap-4 font-body-sm text-body-sm text-on-surface">
              <li className="flex gap-3">
                <FiMapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{language === 'en' ? 'Kafr Bani Ali – Samasta Center – Beni Suef Governorate – Egypt' : 'كفر بني علي – مركز سمسطا – محافظة بني سويف – مصر'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 shrink-0 text-primary" />
                <span>+20 155 319 0955</span>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="h-5 w-5 shrink-0 text-primary" />
                <a href="https://wa.me/201553190955" className="transition-colors hover:text-primary">+20 155 319 0955</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="h-5 w-5 shrink-0 text-primary" />
                <a href="mailto:info@organicherbseg.com" className="transition-colors hover:text-primary">info@organicherbseg.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-space-xl flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-space-md font-body-sm text-body-sm text-on-surface-variant md:flex-row">
          <p>&copy; {new Date().getFullYear()} Organic Herbs Co. {footerText.rights}</p>
          <div className="flex items-center gap-space-md">
            <Link href="/" className="transition-colors hover:text-primary">{footerText.terms}</Link>
            <Link href="/" className="transition-colors hover:text-primary">{footerText.privacy}</Link>
            <Link href="/" className="transition-colors hover:text-primary">{footerText.faqs}</Link>
          </div>
        </div>
        
      </div>
    </motion.footer>
  );
};

export default Footer;
