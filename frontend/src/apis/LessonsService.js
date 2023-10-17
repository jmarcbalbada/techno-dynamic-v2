import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/lessons`;

export const LessonsService = {
  list: () => axios.get(`${BASE_URL}/`),
  getById: (id) => axios.get(`${BASE_URL}/${id}`),
  getByLessonNumber: (lessonNumber) =>
    axios.get(`${BASE_URL}`, { params: { lessonNumber } }),
  create: (data) => axios.post(`${BASE_URL}/`, data),
  update: (id, data) => axios.put(`${BASE_URL}/${id}`, data),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`)
};
