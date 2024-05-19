import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/notification`;

export const NotificationService = {
  getUnreadNotif: () => axios.get(`${BASE_URL}/getUnread`),
  //   getById: (id) => axios.get(`${BASE_URL}/${id}`),
};
