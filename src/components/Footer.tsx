import React, { useEffect, useState } from 'react';
import { getPublicSocialLinksApi } from '../api/socialLinks';
import { SocialLink, Language } from '../types';
import { 
  Facebook, 
  Instagram, 
  Send, 
  Linkedin, 
  Youtube, 
  Twitter,
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  Globe
} from 'lucide-react';
import { translations } from '../translations';
import { Logo } from './Logo';

interface FooterProps {
  setActivePage: (page: string) => void;
  lang: Language;
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
const getSocialIcon = (platform: string, className: string = "w-5 h-5") => {
  const iconProps = { className };
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook {...iconProps} />;
    case 'instagram': return <Instagram {...iconProps} />;
    case 'telegram': 
    case 'telegram2': 
    case 'telegram-support': 
    case 'telegram-channel': 
      return <Send {...iconProps} />;
    case 'tiktok': return <TikTokIcon className={className} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'youtube': return <Youtube {...iconProps} />;
    case 'twitter': return <Twitter {...iconProps} />;
    default: return <Globe {...iconProps} />;
  }
};

export const Footer: React.FC<FooterProps> = ({ setActivePage, lang }) => {
  const t = translations[lang] || translations.EN;
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    setLoading(true);
    try {
      const data = await getPublicSocialLinksApi();
      setSocialLinks(data);
    } catch (error) {
      console.error('Failed to load social links:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0b0f19] text-white pt-16 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/60">
          
          {/* Column 1: Brand & About - Using Logo component */}
          <div className="space-y-4">
            <Logo 
              brandName={t.brandName || "DELTA"} 
              brandSubtitle={t.brandSubtitle || "Travel & Tour"} 
              variant="dark"
              logoVariant="footer"
              size="md"
              className="!flex-col !items-start !gap-1" // Override to stack vertically
            />
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              {t.footerDescription || 'Providing reliable, comfortable, and high-quality Umrah travel services with professionalism, care, and respect.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.quickLinks || 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="text-slate-300 hover:text-[#C8102E] transition-colors"
                >
                  {t.home || 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('packages')}
                  className="text-slate-300 hover:text-[#C8102E] transition-colors"
                >
                  {t.packages || 'Packages'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('gallery')}
                  className="text-slate-300 hover:text-[#C8102E] transition-colors"
                >
                  {t.gallery || 'Gallery'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="text-slate-300 hover:text-[#C8102E] transition-colors"
                >
                  {t.about || 'About Us'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="text-slate-300 hover:text-[#C8102E] transition-colors"
                >
                  {t.contact || 'Contact'}
                </button>
              </li>
<<<<<<< HEAD
              <li>
  <button
    onClick={() => setActivePage('office')}
    className="text-slate-300 hover:text-[#C8102E] transition-colors"
  >
    Our Office
  </button>
</li>
=======
>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.contactInfo || 'Contact Info'}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <span>Bole Friendship Building 4th Floor, Office 408, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#C8102E] flex-shrink-0" />
                <div>
                  <a href="tel:+251910136747" className="hover:text-[#C8102E] transition-colors">+251 910 136 747</a>
                  <span className="text-slate-500 mx-1">|</span>
                  <a href="tel:+251956585555" className="hover:text-[#C8102E] transition-colors">+251 956 585 555</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#C8102E] flex-shrink-0" />
                <a href="mailto:info@deltatravel.com" className="hover:text-[#C8102E] transition-colors">
                  info@deltatravel.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-[#C8102E] flex-shrink-0 mt-0.5" />
                <div>
<<<<<<< HEAD
                  <span>Mon–Sat: 2:30 AM – 11:30 PM LT</span>
=======
                  <span>Mon–Sat: 2:30 AM – 11:30 PM</span>
>>>>>>> 92dfad2bcb1bc4a01ca92195b7057a11bf89c73d
                  <span className="block text-[10px] text-slate-500">Sunday: Closed</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.followUs || 'Follow Us'}
            </h4>

            {/* Social Links from Backend */}
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Loading...</span>
                </div>
              ) : socialLinks.length === 0 ? (
                <p className="text-xs text-slate-400">No social links configured</p>
              ) : (
                socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800/60 hover:bg-[#C8102E] flex items-center justify-center transition-colors duration-300 border border-slate-700/50 hover:border-[#C8102E] group"
                    aria-label={link.platform}
                  >
                    <span className="text-slate-300 group-hover:text-white transition-colors">
                      {getSocialIcon(link.platform, "w-4 h-4")}
                    </span>
                  </a>
                ))
              )}
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.followUsText || 'Follow us on social media for latest Umrah updates, promotions, and travel tips.'}
              </p>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/251910136747?text=Assalamu%20Alaikum%20Delta%20Travel!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{t.chatWhatsapp || 'Chat on WhatsApp'}</span>
            </a>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Delta Travel & Tour. {t.allRightsReserved || 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-600">Licensed & Verified Travel Agency</span>
            <span className="w-px h-4 bg-slate-700"></span>
            <span className="text-[10px] text-slate-600">Ministry License #4812</span>
          </div>
        </div>

      </div>
    </footer>
  );
};