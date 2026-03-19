const express = require("express");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("Backend server is running ");
});
