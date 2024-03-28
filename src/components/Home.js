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
  ImageList,
  ImageListItem,
  Container,
  CircularProgress,
  Card,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React, { useState } from "react";
import axios from "axios";
import openAi from "../api";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [texts, setTexts] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [genderVoice, setGenderVoice] = useState("alloy");
  const [audioKey, setAudioKey] = useState(0);
  const [secretKey, setSecretKey] = useState("");
  const [urlImages, setUrlImages] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const dataImage = (text) => {
    return {
      model: "dall-e-3",
      prompt: text,
    };
  };

  const dataCompletion = (text) => {
    return {
      messages: [{ role: "user", content: text }],
      model: "gpt-4",
    };
  };

  const handleButtonClick = async () => {
    setIsResult(true);
    setLoading(true);
    const text = await openAi.generateCompletion(
      dataCompletion(inputText),
      secretKey
    );

    const image = await openAi.generateImage(dataImage(inputText), secretKey);
    {
      text != null && image != null && setLoading(false);
    }
    setTexts(text.choices[0].message.content);
    setUrlImages(image.data[0].url);
    try {
      const audioData = await voiceGenerator(text.choices[0].message.content);
      const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      setAudioBlob(audioBlob);
      setAudioKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 401) {
        setSnackbarMessage("Sai secretKey");
        setSnackbarOpen(true);
      }
      if (error.response && error.response.status === 400) {
        setSnackbarMessage("Vui lòng nhập văn bản để tạo");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeSpeed = (event) => {
    setSpeed(event.target.value);
  };

  const handleChangeGenderVoice = (event) => {
    setGenderVoice(event.target.value);
  };

  async function voiceGenerator(text) {
    const data = {
      model: "tts-1",
      input: text,
      voice: genderVoice,
      response_format: "mp3",
      speed: speed,
    };

    return openAi.generateTextToVoice(data, secretKey);
  }
  console.log(loading);
  console.log(isResult);
  return (
    <Container>
      <Grid container spacing={4} margin={2}>
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Typography fontSize={40}>
            DỊCH VỤ VĂN BẢN CHUYỂN THÀNH GIỌNG
          </Typography>
        </Grid>
        {loading ? (
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <CircularProgress color="secondary" />
          </Grid>
        ) : (
          <>
            {!isResult ? (
              <>
                <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                  <Box>
                    <TextField
                      id="outlined-required"
                      label="Input your text"
                      placeholder="Input your text"
                      value={secretKey}
                      onChange={(event) => setSecretKey(event.target.value)}
                      required
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
                      <InputLabel id="demo-simple-select-label">
                        Tốc độ
                      </InputLabel>
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
                      <InputLabel id="demo-simple-select-label">
                        Giọng
                      </InputLabel>
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
              </>
            ) : (
              <>
                <Button variant="contained">
                  <KeyboardBackspaceIcon
                    onClick={() => {
                      setIsResult(false);
                    }}
                  />
                </Button>
                <Grid
                  container
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  spacing={3}
                >
                  <Grid item xs={4}>
                    <Box style={{ width: "100%", height: "25rem" }}>
                      {urlImages && (
                        <img
                          style={{ height: "100%", width: "100%" }}
                          src={urlImages}
                          alt="loi"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    {texts && (
                      <Card style={{ height: "100%" }}>
                        <Box
                          style={{ overflowY: "auto", maxHeight: "100%" }}
                          textAlign={"left"}
                          padding={2}
                        >
                          {texts}
                        </Box>
                      </Card>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    {audioBlob && (
                      <Card style={{ height: "100%", padding: "0.2rem" }}>
                        <audio
                          key={audioKey}
                          controls
                          style={{ width: "30rem" }}
                        >
                          <source
                            src={URL.createObjectURL(audioBlob)}
                            type="audio/mp3"
                          />
                        </audio>
                      </Card>
                    )}
                  </Grid>
                </Grid>
              </>
            )}

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
          </>
        )}
      </Grid>
    </Container>
  );
}
