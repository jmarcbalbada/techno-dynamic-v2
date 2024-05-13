import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/lessons`;

export const LessonsService = {
  list: () => axios.get(`${BASE_URL}/`),
  getById: (id) => axios.get(`${BASE_URL}/${id}`),
  getByLessonNumber: (lessonNumber) =>
    axios.get(`${BASE_URL}`, { params: { lessonNumber } }),
  create: (data) =>
    axios.post(`${BASE_URL}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id, data) =>
    axios.put(`${BASE_URL}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`),
  // chatbot: (lessonId, pageId, message) =>
  //   axios.post(`${BASE_URL}/${lessonId}/pages/${pageId}/chatbot/`, {
  //     message,
  //   }),
  testing: (lessonId, pageId, message) =>
    axios.post(`${BASE_URL}/${lessonId}/pages/${pageId}/chatbot/`, {
      message,
    }),
};
