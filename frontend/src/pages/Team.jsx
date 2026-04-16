import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icons } from '../constants/Icons';
import { TasksTab } from '../components/team/TasksTab';
import { FinanceTab } from '../components/team/FinanceTab';
import { useAuth } from '../hooks/useAuth';
import { teamsAPI } from '../services/api';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [teamInfo, setTeamInfo] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    teamsAPI.getTeamInfo()
      .then(d => { if (Array.isArray(d) && d.length) setTeamInfo(d[0]); })
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/auth'); };

  const TABS = [
    { id: 'tasks', label: 'Завдання', icon: Icons.tasks },
    { id: 'finance', label: 'Фінанси', icon: Icons.finance },
  ];

  return (
    <>
      <Header />

      <div className="team-page">
        {/* Page header */}
        <div className="team-page-header">
          <div className="team-page-header-inner">
            {/* Top row: team name + logout */}
            <div className="team-page-header-top">
              <div className="team-page-info">
                <div className="team-avatar">
                  {Icons.tasks}
                </div>
                <div className="team-info-text">
                  <p className="team-name">{teamInfo?.name ?? 'Робоча панель'}</p>
                  <p className="team-subtitle">
                    Бригада виконавців
                    {teamInfo?.leader ? ` · ${teamInfo.leader}` : ''}
                  </p>
                </div>
              </div>
              <button onClick={handleLogout} className="team-logout-btn">
                {Icons.logout} Вийти
              </button>
            </div>

            {/* Tab bar */}
            <div className="team-page-tabs">
              {TABS.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`team-page-tab ${activeTab === tab.id ? 'active' : ''}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="team-page-content">
          {activeTab === 'tasks' && <TasksTab />}
          {activeTab === 'finance' && <FinanceTab />}
        </div>
      </div>

      <Footer />
    </>
  );
}