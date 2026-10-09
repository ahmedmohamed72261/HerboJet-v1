import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiLinkedin, FiMail, FiRefreshCw, FiUsers, FiSearch } from 'react-icons/fi';

interface TeamMember {
  id: number | string;
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string;
  bio_ar: string;
  image: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
}

const Team = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.teamPage;
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/team-members');
      const data = response.data?.data || response.data || [];
      setTeamMembers(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={t.team.title}>
      <div className={`w-full min-h-screen bg-background ${language === 'ar' ? 'rtl' : ''}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
          <img src="/images/breadcrumb.jpg" alt="Our Team" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          
          <FadeIn className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 text-white font-label-sm text-xs uppercase tracking-[0.2em] mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-sm bg-secondary-fixed"></span>
              {page.heroBadge}
            </div>
            <h1 className="font-headline-lg text-[40px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-space-sm">
              {t.team.title}
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed mt-4">
              {t.team.subtitle}
            </p>
          </FadeIn>
        </section>

        {/* Team Grid */}
        <section className="w-full py-space-xl lg:py-28">
          <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 h-[380px] p-8 flex flex-col">
                    <div className="w-24 h-24 rounded-full bg-surface-container animate-pulse mb-6" />
                    <div className="h-6 bg-surface-container rounded animate-pulse mb-3 w-3/4" />
                    <div className="h-4 bg-surface-container rounded animate-pulse mb-6 w-1/2" />
                    <div className="space-y-2 mb-8">
                      <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                      <div className="h-4 bg-surface-container rounded animate-pulse w-full" />
                      <div className="h-4 bg-surface-container rounded animate-pulse w-4/5" />
                    </div>
                    <div className="mt-auto flex gap-3 pt-5 border-t border-outline-variant/20">
                      <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
                      <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl shadow-sm border border-outline-variant/20">
                <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <FiUsers className="w-7 h-7" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t.common.error}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                  {language === 'en' ? 'Unable to load team members. Please try again.' : 'تعذر تحميل أعضاء الفريق. يرجى المحاولة مرة أخرى.'}
                </p>
                <button onClick={fetchTeamMembers} className="inline-flex items-center gap-2 px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors">
                  <FiRefreshCw className="w-4 h-4" />
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl max-w-lg mx-auto text-center p-space-xl shadow-sm border border-outline-variant/20">
                <div className="w-16 h-16 mx-auto mb-space-md rounded-full bg-surface-container flex items-center justify-center">
                  <FiUsers className="w-7 h-7 text-outline-variant" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{t.common.noData}</h3>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <StaggerItem key={member.id}>
                    <div className="bg-surface-container-lowest p-8 text-left group transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-outline-variant/30 hover:border-primary/40 rounded-3xl h-full flex flex-col relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
                      
                      {/* Avatar */}
                      <div className="relative w-24 h-24 mb-6 z-10 rounded-full overflow-hidden border-2 border-surface-container group-hover:border-primary/50 transition-colors shadow-sm">
                        {member.image ? (
                          <img
                            src={getAssetUrl(member.image)}
                            alt={language === 'en' ? member.name_en : member.name_ar}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <FiUsers className="w-8 h-8 text-outline-variant/50 group-hover:text-primary transition-colors" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="font-headline-sm text-2xl font-bold text-on-surface mb-1 relative z-10 group-hover:text-primary transition-colors duration-300">
                        {language === 'en' ? member.name_en : member.name_ar}
                      </h3>

                      {/* Position */}
                      <div className="mb-5 relative z-10">
                        <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full font-label-sm text-[11px] font-bold uppercase tracking-widest">
                          {language === 'en' ? member.position_en : member.position_ar}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="font-body-md text-base text-on-surface-variant leading-relaxed mb-8 flex-grow relative z-10">
                        {language === 'en' ? member.bio_en : member.bio_ar}
                      </p>

                      {/* Social Links */}
                      <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/20 relative z-10 mt-auto">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-surface hover:bg-primary text-on-surface-variant hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md border border-outline-variant/30"
                            title="Email"
                          >
                            <FiMail className="w-[18px] h-[18px]" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-surface hover:bg-[#0A66C2] text-on-surface-variant hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md border border-outline-variant/30"
                            title="LinkedIn"
                          >
                            <FiLinkedin className="w-[18px] h-[18px]" />
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

export default Team;