import React, { useState } from 'react';
import { PackageItem, Language, Currency } from '../types';
import { translations } from '../translations';
import { formatPrice } from '../utils/formatPrice';
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
  Loader2
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

  return (
    <div className="space-y-12 pb-16 bg-[#F9F9F9]">
      
      {/* Header Banner */}
      <section className="bg-[#0b0f19] text-white py-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            Season 2026 Umrah Packages
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            {t.packages}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Choose from Economy, Standard, Premium, and VIP Luxury Umrah packages.
          </p>
        </div>
      </section>

      {/* Filter & Sort Toolbar */}
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

      {/* Package Cards Grid */}
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

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-400" /> {pkg.durationDays} Days
                      </span>
                      <div className="bg-white text-[#C8102E] font-black text-xs px-3 py-1.5 rounded-lg shadow text-right">
                        <span>
                          {formatPrice(pkg.priceUsd ?? pkg.price, currency, lang, rate)}
                        </span>
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
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
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