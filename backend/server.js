const express = require("express");
const cors = require("cors");
require("dotenv").config();
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("Backend server is running ");
});
