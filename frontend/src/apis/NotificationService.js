import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/notification`;

export const NotificationService = {
  getUnreadNotif: () => axios.get(`${BASE_URL}/getUnread`),
  getCountUnreadNotif: () => axios.get(`${BASE_URL}/`),
  deleteNotifByLessonId: (lesson_id) =>
    axios.delete(`${BASE_URL}/`, {
      data: { lesson_id },
    }),

  // set is_read to true for all notif
  markAllAsRead: () =>
    axios.put(
      `${BASE_URL}/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
};
