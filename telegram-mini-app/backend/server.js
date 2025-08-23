const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config");

const app = express();
const PORT = config.port;

// Middleware
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
mongoose
  .connect(config.mongodb.uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request for: ${req.method} ${req.path}`);
  next();
});

// Routes
const routes = [
  { path: "/api/users", router: require("./routes/users"), name: "users" },
  { path: "/api/ads", router: require("./routes/ads"), name: "ads" },
  {
    path: "/api/balance",
    router: require("./routes/balance"),
    name: "balance",
  },
];

routes.forEach(({ path, router, name }) => {
  try {
    app.use(path, router);
    console.log(`✓ Successfully mounted ${name} routes`);
  } catch (err) {
    console.error(`❌ Failed to mount ${name} routes:`, err);
    process.exit(1);
  }
});
// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Telegram Mini App Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});
