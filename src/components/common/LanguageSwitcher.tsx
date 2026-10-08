import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
] as const;

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return (
    <div className="flex items-center gap-1.5 bg-emerald-950/20 dark:bg-emerald-900/30 border border-emerald-800/30 rounded-full px-2.5 py-1 text-xs backdrop-blur-md">
      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <div className="flex items-center space-x-1">
        {languages.map((lang) => {
          const isActive = currentLang.startsWith(lang.code);
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              className={`px-2 py-0.5 rounded-full font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              {lang.native}
            </button>
          );
        })}
      </div>
    </div>
  );
};
