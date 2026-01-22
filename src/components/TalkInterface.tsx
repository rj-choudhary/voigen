'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export default function TalkInterface() {
  const [isActive, setIsActive] = useState(false);
  const [callStatus, setCallStatus] = useState("Ready to connect...");

  // Global variables to match original static version exactly
  const isRecordingRef = useRef(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const BACKEND_URL = "wss://voigen-backend-1008374989342.asia-south1.run.app";

  // Helper functions - exactly as in original
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(i * 2, s, true);
    }
    return buffer;
  };

  const stopAiAudio = () => {
    console.log("!!! Interrupting AI Audio !!!");
    audioQueueRef.current = [];
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {}
      currentSourceRef.current = null;
    }
    isPlayingRef.current = false;
    hideAISpeaking();
  };

  const showAISpeaking = () => {
    const aiWavesInline = document.querySelector('.ai-waves');
    if (aiWavesInline) aiWavesInline.classList.add('active');
  };

  const hideAISpeaking = () => {
    const aiWavesInline = document.querySelector('.ai-waves');
    if (aiWavesInline) aiWavesInline.classList.remove('active');
  };

  const showUserSpeaking = () => {
    const userWavesInline = document.querySelector('.user-waves');
    if (userWavesInline) userWavesInline.classList.add('active');
  };

  const hideUserSpeaking = () => {
    const userWavesInline = document.querySelector('.user-waves');
    if (userWavesInline) userWavesInline.classList.remove('active');
  };

  const playAudioFromQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      hideAISpeaking();
      return;
    }
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    isPlayingRef.current = true;
    showAISpeaking();
    
    const chunk = audioQueueRef.current.shift();
    const int16Array = new Int16Array(chunk!);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) float32Array[i] = int16Array[i] / 32768; 

    const buffer = audioContextRef.current.createBuffer(1, float32Array.length, 24000); 
    buffer.getChannelData(0).set(float32Array);

    const source = audioContextRef.current.createBufferSource();
    currentSourceRef.current = source;
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);

    source.onended = () => {
      currentSourceRef.current = null;
      if (audioQueueRef.current.length > 0) {
        playAudioFromQueue();
      } else {
        isPlayingRef.current = false;
        hideAISpeaking();
      }
    };
    
    source.start(0);
  };

  const connectToBackend = async () => {
    setCallStatus("Connecting...");

    try {
      const ws = new WebSocket(BACKEND_URL);
      websocketRef.current = ws;
      
      ws.onopen = () => {
        console.log("Connected to Backend");
        setCallStatus("Connected! Start speaking...");
        startRecording();
      };

      ws.onmessage = async (event) => {
        try {
          let response = JSON.parse(event.data instanceof Blob ? await event.data.text() : event.data);

          if (response.serverContent && response.serverContent.interrupted) {
            stopAiAudio();
            hideAISpeaking();
            return;
          }

          if (response.serverContent && response.serverContent.modelTurn) {
            const parts = response.serverContent.modelTurn.parts;
            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith("audio/")) {
                const binaryString = window.atob(part.inlineData.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                
                audioQueueRef.current.push(bytes.buffer);
                if (!isPlayingRef.current) playAudioFromQueue();
              }
            }
          }
        } catch (e) {
          console.error("Error processing message:", e);
        }
      };

      ws.onclose = () => {
        stopRecording();
        setCallStatus("Disconnected");
        hideAISpeaking();
        hideUserSpeaking();
      };

    } catch (error) {
      console.error("Connection failed:", error);
      setCallStatus("Connection failed");
    }
  };

  const startRecording = async () => {
    if (isRecordingRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      currentStreamRef.current = stream;

      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        const volume = Math.max(...inputData);
        if (volume > 0.15) {
          if (isPlayingRef.current) { 
            stopAiAudio();
            hideAISpeaking();
          }
          showUserSpeaking();
        } else {
          hideUserSpeaking();
        }

        const pcm16 = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcm16);

        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({
            realtime_input: {
              media_chunks: [{ mime_type: "audio/pcm", data: base64Audio }]
            }
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      isRecordingRef.current = true;
      setCallStatus("Listening...");

    } catch (err) {
      console.error("Mic Error:", err);
      setCallStatus("Microphone error");
    }
  };

  const stopRecording = () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
    }
    isRecordingRef.current = false;
    hideUserSpeaking();
  };

  const handleTalkNow = () => {
    // Google Analytics event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'talk_now_click', {
        event_category: 'engagement',
        event_label: 'Talk Now Button'
      });
    }
    
    setIsActive(true);
    setCallStatus("Connecting...");
    connectToBackend();
  };

  const handleEndCall = () => {
    stopRecording();
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    setIsActive(false);
    hideAISpeaking();
    hideUserSpeaking();
    setCallStatus("Ready to connect...");
  };

  return (
    <>
      {!isActive ? (
        <button onClick={handleTalkNow} className="btn btn-primary talk-now-btn">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3.53-2.64 6.44-6.19 6.94l-.28.05c-.07.01-.15.01-.22.01s-.15 0-.22-.01l-.28-.05C6.34 17.44 3.7 14.53 3.7 11h-1.6c0 4.27 3.2 7.64 7.47 8.16V22h3v-2.84c4.27-.52 7.47-3.89 7.47-8.16h-1.6z"></path>
          </svg>
          Talk Now
        </button>
      ) : (
        <div className="inline-talk-interface active">
          <div className="talk-participants-inline">
            <div className="participant-inline">
              <div style={{ position: 'relative' }}>
                <div className="avatar-icon-inline ai-avatar">
                  <Image 
                    src="/assets/ai receptionist.jpg" 
                    alt="Eva AI Receptionist" 
                    width={70}
                    height={70}
                    className="ai-avatar-img"
                  />
                </div>
                <div className="sound-waves-inline ai-waves">
                  <div className="wave-inline wave-1"></div>
                  <div className="wave-inline wave-2"></div>
                  <div className="wave-inline wave-3"></div>
                  <div className="wave-inline wave-4"></div>
                </div>
              </div>
              <div className="participant-label-inline">Eva<br />(AI Receptionist)</div>
            </div>

            <div className="participant-inline">
              <div style={{ position: 'relative' }}>
                <div className="avatar-icon-inline user-avatar">
                  <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="sound-waves-inline user-waves">
                  <div className="wave-inline wave-1"></div>
                  <div className="wave-inline wave-2"></div>
                  <div className="wave-inline wave-3"></div>
                  <div className="wave-inline wave-4"></div>
                </div>
              </div>
              <div className="participant-label-inline">You</div>
            </div>
          </div>

          <div className="call-status-inline">{callStatus}</div>
          
          <button onClick={handleEndCall} className="end-call-btn-inline">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
            End Call
          </button>
        </div>
      )}
    </>
  );
}
