import api from "../../utils/axiosInstance";
import { cleanParams } from "../../features/shared/apiTypes";

export const listByCourse = (courseId, params) =>
  api.get(`/courses/${courseId}/lessons`, { params: cleanParams(params) });

export const getLesson = (lessonId) => api.get(`/lessons/${lessonId}`);

export const createLessons = (courseId, payload) =>
  api.post(`/courses/${courseId}/lessons`, payload);

export const updateLessons = (courseId, payload) =>
  api.patch(`/courses/${courseId}/lessons`, payload);

export const updateLesson = (lessonId, patch) =>
  api.patch(`/lessons/${lessonId}`, patch);

export const deleteLesson = (lessonId) => api.delete(`/lessons/${lessonId}`);

export const duplicateLesson = (lessonId) =>
  api.post(`/lessons/${lessonId}/duplicate`);
