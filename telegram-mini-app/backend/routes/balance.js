const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Get user balance
router.get("/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      balance: {
        current: user.balance,
        totalEarned: user.totalEarned,
        referralEarnings: user.referralEarnings,
        canClaimDailyReward: user.canClaimDailyReward(),
        dailyRewardStreak: user.dailyRewardStreak,
      },
    });
  } catch (error) {
    console.error("Error getting balance:", error);
    res.status(500).json({ error: "Failed to get balance" });
  }
});

// Claim daily reward
router.post("/daily-reward", async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: "Telegram ID is required" });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.canClaimDailyReward()) {
      return res.status(400).json({
        error: "Daily reward already claimed today",
        nextRewardTime: user.lastDailyReward,
      });
    }

    // Calculate daily reward amount
    const baseReward = 0.002; // $0.002 base daily reward
    const streakBonus = Math.min(user.dailyRewardStreak * 0.0005, 0.005); // Max $0.005 bonus
    const totalReward = baseReward + streakBonus;

    // Update user balance and streak
    user.balance += totalReward;
    user.totalEarned += totalReward;
    user.dailyRewardStreak += 1;
    user.lastDailyReward = new Date();
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: telegramId,
      type: "daily_reward",
      amount: totalReward,
      description: `Daily reward (Day ${user.dailyRewardStreak})`,
      metadata: {
        streak: user.dailyRewardStreak,
        baseReward: baseReward,
        streakBonus: streakBonus,
      },
    });

    res.json({
      success: true,
      message: "Daily reward claimed successfully",
      reward: {
        amount: totalReward,
        baseReward: baseReward,
        streakBonus: streakBonus,
        streak: user.dailyRewardStreak,
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error claiming daily reward:", error);
    res.status(500).json({ error: "Failed to claim daily reward" });
  }
});

// Get transaction history
router.get("/:telegramId/transactions", async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { page = 1, limit = 20, type } = req.query;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build query
    const query = { userId: telegramId };
    if (type) {
      query.type = type;
    }

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions: transactions.map((t) => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        createdAt: t.createdAt,
        metadata: t.metadata,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ error: "Failed to get transaction history" });
  }
});

// Add balance (for testing or admin use)
router.post("/add", async (req, res) => {
  try {
    const { telegramId, amount, description, type = "deposit" } = req.body;

    if (!telegramId || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Valid Telegram ID and amount are required" });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user balance
    user.balance += amount;
    user.totalEarned += amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: telegramId,
      type: type,
      amount: amount,
      description: description || `Balance added: $${amount}`,
      metadata: {
        addedBy: "system",
      },
    });

    res.json({
      success: true,
      message: "Balance added successfully",
      newBalance: user.balance,
      addedAmount: amount,
    });
  } catch (error) {
    console.error("Error adding balance:", error);
    res.status(500).json({ error: "Failed to add balance" });
  }
});

// Get earnings summary
router.get("/:telegramId/summary", async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get earnings by type
    const earningsByType = await Transaction.aggregate([
      {
        $match: {
          userId: telegramId,
          type: { $in: ["ad_earnings", "daily_reward", "referral_bonus"] },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Format earnings data
    const earnings = {
      ad_earnings: 0,
      daily_reward: 0,
      referral_bonus: 0,
    };

    earningsByType.forEach((item) => {
      earnings[item._id] = item.total;
    });

    res.json({
      success: true,
      summary: {
        currentBalance: user.balance,
        totalEarned: user.totalEarned,
        earnings: earnings,
        totalAdsWatched: user.totalAdsWatched,
        dailyRewardStreak: user.dailyRewardStreak,
      },
    });
  } catch (error) {
    console.error("Error getting earnings summary:", error);
    res.status(500).json({ error: "Failed to get earnings summary" });
  }
});

module.exports = router;
