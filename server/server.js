require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

/*
  =============================
  Middleware
  =============================
*/

// CORS
app.use(
  cors({
    origin: "https://jat-navy.vercel.app",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/*
  =============================
  Routes
  =============================
*/

app.use("/api/jobs", require("./routes/jobRoutes"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Job Tracker API running",
  });
});

/*
  =============================
  404 Handler
  =============================
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
  =============================
  Global Error Handler
  =============================
*/
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/*
  =============================
  Start Server
  =============================
*/

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
