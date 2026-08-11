import React from 'react';
import { 
  PackageItem, 
  Language,
  Currency 
} from '../types';
import { formatPrice } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { trackAndOpenWhatsApp } from '../api/client';
import { 
  X, 
  CheckCircle, 
  Hotel, 
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  Calendar,
  Plane
} from 'lucide-react';
import { translations } from '../translations';

interface PackageDetailModalProps {
  pkg: PackageItem | null;
  onClose: () => void;
  lang: Language;
  currency: Currency;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  lang,
  currency
}) => {
  if (!pkg) return null;

  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const etbPrice = (pkg.priceUsd * rate).toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Top Header Banner */}
        <div className="bg-[#0b0f19] text-white p-5 sm:p-6 flex items-start justify-between relative border-b border-slate-800">
          <div className="space-y-1 max-w-xl">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-900/50 text-red-400 text-[11px] font-bold tracking-wider uppercase border border-red-800/60">
              {pkg.category} Package
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-sans text-white">
              {lang === 'AR' ? pkg.titleAr : (lang === 'AM' && pkg.titleAm) ? pkg.titleAm : (lang === 'OM' && pkg.titleOm) ? pkg.titleOm : pkg.title}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>{pkg.durationDays} Days</span> • <span>From {pkg.departureCity}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Flight Carrier & Pricing Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center font-bold flex-shrink-0">
                <Plane className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Flight Partners</span>
                <p className="font-bold text-slate-900 text-xs">Ethiopian Airlines & Saudia</p>
                <p className="text-[10px] text-[#C8102E] font-medium">Direct Flights • Guaranteed Seats</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-900 font-semibold block uppercase">Package Price</span>
                <p className="text-2xl font-black text-[#C8102E]">{formatPrice(pkg.priceUsd ?? pkg.price, currency, lang)}</p>
                <span className="text-[11px] text-slate-600 font-bold block">{t.perPerson}</span>
              </div>
              <Sparkles className="w-6 h-6 text-[#C8102E]" />
            </div>
          </div>

          {/* Inclusions & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> What's Included
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C8102E] font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-700" /> Scheduled Group Departures
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {pkg.availableDates.map((date, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white text-slate-900 font-semibold text-xs rounded border border-slate-200 shadow-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C8102E]" /> {date}
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                *Includes roundtrip direct flights on Ethiopian Airlines or Saudia, e-Visa issuance, and full Mutawwif guidance.
              </p>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]"></span>
              Day-by-Day Spiritual Itinerary
            </h4>
            <div className="space-y-2 border-l-2 border-red-500 rtl:border-r-2 rtl:border-l-0 pl-4 rtl:pr-4 rtl:pl-0">
              {pkg.itinerary.map((item) => (
                <div key={item.day} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                    <span className="text-[#C8102E] font-semibold">Day {item.day}: {item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Inquiry Section */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
              <h5 className="font-bold text-sm text-white">Have Questions About This Package?</h5>
              <p className="text-xs text-slate-300">Contact our senior travel consultants in Addis Ababa directly via Phone or WhatsApp.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={() => trackAndOpenWhatsApp(pkg.id, `Inquiry about ${pkg.title}`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </button>

              <a
                href="tel:+251911234567"
                className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call +251 91 123 4567</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
