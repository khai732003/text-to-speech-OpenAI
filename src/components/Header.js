import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";

export default function Header() {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <Box
        style={{
          padding: "0.5rem 6rem 0.5rem 3rem",
          backgroundColor: "#f26f21",
        }}
      >
        <Grid container>
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
              style={{ width: "9rem", height: "70%" }}
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
      </Box>
    </div>
  );
}
