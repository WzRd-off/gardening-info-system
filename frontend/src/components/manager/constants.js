export const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });
export const jsonHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` });

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

export function numericOnKeyDown(e) {
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ','];
  if (allowed.includes(e.key) || (e.key >= '0' && e.key <= '9')) return;
  e.preventDefault();
}

// Calendar constants
export const MONTH_UA = ['Січень','Лютий','Березень','Квітень','Травень','Червень',
                  'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
export const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

// Services categories
export const CATEGORIES = ["Система поливу", "Садівництво та догляд", "Ландшафний дизайн", "Екологічні матеріали", "Газон"];
