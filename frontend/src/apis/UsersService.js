import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/`;

export const UsersService = {
  login: (credentials) => axios.post(`${BASE_URL}login/`, credentials),
  register: (registerDetails) => axios.post(`${BASE_URL}register/`, registerDetails),
  getUserbyID: (user_id) => axios.get(`${BASE_URL}users/${user_id}`),
  setOptIn: (user_id) =>
    axios.put(
      `${BASE_URL}users/setOpt/`, 
      { user_id },  // Pass user_id as part of the request body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
    getOptIn: (user_id) => axios.get(`${BASE_URL}users/getOpt/${user_id}`),
};
