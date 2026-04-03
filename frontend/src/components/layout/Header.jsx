import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Header() {
    return (
        <>
        <header className="header">
            <div className="header__logo">
                <Link to="/">Garden</Link>
            </div>
            <nav className="header__nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/" className="header__nav_link">Головна</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/contact" className="header__nav_link">Контакты</Link>
                    </li>
                    <li toclassName="nav-item">

                    </li>
                </ul>
            </nav>
        </header>
        </>
    );
}