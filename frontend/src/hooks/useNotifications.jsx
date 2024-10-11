import { useState, useEffect } from 'react';
import { NotificationService } from '../apis/NotificationService';

const useNotifications = (user) => {
  // State to hold the unread notifications and counts
  const [unreadNotif, setUnreadNotif] = useState([]);
  const [countNotif, setCountNotif] = useState(0); // Count of unread notifications
  const [allNotif, setAllNotif] = useState(0); // Total count of all notifications

  // Fetch all notifications count on component mount and when `allNotif` is updated
  useEffect(() => {
    if (user.role === 'teacher') {
      getAllNotifications();
    }
  }, [allNotif]);

  // Poll for unread notifications count every 3 seconds (for real-time update)
  useEffect(() => {
    if (user.role === 'teacher') {
      const intervalId = setInterval(() => {
        getCountUnreadNotifications(); // Fetch unread notification count periodically
      }, 3000);

      return () => clearInterval(intervalId); // Clear interval when component unmounts
    }
  }, [allNotif]); // Depend on `allNotif` to ensure updates trigger

  // Fetch unread notifications when the count of unread notifications changes
  useEffect(() => {
    if (user.role === 'teacher') {
      getUnreadNotifications();
    }
  }, [countNotif, user.role]);

  // Function to get all notifications and update the state
  const getAllNotifications = async () => {
    try {
      const response = await NotificationService.getAllNotif();
      setAllNotif(response.data.count); // Set total notification count
    } catch (error) {
      console.log('Error fetching all notifications:', error);
    }
  };

  // Function to fetch unread notifications
  const getUnreadNotifications = async () => {
    try {
      const response = await NotificationService.getUnreadNotif();
      setUnreadNotif(response.data); // Set unread notifications
    } catch (error) {
      console.log('Error fetching unread notifications:', error);
    }
  };

  // Function to mark all notifications as read and update the state
  const setAllToReadNotifications = async () => {
    try {
      await NotificationService.markAllAsRead(); // API call to mark all as read
      setCountNotif(0); // Reset unread notification count
    } catch (error) {
      console.log('Error marking all notifications as read:', error);
    }
  };

  // Function to get the count of unread notifications and update the state
  const getCountUnreadNotifications = async () => {
    try {
      const response = await NotificationService.getCountUnreadNotif();
      setCountNotif(response.data.unread_count); // Set unread count state
    } catch (error) {
      console.log('Error fetching unread notification count:', error);
    }
  };

  // Function to mark a specific notification as opened
  const setOpenedNotificationById = async (notification_id) => {
    try {
      await NotificationService.setOpenedNotificationById(notification_id); // API call to mark as opened
      getUnreadNotifications(); // Refresh unread notifications
    } catch (error) {
      console.log('Error marking notification as opened:', error);
    }
  };

  // Function to delete a specific notification and update the state
  const deleteNotificationById = async (notification_id) => {
    try {
      await NotificationService.deleteNotificationById(notification_id); // API call to delete notification
      getUnreadNotifications(); // Refresh unread notifications after deletion
    } catch (error) {
      console.log('Error deleting notification:', error);
    }
  };

  // Return the state and functions to interact with notifications
  return {
    unreadNotif, // Array of unread notifications
    countNotif, // Number of unread notifications
    setAllToReadNotifications, // Function to mark all notifications as read
    setOpenedNotificationById, // Function to mark a specific notification as opened
    deleteNotificationById // Function to delete a specific notification
  };
};

export default useNotifications;
