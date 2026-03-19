const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed");
    console.error(err);
  });
