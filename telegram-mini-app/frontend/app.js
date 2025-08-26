import api from "./api.js";
// Telegram Mini App Initialization
let tg = null;
let user = null;
const tgtest = window.Telegram && window.Telegram.WebApp;

// Development mode - simulate Telegram environment for testing
const isDevelopment = tgtest && tgtest.initData && tgtest.initData.length > 0;

// Initialize the Telegram Mini App
async function initTelegramApp() {
  // Check if we're in Telegram
  if (isDevelopment) {
    console.log("Not in telegram");

    tg = window.Telegram.WebApp;

    // Update status indicator
    const tgCheck = document.getElementById("tg-check");
    if (tgCheck) {
      tgCheck.textContent = "✅ Running in Telegram";
      tgCheck.style.color = "#00ff00";
    }

    // Initialize the app
    tg.ready();
    tg.expand();

    // Get user information
    user = tg.initDataUnsafe && tg.initDataUnsafe.user;

    // Initialize user in backend
    await initializeUserInBackend();

    updateUserInfo();

    // Set up theme
    setupTheme();

    // Set up main button
    // setupMainButton();

    // Set up event listeners
    setupEventListeners();

    // Initialize app state
    await initializeAppState();
  } else {
    // Not running in Telegram - Development mode
    const tgCheck = document.getElementById("tg-check");
    console.log("not in telegram");

    if (tgCheck) {
      tgCheck.textContent = "🛠️ Development Mode - Not in Telegram";
      tgCheck.style.color = "#ffa500";
    }

    const usernameSpan = document.getElementById("tg-username");
    if (usernameSpan) {
      usernameSpan.textContent = "Demo User";
    }

    // Create mock Telegram object for development
    createMockTelegram();

    // Initialize mock user in backend
    await initializeUserInBackend();
  }
}
initTelegramApp();
// Create mock Telegram object for development testing
function createMockTelegram() {
  tg = {
    ready: () => console.log("Mock: App ready"),
    expand: () => console.log("Mock: App expanded"),
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: "Demo",
        last_name: "User",
        username: "demo_user",
        language_code: "en",
      },
    },
    themeParams: {
      bg_color: "#ffffff",
      text_color: "#000000",
      hint_color: "#999999",
      link_color: "#2481cc",
      button_color: "#2481cc",
      button_text_color: "#ffffff",
      secondary_bg_color: "#f1f1f1",
    },
    colorScheme: "light",
    viewportHeight: 600,
    MainButton: {
      text: "🎁 Claim Daily Reward",
      isVisible: false,
      setText: (text) => {
        tg.MainButton.text = text;
        console.log("Mock: Main button text set to", text);
      },
      show: () => {
        tg.MainButton.isVisible = true;
        console.log("Mock: Main button shown");
      },
      hide: () => {
        tg.MainButton.isVisible = false;
        console.log("Mock: Main button hidden");
      },
      onClick: (callback) => {
        tg.MainButton.onClickCallback = callback;
      },
      showProgress: () => console.log("Mock: Main button showing progress"),
      hideProgress: () => console.log("Mock: Main button hiding progress"),
    },
    BackButton: {
      onClick: (callback) => console.log("Mock: Back button callback set"),
    },
    HapticFeedback: {
      impactOccurred: (style) => console.log("Mock: Haptic feedback", style),
      notificationOccurred: (type) => console.log("Mock: Notification", type),
    },
    CloudStorage: {
      setItem: (key, value, callback) => {
        console.log("Mock: Cloud storage set", key, value);
        if (callback) callback(null, true);
      },
      getItem: (key, callback) => {
        console.log("Mock: Cloud storage get", key);
        if (callback) callback(null, null);
      },
    },
    showAlert: (message) => {
      alert("Mock Telegram Alert: " + message);
    },
    showConfirm: (message, callback) => {
      const result = confirm("Mock Telegram Confirm: " + message);
      if (callback) callback(result);
    },
    openLink: (url) => {
      console.log("Mock: Opening link", url);
      window.open(url, "_blank");
    },
    onEvent: (eventType, callback) => {
      console.log("Mock: Event listener set for", eventType);
    },
  };

  // Set up mock user
  user = tg.initDataUnsafe.user;
  updateUserInfo();
  setupTheme();
  setupMainButton();
  setupEventListeners();
  initializeAppState();

  // Show development notice
  const devNotice = document.getElementById("dev-notice");
  if (devNotice) {
    devNotice.style.display = "block";
  }

  console.log("🛠️ Development mode enabled - Mock Telegram object created");
  console.log(
    "📱 To test in real Telegram, deploy this app and open it from your bot"
  );
  console.log(
    "🔧 All Telegram API calls are being mocked - check console for details"
  );
}

// // Update user information display
function updateUserInfo() {
  const usernameSpan = document.getElementById("tg-username");
  if (usernameSpan && user) {
    const name =
      [
        user.first_name || "",
        user.last_name || "",
        user.username ? `@${user.username}` : "",
      ]
        .filter(Boolean)
        .join(" ") || "User";

    usernameSpan.textContent = name.trim();
  }
}

// Set up theme support
function setupTheme() {
  if (!tg) return;

  // Apply theme colors
  const themeParams = tg.themeParams;
  const colorScheme = tg.colorScheme;

  // Set CSS variables for theme colors
  document.documentElement.style.setProperty(
    "--tg-theme-bg-color",
    themeParams.bg_color || "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-text-color",
    themeParams.text_color || "#000000"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-hint-color",
    themeParams.hint_color || "#999999"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-link-color",
    themeParams.link_color || "#2481cc"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-color",
    themeParams.button_color || "#2481cc"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-text-color",
    themeParams.button_text_color || "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-secondary-bg-color",
    themeParams.secondary_bg_color || "#f1f1f1"
  );

  // Add theme change listener
  tg.onEvent("themeChanged", () => {
    setupTheme();
  });
}

// Set up main button
// function setupMainButton() {
//   if (!tg) return;

//   const mainButton = tg.MainButton;
//   mainButton.setText("🎁 Claim Daily Reward");
//   mainButton.show();
//   mainButton.onClick(() => {
//     claimDailyReward();
//   });
// }

// Set up event listeners
function setupEventListeners() {
  if (!tg) return;

  // Handle viewport changes
  tg.onEvent("viewportChanged", (event) => {
    if (event.isStateStable) {
      console.log("Viewport stabilized at height:", tg.viewportHeight);
    }
  });

  // Handle back button
  tg.BackButton.onClick(() => {
    tg.close();
  });
}

// Initialize user in backend
async function initializeUserInBackend() {
  try {
    if (!user) {
      console.error("No user data available");
      return;
    }

    const userData = {
      telegramId: user.id.toString(),
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      languageCode: user.language_code,
    };

    const response = await api.createOrUpdateUser(userData);
    console.log("User initialized in backend:", response);

    // Store user data globally
    window.currentUser = response.user;
  } catch (error) {
    console.error("Failed to initialize user in backend:", error);
  }
}

// Initialize app state
async function initializeAppState() {
  try {
    if (!user) return;

    // Get user data from backend
    const userData = await api.getUserData(user.id.toString());
    window.currentUser = userData.user;

    // Get balance from backend
    const balanceData = await api.getBalance(user.id.toString());
    window.currentBalance = balanceData.balance;
    console.log("balanceData----------", balanceData);

    // Update UI
    updateBalance();
    updateProgress();
  } catch (error) {
    console.error("Failed to initialize app state:", error);
  }
}

// Claim daily reward
// async function claimDailyReward() {
//   if (!tg || !user) return;

//   try {
//     // Show loading state
//     tg.MainButton.showProgress();
//     tg.HapticFeedback.impactOccurred("medium");

//     // Call backend API
//     const response = await api.claimDailyReward(user.id.toString());

//     // Hide loading state
//     tg.MainButton.hideProgress();

//     // Show success message
//     const rewardAmount = response.reward.amount.toFixed(6);
//     tg.showAlert(`🎉 Daily reward claimed! +${rewardAmount} USD`);
//     tg.HapticFeedback.notificationOccurred("success");

//     // Update UI with new balance
//     window.currentBalance = response.balance;
//     updateBalance();

//     // Save progress
//     saveProgress();
//   } catch (error) {
//     // Hide loading state
//     tg.MainButton.hideProgress();

//     // Show error message
//     const errorMessage = error.message || "Failed to claim daily reward";
//     tg.showAlert(`❌ ${errorMessage}`);
//     tg.HapticFeedback.notificationOccurred("error");

//     console.error("Failed to claim daily reward:", error);
//   }
// }
// WATCH ADD FUNCTION
async function watchAd(methodNumber) {
  if (!tg || !user) return;
  // Get all watch ads cards (Method 1, 2, 3)
  const watchAdCards = Array.from(
    document.querySelectorAll(".card-light")
  ).filter((card) => {
    const title = card.querySelector("h2").textContent;
    return title.includes("Watch Ads - Method");
  });

  // Get the specific card for this method (methodNumber is 1-based)
  const targetCard = watchAdCards[methodNumber - 1];
  if (!targetCard) {
    console.error(`No card found for method ${methodNumber}`);
    return;
  }

  const button = targetCard.querySelector(".btn-watch");
  const progressBar = targetCard.querySelector(".progress-bar-fill");
  const progressLabel = targetCard.querySelector(".progress-label");

  console.log(`watchAd called for method ${methodNumber}:`, {
    button: !!button,
    progressBar: !!progressBar,
    progressLabel: !!progressLabel,
  });

  if (!button || !progressBar || !progressLabel) return;

  try {
    button.disabled = true;
    button.textContent = "Loading...";
    tg.HapticFeedback.impactOccurred("light");

    // Get available ads
    const availableAds = await api.getAvailableAds(user.id.toString());
    if (!availableAds.ads || availableAds.ads.length === 0) {
      throw new Error("No ads available at the moment");
    }

    const selectedAd = availableAds.ads[0];

    // Start ad
    const startResponse = await api.startAd(
      user.id.toString(),
      selectedAd.id,
      selectedAd.type
    );

    button.textContent = `Watching (${selectedAd.duration}s)...`;

    // (Optional) open ad tracking URL
    if (startResponse.ad.trackingUrl) {
      window.open(startResponse.ad.trackingUrl, "_blank");
    }

    // Simulate watch
    setTimeout(async () => {
      try {
        const completeResponse = await api.completeAd(
          user.id.toString(),
          startResponse.ad.id,
          selectedAd.duration
        );

        const currentProgress =
          parseInt(progressLabel.textContent.split("/")[0]) + 1;
        const totalProgress = window.dailyLimit || 100;
        const percentage = (currentProgress / totalProgress) * 100;

        progressBar.style.width = `${percentage}%`;
        progressLabel.textContent = `${currentProgress}/${totalProgress}`;

        button.disabled = false;
        button.textContent = "Watch Ad";
        tg.HapticFeedback.notificationOccurred("success");

        const earnings = completeResponse.earnings.toFixed(6);
        tg.showAlert(`✅ Ad watched! +${earnings} USD earned!`);

        window.currentBalance = completeResponse.userBalance;
        updateBalance();

        if (currentProgress >= totalProgress) {
          tg.showAlert("🎉 Daily limit reached!");
        }

        saveProgress();
      } catch (error) {
        console.error("Failed to complete ad:", error);
        button.disabled = false;
        button.textContent = "Watch Ad";
        tg.showAlert(`❌ ${error.message || "Failed to complete ad"}`);
      }
    }, selectedAd.duration * 1000);
  } catch (error) {
    console.error("Failed to start ad:", error);
    button.disabled = false;
    button.textContent = "Watch Ad";
    tg.showAlert(`❌ ${error.message || "Failed to start ad"}`);
  }
}

// Update balance display in all places where `.balance-amount` is used
function updateBalance(amount = 0) {
  // Get current balance from global
  let currentBalance = parseFloat(window.currentBalance.current);
  // Fallback to 0 if backend didn’t send balance
  if (isNaN(currentBalance)) currentBalance = 0;

  // Add reward amount if provided
  if (!isNaN(amount) && amount !== 0) {
    currentBalance += parseFloat(amount);
    window.currentBalance = currentBalance; // update global
  }

  // Always format to 6 decimals (0.05 → 0.050000)
  const formattedBalance = currentBalance.toFixed(6);

  // Update all balance elements
  document.querySelectorAll(".balance-amount").forEach((el) => {
    el.textContent = formattedBalance;
  });
}

// Update progress display
function updateProgress(progress) {
  // Update progress bars and labels based on saved data
  console.log("Progress loaded:", progress);
}

// Save progress to cloud storage
function saveProgress() {
  if (!tg || !tg.CloudStorage) return;

  const progress = {
    timestamp: Date.now(),
    // Add your progress data here
  };

  tg.CloudStorage.setItem(
    "user_progress",
    JSON.stringify(progress),
    (error) => {
      if (error) {
        console.error("Error saving progress:", error);
      } else {
        console.log("Progress saved successfully");
      }
    }
  );
}

// Copy referral link
function copyReferralLink() {
  if (!tg) return;

  const referralLink = `https://t.me/${
    tg.initDataUnsafe.user?.username || "your_bot"
  }?start=ref_${user?.id || "user"}`;

  // Try to copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        tg.showAlert("✅ Referral link copied to clipboard!");
        tg.HapticFeedback.notificationOccurred("success");
      })
      .catch(() => {
        tg.showAlert("📋 Referral link: " + referralLink);
      });
  } else {
    tg.showAlert("📋 Referral link: " + referralLink);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initTelegramApp();

  // Set up button event listeners for watch ad buttons only (exclude referral button)
  const watchAdCards = document.querySelectorAll(".card-light");
  watchAdCards.forEach((card, index) => {
    const watchButton = card.querySelector(".btn-watch");
    const cardTitle = card.querySelector("h2").textContent;

    // Only add watchAd listener to cards that contain "Watch Ads - Method"
    if (watchButton && cardTitle.includes("Watch Ads - Method")) {
      watchButton.addEventListener("click", () => watchAd(index + 1));
    }
  });

  document.querySelectorAll(".btn-claim").forEach((button) => {
    button.addEventListener("click", claimDailyReward);
  });

  // Copy referral link button (specifically target the referral section)
  const referralSection = document.querySelector(".card-light:last-child");
  const copyRefButton = referralSection?.querySelector(".btn-watch");
  if (copyRefButton) {
    copyRefButton.addEventListener("click", copyReferralLink);
  }

  // Bonus page button
  const bonusButton = document.querySelector(".btn-bonus");
  if (bonusButton) {
    bonusButton.addEventListener("click", () => {
      if (tg) {
        tg.openLink("https://your-bonus-page.com");
      } else {
        alert("Bonus page would open here");
      }
    });
  }
});
// Export functions for potential external use
window.TelegramMiniApp = {
  initTelegramApp,
  claimDailyReward,
  watchAd,
  copyReferralLink,
};
