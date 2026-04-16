import React, { useState, useEffect } from 'react';
import { Icons } from '../../constants/Icons';
import { Spinner } from './Spinner';
import { teamsAPI } from '../../services/api';

const MONTHLY_TARGET = 20;

export function FinanceTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await teamsAPI.getTeamFinance();
        setData(d);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  if (error) return (
    <div className="team-error-msg">
      {Icons.alert} {error}
    </div>
  );
  if (!data) return null;

  const totalEarned = data.total_earned ?? data.earned ?? 0;
  const completedCount = data.completed_orders ?? data.count ?? 0;
  const transactions = data.payments ?? data.transactions ?? [];
  const progress = Math.min(Math.round((completedCount / MONTHLY_TARGET) * 100), 100);

  const paymentStatus = (p) => {
    const s = (p.status ?? '').toLowerCase();
    if (s.includes('оплач')) return { label: 'Оплачено', color: '#007D00', bg: '#E3F0DB' };
    if (s.includes('очік')) return { label: 'Очікує виплати', color: '#FF9800', bg: '#FFF3E0' };
    return { label: p.status ?? '—', color: '#616161', bg: '#F5F5F5' };
  };

  return (
    <div className="team-finance-container">
      {/* Main earnings card */}
      <div className="team-finance-card">
        <div className="team-finance-card-bg1" />
        <div className="team-finance-card-bg2" />
        <p className="team-finance-card-label">Загальна сума нарахувань</p>
        <p className="team-finance-card-amount">{Number(totalEarned).toLocaleString('uk-UA')} ₴</p>
        <div className="team-finance-card-stats">
          <div>
            <p className="team-finance-card-stat-value">{completedCount}</p>
            <p className="team-finance-card-stat-label">Виконано замовлень</p>
          </div>
          {transactions.length > 0 && (
            <div>
              <p className="team-finance-card-stat-value">{transactions.length}</p>
              <p className="team-finance-card-stat-label">Транзакцій</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress card */}
      <div className="team-progress-card">
        <div className="team-progress-header">
          <div className="team-progress-title">
            {Icons.trendUp}
            <span>Прогрес місяця</span>
          </div>
          <span className="team-progress-percent">{progress}%</span>
        </div>
        <div className="team-progress-bar">
          <div className="team-progress-fill" style={{
            width: `${progress}%`,
            background: progress >= 80 ? 'var(--primary-green)' : progress >= 50 ? 'var(--accent-green)' : '#FF9800',
          }} />
        </div>
        <p className="team-progress-text">
          {completedCount} з {MONTHLY_TARGET} замовлень до місячного орієнтиру
        </p>
      </div>

      {/* Transactions list */}
      <div className="team-transactions-card">
        <div className="team-transactions-header">
          {Icons.receipt}
          <h3>Історія нарахувань</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="team-transactions-empty">
            <p>Нарахувань ще немає</p>
          </div>
        ) : (
          <div>
            {transactions.map((tx, i) => {
              const ps = paymentStatus(tx);
              const date = tx.created_at ?? tx.date;
              return (
                <div key={tx.id ?? i} className="team-transaction-item">
                  <div>
                    <span className="team-transaction-name">
                      {tx.order?.service?.name ?? `Замовлення #${tx.order_id ?? i + 1}`}
                    </span>
                    {date && (
                      <span className="team-transaction-date">
                        {new Date(date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="team-transaction-right">
                    <span className="team-transaction-status" style={{ background: ps.bg, color: ps.color }}>
                      {ps.label}
                    </span>
                    <span className="team-transaction-amount">
                      +{Number(tx.amount ?? tx.sum ?? 0).toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
