import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api from '@/lib/api';
import { FiChevronDown, FiGlobe, FiMenu, FiMoon, FiSun, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, theme, setLanguage, toggleTheme } = useAppStore();
  const t = translations[language];
  const router = useRouter();
  const isHome = router.pathname === '/';

  const [categories, setCategories] = useState<{ id: string; order: number; slug: string; label: string }[]>([]);

  const logoTextClass = isScrolled 
    ? 'text-primary group-hover:text-primary-container'
    : (isHome ? 'text-on-surface group-hover:text-primary' : 'text-white group-hover:text-white/80');

  const logoSubTextClass = isScrolled
    ? 'text-secondary'
    : (isHome ? 'text-secondary' : 'text-white/70');

  const navLinkClass = isScrolled
    ? 'text-on-surface-variant hover:text-primary'
    : (isHome ? 'text-on-surface-variant hover:text-primary' : 'text-white/80 hover:text-white');

  const actionButtonClass = isScrolled
    ? 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
    : (isHome ? 'text-on-surface hover:bg-surface-container-high hover:text-primary' : 'text-white/80 hover:bg-white/10 hover:text-white');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products, dropdown: true },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
    { href: '/export', label: t.nav.export },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-md shadow-sm py-0'
          : 'bg-transparent py-4'
      } ${language === 'ar' ? 'rtl' : ''}`}
    >
      <div className="mx-auto flex h-20 max-w-[1360px] items-center justify-between gap-gutter px-margin-mobile md:px-margin-tablet lg:px-margin">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-space-sm group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <span className="font-headline-sm text-[20px] tracking-tight">OH</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-headline-sm text-headline-sm leading-none tracking-tight transition-colors duration-300 ${logoTextClass}`}>
              HerboJet
            </span>
            <span className={`mt-0.5 font-label-sm text-label-sm uppercase tracking-widest transition-colors duration-300 ${logoSubTextClass}`}>
              Botanicals Egypt
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className={`hidden lg:flex items-center gap-space-lg ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {navLinks.map((link) => (
            <div key={link.href} className="relative group">
              {link.dropdown ? (
                <div className={`flex cursor-pointer items-center gap-1 py-space-xs font-label-lg text-label-lg transition-colors duration-300 ${navLinkClass}`}>
                  <span>{link.label}</span>
                  <FiChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  
                  {/* Dropdown Menu */}
                  <div className={`invisible absolute top-full mt-2 w-56 translate-y-2 overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                    <div className="flex flex-col py-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.id}`}
                          className="px-6 py-3 font-label-md text-sm text-on-surface-variant transition-colors hover:bg-surface hover:text-primary block text-start"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={`py-space-xs font-label-lg text-label-lg transition-colors duration-300 ${navLinkClass}`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className={`flex items-center gap-space-sm md:gap-space-md ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${actionButtonClass}`}
            aria-label="Change language"
          >
            <FiGlobe className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${actionButtonClass}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
          </button>

          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary-container px-space-lg py-space-sm font-label-lg text-label-lg text-on-primary transition-all duration-200 hover:bg-primary hover:shadow-md"
          >
            {t.homePage.shopNow.replace(' ->', '').replace('->', '')}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 lg:hidden ${actionButtonClass}`}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 72px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 w-full bg-background z-[200] lg:hidden overflow-hidden border-t border-outline-variant/20 shadow-2xl"
          >
            <div className="flex flex-col px-8 pt-4 pb-32 h-full overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.div 
                  key={link.href}
                  initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  className="border-b border-outline-variant/20 last:border-0"
                >
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setIsProductsOpen(!isProductsOpen)}
                        className="flex w-full items-center justify-between py-6 font-bold text-2xl text-on-background transition-colors hover:text-primary"
                      >
                        <span>{link.label}</span>
                        <FiChevronDown className={`h-6 w-6 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-primary' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isProductsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-4 pb-6"
                          >
                            {categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${cat.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium text-on-surface-variant py-3 transition-colors hover:text-primary block text-start"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-6 font-bold text-2xl text-on-background transition-colors hover:text-primary text-start"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-2xl bg-primary py-5 font-bold text-xl text-on-primary transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02]"
                >
                  {t.homePage.shopNow.replace(' ->', '').replace('->', '')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
