import React, { useState } from 'react';

interface LogoProps {
  brandName?: string;
  brandSubtitle?: string;
  variant?: 'light' | 'dark'; // 'dark' for dark backgrounds (white text), 'light' for light backgrounds (dark text)
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  brandName = "DELTA",
  brandSubtitle = "Travel & Tour",
  variant = 'light',
  className = "",
  showText = true
}) => {
  const envLogo = (import.meta as any).env?.VITE_APP_LOGO;
  const [imageError, setImageError] = useState(false);

  const isDarkBg = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {envLogo && !imageError ? (
        <img
          src={envLogo}
          alt={brandName}
          className="h-9 w-auto object-contain max-w-[160px]"
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
