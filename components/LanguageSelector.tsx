'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation, Locale } from '@/hooks/useTranslation';

const languages: { code: Locale; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

interface LanguageSelectorProps {
  variant?: 'light' | 'dark';
}

export default function LanguageSelector({ variant = 'dark' }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: Locale) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  const baseStyles = variant === 'light' 
    ? 'text-white hover:bg-white/10' 
    : 'text-dark hover:bg-gray-100';

  const dropdownStyles = 'bg-white text-dark shadow-lg';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${baseStyles}`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLang.nativeName}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 end-0 min-w-[160px] rounded-lg border border-gray-100 overflow-hidden z-50 ${dropdownStyles}`}
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-start hover:bg-gray-50 transition-colors flex items-center justify-between ${
                currentLanguage === lang.code ? 'bg-accent/10 text-primary' : ''
              }`}
              role="option"
              aria-selected={currentLanguage === lang.code}
            >
              <span className="font-medium">{lang.nativeName}</span>
              {currentLanguage === lang.code && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

