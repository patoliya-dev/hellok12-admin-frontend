import api from "../../utils/axiosInstance";

export const getTeacherSchedule = (teacherId) =>
  api.get(`/teachers/${teacherId}/schedule`);

export const upsertTeacherSchedule = (teacherId, body) =>
  api.patch(`/teachers/${teacherId}/schedule`, body);

export const getSlotsForDate = (teacherId, date, month) =>
  api.get(`/teachers/${teacherId}/schedule/slots`, { params: { date, month } });

// fetch whole month:
export const getSlotsForMonth = (teacherId, month) =>
  api.get(`/teachers/${teacherId}/schedule/month`, { params: { month } });

export const patchDateSlots = (teacherId, body) =>
  api.post(`/teachers/${teacherId}/schedule/date`, body);

export const validateLessonSlot = (teacherId, body) =>
  api.post(`/teachers/${teacherId}/schedule/validate`, body);
