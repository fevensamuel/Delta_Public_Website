import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Send,
  DollarSign,
  Linkedin,
  Send as SendIcon
} from 'lucide-react';
import { Currency, Language, PageId, SocialLink } from '../types';
import { translations } from '../translations';
import { Logo } from './Logo';
import { getPublicSocialLinksApi } from '../api/socialLinks';

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

// TikTok SVG Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.9 4.9 0 0 1-2.845-2.847.5.5 0 0 0-.477-.339h-2.3a.5.5 0 0 0-.5.5v11.8a3.2 3.2 0 1 1-3.2-3.2.5.5 0 0 0 .5-.5v-2.3a.5.5 0 0 0-.5-.5 6.5 6.5 0 1 0 6.5 6.5V9.44a4.9 4.9 0 0 0 2.845 2.847.5.5 0 0 0 .477-.339v-2.3a.5.5 0 0 0-.5-.5z"/>
  </svg>
);

// Map platform names to icons
const getSocialIcon = (platform: string, className: string = "w-3.5 h-3.5") => {
  const iconProps = { className };
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook {...iconProps} />;
    case 'instagram': return <Instagram {...iconProps} />;
    case 'youtube': return <Youtube {...iconProps} />;
    case 'twitter': return <Twitter {...iconProps} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'tiktok': return <TikTokIcon className={className} />;
    case 'telegram': 
    case 'telegram2': 
    case 'telegram-support': 
    case 'telegram-channel': 
      return <SendIcon {...iconProps} />;
    default: return null;
  }
};

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  lang,
  setLang,
  currency,
  setCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loadingSocial, setLoadingSocial] = useState(true);
  const t = translations[lang] || translations.EN;

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.about },
    { id: 'packages', label: t.packages },
    { id: 'hotels-flights', label: t.hotelsFlights },
    { id: 'gallery', label: t.gallery },
    { id: 'faqs', label: t.faqs || 'FAQs' },
    { id: 'office', label: 'Our Office' },
    { id: 'contact', label: t.contact }
  ];

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    setLoadingSocial(true);
    try {
      const data = await getPublicSocialLinksApi();
      setSocialLinks(data);
    } catch (error) {
      console.error('Failed to load social links:', error);
    } finally {
      setLoadingSocial(false);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    document.documentElement.dir = newLang === 'AR' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white transition-all duration-300">
      {/* Top Utility Announcement & Social Bar (Dark Slate/Black) */}
      <div className="bg-[#0b0f19] text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
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

            {/* Language Selector (EN / AR / AM) */}
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
              </select>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Social Icons - Fetched from Backend */}
            <div className="hidden sm:flex items-center space-x-2.5 rtl:space-x-reverse text-slate-400">
              {loadingSocial ? (
                <span className="text-[10px] text-slate-500">Loading...</span>
              ) : socialLinks.length === 0 ? (
                <span className="text-[10px] text-slate-500">No social links</span>
              ) : (
                socialLinks.map((link) => {
                  const icon = getSocialIcon(link.platform);
                  return icon ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-red-500 transition-colors"
                      title={link.platform}
                    >
                      {icon}
                    </a>
                  ) : null;
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar (White Background) */}
      <div className="bg-white text-slate-900 py-3 px-4 sm:px-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo - Using the Logo component with header variant */}
          <button 
            onClick={() => setActivePage('home')} 
            className="flex items-center gap-2.5 text-left rtl:text-right group cursor-pointer"
          >
            <Logo 
              brandName={t.brandName || "DELTA"} 
              brandSubtitle={t.brandSubtitle || "Travel & Tour"} 
              variant="light"
              logoVariant="header"
              size="md"
            />
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