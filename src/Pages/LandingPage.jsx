import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Truck,
  Type,
  Monitor,
  Compass,
  Store,
  Building2,
  Sparkles,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Landmark,
  Factory,
  HeartPulse,
  Car,
  MapPin,
  Phone,
  Mail,
  Send,
} from 'lucide-react';
import { useLanguage } from '../Translation/LanguageContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import CardCarousel from '../components/CardCarousel';

import aboutImg from '../assets/about image/about image.jpg';
import work1 from '../assets/work images/work 1.jpg';
import work2 from '../assets/work images/work 2.jpg';
import work4 from '../assets/work images/work 4.jpg';
import work5 from '../assets/work images/work 5.jpg';
import work6 from '../assets/work images/work 6.jpg';

import './LandingPage.css';

/* Service Icons Mapping */
const serviceIconMap = {
  Type,
  Monitor,
  Compass,
  Store,
  Building2,
  Sparkles,
  Image: ImageIcon,
  MapPin,
};

/* Project Gallery Image Mapping */
const galleryImageMap = {
  work1,
  about: aboutImg,
  work2,
  work4,
  work5,
  work6,
};

/* Partner Sector Icons Mapping */
const partnerIcons = {
  Landmark,
  Factory,
  HeartPulse,
  Building2,
  Truck,
  Car,
};

/* --------------------------------------------------------------------------
   1. Stats / Metrics Section
   -------------------------------------------------------------------------- */

/* Duration of the count-up: quick and calm rather than showy. */
const STAT_COUNT_DURATION = 1050;

/* Longest the count-up will wait for the web fonts (Plus Jakarta Sans /
   Cairo) to settle. Beyond that it shows the final values instead of counting
   across a font swap, so a slow or blocked font request can neither reflow the
   card mid-animation nor stall the section at 0. */
const STAT_FONT_WAIT_MAX = 3000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Splits a value like "50,000 +" into prefix / digits / suffix so the exact
   original string can always be restored as the final rendered value. */
function parseMetricValue(value) {
  const match = /^([^0-9]*)([0-9][0-9,.]*)([\s\S]*)$/.exec(String(value).trim());
  if (!match) return null;
  const digits = match[2].replace(/[^0-9]/g, '');
  if (!digits) return null;
  return {
    prefix: match[1],
    suffix: match[3],
    target: Number.parseInt(digits, 10),
    separator: match[2].includes(',') ? ',' : '',
  };
}

/* Keeps the original thousand separator while counting up. */
function formatCount(value, separator) {
  const digits = String(Math.max(0, Math.round(value)));
  if (!separator) return digits;
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function StatsSection({ isAr, t }) {
  const sectionRef = useRef(null);
  /* Reduced-motion users (and browsers without IntersectionObserver) get the
     real values immediately — no counting, no flicker. */
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setProgress(1);
      return undefined;
    }

    let frame = 0;
    let fontWait = 0;
    let cancelled = false;

    const countUp = () => {
      const startedAt = performance.now();
      const step = (now) => {
        if (cancelled) return;
        const ratio = Math.min(1, (now - startedAt) / STAT_COUNT_DURATION);
        const eased = 1 - Math.pow(1 - ratio, 3); /* easeOutCubic */
        if (ratio >= 1) {
          setProgress(1);
          return;
        }
        setProgress(eased);
        frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    };

    const startCounting = () => {
      if (cancelled) return;
      /* Flush style+layout so an already-loaded web font is applied before the
         first animated frame is measured. */
      void document.body.offsetHeight;
      countUp();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        /* Count once: the observer disconnects on the first trigger, so
           scrolling away and back never restarts the animation. */
        observer.disconnect();
        if (triggeredRef.current) return;
        triggeredRef.current = true;

        /* Let the web fonts settle first. Counting while Plus Jakarta Sans /
           Cairo are still swapping in (font-display: swap) lets that swap
           reflow the stat card in the middle of the animation. If the fonts
           have not settled within STAT_FONT_WAIT_MAX, show the final values
           instead of counting: a graceful skip beats a reflowing count-up, and
           a slow or unreachable font request can never stall the section. */
        let resolved = false;
        const begin = () => {
          if (resolved || cancelled) return;
          resolved = true;
          startCounting();
        };
        const skip = () => {
          if (resolved || cancelled) return;
          resolved = true;
          setProgress(1);
        };
        if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
          document.fonts.ready.then(begin, begin);
          fontWait = window.setTimeout(skip, STAT_FONT_WAIT_MAX);
        } else {
          begin();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(fontWait);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  /* progress === 1 renders the untouched original string, so the finished
     value keeps its exact formatting, suffix and styling. */
  const renderMetric = (value) => {
    if (progress >= 1) return value;
    const parsed = parseMetricValue(value);
    if (!parsed) return value;
    return (
      parsed.prefix +
      formatCount(parsed.target * progress, parsed.separator) +
      parsed.suffix
    );
  };

  return (
    <section className="stats-bar-section" id="metrics" ref={sectionRef}>
      <div className="wd-container">
        <div className={`stats-grid ${isAr ? 'stats-grid-ar' : 'stats-grid-en'}`}>
          {t.metrics.map((item, idx) => (
            <div key={idx} className="stat-card">
              <span className="stat-header font-mono">{item.header}</span>
              <div className="stat-value-row">
                <span className={`stat-num ${item.isRed ? 'stat-num-red' : ''}`}>
                  {renderMetric(item.value)}
                </span>
              </div>
              <p className="stat-caption">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   2. About Us Section
   -------------------------------------------------------------------------- */
function AboutSection({ isAr, t }) {
  return (
    <section className="wd-about-section" id="about">
      <div className="wd-container">
        <div className={`about-grid ${isAr ? 'about-grid-ar' : 'about-grid-en'}`}>
          {/* Text Content Column */}
          <div className="about-text-col">
            <div className="section-badge-pill about-badge">
              <span>{t.about.badge}</span>
            </div>

            <h2 className="about-heading">
              <span>{t.about.titleLine1}</span>
              <span className="about-heading-sub">{t.about.titleLine2}</span>
            </h2>

            <p className="about-desc">
              {t.about.p1Start}
              <strong className="text-highlight">{t.about.p1Highlight}</strong>
              {t.about.p1End}
            </p>

            <p className="about-desc">{t.about.p2}</p>

            <div className="about-features-grid">
              {t.about.features.map((feature, idx) => (
                <div key={idx} className="feature-pill-card">
                  <CheckCircle2 size={18} className="feature-check-icon" />
                  <span className="feature-pill-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className="about-visual-col">
            <div className="about-card-wrapper">
              <div className="about-image-frame">
                <img
                  src={aboutImg}
                  alt="W & D 10th of Ramadan Industrial Factory"
                  className="about-factory-img"
                  loading="lazy"
                />
              </div>

              <div className="about-subbar">
                <span className="subbar-est font-mono">{t.about.imageMeta.est}</span>
                <div className="subbar-caption">
                  <Wrench size={16} className="subbar-icon" />
                  <span>{t.about.imageMeta.caption}</span>
                </div>
              </div>

              <div className="about-boxes-row">
                <div className="about-stat-box">
                  <div className="stat-box-header">
                    <ShieldCheck size={18} className="stat-box-icon" />
                    <span className="stat-box-title">{t.about.statBox1.title}</span>
                  </div>
                  <p className="stat-box-desc">{t.about.statBox1.desc}</p>
                </div>

                <div className="about-stat-box">
                  <div className="stat-box-header">
                    <Truck size={18} className="stat-box-icon" />
                    <span className="stat-box-title">{t.about.statBox2.title}</span>
                  </div>
                  <p className="stat-box-desc">{t.about.statBox2.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   3. Engineering Services Section
   -------------------------------------------------------------------------- */
function ServicesSection({ isAr, t }) {
  return (
    <section className="wd-services-section" id="services">
      <div className="wd-container">
        <div className={`services-header ${isAr ? 'header-dir-ar' : 'header-dir-en'}`}>
          <div className="services-title-col">
            <div className="section-badge-pill services-badge">
              <span>{t.services.badge}</span>
            </div>
            <h2 className="services-heading">{t.services.title}</h2>
          </div>

          <div className="services-desc-col">
            <p className="services-summary">{t.services.summary}</p>
          </div>
        </div>

        <CardCarousel
          className={`services-grid ${isAr ? 'services-grid-ar' : 'services-grid-en'}`}
          label={t.services.title}
        >
          {t.services.items.map((service) => {
            const IconComponent = serviceIconMap[service.icon] || Building2;
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon-frame">
                  <IconComponent size={22} className="service-icon" />
                </div>

                <span className="service-code font-mono">{service.code}</span>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>

                <div className="service-card-footer">
                  <a href="#contact" className="service-link">
                    <span>{t.services.moreDetails}</span>
                    {isAr ? (
                      <ArrowLeft size={15} className="service-arrow" />
                    ) : (
                      <ArrowRight size={15} className="service-arrow" />
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </CardCarousel>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   4. Major Projects Gallery Section
   -------------------------------------------------------------------------- */
function ProjectsSection({ isAr, t }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems =
    activeFilter === 'all'
      ? t.works.items
      : t.works.items.filter((item) => item.categoryType === activeFilter);

  return (
    <section className="wd-projects-section" id="works">
      <div className="wd-container">
        <div className={`projects-header ${isAr ? 'header-dir-ar' : 'header-dir-en'}`}>
          <div className="projects-title-col">
            <div className="section-badge-pill projects-badge">
              <span>{t.works.badge}</span>
            </div>
            <h2 className="projects-heading">{t.works.title}</h2>
          </div>

          <div className="projects-filter-bar" role="tablist" aria-label="Project Categories">
            {t.works.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-tab-btn ${activeFilter === tab.id ? 'active-filter' : ''}`}
                onClick={() => setActiveFilter(tab.id)}
                role="tab"
                aria-selected={activeFilter === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <CardCarousel
          className={`projects-grid ${isAr ? 'projects-grid-ar' : 'projects-grid-en'}`}
          label={t.works.badge}
        >
          {filteredItems.map((item) => (
            <article key={item.id} className="project-card">
              <div className="project-image-box">
                <span className="project-location-tag">{item.tag}</span>
                <img
                  src={galleryImageMap[item.imageKey]}
                  alt={item.title}
                  className="project-img"
                  loading="lazy"
                />
              </div>

              <div className="project-content">
                <span className="project-subcaption">{item.subCaption}</span>
                <h3 className="project-title">{item.title}</h3>
                <p className="project-desc">{item.description}</p>

                <div className="project-meta-strip">
                  <span className="project-delivery">
                    {t.works.deliveryPrefix}
                    {item.delivery}
                  </span>
                  <span className="project-status font-mono">{t.works.statusLabel}</span>
                </div>
              </div>
            </article>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   5. Engineering Methodology Section
   -------------------------------------------------------------------------- */
function MethodologySection({ isAr, t }) {
  return (
    <section className="wd-methodology-section" id="methodology">
      <div className="wd-container">
        <div className="methodology-header">
          <div className="section-badge-pill methodology-badge">
            <span>{t.methodology.badge}</span>
          </div>
          <h2 className="methodology-heading">{t.methodology.title}</h2>
          <p className="methodology-summary">{t.methodology.summary}</p>
        </div>

        <CardCarousel
          className={`methodology-grid ${isAr ? 'grid-dir-ar' : 'grid-dir-en'}`}
          label={t.methodology.badge}
        >
          {t.methodology.steps.map((step) => (
            <div key={step.number} className="methodology-card">
              <div className="step-number-row">
                <span className="step-big-number font-mono">{step.number}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   6. Success Partners Section
   -------------------------------------------------------------------------- */
function PartnersSection({ isAr, t }) {
  return (
    <section className="wd-partners-section" id="partners">
      <div className="wd-container">
        <div className={`partners-header ${isAr ? 'header-dir-ar' : 'header-dir-en'}`}>
          <div className="partners-title-col">
            <span className="partners-badge-text font-mono">{t.partners.badge}</span>
            <h2 className="partners-heading">{t.partners.title}</h2>
          </div>

          <div className="partners-desc-col">
            <p className="partners-summary">{t.partners.summary}</p>
          </div>
        </div>

        <CardCarousel
          className={`partners-grid ${isAr ? 'partners-grid-ar' : 'partners-grid-en'}`}
          label={t.partners.title}
        >
          {t.partners.sectors.map((sector, idx) => {
            const IconComponent = partnerIcons[sector.icon] || Building2;
            return (
              <div key={idx} className="partner-sector-card">
                <div className="partner-icon-wrapper">
                  <IconComponent size={24} className="partner-icon" />
                </div>
                <h3 className="partner-sector-title">{sector.title}</h3>
                <p className="partner-sector-sub">{sector.subtitle}</p>
              </div>
            );
          })}
        </CardCarousel>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   7. Direct Engineering Contact Section
   -------------------------------------------------------------------------- */
function ContactSection({ isAr, t }) {
  return (
    <section className="wd-contact-section" id="contact">
      <div className="wd-container">
        <div className={`contact-card-frame ${isAr ? 'contact-dir-ar' : 'contact-dir-en'}`}>
          <div className="contact-main-col">
            <div className="section-badge-pill contact-badge">
              <span>{t.contact.badge}</span>
            </div>

            <h2 className="contact-heading">{t.contact.title}</h2>
            <p className="contact-summary">{t.contact.summary}</p>

            <div className="contact-actions">
              <a
                href="https://wa.me/201005822000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-contact-primary"
              >
                <Send size={18} className="btn-icon" />
                <span>{t.contact.ctaBtn}</span>
              </a>
            </div>
          </div>

          <div className="contact-info-col">
            <div className="info-item">
              <div className="info-icon-frame">
                <MapPin size={20} className="info-icon" />
              </div>
              <div className="info-text">
                <span className="info-label">{t.contact.locationTitle}</span>
                <span className="info-value">{t.contact.locationValue}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-frame">
                <Phone size={20} className="info-icon" />
              </div>
              <div className="info-text">
                <span className="info-label">{t.contact.phoneTitle}</span>
                <span className="info-value font-mono">{t.contact.phoneValue}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-frame">
                <Mail size={20} className="info-icon" />
              </div>
              <div className="info-text">
                <span className="info-label">{t.contact.emailTitle}</span>
                <span className="info-value font-mono">{t.contact.emailValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Main Landing Page Component
   -------------------------------------------------------------------------- */
export default function LandingPage() {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="wd-app-root">
      {/* Header & Sticky Navbar */}
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Cards directly below Hero (StatsBar) */}
        <StatsSection isAr={isAr} t={t} />

        {/* About Us ("من نحن") */}
        <AboutSection isAr={isAr} t={t} />

        {/* Engineering Services ("خدماتنا الهندسية والتنفيذية المتخصصة") */}
        <ServicesSection isAr={isAr} t={t} />

        {/* Major Projects Gallery ("معرض المشاريع الكبرى") */}
        <ProjectsSection isAr={isAr} t={t} />

        {/* Engineering Methodology ("كيف نحول المخطط المعماري إلى واقع ملموس") */}
        <MethodologySection isAr={isAr} t={t} />

        {/* Success Partners ("شركاء النجاح والصروح التي نعتز بها") */}
        <PartnersSection isAr={isAr} t={t} />

        {/* Direct Engineering Contact Section */}
        <ContactSection isAr={isAr} t={t} />
      </main>

      {/* Complete Engineering Footer */}
      <Footer />
    </div>
  );
}
