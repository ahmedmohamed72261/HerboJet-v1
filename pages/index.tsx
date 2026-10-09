import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/Motion";
import { PageLoader } from "@/components/Loading";
import { useAppStore } from "@/store";
import { translations } from "@/lib/translations";
import api, { getAssetUrl } from "@/lib/api";
import {
  FiArrowRight,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiStar,
  FiGlobe,
  FiBox,
  FiCheckCircle,
  FiTrendingUp,
  FiPlay,
  FiArrowUp,
  FiVolume2,
  FiVolumeX
} from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  image: string | null;
  category: {
    name_en: string;
    name_ar: string;
  };
}

const fallbackProducts: Product[] = [
  {
    id: 1,
    name_en: "Premium Egyptian Chamomile",
    name_ar: "بابونج مصري فاخر",
    short_description_en: "High-grade whole chamomile flowers, ideal for tea blending and extractions.",
    short_description_ar: "زهور بابونج كاملة عالية الجودة، مثالية لخلط الشاي والمستخلصات.",
    image: null,
    category: { name_en: "Dried Flowers", name_ar: "زهور مجففة" },
  },
  {
    id: 2,
    name_en: "Organic Basil Leaves",
    name_ar: "أوراق ريحان عضوية",
    short_description_en: "Aromatic rubbed basil leaves processed for maximum essential oil retention.",
    short_description_ar: "أوراق ريحان عطرية مجروشة ومعالجة لأقصى احتفاظ بالزيت العطري.",
    image: null,
    category: { name_en: "Herbs", name_ar: "أعشاب" },
  },
  {
    id: 3,
    name_en: "Coriander Seeds",
    name_ar: "بذور كزبرة",
    short_description_en: "Clean, sortex-quality coriander seeds perfect for spice mills and culinary use.",
    short_description_ar: "بذور كزبرة نظيفة ومفرزة عالية الجودة مثالية لمطاحن التوابل والاستخدام الطهي.",
    image: null,
    category: { name_en: "Seeds", name_ar: "بذور" },
  },
];

const Home = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.homePage;
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [heroVersion, setHeroVersion] = useState<1 | 2>(1);
  const [showHeroToggle, setShowHeroToggle] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [navCategories, setNavCategories] = useState<{ order: number; slug: string; label: string; id: any }[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTestimonials();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the toggle when scrolled down past the hero section (approx 600px)
      setShowHeroToggle(window.scrollY < 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [language]);

  const testimonialItems = testimonials.length > 0 ? testimonials : page.testimonialsItems;

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        const slugToKey: Record<string, string> = {
          herbs: t.nav.herbs,
          spices: t.nav.spices,
          seeds: t.nav.seeds,
          "dried-flowers": t.nav.driedFlowers,
          "herbal-teas": t.nav.herbalTeas,
          botanicals: t.nav.botanicals,
        };
        setNavCategories(
          data
            .filter((c: any) => c.is_active !== false)
            .map((c: any) => ({
              order: c.order ?? 0,
              slug: c.slug,
              id: c.id ?? c._id,
              label: slugToKey[c.slug] || (language === "en" ? c.name_en : c.name_ar),
            }))
            .sort((a: any, b: any) => a.order - b.order)
        );
      }
    } catch {}
  };

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");
      const data = response.data?.data || response.data || [];
      setTestimonials(Array.isArray(data) ? data : []);
    } catch {
      setTestimonials([]);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get("/products");
      const products = response.data.data?.slice(0, 6) || [];
      setFeaturedProducts(products.length ? products : fallbackProducts);
    } catch (error) {
      setFeaturedProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t.home.heroTitle}>
      <div className={`flex flex-col w-full ${language === 'ar' ? 'rtl' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Demo Version Toggle */}
        <div className={`fixed z-[100] bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-surface/95 rounded-full shadow-2xl p-1.5 border border-outline-variant/30 flex gap-1 backdrop-blur-xl w-max transition-all duration-500 ${showHeroToggle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
           <button onClick={() => setHeroVersion(1)} className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${heroVersion === 1 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-variant'}`}>V1: Split</button>
           <button onClick={() => setHeroVersion(2)} className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${heroVersion === 2 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-variant'}`}>V2: Cinematic</button>
        </div>

        {/* VERSION 1: Modern Floating Glassmorphism */}
        {heroVersion === 1 && (
          <section className="relative w-full min-h-[90vh] flex items-center bg-background overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-normal animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] mix-blend-normal"></div>
            
            <div className="max-w-[1360px] w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                <FadeIn className="flex flex-col items-start">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-md border border-outline-variant/30 mb-8 shadow-sm">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                    </span>
                    <span className="font-label-md text-sm font-bold tracking-widest uppercase text-on-surface">
                      {page.heroBadge}
                    </span>
                  </div>
                  
                  <h1 className="font-headline-lg text-5xl lg:text-7xl font-extrabold tracking-tight text-on-background leading-[1.1] mb-8">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {page.heroTitleLine1.split(' ')[0]} 
                    </span>
                    {' ' + page.heroTitleLine1.split(' ').slice(1).join(' ')} <br className="hidden lg:block"/>
                    <span className="font-light italic text-on-surface-variant">
                      {page.heroTitleLine2}
                    </span>
                  </h1>
                  
                  <p className="font-body-lg text-lg lg:text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                    {page.heroDescription}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                    <Link href="#featured-products" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-on-primary font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                      <span>{t.home.heroCta}</span>
                      <FiArrowRight className={`text-xl transition-transform ${language === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                    </Link>
                    <Link href="/about" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-surface text-on-surface border border-outline-variant/50 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-surface-variant transition-all duration-300">
                      <FiPlay className="text-secondary" />
                      <span>{page.discoverMore}</span>
                    </Link>
                  </div>
                </FadeIn>
                
                <FadeIn className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full mt-12 lg:mt-0">
                  <div className="absolute inset-0 rounded-[2rem] lg:rounded-[3rem] overflow-hidden transform lg:rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-4 lg:border-8 border-surface-container">
                    <video 
                      src="/images/ORGANIC HERBS CO.mp4" 
                      autoPlay loop muted={isMuted} playsInline
                      className="w-full h-full object-cover object-center lg:scale-105 hover:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    <button 
                      onClick={(e) => { e.preventDefault(); setIsMuted(!isMuted); }}
                      className={`absolute top-6 right-6 lg:top-8 lg:right-8 w-14 h-14 bg-white text-primary rounded-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors z-20 shadow-xl border border-outline-variant ${language === 'ar' ? 'left-6 right-auto lg:left-8 lg:right-auto' : ''}`}
                    >
                      {isMuted ? <FiVolumeX className="text-2xl" /> : <FiVolume2 className="text-2xl" />}
                    </button>
                  </div>
                  
                  <div className="absolute -bottom-6 lg:-bottom-10 -left-4 lg:-left-10 bg-white p-6 lg:p-8 rounded-sm border border-outline-variant shadow-2xl max-w-[280px] lg:max-w-sm transform transition-transform hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                        <FiShield className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Certified Quality</h4>
                        <p className="text-sm text-on-surface-variant">ISO 22000 & FDA Registered</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        )}

        {/* VERSION 2: Minimalist Centered Cinematic */}
        {heroVersion === 2 && (
          <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-24 flex flex-col items-center bg-background overflow-hidden px-margin-mobile md:px-margin-tablet lg:px-margin">
            
            <FadeIn className="flex flex-col items-center text-center max-w-[1000px] mx-auto z-10 relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/50 mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-sm font-bold tracking-[0.2em] uppercase text-primary">
                  {page.heroBadge}
                </span>
              </div>
              
              <h1 className="font-headline-lg text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight text-on-background leading-[1.05] mb-8">
                {page.heroTitleLine1.split(' ')[0]} 
                <span className="font-serif italic text-primary font-normal px-2">
                   {' ' + page.heroTitleLine1.split(' ').slice(1).join(' ')} 
                </span>
                <br className="hidden sm:block" />
                {page.heroTitleLine2}
              </h1>
              
              <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
                {page.heroDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                <Link href="#featured-products" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-on-primary font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <span>{t.home.heroCta}</span>
                </Link>
                <Link href="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent text-on-background border border-outline-variant font-bold text-lg px-8 py-4 rounded-full hover:bg-surface-container transition-all duration-300">
                  <span>{page.discoverMore}</span>
                  <FiArrowRight className={`text-xl transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </FadeIn>

            <FadeIn className="w-full max-w-[1360px] mx-auto mt-16 lg:mt-24 relative z-0">
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-outline-variant/20">
                <video 
                  src="/images/ORGANIC HERBS CO.mp4" 
                  autoPlay loop muted={isMuted} playsInline
                  className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                <button 
                  onClick={(e) => { e.preventDefault(); setIsMuted(!isMuted); }}
                  className={`absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 bg-white text-primary rounded-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors z-20 shadow-xl border border-outline-variant ${language === 'ar' ? 'left-6 right-auto md:left-10 md:right-auto' : ''}`}
                >
                  {isMuted ? <FiVolumeX className="text-2xl" /> : <FiVolume2 className="text-2xl" />}
                </button>
                
                <div className={`absolute bottom-6 md:bottom-10 flex items-center gap-4 ${language === 'ar' ? 'right-6 md:right-10' : 'left-6 md:left-10'}`}>
                  <div className="w-14 h-14 bg-white text-primary rounded-sm flex items-center justify-center shadow-lg border border-outline-variant">
                    <FiGlobe className="text-2xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg md:text-xl tracking-wide shadow-sm">
                      {language === 'en' ? 'Global Export Quality' : 'جودة تصدير عالمية'}
                    </p>
                    <p className="text-white/80 text-sm md:text-base font-medium">
                      {language === 'en' ? 'Certified by ISO 22000 & FDA' : 'معتمد من ISO 22000 و FDA'}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        )}

        {/* NEW TRUST STRIP: Elegant Horizontal Bar */}
        <section className="w-full bg-surface-container relative z-20 border-y border-outline-variant/20 shadow-sm">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-outline-variant/20">
              {page.featureCards.map((feature, index) => (
                <div key={index} className="flex items-center gap-5 p-8 group hover:bg-surface-container-low transition-colors duration-300 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                    {index === 0 ? <FiCheckCircle className="text-2xl" /> : index === 1 ? <FiGlobe className="text-2xl" /> : <FiTrendingUp className="text-2xl" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface mb-1 text-lg group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{feature.description}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-5 p-8 group hover:bg-surface-container-low transition-colors duration-300 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                    <FiBox className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface mb-1 text-lg group-hover:text-primary transition-colors">
                      {language === 'en' ? 'Global Logistics' : 'شحن عالمي'}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2">
                      {language === 'en' ? 'FCL & LCL from major Egyptian ports.' : 'شحن كلي وجزئي من موانئ مصر.'}
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW CATEGORIES: Asymmetrical Premium Grid */}
        <section className="w-full bg-background py-24 lg:py-32">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
                {page.promoTitleBefore} {page.promoTitleHighlight}
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-on-background tracking-tight mb-6">
                {page.promoDescription}
              </h2>
              <p className="text-lg text-on-surface-variant">
                 {language === 'en' ? 'Curated from the finest Egyptian soils, processed in our state-of-the-art facilities.' : 'منتقاة من أفضل الأراضي المصرية، ومعالجة في منشآتنا المتطورة.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
              {navCategories.slice(0, 5).map((cat, idx) => (
                <Link 
                  href={`/products?category=${cat.id}`} 
                  key={cat.slug}
                  className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                >
                  <img 
                    src={`/images/lab.jpg`} 
                    alt={cat.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-primary/95 group-hover:via-primary/40 transition-colors duration-700"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between z-10">
                    <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                      <span className="text-primary group-hover:text-white/90 font-bold tracking-wider uppercase text-xs mb-2 block transition-colors">
                        {language === 'en' ? 'Category' : 'فئة'} 0{idx + 1}
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-2">{cat.label}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary group-hover:scale-110 shadow-lg transition-all duration-500">
                      <FiArrowRight className={`text-xl ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* NEW FEATURED PRODUCTS: Minimalist High-End Cards */}
        <section className="w-full bg-surface py-24 lg:py-32 border-t border-outline-variant/20" id="featured-products">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-on-background tracking-tight mb-4">
                  {t.home.featuredProducts}
                </h2>
                <p className="text-lg text-on-surface-variant max-w-md">
                   {language === 'en' ? 'Discover our highest-grade exports, ready for immediate global shipment.' : 'اكتشف أعلى صادراتنا جودة، جاهزة للشحن العالمي الفوري.'}
                </p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-on-primary transition-all">
                {t.common.viewAll} <FiArrowRight className={language === 'ar' ? 'rotate-180' : ''} />
              </Link>
            </div>

            {loading ? (
              <PageLoader className="min-h-[320px]" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id} className="group bg-surface rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-outline-variant/30 hover:border-primary/50 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/0 rounded-full blur-[60px] group-hover:bg-primary/15 transition-colors duration-700 pointer-events-none"></div>
                    <div className="relative h-64 rounded-2xl bg-surface-container-low overflow-hidden mb-6">
                      {product.image ? (
                        <img
                          src={getAssetUrl(product.image)}
                          alt={language === "en" ? product.name_en : product.name_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FiAward className="h-16 w-16 text-outline-variant group-hover:text-primary transition-colors duration-500" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                         {language === "en" ? product.category.name_en : product.category.name_ar}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-on-background mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {language === "en" ? product.name_en : product.name_ar}
                    </h3>
                    <p className="text-on-surface-variant mb-6 line-clamp-2 flex-grow">
                       {language === "en" ? product.short_description_en : product.short_description_ar}
                    </p>
                    
                    <div className="pt-5 border-t border-outline-variant/30 flex items-center justify-between mt-auto">
                      <span className="font-bold text-sm text-secondary uppercase tracking-widest group-hover:text-primary transition-colors duration-300">
                        {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                        <FiArrowRight className={`text-lg transition-transform ${language === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NEW TESTIMONIALS: Sleek Cards */}
        <section className="relative overflow-hidden bg-background py-24 lg:py-32">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="font-label-sm text-sm uppercase tracking-widest text-secondary font-bold block mb-4">
                {page.testimonialsBadge}
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-on-background tracking-tight mb-6">
                {page.testimonialsTitle}
              </h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
                {page.testimonialsDescription}
              </p>
            </div>

            <Swiper
              key={language}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              loop
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true, bulletClass: "swiper-pagination-bullet !w-3 !h-3 !bg-outline-variant !opacity-100", bulletActiveClass: "!bg-primary !w-8" }}
              className="!pb-20"
            >
              {testimonialItems.map((item: any, idx: number) => (
                <SwiperSlide key={idx} className="h-auto py-2 px-1">
                  <div className="bg-surface rounded-3xl p-8 md:p-10 shadow-sm border border-outline-variant/30 h-full flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-primary/40 transition-all duration-500 group">
                    <div>
                      <div className="flex items-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`w-5 h-5 ${i < (item?.rating || 5) ? "text-secondary fill-secondary" : "text-surface-container-highest"}`} />
                        ))}
                      </div>
                      <p className="text-xl font-serif text-on-background leading-relaxed mb-8 italic">
                        "{item?.text_en ? (language === "en" ? item.text_en : item.text_ar) : item?.text}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/30">
                      <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl">
                        {item?.name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="font-bold text-on-background">{item?.name}</p>
                        <p className="text-sm text-on-surface-variant">{item?.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* NEW FAQ: Premium Side-by-Side Layout */}
        <section className="w-full bg-surface-container-low py-24 lg:py-32 border-t border-outline-variant/20">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <span className="font-label-sm text-sm uppercase tracking-widest text-secondary font-bold block mb-4">
                  {page.faqBadge || 'B2B Export FAQ'}
                </span>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-on-background tracking-tight mb-6 leading-tight">
                  {page.faqTitle}
                </h2>
                <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
                  {page.faqDescription}
                </p>
                
                <div className="bg-surface p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
                  <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center mb-6">
                    <FiShield className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-xl text-on-background mb-2">{page.faqCardTitle}</h3>
                  <p className="text-on-surface-variant mb-6 text-sm">{page.faqCardDescription}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 w-full justify-center bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-colors">
                    {page.faqCardCta}
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-8">
                <div className="flex flex-col">
                  {page.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-outline-variant/30 last:border-0"
                    >
                      <button
                        className="flex w-full items-center justify-between gap-5 py-6 md:py-8 text-left font-bold text-xl md:text-2xl text-on-background hover:text-primary transition-colors group"
                        onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                      >
                        <span className="pr-4 leading-tight">{faq.question}</span>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${faqOpen === index ? 'bg-primary text-white rotate-180' : 'bg-surface text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary'}`}>
                          <FiChevronDown className="text-xl" />
                        </div>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${faqOpen === index ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
