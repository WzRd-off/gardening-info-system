import { API_BASE_URL } from './config';

/**
 * Получить заголовки авторизации
 */
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
});

/**
 * Получить заголовки для JSON запроса с авторизацией
 */
export const getJsonHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
});

/**
 * Базовая функция для API запросов с обработкой ошибок
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = options.headers || getJsonHeaders();

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Проверка 401 - перенаправить на вход
    if (response.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/auth';
      throw new Error('Сессия истекла');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Обработка Pydantic validation errors (422)
      if (response.status === 422 && Array.isArray(errorData.detail)) {
        const errors = errorData.detail.map(err => 
          `${err.loc?.join('.')}: ${err.msg}`
        ).join('; ');
        throw new Error(`Ошибка валидации: ${errors}`);
      }
      
      throw new Error(errorData.detail || `Ошибка ${response.status}`);
    }

    // Обработка пустых ответов (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= AUTH =============

export const authAPI = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),

  register: (username, email, password, phone = '') =>
    apiFetch('/auth/reg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, phone })
    }),
};

// ============= PROFILE =============

export const profileAPI = {
  getMyProfile: () => apiFetch('/profile/my_profile'),

  updateProfile: (data) =>
    apiFetch('/profile/update_profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  changePassword: (oldPassword, newPassword) =>
    apiFetch('/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    }),

  addPlot: (plotData) =>
    apiFetch('/profile/add_plot', {
      method: 'POST',
      body: JSON.stringify(plotData)
    }),

  getMyPlots: () => apiFetch('/profile/my_plots'),

  editPlot: (plotId, plotData) =>
    apiFetch(`/profile/edit_plot/${plotId}`, {
      method: 'PUT',
      body: JSON.stringify(plotData)
    }),

  deletePlot: (plotId) =>
    apiFetch(`/profile/delete_plot/${plotId}`, {
      method: 'DELETE'
    }),

  getPlotsHistory: () => apiFetch('/profile/plots_history'),

  addPlantToPlot: (plotId, plantData) =>
    apiFetch(`/profile/my_plots/${plotId}/plants`, {
      method: 'POST',
      body: JSON.stringify(plantData)
    }),

  getPlantsOnPlot: (plotId) =>
    apiFetch(`/profile/my_plots/${plotId}/plants`),

  deletePlantFromPlot: (plotId, plantId) =>
    apiFetch(`/profile/my_plots/${plotId}/plants/${plantId}`, {
      method: 'DELETE'
    }),
};

// ============= ORDERS =============

export const ordersAPI = {
  getAllOrders: () => apiFetch('/orders/'),

  getMyOrders: () => apiFetch('/orders/my_orders'),

  createOrder: (orderData) =>
    apiFetch('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
};

// ============= MANAGER =============

export const managerAPI = {
  getOrders: (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    return apiFetch(`/manager/orders${queryStr ? '?' + queryStr : ''}`);
  },

  updateOrderStatus: (orderId, statusData) =>
    apiFetch(`/manager/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    }),

  getSchedules: () => apiFetch('/manager/schedules'),

  updateSchedule: (scheduleId, data) =>
    apiFetch(`/manager/schedules/${scheduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  createSchedule: (data) =>
    apiFetch('/manager/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getServices: () => apiFetch('/manager/services'),

  createService: (formData) =>
    apiFetch('/manager/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    }),

  updateService: (serviceId, formData) =>
    apiFetch(`/manager/services/${serviceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    }),

  deleteService: (serviceId) =>
    apiFetch(`/manager/services/${serviceId}`, {
      method: 'DELETE'
    }),
};

// ============= TEAMS =============

export const teamsAPI = {
  getAll: () => apiFetch('/teams/'),

  getTeamInfo: () => apiFetch('/teams'),

  createTeam: (teamData) =>
    apiFetch('/teams/', {
      method: 'POST',
      body: JSON.stringify(teamData)
    }),

  updateTeam: (teamId, teamData) =>
    apiFetch(`/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(teamData)
    }),

  removeTeam: (teamId) => 
    apiFetch(`/teams/remove_team/${teamId}`, {
      method: 'DELETE'
    }),

  getTeamOrders: () => apiFetch('/teams/orders'),

  updateOrderStatus: (orderId, statusId) =>
    apiFetch(`/teams/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status_id: statusId })
    }),

  getTeamFinance: () => apiFetch('/teams/finance'),
};

// ============= SERVICES =============

export const servicesAPI = {
  getAll: () => apiFetch('/services/'),
};

// ============= PAYMENTS =============

export const paymentsAPI = {
  getTeamPayments: () => apiFetch('/payments/team'),

  getAll: () => apiFetch('/payments/'),
};
