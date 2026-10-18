import React from 'react';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '../Translation/LanguageContext';
import heroImg from '../assets/hero image/hero image.png';
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

            {/* Main Headline — line 3 continues on line 2 ("…Signage in Egypt");
                the glue span keeps "in Egypt" attached to "Signage" when the
                column is too narrow for the whole line. */}
            <h1 className="hero-heading">
              <span className="hero-heading-line">{t.hero.titleLine1}</span>
              <span className="hero-heading-line">
                <span className="hero-highlight">{t.hero.titleLine2Highlight}</span>{' '}
                {t.hero.titleLine2Suffix}
                <span className="hero-heading-glue">{'\u00A0'}{t.hero.titleLine3}</span>
              </span>
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

          {/* Hero Visual — image sits directly in the section, no card wrapper */}
          <div className="hero-visual-col">
            <img
              src={heroImg}
              alt="WD Agency highway billboard & pylon signage"
              className="hero-main-img"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
