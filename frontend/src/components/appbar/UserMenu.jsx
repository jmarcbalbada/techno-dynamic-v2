import React from "react";
import { Menu, MenuItem, ListItemIcon, Typography, Button, Avatar, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

const UserMenu = ({ anchorElUser, handleOpenUserMenu, handleCloseUserMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const open = Boolean(anchorElUser);

    const handleProfile = () => {
        navigate("/profile");
        handleCloseUserMenu();
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
    };

    return (
        <div>
            <Tooltip title="Open Settings">
                <Button
                    onClick={handleOpenUserMenu}
                    size="large"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Typography sx={{ mr: 1 }}>{user?.first_name}</Typography>
                    <Avatar>{user?.first_name?.charAt(0).toUpperCase()}</Avatar>
                </Button>
            </Tooltip>
            <Menu
                sx={{ mt: 4.5 }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                open={open}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
};

export default UserMenu;
