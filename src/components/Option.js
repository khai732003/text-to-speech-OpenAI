import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";

export default function Option({ options }) {
  const {
    secretKey,
    setSecretKey,
    moreText,
    setMoreText,
    speed,
    handleChangeSpeed,
    genderVoice,
    handleChangeGenderVoice,
    handleClose,
    open,
    loading,
  } = options;

  const voiceOptions = [
    { value: "alloy", label: "Nam" },
    { value: "nova", label: "Nữ" },
  ];

  const speedOptions = [
    { value: 0.5, label: "0.5X" },
    { value: 0.8, label: "0.8X" },
    { value: 1.0, label: "1.0X" },
    { value: 1.5, label: "1.5X" },
  ];

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tùy chỉnh</DialogTitle>
        <DialogContent style={{paddingTop:"1rem"}}>
          <Grid container>
            <Grid item xs={3}>
              <Box width="100%" backgroundColor={"white"}>
                <TextField
                  backgroundColor={"white"}
                  id="outlined-required"
                  label="Secret Key"
                  fullWidth
                  placeholder="Nhập Secret Key"
                  value={secretKey}
                  onChange={(event) => setSecretKey(event.target.value)}
                  required
                  disabled={loading}
                />
              </Box>
            </Grid>
            <Grid item xs={3} display={"flex"} justifyContent={"start"}>
              <Box sx={{ minWidth: 70 }} backgroundColor={"white"}>
                <TextField
                  backgroundColor={"white"}
                  id="outlined-required"
                  label="Số Lượng"
                  fullWidth
                  placeholder="Nhập Số Lượng"
                  value={moreText}
                  onChange={(event) => setMoreText(event.target.value)}
                  required
                  disabled={loading}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ minWidth: 70 }} backgroundColor={"white"}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel id="demo-simple-select-label">Tốc độ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-speed"
                    value={speed}
                    label="Choose speed"
                    onChange={handleChangeSpeed}
                  >
                    {speedOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ minWidth: 70 }} backgroundColor={"white"}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel id="demo-simple-select-label">Giọng</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={genderVoice}
                    label="Choose speed"
                    onChange={handleChangeGenderVoice}
                  >
                    {voiceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
