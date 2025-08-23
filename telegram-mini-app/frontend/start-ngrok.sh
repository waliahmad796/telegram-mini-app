#!/bin/bash

echo "🚀 Starting Telegram Mini App with ngrok..."
echo

echo "Step 1: Starting local server on port 8000..."
python3 -m http.server 8000 &
SERVER_PID=$!

echo "Step 2: Waiting 3 seconds for server to start..."
sleep 3

echo "Step 3: Starting ngrok tunnel..."
echo
echo "📋 IMPORTANT: Copy the HTTPS URL from ngrok and update your Telegram bot!"
echo "🔗 Your app will be available at the ngrok HTTPS URL"
echo

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping local server..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Cleanup complete"
}

# Set up trap to cleanup on script exit
trap cleanup EXIT

# Start ngrok
ngrok http 8000 