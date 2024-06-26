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
  CardContent,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import axios from "axios";
import openAi from "../api";
import Footer from "./Footer";
import Option from "./Option";
import Header from "./Header";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [open, setOpen] = React.useState(false);
  const [moreText, setMoreText] = useState("100");
  const [texts, setTexts] = useState("");
  const [loading, setLoading] = useState(false);
  const [textShow, setTextShow] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  const [genderVoice, setGenderVoice] = useState("alloy");
  const [audioKey, setAudioKey] = useState(0);
  const [secretKey, setSecretKey] = useState("");
  const [urlImages, setUrlImages] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = async () => {
    if (!loading) {
      setAudioBlob("");
      setTexts("");
      setUrlImages("");
    }

    setTextShow(inputText);
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
      await setTexts(text.choices[0].message.content);
      await setUrlImages(image.data[0].url);
      const audioData = await voiceGenerator(text.choices[0].message.content);
      const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      setAudioBlob(audioBlob);
      setAudioKey((prevKey) => prevKey + 1);
    } catch (error) {
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
  const optionProps = {
    secretKey: secretKey,
    setSecretKey: setSecretKey,
    moreText: moreText,
    setMoreText: setMoreText,
    speed: speed,
    handleChangeSpeed: handleChangeSpeed,
    genderVoice: genderVoice,
    handleChangeGenderVoice: handleChangeGenderVoice,
    handleClose: handleClose,
    open: open,
    loading: loading,
  };
  return (
    <>
      <Grid container spacing={4}>
        <Container style={{ marginTop: "10rem" }}>
          <Grid
            container
            item
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            spacing={2}
            marginTop={4}
          >
            {!textShow ? (
              <Grid item xs={12} marginTop={24}>
                <Grid container display={"flex"} justifyContent={"center"}>
                  <Grid item xs={6} display={"flex"} justifyContent={"center"}>
                    <Card style={{ width: "50%", display: "flex" }}>
                      <CardContent>
                        <ComputerIcon
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            color: "#e65c1a",
                            marginBottom: "2rem",
                          }}
                        />

                        <Typography gutterBottom variant="h5" component="div">
                          Trải nghiệm
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đi vào thế giới tuyệt vời của AI tại FPT University
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} display={"flex"} justifyContent={"center"}>
                    <Card style={{ width: "50%" }}>
                      <CardContent>
                        <AutoStoriesIcon
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            color: "#bf4cff",
                            marginBottom: "2rem",
                          }}
                        />
                        <Typography gutterBottom variant="h5" component="div">
                          Kể chuyện
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bạn sẽ được trải nghiệm AI kể chuyện với nội dung bạn
                          mong muốn
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid container marginTop={"1rem"} spacing={4}>
                  <Grid item xs={8}>
                    {texts ? (
                      <Card style={{ height: "100%" }}>
                        <Box
                          style={{ overflowY: "auto", maxHeight: "24rem" }}
                          textAlign={"left"}
                          padding={2}
                        >
                          {texts}
                        </Box>
                      </Card>
                    ) : (
                      <CircularProgress color="secondary" />
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <Box style={{ width: "100%", height: "24rem" }}>
                      {urlImages ? (
                        <img
                          style={{ height: "100%", width: "100%" }}
                          src={urlImages}
                          alt="loi"
                        />
                      ) : (
                        <CircularProgress color="secondary" />
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {audioBlob ? (
                      <audio key={audioKey} controls style={{ width: "30rem" }}>
                        <source
                          src={URL.createObjectURL(audioBlob)}
                          type="audio/mp3"
                          style={{ backgroundColor: "white" }}
                        />
                      </audio>
                    ) : (
                      <CircularProgress color="secondary" />
                    )}
                  </Grid>
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
              </>
            )}
          </Grid>
          <Box position={"relative"}>
            <AppBar
              position="fixed"
              style={{
                top: 0,
                bottom: "auto",
                padding: "0 0 0.5rem 0",
                backgroundColor: "white",
              }}
            >
              <Toolbar style={{ backgroundColor: "white" }}>
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={12}>
                    <Header />
                  </Grid>
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
                  <Grid item xs={1}>
                    <Box style={{ height: "100%" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleClickOpen}
                        disabled={loading}
                        style={{ height: "100%" }}
                      >
                        Tùy chỉnh
                      </Button>
                      <Option options={optionProps} />
                    </Box>
                  </Grid>
                  <Grid item xs={1}>
                    <Box style={{ height: "100%" }}>
                      <Button
                        variant="contained"
                        fullWidth
                        style={{
                          backgroundColor: "#f26f21",
                          color: "white",
                          height: "100%",
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
                    </Box>
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
