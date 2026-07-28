import React, { useState } from 'react';
import { 
  FileDown, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle
} from 'lucide-react';
import { Language, PageId } from '../types';
import { translations } from '../translations';

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
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Delta Travel & Tour - 2026 Umrah Package Brochure\nPhone: +251 91 123 4567\nEmail: info@deltatravel.com\nLocation: Olympia Building, 4th Floor, Bole Road, Addis Ababa, Ethiopia\nOfficial Flight Partners: Ethiopian Airlines & Saudia\nPackages: Economy ($890), Standard ($1,250), Premium ($1,650), VIP ($2,100)');
    link.download = 'Delta_Travel_Brochure_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <footer className="bg-[#0b0f19] text-slate-300 text-xs border-t border-slate-800">
      
      {/* Upper Main Footer Bar */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Contacts */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left rtl:md:text-right">
          {/* Logo */}
          <button onClick={() => setActivePage('home')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow">
              <span className="font-serif italic font-extrabold">Δ</span>
            </div>
            <div className="flex flex-col text-left rtl:text-right leading-none">
              <span className="font-black text-lg text-white font-sans tracking-tight">{t.brandName}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">{t.brandSubtitle}</span>
            </div>
          </button>

          {/* Contact details row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300 text-[11px] sm:text-xs">
            <a href="tel:+251911234567" className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>+251 91 123 4567</span>
            </a>
            <a href="mailto:info@deltatravel.com" className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span>info@deltatravel.com</span>
            </a>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{t.addressText}</span>
            </div>
          </div>
        </div>

        {/* Brochure CTA */}
        <div>
          <button
            onClick={handleBrochureDownload}
            className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 uppercase tracking-wide"
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

      {/* Bottom Copyright & Legal Strip */}
      <div className="bg-[#070a11] py-4 px-4 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            {t.allRightsReserved}
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse text-slate-400">
            <button onClick={() => setActivePage('about')} className="hover:text-slate-200">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setActivePage('about')} className="hover:text-slate-200">Terms & Conditions</button>
            <span>•</span>
            <button onClick={() => setActivePage('hotels-flights')} className="hover:text-slate-200">Airline Partners</button>
          </div>
        </div>
      </div>

    </footer>
  );
};
