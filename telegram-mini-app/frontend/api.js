// API Configuration
// const API_BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://your-backend-domain.com/api"
//     : "http://localhost:5000/api";
const API_BASE_URL = "http://localhost:5000/api";
// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      console.log("data--------------", data);

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // User Management
  async createOrUpdateUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getUserData(telegramId) {
    return this.request(`/users/${telegramId}`);
  }

  async getUserStats(telegramId) {
    return this.request(`/users/${telegramId}/stats`);
  }

  // Ad Management
  async startAd(userId, adType = "video", adId) {
    return this.request("/ads/start", {
      method: "POST",
      body: JSON.stringify({
        userId,
        adType,
        adId,
      }),
    });
  }
  // ADD COMPLETE API
  async completeAd(adId, userId, watchTime = 30) {
    return this.request("/ads/complete", {
      method: "POST",
      body: JSON.stringify({
        adId,
        userId,
        watchTime,
      }),
    });
  }

  async getAdStats(userId) {
    return this.request(`/ads/stats/${userId}`);
  }

  async getAvailableAds(userId) {
    return this.request(`/ads/available?userId=${userId}`);
  }

  async getAdsgramStats(userId) {
    return this.request(`/ads/adsgram-stats/${userId}`);
  }

  // Balance Management
  async getBalance(telegramId) {
    return this.request(`/balance/${telegramId}`);
  }
  // DAILY REWARD NOT NEEDED FOR THIS VERSION
  // async claimDailyReward(telegramId) {
  //   return this.request("/balance/daily-reward", {
  //     method: "POST",
  //     body: JSON.stringify({ telegramId }),
  //   });
  // }

  async getTransactions(telegramId, page = 1, limit = 20, type = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) {
      params.append("type", type);
    }

    return this.request(`/balance/${telegramId}/transactions?${params}`);
  }

  async getEarningsSummary(telegramId) {
    return this.request(`/balance/${telegramId}/summary`);
  }

  // Health check
  async healthCheck() {
    console.log("API_BASE_URL--------------", API_BASE_URL);
    return this.request("/health");
  }
}

// Create global API instance
const api = new ApiService();

// Export for use in other files
export default api;
