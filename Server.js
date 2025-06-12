require("dotenv").config(); 

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/gpt", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
        },
      }
    );

    res.send(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("GPT 호출 실패: " + (error.response?.data?.error?.message || error.message));
  }
});

app.get("/", (req, res) => {
  res.send("✅ GPT 중계 서버 정상 작동 중입니다!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 (포트: ${PORT})`);
});
