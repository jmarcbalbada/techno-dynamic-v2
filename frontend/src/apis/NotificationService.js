import axios from "axios";
import config from "data/config";

const BASE_URL = `${config.API_URL}api/notification`;

export const NotificationService = {
    getUnreadNotif: () => axios.get(`${BASE_URL}/getUnread/`),
    getCountUnreadNotif: () => axios.get(`${BASE_URL}/getCountUnread/`),
    deleteNotificationById: (notification_id) =>
        axios.delete(`${BASE_URL}/deleteNotificationById/`, {
            data: { notification_id }
        }),
    markAllAsRead: () =>
        axios.put(
            `${BASE_URL}/mark_all_as_read/`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ),
    setOpenedNotificationById: (notification_id) =>
        axios.patch(`${BASE_URL}/setOpenedNotificationById/`, { notification_id })
};
