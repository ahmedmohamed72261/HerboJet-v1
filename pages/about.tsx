import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiTarget, FiEye, FiHeart, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const About = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.aboutPage;
  const stats = page.stats;

  return (
    <Layout title={t.about.title}>
      <div className={`w-full bg-background min-h-screen ${language === 'ar' ? 'rtl' : ''}`}>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
          <img src="/images/breadcrumb.jpg" alt="About us" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
              {page.heroBadge}
            </div>
            <h1 className="font-headline-lg text-[40px] lg:text-[64px] leading-tight font-bold mb-6 text-white tracking-tight">
              {t.about.title}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t.about.subtitle}
            </p>
          </FadeIn>
        </section>

        {/* Story Section */}
        <section className="py-20 lg:py-32 bg-surface">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="group">
                <div className="relative w-full aspect-square bg-surface-container rounded-3xl flex items-center justify-center shadow-md overflow-hidden border border-outline-variant/30 transition-transform duration-700 hover:scale-[1.02]">
                  <img src="/images/about.jpg" alt="HerboJet Story" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-headline-sm text-2xl lg:text-3xl text-white drop-shadow-md font-bold">
                      {language === 'en' ? 'Rooted in Quality' : 'جذورنا في الجودة'}
                    </span>
                    <div className="w-16 h-1 bg-secondary mt-4 scale-0 origin-left group-hover:scale-100 transition-transform duration-500 delay-100"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center space-x-2 text-secondary font-bold text-[10px] tracking-[0.2em] uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-secondary"></span>
                  <span>{page.storyBadge}</span>
                </div>
                <h2 className="font-headline-lg text-4xl text-on-surface tracking-tight font-bold">
                  {page.storyTitle}
                </h2>
                <p className="font-body-lg text-base text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionOne}
                </p>
                <p className="font-body-lg text-base text-on-surface-variant leading-relaxed">
                  {page.storyDescriptionTwo}
                </p>
                <div className="pt-4">
                  <Link href="/products" className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold text-sm hover:bg-primary-container hover:text-primary transition-colors border border-outline-variant">
                    <span>{language === 'en' ? 'Explore Our Products' : 'استكشف منتجاتنا'}</span>
                    <FiArrowRight className={`text-lg transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us Article */}
        <section className="py-20 lg:py-28 bg-background border-y border-outline-variant">
          <FadeIn className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center justify-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-sm bg-secondary"></span>
                <span>{language === 'en' ? 'Why Us' : 'لماذا نحن'}</span>
              </span>
              <h2 className="font-headline-lg text-4xl text-on-surface tracking-tight font-bold">
                {page.whyChooseUsTitle}
              </h2>
            </div>

            <div className="font-body-lg text-base text-on-surface-variant leading-relaxed whitespace-pre-line mb-16 text-center max-w-3xl mx-auto">
              {page.whyChooseUsIntro}
            </div>

            <div className="flex flex-col gap-8">
              {page.whyChooseUsSections.map((section, i) => (
                <div key={i} className="group bg-surface-container-lowest p-8 md:p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-outline-variant/30 hover:border-primary/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none"></div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-4 flex items-center gap-4 relative z-10 transition-colors group-hover:text-primary">
                    <span className="w-12 h-12 bg-surface-container text-on-surface group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 flex items-center justify-center font-mono text-lg shrink-0 rounded-2xl border border-outline-variant/30 group-hover:border-primary">
                      0{i + 1}
                    </span>
                    {section.title}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed whitespace-pre-line relative z-10">
                    {section.body}
                  </p>

                  {i === 1 && (
                    <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                      {page.certifications.map((cert, j) => (
                        <span key={j} className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 text-on-surface font-label-sm text-xs font-bold uppercase tracking-widest">
                          <FiCheckCircle className="text-secondary" />
                          <span>{cert}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {i === 4 && (
                    <ul className="mt-8 flex flex-col gap-4 relative z-10">
                      {page.customizedSolutions.map((sol, j) => (
                        <li key={j} className="flex items-start gap-3 text-on-surface-variant font-body-md text-sm">
                          <FiArrowRight className={`mt-0.5 text-secondary shrink-0 ${language === 'ar' ? 'rotate-180' : ''}`} />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 p-10 bg-black text-white shadow-xl text-center relative overflow-hidden border border-outline-variant">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <p className="font-headline-sm text-2xl font-bold leading-relaxed relative z-10 text-white">
                "{page.whyChooseUsCta}"
              </p>
              <p className="font-label-md text-[10px] text-secondary-fixed mt-6 tracking-[0.2em] uppercase relative z-10 font-bold">
                HerboJet Botanicals Egypt
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-black text-white relative overflow-hidden border-y border-outline-variant">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, var(--tw-colors-primary) 0%, transparent 70%)' }}></div>
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
            <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-3 group px-4">
                  <div className="font-headline-lg text-[56px] lg:text-[72px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-white mb-1 drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {stat.number}
                  </div>
                  <div className="font-label-md text-xs text-white/80 uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 lg:py-32 bg-surface">
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="inline-flex items-center space-x-2 text-secondary font-bold text-[10px] tracking-[0.2em] uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-sm bg-secondary"></span>
                <span>{page.philosophyBadge}</span>
              </div>
              <h2 className="font-headline-lg text-4xl text-on-surface tracking-tight font-bold">
                {page.philosophyTitle}
              </h2>
            </div>
            
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggerItem>
                <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-outline-variant/30 hover:border-primary/50 flex flex-col items-start h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-16 h-16 bg-surface-container border border-outline-variant/50 rounded-2xl text-on-surface mb-8 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-on-primary transition-all duration-300 shadow-sm relative z-10">
                    <FiTarget className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-4 relative z-10 group-hover:text-primary transition-colors">
                    {t.about.mission}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed flex-grow relative z-10">
                    {page.missionDescription}
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-white p-10 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-outline-variant hover:border-primary flex flex-col items-start h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-16 h-16 bg-surface border border-outline-variant text-on-surface mb-8 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                    <FiEye className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-4 relative z-10 group-hover:text-primary transition-colors">
                    {t.about.vision}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed flex-grow relative z-10">
                    {page.visionDescription}
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-white p-10 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-outline-variant hover:border-primary flex flex-col items-start h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-16 h-16 bg-surface border border-outline-variant text-on-surface mb-8 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 shadow-sm relative z-10">
                    <FiHeart className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-4 relative z-10 group-hover:text-primary transition-colors">
                    {page.valuesTitle}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed flex-grow relative z-10">
                    {page.valuesDescription}
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
          </FadeIn>
        </section>

      </div>
    </Layout>
  );
};

export default About;
