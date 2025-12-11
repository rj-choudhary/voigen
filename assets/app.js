// ===== Configuration: Update this with your actual key =====
const GEMINI_API_KEY = "AIzaSyBfB77TmTghyFK-QswVNC5N4hs2jcPdEzE";
// ==========================================================

// Gemini Live API Constants
const GEMINI_LIVE_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${GEMINI_API_KEY}`;
const AUDIO_SAMPLE_RATE = 16000; // Required by Gemini Live API

// Global state variables
let isRecording = false;
let isSpeaking = false;
let websocket = null;
let audioContext = null;
let mediaRecorder = null;
let audioQueue = [];
let isPlaying = false;

// ===== Audio Resampler Logic (CRITICAL for Gemini API) =====

/**
 * Converts the browser's raw audio data (usually 44.1kHz or 48kHz) 
 * to the 16kHz, 16-bit Mono format required by the Gemini Live API.
 * @param {Float32Array} buffer - The audio buffer from the microphone.
 * @param {number} inputSampleRate - The sample rate of the input buffer.
 * @param {number} outputSampleRate - The required output sample rate (16000).
 * @returns {Int16Array} The resampled and encoded buffer.
 */
function resampleAndEncode(buffer, inputSampleRate, outputSampleRate) {
  const ratio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Int16Array(newLength);
  
  let offset = 0;
  for (let i = 0; i < newLength; i++) {
    // Simple linear interpolation
    const index = i * ratio;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
    const val = (buffer[lower] * (1 - weight) + buffer[upper] * weight) * 32767;
    result[i] = Math.max(-32768, Math.min(32767, val));
    offset += 1;
  }
  return result;
}

// ===== WebSocket and Control Logic =====

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
  micToggleBtn.className = 'mic-toggle-btn ' + (className || '');
}

async function connectGeminiLive() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    logMessage("ERROR: Please update GEMINI_API_KEY in app.js.", "ai");
    return;
  }

  updateMicStatus("Connecting...", "connecting");

  websocket = new WebSocket(GEMINI_LIVE_WS_URL);

  websocket.onopen = () => {
    console.log("WebSocket connected. Sending configuration.");
    // 1. Send initial configuration
    const configMessage = {
      content: {
        parts: [{ 
          text: "You are a helpful and concise AI voice assistant for Voigen.ai, a small business automation platform. Keep answers short and direct."
        }],
        role: "user"
      },
      // Configure audio input/output
      config: {
        audio_config: {
          input_audio_config: {
            sample_rate_hertz: AUDIO_SAMPLE_RATE,
          },
          output_audio_config: {
            sample_rate_hertz: 24000, // AI audio output standard rate
          },
        },
        response_mime_type: "audio/pcm;rate=24000",
      },
      // You must send an empty text part to start the conversation
      // and enable the bi-directional stream.
      text: "", 
    };
    websocket.send(JSON.stringify(configMessage));
    updateMicStatus("Ready. Click to Talk.", "");
  };

  websocket.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data);
      if (response.error) {
        throw new Error(response.error.message || "Unknown API Error");
      }

      const audioPart = response.serverContent.audio_content;
      const textPart = response.serverContent.text;
      
      if (textPart) {
        logMessage(textPart, "ai");
      }

      if (audioPart) {
        // Decode and queue the audio chunk
        const audioData = new Uint8Array(atob(audioPart).split('').map(char => char.charCodeAt(0))).buffer;
        audioQueue.push(audioData);
        if (!isPlaying) {
          playAudioFromQueue();
        }
      }

      // Check for end of conversation (if AI finished responding)
      if (response.serverContent.end_of_turn) {
        // When AI stops, we are ready for the user to speak again
        isSpeaking = false;
        updateMicStatus("Ready. Click to Talk.", "");
      }
      
    } catch (e) {
      console.error("Gemini message error:", e);
      logMessage(`Error processing response: ${e.message}`, "ai");
      stopConversation();
    }
  };

  websocket.onclose = () => {
    console.log("WebSocket disconnected.");
    if (isRecording) stopRecording();
    updateMicStatus("Disconnected. Re-open to try again.", "");
  };

  websocket.onerror = (error) => {
    console.error("WebSocket error:", error);
    logMessage("Connection Error. Check console.", "ai");
    stopConversation();
  };
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
  updateMicStatus("Disconnected. Re-open to try again.", "");
}


// ===== Audio Playback Logic =====

function playAudioFromQueue() {
  if (isPlaying || audioQueue.length === 0) return;
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  isSpeaking = true;
  isPlaying = true;
  updateMicStatus("AI is Speaking...", "speaking");

  const chunk = audioQueue.shift();
  
  // The audio data from Gemini is 16-bit PCM (buffer size: bytes)
  // We need to convert it into a format that AudioContext can play (Float32Array)
  const float32Array = new Float32Array(chunk.byteLength / 2); // 2 bytes per 16-bit sample
  const int16Array = new Int16Array(chunk);
  
  for (let i = 0; i < int16Array.length; i++) {
    // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
    float32Array[i] = int16Array[i] / 32768; 
  }

  // Create an AudioBuffer
  const buffer = audioContext.createBuffer(1, float32Array.length, 24000); // 24000Hz rate from config
  buffer.getChannelData(0).set(float32Array);

  // Create a source node
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);

  source.onended = () => {
    isPlaying = false;
    if (audioQueue.length > 0) {
      playAudioFromQueue(); // Play next chunk
    } else {
      // Finished playing all queued audio
      isSpeaking = false;
      updateMicStatus(isRecording ? "Recording..." : "Ready. Click to Talk.", isRecording ? "recording" : "");
    }
  };
  
  source.start(0);
}


// ===== Recording Logic =====

async function startRecording() {
  if (isRecording || isSpeaking || !websocket || websocket.readyState !== WebSocket.OPEN) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create an AudioContext and a ScriptProcessor to capture raw audio chunks
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const inputSampleRate = audioContext.sampleRate;
    const source = audioContext.createMediaStreamSource(stream);
    
    // Using AudioWorklet is better, but ScriptProcessorNode is simpler for a single file demo
    const bufferSize = 4096;
    const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    processor.onaudioprocess = (e) => {
      if (!isRecording || websocket.readyState !== WebSocket.OPEN) return;

      const inputBuffer = e.inputBuffer.getChannelData(0);
      
      // Resample and encode to 16kHz Int16
      const encodedData = resampleAndEncode(inputBuffer, inputSampleRate, AUDIO_SAMPLE_RATE);
      
      // Send the raw binary array buffer to the WebSocket
      websocket.send(encodedData.buffer);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    // Store stream reference to stop it later
    mediaRecorder = { stream, processor, source }; 

    isRecording = true;
    updateMicStatus("Recording...", "recording");
    logMessage("User: Started speaking...", "user");

    // Tell Gemini the user has started speaking (optional, but good practice)
    websocket.send(JSON.stringify({
      config: { 
        audio_config: { 
          input_audio_config: { 
            start_of_turn: true 
          } 
        } 
      }
    }));
    
  } catch (err) {
    console.error('Error accessing microphone:', err);
    logMessage('Error: Could not access microphone. Please ensure permissions are granted.', 'ai');
    stopConversation();
  }
}

function stopRecording() {
  if (!isRecording) return;
  
  if (mediaRecorder) {
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    mediaRecorder.processor.disconnect();
    mediaRecorder.source.disconnect();
    mediaRecorder = null;
  }
  
  isRecording = false;
  // Let the AI speak before updating status
  if (!isSpeaking) {
     updateMicStatus("Processing...", "speaking");
  } else {
     updateMicStatus("AI is Speaking...", "speaking");
  }
  
  // Tell Gemini the user has stopped speaking
  websocket.send(JSON.stringify({
    config: { 
      audio_config: { 
        input_audio_config: { 
          end_of_turn: true 
        } 
      } 
    }
  }));
}


// ===== DOM Initialization and Event Handlers =====
document.addEventListener('DOMContentLoaded', () => {
  // Existing Navigation Logic... (omitted for brevity)
  
  const talkModal = document.getElementById('talkModal');
  const talkNowBtn = document.getElementById('talkNowBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const micToggleBtn = document.getElementById('micToggleBtn');
  
  // Show the Modal and establish WebSocket connection
  talkNowBtn.addEventListener('click', () => {
    talkModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    connectGeminiLive();
  });

  // Hide the Modal and close WebSocket connection
  closeModalBtn.addEventListener('click', () => {
    talkModal.classList.remove('active');
    document.body.style.overflow = '';
    stopConversation();
  });
  
  // Toggle Mic on Click
  micToggleBtn.addEventListener('click', () => {
    if (isSpeaking) {
      logMessage("Please wait for the AI to finish speaking.", "ai");
      return;
    }
    
    if (isRecording) {
      stopRecording();
      logMessage("User: Stop talking. Waiting for AI response...", "user");
    } else if (websocket && websocket.readyState === WebSocket.OPEN) {
      startRecording();
    } else {
      // Reconnect if somehow disconnected
      connectGeminiLive(); 
    }
  });

  // --- Start of Existing App.js Logic ---

  // Navigation elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // ===== Navbar Scroll Effect =====
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ===== Mobile Menu Toggle =====
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // ===== Smooth Scrolling for Navigation Links =====
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close mobile menu if open
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      // Get target section
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active link
        updateActiveLink(link);
      }
    });
  });
  
  // ===== Update Active Navigation Link on Scroll =====
  const sections = document.querySelectorAll('.section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }
  
  // ===== Tally Form Integration =====
  if (typeof Tally !== 'undefined') {
    Tally.loadEmbeds();
  }
  
  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe feature cards and other elements
  const animatedElements = document.querySelectorAll('.feature-card, .about-feature, .contact-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // ===== Smooth Scroll for All Internal Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  
  // ===== Console Welcome Message =====
  console.log('%c🚀 Welcome to Voigen.ai!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cInterested in our AI automation solutions? Contact us at hello@voigen.ai', 'color: #818cf8; font-size: 14px;');
  
});

// ===== Prevent Form Resubmission on Page Reload =====
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}