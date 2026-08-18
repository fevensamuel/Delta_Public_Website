import React, { useState } from 'react';

interface LogoProps {
  brandName?: string;
  brandSubtitle?: string;
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
  logoVariant?: 'header' | 'hero' | 'footer' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  brandName = "DELTA",
  brandSubtitle = "Travel & Tour",
  variant = 'light',
  className = "",
  showText = true,
  logoVariant = 'default',
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Map logo variants to specific files
  const logoMap = {
    header: '/images/logos/header-logo.jpg',
    hero: '/images/logos/hero-logo.jpg',
    footer: '/images/logos/footer-logo.jpg',
    default: '/logo.png'
  };

  // Try environment variable first, then use the specified variant
  const envLogo = (import.meta as any).env?.VITE_APP_LOGO;
  const logoSrc = envLogo || logoMap[logoVariant];

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[180px]',
    lg: 'h-16 w-auto max-w-[240px]'
  };

  const isDarkBg = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt={brandName}
          className={`${sizeClasses[size]} object-contain`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
          <span className="font-serif italic font-extrabold text-xl">Δ</span>
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-none text-left rtl:text-right">
          <span className={`font-black text-xl sm:text-2xl tracking-tighter font-sans ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
            {brandName}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
            {brandSubtitle}
          </span>
        </div>
      )}
    </div>
  );
};