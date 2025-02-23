const express = require("express");
const router = express.Router();
const { Tournament } = require("../../model/schema");
require("dotenv").config();

router.get("/", (req, res) => {
  res.send("This is the Gemini router");
});
router.post("/geminiValidate", async (req, res) => {
  let message = "";
  let tournament = {};
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  async function sendImageToGemini(base64, question) {
    const base64Image = base64;

    if (!base64Image) {
      return; // Or handle the error as needed
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the correct model name

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg", // Or "image/png" if needed
        data: base64Image,
      },
    };

    try {
      const result = await model.generateContent([question, imagePart]);
      const response = result.response;

      // Correct way to access the text:
      if (response && response.candidates && response.candidates.length > 0) {
        const text = response.candidates[0].content.parts[0].text;
        console.log("\n\n\n\n" + text);
        return text;
      } else {
        console.error("Unexpected API response format:", response);
      }
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
    }
  }
  const { photo, which, matchId } = req.body;
  console.log(which, matchId);

  if (which == "first") {
    try {
      const response = await Tournament.findById(matchId);
      tournament = response;
      console.log(`${tournament} ${process.env.PROMPT1}`);
      const msg = await sendImageToGemini(
        photo,
        `${tournament} ${process.env.PROMPT1}`
      );
      console.log(msg);
      res.json({ message: msg });
    } catch (error) {
      console.log(error);
      (message = "Error finding tournament"), error;
      res.status(401).json({ message });
    }
  } else if (which == "last") {
    console.log(which);
    console.log("Prompt , ", `${tournament} ${process.env.PROMPT2}`);
    try {
      const response = await Tournament.findById(matchId);
      tournament = response;
      const msg = await sendImageToGemini(
        photo,
        `${tournament} ${process.env.PROMPT2}`
      );
      console.log(msg);
      res.json({ message: msg });
    } catch (error) {
      console.log(error);
      message = "Error finding tournament";
      res.status(401).json({ message });
    }
  }
});

module.exports = router;
