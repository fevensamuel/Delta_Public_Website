import React, { useEffect, useState } from 'react';
import { getPublicSocialLinksApi } from '../api/socialLinks';
import { SocialLink, Language, PageId } from '../types';
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
  Globe,
} from 'lucide-react';
import { translations } from '../translations';
import { useContactSettings } from '../hooks/useContactSettings';

interface FooterProps {
  setActivePage: (page: PageId) => void;
  lang: Language;
}

// TikTok SVG Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.9 4.9 0 0 1-2.845-2.847.5.5 0 0 0-.477-.339h-2.3a.5.5 0 0 0-.5.5v11.8a3.2 3.2 0 1 1-3.2-3.2.5.5 0 0 0 .5-.5v-2.3a.5.5 0 0 0-.5-.5 6.5 6.5 0 1 0 6.5 6.5V9.44a4.9 4.9 0 0 0 2.845 2.847.5.5 0 0 0 .477-.339v-2.3a.5.5 0 0 0-.5-.5z" />
  </svg>
);

// Viber SVG Icon
const ViberIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.4 0C6.4 0 2.5 3.5 2.5 8.2c0 2.4 1 4.6 2.7 6.2v3.6c0 .5.6.8 1 .4l2.5-2.1c.9.2 1.8.3 2.7.3 5 0 8.9-3.5 8.9-8.2S16.4 0 11.4 0zm0 14.9c-1.3 0-2.4-.4-3.4-1.1l-2.1 1.8v-3c-1.1-1.1-1.7-2.6-1.7-4.4 0-3.5 2.9-6.4 6.4-6.4s6.4 2.9 6.4 6.4c.1 3.7-2.9 6.7-6.6 6.7zm3-4.6c-.2-.1-1.1-.5-1.2-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.2-.2.2-.4.1-.2-.1-.8-.3-1.5-.9-.5-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.4.1-.1.1-.2.2-.4.1-.2 0-.3 0-.4 0-.1-.4-1-.6-1.4-.2-.4-.3-.3-.4-.3h-.3c-.1 0-.3.1-.5.2-.2.2-.7.7-.7 1.6 0 1 .7 1.9.8 2 .1.2 1.4 2.1 3.4 3 .5.2.8.3 1.1.4.5.2.9.1 1.3.1.4-.1 1.1-.5 1.3-.9.2-.5.2-.8.1-.9-.1-.1-.2-.2-.4-.3z" />
  </svg>
);

const getSocialIcon = (platform: string, className: string = 'w-5 h-5') => {
  const iconProps = { className };
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'telegram':
    case 'telegram2':
    case 'telegram-support':
    case 'telegram-channel':
      return <Send {...iconProps} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'viber':
      return <ViberIcon className={className} />;
    default:
      return <Globe {...iconProps} />;
  }
};

export const Footer: React.FC<FooterProps> = ({ setActivePage, lang }) => {
  const t = translations[lang] || translations.EN;
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { whatsappNumber } = useContactSettings();

  const cleanWhatsApp = (whatsappNumber || '251910136747').replace(/[^0-9]/g, '');

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
    <footer className="bg-[#0E0C0A] text-white pt-20 pb-8 pattern-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-serif text-lg text-white tracking-wide leading-none">
                  {t.brandName || 'Delta Travel & Tour'}
                </h3>
                <p className="text-[9px] text-[#9A9488] uppercase tracking-[0.15em] mt-1.5">
                  {t.brandSubtitle || 'Licensed Umrah Service Agency'}
                </p>
              </div>
            </div>
            <p className="text-[13px] text-[#B8B2A6] leading-relaxed max-w-xs">
              {t.footerDescription ||
                'Providing reliable, comfortable, and high-quality Umrah travel services with professionalism, care, and respect.'}
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h4 className="text-[11px] text-[#A6853A] uppercase tracking-[0.14em]">
              {t.quickLinks || 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { page: 'home', label: t.home || 'Home' },
                { page: 'about', label: t.about || 'About Us' },
                { page: 'packages', label: t.packages || 'Packages' },
                { page: 'gallery', label: t.gallery || 'Gallery' },
                { page: 'faqs', label: t.faqs || 'FAQs' },
                { page: 'contact', label: t.contact || 'Contact' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => setActivePage(item.page as PageId)}
                    className="text-[#B8B2A6] hover:text-[#D8B978] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h4 className="text-[11px] text-[#A6853A] uppercase tracking-[0.14em]">
              {t.contactInfo || 'Contact Info'}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-[#B8B2A6]">
                <MapPin className="w-4 h-4 text-[#A6853A] flex-shrink-0 mt-0.5" />
                <span>
                  {t.addressFull ||
                    'Bole Friendship Building 4th Floor, Office 408, Addis Ababa, Ethiopia'}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-[#B8B2A6]">
                <Phone className="w-4 h-4 text-[#A6853A] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[#B8B2A6]">
                  <a
                    href="tel:+251910136747"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#D8B978] transition-colors inline-block text-start"
                  >
                    +251 91 013 6747
                  </a>
                  <a
                    href="tel:+251956585555"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#D8B978] transition-colors inline-block text-start"
                  >
                    +251 95 658 5555
                  </a>
                  <a
                    href="tel:+251956595555"
                    dir="ltr"
                    className="whitespace-nowrap hover:text-[#D8B978] transition-colors inline-block text-start"
                  >
                    +251 95 659 5555
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-[#B8B2A6]">
                <Mail className="w-4 h-4 text-[#A6853A] flex-shrink-0" />
                <a
                  href="mailto:businessdelta416@gmail.com"
                  className="hover:text-[#D8B978] transition-colors"
                >
                  businessdelta416@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[#B8B2A6]">
                <Clock className="w-4 h-4 text-[#A6853A] flex-shrink-0 mt-0.5" />
                <div>
                  <span>
                    {t.monToSatHours || 'Mon–Sat: 2:30 AM – 11:30 PM LT'}
                  </span>{' '}
                  <br />
                  <span>
                    {t.sunAndHolidays ||
                      'Sunday & Holidays: On-call WhatsApp Assistance'}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h4 className="text-[11px] text-[#A6853A] uppercase tracking-[0.14em]">
              {t.followUs || 'Follow Us'}
            </h4>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-[#9A9488]">
                  <span>{t.loading || 'Loading...'}</span>
                </div>
              ) : socialLinks.length === 0 ? (
                <p className="text-xs text-[#9A9488]">
                  {t.noSocialLinks || 'No social links configured'}
                </p>
              ) : (
                socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#7A0C1F] flex items-center justify-center transition-colors duration-300 border border-white/10 hover:border-[#7A0C1F] group"
                    aria-label={link.platform}
                  >
                    <span className="text-[#B8B2A6] group-hover:text-white transition-colors">
                      {getSocialIcon(link.platform, 'w-4 h-4')}
                    </span>
                  </a>
                ))
              )}
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-[#9A9488] leading-relaxed">
                {t.followUsText ||
                  'Follow us on social media for latest Umrah updates, promotions, and travel tips.'}
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-white/30 hover:border-white text-white text-xs tracking-wide px-5 py-3 transition-colors"
            >
              <svg
                className="w-4 h-4 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{t.chatWhatsapp || 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-[12px] text-[#9A9488] text-center sm:text-left rtl:sm:text-right">
          <p>
            {t.allRightsReserved ||
              `© ${new Date().getFullYear()} Delta Travel & Tour. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};