class AudioSynth {
  constructor() {
    if (window.__audio_synth_instance__) {
      const oldInstance = window.__audio_synth_instance__;
      console.log("[AudioSynth] Reusing existing singleton instance.");
      
      // Stop old synthesized drone nodes if they exist
      if (Array.isArray(oldInstance.droneNodes)) {
        oldInstance.droneNodes.forEach(node => {
          try { node.osc.stop(); } catch (e) {}
          try { node.osc.disconnect(); } catch (e) {}
          try { node.gain.disconnect(); } catch (e) {}
        });
        oldInstance.droneNodes = [];
      }
      
      // Update prototype to the new class to inherit new methods
      Object.setPrototypeOf(oldInstance, AudioSynth.prototype);
      return oldInstance;
    }
    
    this.ctx = null;
    this.audio = null;
    this.audioSource = null;
    this.musicGain = null;
    this.masterGain = null;
    this.delayNode = null;
    this.isPlaying = false;
    this.chimeTimeout = null;
    this.pentatonic = [164.81, 220.00, 246.94, 329.63, 440.00, 493.88, 659.25, 783.99, 987.77]; // E3, A3, B3, E4, A4, B4, E5, G5, B5
    this.droneNodes = []; // Kept for compatibility
    
    if (!window.__all_audio_elements__) {
      window.__all_audio_elements__ = [];
    }
    
    window.__audio_synth_instance__ = this;
    console.log("[AudioSynth] New instance constructed.");
  }

  stopAllAudioElements() {
    if (window.__all_audio_elements__) {
      console.log(`[AudioSynth] Stopping all tracked audio elements (count: ${window.__all_audio_elements__.length})`);
      window.__all_audio_elements__.forEach((audio, idx) => {
        try {
          audio.pause();
          console.log(`[AudioSynth] Paused audio element #${idx}`);
        } catch (e) {
          console.error(`[AudioSynth] Error pausing audio element #${idx}:`, e);
        }
      });
    }
  }

  init() {
    if (this.ctx) return;

    console.log("[AudioSynth] Initializing Web Audio Context & nodes...");

    if (window.__audio_context__) {
      console.log("[AudioSynth] Restoring context from window globals.");
      this.ctx = window.__audio_context__;
      this.masterGain = window.__master_gain__;
      this.delayNode = window.__delay_node__;
      this.delayFeedback = window.__delay_feedback__;
      this.audio = window.__audio_element__;
      this.audioSource = window.__audio_source__;
      this.musicGain = window.__music_gain__;

      // Ensure the src of the audio element is pointing to the correct music file
      if (this.audio) {
        const currentSrc = window.location.origin + '/Codex Over Observatory.mp3';
        if (this.audio.src !== currentSrc) {
          try {
            this.audio.pause();
          } catch (e) {}
          this.audio.src = '/Codex Over Observatory.mp3';
          this.audio.load();
        }
        this.audio.volume = 0.48;
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    window.__audio_context__ = this.ctx;
    
    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    window.__master_gain__ = this.masterGain;
    
    // Delay/Echo Effect
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayFeedback = this.ctx.createGain();
    window.__delay_node__ = this.delayNode;
    window.__delay_feedback__ = this.delayFeedback;
    
    this.delayNode.delayTime.setValueAtTime(0.65, this.ctx.currentTime);
    this.delayFeedback.gain.setValueAtTime(0.42, this.ctx.currentTime);
    
    // Connect delay loop
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    
    // Connect dry path (masterGain goes to output directly, NOT to delayNode)
    this.masterGain.connect(this.ctx.destination);
    
    // Connect wet path (delayNode goes to destination)
    this.delayNode.connect(this.ctx.destination);

    // Initialize MP3 Background Music (Codex Over Observatory)
    console.log("[AudioSynth] Creating new background Audio object.");
    this.audio = new Audio('/Codex Over Observatory.mp3');
    this.audio.volume = 0.48;
    this.audio.loop = true;
    window.__audio_element__ = this.audio;
    
    if (window.__all_audio_elements__) {
      window.__all_audio_elements__.push(this.audio);
    }
    
    this.audioSource = this.ctx.createMediaElementSource(this.audio);
    window.__audio_source__ = this.audioSource;
    
    // Dedicated Gain for Background Music to make it audible and ambient
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.48, this.ctx.currentTime);
    window.__music_gain__ = this.musicGain;
    
    // Route: Audio Source -> Music Gain -> Master Gain
    this.audioSource.connect(this.musicGain);
    this.musicGain.connect(this.masterGain);
  }

  startDrone() {
    console.log("[AudioSynth] startDrone() called.");
    this.init();
    if (this.isPlaying) {
      console.log("[AudioSynth] Already playing, skipping start.");
      return;
    }
    this.isPlaying = true;

    if (this.ctx.state === 'suspended') {
      console.log("[AudioSynth] Resuming suspended AudioContext.");
      this.ctx.resume();
    }

    // Stop any other stray audio elements before starting
    this.stopAllAudioElements();

    // Fade in master gain slowly to avoid pops and transitions
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 3.0);

    // Play the background loop
    if (this.audio) {
      console.log("[AudioSynth] Playing background loop...");
      this.audio.play().catch(err => {
        console.warn("[AudioSynth] Audio playback delayed until user interaction:", err);
      });
    }
  }

  stopDrone() {
    console.log("[AudioSynth] stopDrone() called.");
    if (!this.isPlaying) {
      console.log("[AudioSynth] Already stopped or not playing.");
      return;
    }
    this.isPlaying = false;

    if (this.chimeTimeout) {
      clearTimeout(this.chimeTimeout);
      this.chimeTimeout = null;
    }

    if (this.masterGain) {
      console.log("[AudioSynth] Fading out master gain.");
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
    }

    setTimeout(() => {
      if (!this.isPlaying) {
        console.log("[AudioSynth] Suspending context and pausing all audio elements.");
        this.stopAllAudioElements();
        if (this.ctx && this.ctx.state !== 'closed') {
          this.ctx.suspend();
        }
      }
    }, 1300);
  }

  triggerChime(freq) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const frequency = freq || this.pentatonic[Math.floor(Math.random() * this.pentatonic.length)];
    console.log(`[AudioSynth] Triggering chime at frequency: ${frequency}Hz`);
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Formant filter to add guitar-like resonance
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 1.3, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    
    gain.connect(this.masterGain);
    if (this.delayNode) {
      gain.connect(this.delayNode);
    }

    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);
  }
}

export const audioSynth = new AudioSynth();
export default audioSynth;
