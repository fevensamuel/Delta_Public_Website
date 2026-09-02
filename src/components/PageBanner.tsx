import React from 'react';

interface PageBannerProps {
  badge: string;
  title: string;
  subtitle: string;
  className?: string;
  backgroundImage?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ 
  badge, 
  title, 
  subtitle, 
  className = '',
  backgroundImage = '/background/bp3.jpg'
}) => {
  return (
    <section className={`relative bg-[#0b0f19] text-white py-16 px-4 text-center overflow-hidden border-b border-slate-800 min-h-[280px] flex items-center ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-3 relative z-10 w-full">
        <span className="inline-block px-3.5 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60 backdrop-blur-sm">
          {badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-sans text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </section>
  );
};