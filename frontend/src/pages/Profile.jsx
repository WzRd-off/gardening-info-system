import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ProfileTab } from '../components/profile/ProfileTab';
import { PlotsTab } from '../components/profile/PlotsTab';
import { HistoryTab } from '../components/profile/HistoryTab';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('jwt')) { navigate('/auth'); return; }
    fetch('/profile/my_profile', { headers: authHeaders() })
      .then(r => { if (r.status === 401) { localStorage.removeItem('jwt'); navigate('/auth'); } return r.json(); })
      .then(d => setUser(d))
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/auth');
  };

  const tabs = [
    { id: 'profile', label: 'Мій профіль', icon: '👤' },
    { id: 'plots',   label: 'Мої ділянки', icon: '🌿' },
    { id: 'history', label: 'Замовлення',   icon: '📋' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'plots':   return <PlotsTab />;
      case 'history': return <HistoryTab />;
      default: return null;
    }
  };

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-grid">
          {/* ── Сайдбар ── */}
          <aside className="profile-sidebar">
            {/* Аватар + ім'я */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">🌱</div>
              <div className="profile-user-info">
                <p className="profile-user-name">
                  {user?.username ?? '...'}
                </p>
                <p className="profile-user-role">Клієнт</p>
              </div>
            </div>

            {/* Навігація */}
            <nav className="profile-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`profile-nav__item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="profile-nav__icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Вихід */}
            <button
              onClick={handleLogout}
              className="profile-logout"
            >
              <span className="profile-logout-icon">🚪</span>
              Вийти з акаунта
            </button>
          </aside>

          {/* ── Контент ── */}
          <main className="profile-main">
            {renderTab()}
          </main>

        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="profile-mobile-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`profile-mobile-tabs__btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="profile-mobile-tabs__icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <Footer />
    </>
  );
}
