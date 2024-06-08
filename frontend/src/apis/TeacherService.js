import axios from 'axios';

import config from 'data/config';

const BASE_URL = `${config.API_URL}api/teacher`;

export const TeacherService = {
  //GETTERS
  getTeacherThreshold: () => axios.get(`${BASE_URL}/getthreshold/`),

  getTeacherSuggestion: () => axios.get(`${BASE_URL}/getsuggestion/`),

  getTeacherNotification: () => axios.get(`${BASE_URL}/getnotification/`),

  //SETTERS
  setTeacherThreshold: (threshold) => axios.patch(`${BASE_URL}/setthreshold/`, { threshold }),
  
  setTeacherSuggestion: (suggestion) => axios.patch(`${BASE_URL}/setsuggestion/`, { suggestion }),

  setTeacherNotification: (notification) => axios.patch(`${BASE_URL}/setnotification/`,{ notification }),
};