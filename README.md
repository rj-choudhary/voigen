# Voigen.ai - LiveKit Voice Agent Integration

This project integrates a LiveKit voice agent into the Voigen.ai website, allowing users to have real-time voice conversations with an AI assistant directly from the website.

## 🎤 Features

- **"Talk Now" Button**: Prominently displayed in the hero section
- **Voice Modal Interface**: Beautiful modal with voice avatar and real-time status
- **Audio Visualizer**: Animated bars that respond to voice activity
- **Connection States**: Visual feedback for connecting, connected, and error states
- **Mute/Unmute Controls**: Users can mute their microphone during conversations
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### 1. Configure LiveKit Settings

Edit the `livekit-config.js` file and replace the placeholder values with your actual LiveKit server details:

```javascript
const LIVEKIT_CONFIG = {
  url: 'wss://your-livekit-server.com',  // Your LiveKit server URL
  apiKey: 'YOUR_API_KEY',                // Your LiveKit API key
  apiSecret: 'YOUR_API_SECRET',          // Your LiveKit API secret
  roomName: 'voice-agent-room',          // Room name for voice sessions
  // ... other configuration options
};
```

### 2. Set Up Token Generation (Important!)

For production, implement server-side token generation. **Never expose API secrets in client-side code.**

Create an endpoint like `/api/livekit-token` that generates tokens securely:

```javascript
// Example Node.js server-side token generation
const { AccessToken } = require('livekit-server-sdk');

app.post('/api/livekit-token', (req, res) => {
  const { room, identity } = req.body;
  
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: identity,
      ttl: '10m', // Token expires in 10 minutes
    }
  );
  
  token.addGrant({
    room: room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });
  
  res.json({ token: token.toJwt() });
});
```

### 3. Update JavaScript Configuration

In `assets/app.js`, update the `LIVEKIT_CONFIG` object with your server URL and implement the `generateAccessToken()` function to call your server endpoint.

### 4. Test the Integration

1. Open `index.html` in a web browser
2. Click the "Talk Now" button in the hero section
3. Grant microphone permissions when prompted
4. Start speaking with your AI voice agent!

## 📁 File Structure

```
voigen/
├── index.html              # Main website with integrated Talk Now button
├── assets/
│   ├── styles.css          # Enhanced CSS with voice interface styles
│   ├── app.js              # JavaScript with LiveKit integration
│   └── voigen ai logo.png  # Website logo
├── livekit-config.js       # LiveKit configuration file
├── README.md               # This documentation
└── ...                     # Other website files
```

## 🎨 UI Components

### Talk Now Button
- Located in the hero section alongside "Get Started Free" and "Explore Features"
- Green gradient background with microphone icon
- Visual states: idle, connecting, connected, error
- Responsive design that works on all screen sizes

### Voice Modal
- Centered modal with backdrop blur effect
- Animated voice avatar that pulses when speaking
- Real-time status updates (Connecting, Connected, etc.)
- Audio visualizer with animated bars
- Mute/unmute and end call controls

### Visual States
- **Idle**: Green button with microphone icon
- **Connecting**: Orange button with "Connecting..." text
- **Connected**: Red button with pulsing animation and "End Call" text
- **Error**: Gray button with "Try Again" text

## 🔧 Technical Implementation

### LiveKit Client Integration
- Uses LiveKit Client SDK v2.5.7 loaded via CDN
- Implements proper room connection and participant management
- Handles audio track publishing and subscribing
- Manages microphone permissions and audio devices

### JavaScript Architecture
- `VoiceAgentManager` class handles all voice functionality
- Event-driven architecture with proper cleanup
- Error handling and user feedback
- Browser compatibility considerations

### CSS Styling
- CSS custom properties for consistent theming
- Smooth animations and transitions
- Responsive design with mobile-first approach
- Accessibility considerations

## 🛡️ Security Best Practices

1. **Server-Side Token Generation**: Never expose API secrets in client code
2. **Token Expiration**: Set appropriate token TTL (Time To Live)
3. **Input Validation**: Validate room names and participant identities
4. **HTTPS Only**: Ensure all connections use HTTPS/WSS
5. **Environment Variables**: Store sensitive configuration in environment variables

## 🔍 Troubleshooting

### Common Issues

1. **"Please configure your LiveKit server URL" Alert**
   - Update `LIVEKIT_CONFIG.url` in `assets/app.js`
   - Ensure your LiveKit server is running and accessible

2. **Microphone Permission Denied**
   - Check browser permissions for microphone access
   - Ensure the site is served over HTTPS (required for microphone access)

3. **Connection Failed**
   - Verify LiveKit server URL and credentials
   - Check network connectivity and firewall settings
   - Ensure WebSocket connections are allowed

4. **No Audio from AI Agent**
   - Verify your AI agent is properly configured in LiveKit
   - Check that the agent is joining the same room
   - Ensure audio tracks are being published by the agent

### Debug Mode

Enable debug logging by opening browser developer tools and checking the console for detailed connection information.

## 🚀 Deployment

### Development
1. Serve the files using a local web server (required for microphone access)
2. Use `python -m http.server 8000` or similar
3. Access via `http://localhost:8000`

### Production
1. Deploy to a web server with HTTPS enabled
2. Set up your LiveKit server infrastructure
3. Implement server-side token generation
4. Configure environment variables for API keys
5. Test thoroughly across different browsers and devices

## 📱 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 14.3+)
- **Edge**: Full support
- **Mobile Browsers**: Full support with responsive design

## 🎯 Next Steps

1. **Configure LiveKit Server**: Set up your LiveKit server with voice agent capabilities
2. **Implement Token Generation**: Create secure server-side token generation
3. **Customize AI Agent**: Configure your AI agent's personality and capabilities
4. **Add Analytics**: Track usage and conversation metrics
5. **Enhance UI**: Add more visual feedback and customization options

## 📞 Support

For technical support or questions about the LiveKit integration:

- **Email**: hello@voigen.ai
- **Website**: https://voigen.ai
- **LiveKit Documentation**: https://docs.livekit.io

## 📄 License

This project is part of the Voigen.ai platform. All rights reserved.

---

**Ready to transform your customer interactions with AI-powered voice conversations!** 🚀
