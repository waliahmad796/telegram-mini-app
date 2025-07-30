// Telegram Mini App Initialization
let tg = null;
let user = null;

// Initialize the Telegram Mini App
function initTelegramApp() {
  // Check if we're in Telegram
  if (window.Telegram && window.Telegram.WebApp) {
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
    updateUserInfo();

    // Set up theme
    setupTheme();

    // Set up main button
    setupMainButton();

    // Set up event listeners
    setupEventListeners();

    // Initialize app state
    initializeAppState();
  } else {
    // Not running in Telegram
    const tgCheck = document.getElementById("tg-check");
    if (tgCheck) {
      tgCheck.textContent = "❌ Not running in Telegram";
      tgCheck.style.color = "#ff0000";
    }

    const usernameSpan = document.getElementById("tg-username");
    if (usernameSpan) {
      usernameSpan.textContent = "Demo Mode";
    }
  }
}

// Update user information display
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
function setupMainButton() {
  if (!tg) return;

  const mainButton = tg.MainButton;
  mainButton.setText("🎁 Claim Daily Reward");
  mainButton.show();
  mainButton.onClick(() => {
    claimDailyReward();
  });
}

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

// Initialize app state
function initializeAppState() {
  // Load saved data from cloud storage
  if (tg && tg.CloudStorage) {
    tg.CloudStorage.getItem("user_progress", (error, value) => {
      if (!error && value) {
        try {
          const progress = JSON.parse(value);
          updateProgress(progress);
        } catch (e) {
          console.error("Error parsing saved progress:", e);
        }
      }
    });
  }
}

// Claim daily reward
function claimDailyReward() {
  if (!tg) return;

  // Show loading state
  tg.MainButton.showProgress();
  tg.HapticFeedback.impactOccurred("medium");

  // Simulate API call
  setTimeout(() => {
    // Hide loading state
    tg.MainButton.hideProgress();

    // Show success message
    tg.showAlert("🎉 Daily reward claimed! +0.002000 USD");
    tg.HapticFeedback.notificationOccurred("success");

    // Update UI
    updateBalance(0.002);

    // Save progress
    saveProgress();
  }, 2000);
}

// Watch ad function
function watchAd(methodNumber) {
  if (!tg) return;

  const button = document.querySelector(
    `.card:nth-child(${methodNumber + 2}) .btn-watch`
  );
  const progressBar = document.querySelector(
    `.card:nth-child(${methodNumber + 2}) .progress-bar-fill`
  );
  const progressLabel = document.querySelector(
    `.card:nth-child(${methodNumber + 2}) .progress-label`
  );

  if (button && progressBar && progressLabel) {
    // Disable button
    button.disabled = true;
    button.textContent = "Watching...";

    // Show haptic feedback
    tg.HapticFeedback.impactOccurred("light");

    // Simulate ad watching
    setTimeout(() => {
      // Update progress
      const currentProgress =
        parseInt(progressLabel.textContent.split("/")[0]) + 1;
      const totalProgress = 105;
      const percentage = (currentProgress / totalProgress) * 100;

      progressBar.style.width = `${percentage}%`;
      progressLabel.textContent = `${currentProgress}/${totalProgress}`;

      // Re-enable button
      button.disabled = false;
      button.textContent = "Watch Ad";

      // Show success feedback
      tg.HapticFeedback.notificationOccurred("success");
      tg.showAlert(
        `✅ Ad watched! Progress: ${currentProgress}/${totalProgress}`
      );

      // Check if completed
      if (currentProgress >= totalProgress) {
        tg.showAlert("🎉 Method completed! +0.002000 USD");
        updateBalance(0.002);
      }

      // Save progress
      saveProgress();
    }, 3000);
  }
}

// Update balance display
function updateBalance(amount) {
  // This would typically update a balance display
  // For now, we'll just show an alert
  console.log(`Balance updated by: ${amount} USD`);
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

  // Set up button event listeners
  document.querySelectorAll(".btn-watch").forEach((button, index) => {
    button.addEventListener("click", () => watchAd(index + 1));
  });

  document.querySelectorAll(".btn-claim").forEach((button) => {
    button.addEventListener("click", claimDailyReward);
  });

  // Copy referral link button
  const copyRefButton = document.querySelector(".btn-watch");
  if (
    copyRefButton &&
    copyRefButton.textContent.includes("Copy Referral Link")
  ) {
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
