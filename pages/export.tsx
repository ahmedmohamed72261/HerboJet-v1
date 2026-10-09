import { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { FadeIn } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiShield, FiClock, FiPackage, FiTrendingUp, FiCheckCircle, FiArrowRight, FiX, FiChevronLeft, FiChevronRight, FiPlay, FiAward, FiGlobe, FiTarget, FiBox } from 'react-icons/fi';
import Link from 'next/link';

const exportImages = Array.from({ length: 16 }, (_, i) => `/images/export/export${i + 1}.jpeg`);

const sections = [
  {
    id: 'introduction',
    icon: FiShield,
    titleEn: 'Introduction',
    titleAr: 'مقدمة',
    contentEn:
      'In the modern global food supply chain, accountability is no longer a premium marketing feature; it is an operational prerequisite. For the international trade of agricultural commodities—specifically dried herbs, seeds, and spices—the journey from cultivation fields to overseas shipping containers is filled with complexity. Transparency is the foundation of trust, and end-to-end batch traceability is the mechanism that delivers it.',
    contentAr:
      'في سلسلة التوريد الغذائي العالمية الحديثة، لم تعد المساءلة مجرد ميزة تسويقية متميزة؛ بل أصبحت شرطاً تشغيلياً أساسياً. بالنسبة للتجارة الدولية للمنتجات الزراعية - وتحديداً الأعشاب والبذور والتوابل المجففة - فإن الرحلة من حقول الزراعة إلى حاويات الشحن الخارجية مليئة بالتعقيدات. الشفافية هي أساس الثقة، وتتبع الدفعات من البداية إلى النهاية هو الآلية التي تحققها.',
  },
  {
    id: 'anatomy',
    icon: FiClock,
    titleEn: 'The Anatomy of a Batch',
    titleAr: 'تشريح الدفعة',
    contentEn:
      'A unique Batch ID serves as the genetic code of every shipment, linking country of origin, botanical species, harvest year, and processing sequence into one traceable record.',
    contentAr:
      'يعمل معرف الدفعة الفريد كالرمز الجيني لكل شحنة، حيث يربط بلد المنشأ والأنواع النباتية وسنة الحصاد وتسلسل المعالجة في سجل واحد قابل للتتبع.',
    stats: [
      { labelEn: 'Countries Served', labelAr: 'الدول المخدومة', value: '50+' },
      { labelEn: 'Years Experience', labelAr: 'سنوات الخبرة', value: '25+' },
      { labelEn: 'Batch Types', labelAr: 'أنواع الدفعات', value: '200+' },
    ],
  },
  {
    id: 'processing',
    icon: FiPackage,
    titleEn: 'Processing & Quality Control',
    titleAr: 'المعالجة ومراقبة الجودة',
    contentEn:
      'Throughout cleaning, cutting, milling, sorting, and packing operations, every process parameter is documented and linked to the batch, ensuring complete product integrity and accountability.',
    contentAr:
      'خلال عمليات التنظيف والقطع والطحن والفرز والتعبئة، يتم توثيق كل معلمة عملية وربطها بالدفعة، مما يضمن سلامة المنتج الكاملة والمساءلة.',
    steps: [
      { labelEn: 'Cleaning', labelAr: 'التنظيف' },
      { labelEn: 'Cutting', labelAr: 'القطع' },
      { labelEn: 'Milling', labelAr: 'الطحن' },
      { labelEn: 'Sorting', labelAr: 'الفرز' },
      { labelEn: 'Packing', labelAr: 'التعبئة' },
    ],
  },
  {
    id: 'logistics',
    icon: FiGlobe,
    titleEn: 'Packaging & Logistics',
    titleAr: 'التعبئة والخدمات اللوجستية',
    contentEn:
      'Each package receives a unique identifier connected to the master batch number. Pallets, shipping documents, container numbers, and security seals are all integrated into the traceability chain.',
    contentAr:
      'تحصل كل عبوة على معرف فريد متصل برقم الدفعة الرئيسي. يتم دمج المنصات ووثائق الشحن وأرقام الحاويات والأختام الأمنية جميعها في سلسلة التتبع.',
  },
  {
    id: 'future',
    icon: FiTrendingUp,
    titleEn: 'The Future of Traceability',
    titleAr: 'مستقبل التتبع',
    contentEn:
      'Modern ERP systems, cloud platforms, and digital records provide buyers with immediate access to farm data, laboratory analyses, processing records, and export certifications.',
    contentAr:
      'توفر أنظمة ERP الحديثة والمنصات السحابية والسجلات الرقمية للمشترين وصولاً فورياً إلى بيانات المزارع والتحاليل المخبرية وسجلات المعالجة وشهادات التصدير.',
  },
  {
    id: 'conclusion',
    icon: FiAward,
    titleEn: 'Conclusion',
    titleAr: 'الخاتمة',
    contentEn:
      "At HerboJet Botanicals Egypt, we understand that complete traceability is essential for building trust in today's global food supply chain. Through advanced documentation, rigorous quality controls, and transparent supply chain management, we provide customers with complete visibility across every stage of production, processing, packaging, and export. By maintaining the highest standards of traceability, we deliver premium Egyptian herbs, spices, seeds, flowers, and herbal teas to customers worldwide.",
    contentAr:
      'في هيربوجيت مصر، ندرك أن التتبع الكامل ضروري لبناء الثقة في سلسلة التوريد الغذائي العالمية اليوم. من خلال التوثيق المتقدم وضوابط الجودة الصارمة وإدارة سلسلة التوريد الشفافة، نوفر للعملاء رؤية كاملة عبر كل مرحلة من مراحل الإنتاج والمعالجة والتعبئة والتصدير. من خلال الحفاظ على أعلى معايير التتبع، نقدم الأعشاب والتوابل والبذور والزهور والشاي العشبي المصري الممتاز للعملاء في جميع أنحاء العالم.',
  },
];

export default function ExportPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? exportImages.length - 1 : prev - 1));
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === exportImages.length - 1 ? 0 : prev + 1));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }, [closeLightbox, prevImage, nextImage]);

  return (
    <Layout title={isEn ? 'Export & Traceability' : 'التصدير والتتبع'}>
      <div className={`w-full min-h-screen ${!isEn ? 'rtl' : ''}`}>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/export/export1.jpeg" alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/80 to-primary/95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(61,103,78,0.3),transparent_70%)]" />
          </div>
          <div className="relative z-10 max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin text-center pt-20">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 text-secondary-fixed font-label-sm text-[11px] font-bold uppercase tracking-[0.1em] mb-8">
                <FiAward className="w-4 h-4" />
                {isEn ? 'HerboJet Botanicals — Professional Article' : 'هيربوجيت — مقال احترافي'}
              </div>
              <h1 className="font-headline-lg text-[40px] md:text-[64px] lg:text-[76px] font-bold text-white leading-tight max-w-5xl mx-auto mb-6 tracking-tight">
                {isEn ? (
                  <>From Field to Container</>
                ) : (
                  <>من الحقل إلى الحاوية</>
                )}
              </h1>
              <div className="w-20 h-1 bg-secondary-fixed rounded-full mx-auto mb-6" />
              <p className="font-body-lg text-xl md:text-2xl text-secondary-fixed font-medium max-w-3xl mx-auto tracking-wide">
                {isEn
                  ? 'Establishing End-to-End Batch Traceability'
                  : 'إنشاء تتبع شامل للدفعات'}
              </p>
            </FadeIn>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Section 1: Introduction */}
        <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative">
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-32">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center shadow-md">
                          <FiShield className="w-7 h-7 text-on-primary" />
                        </div>
                        <div>
                          <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                            {isEn ? 'Section 01' : 'القسم 01'}
                          </span>
                          <h2 className="font-headline-sm text-[26px] lg:text-[32px] font-bold text-primary mt-1">
                            {isEn ? 'Introduction' : 'مقدمة'}
                          </h2>
                        </div>
                      </div>
                      <p className="font-body-sm text-sm text-on-surface-variant italic">
                        {isEn ? 'Setting the foundation for traceability excellence' : 'وضع الأساس لتميز التتبع'}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="relative bg-surface-container-lowest rounded-3xl p-8 lg:p-12 shadow-sm border border-outline-variant/20">
                      <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed relative z-10">
                        {isEn ? sections[0].contentEn : sections[0].contentAr}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 2: Anatomy */}
        <section className="py-20 lg:py-28 bg-surface-container-low relative overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative">
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 mb-4">
                    <FiClock className="w-4 h-4 text-secondary" />
                    <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                      {isEn ? 'Section 02' : 'القسم 02'}
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-3xl lg:text-5xl font-bold text-primary tracking-tight">
                    {isEn ? 'The Anatomy of a Batch' : 'تشريح الدفعة'}
                  </h2>
                  <p className="font-body-md text-on-surface-variant mt-3 max-w-xl mx-auto">
                    {isEn
                      ? 'Every shipment carries a unique identity — here\'s how we build it'
                      : 'كل شحنة تحمل هوية فريدة — إليك كيف نبنيها'}
                  </p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter lg:gap-space-md mb-12">
                {[
                  { icon: FiGlobe, labelEn: 'Country of Origin', labelAr: 'بلد المنشأ', descEn: 'Egypt — Nile Valley region', descAr: 'مصر — منطقة وادي النيل' },
                  { icon: FiShield, labelEn: 'Botanical Species', labelAr: 'النوع النباتي', descEn: 'Latin name & variety code', descAr: 'الاسم اللاتيني ورمز الصنف' },
                  { icon: FiClock, labelEn: 'Harvest Year', labelAr: 'سنة الحصاد', descEn: 'Season & harvest batch code', descAr: 'الموسم ورمز دفعة الحصاد' },
                  { icon: FiPackage, labelEn: 'Processing Sequence', labelAr: 'تسلسل المعالجة', descEn: 'Step-by-step process log', descAr: 'سجل خطوة بخطوة للمعالجة' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <FadeIn key={idx} delay={idx * 0.08}>
                      <div className="relative bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/20 shadow-sm text-center group hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center">
                        <div className="w-14 h-14 rounded-xl bg-primary-container flex items-center justify-center mx-auto mb-4 shadow-sm text-on-primary">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-headline-sm text-[18px] font-bold text-primary mb-2">
                          {isEn ? item.labelEn : item.labelAr}
                        </h3>
                        <p className="font-body-sm text-[13px] text-on-surface-variant">
                          {isEn ? item.descEn : item.descAr}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>

              <FadeIn delay={0.2}>
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/20 shadow-sm text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary font-label-sm font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    {isEn ? 'Single Traceable Record' : 'سجل واحد قابل للتتبع'}
                  </div>
                  <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed">
                    {isEn ? sections[1].contentEn : sections[1].contentAr}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 3: Processing & QC */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary shadow-sm">
                    <FiTarget className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                      {isEn ? 'Section 03' : 'القسم 03'}
                    </span>
                    <h2 className="font-headline-sm text-3xl lg:text-4xl font-bold text-primary mt-1">
                      {isEn ? 'Processing & Quality Control' : 'المعالجة ومراقبة الجودة'}
                    </h2>
                  </div>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <FadeIn>
                  <div className="space-y-8">
                    <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed">
                      {isEn ? sections[2].contentEn : sections[2].contentAr}
                    </p>
                    <div className="space-y-4">
                      {sections[2].steps?.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                            <span className="font-label-md text-sm font-bold text-primary">0{idx + 1}</span>
                          </div>
                          <div className="flex-1 h-3 bg-surface-container-low border border-outline-variant/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full"
                              style={{ width: `${((idx + 1) / (sections[2].steps?.length || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="font-label-md text-sm font-semibold text-primary w-24 text-right">
                            {isEn ? step.labelEn : step.labelAr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div
                    className="relative rounded-2xl overflow-hidden bg-surface-container aspect-[4/3] cursor-pointer group shadow-md"
                    onClick={() => openLightbox(4)}
                  >
                    <img
                      src="/images/export/export5.jpeg"
                      alt="Processing"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-sm font-bold flex items-center gap-2">
                        <FiPlay className="w-4 h-4" />
                        {isEn ? 'View Gallery' : 'عرض المعرض'}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Packaging & Logistics */}
        <section className="py-20 lg:py-28 bg-surface-container-lowest border-y border-outline-variant/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <FadeIn className="order-2 lg:order-1">
                  <div
                    className="relative rounded-2xl overflow-hidden bg-surface-container aspect-[4/3] cursor-pointer group shadow-lg border border-outline-variant/30 hover:border-primary/50 transition-all duration-300"
                    onClick={() => openLightbox(6)}
                  >
                    <img
                      src="/images/export/export7.jpeg"
                      alt="Logistics"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-on-background text-sm font-bold flex items-center gap-2">
                        <FiPlay className="w-4 h-4 text-primary" />
                        {isEn ? 'View Gallery' : 'عرض المعرض'}
                      </span>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1} className="order-1 lg:order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center flex-shrink-0 border border-outline-variant/50 shadow-sm text-primary">
                      <FiBox className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                        {isEn ? 'Section 04' : 'القسم 04'}
                      </span>
                      <h2 className="font-headline-sm text-3xl lg:text-4xl font-bold text-primary mt-1">
                        {isEn ? 'Packaging & Logistics' : 'التعبئة والخدمات اللوجستية'}
                      </h2>
                    </div>
                  </div>
                  <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed">
                    {isEn ? sections[3].contentEn : sections[3].contentAr}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {['Batch ID', 'Container No.', 'Pallet ID', 'Seal Code'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors shadow-sm">
                        <FiCheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="font-label-md text-sm font-semibold text-on-surface">{item}</span>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Future of Traceability */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FiTrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-[0.2em]">
                      {isEn ? 'Section 05' : 'القسم 05'}
                    </span>
                    <h2 className="font-headline-sm text-3xl lg:text-4xl font-bold text-primary mt-1">
                      {isEn ? 'The Future of Traceability' : 'مستقبل التتبع'}
                    </h2>
                  </div>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter lg:gap-space-lg mb-10">
                {[
                  { icon: FiGlobe, labelEn: 'Cloud Platforms', labelAr: 'منصات سحابية', descEn: 'Real-time data access from anywhere in the world', descAr: 'الوصول الفوري للبيانات من أي مكان في العالم' },
                  { icon: FiShield, labelEn: 'Digital Records', labelAr: 'سجلات رقمية', descEn: 'Immutable audit trail for every batch', descAr: 'سجل تدقيق غير قابل للتغيير لكل دفعة' },
                  { icon: FiCheckCircle, labelEn: 'ERP Integration', labelAr: 'تكامل ERP', descEn: 'Seamless connection with enterprise systems', descAr: 'اتصال سلس مع أنظمة المؤسسات' },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <FadeIn key={idx} delay={idx * 0.08}>
                      <div className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/20 shadow-sm h-full hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-5">
                          <Icon className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="font-headline-sm text-xl font-bold text-primary mb-2">
                          {isEn ? card.labelEn : card.labelAr}
                        </h3>
                        <p className="font-body-sm text-[14px] text-on-surface-variant leading-relaxed">
                          {isEn ? card.descEn : card.descAr}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
              <FadeIn delay={0.2}>
                <div className="bg-surface-container-low rounded-2xl p-space-lg lg:p-space-xl border border-outline-variant/20 shadow-sm">
                  <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed">
                    {isEn ? sections[4].contentEn : sections[4].contentAr}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 6: Conclusion */}
        <section className="py-20 lg:py-28 bg-surface-container-lowest border-y border-outline-variant/30 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                <FadeIn className="lg:col-span-2">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant/50 text-secondary">
                      <FiAward className="w-4 h-4" />
                      <span className="font-label-sm text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isEn ? 'Section 06' : 'القسم 06'}
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-3xl lg:text-5xl font-bold text-primary leading-tight tracking-tight">
                      {isEn ? 'Our Commitment' : 'التزامنا'}
                    </h2>
                    <div className="w-16 h-1 bg-secondary rounded-full" />
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      {isEn
                        ? 'Building trust through complete transparency across every stage'
                        : 'بناء الثقة من خلال الشفافية الكاملة في كل مرحلة'}
                    </p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1} className="lg:col-span-3">
                  <div className="relative bg-surface-container backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-outline-variant/30 shadow-sm hover:shadow-lg transition-shadow">
                    <span className="absolute -top-4 -left-2 text-[80px] text-primary/10 font-serif leading-none select-none">&ldquo;</span>
                    <p className="font-body-lg text-base lg:text-lg text-on-surface-variant leading-relaxed relative z-10">
                      {isEn ? sections[5].contentEn : sections[5].contentAr}
                    </p>
                    <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <span className="text-sm font-bold text-primary tracking-tight">OH</span>
                      </div>
                      <div>
                        <p className="font-label-lg text-sm font-bold text-on-background">HerboJet Botanicals</p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">{isEn ? 'Traceability Excellence' : 'التميز في التتبع'}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-surface relative overflow-hidden">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative">
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/50 border border-secondary/20 text-secondary font-label-sm text-xs font-bold uppercase tracking-[0.15em] mb-8">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    {isEn ? 'Start Your Partnership' : 'ابدأ شراكتك'}
                  </div>
                  <h2 className="font-headline-lg text-4xl lg:text-[56px] font-bold text-primary mb-6 leading-tight tracking-tight">
                    {isEn ? (
                      <>
                        Partner with <span className="text-secondary">Us</span>
                      </>
                    ) : (
                      'كن شريكاً لنا'
                    )}
                  </h2>
                  <p className="font-body-lg text-on-surface-variant text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                    {isEn
                      ? 'Experience the highest standards of traceability and quality. Our export team is ready to discuss your requirements.'
                      : 'اختبر أعلى معايير التتبع والجودة. فريق التصدير لدينا مستعد لمناقشة متطلباتك.'}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 bg-primary-container hover:bg-primary text-on-primary font-label-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-md text-lg"
                    >
                      {isEn ? 'Contact Export Team' : 'اتصل بفريق التصدير'}
                      <FiArrowRight className={`w-5 h-5 ${!isEn ? 'rotate-180' : ''}`} />
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-3 bg-surface-container-lowest hover:bg-surface-container text-primary font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-sm border border-outline-variant/30 text-lg"
                    >
                      {isEn ? 'Browse Products' : 'تصفح المنتجات'}
                    </Link>
                  </div>
                </div>
              </FadeIn>
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: isEn ? 'HACCP Certified' : 'معتمد HACCP' },
                  { label: isEn ? 'Full Traceability' : 'تتبع كامل' },
                  { label: isEn ? 'Global Shipping' : 'شحن عالمي' },
                  { label: isEn ? 'Bulk Supply' : 'توريد بالجملة' },
                ].map((item, idx) => (
                  <FadeIn key={idx} delay={idx * 0.05}>
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                      <FiCheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="font-label-md text-[13px] font-semibold text-primary">{item.label}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={exportImages[lightboxIndex]}
              alt={`Export ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 font-body-sm text-sm font-medium tracking-widest">
              {lightboxIndex + 1} / {exportImages.length}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}