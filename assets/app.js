// ===== Smooth Scrolling Navigation =====
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Form elements
  const form = document.getElementById('lead-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  
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
  // The Tally form is embedded directly in the page
  // Tally handles all form submission, validation, and data storage
  // No additional JavaScript needed for form handling
  
  // Load Tally embeds when page is ready
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
  
  // ===== Voice Agent Integration =====
  const talkNowBtn = document.getElementById('talk-now-btn');
  const voiceModal = document.getElementById('voice-modal');
  const voiceModalClose = document.getElementById('voice-modal-close');
  const voiceAvatar = document.getElementById('voice-avatar');
  const voiceStatus = document.getElementById('voice-status');
  const voiceMessage = document.getElementById('voice-message');
  const audioVisualizer = document.getElementById('audio-visualizer');
  const muteBtn = document.getElementById('mute-btn');
  const endCallBtn = document.getElementById('end-call-btn');
  
  // LiveKit configuration - Replace with your actual values
  const LIVEKIT_CONFIG = {
    url: 'wss://voigen-ai-jbqmetnc.livekit.cloud', // Replace with your LiveKit server URL
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjYyODgzMzEsImlkZW50aXR5Ijoid2VidXNlciIsImlzcyI6IkFQSXk2eXZNTFZNOFpVciIsIm5iZiI6MTc2NTM4ODMzMSwic3ViIjoid2VidXNlciIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJ2b2lnZW5fYWlfbGl2ZSIsInJvb21Kb2luIjp0cnVlfX0.MikCkO-5CsWGf3VUS5RP2qK7xwgt-ufUVVRvesTTweE', // This should be generated server-side for production
    agentId: 'CA_KQEvtTQTKtyR' // Replace with your LiveKit agent ID
  };
  
  let room = null;
  let isConnected = false;
  let isMuted = false;
  let localAudioTrack = null;
  let remoteAudioTrack = null;
  
  // Voice Agent Manager
  class VoiceAgentManager {
    constructor() {
      this.room = null;
      this.isConnected = false;
      this.isMuted = false;
      this.localAudioTrack = null;
      this.remoteAudioTrack = null;
    }
    
    async connect() {
      try {
        this.updateUI('connecting', 'Connecting to AI Assistant...', 'Please wait while we establish the connection.');
        
        // Step 1: Wait for LiveKit to be available (with timeout)
        console.log('Step 1: Waiting for LiveKit availability...');
        await this.waitForLiveKit();
        console.log('✅ LiveKit Client SDK loaded successfully');
        
        // Step 2: Check if getUserMedia is supported
        console.log('Step 2: Checking browser media support...');
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support microphone access. Please use a modern browser.');
        }
        console.log('✅ Browser supports media devices');
        
        // Step 3: Request microphone permission FIRST
        console.log('Step 3: Requesting microphone permission...');
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('✅ Microphone permission granted');
        } catch (micError) {
          console.error('❌ Microphone permission denied:', micError);
          if (micError.name === 'NotAllowedError') {
            throw new Error('Microphone permission denied. Please allow microphone access and try again.');
          } else if (micError.name === 'NotFoundError') {
            throw new Error('No microphone found. Please connect a microphone and try again.');
          } else {
            throw new Error(`Microphone error: ${micError.message}`);
          }
        }
        
        // Step 4: Create room instance
        console.log('Step 4: Creating LiveKit room...');
        this.room = new LivekitClient.Room({
          adaptiveStream: true,
          dynacast: true,
        });
        console.log('✅ Room created');
        
        // Step 5: Set up event listeners
        console.log('Step 5: Setting up event listeners...');
        this.setupEventListeners();
        console.log('✅ Event listeners set up');
        
        // Step 6: Create local audio track
        console.log('Step 6: Creating local audio track...');
        this.localAudioTrack = await LivekitClient.createLocalAudioTrack({
          source: LivekitClient.Track.Source.Microphone,
        });
        console.log('✅ Local audio track created');
        
        // Step 7: Connect to LiveKit room
        console.log('Step 7: Connecting to LiveKit server...');
        console.log('Server URL:', LIVEKIT_CONFIG.url);
        console.log('Token (first 50 chars):', LIVEKIT_CONFIG.token.substring(0, 50) + '...');
        
        await this.room.connect(LIVEKIT_CONFIG.url, LIVEKIT_CONFIG.token, {
          autoSubscribe: true,
        });
        console.log('✅ Connected to LiveKit server');
        
        // Step 8: Publish local audio track
        console.log('Step 8: Publishing audio track...');
        await this.room.localParticipant.publishTrack(this.localAudioTrack);
        console.log('✅ Audio track published');
        
        // Step 9: Success!
        this.isConnected = true;
        this.updateUI('connected', 'Connected to AI Assistant', 'You can now speak with our AI assistant. The conversation is live!');
        this.startAudioVisualizer();
        
        console.log('🎉 Voice agent connection successful!');
        console.log('Agent ID:', LIVEKIT_CONFIG.agentId);
        console.log('Room participants:', this.room.participants ? this.room.participants.size : 0);
        
        // Clean up the test stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
      } catch (error) {
        console.error('❌ Voice agent connection failed at step:', error.message);
        console.error('Full error:', error);
        
        // Show specific error message
        let errorMessage = 'Connection failed. ';
        if (error.message.includes('microphone')) {
          errorMessage += error.message;
        } else if (error.message.includes('LiveKit')) {
          errorMessage += 'Please check your internet connection and try again.';
        } else {
          errorMessage += error.message || 'Please try again.';
        }
        
        this.updateUI('error', 'Connection Failed', errorMessage);
      }
    }
    
    setupEventListeners() {
      this.room.on(LivekitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === LivekitClient.Track.Kind.Audio) {
          this.remoteAudioTrack = track;
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
          audioElement.play();
          
          // Show speaking animation when receiving audio
          this.showSpeakingAnimation();
        }
      });
      
      this.room.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        if (track.kind === LivekitClient.Track.Kind.Audio) {
          track.detach();
          this.hideSpeakingAnimation();
        }
      });
      
      this.room.on(LivekitClient.RoomEvent.Disconnected, () => {
        this.cleanup();
      });
      
      this.room.on(LivekitClient.RoomEvent.ConnectionQualityChanged, (quality, participant) => {
        console.log('Connection quality:', quality);
      });
    }
    
    async toggleMute() {
      if (!this.localAudioTrack) return;
      
      this.isMuted = !this.isMuted;
      await this.localAudioTrack.setMuted(this.isMuted);
      
      muteBtn.classList.toggle('active', this.isMuted);
      muteBtn.innerHTML = this.isMuted ? '<span>🔊</span>Unmute' : '<span>🔇</span>Mute';
    }
    
    async disconnect() {
      if (this.room) {
        await this.room.disconnect();
      }
      this.cleanup();
    }
    
    cleanup() {
      this.isConnected = false;
      this.isMuted = false;
      
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack = null;
      }
      
      if (this.remoteAudioTrack) {
        this.remoteAudioTrack.detach();
        this.remoteAudioTrack = null;
      }
      
      this.room = null;
      this.stopAudioVisualizer();
      this.closeModal();
    }
    
    updateUI(state, status, message) {
      // Update button state
      talkNowBtn.className = `btn btn-voice ${state}`;
      
      const btnText = talkNowBtn.querySelector('.btn-text');
      switch(state) {
        case 'connecting':
          btnText.textContent = 'Connecting...';
          break;
        case 'connected':
          btnText.textContent = 'End Call';
          break;
        case 'error':
          btnText.textContent = 'Try Again';
          break;
        default:
          btnText.textContent = 'Talk Now';
      }
      
      // Update modal content
      voiceStatus.textContent = status;
      voiceMessage.textContent = message;
      
      // Show/hide controls based on state
      const controls = document.getElementById('voice-controls');
      if (state === 'connected') {
        controls.style.display = 'flex';
      } else {
        controls.style.display = 'none';
      }
    }
    
    showModal() {
      voiceModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
      voiceModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset UI
      this.updateUI('idle', 'Ready to Connect', 'Click "Talk Now" to start a conversation with our AI assistant.');
      muteBtn.classList.remove('active');
      muteBtn.innerHTML = '<span>🔇</span>Mute';
    }
    
    startAudioVisualizer() {
      audioVisualizer.classList.add('active');
    }
    
    stopAudioVisualizer() {
      audioVisualizer.classList.remove('active');
    }
    
    showSpeakingAnimation() {
      voiceAvatar.classList.add('speaking');
      setTimeout(() => {
        voiceAvatar.classList.remove('speaking');
      }, 2000);
    }
    
    hideSpeakingAnimation() {
      voiceAvatar.classList.remove('speaking');
    }
    
    // Wait for LiveKit to be available with timeout
    async waitForLiveKit(timeout = 10000) {
      const startTime = Date.now();
      
      while (typeof LivekitClient === 'undefined') {
        if (Date.now() - startTime > timeout) {
          throw new Error('LiveKit Client SDK failed to load within timeout period. Please check your internet connection.');
        }
        
        // Wait 100ms before checking again
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Additional check to ensure LiveKit is fully initialized
      if (!LivekitClient.Room || !LivekitClient.createLocalAudioTrack) {
        throw new Error('LiveKit Client SDK loaded but is not fully initialized. Please refresh the page and try again.');
      }
    }
  }
  
  // Initialize Voice Agent Manager
  const voiceAgent = new VoiceAgentManager();
  
  // Event Listeners
  talkNowBtn.addEventListener('click', async () => {
    if (!voiceAgent.isConnected) {
      // Show configuration warning if not set up
      if (LIVEKIT_CONFIG.url === 'YOUR_LIVEKIT_SERVER_URL') {
        alert('Please configure your LiveKit server URL and access token in the JavaScript file before using the voice agent feature.');
        return;
      }
      
      voiceAgent.showModal();
      await voiceAgent.connect();
    } else {
      await voiceAgent.disconnect();
    }
  });
  
  voiceModalClose.addEventListener('click', async () => {
    if (voiceAgent.isConnected) {
      await voiceAgent.disconnect();
    } else {
      voiceAgent.closeModal();
    }
  });
  
  muteBtn.addEventListener('click', () => {
    voiceAgent.toggleMute();
  });
  
  endCallBtn.addEventListener('click', async () => {
    await voiceAgent.disconnect();
  });
  
  // Close modal when clicking outside
  voiceModal.addEventListener('click', async (e) => {
    if (e.target === voiceModal) {
      if (voiceAgent.isConnected) {
        await voiceAgent.disconnect();
      } else {
        voiceAgent.closeModal();
      }
    }
  });
  
  // Handle browser tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && voiceAgent.isConnected) {
      // Optionally pause or handle when tab becomes hidden
      console.log('Tab hidden - voice call continues in background');
    }
  });
  
  // ===== Console Welcome Message =====
  console.log('%c🚀 Welcome to Voigen.ai!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cInterested in our AI automation solutions? Contact us at hello@voigen.ai', 'color: #818cf8; font-size: 14px;');
  console.log('%c🎤 Voice Agent Ready! Configure your LiveKit settings to enable voice chat.', 'color: #10b981; font-size: 14px;');
  
});

// ===== Prevent Form Resubmission on Page Reload =====
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
