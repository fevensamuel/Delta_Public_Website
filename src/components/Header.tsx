import React, { useState } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Megaphone,
  Send,
  DollarSign
} from 'lucide-react';
import { Currency, Language, PageId } from '../types';
import { translations } from '../translations';
import { Logo } from './Logo';

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  lang,
  setLang,
  currency,
  setCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang] || translations.EN;

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'packages', label: t.packages },
    { id: 'hotels-flights', label: t.hotelsFlights },
    { id: 'gallery', label: t.gallery },
    { id: 'contact', label: t.contact }
  ];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    document.documentElement.dir = newLang === 'AR' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white transition-all duration-300">
      {/* Top Utility Announcement & Social Bar (Dark Slate/Black) */}
      <div className="bg-[#0b0f19] text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Left Announcement */}
          <div className="flex items-center gap-2 text-slate-200">
            <Megaphone className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs tracking-tight">
              Special Offer! Early Bird Umrah Packages 2026 - Book Now & Save More!
            </span>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-300 text-[11px] sm:text-xs">
            <button 
              onClick={() => setActivePage('packages')} 
              className="hover:text-red-400 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Explore Packages</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Currency Selector ($ USD / ETB / SAR) */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5">
              <DollarSign className="w-3 h-3 text-red-400" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
                title="Select Currency"
              >
                <option value="USD" className="bg-slate-900 text-white">$ USD</option>
                <option value="ETB" className="bg-slate-900 text-white">ETB (ብር)</option>
                <option value="SAR" className="bg-slate-900 text-white">SAR (﷼)</option>
              </select>
            </div>

            <span className="text-slate-700">|</span>

            {/* 4-Language Selector (EN / AR / AM / OM) */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-2 py-0.5">
              <Globe className="w-3 h-3 text-red-500" />
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
                title="Select Language"
              >
                <option value="EN" className="bg-slate-900 text-white">English (EN)</option>
                <option value="AR" className="bg-slate-900 text-white">العربية (AR)</option>
                <option value="AM" className="bg-slate-900 text-white">አማርኛ (AM)</option>
                <option value="OM" className="bg-slate-900 text-white">Afaan Oromoo (OM)</option>
              </select>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Social Icons */}
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
      </div>

      {/* Main Navigation Bar (White Background) */}
      <div className="bg-white text-slate-900 py-3 px-4 sm:px-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setActivePage('home')} 
            className="flex items-center gap-2.5 text-left rtl:text-right group cursor-pointer"
          >
            <Logo brandName={t.brandName || "DELTA"} brandSubtitle={t.brandSubtitle || "Travel & Tour"} variant="light" />
          </button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`py-1 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-1 ${
                    isActive
                      ? 'text-red-600 font-extrabold border-b-2 border-red-600'
                      : 'text-slate-700 hover:text-red-600'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setActivePage('contact')}
              className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 uppercase tracking-wide"
            >
              <span>{t.contact}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-900 border-b border-slate-200 py-4 px-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left rtl:text-right py-2 text-sm font-bold transition-colors ${
                  activePage === item.id
                    ? 'text-red-600 font-extrabold border-l-4 rtl:border-r-4 rtl:border-l-0 border-red-600 pl-2'
                    : 'text-slate-700 hover:text-red-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActivePage('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#C8102E] text-white font-bold text-center py-2.5 rounded-lg shadow uppercase text-xs"
              >
                {t.contact}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
