# MongoDB Atlas Connection Setup Guide

## Current Issue

Your MongoDB Atlas connection is failing with the error:

```
Error: querySrv ENOTFOUND _mongodb._tcp.Cluster0.mongodb.net
```

This means the cluster name `Cluster0` in your connection string is incorrect.

## Step-by-Step Fix

### 1. Get Your Correct MongoDB Atlas Connection String

1. **Log into MongoDB Atlas**: https://cloud.mongodb.com
2. **Select your cluster** (it might be named something like "Cluster0" but with a different identifier)
3. **Click "Connect"**
4. **Choose "Connect your application"**
5. **Copy the connection string**

### 2. Update Your .env File

Open `backend/.env` and replace the current `MONGODB_URI` line with your actual connection string.

**Current (incorrect):**

```
MONGODB_URI=mongodb+srv://admin:admin123@Cluster0.mongodb.net/telegram-mini-app?retryWrites=true&w=majority
```

**Should be something like:**

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.abc123.mongodb.net/telegram-mini-app?retryWrites=true&w=majority
```

**Note**: The cluster name format is usually `cluster0.xxxxx.mongodb.net` where `xxxxx` is a unique identifier.

### 3. Test the Connection

Run the test script to verify your connection:

```bash
node test-mongodb.js
```

### 4. Common Issues and Solutions

#### Issue: ENOTFOUND Error

- **Cause**: Incorrect cluster name or network issues
- **Solution**: Double-check your connection string from MongoDB Atlas

#### Issue: EAUTH Error

- **Cause**: Wrong username/password or user permissions
- **Solution**:
  - Verify username and password in MongoDB Atlas
  - Ensure the user has read/write permissions to the database

#### Issue: Network Access

- **Cause**: IP address not whitelisted
- **Solution**:
  - Go to MongoDB Atlas → Network Access
  - Add your current IP address or use `0.0.0.0/0` for all IPs (development only)

### 5. Verify Your Setup

After updating the connection string:

1. **Test MongoDB connection:**

   ```bash
   node test-mongodb.js
   ```

2. **Test the server:**

   ```bash
   node server.js
   ```

3. **Test the test server:**
   ```bash
   node test-server.js
   ```

### 6. Expected Output

When working correctly, you should see:

```
✅ Successfully connected to MongoDB Atlas!
✅ Database ping successful!
🎉 MongoDB Atlas connection is working perfectly!
```

## Need Help?

If you're still having issues:

1. Check your MongoDB Atlas cluster status
2. Verify your database user credentials
3. Ensure your IP is whitelisted in Network Access
4. Try the connection string from MongoDB Atlas exactly as provided
