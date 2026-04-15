import { teamsAPI, ordersAPI, paymentsAPI } from './api';

// ============= TEAMS =============

export const getTeamInfo = () => teamsAPI.getTeamInfo();

export const getAllTeams = () => teamsAPI.getAll();

// ============= ORDERS (для команды) =============

export const getTeamOrders = (filters = {}) => ordersAPI.getAllOrders();

// ============= PAYMENTS (для команды) =============

export const getTeamPayments = () => paymentsAPI.getTeamPayments();

export const getAllPayments = () => paymentsAPI.getAll();
