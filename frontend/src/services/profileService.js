import { profileAPI } from './api';

/**
 * Получить профиль текущего пользователя
 */
export const getMyProfile = () => profileAPI.getMyProfile();

/**
 * Обновить профиль
 */
export const updateProfile = (data) => profileAPI.updateProfile(data);

/**
 * Изменить пароль
 */
export const changePassword = (oldPassword, newPassword) =>
  profileAPI.changePassword(oldPassword, newPassword);

/**
 * Добавить ділянку
 */
export const addPlot = (address, area, features = '') =>
  profileAPI.addPlot({ address, area, features });

/**
 * Получить все ділянки пользователя
 */
export const getMyPlots = () => profileAPI.getMyPlots();

/**
 * Отредактировать ділянку
 */
export const editPlot = (plotId, address, area, features = '') =>
  profileAPI.editPlot(plotId, { address, area, features });

/**
 * Удалить ділянку
 */
export const deletePlot = (plotId) => profileAPI.deletePlot(plotId);

/**
 * Получить историю обслуживания ділянок
 */
export const getPlotsHistory = () => profileAPI.getPlotsHistory();

/**
 * Добавить растение на ділянку
 */
export const addPlantToPlot = (plotId, name) =>
  profileAPI.addPlantToPlot(plotId, { name });

/**
 * Получить растения на ділянке
 */
export const getPlantsOnPlot = (plotId) => profileAPI.getPlantsOnPlot(plotId);

/**
 * Удалить растение с ділянки
 */
export const deletePlantFromPlot = (plotId, plantId) =>
  profileAPI.deletePlantFromPlot(plotId, plantId);
