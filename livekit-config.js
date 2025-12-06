// ===== LiveKit Configuration =====
// Replace these values with your actual LiveKit server details

const LIVEKIT_CONFIG = {
  // Your LiveKit server URL (e.g., 'wss://your-livekit-server.com')
  url: 'wss://voigen-ai-jbqmetnc.livekit.cloud',
  
  // Your LiveKit API key (for generating tokens server-side)
  apiKey: 'APIy6yvMLVM8ZUr',
  
  // Your LiveKit API secret (for generating tokens server-side)
  apiSecret: 'oYYa9XV3fsxfJeIQVwHE1f4Uz07staHRxQrDkxhsc44C',
  
  // Your LiveKit Agent ID (replace with your actual agent ID)
  agentId: 'CA_KQEvtTQTKtyR',
  
  // Participant identity (can be dynamic based on user)
  participantIdentity: 'user-' + Math.random().toString(36).substr(2, 9),
  
  // Token permissions
  tokenOptions: {
    // Allow publishing audio
    canPublish: true,
    // Allow subscribing to tracks
    canSubscribe: true,
    // Room join permission
    canPublishData: true
  }
};

// ===== Token Generation (Server-side implementation needed) =====
// IMPORTANT: For production, tokens should be generated server-side for security
// This is a client-side example for development/testing only

async function generateAccessToken() {
  // In production, make an API call to your server to generate the token
  // Example:
  // const response = await fetch('/api/livekit-token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     room: LIVEKIT_CONFIG.roomName,
  //     identity: LIVEKIT_CONFIG.participantIdentity
  //   })
  // });
  // return response.json().token;
  
  // For development, you can use a pre-generated token
  return 'YOUR_GENERATED_ACCESS_TOKEN';
}

// ===== Configuration Instructions =====
/*
SETUP INSTRUCTIONS:

1. LiveKit Server Setup:
   - Sign up at https://livekit.io or deploy your own LiveKit server
   - Get your server URL, API key, and API secret from the dashboard

2. Update Configuration:
   - Replace 'YOUR_LIVEKIT_SERVER_URL' with your actual server URL
   - Replace 'YOUR_API_KEY' and 'YOUR_API_SECRET' with your credentials

3. Token Generation (IMPORTANT):
   - For production, implement server-side token generation
   - Never expose API secrets in client-side code
   - Create an endpoint like '/api/livekit-token' that generates tokens securely

4. Voice Agent Setup:
   - Configure your LiveKit server with voice agent capabilities
   - Set up AI agent participants that can join rooms automatically
   - Configure audio processing and speech recognition

5. Testing:
   - Use the LiveKit CLI or dashboard to test connections
   - Verify microphone permissions work in your browser
   - Test with a simple participant before integrating the AI agent

EXAMPLE SERVER-SIDE TOKEN GENERATION (Node.js):

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

SECURITY NOTES:
- Never commit API secrets to version control
- Use environment variables for sensitive configuration
- Implement proper authentication before generating tokens
- Set appropriate token expiration times
- Validate room names and participant identities server-side
*/

// Export configuration for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LIVEKIT_CONFIG, generateAccessToken };
}
