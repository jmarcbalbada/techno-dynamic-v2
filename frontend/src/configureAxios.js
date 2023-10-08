import axios from 'axios';
import config from 'data/config';

export const configureAxios = () => {
  axios.defaults.baseURL = config.API_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  axios.interceptors.request.use(
    (requestConfig) => {
      if (requestConfig.baseURL !== config.API_URL) {
        return requestConfig;
      }

      const token = JSON.parse(localStorage.getItem('token'));
      requestConfig.headers.Authorization = token ? `Token ${token}` : null;
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );
};
