import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer-wrapper">
        <div className="footer-container">
            
            {/* Верхня частина з колонками */}
            <div className="footer-grid">
            
            {/* 1. Блок з логотипом та описом */}
            <div className="footer-col-brand">
                <Link to="/" className="footer-logo">
                EcoGarden
                </Link>
                <p className="footer-desc">
                Ваш надійний партнер у створенні та догляді за ідеальним садом. Ми поєднуємо природу та сучасні технології для вашого комфорту.
                </p>
            </div>

            {/* 2. Навігація */}
            <div className="footer-col-nav">
                <h3 className="footer-title">Компанія</h3>
                <nav className="footer-nav">
                <Link to="/" className="footer-link">Головна</Link>
                <Link to="#services" className="footer-link">Послуги</Link>
                <Link to="/portfolio" className="footer-link">Галерея робіт</Link>
                <Link to="/contacts" className="footer-link">Контакти</Link>
                </nav>
            </div>

            {/* 3. Контактна інформація */}
            <div className="footer-col-contacts">
                <h3 className="footer-title">Контакти</h3>
                <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+38 (099) 123-45-67</span>
                </div>
                <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>hello@ecogarden.ua</span>
                </div>
                <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>м. Київ, вул. Садова, 15</span>
                </div>
            </div>

            {/* 4. Соцмережі */}
            <div className="footer-col-socials">
                <h3 className="footer-title">Ми в мережі</h3>
                <div className="social-links">
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                </a>
                {/* Telegram */}
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </a>
                </div>
            </div>

            </div>

            {/* Нижня лінія з копірайтом */}
            <div className="footer-bottom">
            <p className="footer-copyright">
                © {new Date().getFullYear()} EcoGarden. Всі права захищені.
            </p>
            <div className="footer-legal-links">
                <Link to="/privacy" className="footer-legal-link">Політика конфіденційності</Link>
                <Link to="/terms" className="footer-legal-link">Умови використання</Link>
            </div>
            </div>

        </div>
        </footer>
    );
}