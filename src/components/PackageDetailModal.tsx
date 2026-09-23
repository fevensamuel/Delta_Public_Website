import React from 'react';
import { 
  PackageItem, 
  Language,
  Currency 
} from '../types';
import { formatPrice, formatPriceRange, getDiscountDisplay } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { trackAndOpenWhatsApp, getFullImageUrl } from '../api/client';
import { useContactSettings } from '../hooks/useContactSettings';
import { 
  X, 
  CheckCircle, 
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  Calendar,
  Plane,
  Tag,
  Star
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
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();
  const { phoneNumber, whatsappNumber } = useContactSettings();

  // Clean phone numbers for tel: / wa.me links
  const cleanPhone = (phoneNumber || '+251910136747').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (whatsappNumber || '251910136747').replace(/[^0-9]/g, '');

  // Format phone for display (with spaces)
  const displayPhone = phoneNumber || '+251 91 013 6747';

  if (!pkg) return null;

  const getDisplayPrice = () => {
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

  const hasDiscounts = pkg.discounts && pkg.discounts.length > 0;

  // Build the WhatsApp inquiry message for a specific package
  const openWhatsAppForPackage = () => {
    const titleForWhatsapp = ((lang || '').toUpperCase() === 'AR' && pkg.titleAr)
      ? pkg.titleAr
      : (((lang || '').toUpperCase() === 'AM' && pkg.titleAm) ? pkg.titleAm : pkg.titleEn);

    // Track click in the backend (fire-and-forget)
    const priceUsd = pkg.priceUsd ?? pkg.price;
    const message = encodeURIComponent(
      (() => {
        const currentLang = (lang || 'en').toLowerCase();
        if (currentLang.startsWith('ar')) {
          return `السلام عليكم دلتا للسياحة! أود الاستفسار عن باقة "${titleForWhatsapp}"${priceUsd ? ` (بقيمة $${priceUsd} دولار)` : ''}. يرجى تزويدي بمزيد من التفاصيل.`;
        }
        if (currentLang.startsWith('am')) {
          return `ስለ "${titleForWhatsapp}" ጥቅል ዝርዝር መረጃ ማግኘት እፈልጋለሁ${priceUsd ? ` ($${priceUsd} ዶላር)` : ''}። እባክዎ ተጨማሪ መረጃ ያጋሩኝ።`;
        }
        return `I am interested in inquiring about the "${titleForWhatsapp}" package${priceUsd ? ` (USD $${priceUsd})` : ''}. Please share more details.`;
      })()
    );

    // Track click (fire and forget)
    fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'}/packages/${pkg.id}/click-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});

    window.open(`https://wa.me/${cleanWhatsApp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E0C0A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white shadow-xl max-w-3xl w-full overflow-hidden border border-black/[0.08] my-8">
        
        <div className="bg-[#0E0C0A] text-white p-5 sm:p-6 flex items-start justify-between relative border-b border-white/10">
          <div className="space-y-1 max-w-xl">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-900/50 text-[#A6853A] text-[11px] font-bold tracking-wider uppercase border border-red-800/60">
              {((lang || '').toUpperCase() === 'AR' && pkg.categoryAr) ? pkg.categoryAr : (((lang || '').toUpperCase() === 'AM' && pkg.categoryAm) ? pkg.categoryAm : pkg.category)} {t.packageLabel || 'Package'}
            </span>
            <h2 className="text-xl sm:text-2xl font-medium font-sans text-white">
              {((lang || '').toUpperCase() === 'AR') ? (pkg.titleAr || pkg.titleEn) : (((lang || '').toUpperCase() === 'AM') && pkg.titleAm) ? pkg.titleAm : pkg.titleEn}
            </h2>
            <p className="text-sm text-[#B8B2A6] flex items-center gap-2">
              <span>{pkg.durationDays} {t.daysLabel || 'Days'}</span> • <span>{t.fromLabel || 'From'} {((lang || '').toUpperCase() === 'AR' && pkg.departureCityAr) ? pkg.departureCityAr : (((lang || '').toUpperCase() === 'AM' && pkg.departureCityAm) ? pkg.departureCityAm : pkg.departureCity)}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#9A9488] hover:text-white p-1.5 hover:bg-[#17130F] transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F1EBE0] p-4 border border-[#E7C6C6]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-red-900 font-semibold block uppercase">{t.packagePrice || 'Package Price'}</span>
                  <p className="text-2xl font-medium text-[#7A0C1F]">
                    {getDisplayPrice()}
                    {hasDiscounts && (
                      <span className="text-sm font-bold text-[#7A0C1F] ml-2">
                        {t.discountAvailable || ((lang || '').toUpperCase() === 'AR' ? 'خصم متاح' : (lang || '').toUpperCase() === 'AM' ? 'ልዩ ቅናሽ አለ' : 'Discount Available')}
                      </span>
                    )}
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-[#7A0C1F]" />
              </div>
            </div>
          </div>

          {hasDiscounts && pkg.discounts && (
            <div className="bg-emerald-50 p-4 border border-emerald-200">
              <h4 className="font-bold text-emerald-800 text-sm uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" /> {t.availableDiscounts || 'Available Discounts'}
              </h4>
              <div className="space-y-2.5">
                {pkg.discounts.filter(d => d.isActive !== false).map((discount, idx) => {
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
                    <div key={idx} className="flex items-center justify-between bg-white p-3 border border-emerald-100">
                      <div>
                        <span className="text-sm font-bold text-emerald-800">{discountLabel}</span>
                        {discountDesc && (
                          <span className="text-xs text-emerald-600 ml-2">({discountDesc})</span>
                        )}
                        {discount.minPersons && (
                          <span className="text-xs text-emerald-600 ml-2">{discount.minPersons}+ {t.personsLabel || 'Persons'}</span>
                        )}
                        {ageGroup && (
                          <span className="text-xs text-emerald-600 ml-2">{t.ageLabel || 'Age:'} {ageGroup}</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        {discount.type === 'percentage' ? `${discount.value}% ${t.offLabel || 'off'}` : `$${discount.value} ${t.offLabel || 'off'}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF7F2] p-4 border border-black/[0.08]">
              <h4 className="font-bold text-[#1A1712] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> {t.whatsIncluded || "What's Included"}
              </h4>
              <ul className="space-y-1.5 text-sm text-[#4A463F]">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#7A0C1F] font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF7F2] p-4 border border-black/[0.08]">
              <h4 className="font-bold text-[#1A1712] text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#4A463F]" /> {t.scheduledDepartures || 'Scheduled Group Departures'}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {pkg.availableDates.map((date, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white text-[#1A1712] font-semibold text-xs rounded border border-black/[0.08] shadow-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#7A0C1F]" /> {date}
                  </span>
                ))}
              </div>

              <p className="text-sm text-[#6B655A] italic">
                {t.includesFlightsNote || '*Includes roundtrip direct flights with our Airline Partners and full Mutawwif guidance.'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1712] text-md mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A0C1F]"></span>
              {t.dayByDayItinerary || 'Day-by-Day Spiritual Itinerary'}
            </h4>
            <div className="space-y-2 border-l-2 border-[#A6853A] rtl:border-r-2 rtl:border-l-0 pl-4 rtl:pr-4 rtl:pl-0">
              {pkg.itinerary.map((item) => {
                const cleanTitle = item.title.replace(/^(Day|ቀን|اليوم)\s+\d+:\s*/i, '');
                const dayNum = item.dayNumber || (item as any).day;
                
                return (
                  <div key={dayNum} className="bg-[#FAF7F2] p-3 border border-black/[0.06]">
                    <div className="flex items-center justify-between font-bold text-[#1A1712] text-sm">
                      <span className="text-[#7A0C1F] font-semibold">
                        {t.dayPrefix || 'Day'} {dayNum}: {cleanTitle}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B655A] mt-1">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0E0C0A] text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
              <h5 className="font-bold text-sm text-white">{t.haveQuestions || 'Have Questions About This Package?'}</h5>
              <p className="text-xs text-[#B8B2A6]">{t.haveQuestionsSub || 'Contact our senior travel consultants in Addis Ababa directly via Phone or WhatsApp.'}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={openWhatsAppForPackage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 shadow transition-colors flex items-center gap-1.5"
              >
                <svg 
                  className="w-4 h-4 fill-white" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{t.chatOnWhatsApp || 'Chat on WhatsApp'}</span>
              </button>

              <a
                href={`tel:${cleanPhone}`}
                className="bg-[#7A0C1F] hover:bg-[#580815] text-white font-bold text-xs px-4 py-2.5 shadow transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {t.callUs || 'Call'}{' '}
                  <span dir="ltr" className="whitespace-nowrap inline-block">
                    {displayPhone}
                  </span>
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};