const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: String,
      required: true,
      ref: "User",
    },

    // Transaction details
    type: {
      type: String,
      enum: [
        "ad_earnings",
        "daily_reward",
        "referral_bonus",
        "withdrawal",
        "deposit",
      ],
      required: true,
    },

    // Amount
    amount: {
      type: Number,
      required: true,
    },

    // Currency (default USD)
    currency: {
      type: String,
      default: "USD",
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },

    // Reference to related entities
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
    referralId: {
      type: String,
      ref: "User",
    },

    // Description
    description: {
      type: String,
      required: true,
    },

    // Metadata for future use
    metadata: {
      adType: String,
      adProvider: String,
      referralCode: String,
      paymentMethod: String,
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

// Index for efficient queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
