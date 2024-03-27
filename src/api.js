import axios from "axios";

const BASE_URL = "https://api.openai.com";
const IMAGE_URL = BASE_URL + "/v1/images/generations";
const TEXT_TO_VOICE_URL = BASE_URL + "/v1/audio/speech";
const COMPLETION_URL = BASE_URL + "/v1/chat/completions";

const HEADER = (secretKey) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  };
};

const generateCompletion = async (data, secretKey) => {
  try {
    const response = await axios.post(`${COMPLETION_URL}`, data, HEADER(secretKey));
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

const generateImage = async (data, secretKey) => {
  try {
    const response = await axios.post(`${IMAGE_URL}`, data, HEADER(secretKey));
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

const generateTextToVoice = async (data, secretKey) => {
  try {
    const response = await axios.post(`${TEXT_TO_VOICE_URL}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

const openAi = {
  generateCompletion,
  generateImage,
  generateTextToVoice,
  HEADER,
};
export default openAi;
