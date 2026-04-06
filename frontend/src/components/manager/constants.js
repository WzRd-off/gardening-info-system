export const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('jwt')}` });
export const jsonHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` });

export const STATUS_LIST = [
  { id: 1, name: 'Отримано',              color: '#2196F3', bg: '#E3F2FD' },
  { id: 2, name: 'В дорозі',              color: '#FF9800', bg: '#FFF3E0' },
  { id: 3, name: 'В роботі',              color: '#8BC34A', bg: '#F1F8E9' },
  { id: 4, name: 'Виконано',              color: '#616161', bg: '#F5F5F5' },
  { id: 5, name: 'Проблеми з виконанням', color: '#D32F2F', bg: '#FFEBEE' },
];

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
