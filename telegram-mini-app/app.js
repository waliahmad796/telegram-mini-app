window.addEventListener("DOMContentLoaded", () => {
  // Check if running inside Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // Expand the webview to full height
    tg.expand();

    // Set up main button
    const mainButton = document.getElementById("mainButton");
    mainButton.textContent = "Send Data to Telegram";
    mainButton.addEventListener("click", () => {
      tg.sendData("Hello from Mini App!");
    });
  } else {
    // Fallback for browser testing
    document.getElementById("mainButton").textContent = "Not in Telegram";
  }
});
