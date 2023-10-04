import axios from 'axios';
import config from 'data/config';

const BASE_URL = `${config.API_URL}api/`;

export const UsersService = {
  login: (credentials) => axios.post(`${BASE_URL}login/`, credentials)
};
