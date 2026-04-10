import { TEAM_STATUSES } from './constants';

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export function statusById(id) {
  return TEAM_STATUSES.find(s => s.id === id) || TEAM_STATUSES[0];
}

export function statusByName(name) {
  return TEAM_STATUSES.find(s => s.name.toLowerCase() === name?.toLowerCase()) || TEAM_STATUSES[0];
}

export function resolveStatus(order) {
  if (order.status_id) return statusById(order.status_id);
  if (order.status?.id) return statusById(order.status.id);
  if (order.status?.name) return statusByName(order.status.name);
  if (typeof order.status === 'string') return statusByName(order.status);
  return TEAM_STATUSES[0];
}
