import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const NAV_LINKS = [
  { to: '/',         label: 'Головна' },
  { to: '/services', label: 'Послуги' },
  { to: '/contacts', label: 'Контакти' },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('jwt'));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div ref={menuRef}>
      <header className="header-container">

        {/* Логотип */}
        <Link to="/" className="header-logo-wrapper">
          <span className="header-logo">EcoGarden</span>
        </Link>

        {/* Десктопна навігація */}
        <nav className="header-nav">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link${isActive(to) ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Права зона */}
        <div className="header-cta-wrapper">

          {/* Кнопка профіль / увійти — тільки на десктопі */}
          {isLoggedIn ? (
            <Link
              to="/profile"
              className={`header-user-btn header-user-btn--desktop${isActive('/profile') ? ' header-user-btn--active' : ''}`}
            >
              <IconUser /> Профіль
            </Link>
          ) : (
            <Link
              to="/auth"
              className="header-user-btn header-user-btn--desktop"
            >
              <IconLogin /> Увійти
            </Link>
          )}

          {/* Бургер — тільки на мобільних */}
          <button
            className={`header-burger${menuOpen ? ' header-burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={menuOpen}
          >
            <span className="header-burger__line" />
            <span className="header-burger__line" />
            <span className="header-burger__line" />
          </button>

        </div>
      </header>

      {/* Мобільне меню */}
      <nav className={`header-mobile-menu${menuOpen ? ' header-mobile-menu--open' : ''}`}>
        <div className="header-mobile-menu__inner">

          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`header-mobile-menu__link${isActive(to) ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}

          <div className="header-mobile-menu__divider" />

          {isLoggedIn ? (
            <Link to="/profile" className="header-mobile-menu__user">
              <IconUser /> Профіль
            </Link>
          ) : (
            <Link to="/auth" className="header-mobile-menu__user">
              <IconLogin /> Увійти
            </Link>
          )}

        </div>
      </nav>
    </div>
  );
}