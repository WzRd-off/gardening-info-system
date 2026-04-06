import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
        setIsLoggedIn(true);
        }
    }, []);

    return (
    <header className="header-container">
        <div className="header-logo-wrapper">
            <span className="header-logo">
            Garden
            </span>
        </div>

        <nav className="header-nav">
            <Link to="/" className="nav-link">
            Головна
            </Link>
            <Link to="/services" className="nav-link">
            Послуги
            </Link>
            <Link to="/contacts" className="nav-link">
            Контакти
            </Link>
        </nav>
        <div className="header-cta-wrapper">

            {isLoggedIn ? (
                <Link to="/profile" className="none-text-decoration ">
                    <button className="btn-outline">
                    Профіль
                    </button>
                </Link>
            ) : (
                <Link to="/auth" className="none-text-decoration ">
                    <button className="btn-outline">
                    Увійти
                    </button>
                </Link>
            )}


        </div>
    </header>
    );
}