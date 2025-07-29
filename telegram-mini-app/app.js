window.addEventListener("DOMContentLoaded", () => {
  // Check if running inside Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Get user info
    const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) {
      // Prefer display name, fallback to username or first name
      const name =
        (user.first_name ? user.first_name : "") +
          (user.last_name ? " " + user.last_name : "") ||
        user.username ||
        "User";
      document.getElementById("tg-username").textContent = name.trim();
    } else {
      document.getElementById("tg-username").textContent = "Unknown User";
    }

    // Set up main button
    const mainButton = document.getElementById("mainButton");
    if (mainButton) {
      mainButton.textContent = "Send Data to Telegram";
      mainButton.addEventListener("click", () => {
        tg.sendData("Hello from Mini App!");
      });
    }
  } else {
    const usernameSpan = document.getElementById("tg-username");
    if (usernameSpan) usernameSpan.textContent = "Not in Telegram";
    const mainButton = document.getElementById("mainButton");
    if (mainButton) mainButton.textContent = "Not in Telegram";
  }
});
