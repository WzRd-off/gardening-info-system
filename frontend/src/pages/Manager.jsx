import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../constants/Icons';
import ServicesTab from '../components/manager/ServicesTab';
import OrdersTab from '../components/manager/OrdersTab';
import TeamsTab from '../components/manager/TeamsTab';
import CalendarTab from '../components/manager/CalendarTab';

const TABS = [
  { id: 'services', label: 'Послуги', icon: Icon.leaf },
  { id: 'orders', label: 'Замовлення', icon: Icon.list },
  { id: 'teams', label: 'Бригади', icon: Icon.users },
  { id: 'calendar', label: 'Календар', icon: Icon.calendar },
];

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/auth');
  };

  return (
    <div className="mgr-page">
      <div className="mgr-layout">
        <header className="mgr-header">
          <div className="mgr-header__logo">
            <span>{Icon.leaf}</span>
            <div className="mgr-header__logo-text">
              <span>EcoGarden</span>
              <span>менеджер</span>
            </div>
          </div>

          <nav className="mgr-tab-list">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`mgr-tab ${activeTab === tab.id ? 'mgr-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button type="button" className="mgr-logout-button" onClick={handleLogout}>
            {Icon.logout}
            <span>Вийти</span>
          </button>
        </header>

        <main className="mgr-content">
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'teams' && <TeamsTab />}
          {activeTab === 'calendar' && <CalendarTab />}
        </main>
      </div>
    </div>
  );
}
