import React, { useState, useEffect } from 'react';
import { 
  PackageItem, 
  Language, 
  Currency,
  PageId, 
  Testimonial,
  GalleryItem
} from '../types';
import { translations } from '../translations';
import { formatPrice } from '../utils/formatPrice';
import { subscribePhoneSms, trackAndOpenWhatsApp, fetchPackages, fetchGalleryItems, getFullImageUrl } from '../api/client';
import { useExchangeRate } from '../api/exchangeRate';
import { AIRLINE_PARTNERS } from '../data/airlines';
import { 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Users, 
  Award, 
  Clock, 
  Send, 
  ArrowRight, 
  Hotel, 
  Plane, 
  MessageSquare,
  Bell,
  Box,
  FileText,
  Building,
  UserCheck,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Video,
  Image as ImageIcon,
  Play
} from 'lucide-react';

interface HomeProps {
  setActivePage: (page: PageId) => void;
  onSelectPackage: (pkg: PackageItem) => void;
  onSubscribeSms: (phone: string) => void;
  lang: Language;
  currency: Currency;
}

export const Home: React.FC<HomeProps> = ({
  setActivePage,
  onSelectPackage,
  onSubscribeSms,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Data states
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [pkgData, galData] = await Promise.all([
        fetchPackages(),
        fetchGalleryItems('all')
      ]);
      setPackages(pkgData.slice(0, 4));
      setGallery(galData.slice(0, 6));
      // Testimonials – static for now
      const { INITIAL_TESTIMONIALS } = await import('../data/initialData');
      setTestimonials(INITIAL_TESTIMONIALS);
    } catch (e) {
      console.error('Home data loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSmsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    try {
      await subscribePhoneSms({
        phone: phoneInput,
        email: emailInput || undefined,
        channel: 'Web Banner'
      }, lang);
    } catch {
      // Fallback
    }
    onSubscribeSms(phoneInput);
    setSubscribedMessage(true);
    setPhoneInput('');
    setEmailInput('');
    setTimeout(() => setSubscribedMessage(false), 5000);
  };

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[activeTestimonialIdx] || testimonials[0];

  // Helper to check if item is a video
  const isVideo = (item: any): boolean => {
    return item.type === 'Video' || item.type === 'video';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
        <p className="text-xs font-semibold">Loading homepage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 bg-[#F9F9F9] text-slate-800">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1920')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:to-white/30 rtl:bg-gradient-to-l" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
          <div className="max-w-xl space-y-5">
            <p className="text-xs sm:text-sm font-extrabold text-[#C8102E] tracking-widest uppercase">
              {t.licensedBadge}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-sans text-slate-900 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {t.heroSubTitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('packages')}
                className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span>{t.explorePackages}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => trackAndOpenWhatsApp(undefined, 'General Umrah Inquiry')}
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-lg shadow transition-all flex items-center gap-2 border border-slate-200"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{t.chatWhatsapp}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK BENEFITS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
  <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-slate-100">
    
    {/* 1. Best Packages */}
    <div className="flex items-center gap-3 p-2">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <Box className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">{t.bestPackagesTitle || 'Best Packages'}</h4>
        <p className="text-[10px] text-slate-500">{t.bestPackagesSubtitle || 'Affordable & Premium'}</p>
      </div>
    </div>

    {/* 2. Flights */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <Plane className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">Flights</h4>
        <p className="text-[10px] text-slate-500">Ethiopian & Saudia</p>
      </div>
    </div>

    {/* 3. Support */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">{t.supportTitle || '24/7 Support'}</h4>
        <p className="text-[10px] text-slate-500">Dedicated Mutawwif</p>
      </div>
    </div>

    {/* 4. Licensed */}
    <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-slate-900">{t.feature3Title || 'Licensed'}</h4>
        <p className="text-[10px] text-slate-500">100% Verified Agency</p>
      </div>
    </div>

  </div>
</div>

      {/* BEST UMRAH PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-[#C8102E] tracking-widest uppercase">
              {t.bestPackagesTitle}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {t.packages}
            </h2>
          </div>
          <button
            onClick={() => setActivePage('packages')}
            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8102E] rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const imageUrl = pkg.imageUrl ? getFullImageUrl(pkg.imageUrl) : '';
            return (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={pkg.titleEn} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow">
                      {pkg.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {lang === 'AR' ? pkg.titleAr : (lang === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pkg.durationDays} Days</span>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-slate-400">{t.perPerson}</span>
                        <span className="text-base font-extrabold text-[#C8102E]">
                          {formatPrice(pkg.priceUsd, currency, lang, rate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AIRLINE PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Official Flight Partners
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                Fly Directly to Makkah & Madinah
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AIRLINE_PARTNERS.map((airline) => (
              <div 
                key={airline.id} 
                className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col justify-between space-y-4 group"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${airline.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950/85" />
                <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{airline.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-white text-lg">{airline.name}</h3>
                        <span className="text-[11px] text-slate-300 font-semibold">IATA: {airline.code} • {airline.badge}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-200 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/70">
                    <p><strong className="text-white">Hub:</strong> {airline.hub}</p>
                    <p><strong className="text-white">Baggage:</strong> {airline.baggageAllowance}</p>
                    <p><strong className="text-white">In-Flight:</strong> {airline.catering}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-red-400">{airline.frequency}</span>
                    <span className="text-[11px] text-slate-400 italic">Information View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-COLUMN FEATURE & UPDATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse divide-slate-200">
          
          {/* Col 1: Seasonal Update */}
          <div className="space-y-4 pr-0 lg:pr-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#C8102E]">
                <Bell className="w-4 h-4 fill-[#C8102E]" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{t.smsBannerTitle}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.smsBannerSub}
            </p>
            <form onSubmit={handleSmsFormSubmit} className="space-y-2 pt-1">
              <input
                type="tel"
                required
                placeholder={t.enterPhonePlaceholder}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>{t.subscribeBtn}</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
            {subscribedMessage && (
              <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                {t.smsSubscribedToast}
              </p>
            )}
          </div>

          {/* Col 2: Why Choose */}
          <div className="space-y-4 pt-6 md:pt-0 pl-0 lg:pl-4 pr-0 lg:pr-4">
            <h3 className="font-bold text-sm text-slate-900">{t.whyChooseTitle}</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature1Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature1Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature5Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature5Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature2Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature2Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature7Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature7Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature4Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature4Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] text-slate-900">{t.feature3Title}</p>
                  <p className="text-[10px] text-slate-500">{t.feature3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Testimonials */}
          <div className="space-y-3 pt-6 lg:pt-0 pl-0 lg:pl-4 pr-0 lg:pr-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{t.reviewsTitle}</h3>
              <Quote className="w-5 h-5 text-red-500 fill-red-100" />
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{lang === 'AR' ? currentReview.textAr : currentReview.text}"
            </p>
            <div className="flex items-center gap-0.5 text-red-500 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-900">- {currentReview.name}</p>
            <p className="text-[10px] text-slate-500">{currentReview.location}</p>
            <div className="flex items-center justify-between pt-2">
              <button onClick={prevTestimonial} className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1">
                {testimonials.map((_, idx) => (
                  <span key={idx} className={`rounded-full ${idx === activeTestimonialIdx ? 'w-2 h-2 bg-red-600' : 'w-1.5 h-1.5 bg-slate-300'}`} />
                ))}
              </div>
              <button onClick={nextTestimonial} className="p-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 4: Achievements */}
          <div className="space-y-4 pt-6 lg:pt-0 pl-0 lg:pl-4">
            <h3 className="font-bold text-sm text-slate-900">Our Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-xs text-slate-900">25,000+</p>
                  <p className="text-[10px] text-slate-500">{t.statPilgrims}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-xs text-slate-900">10+</p>
                  <p className="text-[10px] text-slate-500">{t.statYears}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-xs text-slate-900">100+</p>
                  <p className="text-[10px] text-slate-500">{t.statDepartures}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-extrabold text-xs text-slate-900">24/7</p>
                  <p className="text-[10px] text-slate-500">{t.statSupport}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* RECENT GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">Media Highlights</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">Recent Gallery Uploads</h2>
            </div>
            <button
              onClick={() => setActivePage('gallery')}
              className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gallery.slice(0, 6).map((item) => {
              const isVideoItem = isVideo(item);
              // Use thumbnailUrl for videos, otherwise use imageUrl
              const displayImage = isVideoItem ? (item.thumbnailUrl || item.imageUrl) : item.imageUrl;
              const fullImageUrl = displayImage ? getFullImageUrl(displayImage) : '';
              
              return (
                <div 
                  key={item.id} 
                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer group"
                  onClick={() => setActivePage('gallery')}
                >
                  {fullImageUrl ? (
                    <img 
                      src={fullImageUrl} 
                      alt={item.titleEn} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : isVideoItem ? (
                    <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                      <Video className="w-8 h-8 text-[#C8102E] opacity-50" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#F9FAFB] flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#718096] opacity-50" />
                    </div>
                  )}
                  
                  {isVideoItem && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                      <div className="w-10 h-10 rounded-full bg-[#C8102E]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-[10px] text-white font-bold truncate">{item.titleEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};