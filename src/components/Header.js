import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";

export default function Header() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <Grid
        container
        style={{
          backgroundColor: "#f26f21",
        }}
      >
        <Grid
          item
          xs={2}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <img
            src="https://daihoc.fpt.edu.vn/re.mkt/images/logo-white.png"
            alt="anh"
            style={{ width: "100%", height: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Typography variant="h5" component="h2" color={"white"}>
            NGHE "AI" KỂ CHUYỆN
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Typography variant="caption" color={"white"}>
            @{currentYear} Copyright FPT University
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
