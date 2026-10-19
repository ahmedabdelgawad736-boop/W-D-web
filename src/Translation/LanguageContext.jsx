import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EN } from './en';
import { AR } from './ar';

const LanguageContext = createContext();

/* How long the subtle language-swap fade lasts (mirrors the CSS animation). */
const SWAP_DURATION = 240;

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('wd_lang');
      if (saved === 'ar' || saved === 'en') return saved;
      return 'ar'; // Default to Arabic as primary design reference
    } catch {
      return 'ar';
    }
  });

  /* Non-zero only while a language change is animating, so the fade never runs
     on first paint and never interferes with the existing entrance animations. */
  const [swapSeq, setSwapSeq] = useState(0);

  const t = lang === 'ar' ? AR : EN;

  const setLang = useCallback(
    (next) => {
      if ((next !== 'ar' && next !== 'en') || next === lang) return;
      setSwapSeq((seq) => seq + 1);
      setLangState(next);
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setSwapSeq((seq) => seq + 1);
    setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  useEffect(() => {
    if (!swapSeq) return undefined;
    const id = window.setTimeout(() => setSwapSeq(0), SWAP_DURATION);
    return () => window.clearTimeout(id);
  }, [swapSeq]);

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
      <div
        className={[
          'app-lang-wrapper',
          lang === 'ar' ? 'lang-ar' : 'lang-en',
          swapSeq ? 'lang-swap-active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
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
