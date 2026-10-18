import React from 'react';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '../Translation/LanguageContext';
import wdHeroImg from '../assets/hero image/wd hero.png';
import './Hero.css';

export default function Hero() {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <section className="wd-hero-section" id="hero">
      <div className="wd-container">
        <div className={`hero-grid ${isAr ? 'hero-grid-ar' : 'hero-grid-en'}`}>
          {/* Text Content Column */}
          <div className="hero-text-col">
            {/* Location & Establishment Badge */}
            <div className="section-badge-pill hero-badge">
              <span className="dot" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-heading">
              <span className="hero-heading-line">{t.hero.titleLine1}</span>
              <span className="hero-heading-line">
                <span className="hero-highlight">{t.hero.titleLine2Highlight}</span>{' '}
                {t.hero.titleLine2Suffix}
              </span>
              <span className="hero-heading-line">{t.hero.titleLine3}</span>
            </h1>

            {/* Supporting Description */}
            <p className="hero-lead">
              {t.hero.leadText}
            </p>

            {/* Hero CTA Action Row */}
            <div className="hero-actions">
              {/* Primary Red Button */}
              <a href="#works" className="btn-hero-primary">
                <span>{t.hero.ctaPrimary}</span>
                {isAr ? (
                  <ArrowLeft size={18} className="cta-arrow" />
                ) : (
                  <ArrowRight size={18} className="cta-arrow" />
                )}
              </a>

              {/* Secondary Soft Pink Button */}
              <a href="#contact" className="btn-hero-secondary">
                <Users size={18} className="btn-icon" />
                <span>{t.hero.ctaSecondary}</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Display Card */}
          <div className="hero-visual-col">
            <div className="hero-card-frame">
              {/* Inner Screen displaying WD Hero Graphic */}
              <div className="hero-display-screen">
                <img 
                  src={wdHeroImg} 
                  alt="WD Agency Visual Identity" 
                  className="hero-logo-graphic"
                  loading="eager"
                />
              </div>

              {/* Bottom Card Meta Strip */}
              <div className="hero-card-meta">
                <span className="meta-badge">
                  <span className="dot-red" />
                  <span>{t.hero.tagRight}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
