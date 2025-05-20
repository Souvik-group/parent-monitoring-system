const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

const CLOUD_NAME = "dwbyocbug";
const API_KEY = "211668473919373"; // 🔁 Replace with real key
const API_SECRET = "l8CD8y33z3yMaVB976poTGZ4f20"; // 🔁 Replace with real secret

app.get("/api/media", async (req, res) => {
  const tag = "snapshot";
  const timestamp = Math.floor(Date.now() / 1000);

  const stringToSign = `tag=${tag}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  try {
    const [imageRes, videoRes] = await Promise.all([
      axios.get(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/tags/${tag}`, {
        params: {
          api_key: API_KEY,
          timestamp,
          signature
        }
      }),
      axios.get(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/video/tags/${tag}`, {
        params: {
          api_key: API_KEY,
          timestamp,
          signature
        }
      })
    ]);

    const allMedia = [...imageRes.data.resources, ...videoRes.data.resources];
    allMedia.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(allMedia);
  } catch (err) {
    console.error("❌ Cloudinary fetch error:", err.response?.data || err.message);
    res.status(500).json({ error: "Cloudinary fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://192.168.1.5:${PORT}`);
});
