import axios from 'axios';
import config from 'data/config';

const BASE_URL = `${config.API_URL}api/notification`;

export const NotificationService = {
  getUnreadNotif: () => axios.get(`${BASE_URL}/getUnread/`),
  getCountUnreadNotif: () => axios.get(`${BASE_URL}/getCountUnread/`),
  // delete by notif id
  deleteNotificationById: (notification_id) =>
    axios.delete(`${BASE_URL}/deleteNotificationById/`, {
      data: { notification_id }
    }),
  // delete by lesson id
  deleteNotifByLessonId: (lesson_id) =>
    axios.delete(`${BASE_URL}/deleteNotification/`, {
      data: { lesson_id }
    }),
  // api/notification/deleteNotification/
  markAllAsRead: () =>
    axios.put(
      `${BASE_URL}/mark_all_as_read/`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ),
  setOpenedNotificationById: (notification_id) =>
    axios.patch(`${BASE_URL}/setOpenedNotificationById/`, { notification_id })
};
