# 🚀 Telegram Mini App Integration Guide

## 📋 Overview

This guide covers the complete integration of your Telegram Mini App with adsgram.ai platform and the backend-frontend connection setup.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │   Frontend      │    │   Backend       │
│   Mini App      │◄──►│   (HTML/CSS/JS) │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   adsgram.ai    │
                                              │   API           │
                                              └─────────────────┘
```

## 🔧 Phase 1: Backend-Frontend Connection

### ✅ Completed Steps

1. **Enhanced CORS Configuration**

   - Added proper CORS settings for development and production
   - Configured allowed origins, methods, and headers
   - Added credentials support

2. **Environment Configuration**

   - Created `config/config.js` for centralized configuration
   - Added support for adsgram.ai API keys
   - Configured MongoDB connection settings

3. **API Service Layer**
   - Created `services/adsgramService.js` for adsgram.ai integration
   - Added mock data support for development
   - Implemented error handling and fallbacks

## 🎯 Phase 2: adsgram.ai Integration

### ✅ Completed Steps

1. **Service Layer Implementation**

   - `getAvailableAds()` - Fetch available ads from adsgram.ai
   - `startAd()` - Start ad session with tracking
   - `completeAd()` - Complete ad and verify earnings
   - `verifyAd()` - Verify ad completion status
   - `getUserStats()` - Get user statistics

2. **Backend Route Updates**

   - Updated `/api/ads/available` to use adsgram.ai
   - Enhanced `/api/ads/start` with session tracking
   - Improved `/api/ads/complete` with verification
   - Added `/api/ads/adsgram-stats/:userId` endpoint

3. **Frontend Integration**
   - Updated API service to include user ID in requests
   - Enhanced ad watching flow with real ad data
   - Added proper error handling and user feedback

## 📁 File Structure

```
telegram-mini-app/
├── backend/
│   ├── config/
│   │   └── config.js              # Configuration management
│   ├── services/
│   │   └── adsgramService.js      # adsgram.ai integration
│   ├── routes/
│   │   ├── ads.js                 # Updated with adsgram.ai
│   │   ├── balance.js             # Balance management
│   │   └── users.js               # User management
│   ├── models/
│   │   ├── Ad.js                  # Ad model
│   │   ├── User.js                # User model
│   │   └── Transaction.js         # Transaction model
│   ├── server.js                  # Main server file
│   └── package.json               # Dependencies
├── frontend/
│   ├── api.js                     # API service layer
│   ├── app.js                     # Main app logic
│   ├── index.html                 # App interface
│   └── style.css                  # Styling
└── INTEGRATION_GUIDE.md           # This guide
```

## 🔑 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telegram-mini-app

# adsgram.ai API (Get from adsgram.ai dashboard)
ADSGRAM_API_KEY=your-adsgram-api-key
ADSGRAM_API_URL=https://api.adsgram.ai

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Telegram Bot Token (for future bot integration)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your actual values
node server.js
```

### 2. Frontend Setup

```bash
cd frontend
# Serve with any static server
python -m http.server 8000
# or
npx serve .
```

### 3. Testing

1. **Backend Health Check**: `http://localhost:5000/api/health`
2. **Available Ads**: `http://localhost:5000/api/ads/available?userId=123`
3. **User Data**: `http://localhost:5000/api/users/123`

## 🔄 API Endpoints

### Ads Management

| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| GET    | `/api/ads/available?userId=123`  | Get available ads from adsgram.ai |
| POST   | `/api/ads/start`                 | Start watching an ad              |
| POST   | `/api/ads/complete`              | Complete ad and earn rewards      |
| GET    | `/api/ads/stats/:userId`         | Get user ad statistics            |
| GET    | `/api/ads/adsgram-stats/:userId` | Get adsgram.ai specific stats     |

### User Management

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| POST   | `/api/users`                   | Create or update user |
| GET    | `/api/users/:telegramId`       | Get user data         |
| GET    | `/api/users/:telegramId/stats` | Get user statistics   |

### Balance Management

| Method | Endpoint                                | Description             |
| ------ | --------------------------------------- | ----------------------- |
| GET    | `/api/balance/:telegramId`              | Get user balance        |
| POST   | `/api/balance/daily-reward`             | Claim daily reward      |
| GET    | `/api/balance/:telegramId/transactions` | Get transaction history |
| GET    | `/api/balance/:telegramId/summary`      | Get earnings summary    |

## 🎯 adsgram.ai Integration Details

### Ad Flow

1. **Fetch Available Ads**

   ```javascript
   const ads = await api.getAvailableAds(userId);
   ```

2. **Start Ad Session**

   ```javascript
   const session = await api.startAd(userId, adType, adId);
   ```

3. **Complete Ad**
   ```javascript
   const result = await api.completeAd(adId, userId, watchTime);
   ```

### Verification Process

1. **Ad Completion Verification**

   - Backend calls adsgram.ai to verify ad completion
   - Checks watch time and user engagement
   - Prevents fraud and invalid completions

2. **Earnings Calculation**
   - Uses adsgram.ai provided earnings
   - Falls back to default earnings if needed
   - Updates user balance and creates transaction

## 🛡️ Security Features

1. **Rate Limiting**

   - Daily ad limits per user
   - API rate limiting (100 requests per 15 minutes)

2. **Ad Verification**

   - Session-based tracking
   - Watch time verification
   - Fraud prevention

3. **User Authentication**
   - Telegram user ID validation
   - Session management

## 🔧 Development vs Production

### Development Mode

- Uses mock adsgram.ai data
- No API key required
- Local MongoDB connection
- Detailed logging

### Production Mode

- Real adsgram.ai integration
- API key required
- Production MongoDB
- Optimized logging

## 📊 Monitoring and Analytics

### Backend Logs

- Ad start/completion events
- User balance changes
- Error tracking
- Performance metrics

### Frontend Analytics

- User engagement tracking
- Ad completion rates
- Error reporting
- Performance monitoring

## 🚀 Deployment

### Backend Deployment

1. Set up production environment variables
2. Deploy to your preferred hosting (Heroku, Vercel, etc.)
3. Configure MongoDB Atlas connection
4. Set up adsgram.ai API key

### Frontend Deployment

1. Update API_BASE_URL in `api.js`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure Telegram Mini App URL in BotFather

## 🔄 Next Steps

### Phase 3: Enhanced Features

1. **Admin Dashboard**

   - User management
   - Ad performance analytics
   - Revenue tracking

2. **Advanced Analytics**

   - User behavior tracking
   - Conversion optimization
   - A/B testing

3. **Additional Ad Types**

   - Banner ads
   - Interstitial ads
   - Rewarded video ads

4. **Payment Integration**
   - Withdrawal system
   - Payment gateway integration
   - Transaction history

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS configuration in `config.js`
   - Verify frontend URL is in allowed origins

2. **adsgram.ai API Errors**

   - Verify API key is correct
   - Check API endpoint URLs
   - Review error logs

3. **MongoDB Connection Issues**
   - Verify connection string
   - Check network connectivity
   - Review MongoDB Atlas settings

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=telegram-mini-app:*
```

## 📞 Support

For issues related to:

- **adsgram.ai Integration**: Check adsgram.ai documentation
- **Telegram Mini App**: Refer to Telegram Bot API docs
- **Backend Issues**: Review server logs and error messages

---

**🎉 Congratulations!** Your Telegram Mini App is now fully integrated with adsgram.ai and ready for production use.
