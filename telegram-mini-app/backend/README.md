# Telegram Mini App Backend

Backend API for the Telegram Mini App with user management, ad tracking, and payment processing.

## Features

- ✅ User management with Telegram integration
- ✅ Ad tracking and completion
- ✅ Balance and payment tracking
- ✅ Daily rewards system
- ✅ Referral system
- ✅ Transaction history
- ✅ MongoDB Atlas integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telegram-mini-app?retryWrites=true&w=majority

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Adsgram.ai API (for future integration)
ADSGRAM_API_KEY=your-adsgram-api-key
ADSGRAM_API_URL=https://api.adsgram.ai

# Telegram Bot Token (for future bot integration)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check

- `GET /api/health` - Check if server is running

### User Management

- `POST /api/users` - Create or update user
- `GET /api/users/:telegramId` - Get user data
- `GET /api/users/:telegramId/stats` - Get user statistics

### Ad Tracking

- `POST /api/ads/start` - Start watching an ad
- `POST /api/ads/complete` - Complete an ad
- `GET /api/ads/stats/:userId` - Get ad statistics
- `GET /api/ads/available` - Get available ads

### Balance & Payments

- `GET /api/balance/:telegramId` - Get user balance
- `POST /api/balance/daily-reward` - Claim daily reward
- `GET /api/balance/:telegramId/transactions` - Get transaction history
- `POST /api/balance/add` - Add balance (admin/testing)
- `GET /api/balance/:telegramId/summary` - Get earnings summary

## Database Models

### User Model

- Telegram user data (ID, username, name)
- Balance and earnings tracking
- Referral system
- Daily rewards tracking
- Ad statistics

### Ad Model

- Ad tracking (start, completion)
- Earnings calculation
- User interactions
- Timing data

### Transaction Model

- All financial transactions
- Different transaction types
- Metadata for tracking

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Testing the API

You can test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"telegramId": "123456789", "username": "testuser", "firstName": "Test"}'

# Get user data
curl http://localhost:5000/api/users/123456789
```

## Next Steps

1. **MongoDB Atlas Setup** - Set up your MongoDB Atlas database
2. **Adsgram.ai Integration** - Connect to adsgram.ai for real ads
3. **Frontend Integration** - Connect the frontend to this backend
4. **Production Deployment** - Deploy to a hosting service

## Project Structure

```
backend/
├── models/          # Database models
│   ├── User.js
│   ├── Ad.js
│   └── Transaction.js
├── routes/          # API routes
│   ├── users.js
│   ├── ads.js
│   └── balance.js
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── server.js        # Main server file
├── package.json
└── README.md
```
