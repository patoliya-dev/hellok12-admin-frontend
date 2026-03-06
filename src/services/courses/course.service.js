import { errorToast } from "../../utils/utils";
import api from "../../utils/axiosInstance";

export const getCourseDetails = async (id) => {
  try {
    const response = await api.get(`/courses/${id}/details`);
    return response.data;
  } catch (error) {
    errorToast(error.response?.data || error.message);
    throw error;
  }
};

export const getFeedbacks = async (id, filters) => {
  try {
    const response = await api.get(
      `/courses/${id}/feedbacks?${new URLSearchParams(filters)}`,
    );
    return response.data;
  } catch (error) {
    errorToast(error.response?.data || error.message);
    throw error;
  }
};
