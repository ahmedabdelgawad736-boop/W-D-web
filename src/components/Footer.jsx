import React from 'react';
import brandLogo from '../assets/brand icon/wd.jpg';
import { useLanguage } from '../Translation/LanguageContext';
import './Footer.css';

function WhatsAppIcon() {
  return (
    <svg 
      className="footer-social-svg" 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a10.003 10.003 0 0 0 4.779 1.216h.004c5.505 0 9.99-4.478 9.99-9.985 0-2.668-1.039-5.176-2.926-7.062A9.927 9.927 0 0 0 12.012 2zm5.836 14.122c-.244.688-1.42 1.32-1.956 1.406-.514.083-1.18.118-3.793-.964-3.34-1.381-5.467-4.795-5.633-5.016-.166-.222-1.354-1.802-1.354-3.437 0-1.635.856-2.439 1.161-2.772.306-.333.666-.416.888-.416.222 0 .444.002.638.012.206.01.482-.078.754.577.28.674.954 2.327 1.038 2.497.083.17.139.37.028.592-.111.222-.167.36-.333.555-.167.194-.35.434-.5.583-.167.166-.341.347-.147.68.195.333.865 1.426 1.854 2.308 1.272 1.134 2.344 1.485 2.677 1.651.333.167.527.139.721-.083.194-.222.832-.971 1.054-1.304.222-.333.444-.278.749-.166.305.111 1.942.916 2.275 1.082.333.167.555.25.638.389.083.139.083.805-.161 1.493z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg 
      className="footer-social-svg" 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg 
      className="footer-social-svg" 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor" 
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <footer className={`wd-footer ${isAr ? 'footer-dir-ar' : 'footer-dir-en'}`}>
      <div className="wd-container">
        {/* Upper Footer Grid */}
        <div className="footer-grid">
          {/* Col 1: Brand & Bio */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-wrap">
              <div className="brand-logo-frame">
                <img 
                  src={brandLogo} 
                  alt="W & D Brand Icon" 
                  className="brand-logo-img" 
                />
              </div>
              <div className="brand-text-column">
                <span className="brand-main-title">{t.nav.brandTitle}</span>
                <span className="brand-sub-title">{t.nav.brandSubtitle}</span>
              </div>
            </div>

            <p className="footer-company-desc">
              {t.footer.companyDesc}
            </p>

            {/* Social Icons */}
            <div className="footer-socials">
              <a 
                href="https://wa.me/201000000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn" 
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn" 
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn" 
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-title">{t.footer.quickLinksTitle}</h4>
            <ul className="footer-nav-list">
              <li><a href="#about">{t.nav.about}</a></li>
              <li><a href="#services">{t.nav.services}</a></li>
              <li><a href="#works">{t.nav.projects}</a></li>
              <li><a href="#methodology">{t.nav.methodology}</a></li>
              <li><a href="#partners">{t.nav.partners}</a></li>
              <li><a href="#contact">{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Col 3: Engineering Services */}
          <div className="footer-col">
            <h4 className="footer-title">{t.footer.divisionsTitle}</h4>
            <ul className="footer-nav-list">
              <li><a href="#services">{t.services.items[0]?.title}</a></li>
              <li><a href="#services">{t.services.items[1]?.title}</a></li>
              <li><a href="#services">{t.services.items[4]?.title}</a></li>
              <li><a href="#services">{t.services.items[7]?.title}</a></li>
            </ul>
          </div>

          {/* Col 4: Certifications */}
          <div className="footer-col">
            <h4 className="footer-title">{t.footer.certsTitle}</h4>
            <ul className="footer-certs-list">
              {t.footer.certs.map((cert, idx) => (
                <li key={idx} className="cert-item">
                  <span className="cert-square font-mono">■</span>
                  <span className="cert-text font-mono">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} {t.footer.copyright}
          </p>
          <div className="footer-meta font-mono">
            <span>10TH OF RAMADAN • CAIRO • ALEXANDRIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
