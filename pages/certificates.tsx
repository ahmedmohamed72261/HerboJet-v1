import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem, motion, AnimatePresence } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiAward, FiRefreshCw, FiX, FiExternalLink, FiCalendar, FiDownload, FiCheckCircle, FiShield, FiGlobe, FiHeart, FiStar } from 'react-icons/fi';

interface Certificate {
  id: number | string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  file: string | null;
  issuer: string | null;
  issued_date: string | null;
}

const Certificates = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.certificatesPage;
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/certificates');
      const data = response.data?.data || response.data || [];
      setCertificates(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateStr; }
  };

  return (
    <Layout title={t.certificates.title}>
      <div className={`w-full bg-background min-h-screen ${language === 'ar' ? 'rtl' : ''}`}>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
          <img src="/images/breadcrumb.jpg" alt="Certificates" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
              {page.heroBadge}
            </div>
            <h1 className="font-headline-lg text-[40px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-space-sm">
              {t.certificates.title}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed mt-4">
              {t.certificates.subtitle}
            </p>
          </FadeIn>
        </section>

        {/* Certifications List */}
        <section className="py-20 lg:py-28 bg-surface border-b border-outline-variant/30">
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin text-center">
            <div className="mb-14 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 text-secondary font-bold text-sm tracking-widest uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {language === 'en' ? 'Quality Standards' : 'معايير الجودة'}
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                {language === 'en' ? 'International Certifications' : 'الشهادات الدولية'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-4">
                {language === 'en'
                  ? 'Our commitment to quality is backed by globally recognized certifications across food safety, organic production, and religious compliance.'
                  : 'التزامنا بالجودة مدعوم بشهادات معترف بها عالمياً في سلامة الأغذية والإنتاج العضوي والتوافق الديني.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {t.aboutPage.certifications.map((cert: string, i: number) => {
                const icons = [FiShield, FiAward, FiCheckCircle, FiStar, FiGlobe, FiHeart];
                const Icon = icons[i % icons.length];
                return (
                  <FadeIn key={i} delay={i * 0.03}>
                    <div className="group relative h-full rounded-2xl bg-surface-container-lowest p-6 flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary-container text-on-primary mb-4 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm relative z-10">
                        <Icon className="text-2xl" />
                      </div>
                      <span className="font-label-md text-sm text-primary font-bold relative z-10 group-hover:text-secondary transition-colors duration-300">
                        {cert}
                      </span>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </FadeIn>
        </section>

        {/* Certificates Grid */}
        <section className="py-20 lg:py-32 bg-surface-container-low">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 h-[460px] flex flex-col overflow-hidden">
                    <div className="h-72 bg-surface-container animate-pulse w-full" />
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between mb-4">
                        <div className="h-4 bg-surface-container rounded animate-pulse w-1/4" />
                        <div className="h-4 bg-surface-container rounded animate-pulse w-1/6" />
                      </div>
                      <div className="h-6 bg-surface-container rounded animate-pulse w-2/3 mb-4" />
                      <div className="space-y-2 mb-8">
                        <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                        <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                        <div className="h-4 bg-surface-container rounded animate-pulse w-1/2" />
                      </div>
                      <div className="mt-auto">
                        <div className="h-12 bg-surface-container rounded-xl animate-pulse w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl shadow-sm border border-outline-variant/20">
                <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <FiAward className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t.common.error}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                  {language === 'en' ? 'Unable to load certificates. Please try again.' : 'تعذر تحميل الشهادات. يرجى المحاولة مرة أخرى.'}
                </p>
                <button onClick={fetchCertificates} className="inline-flex items-center gap-2 px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors">
                  <FiRefreshCw className="w-4 h-4" />
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            ) : certificates.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl shadow-sm border border-outline-variant/20">
                <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-surface-container flex items-center justify-center">
                  <FiAward className="w-7 h-7 text-outline-variant" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{t.common.noData}</h3>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <StaggerItem key={cert.id}>
                    <button
                      onClick={() => setSelected(cert)}
                      className="w-full text-left group h-full block"
                    >
                      <div className="bg-surface-container-lowest h-full rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-outline-variant/30 hover:border-primary/40 flex flex-col relative shadow-sm group">
                        <div className="h-64 bg-surface-container flex items-center justify-center relative overflow-hidden border-b border-outline-variant/20">
                          {cert.image ? (
                            <img
                              src={getAssetUrl(cert.image)}
                              alt={language === 'en' ? cert.title_en : cert.title_ar}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <FiAward className="w-16 h-16 text-outline-variant/50 group-hover:text-primary transition-colors duration-300" />
                          )}
                          
                          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer" onClick={() => setSelected(cert)}>
                            <span className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-lowest text-primary font-bold text-sm rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                              <FiExternalLink className="text-lg" />
                              {language === 'en' ? 'View Certificate' : 'عرض الشهادة'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-grow relative z-10">
                          <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 transition-colors duration-200 group-hover:text-primary">
                            {language === 'en' ? cert.title_en : cert.title_ar}
                          </h3>
                          {cert.issuer && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest mb-4">
                              <FiAward className="text-sm" />
                              {cert.issuer}
                            </span>
                          )}
                          <p className="font-body-md text-base text-on-surface-variant leading-relaxed line-clamp-3">
                            {language === 'en' ? cert.description_en : cert.description_ar}
                          </p>
                        </div>
                      </div>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </section>

        {/* Certificate Preview Dialog */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-surface-container-lowest rounded-[2rem] lg:rounded-[3rem] shadow-2xl flex flex-col md:flex-row border border-outline-variant/20"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 w-12 h-12 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors shadow-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>

                {/* Image Side */}
                <div className="relative h-[300px] md:h-auto md:w-1/2 bg-surface-container overflow-hidden group">
                  {selected.image ? (
                    <>
                      <img
                        src={getAssetUrl(selected.image)}
                        alt={language === 'en' ? selected.title_en : selected.title_ar}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiAward className="w-32 h-32 text-outline-variant/40" />
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col md:w-1/2 max-h-full overflow-y-auto">
                  <div className="flex-1">
                    <h2 className="font-headline-sm md:font-headline-md text-3xl md:text-4xl font-bold text-primary mb-6">
                      {language === 'en' ? selected.title_en : selected.title_ar}
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-8">
                      {selected.issuer && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold uppercase tracking-widest text-xs">
                          <FiAward className="text-base" />
                          {selected.issuer}
                        </span>
                      )}
                      {selected.issued_date && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs">
                          <FiCalendar className="text-base" />
                          {formatDate(selected.issued_date)}
                        </span>
                      )}
                    </div>

                    <div className="font-body-md text-lg text-on-surface-variant leading-relaxed">
                      {language === 'en' ? selected.description_en : selected.description_ar}
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-outline-variant flex flex-col gap-4">
                    {selected.file && (
                      <a
                        href={getAssetUrl(selected.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-3 w-full rounded-2xl bg-primary px-8 py-4 font-bold text-on-primary transition-colors hover:bg-primary-container hover:text-primary"
                      >
                        <FiDownload className="text-xl" />
                        {language === 'en' ? 'Download Certificate PDF' : 'تحميل الشهادة'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Certificates;