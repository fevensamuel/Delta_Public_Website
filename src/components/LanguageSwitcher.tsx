import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageOption, StandardLanguage } from '../types';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'minimal';
  size?: 'sm' | 'md';
  className?: string;
  theme?: 'dark' | 'light';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  size = 'sm',
  className = '',
  theme = 'dark'
}) => {
  const { language, setLanguage, currentOption, languages, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: StandardLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Toggle/Pill segment variant (Great for mobile navigation drawers)
  if (variant === 'toggle') {
    return (
      <div 
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold ${className}`}
        role="group"
        aria-label="Select Language"
      >
        {languages.map((opt: LanguageOption) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#C8102E] shadow-sm font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              } ${opt.fontClass}`}
              title={`${opt.label} (${opt.nativeLabel})`}
              aria-pressed={isActive}
            >
              <span className="text-sm">{opt.flag}</span>
              <span className="font-semibold">{opt.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (Header Top-bar and Navigation)
  const isDark = theme === 'dark';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer border ${
          isDark
            ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-100 hover:border-slate-600 shadow-sm'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
        } ${size === 'md' ? 'px-3 py-1.5 text-xs' : ''}`}
        title={`Current Language: ${currentOption.label} (${currentOption.nativeLabel})`}
      >
        <Globe className="w-3.5 h-3.5 text-[#C8102E] group-hover:rotate-12 transition-transform duration-300 shrink-0" />
        
        {/* Active Language Flag & Native Label */}
        <span className="text-xs shrink-0">{currentOption.flag}</span>
        <span className={`font-semibold tracking-wide ${currentOption.fontClass}`}>
          {currentOption.nativeLabel}
        </span>
        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider ml-0.5">
          ({currentOption.code})
        </span>

        <ChevronDown 
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className={`absolute z-50 mt-1.5 min-w-[190px] rounded-xl bg-white border border-slate-200/90 shadow-2xl py-1.5 animate-in fade-in-0 zoom-in-95 duration-150 ${
            isRtl ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
          }`}
        >
          {/* Menu Header */}
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#C8102E]" />
              Select Language / ቋንቋ / اللغة
            </span>
          </div>

          {/* Language Options */}
          {languages.map((opt: LanguageOption) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer text-left rtl:text-right ${
                  isActive
                    ? 'bg-red-50/80 text-[#C8102E] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base shrink-0 leading-none">{opt.flag}</span>
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${opt.fontClass}`}>
                      {opt.nativeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {opt.label} • {opt.code.toUpperCase()}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
