const axios = require("axios");
const config = require("../config/config");

class AdsgramService {
  constructor() {
    this.apiKey = config.adsgram.apiKey;
    this.apiUrl = config.adsgram.apiUrl;
    this.enabled = config.adsgram.enabled;

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Check if adsgram.ai is enabled
  isEnabled() {
    return this.enabled && !!this.apiKey;
  }

  // Get available ads from adsgram.ai
  async getAvailableAds(userId, userAgent, ipAddress) {
    if (!this.isEnabled()) {
      return this.getMockAds();
    }

    try {
      const response = await this.client.post("/ads/available", {
        userId: userId,
        userAgent: userAgent,
        ipAddress: ipAddress,
        platform: "telegram_mini_app",
        categories: ["video", "banner", "interstitial"],
      });

      return {
        success: true,
        ads: response.data.ads || [],
        total: response.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching ads from adsgram.ai:", error.message);
      return this.getMockAds();
    }
  }

  // Start an ad session
  async startAd(adId, userId, userAgent, ipAddress) {
    if (!this.isEnabled()) {
      return this.mockStartAd(adId, userId);
    }

    try {
      const response = await this.client.post("/ads/start", {
        adId: adId,
        userId: userId,
        userAgent: userAgent,
        ipAddress: ipAddress,
        platform: "telegram_mini_app",
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        sessionId: response.data.sessionId,
        adData: response.data.adData,
        trackingUrl: response.data.trackingUrl,
        duration: response.data.duration,
      };
    } catch (error) {
      console.error("Error starting ad with adsgram.ai:", error.message);
      return this.mockStartAd(adId, userId);
    }
  }

  // Complete an ad session
  async completeAd(sessionId, userId, watchTime) {
    if (!this.isEnabled()) {
      return this.mockCompleteAd(sessionId, userId);
    }

    try {
      const response = await this.client.post("/ads/complete", {
        sessionId: sessionId,
        userId: userId,
        watchTime: watchTime,
        platform: "telegram_mini_app",
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        earnings: response.data.earnings,
        verified: response.data.verified,
        reason: response.data.reason || "completed",
      };
    } catch (error) {
      console.error("Error completing ad with adsgram.ai:", error.message);
      return this.mockCompleteAd(sessionId, userId);
    }
  }

  // Verify ad completion
  async verifyAd(sessionId, userId) {
    if (!this.isEnabled()) {
      return { success: true, verified: true };
    }

    try {
      const response = await this.client.get(`/ads/verify/${sessionId}`, {
        params: { userId },
      });

      return {
        success: true,
        verified: response.data.verified,
        reason: response.data.reason,
        earnings: response.data.earnings,
      };
    } catch (error) {
      console.error("Error verifying ad with adsgram.ai:", error.message);
      return { success: false, verified: false, reason: "verification_failed" };
    }
  }

  // Get user ad statistics
  async getUserStats(userId) {
    if (!this.isEnabled()) {
      return this.getMockUserStats(userId);
    }

    try {
      const response = await this.client.get(`/users/${userId}/stats`);

      return {
        success: true,
        stats: response.data.stats,
      };
    } catch (error) {
      console.error(
        "Error fetching user stats from adsgram.ai:",
        error.message
      );
      return this.getMockUserStats(userId);
    }
  }

  // Mock data for development/testing
  getMockAds() {
    return {
      success: true,
      ads: [
        {
          id: "mock_video_1",
          type: "video",
          title: "Watch Video Ad",
          description: "Watch a 30-second video to earn $0.002",
          duration: 30,
          earnings: 0.002,
          thumbnail: "https://via.placeholder.com/300x200",
          provider: "mock",
        },
        {
          id: "mock_banner_1",
          type: "banner",
          title: "View Banner Ad",
          description: "View a banner ad to earn $0.001",
          duration: 5,
          earnings: 0.001,
          thumbnail: "https://via.placeholder.com/300x100",
          provider: "mock",
        },
        {
          id: "mock_interstitial_1",
          type: "interstitial",
          title: "Full Screen Ad",
          description: "Watch a full screen ad to earn $0.003",
          duration: 45,
          earnings: 0.003,
          thumbnail: "https://via.placeholder.com/300x400",
          provider: "mock",
        },
      ],
      total: 3,
    };
  }

  mockStartAd(adId, userId) {
    return {
      success: true,
      sessionId: `mock_session_${Date.now()}`,
      adData: {
        id: adId,
        type: "video",
        duration: 30,
      },
      trackingUrl: "https://mock-tracking-url.com",
      duration: 30,
    };
  }

  mockCompleteAd(sessionId, userId) {
    return {
      success: true,
      earnings: 0.002,
      verified: true,
      reason: "completed",
    };
  }

  getMockUserStats(userId) {
    return {
      success: true,
      stats: {
        totalAds: 0,
        totalEarnings: 0,
        todayAds: 0,
        todayEarnings: 0,
        averageWatchTime: 0,
      },
    };
  }
}

module.exports = new AdsgramService();
