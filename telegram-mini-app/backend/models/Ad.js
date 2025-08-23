const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: String,
      required: true,
      ref: "User",
    },

    // Ad details
    adId: {
      type: String,
      required: true,
    },
    adType: {
      type: String,
      enum: ["video", "banner", "interstitial"],
      default: "video",
    },
    adProvider: {
      type: String,
      default: "adsgram.ai",
    },

    // Ad status
    status: {
      type: String,
      enum: ["started", "completed", "failed", "abandoned"],
      default: "started",
    },

    // Earnings
    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Timing
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },

    // Ad content (for future reference)
    adTitle: {
      type: String,
    },
    adDescription: {
      type: String,
    },

    // User interaction
    userInteractions: {
      clicks: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
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

// Calculate duration when ad is completed
adSchema.methods.completeAd = function () {
  this.status = "completed";
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
};

// Calculate earnings based on ad type and duration
adSchema.methods.calculateEarnings = function () {
  const baseRates = {
    video: 0.002, // $0.002 per video ad
    banner: 0.001, // $0.001 per banner view
    interstitial: 0.003, // $0.003 per interstitial
  };

  const baseRate = baseRates[this.adType] || 0.002;
  this.earnings = baseRate;

  return this.earnings;
};

module.exports = mongoose.model("Ad", adSchema);
