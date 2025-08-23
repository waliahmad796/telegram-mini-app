@echo off
echo Starting Telegram Mini App with ngrok...
echo.

echo Step 1: Starting local server on port 8000...
start "Local Server" cmd /k "python -m http.server 8000"

echo Step 2: Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Step 3: Starting ngrok tunnel...
echo.
echo IMPORTANT: Copy the HTTPS URL from ngrok and update your Telegram bot!
echo.
ngrok http 8000

pause 