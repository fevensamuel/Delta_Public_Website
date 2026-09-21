import React, { useState, useEffect, useCallback } from 'react';
import { 
  PackageItem, 
  Language, 
  Currency,
  PageId, 
  Testimonial,
  GalleryItem
} from '../types';
import { translations } from '../translations';
import { formatPrice, formatPriceRange } from '../utils/formatPrice';
import { subscribePhoneSms, trackAndOpenWhatsApp, fetchPackages, fetchGalleryItems, getFullImageUrl } from '../api/client';
import { useExchangeRate } from '../api/exchangeRate';
import { getPublicTestimonialsApi } from '../api/testimonials';
import { FlightBookingModal } from '../components/FlightBookingModal';
import { AIRLINE_PARTNERS } from '../data/airlines';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContactSettings } from '../hooks/useContactSettings';
import { 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Users, 
  Award, 
  Clock, 
  Send, 
  ArrowRight, 
  Plane, 
  Bell,
  UserCheck,
  Loader2,
  Video,
  Image as ImageIcon,
  Play,
  Trophy,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';

interface HomeProps {
  setActivePage: (page: PageId) => void;
  onSelectPackage: (pkg: PackageItem) => void;
  onSubscribeSms: (phone: string) => void;
  lang: Language;
  currency: Currency;
}

// Fallback testimonials in case API fails
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Ahmed Mohammed',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'An unforgettable spiritual journey! Delta Travel made our Umrah experience seamless and stress-free.',
    textAr: 'رحلة روحية لا تنسى! جعلت دلتا ترافيل تجربة العمرة لدينا سلسة وخالية من الإجهاد.',
    textAm: 'የማይረሳ መንፈሳዊ ጉዞ! ዴልታ ትራቭል የኡምራ ቆይታችንን የተሳካ እና ከጭንቀት ነፃ አድርጎልናል።',
    date: '2026-01-15',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    name: 'Fatima Zewde',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'The best travel agency for Umrah! Everything was perfectly organized from flights to accommodations.',
    textAr: 'أفضل وكالة سفر للعمرة! كل شيء كان منظمًا بشكل مثالي من الرحلات إلى الإقامة.',
    textAm: 'ለኡምራ ጉዞ ምርጡ የጉዞ ወኪል! ከበረራ ጀምሮ እስከ ማረፊያ ድረስ ሁሉም ነገር በሚገባ የተደራጀ ነበር።',
    date: '2026-01-20',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    name: 'Bilal Ibrahim',
    location: 'Addis Ababa, Ethiopia',
    rating: 5,
    text: 'I highly recommend Delta Travel for anyone planning Umrah. The team was professional and responsive.',
    textAr: 'أنصح بشدة دلتا ترافيل لأي شخص يخطط للعمرة. كان الفريق محترفًا ومستجيبًا.',
    textAm: 'ለኡምራ እቅድ ላለው ማንኛውም ሰው ዴልታ ትራቭልን አጥብቄ እመክራለሁ። ቡድኑ ሙያዊ እና ፈጣን ምላሽ ሰጪ ነበር።',
    date: '2026-02-01',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const Home: React.FC<HomeProps> = ({
  setActivePage,
  onSelectPackage,
  onSubscribeSms,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const { phoneNumber, whatsappNumber } = useContactSettings();
  const cleanHomePhone = (phoneNumber || '+251910136747').replace(/[^0-9+]/g, '');
  const cleanHomeWhatsApp = (whatsappNumber || '251910136747').replace(/[^0-9]/g, '');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);

  // Data states
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  // Reveal sections as they scroll into view
  useScrollReveal([loading, packages.length, gallery.length]);

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    try {
      const [pkgData, galData, testimonialData] = await Promise.all([
        fetchPackages(undefined, lang),
        fetchGalleryItems('all'),
        getPublicTestimonialsApi().catch(() => [])
      ]);
      
      setPackages(pkgData.slice(0, 6));
      setGallery(galData.slice(0, 6));
      
      if (testimonialData && testimonialData.length > 0) {
        const validTestimonials = testimonialData.filter((t: any) => t.name && t.text);
        if (validTestimonials.length > 0) {
          setTestimonials(validTestimonials);
          setActiveTestimonialIdx(0);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } else {
        setTestimonials(FALLBACK_TESTIMONIALS);
      }
    } catch (e) {
      console.error('Home data loading error:', e);
      setTestimonials(FALLBACK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const [testimonialPaused, setTestimonialPaused] = useState(false);
  useEffect(() => {
    if (testimonials.length <= 1 || testimonialPaused) return;
    const id = window.setInterval(() => {
      setActiveTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [testimonials.length, testimonialPaused]);

  const nextTestimonial = () => {
    setActiveTestimonialIdx((i) => (i + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadHomeData();
      }
    };
    const handleFocus = () => {
      loadHomeData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadHomeData]);

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

  const isVideo = (item: any): boolean => {
    return item.type === 'Video' || item.type === 'video';
  };

  const getDisplayPrice = (pkg: PackageItem) => {
    const priceUsd = pkg.priceUsd ?? pkg.price;
    const priceEtb = pkg.priceEtb;
    const priceSar = pkg.priceSar;
    
    const hasRange = pkg.priceType === 'range' || (pkg.priceUsdMax && pkg.priceUsdMax > priceUsd);
    
    if (hasRange) {
      return formatPriceRange(
        pkg.priceUsdMin ?? priceUsd,
        pkg.priceUsdMax ?? priceUsd,
        pkg.priceEtbMin ?? priceEtb,
        pkg.priceEtbMax ?? priceEtb,
        pkg.priceSarMin ?? priceSar,
        pkg.priceSarMax ?? priceSar,
        currency,
        lang,
        rate
      );
    }
    
    return formatPrice(priceUsd, priceEtb, priceSar, currency, lang, rate);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B655A] space-y-4 bg-[#FAF7F2] min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#7A0C1F]" />
        <p className="text-xs tracking-wide">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] text-[#1A1712]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0E0C0A]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/photos/haram-night-crowd.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-36 pb-10 sm:pt-44">
          <div className="max-w-xl py-10 sm:py-14">
            <span className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-[#D8B978] mb-6">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l2.4 7.2H22l-6.2 4.4 2.4 7.2L12 16.4 5.8 20.8l2.4-7.2L2 9.2h7.6z" strokeLinejoin="round" />
              </svg>
              {t.licensedBadge}
            </span>

            <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-[62px] leading-[1.1] text-[#FAF7F2]">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#E7E2D9] max-w-md mt-6">
              {t.heroSubTitle}
            </p>

            <div className="pt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActivePage('packages')}
                className="bg-[#7A0C1F] hover:bg-[#580815] text-white text-xs sm:text-sm tracking-wide px-7 py-4 transition-colors flex items-center gap-2"
              >
                <span>{t.explorePackages}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>

              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/${cleanHomeWhatsApp}?text=${encodeURIComponent('General Umrah Inquiry')}`,
                    '_blank'
                  )
                }
                className="border border-white/40 hover:border-white text-white text-xs sm:text-sm tracking-wide px-7 py-4 transition-colors flex items-center gap-2"
              >
                <span>{t.chatWhatsapp}</span>
              </button>
            </div>

            <div className="pt-10 flex items-center gap-6 text-[#B8B2A6]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#A6853A] rounded-full" />
                <span className="text-xs">{t.trustedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D8B978] text-sm">★</span>
                <span className="text-xs">{t.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 bg-black/70 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#F1EBE0]">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-[#A6853A] flex-shrink-0" />
              <span>{t.bestPackageLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Plane className="w-4 h-4 text-[#A6853A] flex-shrink-0" />
              <span>{t.flightsLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-[#A6853A] flex-shrink-0" />
              <span>{t.supportLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Award className="w-4 h-4 text-[#A6853A] flex-shrink-0" />
              <span>{t.trustedAgencyLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* BEST UMRAH PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 reveal pattern-texture">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-serif italic text-sm text-[#7A0C1F] mb-3">{t.bestPackagesTitle}</p>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl leading-tight max-w-lg">{t.packages}</h2>
          </div>
          <button
            onClick={() => setActivePage('packages')}
            className="text-xs tracking-wide text-[#1A1712] border-b border-black/20 pb-1 flex items-center gap-2 hover:border-black/50 transition-colors flex-shrink-0"
          >
            <span>{t.viewAllPackages}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-black/[0.08]">
          {packages.map((pkg, idx) => {
            const imageUrl = pkg.imageUrl ? getFullImageUrl(pkg.imageUrl) : '';
            const hasDiscounts = pkg.discounts && pkg.discounts.length > 0;
            const displayPrice = getDisplayPrice(pkg);

            return (
              <div
                key={pkg.id}
                className={`p-8 border-b border-black/[0.08] hover:bg-[#F1EBE0]/60 transition-colors flex flex-col ${idx % 2 === 0 ? 'sm:border-r' : ''} ${idx % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0'}`}
              >
                <div className="relative h-44 arch-crop overflow-hidden bg-[#EAE4D8] mb-6">
                  {imageUrl ? (
                    <img src={imageUrl} alt={pkg.titleEn} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-end justify-center pb-4 text-[10px] tracking-wide text-[#9A9488]">
                      {pkg.category}
                    </div>
                  )}
                </div>

                <p className="text-[11px] tracking-[0.08em] uppercase text-[#7A0C1F] mb-2">{pkg.category}</p>

                <h3 className="font-serif text-xl leading-snug mb-3">
                  {((lang || '').toUpperCase() === 'AR') ? pkg.titleAr : (((lang || '').toUpperCase() === 'AM') && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
                </h3>

                <div className="flex items-center gap-1.5 text-[13px] text-[#6B655A] mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pkg.durationDays} {t.daysLabel || 'Days'}</span>
                </div>

                <div className="pt-5 border-t border-black/[0.08] mt-auto flex items-baseline justify-between">
                  <span className="text-xs text-[#6B655A]">{t.perPerson}</span>
                  <span className="font-serif text-2xl text-[#7A0C1F]">{displayPrice}</span>
                </div>

                {hasDiscounts && (
                  <div className="mt-2 space-y-1">
                    {pkg.discounts?.filter(d => d.isActive !== false).map((discount, di) => {
                      const discountLabel = ((lang || '').toUpperCase() === 'AR' && discount.labelAr)
                        ? discount.labelAr
                        : (((lang || '').toUpperCase() === 'AM' && discount.labelAm) ? discount.labelAm : discount.label);
                      return (
                        <div key={di} className="text-[12px] font-medium text-emerald-700">
                          {discountLabel}: {discount.type === 'percentage' ? `${discount.value}% ${t.offLabel || 'off'}` : `$${discount.value} ${t.offLabel || 'off'}`}
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="mt-6 w-full text-xs tracking-wide border border-black/15 py-3 flex items-center justify-center gap-2 hover:border-[#7A0C1F] hover:text-[#7A0C1F] transition-colors"
                >
                  <span>{t.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center reveal">
        <div className="relative h-[360px] hidden lg:block">
          <div
            className="arch-crop absolute inset-0 bg-cover bg-center border-2 border-[#A6853A]/60"
            style={{ backgroundImage: `url('/photos/sheikh-zayed-mosque-day.jpg')` }}
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[#7A0C1F] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.licensedBadge}
          </span>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl leading-tight mb-4">{t.whyChooseTitle}</h2>
          <p className="text-sm text-[#6B655A] leading-relaxed max-w-lg mb-9">{t.whyChooseSub}</p>

          <div className="space-y-6">
            {[
              { title: t.feature1Title, desc: t.feature1Desc, icon: Award },
              { title: t.feature5Title, desc: t.feature5Desc, icon: ShieldCheck },
              { title: t.feature4Title, desc: t.feature4Desc, icon: UserCheck },
              { title: t.feature3Title, desc: t.feature3Desc, icon: CheckCircle },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[#F1EBE0] border border-[#A6853A]/50 text-[#A6853A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-medium text-[15px] text-[#1A1712]">{f.title}</p>
                  <p className="text-[13px] text-[#6B655A] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICIAL FLIGHT PARTNERS */}
      <section className="bg-[#0E0C0A] border-y border-white/10 overflow-hidden">
        <div className="marquee-viewport py-5">
          <div className="marquee-track">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center flex-shrink-0" aria-hidden={rep === 1}>
                {AIRLINE_PARTNERS.map((a) => (
                  <span
                    key={`${rep}-${a.id}`}
                    className="flex items-center gap-3 text-[#CFCAC2] text-sm tracking-wide whitespace-nowrap px-8"
                  >
                    <Plane className="w-3.5 h-3.5 text-[#A6853A] rtl:-scale-x-100" />
                    {a.name}
                    <span className="text-[#A6853A]/50">|</span>
                    <span className="text-[#9A9488] text-xs">{a.code}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[#7A0C1F] mb-4">
            <Plane className="w-3.5 h-3.5" />
            {t.flightPartnersLabel}
          </span>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl leading-tight">{t.anyTicketBooking}</h2>
        </div>

        <div className="marquee-viewport">
          <div className="marquee-track marquee-track--cards">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-stretch gap-6 pr-6 flex-shrink-0" aria-hidden={rep === 1}>
                {AIRLINE_PARTNERS.map((airline) => (
                  <div key={`${rep}-${airline.id}`} className="relative overflow-hidden h-64 w-[320px] flex-shrink-0 group cursor-default">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${airline.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 transition-colors duration-500 group-hover:from-black/95" />
                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{airline.flag}</span>
                        <div>
                          <h3 className="font-serif text-lg text-white leading-none">{airline.name}</h3>
                          <p className="text-[11px] text-[#D8B978] mt-1">IATA: {airline.code} · {airline.alliance}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] text-[#E7E2D9] mb-1">{airline.hub}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px]">
                          <span className="text-white">{airline.frequency}</span>
                          <span className="text-[#D8B978]">{airline.badge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUEST A FLIGHT QUOTE */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/photos/madinah-night-aerial.jpg')` }}
        />
        <div className="absolute inset-0 bg-[#0E0C0A]/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[#D8B978] mb-4 justify-center">
            <Plane className="w-3.5 h-3.5" />
            {t.directAssistance}
          </span>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#FAF7F2] leading-tight mb-5">
            {t.anyTicketBooking}
          </h2>
          <p className="text-sm sm:text-base text-[#CFCAC2] max-w-xl mx-auto leading-relaxed mb-10">
            {t.customFlight}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsFlightModalOpen(true)}
              className="bg-[#7A0C1F] hover:bg-[#580815] text-white text-xs sm:text-sm tracking-wide px-7 py-4 transition-colors flex items-center gap-2"
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{t.inquiry}</span>
            </button>
            <a
              href={`tel:${cleanHomePhone}`}
              className="border border-white/40 hover:border-white text-white text-xs sm:text-sm tracking-wide px-7 py-4 transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.callNow}</span>
            </a>
          </div>
        </div>
      </section>

      {/* OFFICE INFO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 reveal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/[0.08]">
          <div className="bg-white p-8">
            <span className="w-11 h-11 rounded-full bg-[#F1EBE0] text-[#7A0C1F] flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-lg mb-2">{t.ourLocation}</h3>
            <p className="text-[13px] text-[#6B655A] leading-relaxed">
              {t.addressBuilding || "Bole Friendship Building, 4th Floor, Office 408"}
              <br />
              {t.addressCity || "Addis Ababa, Ethiopia"}
            </p>
          </div>

          <div className="bg-white p-8">
            <span className="w-11 h-11 rounded-full bg-[#F1EBE0] text-[#7A0C1F] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-lg mb-2">{t.officeHours}</h3>
            <p className="text-[13px] text-[#6B655A] leading-relaxed">
              <span className="text-[#1A1712]">{t.monToSatLabel || "Monday – Saturday:"}</span> {t.monToSatTime || "2:30 AM – 11:30 PM LT"}
              <br />
              <span className="text-[#1A1712]">{t.sunAndHolidaysLabel || "Sunday & Holidays:"}</span> {t.sunAndHolidaysDesc || "On-call WhatsApp Assistance"}
            </p>
          </div>

          <div className="bg-white p-8">
            <span className="w-11 h-11 rounded-full bg-[#F1EBE0] text-[#7A0C1F] flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-lg mb-2">{t.contactUs}</h3>
            <div className="space-y-1.5 text-[13px] text-[#6B655A]">
              <a href={`tel:${cleanHomePhone}`} dir="ltr" className="flex items-center gap-2 hover:text-[#7A0C1F] whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> {phoneNumber || '+251 91 013 6747'}
              </a>
              <a href="tel:+251956585555" dir="ltr" className="flex items-center gap-2 hover:text-[#7A0C1F] whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> +251 95 658 5555
              </a>
              <a href="tel:+251956595555" dir="ltr" className="flex items-center gap-2 hover:text-[#7A0C1F] whitespace-nowrap">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> +251 95 659 5555
              </a>
              <a href="mailto:businessdelta416@gmail.com" className="flex items-center gap-2 hover:text-[#7A0C1F] pt-1 border-t border-black/[0.06]">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> businessdelta416@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 reveal">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-serif italic text-sm text-[#7A0C1F] mb-2">{t.recentGallery}</p>
            <h2 className="font-serif font-medium text-2xl sm:text-3xl leading-tight">{t.recentGalleryTitle}</h2>
          </div>
          <button
            onClick={() => setActivePage('gallery')}
            className="text-xs tracking-wide text-[#1A1712] border-b border-black/20 pb-1 flex items-center gap-2 hover:border-black/50 transition-colors flex-shrink-0"
          >
            {t.viewAll} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gallery.slice(0, 6).map((item) => {
            const isVideoItem = isVideo(item);
            const displayImage = isVideoItem ? (item.thumbnailUrl || item.imageUrl) : item.imageUrl;
            const fullImageUrl = displayImage ? getFullImageUrl(displayImage) : '';

            return (
              <div
                key={item.id}
                className="relative aspect-square overflow-hidden bg-[#F1EBE0] cursor-pointer group"
                onClick={() => setActivePage('gallery')}
              >
                {fullImageUrl ? (
                  <img src={fullImageUrl} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : isVideoItem ? (
                  <div className="w-full h-full bg-[#17130F] flex items-center justify-center">
                    <Video className="w-7 h-7 text-[#A6853A] opacity-60" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-[#C9C2B3] opacity-60" />
                  </div>
                )}

                {isVideoItem && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                    <div className="w-9 h-9 rounded-full bg-[#7A0C1F]/90 text-white flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white truncate">{item.titleEn}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SMS SIGNUP + ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20 reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/[0.08]">

          <div className="bg-white p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-[#F1EBE0] flex items-center justify-center text-[#7A0C1F] flex-shrink-0">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="font-serif text-lg">{t.smsBannerTitle}</h3>
            </div>
            <p className="text-[13px] text-[#6B655A] leading-relaxed">{t.smsBannerSub}</p>
            <form onSubmit={handleSmsFormSubmit} className="space-y-2 pt-1">
              <input
                type="tel"
                required
                placeholder={t.enterPhonePlaceholder}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-black/10 px-3 py-2.5 text-sm text-[#1A1712] placeholder-[#9A9488] focus:outline-none focus:border-[#7A0C1F]"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-black/10 px-3 py-2.5 text-sm text-[#1A1712] placeholder-[#9A9488] focus:outline-none focus:border-[#7A0C1F]"
              />
              <button
                type="submit"
                className="w-full bg-[#7A0C1F] hover:bg-[#580815] text-white text-xs tracking-wide py-3 transition-colors flex items-center justify-center gap-2"
              >
                <span>{t.subscribeBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribedMessage && (
              <p className="text-[12px] text-emerald-700 bg-emerald-50 p-2.5 border border-emerald-200">
                {t.smsSubscribedToast}
              </p>
            )}
          </div>

          <div className="bg-white p-8 space-y-5">
            <h3 className="font-serif text-lg">{t.ourAchievements}</h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#7A0C1F] flex-shrink-0" />
                <div>
                  <p className="font-serif text-lg leading-none">25,000+</p>
                  <p className="text-[11px] text-[#9A9488] mt-1">{t.statPilgrims}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#7A0C1F] flex-shrink-0" />
                <div>
                  <p className="font-serif text-lg leading-none">5+</p>
                  <p className="text-[11px] text-[#9A9488] mt-1">{t.statYears}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4 text-[#7A0C1F] flex-shrink-0" />
                <div>
                  <p className="font-serif text-lg leading-none">100+</p>
                  <p className="text-[11px] text-[#9A9488] mt-1">{t.statDepartures}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-[#7A0C1F] flex-shrink-0" />
                <div>
                  <p className="font-serif text-lg leading-none">27</p>
                  <p className="text-[11px] text-[#9A9488] mt-1">{t.successfulRounds}</p>
                </div>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/Delta+Travel/@8.9898287,38.785905,17z/data=!4m8!3m7!1s0x164b85372f9878d1:0x1385d361c5cfcdd9!8m2!3d8.9898287!4d38.785905!9m1!1b1!16s%2Fg%2F11zbgfkl8j?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1A1712] hover:bg-black text-white text-xs tracking-wide py-3.5 flex items-center gap-2 justify-center transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{t.reviewUs}</span>
            </a>
          </div>

        </div>
      </section>

      {/* PILGRIM TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 reveal">
          <div
            className="max-w-3xl mx-auto px-4 sm:px-8 text-center"
            onMouseEnter={() => setTestimonialPaused(true)}
            onMouseLeave={() => setTestimonialPaused(false)}
          >
            <Quote className="w-8 h-8 mx-auto mb-6 text-[#A6853A]" strokeWidth={1.2} />

            <h2 className="font-serif font-medium text-2xl sm:text-3xl leading-tight mb-2">{t.reviewsTitle}</h2>
            <p className="text-sm text-[#6B655A] mb-10">{t.reviewsSub}</p>

            {(() => {
              const item = testimonials[activeTestimonialIdx % testimonials.length];
              if (!item) return null;
              const isAr = (lang || '').toUpperCase() === 'AR';
              const isAm = (lang || '').toUpperCase() === 'AM';
              const quoteText = isAr && item.textAr ? item.textAr : (isAm && item.textAm ? item.textAm : item.text);
              const name = isAr && item.nameAr ? item.nameAr : (isAm && item.nameAm ? item.nameAm : item.name);
              const location = isAr && item.locationAr ? item.locationAr : (isAm && item.locationAm ? item.locationAm : item.location);

              return (
                <div key={item.id}>
                  <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[#1A1712] mb-8">
                    &ldquo;{quoteText}&rdquo;
                  </p>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < (item.rating || 5) ? 'fill-[#A6853A] text-[#A6853A]' : 'fill-black/10 text-black/10'}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm font-medium text-[#1A1712]">{name}</p>
                  <p className="text-xs text-[#9A9488] uppercase tracking-wide mt-0.5">{location}</p>
                </div>
              );
            })()}

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="w-9 h-9 rounded-full border border-black/10 text-[#4A463F] hover:border-[#7A0C1F] hover:text-[#7A0C1F] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>

                <div className="flex items-center gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      aria-label={`Go to testimonial ${idx + 1}`}
                      className={`rounded-full transition-all ${
                        idx === activeTestimonialIdx ? 'w-5 h-1.5 bg-[#7A0C1F]' : 'w-1.5 h-1.5 bg-black/15 hover:bg-black/30'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="w-9 h-9 rounded-full border border-black/10 text-[#4A463F] hover:border-[#7A0C1F] hover:text-[#7A0C1F] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/photos/nabawi-sunset.jpg')` }}
        />
        <div className="absolute inset-0 bg-[#0E0C0A]/80" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 mx-auto mb-7 text-[#D8B978]" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2l2.4 7.2H22l-6.2 4.4 2.4 7.2L12 16.4 5.8 20.8l2.4-7.2L2 9.2h7.6z" strokeLinejoin="round" />
          </svg>

          <h2 className="font-serif font-medium text-3xl sm:text-5xl text-[#FAF7F2] leading-tight mb-5">
            {t.ctaTitle || t.heroTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#CFCAC2] max-w-xl mx-auto leading-relaxed mb-10">
            {t.ctaSubtitle || t.heroSubTitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('packages')}
              className="bg-[#7A0C1F] hover:bg-[#580815] text-white text-xs sm:text-sm tracking-wide px-8 py-4 transition-colors flex items-center gap-2"
            >
              <span>{t.explorePackages}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="border border-white/40 hover:border-white hover:bg-white/5 text-white text-xs sm:text-sm tracking-wide px-8 py-4 transition-colors"
            >
              {t.contactUs}
            </button>
          </div>
        </div>
      </section>

      <FlightBookingModal isOpen={isFlightModalOpen} onClose={() => setIsFlightModalOpen(false)} />

    </div>
  );
};