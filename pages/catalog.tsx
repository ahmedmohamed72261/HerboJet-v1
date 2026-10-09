import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiDownload, FiFileText, FiRefreshCw, FiSearch } from 'react-icons/fi';

interface Catalog {
  id: number | string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  file: string | null;
  image: string | null;
  version: string | null;
}

const CatalogPage = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.catalogPage;
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/catalogs');
      const data = response.data?.data || response.data || [];
      setCatalogs(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t.catalog.title}>
      <div className={`w-full bg-background min-h-screen ${language === 'ar' ? 'rtl' : ''}`}>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
          <img src="/images/breadcrumb.jpg" alt="Catalog" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
              {page.heroBadge}
            </div>
            <h1 className="font-headline-lg text-[40px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-space-sm">
              {t.catalog.title}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed mt-4">
              {t.catalog.subtitle}
            </p>
          </FadeIn>
        </section>

        {/* Catalog Grid */}
        <section className="w-full py-space-xl lg:py-28">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                {[1, 2].map((i) => (
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
                  <FiFileText className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t.common.error}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                  {language === 'en' ? 'Unable to load catalogs. Please try again.' : 'تعذر تحميل الكتالوجات. يرجى المحاولة مرة أخرى.'}
                </p>
                <button onClick={fetchCatalogs} className="inline-flex items-center gap-2 px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors">
                  <FiRefreshCw className="w-4 h-4" />
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            ) : catalogs.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl shadow-sm border border-outline-variant/20">
                <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-surface-container flex items-center justify-center">
                  <FiSearch className="w-7 h-7 text-outline-variant" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{t.common.noData}</h3>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {catalogs.map((catalog) => (
                  <StaggerItem key={catalog.id}>
                    <div className="bg-surface-container-lowest h-full rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-outline-variant/30 hover:border-primary/40 flex flex-col relative shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                      <div className="h-72 bg-surface-container flex items-center justify-center relative overflow-hidden border-b border-outline-variant/20">
                        {catalog.image ? (
                          <img
                            src={getAssetUrl(catalog.image)}
                            alt={language === 'en' ? catalog.title_en : catalog.title_ar}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <FiFileText className="w-16 h-16 text-outline-variant/50 group-hover:text-primary transition-colors duration-300" />
                        )}
                        {/* Download overlay */}
                        {catalog.file && (
                          <a
                            href={getAssetUrl(catalog.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <span className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-lowest text-primary font-bold text-sm rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                              <FiDownload className="text-lg" />
                              {t.catalog.download}
                            </span>
                          </a>
                        )}
                      </div>
                      
                      <div className="p-8 flex flex-col flex-grow relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          {catalog.version ? (
                            <span className="font-label-sm text-xs text-primary bg-primary/10 px-3 py-1 rounded-sm uppercase tracking-widest font-bold">
                              {`${page.versionLabel} ${catalog.version}`}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="font-label-sm text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">PDF</span>
                        </div>
                        
                        <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-3 transition-colors duration-200">
                          {language === 'en' ? catalog.title_en : catalog.title_ar}
                        </h3>
                        <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">
                          {language === 'en' ? catalog.description_en : catalog.description_ar}
                        </p>
                        
                        {catalog.file && (
                          <a
                            href={getAssetUrl(catalog.file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
                          >
                            <FiDownload className="text-lg" />
                            <span>{t.catalog.download}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </section>
        
      </div>
    </Layout>
  );
};

export default CatalogPage;