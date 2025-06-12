require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/gpt", async (req, res) => {
  // ✨ 수정된 부분: prompt가 없을 경우 대비
  const prompt = req.body.prompt || req.body.messages?.[0]?.content;

  if (!prompt) {
    return res.status(400).send("❗️prompt가 전달되지 않았습니다.");
  }

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

    const result = response.data.choices[0].message.content;
    res.send(result);
  } catch (error) {
    console.error("❌ GPT 호출 에러:", error.response?.data || error.message);
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
