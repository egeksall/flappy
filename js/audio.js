// Web Audio API Synthesizer - Zero dependencies, 100% offline & iOS Safari compatible
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('flappy_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('flappy_muted', this.muted);
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }

    // Wing flap sound: soft cheerful ascending chirp
    playFlap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);

        // Haptic feedback if available
        if (navigator.vibrate) {
            try { navigator.vibrate(12); } catch (e) {}
        }
    }

    // Slingshot rubber band stretch sound
    playSlingshotStretch(ratio = 0.5) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const startFreq = 180 + ratio * 140;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.linearRampToValueAtTime(startFreq + 30, now + 0.05);

        gain.gain.setValueAtTime(0.08 + ratio * 0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);

        if (navigator.vibrate) {
            try { navigator.vibrate(6); } catch (e) {}
        }
    }

    // Slingshot release snap & launch whoosh
    playSlingshotLaunch() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Elastic snap twang
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);

        // 2. Air whoosh
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(240, now + 0.03);
        osc2.frequency.exponentialRampToValueAtTime(480, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.28);

        gain2.gain.setValueAtTime(0.25, now + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc2.start(now + 0.03);
        osc2.stop(now + 0.3);

        if (navigator.vibrate) {
            try { navigator.vibrate([20, 15, 30]); } catch (e) {}
        }
    }

    // Soft landing thud on ground
    playLand() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);

        if (navigator.vibrate) {
            try { navigator.vibrate(25); } catch (e) {}
        }
    }

    // Point scored: bright arcade coin chime
    playScore() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Tone 1
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(784, now); // G5
        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // Tone 2 (High chime)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.5, now + 0.08); // C6
        gain2.gain.setValueAtTime(0.32, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.3);

        if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (e) {}
        }
    }

    // Pipe hit impact
    playHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);

        if (navigator.vibrate) {
            try { navigator.vibrate([40, 30, 60]); } catch (e) {}
        }
    }

    // Fall to ground thud
    playDie() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
    }

    // UI Click sound
    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // Celebratory fanfare for new high score / medal
    playFanfare() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const start = this.ctx.currentTime + idx * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === 3 ? 0.45 : 0.18));

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + (idx === 3 ? 0.5 : 0.2));
        });
    }
    // 🪟 Glass Shatter sound (sharp crystalline tinkle & high crack)
    playGlassBreak() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [1800, 2400, 3100, 4200];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.02);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.15 + idx * 0.04);

            gain.gain.setValueAtTime(0.3, now + idx * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.02);
            osc.stop(now + 0.24);
        });

        if (navigator.vibrate) {
            try { navigator.vibrate([15, 20, 35]); } catch (e) {}
        }
    }

    // 🪵 Wood Splinter sound (loud crunching crack & splinter snap)
    playWoodBreak() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Low crack
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(260, now);
        osc1.frequency.exponentialRampToValueAtTime(70, now + 0.18);
        gain1.gain.setValueAtTime(0.45, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.2);

        // Splinter snap
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(620, now + 0.03);
        osc2.frequency.exponentialRampToValueAtTime(120, now + 0.15);
        gain2.gain.setValueAtTime(0.3, now + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + 0.03);
        osc2.stop(now + 0.19);

        if (navigator.vibrate) {
            try { navigator.vibrate([30, 20, 45]); } catch (e) {}
        }
    }

    // 🪨 Stone Smash sound (deep rubble rumble & heavy stone crash)
    playStoneBreak() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Sub rumble
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.28);
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.32);

        // Heavy rock thud
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(90, now);
        osc2.frequency.exponentialRampToValueAtTime(25, now + 0.22);
        gain2.gain.setValueAtTime(0.4, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.25);

        if (navigator.vibrate) {
            try { navigator.vibrate([40, 25, 60]); } catch (e) {}
        }
    }

    // Solid collision impact (when hitting incompatible material)
    playSolidImpact() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);

        if (navigator.vibrate) {
            try { navigator.vibrate([50, 40, 50]); } catch (e) {}
        }
    }

    // 🌟 Surprise Bird Transformation (magical fanfare arpeggio + shimmer chime)
    playTransformation() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = now + idx * 0.055;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, noteStart + 0.18);

            gain.gain.setValueAtTime(0.25, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.25);
        });

        // Magical sparkle shimmer
        const shimmerOsc = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmerOsc.type = 'triangle';
        shimmerOsc.frequency.setValueAtTime(800, now);
        shimmerOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.32);
        shimmerGain.gain.setValueAtTime(0.18, now);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.ctx.destination);
        shimmerOsc.start(now);
        shimmerOsc.stop(now + 0.36);

        if (navigator.vibrate) {
            try { navigator.vibrate([30, 20, 40, 20, 60]); } catch (e) {}
        }
    }

    // Dragon Grab sound: warm gentle air whoosh
    playDragonGrab() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Dragon Evolve sound: majestic ascending triad with flame roar burst
    playDragonEvolve() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chord = [220, 277.18, 329.63, 440, 554.37, 659.25]; // A major triumphant chord
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t0 = now + idx * 0.05;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t0);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.04, t0 + 0.3);

            gain.gain.setValueAtTime(0.2, t0);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.36);
        });

        // Roaring flame resonance
        const roar = this.ctx.createOscillator();
        const roarGain = this.ctx.createGain();
        roar.type = 'sawtooth';
        roar.frequency.setValueAtTime(90, now + 0.1);
        roar.frequency.linearRampToValueAtTime(140, now + 0.35);
        roar.frequency.exponentialRampToValueAtTime(50, now + 0.6);

        roarGain.gain.setValueAtTime(0.15, now + 0.1);
        roarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        roar.connect(roarGain);
        roarGain.connect(this.ctx.destination);
        roar.start(now + 0.1);
        roar.stop(now + 0.66);

        if (navigator.vibrate) {
            try { navigator.vibrate([40, 30, 80]); } catch (e) {}
        }
    }

    // 💥 Fireball attack blast sound (customized for Baby, Teen, and Mature)
    playFireball(stageIndex = 0) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        if (stageIndex === 0) {
            // Baby: crisp cute fiery pop & whoosh
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.19);
        } else if (stageIndex === 1) {
            // Teen: crackling flame whoosh & roaring sweep
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(280, now);
            osc1.frequency.exponentialRampToValueAtTime(540, now + 0.08);
            osc1.frequency.exponentialRampToValueAtTime(90, now + 0.28);

            gain1.gain.setValueAtTime(0.38, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.31);
        } else {
            // Mature: deep roaring inferno detonation & heavy boom
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(160, now);
            osc1.frequency.linearRampToValueAtTime(320, now + 0.08);
            osc1.frequency.exponentialRampToValueAtTime(40, now + 0.42);

            gain1.gain.setValueAtTime(0.5, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.46);

            // Sub rumble
            const sub = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            sub.type = 'triangle';
            sub.frequency.setValueAtTime(80, now);
            sub.frequency.exponentialRampToValueAtTime(25, now + 0.38);

            subGain.gain.setValueAtTime(0.4, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            sub.connect(subGain);
            subGain.connect(this.ctx.destination);
            sub.start(now);
            sub.stop(now + 0.41);
        }

        if (navigator.vibrate) {
            try { navigator.vibrate(stageIndex === 2 ? [30, 20, 50] : [20]); } catch (e) {}
        }
    }
}

window.soundManager = new SoundManager();
