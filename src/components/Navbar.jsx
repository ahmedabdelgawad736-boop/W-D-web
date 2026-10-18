import React, { useState } from 'react';
import { Sun, Moon, FileText, Menu, X } from 'lucide-react';
import brandLogo from '../assets/brand icon/wd.jpg';
import { useLanguage } from '../Translation/LanguageContext';
import { useTheme } from '../ThemeContext/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="wd-navbar-wrapper">
      <div className="wd-container">
        <nav className={`wd-navbar ${lang === 'ar' ? 'nav-dir-ar' : 'nav-dir-en'}`}>
          {/* Brand Identity */}
          <div className="navbar-brand">
            <a href="#" className="brand-link" aria-label="Agency WD World Design Engineering">
              <div className="brand-logo-frame">
                <img 
                  src={brandLogo} 
                  alt="WD Logo" 
                  className="brand-logo-img" 
                />
              </div>
              <div className="brand-text-column">
                <span className="brand-main-title">{t.nav.brandTitle}</span>
                <span className="brand-sub-title">{t.nav.brandSubtitle}</span>
              </div>
            </a>
          </div>

          {/* Navigation Links (Center Pill Container) */}
          <div className={`nav-links-center ${mobileOpen ? 'mobile-drawer-open' : ''}`}>
            <div className="nav-pill-container">
              <a href="#about" className="nav-item" onClick={handleNavClick}>
                {t.nav.about}
              </a>
              <a href="#services" className="nav-item" onClick={handleNavClick}>
                {t.nav.services}
              </a>
              <a href="#works" className="nav-item" onClick={handleNavClick}>
                {t.nav.projects}
              </a>
              <a href="#methodology" className="nav-item" onClick={handleNavClick}>
                {t.nav.methodology}
              </a>
              <a href="#partners" className="nav-item" onClick={handleNavClick}>
                {t.nav.partners}
              </a>
              <a href="#contact" className="nav-item" onClick={handleNavClick}>
                {t.nav.contact}
              </a>
            </div>

            {/* Mobile-only action strip inside drawer */}
            <div className="mobile-action-strip">
              <button 
                type="button"
                className="theme-toggle-btn mobile-theme-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                <span>{theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}</span>
              </button>

              <div className="lang-toggle-pill mobile-lang-pill">
                <button
                  type="button"
                  className={`lang-option ${lang === 'ar' ? 'active' : ''}`}
                  onClick={() => setLang('ar')}
                >
                  AR
                </button>
                <button
                  type="button"
                  className={`lang-option ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Controls: Request Quote + Lang Toggle + Theme Toggle */}
          <div className="navbar-actions">
            {/* Request a Quote Button */}
            <a href="#contact" className="btn-quote" aria-label={t.nav.quoteBtn}>
              <FileText size={16} className="quote-icon" />
              <span>{t.nav.quoteBtn}</span>
            </a>

            {/* Language Switcher Pill (AR / EN) */}
            <div className="lang-toggle-pill" role="group" aria-label="Language Switcher">
              <button
                type="button"
                className={`lang-option ${lang === 'ar' ? 'active' : ''}`}
                onClick={() => setLang('ar')}
                aria-label="Switch to Arabic"
              >
                AR
              </button>
              <button
                type="button"
                className={`lang-option ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Compact Theme Toggle */}
            <button 
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
