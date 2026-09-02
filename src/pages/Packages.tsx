import React, { useState } from 'react';
import { PackageItem, Language, Currency } from '../types';
import { PageBanner } from '../components/PageBanner';
import { translations } from '../translations';
import { formatPrice, formatPriceRange } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { getFullImageUrl, trackAndOpenWhatsApp } from '../api/client';
import { 
  Star, 
  CheckCircle, 
  Filter, 
  ChevronRight,
  MessageSquare,
  Clock,
  Sparkles,
  Plane,
  Loader2,
  Tag
} from 'lucide-react';

interface PackagesProps {
  packages: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  lang: Language;
  currency: Currency;
}

export const Packages: React.FC<PackagesProps> = ({
  packages,
  onSelectPackage,
  lang,
  currency
}) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();

  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Economy' | 'Standard' | 'Premium' | 'VIP'>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');

  const filteredPackages = packages
    .filter((pkg) => {
      if (categoryFilter !== 'All' && pkg.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.priceUsd ?? a.price) - (b.priceUsd ?? b.price);
      if (sortBy === 'price-desc') return (b.priceUsd ?? b.price) - (a.priceUsd ?? a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <p className="text-sm font-semibold">No packages available at the moment.</p>
      </div>
    );
  }

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

  return (
    <div>
      
      {/* Banner */ }
     <PageBanner 
        badge="Season 2026 Umrah Packages"
        title="Umrah Packages"
        subtitle="Choose from Economy, Standard, Premium, and VIP Luxury Umrah packages."
        backgroundImage="/background/bg3.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 mr-2 rtl:ml-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-700" /> Category:
            </span>
            {(['All', 'Economy', 'Standard', 'Premium', 'VIP'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Pilgrim Rating</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-500 text-sm font-semibold">No packages found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const imageUrl = pkg.imageUrl || pkg.image;
              const fullImageUrl = imageUrl ? getFullImageUrl(imageUrl) : '';
              const hasDiscounts = pkg.discounts && pkg.discounts.length > 0;
              const priceDisplay = getDisplayPrice(pkg);

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={pkg.titleEn || pkg.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    
                    <div className="absolute top-3 left-3 bg-[#C8102E] text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                      {pkg.category}
                    </div>

                    {hasDiscounts && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                        {lang === 'AR' ? 'خصم' : 'Discount'}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-400" /> {pkg.durationDays} Days
                      </span>
                      <div className="flex flex-col items-end">
                        {hasDiscounts && pkg.discounts && pkg.discounts.length > 0 && (
                          <span className="text-[10px] text-slate-300 line-through bg-slate-900/60 px-2 py-0.5 rounded">
                            {formatPrice(
                              pkg.priceUsd ?? pkg.price,
                              pkg.priceEtb,
                              pkg.priceSar,
                              currency,
                              lang,
                              rate
                            )}
                          </span>
                        )}
                        <div className="bg-white text-[#C8102E] font-black text-xs px-3 py-1.5 rounded-lg shadow">
                          <span>{priceDisplay}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-red-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-red-500" /> {pkg.rating || 4.8} ({pkg.reviewsCount || 0} reviews)
                        </span>
                        <span className="text-slate-400 font-medium text-[11px]">From {pkg.departureCity}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mb-2">
                        {lang === 'AR' ? pkg.titleAr : (lang === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
                      </h3>

                      {hasDiscounts && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">
                            <Tag className="w-3 h-3" /> {pkg.discounts?.length} Offers
                          </span>
                        </div>
                      )}

                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p className="font-bold text-[10px] uppercase text-slate-800 tracking-wider mb-1">Inclusions & Perks:</p>
                        {(pkg.inclusions || []).slice(0, 4).map((inc, i) => (
                          <p key={i} className="flex items-center gap-2 text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                            <span className="text-slate-600">{inc}</span>
                          </p>
                        ))}
                        {(pkg.inclusions || []).length > 4 && (
                          <p className="text-[10px] text-slate-400">+{pkg.inclusions.length - 4} more</p>
                        )}
                      </div>

                      {/* Discounts display */}
                      {hasDiscounts && pkg.discounts && (
                        <div className="mt-2 space-y-0.5">
                          {pkg.discounts.filter(d => d.isActive !== false).map((discount, idx) => (
                            <div key={idx} className="text-[9px] text-emerald-600 font-medium">
                              {discount.label}: {discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}
                              {discount.minPersons && ` (${discount.minPersons}+ persons)`}
                              {discount.ageGroup && ` (${discount.ageGroup})`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      <button
  onClick={() => trackAndOpenWhatsApp(pkg.id, `Inquiry for ${pkg.titleEn}`)}
  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
>
  {/* WhatsApp SVG Icon */}
  <svg 
    className="w-3.5 h-3.5 fill-white" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  <span>Chat on WhatsApp</span>
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