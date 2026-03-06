const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("DB ENV VALUE:", process.env.DB);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const messageRoute = require("./routes/messageRoute");
const setupWebSocket = require("./wsServer");
const userRoute = require("./routes/userRoute");
const connection = require("./db/db");

const app = express();

connection();

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chatapp-liard-gamma.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

setupWebSocket(server);