import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ProfileTab } from '../components/profile/ProfileTab';
import { PlotsTab } from '../components/profile/PlotsTab';
import { HistoryTab } from '../components/profile/HistoryTab';
import { ChangePasswordTab } from '../components/profile/ChangePassword';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '../constants/Icons';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const tabs = [
    { id: 'profile', label: 'Мій профіль', icon: Icon.user },
    { id: 'plots',   label: 'Мої ділянки', icon: Icon.leaf },
    { id: 'history', label: 'Замовлення',   icon: Icon.list },
    { id: 'password', label: 'Змінити пароль',   icon: Icon.edit },
  ];

  // Визначаємо, чи є користувач менеджером (role_id = 2) або бригадиром (role_id = 3)
  const isManager = user?.role_id === 2;
  const isTeamLead = user?.role_id === 3;

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'plots':   return <PlotsTab />;
      case 'history': return <HistoryTab />;
      case 'password': return <ChangePasswordTab />;
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
              <div className="profile-avatar">{Icon.user}</div>
              <div className="profile-user-info">
                <p className="profile-user-name">
                  {user?.username ?? '...'}
                </p>
                <p className="profile-user-role">
                  {user?.role_id === 2 ? 'Менеджер' : user?.role_id === 3 ? 'Бригада' : 'Клієнт'}
                </p>
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

            {/* Роль-залежні кнопки навігації */}
            <div className="profile-role-actions">
              {isManager && (
                <button
                  onClick={() => navigate('/manager')}
                  className="profile-role-btn profile-role-btn--manager"
                  title="Перейти до панелі менеджера"
                >
                  {Icon.edit} Панель менеджера
                </button>
              )}
              {isTeamLead && (
                <button
                  onClick={() => navigate('/team')}
                  className="profile-role-btn profile-role-btn--team"
                  title="Перейти до сторінки команди"
                >
                  {Icon.users} Моя команда
                </button>
              )}
            </div>

            {/* Вихід */}
            <button
              onClick={handleLogout}
              className="profile-logout"
            >
              <span className="profile-logout-icon">{Icon.logout}</span>
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
