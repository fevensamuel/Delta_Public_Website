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
  
  // Map logo variants to specific files in public/logo
  const logoMap = {
    header: '/logo/logo3.png',
    hero: '/logo/logo3.png',
    footer: '/logo/logo3.png',
    default: '/logo/logo3.png'
  };

  // Get the logo path based on variant
  const logoSrc = logoMap[logoVariant];
  
  // Size mapping - INCREASED SIZES
  const sizeClasses = {
    sm: 'h-12 w-auto max-w-[150px]',   // Was h-8
    md: 'h-16 w-auto max-w-[200px]',   // Was h-10
    lg: 'h-20 w-auto max-w-[280px]'    // Was h-16
  };

  const isDarkBg = variant === 'dark';

  console.log('🔍 Logo source:', logoSrc); // Debug log

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt={brandName}
          className={`${sizeClasses[size]} object-contain`}
          onError={() => {
            console.error('❌ Logo failed to load:', logoSrc);
            setImageError(true);
          }}
        />
      ) : (
        // Fallback if image fails to load
        <div className={`${sizeClasses[size]} bg-[#C8102E] rounded-lg flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}>
          <span className="font-serif italic font-extrabold text-2xl">Δ</span>
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