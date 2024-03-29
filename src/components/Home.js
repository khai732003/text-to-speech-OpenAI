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
  AppBar,
  Toolbar,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import axios from "axios";
import openAi from "../api";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundImage:
      'url("https://daihoc.fpt.edu.vn/templates/fpt-university/images/header.jpg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [moreText, setMoreText] = useState("100");
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

  const classes = useStyles();

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
    const finalInputText =
      "Tạo nội dung với: " +
      inputText +
      (moreText != null ? " ( với số lượng từ là: " + moreText + ")" : "100 )");
    try {
      const textRes = await openAi.generateCompletion(
        dataCompletion(finalInputText),
        secretKey
      );
      const imageRes = await openAi.generateImage(
        dataImage(finalInputText),
        secretKey
      );
      const image = imageRes.data;
      const text = textRes.data;
      {
        text != null && image != null && setLoading(false);
      }
      setTexts(text.choices[0].message.content);
      setUrlImages(image.data[0].url);
      const audioData = await voiceGenerator(text.choices[0].message.content);
      console.log(audioData);
      const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      setAudioBlob(audioBlob);
      setAudioKey((prevKey) => prevKey + 1);
    } catch (error) {
      setIsResult(false);
      setLoading(false);
      console.error("Error:", error.response.status);
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

  const voiceGenerator = async (text) => {
    const data = {
      model: "tts-1",
      input: text,
      voice: genderVoice,
      response_format: "mp3",
      speed: speed,
    };

    const response = await openAi.generateTextToVoice(data, secretKey);
    return response.data;
  };
  return (
    <>
      <Grid container spacing={4}>
        <Container>
          {loading ? (
            <Grid
              item
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              marginTop={24}
            >
              <CircularProgress color="secondary" />
            </Grid>
          ) : (
            <>
              <>
                <Grid
                  container
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"center"}
                  spacing={3}
                  marginTop={4}
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
                          style={{ overflowY: "auto", maxHeight: "400px" }}
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
                      <audio key={audioKey} controls style={{ width: "30rem" }}>
                        <source
                          src={URL.createObjectURL(audioBlob)}
                          type="audio/mp3"
                          style={{ backgroundColor: "white" }}
                        />
                      </audio>
                    )}
                  </Grid>
                </Grid>
              </>

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
          <Box position={"relative"}>
            <AppBar
              position="fixed"
              style={{
                top: "auto",
                bottom: 0,
                padding: "1rem 0 1rem 0",
                backgroundColor: "white",
                margin: "1rem 0 0 0",
              }}
            >
              <Toolbar variant="dense" style={{ backgroundColor: "white" }}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={1}>
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
                  <Grid container item xs={10} spacing={2}>
                    <Grid item xs={10}>
                      <Box width="100%" backgroundColor={"white"}>
                        <TextField
                          fullWidth
                          backgroundColor={"white"}
                          id="outlined-required"
                          label="Nội dung"
                          placeholder="Vui lòng nhập nội dung"
                          value={inputText}
                          onChange={(event) => setInputText(event.target.value)}
                          disabled={loading}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={1} display={"flex"} justifyContent={"start"}>
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
                      <Box sx={{ minWidth: 70 }} backgroundColor={"white"}>
                        <FormControl fullWidth disabled={loading}>
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
                      <Box sx={{ minWidth: 70 }} backgroundColor={"white"}>
                        <FormControl fullWidth disabled={loading}>
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
                    </Grid>
                  </Grid>
                  <Grid item xs={1} display={"flex"} justifyContent={"start"}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#f26f21",
                        color: "white",
                      }}
                      onClick={handleButtonClick}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        <SendIcon />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Box>
        </Container>
      </Grid>
    </>
  );
}
