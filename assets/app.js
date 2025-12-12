// ===== Configuration =====
// Replace this with your CLOUD RUN URL (Note: Use wss:// instead of https://)
// Example: "wss://voigen-voice-proxy-xyz.a.run.app"
const BACKEND_URL = "wss://voigen-backend-1008374989342.asia-south1.run.app"; 
// ==========================

// Global state variables
let isRecording = false;
let isSpeaking = false;
let websocket = null;
let audioContext = null;
let mediaRecorder = null;
let audioQueue = [];
let isPlaying = false;
let currentStream = null;

// ===== Helper Functions =====

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    view.setInt16(i * 2, s, true);
  }
  return buffer;
}

// ===== UI Logging Helpers =====

function logMessage(text, type) {
  const log = document.getElementById('talkLog');
  const p = document.createElement('p');
  p.classList.add(type === 'user' ? 'user-message' : 'ai-message');
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function updateMicStatus(status, className) {
  const micStatusText = document.getElementById('micStatusText');
  const micToggleBtn = document.getElementById('micToggleBtn');
  micStatusText.textContent = status;
  micToggleBtn.className = `mic-toggle-btn ${className || ''}`;
}

// ===== WebSocket Connection Logic =====

async function connectToBackend() {
  if (!BACKEND_URL || BACKEND_URL.includes("YOUR-CLOUD-RUN-URL")) {
    logMessage("ERROR: Backend URL not set in app.js", "ai");
    return;
  }

  updateMicStatus("Connecting...", "connecting");

  try {
    websocket = new WebSocket(BACKEND_URL);
    
    websocket.onopen = () => {
      console.log("Connected to Backend Proxy");
      // Note: We no longer send the 'setup' message here. 
      // The backend handles the prompt and configuration securely.
      updateMicStatus("Ready. Click to Talk.", "");
    };

    websocket.onmessage = async (event) => {
      try {
        let response;
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          response = JSON.parse(text);
        } else {
          response = JSON.parse(event.data);
        }

        // Handle Audio Responses
        if (response.serverContent && response.serverContent.modelTurn) {
          const parts = response.serverContent.modelTurn.parts;
          
          for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith("audio/")) {
              const base64Data = part.inlineData.data;
              const binaryString = window.atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              audioQueue.push(bytes.buffer);
              if (!isPlaying) {
                playAudioFromQueue();
              }
            }
          }
        }

        // Handle Turn Completion
        if (response.serverContent && response.serverContent.turnComplete) {
          if (!isPlaying) {
            isSpeaking = false;
            updateMicStatus("Ready. Click to Talk.", "");
          }
        }

      } catch (e) {
        console.error("Error parsing message:", e);
      }
    };

    websocket.onclose = (event) => {
      console.log("WebSocket Disconnected", event.code);
      if (isRecording) stopRecording();
      updateMicStatus("Disconnected", "error");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket Error", error);
      updateMicStatus("Error", "error");
      stopConversation();
    };

  } catch (error) {
    console.error("Connection failed:", error);
    updateMicStatus("Connection Failed", "error");
  }
}

function stopConversation() {
  if (isRecording) stopRecording();
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  isRecording = false;
  isSpeaking = false;
  isPlaying = false;
  audioQueue = [];
}

// ===== Audio Playback Logic =====

function playAudioFromQueue() {
  if (isPlaying || audioQueue.length === 0) return;
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
  }

  isPlaying = true;
  updateMicStatus("AI Speaking...", "speaking");

  const chunk = audioQueue.shift();
  
  const int16Array = new Int16Array(chunk);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768; 
  }

  const buffer = audioContext.createBuffer(1, float32Array.length, 24000); 
  buffer.getChannelData(0).set(float32Array);

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);

  source.onended = () => {
    isPlaying = false;
    if (audioQueue.length > 0) {
      playAudioFromQueue();
    } else {
      isSpeaking = false;
      updateMicStatus("Ready. Click to Talk.", "");
    }
  };
  
  source.start(0);
}

// ===== Recording Logic =====

async function startRecording() {
  if (isRecording || !websocket || websocket.readyState !== WebSocket.OPEN) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: {
      channelCount: 1,
      sampleRate: 16000 
    }});
    currentStream = stream;

    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      if (!isRecording) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16BitPCM(inputData);
      const base64Audio = arrayBufferToBase64(pcm16);

      const msg = {
        realtime_input: {
          media_chunks: [{
            mime_type: "audio/pcm",
            data: base64Audio
          }]
        }
      };
      
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(msg));
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    mediaRecorder = { source, processor, stream };
    isRecording = true;
    updateMicStatus("Listening...", "recording");
    logMessage("User: (Listening...)", "user");

  } catch (err) {
    console.error("Mic Error:", err);
    logMessage("Error accessing microphone.", "ai");
  }
}

function stopRecording() {
  if (!isRecording) return;
  
  if (mediaRecorder) {
    if (mediaRecorder.processor) mediaRecorder.processor.disconnect();
    if (mediaRecorder.source) mediaRecorder.source.disconnect();
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
  }
  
  isRecording = false;
  updateMicStatus("Processing...", "speaking");
}


// ===== DOM Initialization =====

document.addEventListener('DOMContentLoaded', () => {

  const talkModal = document.getElementById('talkModal');
  const talkNowBtn = document.getElementById('talkNowBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const micToggleBtn = document.getElementById('micToggleBtn');
  
  if (talkNowBtn) {
    talkNowBtn.addEventListener('click', () => {
      talkModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      connectToBackend();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      talkModal.classList.remove('active');
      document.body.style.overflow = '';
      stopConversation();
    });
  }
  
  if (micToggleBtn) {
    micToggleBtn.addEventListener('click', () => {
      if (isSpeaking || isPlaying) return; 
      
      if (isRecording) {
        stopRecording();
      } else {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          startRecording();
        } else {
          connectToBackend();
        }
      }
    });
  }

  // --- Animation & Scroll Logic (Unchanged) ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !document.querySelector(href)) return;
      e.preventDefault();
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.feature-card, .about-feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  if (typeof Tally !== 'undefined') Tally.loadEmbeds();

  console.log('Voigen.ai App Initialized (Secure Mode)');
});