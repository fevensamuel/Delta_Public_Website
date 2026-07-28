import React, { useState } from 'react';
import { 
  PackageItem, 
  Language, 
  Currency,
  PageId, 
  Testimonial 
} from '../types';
import { translations } from '../translations';
import { formatPrice } from '../utils/formatPrice';
import { subscribePhoneSms, trackAndOpenWhatsApp } from '../api/client';
import { AIRLINE_PARTNERS } from '../data/airlines';
import { useExchangeRate } from '../api/exchangeRate';
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
  Briefcase,
  Utensils,
  Sparkles
} from 'lucide-react';

interface HomeProps {
  packages: PackageItem[];
  testimonials: Testimonial[];
  setActivePage: (page: PageId) => void;
  onSelectPackage: (pkg: PackageItem) => void;
  onSubscribeSms: (phone: string) => void;
  lang: Language;
  currency: Currency;
}

export const Home: React.FC<HomeProps> = ({
  packages,
  testimonials,
  setActivePage,
  onSelectPackage,
  onSubscribeSms,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const [phoneInput, setPhoneInput] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const handleSmsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    try {
      await subscribePhoneSms(phoneInput, lang);
    } catch {
      // Fallback
    }
    onSubscribeSms(phoneInput);
    setSubscribedMessage(true);
    setPhoneInput('');
    setTimeout(() => setSubscribedMessage(false), 5000);
  };

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[activeTestimonialIdx] || testimonials[0];

  // Umrah-only packages display
  const displayPackages = packages.slice(0, 4);

  return (
    <div className="space-y-12 pb-12 bg-[#F9F9F9] text-slate-800">
      
      {/* SECTION A: HERO / MAIN BANNER */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden bg-slate-900 text-slate-900">
        {/* Background Kaaba Image */}
        <div 
          className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1920')` }}
        />

        {/* Soft Left Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:to-white/30 rtl:bg-gradient-to-l" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
          <div className="max-w-xl space-y-5">
            
            {/* Red Eyebrow */}
            <p className="text-xs sm:text-sm font-extrabold text-[#C8102E] tracking-widest uppercase">
              {t.licensedBadge}
            </p>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-sans text-slate-900 leading-tight">
              {t.heroTitle}
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {t.heroSubTitle}
            </p>

            {/* CTA Buttons */}
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

      {/* OVERLAPPING QUICK BENEFITS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse divide-slate-100">
          
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">{t.bestPackagesTitle}</h4>
              <p className="text-[10px] text-slate-500">{t.bestPackagesSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">{t.visaServiceTitle}</h4>
              <p className="text-[10px] text-slate-500">Official E-Visa Clearance</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-3 sm:pt-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Luxury Hotels</h4>
              <p className="text-[10px] text-slate-500">Near to Haram</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-3 lg:pt-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Direct Flights</h4>
              <p className="text-[10px] text-slate-500">Ethiopian Airlines & Saudia</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-3 lg:pt-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">{t.supportTitle}</h4>
              <p className="text-[10px] text-slate-500">Dedicated Mutawwif</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-3 lg:pt-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">{t.feature3Title}</h4>
              <p className="text-[10px] text-slate-500">100% Licensed Agency</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B: OUR BEST UMRAH PACKAGES */}
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

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img 
                    src={pkg.imageUrl || pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow">
                    {pkg.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pkg.durationDays} Days</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Hotel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pkg.hotelCategory}</span>
                    </span>
                  </div>

                  {/* Currency Price Display */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">{t.perPerson}</span>
                      <span className="text-base font-extrabold text-[#C8102E]">
                        {formatPrice(pkg.priceUsd, currency, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Details CTA */}
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
          ))}
        </div>
      </section>

      {/* SECTION C: STATIC AIRLINE PARTNERS SHOWCASE (Requirement #1) */}
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
            <button
              onClick={() => setActivePage('hotels-flights')}
              className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              <span>View Airline Partner Details</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AIRLINE_PARTNERS.map((airline) => (
              <div 
                key={airline.id} 
                className="relative overflow-hidden rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col justify-between space-y-4 group"
              >
                {/* Airplane Background Photo with Dark Overlay */}
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

      {/* SECTION D: 4-COLUMN FEATURE & UPDATES CARD SECTION */}
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

          {/* Col 2: Why Choose Delta Travel? */}
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

          {/* Col 3: What Our Clients Say */}
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

            <p className="text-[11px] font-bold text-slate-900">
              - {currentReview.name}
            </p>
            <p className="text-[10px] text-slate-500">{currentReview.location}</p>

            {/* Pagination Controls */}
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

          {/* Col 4: Our Achievements */}
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

    </div>
  );
};
