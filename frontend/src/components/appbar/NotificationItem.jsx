import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth.jsx'; // Adjust the import path as needed

const NotificationItem = ({ notif, deleteNotificationById, setOpenedNotificationById }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { setNotificationId } = useAuth();

    const handleClick = () => {
        setNotificationId(notif.notif_id);
        navigate(`/suggestcontent`);
    };

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        deleteNotificationById(notif.notif_id);
        handleMenuClose();
    };

    const handleMarkAsUnread = () => {
        setOpenedNotificationById(notif.notif_id);
        console.log("notif_id", notif.notif_id);
        handleMenuClose();
    };

    return (
        <ListItem
            button
            onClick={handleClick}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: notif.is_open ? '#f0f0f0' : '#ffffff'
            }}
        >
            <ListItemText primary={`Lesson ${notif.lesson}`} secondary={notif.message} />
            <Box>
                <IconButton edge="end" aria-label="options" onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMarkAsUnread}>Mark as unread</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </Box>
        </ListItem>
    );
};

export default NotificationItem;
