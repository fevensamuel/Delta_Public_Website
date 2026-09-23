import React, { useState } from 'react';
import { PackageItem, Language, Currency } from '../types';
import { PageBanner } from '../components/PageBanner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContactSettings } from '../hooks/useContactSettings';
import { translations } from '../translations';
import { formatPrice, formatPriceRange } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { getFullImageUrl } from '../api/client';
import { 
  Star, 
  CheckCircle, 
  Filter, 
  ChevronRight,
  MessageSquare,
  Clock,
  Tag,
  Users,
  User,
  Percent
} from 'lucide-react';

interface PackagesProps {
  packages: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  lang: Language;
  currency: Currency;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export const Packages: React.FC<PackagesProps> = ({
  packages,
  onSelectPackage,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;

  useScrollReveal([]);
  const { rate } = useExchangeRate();
  const { whatsappNumber } = useContactSettings();

  // Clean WhatsApp number for wa.me links
  const cleanWhatsApp = (whatsappNumber || '251910136747').replace(/[^0-9]/g, '');

  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Economy' | 'Standard' | 'Premium' | 'VIP'>('All');
  const [discountFilter, setDiscountFilter] = useState<'All' | 'HasDiscount' | 'NoDiscount'>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');

  const filteredPackages = packages
    .filter((pkg) => {
      if (categoryFilter !== 'All' && pkg.category !== categoryFilter) return false;
      
      if (discountFilter === 'HasDiscount') {
        const hasActiveDiscount = pkg.discounts && pkg.discounts.some(d => d.isActive !== false);
        if (!hasActiveDiscount) return false;
      }
      if (discountFilter === 'NoDiscount') {
        const hasActiveDiscount = pkg.discounts && pkg.discounts.some(d => d.isActive !== false);
        if (hasActiveDiscount) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.priceUsd ?? a.price) - (b.priceUsd ?? b.price);
      if (sortBy === 'price-desc') return (b.priceUsd ?? b.price) - (a.priceUsd ?? a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const getDisplayPrice = (pkg: PackageItem) => {
    const priceUsd = pkg.priceUsd ?? pkg.price;
    const priceEtb = pkg.priceEtb;
    const priceSar = pkg.priceSar;
    
    if (pkg.priceType === 'range') {
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

  const getDiscountType = (discount: any): 'age' | 'group' | 'general' => {
    if (discount.discountType === 'age') return 'age';
    if (discount.discountType === 'group') return 'group';
    
    const hasAgeField = (discount.ageMin !== undefined && discount.ageMin !== null) || 
                        (discount.ageMax !== undefined && discount.ageMax !== null) ||
                        (discount.ageGroup && discount.ageGroup.trim() !== '');
    
    const hasGroupField = (discount.minPersons !== undefined && discount.minPersons !== null) || 
                          (discount.maxPersons !== undefined && discount.maxPersons !== null);
    
    if (hasAgeField) return 'age';
    if (hasGroupField) return 'group';
    return 'general';
  };

  const getDiscountIcon = (type: 'age' | 'group' | 'general') => {
    if (type === 'age') return <User className="w-3.5 h-3.5 text-[#A6853A] flex-shrink-0" />;
    if (type === 'group') return <Users className="w-3.5 h-3.5 text-[#A6853A] flex-shrink-0" />;
    return <Percent className="w-3.5 h-3.5 text-[#A6853A] flex-shrink-0" />;
  };

  const getDiscountColor = () => 'bg-[#F1EBE0] border-[#A6853A]/30';
  const getDiscountTextColor = () => 'text-[#7A0C1F]';

  // Build the WhatsApp message and open with the dynamic number
  const openWhatsAppForPackage = (pkg: PackageItem) => {
    const titleForWhatsapp = ((lang || '').toUpperCase() === 'AR' && pkg.titleAr)
      ? pkg.titleAr
      : (((lang || '').toUpperCase() === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.titleEn);

    const priceUsd = pkg.priceUsd ?? pkg.price;

    // Build language-aware message
    const currentLang = (lang || 'en').toLowerCase();
    let msg: string;
    if (currentLang.startsWith('ar')) {
      msg = `السلام عليكم دلتا للسياحة! أود الاستفسار عن باقة "${titleForWhatsapp}"${priceUsd ? ` (بقيمة $${priceUsd} دولار)` : ''}. يرجى تزويدي بمزيد من التفاصيل.`;
    } else if (currentLang.startsWith('am')) {
      msg = `ስለ "${titleForWhatsapp}" ጥቅል ዝርዝር መረጃ ማግኘት እፈልጋለሁ${priceUsd ? ` ($${priceUsd} ዶላር)` : ''}። እባክዎ ተጨማሪ መረጃ ያጋሩኝ።`;
    } else {
      msg = `I am interested in inquiring about the "${titleForWhatsapp}" package${priceUsd ? ` (USD $${priceUsd})` : ''}. Please share more details.`;
    }

    // Track the click in the backend (fire-and-forget)
    fetch(`${API_BASE_URL}/packages/${pkg.id}/click-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});

    // Open WhatsApp with the dynamic number
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="pattern-texture">
      
      <PageBanner 
        badge={t.packagesPageBadge}
        title={t.packagesPageTitle}
        subtitle={t.packagesPageSubtitle}
        backgroundImage="/photos/kaaba-day-pilgrims.jpg"
      />
<section className="max-w-7xl mx-auto px-4 sm:px-8 reveal pt-8 pb-6">
  <div className="border-b border-black/[0.08] dark:border-white/[0.08] pb-6">

    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--theme-muted)] w-[80px] flex-shrink-0">
        {t.categoryLabel}
      </span>

      <div className="flex flex-wrap gap-2">
        {(['All', 'Economy', 'Standard', 'Premium', 'VIP'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 text-sm border transition-all duration-300 ${
              categoryFilter === cat
                ? 'bg-[#7A0C1F] border-[#7A0C1F] text-white'
                : 'bg-transparent border-black/10 dark:border-white/10 text-[var(--theme-text)] hover:border-[#7A0C1F] hover:text-[#7A0C1F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-5">

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--theme-muted)] w-[80px] flex-shrink-0">
          {t.discountLabel}
        </span>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDiscountFilter('All')}
            className={`px-4 py-2 text-sm border transition-all duration-300 ${
              discountFilter === 'All'
                ? 'bg-[#7A0C1F] border-[#7A0C1F] text-white'
                : 'bg-transparent border-black/10 dark:border-white/10 text-[var(--theme-text)] hover:border-[#7A0C1F] hover:text-[#7A0C1F]'
            }`}
          >
            {t.all}
          </button>

          <button
            onClick={() => setDiscountFilter('HasDiscount')}
            className={`px-4 py-2 text-sm border transition-all duration-300 ${
              discountFilter === 'HasDiscount'
                ? 'bg-[#7A0C1F] border-[#7A0C1F] text-white'
                : 'bg-transparent border-black/10 dark:border-white/10 text-[var(--theme-text)] hover:border-[#7A0C1F] hover:text-[#7A0C1F]'
            }`}
          >
            {t.withDiscount}
          </button>

          <button
            onClick={() => setDiscountFilter('NoDiscount')}
            className={`px-4 py-2 text-sm border transition-all duration-300 ${
              discountFilter === 'NoDiscount'
                ? 'bg-[#7A0C1F] border-[#7A0C1F] text-white'
                : 'bg-transparent border-black/10 dark:border-white/10 text-[var(--theme-text)] hover:border-[#7A0C1F] hover:text-[#7A0C1F]'
            }`}
          >
            {t.noDiscount}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 lg:ml-auto">
        <span className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--theme-muted)]">
          {t.sortByLabel || 'Sort'}
        </span>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-10 min-w-[190px] px-4 bg-transparent border border-black/10 dark:border-white/10 text-sm text-[var(--theme-text)] focus:outline-none focus:border-[#7A0C1F] cursor-pointer"
        >
          <option value="price-asc">{t.priceLowToHigh}</option>
          <option value="price-desc">{t.priceHighToLow}</option>
          <option value="rating">{t.highestRating}</option>
        </select>
      </label>

    </div>
  </div>
</section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 reveal pt-6">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20 border border-black/[0.08]">
            <div className="w-16 h-16 rounded-full bg-[#F1EBE0] border border-black/[0.06] flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-[#A6853A]" />
            </div>
            <p className="text-[#4A463F] text-sm">{t.noPackageMatch}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const imageUrl = pkg.imageUrl || pkg.image;
              const fullImageUrl = imageUrl ? getFullImageUrl(imageUrl) : '';
              const hasDiscounts = pkg.discounts && pkg.discounts.some(d => d.isActive !== false);
              const priceDisplay = getDisplayPrice(pkg);
              const activeDiscounts = pkg.discounts?.filter(d => d.isActive !== false) || [];

              return (
                <div
                  key={pkg.id}
                  className="bg-white overflow-hidden shadow-sm border border-black/[0.08] hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F1EBE0]">
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={pkg.titleEn || (pkg as any).title || 'Package image'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#EAE4D8] flex items-center justify-center text-[#9A9488]">No Image</div>
                    )}
                    
                    <div className="absolute top-3 left-3 bg-[#7A0C1F] text-white font-medium text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                      {pkg.category}
                    </div>

                    {hasDiscounts && (
                      <div className="absolute top-3 right-3 bg-[#7A0C1F] text-white font-medium text-[10px] px-2.5 py-1 uppercase tracking-wider shadow">
                        {(lang || '').toUpperCase() === 'AR' ? 'خصم' : 'Discount'}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-[#0E0C0A]/80 backdrop-blur-md px-2.5 py-1 border border-white/10/50 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#A6853A]" /> {pkg.durationDays} Days
                      </span>
                      <div className="bg-white text-[#7A0C1F] font-medium text-xs px-3 py-1.5 shadow">
                        <span>{priceDisplay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-[#7A0C1F] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#A6853A]" /> {pkg.rating || 4.8} ({pkg.reviewsCount || 0} reviews)
                        </span>
                        <span className="text-[#4A463F] font-medium text-sm">
                          {t.fromLabel || 'From'} {((lang || '').toUpperCase() === 'AR' && pkg.departureCityAr) ? pkg.departureCityAr : (((lang || '').toUpperCase() === 'AM' && pkg.departureCityAm) ? pkg.departureCityAm : pkg.departureCity)}
                        </span>
                      </div>

                      <h3 className="font-serif font-medium text-base text-[#1A1712] mb-2">
                        {((lang || '').toUpperCase() === 'AR') ? (pkg.titleAr || pkg.titleEn) : (((lang || '').toUpperCase() === 'AM') && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
                      </h3>

                      {hasDiscounts && activeDiscounts.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {activeDiscounts.map((discount, idx) => {
                            const type = getDiscountType(discount);
                            const discountLabel = ((lang || '').toUpperCase() === 'AR' && discount.labelAr)
                              ? discount.labelAr
                              : (((lang || '').toUpperCase() === 'AM' && discount.labelAm) ? discount.labelAm : discount.label);
                            const discountDesc = ((lang || '').toUpperCase() === 'AR' && discount.descriptionAr)
                              ? discount.descriptionAr
                              : (((lang || '').toUpperCase() === 'AM' && discount.descriptionAm) ? discount.descriptionAm : discount.description);
                            const ageGroup = ((lang || '').toUpperCase() === 'AR' && discount.ageGroupAr)
                              ? discount.ageGroupAr
                              : (((lang || '').toUpperCase() === 'AM' && discount.ageGroupAm) ? discount.ageGroupAm : discount.ageGroup);
                            
                            return (
                              <div 
                                key={idx} 
                                className={`flex items-start gap-2.5 text-sm p-2.5  border ${getDiscountColor()}`}
                              >
                                {getDiscountIcon(type)}
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className={`font-bold text-sm ${getDiscountTextColor()}`}>
                                      {discountLabel}
                                    </span>
                                    <span className={`text-sm font-semibold ${getDiscountTextColor()}`}>
                                      {discount.type === 'percentage' ? `${discount.value}% ${t.offLabel || 'off'}` : `$${discount.value} ${t.offLabel || 'off'}`}
                                    </span>
                                  </div>
                                  <div className="mt-0.5">
                                    {discountDesc && (
                                      <span className={`text-xs ${getDiscountTextColor()} opacity-75`}>
                                        {discountDesc}
                                      </span>
                                    )}
                                    {discount.minPersons && (
                                      <span className={`text-xs ${getDiscountTextColor()} opacity-75 ml-2`}>
                                        {discount.minPersons}+ {t.personsLabel || 'Persons'}
                                      </span>
                                    )}
                                    {ageGroup && (
                                      <span className={`text-xs ${getDiscountTextColor()} opacity-75 ml-2`}>
                                        {t.ageLabel || 'Age:'} {ageGroup}
                                      </span>
                                    )}
                                    {discount.ageMin !== undefined && discount.ageMin !== null && 
                                     discount.ageMax !== undefined && discount.ageMax !== null && (
                                      <span className={`block text-xs ${getDiscountTextColor()} opacity-75 mt-0.5`}>
                                        Ages {discount.ageMin}-{discount.ageMax}
                                      </span>
                                    )}
                                    {discount.ageMin !== undefined && discount.ageMin !== null && 
                                     (discount.ageMax === undefined || discount.ageMax === null) && (
                                      <span className={`block text-xs ${getDiscountTextColor()} opacity-75 mt-0.5`}>
                                        Ages {discount.ageMin}+
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-[#4A463F]">
                        <p className="font-bold text-xs uppercase text-[#1A1712] tracking-wider mb-1.5">{t.inclusionsAndPerks || 'Inclusions & Perks:'}</p>
                        {(pkg.inclusions || []).slice(0, 4).map((inc, i) => (
                          <p key={i} className="flex items-center gap-2.5 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#7A0C1F] flex-shrink-0" />
                            <span className="text-[#4A463F]">{inc}</span>
                          </p>
                        ))}
                        {(pkg.inclusions || []).length > 4 && (
                          <p className="text-xs font-medium text-[#6B655A]">+{pkg.inclusions.length - 4} more</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="flex-1 bg-[#7A0C1F] hover:bg-[#580815] text-white font-bold text-xs py-2.5 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>{t.detailsBtn || 'Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      <button
                        onClick={() => openWhatsAppForPackage(pkg)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg 
                          className="w-3.5 h-3.5 fill-white" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span>{t.chatOnWhatsApp || 'Chat on WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};