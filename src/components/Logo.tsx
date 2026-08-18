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

// Helper to get full image URL
const getFullImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseWithoutApi = API_BASE_URL.replace(/\/api$/, '');
  if (path.startsWith('/uploads')) {
    return `${baseWithoutApi}${path}`;
  }
  return `${baseWithoutApi}${path}`;
};

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
  
  // Get the env logo
  const envLogo = (import.meta as any).env?.VITE_APP_LOGO;
  
  // Map logo variants to specific files
  const logoMap = {
    header: '/uploads/logo/logo.png',
    hero: '/uploads/logo/logo.png',
    footer: '/uploads/logo/logo.png',
    default: '/uploads/logo/logo.png'
  };

  // Use envLogo if available, otherwise use the mapped variant
  const logoSrc = envLogo || logoMap[logoVariant];
  
  // Get the full URL
  const fullLogoUrl = getFullImageUrl(logoSrc);

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[180px]',
    lg: 'h-16 w-auto max-w-[240px]'
  };

  const isDarkBg = variant === 'dark';

  console.log('🔍 Logo source:', fullLogoUrl); // Debug log

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imageError ? (
        <img
          src={fullLogoUrl}
          alt={brandName}
          className={`${sizeClasses[size]} object-contain`}
          onError={() => {
            console.error('❌ Logo failed to load:', fullLogoUrl);
            setImageError(true);
          }}
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