import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Typography,
} from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <BottomNavigation
      display={"flex"}
      justifyContent={"center"}
      style={{ backgroundColor: "#f26f21" }}
    >
      <Typography
        variant="caption"
        color="white"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        Copyright ©2024.
      </Typography>
    </BottomNavigation>
  );
}
