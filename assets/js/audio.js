// audio.js

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.soundUrl = '/assets/click.wav';
    this.init();
  }

  async init() {
    // We bind to user interaction to initialize the Web Audio API due to browser autoplay restrictions
    const initAudioContext = () => {
      if (this.audioContext) return;
      
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.loadSound();
      }
      
      // Remove listeners once context is initiated
      window.removeEventListener('click', initAudioContext);
      window.removeEventListener('touchstart', initAudioContext);
    };

    window.addEventListener('click', initAudioContext);
    window.addEventListener('touchstart', initAudioContext);

    // Global click listener to trigger click sounds
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], .pricing-toggle-btn, .testimonial-arrow, .services-header, .form-checkbox-label');
      if (target) {
        this.playClick();
      }
    });
  }

  async loadSound() {
    try {
      const response = await fetch(this.soundUrl);
      const arrayBuffer = await response.arrayBuffer();
      if (this.audioContext) {
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (err) {
      console.warn('Failed to load click sound:', err);
    }
  }

  playClick() {
    // If Web Audio API loaded successfully, use it for zero-latency playback
    if (this.audioContext && this.audioBuffer) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      
      // Add gain node to control volume
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.35; // Adjust click volume
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
    } else {
      // Fallback to standard Audio element if Web Audio API buffer is not ready yet
      const fallbackAudio = new Audio(this.soundUrl);
      fallbackAudio.volume = 0.35;
      fallbackAudio.play().catch(() => {});
    }
  }
}

// Instantiate globally
window.audioManager = new AudioManager();
