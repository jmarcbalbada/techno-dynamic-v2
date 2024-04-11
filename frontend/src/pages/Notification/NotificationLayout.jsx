import React from "react";
import { Typography, Box, Button } from "@mui/material";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

function NotificationLayout( { handleSuggest }) {
  // Darken the color manually
  const darkerColor = "#e6b800"; // Adjust the color as needed

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginTop: "-17px",
        padding: "20px",
        borderRadius: "5px",
        bgcolor: "#4c80d4",
        height: "fit-content",
        marginBottom: "2%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Diversity3OutlinedIcon sx={{ color: "#fff", marginRight: "10px" }} />
        <Typography
          variant="body1"
          sx={{
            color: "#fff",
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          We've gathered some FAQ's from students from this lesson!
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#ffcc00",
              "&:hover": {
                backgroundColor: darkerColor,
              },
              textTransform: "none", // Set text to normal case
              paddingRight: "10px", // Add padding to the right of the icon
            }}
          >
            <ManageSearchOutlinedIcon sx={{ marginRight: "10px" }} />
            View Insights
          </Button>
          <Button
            variant="contained"
            sx={{
              ml: 1,
              backgroundColor: "#1b5e20",
              textTransform: "none", // Set text to normal case
              paddingRight: "10px", // Add padding to the right of the icon
            }}
            onClick={handleSuggest}
          >
            <HandshakeOutlinedIcon sx={{ marginRight: "10px" }} />
            Suggest Content
          </Button>
        </Box>
      </div>
    </Box>
  );
}

export default NotificationLayout;
