// Хелпери для запитів до API
export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});
