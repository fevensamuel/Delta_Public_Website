import React, { useState, useEffect } from 'react';
import { OfficeImage, Language, PackageItem, PageId, Currency, FAQItem } from '../types';
import { translations } from '../translations';
import { getPublicOfficeImagesApi } from '../api/officeImages';
import { getFullImageUrl } from '../api/client';
import { submitInquiry, fetchPackages } from '../api/client';
import { getFaqsApi } from '../api/faqs';
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
  ExternalLink,
  Plus,
  Minus,
  HelpCircle
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

  // FAQs state
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [faqError, setFaqError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  useEffect(() => {
    loadOfficeImages();
    loadPackages();
    loadFaqs();
  }, []);

  const loadOfficeImages = async () => {
    setLoadingImages(true);
    setError(null);
    try {
      const data = await getPublicOfficeImagesApi();
      setImages(data);
    } catch (err) {
      setError('Failed to load office images. Please refresh the page.');
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
        const priceDisplay = formatPrice(firstPkg.priceUsd, currency, lang, rate);
        setSubject(`${firstPkg.titleEn} (${priceDisplay})`);
      }
    } catch (e) {
      console.error('Failed to load packages for dropdown:', e);
    } finally {
      setLoadingPackages(false);
    }
  };

  const loadFaqs = async () => {
    setLoadingFaqs(true);
    setFaqError(null);
    try {
      const data = await getFaqsApi();
      setFaqs(data);
    } catch (error) {
      setFaqError('Failed to load FAQs. Please refresh the page.');
      console.error('Error loading FAQs:', error);
    } finally {
      setLoadingFaqs(false);
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
        source: 'office_contact_form'
      });

      setSubmitted(true);
      const refNo = `DLT-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      
      if (onTriggerSmsToast) {
        onTriggerSmsToast(
          phone || '+251911234567',
          `DELTA TRAVEL: Thank you ${fullName || 'Pilgrim'}! Your message (Ref ${refNo}) has been received. Our team will contact you shortly.`
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
          const priceDisplay = formatPrice(firstPkg.priceUsd, currency, lang, rate);
          setSubject(`${firstPkg.titleEn} (${priceDisplay})`);
        }
      }, 6000);
    } catch (err) {
      console.error('Inquiry submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 pb-16 bg-[#F9F9F9] text-slate-800">
      
      {/* Banner */}
      <section className="bg-[#0b0f19] text-white py-14 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            24/7 Umrah Pilgrim Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Delta Travel & Tour - Office & Contact
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Visit us at our headquarters in Addis Ababa for personalized consultation, document assistance, 
            and expert guidance for your Umrah journey. Our travel consultants and religious scholars are 
            ready to assist with package inquiries, group departures, and flight bookings.
          </p>
        </div>
      </section>

      {/* Office Images Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">
              Office Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              See Our Office
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Take a virtual tour of our office where we plan and coordinate Umrah journeys for pilgrims.
            </p>
          </div>

          {loadingImages ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
              <p className="text-xs text-slate-500">Loading office images...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-sm">{error}</p>
              <button onClick={loadOfficeImages} className="mt-4 text-[#C8102E] text-sm font-bold underline hover:no-underline">
                Retry
              </button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Building2 className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-slate-500 mt-3">No office images available yet.</p>
              <p className="text-xs text-slate-400">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => {
                const fullImageUrl = getFullImageUrl(image.imageUrl);
                return (
                  <div 
                    key={image.id} 
                    className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
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
                          <h3 className="font-bold text-slate-900 text-sm">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-xs text-slate-500 mt-1">{image.description}</p>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Contact Info & Office Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
              DIRECT CONTACT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Visit Our Head Office or Reach Us Anytime
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We welcome pilgrims to visit our office in Addis Ababa for face-to-face consultation, 
              document assistance, and guidance.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-[#C8102E] flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Headquarters Location</h4>
                <p className="text-slate-600 mt-0.5">Bole Road, Friendship Business Centre</p>
                <p className="text-slate-600 mt-0.5">Addis Ababa, Ethiopia</p>
                <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                  Landmark: Opposite Olympia Traffic Light
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-[#C8102E] flex-shrink-0">
                <Phone className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Phone Lines (24/7 Emergency)</h4>
                <p className="text-slate-600 mt-0.5">Main Hotline: +251 91 123 4567</p>
                <p className="text-slate-600">Saudi Arabia Ground Desk: +966 50 123 4567</p>
                <p className="text-slate-600">WhatsApp: +251 91 013 6747</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-[#C8102E] flex-shrink-0">
                <Mail className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Address</h4>
                <p className="text-slate-600 mt-0.5">General Inquiries: info@deltatravel.com</p>
                <p className="text-slate-600">Umrah Desk: umrah@deltatravel.com</p>
                <p className="text-slate-600">Support: support@deltatravel.com</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-[#C8102E] flex-shrink-0">
                <Clock className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Office Hours</h4>
                <p className="text-slate-600 mt-0.5">Monday – Saturday: 2:30 AM – 11:30 PM LT</p>
                <p className="text-slate-600">Sunday & Holidays: On-call WhatsApp Assistance</p>
                <p className="text-[10px] text-slate-500 mt-1">*24/7 emergency support available via phone</p>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-900">
              Send Us a Direct Inquiry Message
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Fill in your details below. You will receive an instant confirmation SMS alert.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-lg">Inquiry Message Received!</h4>
              <p className="text-xs text-slate-700">
                A confirmation SMS was sent to your phone. Our travel consultant will call you shortly.
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                Reference: DLT-INQ-{Math.floor(1000 + Math.random() * 9000)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmed Mohamed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 91 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address (optional)</label>
                  <input
                    type="email"
                    placeholder="ahmed@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                    disabled={loadingPackages}
                  >
                    <option value="">Select a package</option>
                    {loadingPackages ? (
                      <option disabled>Loading packages...</option>
                    ) : packages.length === 0 ? (
                      <option disabled>No packages available</option>
                    ) : (
                      packages.map((pkg) => {
                        const title = pkg.titleEn || pkg.title;
                        const priceDisplay = formatPrice(pkg.priceUsd, currency, lang, rate);
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
                <label className="block font-bold text-slate-700 mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your preferred travel dates, number of family members, or special requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs sm:text-sm py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry & Receive Confirmation</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </section>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-3">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C8102E]" /> Delta Travel Head Office Location
            </span>
            <span className="text-slate-500">Bole Road, Friendship Business Centre</span>
          </div>

          <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200">
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

      {/* FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> FAQs
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600">
                Find answers to the most frequently asked questions about our Umrah packages, services, and travel requirements.
              </p>
            </div>
          </div>

          {loadingFaqs ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
              <p className="text-xs text-slate-500">Loading FAQs...</p>
            </div>
          ) : faqError ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-sm">{faqError}</p>
              <button onClick={loadFaqs} className="mt-4 text-[#C8102E] text-sm font-bold underline hover:no-underline">
                Retry
              </button>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <HelpCircle className="w-12 h-12 mx-auto text-[#E2E8F0]" />
              <p className="text-slate-500 font-semibold">No FAQs available yet</p>
              <p className="text-xs text-slate-400">Check back later for frequently asked questions about our Umrah services.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isExpanded = expandedIndex === index;

                return (
                  <div 
                    key={faq.id} 
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-[#C8102E] font-bold text-sm">Q{index + 1}.</span>
                        <h3 className="font-semibold text-slate-900 text-sm">{faq.question}</h3>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {isExpanded ? (
                          <Minus className="w-5 h-5 text-[#C8102E]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[#C8102E]" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-5 pt-1 border-t border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          <span className="font-bold text-[#C8102E]">A:</span> {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
        </div>
      </section>
    </div>
  );
};