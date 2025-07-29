window.addEventListener("DOMContentLoaded", () => {
  const tgCheck = document.getElementById("tg-check");
  if (window.Telegram && window.Telegram.WebApp) {
    if (tgCheck) tgCheck.textContent = "In Telegram";
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Get user info
    const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (user) {
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
    if (tgCheck) tgCheck.textContent = "Not in Telegram";
    const usernameSpan = document.getElementById("tg-username");
    if (usernameSpan) usernameSpan.textContent = "Not in Telegram";
    const mainButton = document.getElementById("mainButton");
    if (mainButton) mainButton.textContent = "Not in Telegram";
  }
});
