import React, { useEffect, useState } from 'react';
import { OfficeImage, Language, PageId } from '../types';
import { translations } from '../translations';
import { getPublicOfficeImagesApi } from '../api/officeImages';
import { getFullImageUrl } from '../api/client';
import { Loader2, MapPin, Building2, Clock, Phone, Mail, ExternalLink, ArrowRight } from 'lucide-react';

interface OfficeProps {
  setActivePage: (page: PageId) => void;
  lang: Language;
}

export const Office: React.FC<OfficeProps> = ({ setActivePage, lang }) => {
  const t = translations[lang] || translations.EN;
  const [images, setImages] = useState<OfficeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOfficeImages();
  }, []);

  const loadOfficeImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicOfficeImagesApi();
      setImages(data);
    } catch (err) {
      setError('Failed to load office images. Please refresh the page.');
      console.error('Error loading office images:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 bg-[#F9F9F9] text-slate-800">
      
      {/* Banner */}
      <section className="bg-[#0b0f19] text-white py-14 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            Visit Our Office
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Welcome to Delta Travel & Tour
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Visit us at our headquarters in Addis Ababa for personalized consultation, document assistance, and expert guidance for your Umrah journey.
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

          {loading ? (
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

       {/* Office Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#C8102E]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Our Location</h3>
            <p className="text-sm text-slate-600">
              Bole Friendship Building, 4th Floor, Office 408
              <br />
              Addis Ababa, Ethiopia
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#C8102E]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Office Hours</h3>
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Monday – Saturday:</span> 2:30 AM – 11:30 PM LT
              <br />
              <span className="font-semibold">Sunday & Holidays:</span> On-call WhatsApp Assistance
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#C8102E]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Contact Us</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C8102E]" />
                <a href="tel:+251910136747" className="hover:text-[#C8102E]">+251 910 136 747</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8102E]" />
                <a href="mailto:info@deltatravel.com" className="hover:text-[#C8102E]">info@deltatravel.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-3">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C8102E]" /> Delta Travel Head Office Location
            </span>
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

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0b0f19] text-white rounded-2xl p-6 sm:p-8 text-center border border-slate-800 shadow-lg">
          <h3 className="text-lg font-bold mb-2">Ready to Start Your Umrah Journey?</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto mb-4">
            Visit our office or contact us today. Our team is ready to assist you with personalized Umrah packages and guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('contact')}
              className="bg-[#C8102E] hover:bg-[#A00D24] text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors"
            >
              Contact Us
            </button>
            <a
              href="https://wa.me/251910136747?text=Assalamu%20Alaikum%20Delta%20Travel!%20I%20want%20to%20visit%20the%20office."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors"
            >
              📱 Chat on WhatsApp
            </a>
            <button
              onClick={() => setActivePage('packages')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors border border-white/20"
            >
              <ArrowRight className="w-3.5 h-3.5 inline rtl:rotate-180" /> View Packages
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};