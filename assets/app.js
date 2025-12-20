// ===== Configuration =====
const BACKEND_URL = "wss://voigen-backend-1008374989342.asia-south1.run.app"; 
// ==========================

let isRecording = false;
let websocket = null;
let audioContext = null;
let audioQueue = [];
let isPlaying = false;
let currentStream = null;
let currentSource = null; // IMPORTANT: Reference to the active sound being played

// ===== Helper Functions =====

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
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

// CRITICAL: This function kills the AI's current sentence immediately
function stopAiAudio() {
  console.log("!!! Interrupting AI Audio !!!");
  audioQueue = []; 
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource = null;
  }
  isPlaying = false;
}

// ===== WebSocket Connection Logic =====

async function connectToBackend() {
  updateCallStatus("Connecting...");
  updateCallStatusInline("Connecting...");

  try {
    websocket = new WebSocket(BACKEND_URL);
    
    websocket.onopen = () => {
      console.log("Connected to Backend");
      updateCallStatus("Connected! Start speaking...");
      updateCallStatusInline("Connected! Start speaking...");
      // Auto-start recording when connected
      startRecording();
    };

    websocket.onmessage = async (event) => {
      try {
        let response = JSON.parse(event.data instanceof Blob ? await event.data.text() : event.data);

        // 1. LISTEN FOR INTERRUPTION SIGNAL FROM GEMINI
        // Gemini sends this when it detects the user speaking over the AI
        if (response.serverContent && response.serverContent.interrupted) {
          stopAiAudio();
          hideAISpeaking();
          return;
        }

        // 2. PROCESS AI AUDIO CHUNKS
        if (response.serverContent && response.serverContent.modelTurn) {
          const parts = response.serverContent.modelTurn.parts;
          for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith("audio/")) {
              const binaryString = window.atob(part.inlineData.data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
              
              audioQueue.push(bytes.buffer);
              if (!isPlaying) playAudioFromQueue();
            }
          }
        }
      } catch (e) {
        console.error("Error processing message:", e);
      }
    };

    websocket.onclose = () => {
      stopRecording();
      updateCallStatus("Disconnected");
      updateCallStatusInline("Disconnected");
      hideAISpeaking();
      hideUserSpeaking();
    };
  } catch (error) {
    console.error("Connection failed:", error);
    updateCallStatus("Connection failed");
    updateCallStatusInline("Connection failed");
  }
}

// ===== Audio Playback Logic =====

function playAudioFromQueue() {
  if (audioQueue.length === 0) {
    isPlaying = false;
    hideAISpeaking();
    return;
  }
  
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });

  isPlaying = true;
  showAISpeaking(); // Show AI speaking animation
  
  const chunk = audioQueue.shift();
  const int16Array = new Int16Array(chunk);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) float32Array[i] = int16Array[i] / 32768; 

  const buffer = audioContext.createBuffer(1, float32Array.length, 24000); 
  buffer.getChannelData(0).set(float32Array);

  const source = audioContext.createBufferSource();
  currentSource = source; // Store for interruption
  source.buffer = buffer;
  source.connect(audioContext.destination);

  source.onended = () => {
    currentSource = null;
    if (audioQueue.length > 0) {
      playAudioFromQueue();
    } else {
      isPlaying = false;
      hideAISpeaking();
    }
  };
  
  source.start(0);
}

// ===== Recording Logic (The "Always Listening" Fix) =====

async function startRecording() {
  if (isRecording) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    currentStream = stream;

    if (!audioContext) audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Simple Client-side VAD: If user is loud, stop AI and show user speaking
      const volume = Math.max(...inputData);
      if (volume > 0.15) {
        if (isPlaying) { 
          stopAiAudio();
          hideAISpeaking();
        }
        showUserSpeaking();
      } else {
        hideUserSpeaking();
      }

      const pcm16 = floatTo16BitPCM(inputData);
      const base64Audio = arrayBufferToBase64(pcm16);

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          realtime_input: {
            media_chunks: [{ mime_type: "audio/pcm", data: base64Audio }]
          }
        }));
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    isRecording = true;
    updateCallStatus("Listening...");
    updateCallStatusInline("Listening...");

  } catch (err) {
    console.error("Mic Error:", err);
    updateCallStatus("Microphone error");
    updateCallStatusInline("Microphone error");
  }
}

function stopRecording() {
  if (currentStream) currentStream.getTracks().forEach(track => track.stop());
  isRecording = false;
  hideUserSpeaking();
}

// ===== UI Logic =====

document.addEventListener('DOMContentLoaded', () => {
  const talkNowBtn = document.getElementById('talkNowBtn');
  const endCallBtnInline = document.getElementById('endCallBtnInline');
  const endCallBtn = document.getElementById('endCallBtn'); // Keep for backward compatibility
  
  if (talkNowBtn) {
    talkNowBtn.addEventListener('click', () => {
      // Hide the Talk Now button
      talkNowBtn.style.display = 'none';
      
      // Show the inline talk interface
      const inlineTalkInterface = document.getElementById('inlineTalkInterface');
      if (inlineTalkInterface) {
        inlineTalkInterface.style.display = 'flex'; // Override inline style
        inlineTalkInterface.classList.add('active');
        updateCallStatusInline("Connecting...");
        connectToBackend();
      }
    });
  }

  // Handle inline end call button
  if (endCallBtnInline) {
    endCallBtnInline.addEventListener('click', () => {
      endCall();
    });
  }

  // Keep backward compatibility for full-screen interface
  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      endCall();
    });
  }
});

function updateCallStatus(status) {
  const callStatusElement = document.getElementById('callStatus');
  if (callStatusElement) {
    callStatusElement.textContent = status;
  }
}

function updateCallStatusInline(status) {
  const callStatusInlineElement = document.getElementById('callStatusInline');
  if (callStatusInlineElement) {
    callStatusInlineElement.textContent = status;
  }
}

function showAISpeaking() {
  // Handle inline interface
  const aiParticipantInline = document.querySelector('.participant-inline.ai-participant');
  const aiWavesInline = document.querySelector('.participant-inline.ai-participant .sound-waves-inline');
  
  if (aiParticipantInline) aiParticipantInline.classList.add('speaking');
  if (aiWavesInline) aiWavesInline.classList.add('active');
  
  // Keep backward compatibility for full-screen interface
  const aiParticipant = document.querySelector('.ai-participant');
  const aiWaves = document.querySelector('.ai-waves');
  
  if (aiParticipant) aiParticipant.classList.add('speaking');
  if (aiWaves) aiWaves.classList.add('active');
}

function hideAISpeaking() {
  // Handle inline interface
  const aiParticipantInline = document.querySelector('.participant-inline.ai-participant');
  const aiWavesInline = document.querySelector('.participant-inline.ai-participant .sound-waves-inline');
  
  if (aiParticipantInline) aiParticipantInline.classList.remove('speaking');
  if (aiWavesInline) aiWavesInline.classList.remove('active');
  
  // Keep backward compatibility for full-screen interface
  const aiParticipant = document.querySelector('.ai-participant');
  const aiWaves = document.querySelector('.ai-waves');
  
  if (aiParticipant) aiParticipant.classList.remove('speaking');
  if (aiWaves) aiWaves.classList.remove('active');
}

function showUserSpeaking() {
  // Handle inline interface
  const userParticipantInline = document.querySelector('.participant-inline.user-participant');
  const userWavesInline = document.querySelector('.participant-inline.user-participant .sound-waves-inline');
  
  if (userParticipantInline) userParticipantInline.classList.add('speaking');
  if (userWavesInline) userWavesInline.classList.add('active');
  
  // Keep backward compatibility for full-screen interface
  const userParticipant = document.querySelector('.user-participant');
  const userWaves = document.querySelector('.user-waves');
  
  if (userParticipant) userParticipant.classList.add('speaking');
  if (userWaves) userWaves.classList.add('active');
}

function hideUserSpeaking() {
  // Handle inline interface
  const userParticipantInline = document.querySelector('.participant-inline.user-participant');
  const userWavesInline = document.querySelector('.participant-inline.user-participant .sound-waves-inline');
  
  if (userParticipantInline) userParticipantInline.classList.remove('speaking');
  if (userWavesInline) userWavesInline.classList.remove('active');
  
  // Keep backward compatibility for full-screen interface
  const userParticipant = document.querySelector('.user-participant');
  const userWaves = document.querySelector('.user-waves');
  
  if (userParticipant) userParticipant.classList.remove('speaking');
  if (userWaves) userWaves.classList.remove('active');
}

function endCall() {
  // Stop recording and websocket
  stopRecording();
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  
  // Hide inline interface and show Talk Now button again
  const inlineTalkInterface = document.getElementById('inlineTalkInterface');
  const talkNowBtn = document.getElementById('talkNowBtn');
  
  if (inlineTalkInterface) {
    inlineTalkInterface.style.display = 'none'; // Hide with inline style
    inlineTalkInterface.classList.remove('active');
  }
  
  if (talkNowBtn) {
    talkNowBtn.style.display = 'flex'; // Show Talk Now button again
  }
  
  // Hide full-screen interface (backward compatibility)
  const talkInterface = document.getElementById('talkInterface');
  if (talkInterface) {
    talkInterface.classList.remove('active');
  }
  
  // Reset states
  hideAISpeaking();
  hideUserSpeaking();
  updateCallStatusInline("Ready to connect...");
  updateCallStatus("Ready to connect...");
}
