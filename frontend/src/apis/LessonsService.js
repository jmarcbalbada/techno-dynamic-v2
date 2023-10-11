import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/lessons/`;

export const LessonsService = {
  list: () => axios.get(`${BASE_URL}`),
  getById: (id) => axios.get(`${BASE_URL}${id}`),
}