import { getAuthHeaders, getJsonHeaders } from '../services/api';

// ============= AUTH & HEADERS =============
export const authHeaders = getAuthHeaders;
export const jsonHeaders = getJsonHeaders;

// ============= ORDER STATUSES =============
export const STATUS_LIST = [
  { id: 1, name: 'Отримано',              color: '#2196F3', bg: '#E3F2FD' },
  { id: 2, name: 'В дорозі',              color: '#FF9800', bg: '#FFF3E0' },
  { id: 3, name: 'В роботі',              color: '#8BC34A', bg: '#F1F8E9' },
  { id: 4, name: 'Виконано',              color: '#616161', bg: '#F5F5F5' },
  { id: 5, name: 'Проблеми з виконанням', color: '#D32F2F', bg: '#FFEBEE' },
];

export const STATUS_MAP = {
  'Отримано':              { color: '#2196F3', bg: '#E3F2FD', label: 'Отримано' },
  'В дорозі':              { color: '#FF9800', bg: '#FFF3E0', label: 'В дорозі' },
  'В роботі':              { color: '#8BC34A', bg: '#F1F8E9', label: 'В роботі' },
  'Виконано':              { color: '#616161', bg: '#F5F5F5', label: 'Виконано' },
  'Проблеми з виконанням': { color: '#D32F2F', bg: '#FFEBEE', label: 'Проблема' },
};

export function statusMeta(nameOrId) {
  return STATUS_LIST.find(s =>
    s.name.toLowerCase() === nameOrId?.toString().toLowerCase() || s.id === nameOrId
  ) || { name: nameOrId ?? '—', color: '#616161', bg: '#F5F5F5' };
}

// ============= UTILITY FUNCTIONS =============
export function numericOnKeyDown(e) {
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ','];
  if (allowed.includes(e.key) || (e.key >= '0' && e.key <= '9')) return;
  e.preventDefault();
}

// ============= CALENDAR CONSTANTS =============
export const MONTH_UA = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

// ============= SERVICE CATEGORIES =============
export const CATEGORIES = [
  "Система поливу",
  "Садівництво та догляд",
  "Ландшафний дизайн",
  "Екологічні матеріали",
  "Газон"
];

// ============= TEAM STATUSES =============
export const TEAM_STATUSES = [
  { id: 1, name: 'Отримано',              color: '#2196F3', bg: '#E3F2FD', borderColor: '#BBDEFB' },
  { id: 2, name: 'В дорозі',              color: '#FF9800', bg: '#FFF3E0', borderColor: '#FFE0B2' },
  { id: 3, name: 'В роботі',              color: '#8BC34A', bg: '#F1F8E9', borderColor: '#DCEDC8' },
  { id: 4, name: 'Виконано',              color: '#616161', bg: '#F5F5F5', borderColor: '#E0E0E0' },
  { id: 5, name: 'Проблеми з виконанням', color: '#D32F2F', bg: '#FFEBEE', borderColor: '#FFCDD2' },
];

export const STATUS_STRIPE = {
  1: '#2196F3',
  2: '#2196F3',
  3: '#8BC34A',
  4: '#9E9E9E',
  5: '#D32F2F',
};
