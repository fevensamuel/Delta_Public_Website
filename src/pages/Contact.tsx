import React, { useState, useEffect } from 'react';
import { Language, PackageItem, Currency } from '../types';
import { translations } from '../translations';
import { submitInquiry, fetchPackages } from '../api/client';
import { formatPrice } from '../utils/formatPrice';
import { useExchangeRate } from '../api/exchangeRate';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink,
  Loader2
} from 'lucide-react';

interface ContactProps {
  onTriggerSmsToast: (phone: string, msg: string) => void;
  lang: Language;
  currency: Currency;
}

export const Contact: React.FC<ContactProps> = ({ onTriggerSmsToast, lang, currency }) => {
  const t = translations[lang] || translations.EN;
  const { rate } = useExchangeRate();

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
    loadPackages();
  }, []);

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
        source: 'contact_form'
      });

      setSubmitted(true);
      const refNo = `DLT-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      onTriggerSmsToast(
        phone || '+251911234567',
        `DELTA TRAVEL: Thank you ${fullName || 'Pilgrim'}! Your message (Ref ${refNo}) has been received. Our team will contact you shortly.`
      );

      setTimeout(() => {
        setSubmitted(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 6000);
    } catch (err) {
      console.error('Inquiry submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 bg-[#F9F9F9]">
      
      {/* Banner */}
      <section className="bg-[#0b0f19] text-white py-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            24/7 Umrah Pilgrim Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            {t.contact}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Our travel consultants and religious scholars are ready to assist with package inquiries, group departures, and flight bookings.
          </p>
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
              We welcome pilgrims to visit our office in Addis Ababa for face-to-face consultation, document assistance, and guidance.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-[#C8102E] flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Headquarters Location</h4>
                <p className="text-slate-600 mt-0.5">{t.addressText}</p>
              {/* <span className="text-[10px] text-slate-500 font-semibold block mt-1">Landmark: Opposite Olympia Traffic Light, Bole Road</span>*/} 
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
              </div>
            </div>

          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-bold text-xs">Need Immediate Response?</p>
                <p className="text-[11px] text-slate-300">Chat with our senior Umrah advisor on WhatsApp</p>
              </div>
            </div>
            <a
              href="https://wa.me/251911234567?text=Assalamu%20Alaikum,%20I%20have%20an%20inquiry%20about%20Delta%20Travel%20Umrah%20packages."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              <span>Chat Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
                    {loadingPackages ? (
                      <option>Loading packages...</option>
                    ) : packages.length === 0 ? (
                      <option>No packages available</option>
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

      {/* GOOGLE MAP EMBED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-3">
    <div className="flex items-center justify-between text-xs px-2">
      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-[#C8102E]" /> Delta Travel Head Office Map
      </span>
      <span className="text-slate-500">Bole Road, Freindship Business Centre</span>
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

    </div>
  );
};
