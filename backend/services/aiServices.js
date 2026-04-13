const axios = require("axios");

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const cache = {};

const getTaskSuggestion = async (inputText) => {
  if (cache[inputText]) {
    console.log("Returning cached suggestion for:", inputText);
    return cache[inputText];
  }
  try {
    console.log("getTaskSuggestion input:", inputText);
    const response = await axios.post(
      GEMINI_URL,
      { contents: [{ parts: [{ text: `Suggest 6 task names for: ${inputText}. Return multiple the task names, no numbering.` }] }] },
      { headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GEMINI_API_KEY } }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion";
    cache[inputText] = text;
    console.log("Gemini result:", text);
    return text;
  } catch (error) {
    const errData = error?.response?.data;
    console.error("getTaskSuggestion error:", errData || error.message);
    if (error?.response?.status === 429) {
      const match = errData?.error?.message?.match(/retry in ([\d.]+)s/);
      const retrySeconds = match ? Math.ceil(parseFloat(match[1])) : 30;
      throw { rateLimited: true, retryAfter: retrySeconds };
    }
    throw error;
  }
};

const getTaskPrediction = async (inputText) => {
  if (cache["predict_" + inputText]) return cache["predict_" + inputText];
  try {
    console.log("getTaskPrediction input:", inputText);
    const response = await axios.post(
      GEMINI_URL,
      { contents: [{ parts: [{ text: `Give answer in 1 line only. How much time will it take to complete this task (in hours): ${inputText}` }] }] },
      { headers: { "Content-Type": "application/json", "X-goog-api-key": process.env.GEMINI_API_KEY } }
    );
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No timePrediction";
    cache["predict_" + inputText] = text;
    return text;
  } catch (error) {
    console.error("getTaskPrediction error:", error?.response?.data || error.message);
    throw error;
  }
};

module.exports = { getTaskSuggestion, getTaskPrediction };
