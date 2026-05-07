const axios = require("axios");

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

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

    console.error("getTaskSuggestion error:", errData || error.message);

    if (error?.response?.status === 429) {
      const match = errData?.error?.message?.match(/retry in ([\d.]+)s/);
      const retrySeconds = match ? Math.ceil(parseFloat(match[1])) : 30;

      throw { rateLimited: true, retryAfter: retrySeconds };
    }

    throw error;
  }
};

// 🔥 TIME PREDICTION
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
    console.error(
      "getTaskPrediction error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// const getTaskSuggestion = async (inputText) => {
//   try {
//     console.log("getTaskSuggestion input:", inputText);

//     const response = await axios.post(
//       GEMINI_URL,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `Suggest 6 task names for: ${inputText}. Return only task names, no numbering.`,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-goog-api-key": process.env.GEMINI_API_KEY,
//         },
//       }
//     );

//     const text =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     const limited = text
//       .split("\n")
//       .filter((item) => item.trim() !== "")
//       .slice(0, 5)
//       .join("\n");

//     return limited;

//   } catch (error) {
//     console.error("Gemini ERROR:", error?.response?.data || error.message);

//     // ✅ NEVER THROW
//     return "⚠️ AI limit reached. Try again later.";
//   }
// };
module.exports = { getTaskSuggestion, getTaskPrediction };