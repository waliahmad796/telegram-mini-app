require("dotenv").config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB Configuration
  mongodb: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/telegram-mini-app",
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-here",
    expiresIn: "7d",
  },

  // adsgram.ai Configuration
  adsgram: {
    apiKey: process.env.ADSGRAM_API_KEY,
    apiUrl: process.env.ADSGRAM_API_URL || "https://api.adsgram.ai",
    enabled: !!process.env.ADSGRAM_API_KEY,
  },

  // Telegram Configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },

  // CORS Configuration
  cors: {
    origins:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com", "https://your-telegram-mini-app.com"]
        : [
            "https://ccfa862c47fc.ngrok-free.app",
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://127.0.0.1:5500",
            "http://127.0.0.1:8080",
          ],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // Ad Configuration
  ads: {
    defaultEarnings: {
      video: 0.002,
      banner: 0.001,
      interstitial: 0.003,
    },
    dailyLimit: 50,
    minWatchTime: 30, // seconds
  },
};

module.exports = config;
