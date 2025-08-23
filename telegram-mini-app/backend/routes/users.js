const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Create or update user (when they start the bot)
router.post("/", async (req, res) => {
  try {
    const {
      telegramId,
      username,
      firstName,
      lastName,
      languageCode,
      referralCode,
    } = req.body;

    if (!telegramId) {
      return res.status(400).json({ error: "Telegram ID is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ telegramId });

    if (user) {
      // Update existing user
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.languageCode = languageCode || user.languageCode;
      user.updatedAt = new Date();

      await user.save();

      return res.json({
        success: true,
        message: "User updated successfully",
        user: {
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
          totalEarned: user.totalEarned,
          referralCode: user.referralCode,
          totalAdsWatched: user.totalAdsWatched,
          canClaimDailyReward: user.canClaimDailyReward(),
        },
      });
    } else {
      // Create new user
      user = new User({
        telegramId,
        username,
        firstName,
        lastName,
        languageCode,
      });

      // Generate referral code
      user.referralCode = user.generateReferralCode();

      // Handle referral if provided
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          user.referredBy = referrer.telegramId;

          // Add referral bonus to referrer
          const referralBonus = 0.01; // $0.01 for each referral
          referrer.balance += referralBonus;
          referrer.referralEarnings += referralBonus;
          await referrer.save();

          // Create transaction for referrer
          await Transaction.create({
            userId: referrer.telegramId,
            type: "referral_bonus",
            amount: referralBonus,
            description: `Referral bonus for ${
              user.firstName || user.username || "new user"
            }`,
            referralId: user.telegramId,
            metadata: {
              referralCode: referralCode,
            },
          });
        }
      }

      await user.save();

      return res.json({
        success: true,
        message: "User created successfully",
        user: {
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
          totalEarned: user.totalEarned,
          referralCode: user.referralCode,
          totalAdsWatched: user.totalAdsWatched,
          canClaimDailyReward: user.canClaimDailyReward(),
        },
      });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ error: "Failed to create/update user" });
  }
});

// Get user data
router.get("/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Reset daily ads if it's a new day
    user.resetDailyAds();
    await user.save();

    res.json({
      success: true,
      user: {
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        totalEarned: user.totalEarned,
        referralCode: user.referralCode,
        totalAdsWatched: user.totalAdsWatched,
        adsCompletedToday: user.adsCompletedToday,
        canClaimDailyReward: user.canClaimDailyReward(),
        dailyRewardStreak: user.dailyRewardStreak,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

// Get user statistics
router.get("/:telegramId/stats", async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get recent transactions
    const transactions = await Transaction.find({ userId: telegramId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get ad statistics
    const adStats = await require("../models/Ad").aggregate([
      { $match: { userId: telegramId } },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          completedAds: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalEarnings: { $sum: "$earnings" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        user: {
          balance: user.balance,
          totalEarned: user.totalEarned,
          totalAdsWatched: user.totalAdsWatched,
          referralEarnings: user.referralEarnings,
        },
        ads: adStats[0] || { totalAds: 0, completedAds: 0, totalEarnings: 0 },
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ error: "Failed to get user statistics" });
  }
});

module.exports = router;
