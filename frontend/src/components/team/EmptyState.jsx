import React from 'react';

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="team-empty-state">
      <div className="team-empty-state-icon">{icon}</div>
      <p className="team-empty-state-title">{title}</p>
      {sub && <p className="team-empty-state-sub">{sub}</p>}
    </div>
  );
}
