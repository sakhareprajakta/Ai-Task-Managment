const axios = require("axios");

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const cache = {};

// 🔥 TASK SUGGESTION
const getTaskSuggestion = async (inputText) => {
  if (cache[inputText]) {
    console.log("Returning cached suggestion for:", inputText);
    return cache[inputText];
  }

  try {
    console.log("getTaskSuggestion input:", inputText);

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `Suggest 6 task names for: ${inputText}. Return only task names, no numbering.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ LIMIT TO 5
    const limited = text
      .split("\n")
      .filter((item) => item.trim() !== "")
      .slice(0, 5)
      .join("\n");

    console.log("Gemini result:", limited);

    cache[inputText] = limited;

    return limited;
  } catch (error) {
    const errData = error?.response?.data;

  console.error(
  "getTaskSuggestion error:",
  error?.response?.status,
  error?.response?.data?.error?.message || error.message
);

    if (error?.response?.status === 429) {
      const match = errData?.error?.message?.match(/retry in ([\d.]+)s/);
      const retrySeconds = match ? Math.ceil(parseFloat(match[1])) : 30;

      throw { rateLimited: true, retryAfter: retrySeconds };
    }

    throw error;
  }
};


const getTaskPrediction = async (inputText) => {
  if (cache["predict_" + inputText]) {
    return cache["predict_" + inputText];
  }

  try {
    console.log("getTaskPrediction input:", inputText);

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `Give answer in 1 line only. How many hours to complete: ${inputText}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No timePrediction";

    cache["predict_" + inputText] = text;

    return text;
  } catch (error) {
  console.error("GEMINI STATUS:", error?.response?.status);
  console.error("GEMINI DATA:", JSON.stringify(error?.response?.data, null, 2));
  console.error("GEMINI MESSAGE:", error.message);

  if (error?.response?.status === 429) {
    const match = error?.response?.data?.error?.message?.match(/retry in ([\d.]+)s/);
    const retrySeconds = match ? Math.ceil(parseFloat(match[1])) : 30;

    throw { rateLimited: true, retryAfter: retrySeconds };
  }

  throw error;
}
};


module.exports = { getTaskSuggestion, getTaskPrediction };