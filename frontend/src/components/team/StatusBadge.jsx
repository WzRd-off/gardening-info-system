import React from 'react';

export function StatusBadge({ status }) {
  return (
    <span className="team-status-badge" style={{ background: status.bg, color: status.color, borderColor: status.borderColor }}>
      <span className="team-status-badge-dot" style={{ background: status.color }} />
      {status.name}
    </span>
  );
}
