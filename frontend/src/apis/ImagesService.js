import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/media`;

export const ImagesService = {
  upload: (data) => {
    return axios.post(`${BASE_URL}/create/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
