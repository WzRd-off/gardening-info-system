import { managerAPI, teamsAPI, servicesAPI, paymentsAPI } from './api';

// ============= ORDERS =============

export const getManagerOrders = (filters = {}) => managerAPI.getOrders(filters);

export const updateOrderStatus = (orderId, statusId) =>
  managerAPI.updateOrderStatus(orderId, { status_id: statusId });

export const updateOrderTeam = (orderId, teamId) =>
  managerAPI.updateOrderStatus(orderId, { team_id: teamId });

// ============= SCHEDULES =============

export const getSchedules = () => managerAPI.getSchedules();

// ============= SERVICES =============

export const getServices = () => managerAPI.getServices();

export const createService = (formData) => managerAPI.createService(formData);

export const updateService = (serviceId, formData) =>
  managerAPI.updateService(serviceId, formData);

export const deleteService = (serviceId) => managerAPI.deleteService(serviceId);

// ============= TEAMS =============

export const getTeams = () => teamsAPI.getAll();

export const createTeam = (name, email) => teamsAPI.createTeam({ name, email });

export const updateTeam = (teamId, data) => teamsAPI.updateTeam(teamId, data);

export const deleteTeam = (teamId) => teamsAPI.deleteTeam(teamId);

// ============= PAYMENTS =============

export const getPayments = () => paymentsAPI.getAll();
