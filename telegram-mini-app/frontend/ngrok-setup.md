# Testing Telegram Mini App with ngrok

## What is ngrok?

ngrok creates a secure tunnel to your local development server, making your local app accessible via a public HTTPS URL. This is perfect for testing Telegram Mini Apps because:

- ✅ Provides HTTPS (required for Telegram Mini Apps)
- ✅ Gives you a public URL instantly
- ✅ No deployment needed
- ✅ Real-time testing with Telegram SDK

## Setup Instructions

### 1. Install ngrok

**Option A: Download from ngrok.com**

1. Go to [ngrok.com](https://ngrok.com)
2. Sign up for a free account
3. Download ngrok for your platform
4. Extract and add to your PATH

**Option B: Using npm**

```bash
npm install -g ngrok
```

### 2. Start a Local Server

You need to serve your files locally. Here are several options:

**Option A: Using Python (if you have Python installed)**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js**

```bash
# Install a simple HTTP server
npm install -g http-server

# Start the server
http-server -p 8000
```

**Option C: Using PHP**

```bash
php -S localhost:8000
```

### 3. Start ngrok Tunnel

Open a new terminal and run:

```bash
ngrok http 8000
```

You'll see output like:

```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                       United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### 4. Configure Your Telegram Bot

1. **Message @BotFather** on Telegram
2. **Send `/setmenubutton`**
3. **Choose your bot**
4. **Set button text**: "Launch App"
5. **Set Mini App URL**: Your ngrok URL (e.g., `https://abc123.ngrok.io`)

### 5. Test Your Mini App

1. **Open your bot** in Telegram
2. **Click the menu button**
3. **Your Mini App will open** with full Telegram SDK features!

## Advantages of Using ngrok

### ✅ **Real Telegram SDK Testing**

- No more mock objects
- Real user data from Telegram
- Actual theme detection
- Native Telegram features work

### ✅ **Instant Testing**

- No deployment needed
- Changes reflect immediately
- Real-time debugging

### ✅ **HTTPS Support**

- Telegram requires HTTPS
- ngrok provides this automatically
- Secure tunnel for testing

### ✅ **Public URL**

- Accessible from anywhere
- Works with Telegram's requirements
- Share with others for testing

## Development Workflow

### 1. **Start Development Server**

```bash
# Terminal 1: Start your local server
python -m http.server 8000
```

### 2. **Start ngrok Tunnel**

```bash
# Terminal 2: Start ngrok
ngrok http 8000
```

### 3. **Update Bot URL**

- Copy the new ngrok URL
- Update your bot with @BotFather
- Test in Telegram

### 4. **Make Changes**

- Edit your files locally
- Changes appear immediately
- Test in Telegram instantly

## Troubleshooting

### **ngrok URL Changes**

- Free ngrok URLs change each time you restart
- You'll need to update your bot URL each time
- Consider ngrok Pro for fixed URLs

### **HTTPS Issues**

- Make sure you're using the HTTPS URL from ngrok
- Check that your local server is running on port 8000
- Verify ngrok is forwarding correctly

### **Telegram Bot Issues**

- Ensure your bot is active
- Check that the URL is set correctly in @BotFather
- Try restarting your Telegram app

### **CORS Issues**

- ngrok handles CORS automatically
- If you see CORS errors, check your local server configuration

## Alternative: ngrok with Custom Domain

If you want a consistent URL, consider ngrok Pro:

```bash
# With ngrok Pro, you can use custom domains
ngrok http 8000 --subdomain=myapp
# This gives you: https://myapp.ngrok.io
```

## Security Notes

⚠️ **Important**:

- ngrok URLs are public and accessible to anyone
- Don't use for production
- Be careful with sensitive data during testing
- Use only for development and testing

## Next Steps

Once you're comfortable with ngrok testing:

1. **Deploy to Vercel** for production
2. **Update your bot** with the production URL
3. **Test thoroughly** in the production environment

## Quick Commands Reference

```bash
# Start local server
python -m http.server 8000

# Start ngrok (in new terminal)
ngrok http 8000

# Check ngrok status
curl http://localhost:4040/api/tunnels

# View ngrok web interface
open http://localhost:4040
```

This setup gives you the best of both worlds: local development with real Telegram SDK testing!
