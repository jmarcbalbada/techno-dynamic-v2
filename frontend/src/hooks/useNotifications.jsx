import { useState, useEffect } from "react";
import { NotificationService } from "../apis/NotificationService";

const useNotifications = (user) => {
    const [unreadNotif, setUnreadNotif] = useState([]);
    const [countNotif, setCountNotif] = useState(0);

    useEffect(() => {
        if (user.role === "teacher") {
            getCountUnreadNotifications();
        }
    }, [user.role]);

    useEffect(() => {
        if (user.role === "teacher") {
            getUnreadNotifications();
        }
    }, [countNotif, user.role]);

    const getUnreadNotifications = async () => {
        try {
            const response = await NotificationService.getUnreadNotif();
            setUnreadNotif(response.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    const setAllToReadNotifications = async () => {
        try {
            await NotificationService.markAllAsRead();
            console.log("marked read");
            setCountNotif(0);
        } catch (error) {
            console.log("error", error);
        }
    };

    const getCountUnreadNotifications = async () => {
        try {
            const response = await NotificationService.getCountUnreadNotif();
            setCountNotif(response.data.unread_count);
        } catch (error) {
            console.log("error", error);
        }
    };

    const setOpenedNotificationById = async (notification_id) => {
        try {
            await NotificationService.setOpenedNotificationById(notification_id);
            // Update the local state if needed
            getUnreadNotifications();
        } catch (error) {
            console.log("error", error);
        }
    };

    const deleteNotificationById = async (notification_id) => {
        try {
            await NotificationService.deleteNotificationById(notification_id);
            // Update the local state if needed
            getUnreadNotifications();
        } catch (error) {
            console.log("error", error);
        }
    };

    return { unreadNotif, countNotif, setAllToReadNotifications, setOpenedNotificationById, deleteNotificationById };
};

export default useNotifications;
