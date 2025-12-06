# LiveKit Voice Agent Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue: "Unable to connect to the AI assistant. Please check your microphone permissions and try again."

This error can occur for several reasons. Follow these steps to resolve it:

## 1. **Serve Over HTTPS or Localhost**

**Problem**: Modern browsers require HTTPS or localhost to access microphone permissions.

**Solutions**:

### Option A: Use a Local Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# PHP
php -S localhost:8000
```

Then access: `http://localhost:8000`

### Option B: Use Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 2. **Check Browser Permissions**

### Chrome/Edge:
1. Click the lock icon in the address bar
2. Set "Microphone" to "Allow"
3. Refresh the page

### Firefox:
1. Click the shield icon in the address bar
2. Click "Turn off Blocking for This Site"
3. Allow microphone access when prompted

### Safari:
1. Go to Safari > Preferences > Websites
2. Click "Microphone" in the left sidebar
3. Set your site to "Allow"

## 3. **Verify LiveKit Configuration**

Check your token in the browser console:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check if your token has expired

### Token Issues:
- **Expired Token**: Generate a new token from LiveKit dashboard
- **Wrong Room**: Ensure the token is for the correct room (`voigen_ai_live`)
- **Insufficient Permissions**: Token must have `canPublish`, `canSubscribe`, and `roomJoin` permissions

## 4. **Test Your LiveKit Setup**

### Verify Server Connection:
```javascript
// Add this to browser console to test connection
const testConnection = async () => {
  try {
    const room = new LiveKitClient.Room();
    await room.connect('wss://voigen-ai-jbqmetnc.livekit.cloud', 'YOUR_TOKEN');
    console.log('✅ Connection successful!');
    await room.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};
testConnection();
```

## 5. **Agent Configuration**

Ensure your LiveKit agent is properly configured:

### Check Agent Status:
1. Go to your LiveKit dashboard
2. Navigate to "Agents" section
3. Verify your agent `CA_KQEvtTQTKtyR` is running
4. Check agent logs for any errors

### Agent Room Configuration:
- Agent should be configured to join room `voigen_ai_live`
- Agent should have audio input/output enabled
- Agent should auto-join when users connect

## 6. **Browser Console Debugging**

Open browser console and look for these messages:

### ✅ Success Messages:
```
🚀 Welcome to Voigen.ai!
🎤 Voice Agent Ready! Configure your LiveKit settings to enable voice chat.
Connected to LiveKit room successfully
Agent ID: CA_KQEvtTQTKtyR
```

### ❌ Error Messages to Watch For:
- `NotAllowedError`: Microphone permission denied
- `NotFoundError`: No microphone found
- `WebSocket connection failed`: Network/server issue
- `Invalid token`: Token expired or malformed
- `Room not found`: Room configuration issue

## 7. **Network Issues**

### Firewall/Corporate Network:
- Ensure WebSocket connections are allowed
- Check if ports 80, 443, and 7881 are open
- Try from a different network (mobile hotspot)

### DNS Issues:
```bash
# Test DNS resolution
nslookup voigen-ai-jbqmetnc.livekit.cloud
```

## 8. **Browser Compatibility**

### Supported Browsers:
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

### Unsupported:
- ❌ Internet Explorer
- ❌ Very old browser versions

## 9. **Step-by-Step Testing**

1. **Test Basic Connection**:
   ```javascript
   console.log('Testing LiveKit connection...');
   // Check if LiveKitClient is loaded
   console.log('LiveKitClient available:', typeof LiveKitClient !== 'undefined');
   ```

2. **Test Microphone Access**:
   ```javascript
   navigator.mediaDevices.getUserMedia({ audio: true })
     .then(() => console.log('✅ Microphone access granted'))
     .catch(err => console.error('❌ Microphone access denied:', err));
   ```

3. **Test Token Validity**:
   - Decode your JWT token at https://jwt.io
   - Check expiration time (`exp` field)
   - Verify room name matches (`room` field)

## 10. **Quick Fix Checklist**

- [ ] Serving over HTTPS or localhost
- [ ] Microphone permissions granted
- [ ] Token not expired
- [ ] Agent is running in LiveKit dashboard
- [ ] Room name matches token
- [ ] No browser console errors
- [ ] Network allows WebSocket connections

## 🆘 Still Having Issues?

If none of the above solutions work:

1. **Check Browser Console**: Look for specific error messages
2. **Try Different Browser**: Test in Chrome, Firefox, and Safari
3. **Test on Different Device**: Try mobile or different computer
4. **Check LiveKit Dashboard**: Verify agent status and logs
5. **Generate New Token**: Create a fresh token with correct permissions

## 📞 Support

For additional help:
- **Email**: hello@voigen.ai
- **LiveKit Docs**: https://docs.livekit.io
- **LiveKit Community**: https://livekit.io/community

---

**Most Common Solution**: Serve the website over HTTPS or localhost and ensure microphone permissions are granted! 🎤
