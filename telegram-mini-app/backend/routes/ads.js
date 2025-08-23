const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const adsgramService = require("../services/adsgramService");
const config = require("../config/config");

// Start watching an ad
router.post("/start", async (req, res) => {
  try {
    const { userId, adType = "video", adId } = req.body;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!userId || !adId) {
      return res.status(400).json({ error: "User ID and Ad ID are required" });
    }

    // Check if user exists
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check daily ad limit
    if (user.adsCompletedToday >= config.ads.dailyLimit) {
      return res.status(429).json({
        error: "Daily ad limit reached",
        limit: config.ads.dailyLimit,
        completed: user.adsCompletedToday,
      });
    }

    // Reset daily ads if it's a new day
    user.resetDailyAds();
    await user.save();

    // Start ad with adsgram.ai
    const adsgramResult = await adsgramService.startAd(
      adId,
      userId,
      userAgent,
      ipAddress
    );

    // Create new ad record
    const ad = new Ad({
      userId,
      adId: adId,
      adType,
      status: "started",
      startTime: new Date(),
      sessionId: adsgramResult.sessionId,
      adProvider: adsgramService.isEnabled() ? "adsgram.ai" : "mock",
      trackingUrl: adsgramResult.trackingUrl,
      duration: adsgramResult.duration,
    });

    await ad.save();

    res.json({
      success: true,
      message: "Ad started successfully",
      ad: {
        id: ad._id,
        adId: ad.adId,
        adType: ad.adType,
        status: ad.status,
        startTime: ad.startTime,
        sessionId: ad.sessionId,
        duration: ad.duration,
        trackingUrl: ad.trackingUrl,
      },
    });
  } catch (error) {
    console.error("Error starting ad:", error);
    res.status(500).json({ error: "Failed to start ad" });
  }
});

// Complete an ad
router.post("/complete", async (req, res) => {
  try {
    const { adId, userId, watchTime } = req.body;

    if (!adId || !userId) {
      return res.status(400).json({ error: "Ad ID and User ID are required" });
    }

    // Find the ad
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    if (ad.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (ad.status === "completed") {
      return res.status(400).json({ error: "Ad already completed" });
    }

    // Complete ad with adsgram.ai
    const adsgramResult = await adsgramService.completeAd(
      ad.sessionId,
      userId,
      watchTime
    );

    // Verify ad completion
    const verificationResult = await adsgramService.verifyAd(
      ad.sessionId,
      userId
    );

    if (!verificationResult.verified) {
      return res.status(400).json({
        error: "Ad verification failed",
        reason: verificationResult.reason,
      });
    }

    // Complete the ad in our system
    ad.completeAd();
    ad.earnings =
      adsgramResult.earnings || config.ads.defaultEarnings[ad.adType] || 0.002;
    ad.verificationStatus = verificationResult.verified ? "verified" : "failed";
    ad.verificationReason = verificationResult.reason;
    await ad.save();

    // Update user balance and stats
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      user.balance += ad.earnings;
      user.totalEarned += ad.earnings;
      user.totalAdsWatched += 1;
      user.adsCompletedToday += 1;
      user.lastAdDate = new Date();
      await user.save();

      // Create transaction record
      await Transaction.create({
        userId,
        type: "ad_earnings",
        amount: ad.earnings,
        description: `Earnings from ${ad.adType} ad`,
        adId: ad._id,
        metadata: {
          adType: ad.adType,
          adProvider: ad.adProvider,
          sessionId: ad.sessionId,
          verificationStatus: ad.verificationStatus,
        },
      });
    }

    res.json({
      success: true,
      message: "Ad completed successfully",
      earnings: ad.earnings,
      userBalance: user.balance,
      adsCompletedToday: user.adsCompletedToday,
      verificationStatus: ad.verificationStatus,
    });
  } catch (error) {
    console.error("Error completing ad:", error);
    res.status(500).json({ error: "Failed to complete ad" });
  }
});

// Get ad statistics for user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get ad statistics
    const adStats = await Ad.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          completedAds: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          totalEarnings: { $sum: "$earnings" },
          averageEarnings: { $avg: "$earnings" },
        },
      },
    ]);

    // Get recent ads
    const recentAds = await Ad.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        user: {
          totalAdsWatched: user.totalAdsWatched,
          adsCompletedToday: user.adsCompletedToday,
          balance: user.balance,
        },
        ads: adStats[0] || {
          totalAds: 0,
          completedAds: 0,
          totalEarnings: 0,
          averageEarnings: 0,
        },
        recentAds: recentAds.map((ad) => ({
          id: ad._id,
          adType: ad.adType,
          status: ad.status,
          earnings: ad.earnings,
          createdAt: ad.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error getting ad stats:", error);
    res.status(500).json({ error: "Failed to get ad statistics" });
  }
});

// Get available ads from adsgram.ai
router.get("/available", async (req, res) => {
  try {
    const userId = req.query.userId;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get ads from adsgram.ai service
    const result = await adsgramService.getAvailableAds(
      userId,
      userAgent,
      ipAddress
    );

    res.json({
      success: true,
      ads: result.ads,
      total: result.total,
      provider: adsgramService.isEnabled() ? "adsgram.ai" : "mock",
    });
  } catch (error) {
    console.error("Error getting available ads:", error);
    res.status(500).json({ error: "Failed to get available ads" });
  }
});

// Get adsgram.ai user statistics
router.get("/adsgram-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get adsgram.ai stats
    const adsgramStats = await adsgramService.getUserStats(userId);

    res.json({
      success: true,
      adsgramStats: adsgramStats.stats,
      provider: adsgramService.isEnabled() ? "adsgram.ai" : "mock",
    });
  } catch (error) {
    console.error("Error getting adsgram.ai stats:", error);
    res.status(500).json({ error: "Failed to get adsgram.ai statistics" });
  }
});

module.exports = router;
