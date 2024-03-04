import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [genderVoice, setGenderVoice] = useState("alloy");
  const [audioKey, setAudioKey] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleButtonClick = async () => {
    try {
      console.log(inputText);
      const audioData = await voiceGenerator(inputText);
      const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      setAudioBlob(audioBlob);
      console.log(audioBlob);

      // Update the key to force re-render of the audio element
      setAudioKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.status === 401) {
        setSnackbarMessage(
          "Secret Key của bạn đã bị sai vui lòng kiểm tra lại !"
        );
        setSnackbarOpen(true);
      }
      if (error.response && error.response.status === 400) {
        setSnackbarMessage(
          "Vui lòng nhập văn bản để tạo"
        );
        setSnackbarOpen(true);
      }
    }
  };

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeSpeed = (event) => {
    setSpeed(event.target.value);
  };

  const handleChangeGenderVoice = (event) => {
    setGenderVoice(event.target.value);
  };

  console.log(secretKey);
  async function voiceGenerator(text) {
    const apiUrl = "https://api.openai.com/v1/audio/speech";

    const body = {
      model: "tts-1",
      input: text,
      voice: genderVoice,
      response_format: "mp3",
      speed: speed,
    };

    try {
      const response = await axios.post(apiUrl, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        responseType: "arraybuffer",
      });

      return response.data;
    } catch (err) {
      console.error("OpenAI API failed, error: ", err);
      throw err;
    }
  }

  return (
    <Grid container spacing={4} margin={2}>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Typography fontSize={40}>
          DỊCH VỤ VĂN BẢN CHUYỂN THÀNH GIỌNG
        </Typography>
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Box>
          <TextField
            id="outlined-required"
            label="Input your Secret Key"
            placeholder="Input your Secret Key"
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
          />
        </Box>
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Box>
          <TextField
            id="outlined-required"
            label="Input your text"
            placeholder="Input your text"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </Box>

        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
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

        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
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
        <Button variant="contained" onClick={handleButtonClick}>
          Tạo
        </Button>
      </Grid>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        {audioBlob && (
          <audio key={audioKey} controls style={{ width: "30rem" }}>
            <source src={URL.createObjectURL(audioBlob)} type="audio/mp3" />
          </audio>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
