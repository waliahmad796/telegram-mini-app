# Telegram Mini App - Reward System

A fully functional Telegram Mini App that implements a reward/earning system with proper Telegram SDK integration.

## Features

- ✅ **Telegram Mini App SDK Integration** - Proper initialization and platform integration
- 🎨 **Theme Support** - Automatic light/dark theme adaptation
- 👤 **User Authentication** - Real user data from Telegram
- 💰 **Reward System** - Daily rewards and ad watching
- 📊 **Progress Tracking** - Cloud storage for user progress
- 🔗 **Referral System** - Share referral links
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Haptic Feedback** - Native device feedback
- 🌐 **External Links** - Open bonus pages and external content

## Setup Instructions

### 1. Create a Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save your bot token

### 2. Configure Your Bot

#### Set Main Mini App (Recommended)

```
/setmenubutton
```

- Choose your bot
- Set button text: "Launch App"
- Set Mini App URL: `https://your-domain.com`

#### Alternative: Use Inline Buttons

Send this message with your bot:

```javascript
{
  "inline_keyboard": [
    [{
      "text": "Launch Mini App",
      "web_app": {
        "url": "https://your-domain.com"
      }
    }]
  ]
}
```

### 3. Deploy Your App

#### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

#### Option B: Deploy to Any Static Host

- Upload files to any static hosting service
- Ensure HTTPS is enabled (required for Telegram Mini Apps)

### 4. Update Your Bot Configuration

Replace `https://your-domain.com` with your actual deployed URL in:

- Bot menu button configuration
- Inline keyboard buttons
- Any other bot messages

## File Structure

```
telegram-mini-app/
├── index.html          # Main HTML file
├── app.js             # Telegram SDK integration
├── style.css          # Styled with theme support
├── vercel.json        # Deployment configuration
└── README.md          # This file
```

## Telegram Mini App Features Implemented

### Core SDK Features

- ✅ `Telegram.WebApp.ready()` - App initialization
- ✅ `Telegram.WebApp.expand()` - Full screen mode
- ✅ `Telegram.WebApp.MainButton` - Main action button
- ✅ `Telegram.WebApp.BackButton` - Navigation
- ✅ `Telegram.WebApp.HapticFeedback` - Device feedback
- ✅ `Telegram.WebApp.CloudStorage` - Data persistence
- ✅ `Telegram.WebApp.showAlert()` - Native alerts
- ✅ `Telegram.WebApp.openLink()` - External links

### User Data

- ✅ User ID, name, username
- ✅ Theme preferences (light/dark)
- ✅ Platform detection
- ✅ Viewport management

### Theme System

- ✅ Automatic theme detection
- ✅ CSS variables for colors
- ✅ Smooth theme transitions
- ✅ Dark mode support

## Customization

### Adding New Features

1. **New Reward Methods**: Add new sections in `index.html`
2. **API Integration**: Modify functions in `app.js`
3. **Styling**: Update `style.css` with new components

### Backend Integration

For production use, you'll want to add:

- User authentication validation
- Real reward processing
- Database for user progress
- Analytics tracking

Example backend validation:

```javascript
// Validate Telegram data on your server
function validateTelegramData(initData) {
  // Implement validation using your bot token
  // See Telegram documentation for details
}
```

## Testing

### Test Environment

1. Use Telegram's test server
2. Create a test bot with @BotFather on test server
3. Test your Mini App thoroughly

### Debug Mode

- **iOS**: Tap Settings 10 times → Enable Web View Inspection
- **Android**: Hold version number → Enable WebView Debug
- **Desktop**: Right-click in Mini App → Inspect

## Security Considerations

1. **Always validate data** from `Telegram.WebApp.initData`
2. **Use HTTPS** for all deployments
3. **Implement proper authentication** on your backend
4. **Validate user permissions** before sensitive operations

## Troubleshooting

### Common Issues

1. **App not loading**: Check HTTPS and CORS settings
2. **Theme not working**: Ensure CSS variables are properly set
3. **Buttons not responding**: Check event listener setup
4. **Data not saving**: Verify CloudStorage permissions

### Debug Tips

1. Check browser console for errors
2. Verify Telegram SDK is loading
3. Test theme changes in Telegram settings
4. Validate user data structure

## Deployment Checklist

- [ ] HTTPS enabled
- [ ] Bot token configured
- [ ] Mini App URL set in bot
- [ ] Theme colors working
- [ ] All buttons functional
- [ ] Cloud storage working
- [ ] External links opening
- [ ] Responsive design tested

## Support

For Telegram Mini App development:

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Developer Community](https://t.me/BotAPI)

## License

This project is open source and available under the MIT License.

<!-- THE FRONTEND CODE BEFORE DEPLOYING TO VERCEL -->

// {
// "version": 2,
// "builds": [
// {
// "src": "*.html",
// "use": "@vercel/static"
// }
// ],
// "routes": [
// {
// "src": "/(.*)",
// "dest": "/$1"
// }
// ],
// "headers": [
// {
// "source": "/(.\*)",
// "headers": [
// {
// "key": "X-Frame-Options",
// "value": "SAMEORIGIN"
// },
// {
// "key": "X-Content-Type-Options",
// "value": "nosniff"
// },
// {
// "key": "Referrer-Policy",
// "value": "strict-origin-when-cross-origin"
// }
// ]
// }
// ]
// }
