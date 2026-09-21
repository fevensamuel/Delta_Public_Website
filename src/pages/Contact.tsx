import React, { useState, useEffect } from 'react';
import { OfficeImage, Language, PackageItem, PageId, Currency } from '../types';
import { PageBanner } from '../components/PageBanner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { translations } from '../translations';
import { getPublicOfficeImagesApi } from '../api/officeImages';
import { getFullImageUrl } from '../api/client';
import { submitInquiry, fetchPackages } from '../api/client';
import { formatPrice } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { 
  Loader2, 
  MapPin, 
  Building2, 
  ArrowRight, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink
} from 'lucide-react';

interface OfficeProps {
  setActivePage: (page: PageId) => void;
  lang: Language;
  currency: Currency;
  onTriggerSmsToast?: (phone: string, msg: string) => void;
}

export const Contact: React.FC<OfficeProps> = ({ 
  setActivePage, 
  lang, 
  currency,
  onTriggerSmsToast 
}) => {
  const t = translations[lang] || translations.EN;

  useScrollReveal([]);
  const { rate } = useExchangeRate();
  
  // Office images state
  const [images, setImages] = useState<OfficeImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadOfficeImages();
    loadPackages();
  }, []);

  const loadOfficeImages = async () => {
    setLoadingImages(true);
    setError(null);
    try {
      const data = await getPublicOfficeImagesApi();
      setImages(data);
    } catch (err) {
      setError(t.errorLoadingOfficeImages || 'Failed to load office images. Please refresh the page.');
      console.error('Error loading office images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const loadPackages = async () => {
    setLoadingPackages(true);
    try {
      const data = await fetchPackages();
      setPackages(data);
      if (data.length > 0) {
        const firstPkg = data[0];
        const title = ((lang || '').toUpperCase() === 'AR' && firstPkg.titleAr)
          ? firstPkg.titleAr
          : (((lang || '').toUpperCase() === 'AM' && firstPkg.titleAm) ? firstPkg.titleAm : (firstPkg.titleEn || (firstPkg as any).title));
        const priceDisplay = formatPrice(firstPkg.priceUsd, firstPkg.priceEtb, firstPkg.priceSar, currency, lang, rate);
        setSubject(`${title} (${priceDisplay})`);
      }
    } catch (e) {
      console.error('Failed to load packages for dropdown:', e);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitInquiry({
        fullName,
        phone,
        email: email || undefined,
        subject,
        message,
        source: 'office_contact_form',
        language: (lang || 'en').toLowerCase(),
      });

      setSubmitted(true);
      const refNo = `DLT-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      
      if (onTriggerSmsToast) {
        const template = t.smsInquiryReceived || "DELTA TRAVEL: Thank you {name}! Your message (Ref {ref}) has been received. Our team will contact you shortly.";
        const defaultName = (lang || '').toUpperCase() === 'AR' ? 'ضيف الرحمن' : ((lang || '').toUpperCase() === 'AM' ? 'ተጓዥ' : 'Pilgrim');
        const formattedMsg = template
          .replace('{name}', fullName || defaultName)
          .replace('{ref}', refNo);

        onTriggerSmsToast(
          phone || '+251 91 013 6747',
          formattedMsg
        );
      }

      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
        if (packages.length > 0) {
          const firstPkg = packages[0];
          const title = ((lang || '').toUpperCase() === 'AR' && firstPkg.titleAr)
            ? firstPkg.titleAr
            : (((lang || '').toUpperCase() === 'AM' && firstPkg.titleAm) ? firstPkg.titleAm : (firstPkg.titleEn || (firstPkg as any).title));
          const priceDisplay = formatPrice(firstPkg.priceUsd, firstPkg.priceEtb, firstPkg.priceSar, currency, lang, rate);
          setSubject(`${title} (${priceDisplay})`);
        }
      }, 6000);
    } catch (err) {
      console.error('Inquiry submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pattern-texture">
      
      {/* Banner */}
        <PageBanner 
        badge={t.contactPageBadge}
        title={t.contactPageTitle}
        subtitle={t.contactPageSubtitle}
        backgroundImage="/photos/haram-night-crowd.jpg"
      />

      {/* Office Images Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 reveal pt-14 pb-14">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#7A0C1F] uppercase tracking-wider">
              {t.officeGallery}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1712] mt-1">
              {t.seeOurOffice}
            </h2>
            <p className="text-sm text-[#6B655A] max-w-2xl">
              {t.officeGalleryText}
            </p>
          </div>

          {loadingImages ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#7A0C1F]" />
              <p className="text-xs text-[#6B655A]">{t.officeImagesLoading}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-[#7A0C1F] text-sm">{error}</p>
              <button onClick={loadOfficeImages} className="mt-4 text-[#7A0C1F] text-sm font-bold underline hover:no-underline">
                {t.retry}
              </button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 bg-white border border-black/[0.08]">
              <Building2 className="w-12 h-12 mx-auto text-[#B8B2A6]" />
              <p className="text-[#6B655A] mt-3">{t.noOfficeImages}</p>
              <p className="text-xs text-[#9A9488]">{t.checkBackSoon}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => {
                const fullImageUrl = getFullImageUrl(image.imageUrl);
                return (
                  <div 
                    key={image.id} 
                    className="group relative overflow-hidden bg-white border border-black/[0.08] shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="overflow-hidden relative">
                      <img 
                        src={fullImageUrl} 
                        alt={image.title || 'Office Image'}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e5e7eb"/%3E%3Ctext x="300" y="200" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    {(image.title || image.description) && (
                      <div className="p-4">
                        {image.title && (
                          <h3 className="font-serif font-medium text-[#1A1712] text-sm">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-xs text-[#6B655A] mt-1">{image.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 reveal pt-14 pb-14">
        
        {/* Contact Info & Office Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A0C1F]">
              {t.directContact}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1712]">
              {t.visitHeadOfficeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B655A]">
              {t.visitHeadOfficeText}
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#4A463F]">
            
            <div className="p-4 bg-white border border-black/[0.08] shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#F1EBE0] text-[#7A0C1F] flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#7A0C1F]" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#1A1712] text-sm">{t.headquartersLocation}</h4>
                <p className="text-[#6B655A] mt-0.5">{t.addressBuilding || "Bole Road, Friendship Business Centre"}</p>
                <p className="text-[#6B655A] mt-0.5">{t.addressCity || "Addis Ababa, Ethiopia"}</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-black/[0.08] shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#F1EBE0] text-[#7A0C1F] flex-shrink-0">
                <Phone className="w-5 h-5 text-[#7A0C1F]" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#1A1712] text-sm">{t.phoneLines}</h4>
                <p className="text-[#6B655A] mt-0.5">
                  {t.mainHotline || "Main Hotline"}: <span dir="ltr" className="whitespace-nowrap inline-block">+251 91 013 6747</span> / <span dir="ltr" className="whitespace-nowrap inline-block">+251 95 658 5555</span> / <span dir="ltr" className="whitespace-nowrap inline-block">+251 95 659 5555</span>
                </p>
                <p className="text-[#6B655A]">
                  {t.whatsapp || "WhatsApp"}: <span dir="ltr" className="whitespace-nowrap inline-block">+251 91 013 6747</span> / <span dir="ltr" className="whitespace-nowrap inline-block">+251 91 013 6747</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-black/[0.08] shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#F1EBE0] text-[#7A0C1F] flex-shrink-0">
                <Mail className="w-5 h-5 text-[#7A0C1F]" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#1A1712] text-sm">{t.emailAddress}</h4>
                <p className="text-[#6B655A] mt-0.5">{t.generalInquiries || "General Inquiries"}: businessdelta416@gmail.com</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-black/[0.08] shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-[#F1EBE0] text-[#7A0C1F] flex-shrink-0">
                <Clock className="w-5 h-5 text-[#7A0C1F]" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#1A1712] text-sm">{t.officeHoursContact}</h4>
                <p className="text-[#6B655A] mt-0.5">{t.monToSatHours || "Monday – Saturday: 2:30 AM – 11:30 PM LT"}</p>
                <p className="text-[#6B655A]">{t.sunAndHolidays || "Sunday & Holidays: On-call WhatsApp Assistance"}</p>
                <p className="text-[10px] text-[#6B655A] mt-1">{t.emergencySupportNotice || "*24/7 emergency support available via phone"}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 shadow-sm border border-black/[0.08] space-y-6">
          <div className="border-b border-black/[0.06] pb-3">
            <h3 className="font-serif text-xl font-medium text-[#1A1712]">
              {t.directInquiryTitle}
            </h3>
            <p className="text-xs text-[#6B655A] mt-0.5">
              {t.directInquirySub}
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-medium text-emerald-950 text-lg">{t.inquiryReceived}</h4>
              <p className="text-xs text-[#4A463F]">
                {t.inquiryReceivedText}
              </p>
              <p className="text-[10px] text-[#6B655A] mt-2">
                {t.reference}: DLT-INQ-{Math.floor(1000 + Math.random() * 9000)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4A463F] mb-1">{t.fullName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmed Mohamed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/10 text-xs focus:border-[#7A0C1F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A463F] mb-1">{t.phoneNumber}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 91 013 6747 "
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/10 text-xs focus:border-[#7A0C1F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4A463F] mb-1">{t.emailOptional}</label>
                  <input
                    type="email"
                    placeholder="ahmed@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/10 text-xs focus:border-[#7A0C1F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A463F] mb-1">{t.inquirySubject}</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-black/10 text-xs focus:border-[#7A0C1F] focus:outline-none"
                    disabled={loadingPackages}
                  >
                    <option value="">{t.selectPackage}</option>
                    {loadingPackages ? (
                      <option disabled>{t.loadingPackages}</option>
                    ) : packages.length === 0 ? (
                      <option disabled>{t.noPackagesAvailable}</option>
                    ) : (
                      packages.map((pkg) => {
                        const title = ((lang || '').toUpperCase() === 'AR' && pkg.titleAr)
                          ? pkg.titleAr
                          : (((lang || '').toUpperCase() === 'AM' && pkg.titleAm) ? pkg.titleAm : (pkg.titleEn || (pkg as any).title));
                        const priceDisplay = formatPrice(pkg.priceUsd, pkg.priceEtb, pkg.priceSar, currency, lang, rate);
                        return (
                          <option key={pkg.id} value={`${title} (${priceDisplay})`}>
                            {title} ({priceDisplay})
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A463F] mb-1">{t.messageDetails}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-black/10 text-xs focus:border-[#7A0C1F] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7A0C1F] hover:bg-[#580815] text-white font-bold text-xs sm:text-sm py-3 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.submittingInquiry}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitInquiry}</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </section>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 reveal pt-14 pb-14">
        <div className="bg-white p-4 shadow-sm border border-black/[0.08] overflow-hidden space-y-3">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="font-bold text-[#1A1712] text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#7A0C1F]" /> {t.mapTitle}
            </span>
            <span className="text-[#6B655A]">{t.mapAddressTag || "Bole Road, Friendship Business Centre"}</span>
          </div>

          <div className="w-full h-80 overflow-hidden border border-black/[0.08]">
            <iframe
              title="Delta Travel & Tour Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.8077163502057!2d38.78333007314347!3d8.989833989604644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85372f9878d1%3A0x1385d361c5cfcdd9!2sDelta%20Travel!5e0!3m2!1sen!2set!4v1787603287094!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      </section>
    </div>
  );
};