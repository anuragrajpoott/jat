require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/jobs", require("./routes/jobRoutes"));

app.get("/", (req, res) => {
  res.send("Job Tracker API running...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
