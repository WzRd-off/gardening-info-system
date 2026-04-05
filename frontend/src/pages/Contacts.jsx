import React, {useState} from "react";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ContactsPage(){

    return(
        <>
        <Header />
 
        <div className="contacts-page">
    
            {/* ── HERO ── */}
            <section className="contacts-hero">
                <div className="contacts-hero-inner">
                    <span className="contacts-eyebrow">Зв'яжіться з нами</span>
                    <h1 className="h1" style={{ color: 'var(--white)', marginBottom: '16px' }}>
                        Ми завжди на зв'язку
                    </h1>
                    <p className="text-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '520px' }}>
                        Маєте питання щодо послуг або хочете замовити консультацію? Напишіть або зателефонуйте — відповімо швидко.
                    </p>
                </div>
            </section>
    
            {/* ── MAIN CONTENT ── */}
            <section className="contacts-main">

                {/* TOP ROW: contacts left, hours right */}
                <div className="contacts-top-row">

                    {/* Contact cards */}
                    <div className="contacts-info-group">

                        <a href="tel:+380991234567" className="contact-info-card">
                            <div className="contact-info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Телефон</span>
                                <span className="contact-info-value">+38 (099) 123-45-67</span>
                                <span className="contact-info-hint">Пн–Пт, 9:00–18:00</span>
                            </div>
                        </a>

                        <a href="mailto:hello@ecogarden.ua" className="contact-info-card">
                            <div className="contact-info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Email</span>
                                <span className="contact-info-value">hello@ecogarden.ua</span>
                                <span className="contact-info-hint">Відповідаємо протягом дня</span>
                            </div>
                        </a>

                        <div className="contact-info-card" style={{ cursor: 'default' }}>
                            <div className="contact-info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Адреса офісу</span>
                                <span className="contact-info-value">м. Одеса, вул. Садова, 15</span>
                                <span className="contact-info-hint">Приймаємо за записом</span>
                            </div>
                        </div>

                    </div>

                    {/* Working hours card */}
                    <div className="contacts-hours-card">
                        <h3 className="contacts-hours-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Графік роботи
                        </h3>
                        <div className="contacts-hours-grid">
                            <span className="contacts-hours-day">Понеділок – П'ятниця</span>
                            <span className="contacts-hours-time">9:00 – 18:00</span>
                            <span className="contacts-hours-day">Субота</span>
                            <span className="contacts-hours-time">10:00 – 15:00</span>
                            <span className="contacts-hours-day">Неділя</span>
                            <span className="contacts-hours-time contacts-hours-closed">Вихідний</span>
                        </div>
                    </div>

                </div>

                {/* BOTTOM: full-width map */}
                <div className="contacts-map-wrapper">
                    <iframe
                        title="EcoGarden на карті"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2747.5!2d30.7233!3d46.4825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c633c8e9b4c1c7%3A0x0!2zT2Rlc3NhLCBVa3JhaW5l!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="contacts-map-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary-green)" stroke="none">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3" fill="white"/>
                        </svg>
                        <span>вул. Садова, 15, Одеса</span>
                    </div>
                </div>

            </section>
        </div>
    
        <Footer />

        </>
    );
}