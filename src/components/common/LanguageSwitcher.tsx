import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n, SupportedLocale, SUPPORTED_LOCALES } from '../../i18n';
import { cn } from '../../lib/utils';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'footer' | 'auth' | 'sidebar' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isArabic = locale === 'ar-SA';

  const handleSelect = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // 1. Direct Toggle Button for Navbar / Header
  if (variant === 'navbar' || variant === 'auth') {
    return (
      <div className={cn("relative inline-block text-start", className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer",
            variant === 'navbar'
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md shadow-sm"
              : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 shadow-xs"
          )}
          aria-label="Select Language"
          title={isArabic ? 'تغيير اللغة' : 'Change Language'}
        >
          <Globe size={14} className={variant === 'navbar' ? "text-emerald-400" : "text-emerald-600"} />
          <span>{isArabic ? 'العربية' : 'English'}</span>
          <span className="text-[10px] opacity-70">▾</span>
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute z-[100] mt-1.5 w-36 rounded-xl p-1.5 shadow-xl border transition-all animate-in fade-in zoom-in-95",
              isArabic ? "right-0" : "left-0",
              variant === 'navbar'
                ? "bg-[#0f1d32] border-slate-700/80 text-white"
                : "bg-white border-slate-200 text-slate-800"
            )}
          >
            {(Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]).map((loc) => {
              const info = SUPPORTED_LOCALES[loc];
              const isSelected = locale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-start",
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-400 font-bold"
                      : variant === 'navbar'
                      ? "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{info.flag}</span>
                    <span>{info.nativeName}</span>
                  </span>
                  {isSelected && <Check size={12} className="text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Footer inline style
  if (variant === 'footer') {
    return (
      <div className={cn("inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs", className)}>
        <button
          type="button"
          onClick={() => handleSelect('en')}
          className={cn(
            "px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer",
            locale === 'en'
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          )}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => handleSelect('ar-SA')}
          className={cn(
            "px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer font-arabic",
            locale === 'ar-SA'
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          )}
        >
          العربية
        </button>
      </div>
    );
  }

  // 3. Sidebar / Dropdown / Settings compact button
  const isDropdown = variant === 'dropdown';

  return (
    <div className={cn("relative inline-block text-start", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer shadow-xs bg-white"
        aria-label="Select Language"
      >
        <span className="flex items-center gap-2">
          <Globe size={14} className="text-emerald-600" />
          <span>{isArabic ? 'العربية' : 'English'}</span>
        </span>
        <span className="text-[10px] text-slate-400">▾</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-[100] min-w-[150px] rounded-xl p-1.5 shadow-xl bg-white border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95",
            isDropdown ? "top-full mt-1.5" : "bottom-full mb-1",
            isArabic ? "right-0" : "left-0"
          )}
        >
          {(Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]).map((loc) => {
            const info = SUPPORTED_LOCALES[loc];
            const isSelected = locale === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleSelect(loc)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-start",
                  isSelected ? "bg-emerald-50 text-emerald-700 font-bold" : "hover:bg-slate-100 text-slate-700"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{info.flag}</span>
                  <span>{info.nativeName}</span>
                </span>
                {isSelected && <Check size={12} className="text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
