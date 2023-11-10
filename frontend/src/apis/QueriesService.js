import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/queries`;

export const QueriesService = {
  list: () => axios.get(`${BASE_URL}/`),
  getById: (id) => axios.get(`${BASE_URL}/${id}`),
};
