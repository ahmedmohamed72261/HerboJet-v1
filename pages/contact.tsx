import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiClock, FiShield, FiFileText } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface ExportCountry {
  _id: string;
  name_en: string;
  name_ar: string;
  flag: string | null;
  display_order: number;
}

const Contact = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.contactPage;
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<ExportCountry[]>([]);

  useEffect(() => {
    api.get('/export-countries').then(r => setCountries(r.data || [])).catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact-messages', formData);
      toast.success(t.common.success);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: FiMapPin, label: t.contact.address, value: language === 'en' ? 'Kafr Bani Ali – Samasta Center – Beni Suef Governorate – Egypt' : 'كفر بني علي – مركز سمسطا – محافظة بني سويف – مصر' },
    { icon: FiPhone, label: t.contact.phoneNumber, value: '+20 155 319 0955' },
    { icon: FaWhatsapp, label: 'WhatsApp', value: '+20 155 319 0955', href: 'https://wa.me/201553190955' },
    { icon: FiMail, label: t.contact.emailAddress, value: 'info@organicherbseg.com', href: 'mailto:info@organicherbseg.com' },
    { icon: FiMail, label: t.contact.emailSales, value: 'sales@organicherbseg.com', href: 'mailto:sales@organicherbseg.com' },
  ];

  return (
    <Layout title={t.contact.title}>
      <div className={`w-full bg-background min-h-screen ${language === 'ar' ? 'rtl' : ''}`}>
        
        {/* Top Page Header & Context Breadcrumb */}
        <section className="relative w-full bg-black py-20 lg:py-32 pt-32 lg:pt-48 overflow-hidden">
          <img src="/images/breadcrumb.jpg" alt="Contact Us" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-white/80">
              <Link href="/" className="font-label-md text-sm hover:text-white transition-colors flex items-center gap-1 font-bold">
                <span>{t.nav.home}</span>
              </Link>
              <span className="font-label-md text-sm">/</span>
              <span className="font-label-md text-sm text-secondary-fixed font-bold">
                {language === 'en' ? 'Contact & Bulk Inquiry' : 'اتصل بنا واستفسار الجملة'}
              </span>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
                {page.heroBadge}
              </div>
              <h1 className="font-headline-lg text-5xl md:text-[72px] md:leading-[1.1] text-white tracking-tight mb-6 font-bold drop-shadow-lg">
                {t.contact.title}
              </h1>
              <p className="font-body-lg text-xl text-white/80 max-w-3xl leading-relaxed">
                {t.contact.subtitle}
              </p>
            </div>

            {/* Quick Trust Indicators Metric Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
              {[
                { icon: FiClock, title: language === 'en' ? '< 24h Response' : 'رد خلال 24 ساعة', desc: language === 'en' ? 'Guaranteed review' : 'مراجعة مضمونة' },
                { icon: FiFileText, title: language === 'en' ? '500g Samples' : 'عينات 500 جرام', desc: language === 'en' ? 'FedEx / DHL ready' : 'جاهزة عبر FedEx/DHL' },
                { icon: FiShield, title: language === 'en' ? 'SGS & BV Inspected' : 'تفتيش SGS و BV', desc: language === 'en' ? 'Third-party loading' : 'وصول طرف ثالث للتحميل' },
                { icon: FiMapPin, title: language === 'en' ? 'FCL & LCL Shipments' : 'شحن FCL و LCL', desc: language === 'en' ? 'Alexandria / Damietta' : 'موانئ الإسكندرية ودمياط' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 group">
                  <div className="w-12 h-12 rounded-sm bg-white/10 text-white flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <item.icon className="text-2xl" />
                  </div>
                  <div>
                    <span className="font-label-md text-base text-white block font-bold mb-1">{item.title}</span>
                    <span className="font-body-sm text-sm text-white/60">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Export Countries */}
        {countries.length > 0 && (
          <section className="w-full bg-surface-container-low py-24 border-y border-outline-variant/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10">
              <div className="mb-16 text-center max-w-2xl mx-auto">
                <span className="font-label-sm text-sm uppercase tracking-[0.2em] text-secondary font-bold block mb-4">
                  {t.exportCountries.title}
                </span>
                <h2 className="font-headline-lg text-5xl text-primary tracking-tight font-bold">
                  {language === 'en' ? 'Where We Export' : 'أين نصدر'}
                </h2>
                <p className="mt-6 font-body-md text-lg text-on-surface-variant leading-relaxed">
                  {t.exportCountries.subtitle}
                </p>
              </div>
              
              <StaggerGrid className="flex flex-wrap justify-center gap-6 md:gap-10">
                {countries.map((country) => (
                  <StaggerItem key={country._id}>
                    <div className="group flex flex-col items-center gap-4 w-28">
                      <div className="w-full aspect-[4/3] rounded-sm overflow-hidden shadow-sm border border-outline-variant transition-all duration-200 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-primary relative">
                        {country.flag ? (
                          <img
                            src={getAssetUrl(country.flag)}
                            alt={language === 'en' ? country.name_en : country.name_ar}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <FiMapPin className="text-outline-variant text-2xl" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <span className="font-label-md text-sm text-on-surface-variant group-hover:text-primary transition-colors text-center font-bold">
                        {language === 'en' ? country.name_en : country.name_ar}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </FadeIn>
          </section>
        )}

        {/* Main Asymmetric 2-Column Workstation */}
        <section className="w-full py-24 bg-background">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN: Contact Form (~65% / 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                <div className="bg-surface-container-lowest rounded-3xl shadow-sm p-8 sm:p-12 border border-outline-variant/30">
                  <div className="mb-10">
                    <h2 className="font-headline-lg text-4xl text-primary mb-4 font-bold">
                      {t.contact.sendMessage}
                    </h2>
                    <p className="font-body-md text-lg text-on-surface-variant leading-relaxed">
                      {language === 'en'
                        ? 'Submit your botanical specifications, target volumes, and destination port. Our team will get back to you within 24 hours.'
                        : 'أرسل مواصفاتك النباتية والكميات المطلوبة وميناء الوجهة. سيتواصل معك فريقنا خلال 24 ساعة.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-primary font-bold">
                          {t.contact.name} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:bg-surface-container-high transition-all"
                          placeholder={language === 'en' ? 'e.g. Dr. Markus Weber' : 'د. ماركوس ويبر'}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-sm text-on-surface font-bold">
                          {t.contact.email} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:bg-surface-container-high transition-all"
                          placeholder={language === 'en' ? 'your@corporate-email.com' : 'بريدك الإلكتروني'}
                        />
                        <span className="font-body-sm text-[11px] text-secondary">
                          {language === 'en' ? 'Expedited review for corporate domains.' : 'مراجعة سريعة لنطاقات الشركات.'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-sm text-on-surface font-bold">
                          {t.contact.phone}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:bg-surface-container-high transition-all"
                          placeholder={language === 'en' ? '+1 234 567 890' : '+٢٠١٠٠٠٠٠٠٠٠'}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-sm text-on-surface font-bold">
                          {t.contact.subject}
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:bg-surface-container-high transition-all"
                          placeholder={language === 'en' ? 'Inquiry about Wholesale Chamomile' : 'استفسار عن أسعار البابونج'}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-sm text-on-surface font-bold">
                        {t.contact.message} *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-surface-container px-4 py-3 rounded-2xl border border-outline-variant/30 text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:bg-surface-container-high transition-all resize-none"
                        placeholder={language === 'en' ? 'Tell us about your technical specifications, target volumes, and destination port...' : 'أخبرنا عن المواصفات الفنية والكميات المستهدفة...'}
                      />
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-on-primary hover:bg-primary-container hover:text-primary border border-transparent hover:border-primary/20 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span>{loading ? t.common.loading : t.contact.sendMessage}</span>
                        {!loading && <FiSend className="text-lg" />}
                      </button>
                      
                      <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-on-surface-variant">
                        <FiShield className="text-secondary text-base" />
                        <span className="font-body-sm text-[12px] font-medium">
                          {language === 'en' ? 'Strict B2B Confidentiality & NDA Standards' : 'معايير سرية صارمة B2B'}
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT COLUMN: Commercial Desk Information (~35% / 4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                
                {/* Facility & Export Hub Card */}
                <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
                  <div className="relative h-48 w-full bg-surface-container overflow-hidden border-b border-outline-variant/20">
                    <img 
                      alt="HerboJet Facility" 
                      className="w-full h-full object-cover grayscale" 
                      src="/images/lab.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-[0.2em] block font-bold mb-1">
                          {language === 'en' ? 'Main Processing Facility' : 'منشأة المعالجة الرئيسية'}
                        </span>
                        <span className="font-headline-sm text-xl font-bold">
                          HerboJet Botanicals S.A.E.
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-6">
                    {/* Direct Contact Channels */}
                    <div className="flex flex-col gap-3">
                      {contactInfo.map((item, idx) => {
                        const Icon = item.icon;
                        const isLink = Boolean(item.href);
                        return (
                          <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/50 text-on-surface flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all">
                              <Icon className="text-lg" />
                            </div>
                            <div className="flex flex-col min-w-0 pt-0.5">
                              <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">
                                {item.label}
                              </span>
                              {isLink ? (
                                <a href={item.href} target={item.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-label-md text-label-md text-primary group-hover:text-secondary truncate font-bold">
                                  {item.value}
                                </a>
                              ) : (
                                <span className="font-label-md text-label-md text-primary font-medium">
                                  {item.value}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Working Hours */}
                    <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-start gap-4 mt-2">
                      <FiClock className="text-secondary text-2xl shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-label-md text-sm text-on-surface font-bold">
                          {language === 'en' ? 'Office Working Hours' : 'ساعات العمل'}
                        </span>
                        <span className="font-body-sm text-xs text-on-surface-variant mt-1">
                          {language === 'en' ? 'Sunday – Thursday: 08:30 – 17:30 (Cairo GMT+2)' : 'الأحد - الخميس: 08:30 - 17:30 (بتوقيت القاهرة)'}
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary mt-2 font-bold uppercase tracking-[0.1em]">
                          {language === 'en' ? 'International Inquiries: 24/7 Monitored Dispatch' : 'الاستفسارات الدولية: مراقبة على مدار الساعة'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Badges */}
                <div className="bg-primary text-on-primary rounded-3xl shadow-sm p-8 flex flex-col gap-4 border border-outline-variant/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 text-white font-label-sm text-[10px] font-bold uppercase tracking-[0.2em] mb-2 w-fit border border-white/10 backdrop-blur-sm relative z-10">
                    <FiCheckCircle className="text-sm" />
                    {language === 'en' ? 'Quality Commitment' : 'التزام الجودة'}
                  </div>
                  <h3 className="font-headline-sm text-2xl text-white mb-2 font-bold relative z-10">
                    {language === 'en' ? 'Global Importer Protection' : 'حماية المستورد العالمي'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                    {['ISO 22000', 'HACCP', 'FSSC 22000', 'Organic', 'FSMA'].map((badge) => (
                      <span key={badge} className="font-label-md text-xs font-bold text-primary bg-surface-container-lowest px-4 py-2 rounded-full shadow-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Contact;