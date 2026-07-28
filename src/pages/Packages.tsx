import React, { useState } from 'react';
import { PackageItem, Language, Currency } from '../types';
import { translations } from '../translations';
import { formatPrice } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { trackAndOpenWhatsApp } from '../api/client';
import { 
  Star, 
  CheckCircle, 
  Filter, 
  ChevronRight,
  MessageSquare,
  Clock,
  Sparkles,
  Plane
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
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

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
            Choose from Economy, Standard, Premium, and VIP Luxury Umrah packages with official flight partners Ethiopian Airlines and Saudia.
          </p>
        </div>
      </section>

      {/* Filter & Sort Control Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
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

          {/* Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
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

        </div>
      </section>

      {/* Package Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-500 text-sm font-semibold">No packages found matching your filter criteria.</p>
            <button
              onClick={() => setCategoryFilter('All')}
              className="text-xs font-bold text-[#C8102E] underline"
            >
              Reset Category Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const etbPrice = (pkg.priceUsd * rate).toLocaleString('en-US', { maximumFractionDigits: 0 });

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={pkg.imageUrl || pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-3 left-3 bg-[#C8102E] text-white font-extrabold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow">
                      {pkg.category}
                    </div>

                    {/* Single Currency Pricing Badge Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-400" /> {pkg.durationDays} Days
                      </span>
                      <div className="bg-white text-[#C8102E] font-black text-xs px-3 py-1.5 rounded-lg shadow text-right">
                        <span>{formatPrice(pkg.priceUsd ?? pkg.price, currency, lang)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-red-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-red-500" /> {pkg.rating} ({pkg.reviewsCount} reviews)
                        </span>
                        <span className="text-slate-400 font-medium text-[11px]">From {pkg.departureCity}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mb-2">
                        {lang === 'AR' ? pkg.titleAr : (lang === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.title}
                      </h3>

                      {/* Flight Partner info badge */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Plane className="w-3.5 h-3.5 text-red-600" /> Flight Carrier:
                        </span>
                        <span className="font-medium text-slate-600">Ethiopian Airlines / Saudia</span>
                      </div>

                      {/* Included Benefits List */}
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p className="font-bold text-[10px] uppercase text-slate-800 tracking-wider mb-1">Inclusions & Perks:</p>
                        {pkg.inclusions.map((inc, i) => (
                          <p key={i} className="flex items-center gap-2 text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                            <span className="text-slate-600">{inc}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      <button
                        onClick={() => trackAndOpenWhatsApp(pkg.id, `Inquiry for ${pkg.title}`)}
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
