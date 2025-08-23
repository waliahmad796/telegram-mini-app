const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Telegram user data
    telegramId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    languageCode: {
      type: String,
      required: false,
    },

    // Balance and earnings
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Referral system
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: String,
      ref: "User",
    },
    referralEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Ad tracking
    totalAdsWatched: {
      type: Number,
      default: 0,
      min: 0,
    },
    adsCompletedToday: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastAdDate: {
      type: Date,
    },

    // Daily rewards
    lastDailyReward: {
      type: Date,
    },
    dailyRewardStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate referral code
userSchema.methods.generateReferralCode = function () {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if user can claim daily reward
userSchema.methods.canClaimDailyReward = function () {
  if (!this.lastDailyReward) return true;

  const now = new Date();
  const lastReward = new Date(this.lastDailyReward);
  const diffTime = now - lastReward;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 1;
};

// Reset daily ad count if it's a new day
userSchema.methods.resetDailyAds = function () {
  const now = new Date();
  const lastAd = this.lastAdDate ? new Date(this.lastAdDate) : null;

  if (!lastAd || now.getDate() !== lastAd.getDate()) {
    this.adsCompletedToday = 0;
    return true;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
