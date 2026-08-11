import React, { useState } from 'react';
import { 
  FileDown, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle,
  Clock,
  Send,
  Plane,
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, PageId } from '../types';
import { translations } from '../translations';
import { Logo } from './Logo';

interface FooterProps {
  setActivePage: (page: PageId) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, lang }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const t = translations[lang] || translations.EN;

  const handleBrochureDownload = () => {
    setDownloadSuccess(true);
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Delta Travel & Tour - 2026 Umrah Package Brochure\nPhone: +251 91 123 4567 / +251 91 122 3344\nEmail: info@deltatravel.com\nLocation: Friendship Business Centre, 4th Floor, Bole Road, Addis Ababa, Ethiopia\nOfficial Flight Partners: Ethiopian Airlines & Saudia\nPackages: Economy ($890), Standard ($1,250), Premium ($1,650), VIP ($2,100)');
    link.download = 'Delta_Travel_Brochure_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <footer className="bg-[#080d1a] text-slate-300 text-xs border-t border-slate-800/80 pt-12 pb-6">
      
      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
        
        {/* Column 1: Brand & Overview */}
        <div className="space-y-4">
          <button onClick={() => setActivePage('home')} className="flex items-center gap-2.5 group text-left rtl:text-right cursor-pointer">
            <Logo brandName={t.brandName} brandSubtitle={t.brandSubtitle} variant="dark" />
          </button>

          <p className="text-slate-400 text-xs leading-relaxed">
            Your premier Ethiopian travel agency for spiritual Umrah & Hajj journeys. Providing exceptional flight options, luxury hotel bookings in Makkah & Madinah, and personalized guidance.
          </p>

          <div className="pt-1">
            <button
              onClick={handleBrochureDownload}
              className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 uppercase tracking-wide"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{t.downloadBrochure}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[#C8102E]" />
            <span>Quick Links</span>
          </h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li>
              <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> Home
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('packages')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> Umrah Packages
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('hotels-flights')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> Hotels & Flights
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('gallery')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> Photo & Video Gallery
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('about')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> About Delta Travel
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-slate-600">›</span> Contact & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Services & Partnerships */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
            <span>Spiritual Services</span>
          </h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li className="flex items-center gap-2 text-slate-300">
              <Plane className="w-3.5 h-3.5 text-red-400" />
              <span>Ethiopian Airlines Direct Flights</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Plane className="w-3.5 h-3.5 text-red-400" />
              <span>Saudia Flight Connections</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Madinah Proximity Stays</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Umrah Visa Processing</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Guided Spiritual Ziyarah</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Direct Contacts */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C8102E]" />
            <span>Addis Ababa Office</span>
          </h4>
          
          <div className="space-y-2.5 text-slate-300 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{t.addressText}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
              <a href="tel:+251911234567" className="hover:text-white transition-colors">+251 91 123 4567 / +251 91 122 3344</a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
              <a href="mailto:info@deltatravel.com" className="hover:text-white transition-colors">info@deltatravel.com</a>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>Mon – Sat: 8:30 AM – 3:00 PM EAT</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2.5 rtl:space-x-reverse text-slate-400">
                        <a href="#facebook" title="Facebook" className="hover:text-red-500 transition-colors">
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                        <a href="#instagram" title="Instagram" className="hover:text-red-500 transition-colors">
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                        <a href="#youtube" title="YouTube" className="hover:text-red-500 transition-colors">
                          <Youtube className="w-3.5 h-3.5" />
                        </a>
                        <a href="#twitter" title="Twitter" className="hover:text-red-500 transition-colors">
                          <Twitter className="w-3.5 h-3.5" />
                        </a>
                      </div>
        </div>

      </div>

      {/* Bottom Copyright & Legal Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-400">
        <div>
          {t.allRightsReserved}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <button onClick={() => setActivePage('about')} className="hover:text-white transition-colors">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setActivePage('about')} className="hover:text-white transition-colors">Terms of Service</button>
          <span>•</span>
          <button onClick={() => setActivePage('hotels-flights')} className="hover:text-white transition-colors">Airline Partners</button>
        </div>
      </div>

    </footer>
  );
};

