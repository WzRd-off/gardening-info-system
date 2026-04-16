import { profileAPI } from './api';

/**
 * Отримати профіль поточного користувача
 */
export const getMyProfile = () => profileAPI.getMyProfile();

/**
 * Оновити профіль
 */
export const updateProfile = (data) => profileAPI.updateProfile(data);

/**
 * Змінити пароль
 */
export const changePassword = (oldPassword, newPassword) =>
  profileAPI.changePassword(oldPassword, newPassword);

/**
 * Додати ділянку
 */
export const addPlot = (address, area, features = '') =>
  profileAPI.addPlot({ address, area, features });

/**
 * Отримати всі ділянки користувача
 */
export const getMyPlots = () => profileAPI.getMyPlots();

/**
 * Редагувати ділянку
 */
export const editPlot = (plotId, address, area, features = '') =>
  profileAPI.editPlot(plotId, { address, area, features });

/**
 * Видалити ділянку
 */
export const deletePlot = (plotId) => profileAPI.deletePlot(plotId);

/**
 * Отримати історію обслуговування ділянок
 */
export const getPlotsHistory = () => profileAPI.getPlotsHistory();

/**
 * Додати рослину на ділянку
 */
export const addPlantToPlot = (plotId, name) =>
  profileAPI.addPlantToPlot(plotId, { name });

/**
 * Отримати рослини на ділянці
 */
export const getPlantsOnPlot = (plotId) => profileAPI.getPlantsOnPlot(plotId);

/**
 * Видалити рослину з ділянки
 */
export const deletePlantFromPlot = (plotId, plantId) =>
  profileAPI.deletePlantFromPlot(plotId, plantId);