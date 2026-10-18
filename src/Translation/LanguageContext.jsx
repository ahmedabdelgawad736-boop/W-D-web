import React, { createContext, useContext, useState, useEffect } from 'react';
import { EN } from './en';
import { AR } from './ar';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('wd_lang');
      if (saved === 'ar' || saved === 'en') return saved;
      return 'ar'; // Default to Arabic as primary design reference
    } catch {
      return 'ar';
    }
  });

  const t = lang === 'ar' ? AR : EN;

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('wd_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      <div className={`app-lang-wrapper ${lang === 'ar' ? 'lang-ar' : 'lang-en'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
