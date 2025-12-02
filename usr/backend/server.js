const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.post("/generate-token", (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  // RtcRole.PUBLISHER = 1
  const role = RtcRole.PUBLISHER;
  const tokenExpireSeconds = 3600; // 1 hour
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + tokenExpireSeconds;

  // Ensure UID is an integer (Agora requirement for this method usually, or use buildTokenWithAccount for strings)
  // The Flutter app will send an integer UID.
  const uidInt = parseInt(uid) || 0;

  console.log(`Generating token for Channel: ${channelName}, UID: ${uidInt}`);

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uidInt,
      role,
      privilegeExpireTime
    );
    return res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Agora Token Server running on port ${PORT}`));
