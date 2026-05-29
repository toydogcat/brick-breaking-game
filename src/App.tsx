import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Zap, 
  Trophy, 
  Coins, 
  FastForward, 
  HelpCircle, 
  Grid, 
  Download, 
  Flame, 
  ShieldAlert,
  Sliders,
  Bomb,
  Pointer
} from "lucide-react";

// --- SYNTHWAVE SOUND ENGINE (Using Web Audio API) ---
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on interaction
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playShoot(index: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      
      const freq = 450 + (index % 8) * 15;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playBounce(combo: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      
      // Dynamic frequency scaling with combo levels
      const baseFreq = 220 + Math.min(combo * 30, 900);
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      // White noise explosion synthesis
      const bufferSize = this.ctx.sampleRate * 0.22;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playLaser() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.25);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playItemCollected() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const parent = this;
      const playTone = (freq: number, startDelay: number, duration: number) => {
        if (!parent.ctx) return;
        const osc = parent.ctx.createOscillator();
        const gain = parent.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, parent.ctx.currentTime + startDelay);
        
        gain.gain.setValueAtTime(0, parent.ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(0.08, parent.ctx.currentTime + startDelay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, parent.ctx.currentTime + startDelay + duration);
        
        osc.connect(gain);
        gain.connect(parent.ctx.destination);
        osc.start(parent.ctx.currentTime + startDelay);
        osc.stop(parent.ctx.currentTime + startDelay + duration);
      };
      
      // Beautiful sci-fi high-pitch double ping
      playTone(523.25, 0, 0.15); // C5
      playTone(783.99, 0.08, 0.25); // G5
    } catch (e) {}
  }

  playWarp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  }

  playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.65);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch (e) {}
  }
}

const audioSfx = new SoundEngine();

// --- TYPE DEFINITIONS ---
type BrickType = "normal" | "bomb" | "laser" | "shield" | "triangle";

interface Brick {
  id: string;
  maxHp: number;
  hp: number;
  type: BrickType;
  triangleDir?: "tl" | "tr" | "bl" | "br"; // Sloped corners for triangles
  gridX: number; // 0 to 9
  gridY: number; // 0 to 19
}

interface Item {
  id: string;
  type: "plusBall" | "fission" | "heavyLaser";
  gridX: number;
  gridY: number;
  collectedThisTurn: boolean;
  pulseAnim: number;
}

interface PhysicsBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDrill: boolean; // Upgraded piercing ballistic
  color: string;
  active: boolean;
  returned: boolean;
  trail: { x: number; y: number }[];
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
}

interface BulletChain {
  nextFireTimer: number;
  ballsToDeploy: number;
  ballsDeployedCount: number;
}

// --- CONFIG CONSTANTS ---
const ARENA_WIDTH = 500;
const ARENA_HEIGHT = 650;
const GRID_COLS = 10;
const GRID_ROWS = 20;
const ROW_HEIGHT = 27;
const COL_WIDTH = ARENA_WIDTH / GRID_COLS;
const BALL_RADIUS = 7;
const TURRET_Y = ARENA_HEIGHT - 12;

export default function App() {
  // Gameplay core states
  const [balls, setBalls] = useState<number>(5); // Starting balls count
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("neon_brick_highscore") || "0", 10);
    } catch (_) {
      return 0;
    }
  });
  const [coins, setCoins] = useState<number>(100); // Neon Crystals currency for upgrades
  const [wave, setWave] = useState<number>(1);
  const [gameState, setGameState] = useState<"aiming" | "shooting" | "bouncing" | "gameover" | "intro">("intro");
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [fastForward, setFastForward] = useState<number>(1); // Speed factors: 1, 2.5, 4
  const [activeBricksCount, setActiveBricksCount] = useState<number>(0);
  const [peakBricksInWave, setPeakBricksInWave] = useState<number>(1); // Used to calculate Remaining % for pushing wave
  
  const isWarpAvailable = gameState === "aiming" && (
    (activeBricksCount / Math.max(1, peakBricksInWave) <= 0.32) ||
    activeBricksCount <= 3
  );
  
  // Upgrade levels Shop State
  const [upgradeLevels, setUpgradeLevels] = useState({
    drillBall: 0,     // Pierce chance/count
    fissionGain: 0,   // Split probability boost
    heavyLaser: 0,    // Vertical cross laser width/strength
    startingBall: 0,  // Bonus ball addition at initial load
  });

  const [activeTab, setActiveTab] = useState<"game" | "rules">("game");

  // Physics animation reference hooks for Canvas engine loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Mutable values for seamless canvas loop performance
  const runtimeStateRef = useRef({
    gameState: "intro",
    launcherX: ARENA_WIDTH / 2,
    nextLauncherX: ARENA_WIDTH / 2,
    launcherY: TURRET_Y,
    
    dragStartX: 0,
    dragStartY: 0,
    mouseDragX: 0,
    mouseDragY: 0,
    isDragging: false,
    aimAngle: -Math.PI / 2, // Upward pointing initially
    
    bricks: [] as Brick[],
    items: [] as Item[],
    projectiles: [] as PhysicsBall[],
    sparks: [] as Spark[],
    popups: [] as ScorePopup[],
    
    ballsToShoot: 5,
    collectedCountThisTurn: 0,
    firingSequence: {
      nextFireTimer: 0,
      deployCount: 0,
    },
    
    fastSpeedMultiplier: 1.0,
    upgradeDrillLevel: 0,
    comboMultiplier: 0,
    screenShake: 0,
    gameScore: 0,
    currentWave: 1,
    highScoreVal: 0,
  });

  // Keep ref synchronized with state to ensure callback precision
  useEffect(() => {
    runtimeStateRef.current.gameState = gameState;
    runtimeStateRef.current.fastSpeedMultiplier = fastForward;
    runtimeStateRef.current.upgradeDrillLevel = upgradeLevels.drillBall;
    runtimeStateRef.current.gameScore = score;
    runtimeStateRef.current.currentWave = wave;
    runtimeStateRef.current.highScoreVal = highScore;
    
    // Calculate and update the active bricks count periodically
    const activeLength = runtimeStateRef.current.bricks.length;
    setActiveBricksCount(activeLength);
  }, [gameState, fastForward, upgradeLevels, score, wave, highScore]);

  // Save highscore to localStorage
  const saveHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem("neon_brick_highscore", newScore.toString());
      } catch (_) {}
    }
  };

  // --- AUDIO MUTING TOGGLE ---
  const handleToggleMute = () => {
    const isMuted = audioSfx.toggleMute();
    setSoundOn(!isMuted);
  };

  // --- SETUP RETRO SOUND AT DEMO START ---
  const clickPlayStart = () => {
    audioSfx.playItemCollected();
    warpToWave(1);
    setGameState("aiming");
  };

  // --- INITIALIZE & CONSTRUCT BRICKS MATRIX Wave ---
  const generateNewRow = (targetWave: number) => {
    const freshBricks: Brick[] = [];
    const freshItems: Item[] = [];
    
    // Choose how many elements to place in the row (grows list density as waves scale)
    const minCols = targetWave < 4 ? 2 : (targetWave < 12 ? 3 : 4);
    const maxCols = targetWave < 6 ? 4 : (targetWave < 16 ? 5 : 6);
    const columnsToFill = minCols + Math.floor(Math.random() * (maxCols - minCols + 1));
    const shuffledCols = Array.from({ length: GRID_COLS }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    // Perfect balanced progressive HP scaling
    const baseHp = targetWave + Math.floor(targetWave * 0.5);
    const hpVariance = Math.floor(Math.random() * (targetWave * 0.5 + 2)) + 1;
    const brickHp = Math.max(1, baseHp + hpVariance);

    for (let i = 0; i < GRID_COLS; i++) {
      const colIndex = shuffledCols[i];
      if (i < columnsToFill) {
        // Decide brick properties based on lucky roll
        const r = Math.random();
        let brickType: BrickType = "normal";
        let triangleDir: "tl" | "tr" | "bl" | "br" | undefined;

        if (r < 0.12) {
          brickType = "bomb";
        } else if (r < 0.22) {
          brickType = "laser";
        } else if (r < 0.32) {
          brickType = "shield";
        } else if (r < 0.44) {
          brickType = "triangle";
          const dirs: ("tl" | "tr" | "bl" | "br")[] = ["tl", "tr", "bl", "br"];
          triangleDir = dirs[Math.floor(Math.random() * dirs.length)];
        }

        freshBricks.push({
          id: `brick_${targetWave}_${colIndex}_${Date.now()}_${i}`,
          maxHp: brickHp,
          hp: brickHp,
          type: brickType,
          triangleDir,
          gridX: colIndex,
          gridY: 0,
        });
      } else {
        // Spawn supporting upgrade bubbles / fission balls in empty column spots
        const itemRoll = Math.random();
        if (itemRoll < 0.28) {
          // Plus ball target bubbles
          freshItems.push({
            id: `item_plus_${Date.now()}_${colIndex}`,
            type: "plusBall",
            gridX: colIndex,
            gridY: 0,
            collectedThisTurn: false,
            pulseAnim: Math.random() * Math.PI,
          });
        } else if (itemRoll < 0.42) {
          // Fission speed split trigger bubble
          freshItems.push({
            id: `item_fiss_${Date.now()}_${colIndex}`,
            type: "fission",
            gridX: colIndex,
            gridY: 0,
            collectedThisTurn: false,
            pulseAnim: Math.random() * Math.PI,
          });
        }
      }
    }

    return { freshBricks, freshItems };
  };

  // --- WARP PROGRESSION / LEVEL-UP ENGINE ---
  const warpToWave = (targetWave: number) => {
    setWave(targetWave);
    runtimeStateRef.current.currentWave = targetWave;

    // Shift existing elements down
    let currentBricks = [...runtimeStateRef.current.bricks];
    let currentItems = [...runtimeStateRef.current.items];

    // Increment Y axis rows for existing elements
    currentBricks = currentBricks.map(b => ({ ...b, gridY: b.gridY + 1 }));
    currentItems = currentItems.map(it => ({ ...it, gridY: it.gridY + 1 }));

    // Generate fresh top row
    const { freshBricks, freshItems } = generateNewRow(targetWave);

    const mergedBricks = [...currentBricks, ...freshBricks];
    const mergedItems = [...currentItems, ...freshItems];

    runtimeStateRef.current.bricks = mergedBricks;
    runtimeStateRef.current.items = mergedItems;
    
    // Set total active blocks and peak capacity reference for Warp Meter HUD
    setActiveBricksCount(mergedBricks.length);
    setPeakBricksInWave(Math.max(mergedBricks.length, 12));

    // Carry forward current balls, only set to base count on Wave 1 setup
    if (targetWave === 1) {
      const baseBalls = 5 + upgradeLevels.startingBall * 3;
      setBalls(baseBalls);
      runtimeStateRef.current.ballsToShoot = baseBalls;
    }

    audioSfx.playWarp();
    triggerParticleBurst(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, "#38bdf8", 40);
  };

  // --- TRIVIAL MANUAL SHIFT / QUANTUM PUSHBACK WARP TRIGGER ---
  // "打到剩某部份的量 會往後推"
  // When active bricks are reduced down to <= 32% of maximum layout,
  // player can trigger "Quantum Space Warp (量子躍遷)" which cleans remaining bricks with a dazzling laser
  // sweep bonus, rewards Crystals + high combo points, and rolls onto next challenging wave!
  const handleQuantumWarpShift = () => {
    if (!isWarpAvailable) return;
    const remains = runtimeStateRef.current.bricks;
    if (remains.length === 0) {
      // Free warp
      warpToWave(wave + 1);
      return;
    }

    // Trigger explosive sparks for each remaining block
    audioSfx.playExplosion();
    runtimeStateRef.current.screenShake = 16;
    
    let earnedCoins = 0;
    let earnedPoints = 0;

    remains.forEach(b => {
      triggerParticleBurst(
        b.gridX * COL_WIDTH + COL_WIDTH / 2,
        b.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 50,
        getBrickColor(b.type, b.hp),
        15
      );
      earnedCoins += Math.ceil(b.hp * 0.5) + 1;
      earnedPoints += b.maxHp * 15;
    });

    // Clear everything and advance
    runtimeStateRef.current.bricks = [];
    runtimeStateRef.current.items = [];
    
    setCoins(prev => prev + earnedCoins);
    setScore(prev => {
      const nextScore = prev + earnedPoints;
      saveHighScore(nextScore);
      return nextScore;
    });

    setPopText(
      `躍遷成功! 獲得 +${earnedPoints} 分 與 +${earnedCoins} 晶體`,
      "#00ffff"
    );

    // Roll level
    warpToWave(wave + 1);
  };

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const setPopText = (text: string, color: string) => {
    setNotificationMsg(text);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  // --- RECONSTRUCT AND RELAUNCH RESET GAME ---
  const handleRestart = () => {
    runtimeStateRef.current.bricks = [];
    runtimeStateRef.current.items = [];
    runtimeStateRef.current.projectiles = [];
    runtimeStateRef.current.sparks = [];
    runtimeStateRef.current.popups = [];
    runtimeStateRef.current.launcherX = ARENA_WIDTH / 2;
    runtimeStateRef.current.nextLauncherX = ARENA_WIDTH / 2;
    runtimeStateRef.current.collectedCountThisTurn = 0;

    setScore(0);
    setWave(1);
    warpToWave(1);
    setGameState("aiming");
    audioSfx.playItemCollected();
  };

  // --- EMERGENCY ALL-BALL RECALL MECHANIC ---
  const handleEmergencyRecall = () => {
    if (gameState !== "shooting" && gameState !== "bouncing") return;
    
    // Play sci-fi warping callback ring
    audioSfx.playLaser();
    
    const projectiles = runtimeStateRef.current.projectiles;
    projectiles.forEach(p => {
      p.active = false;
      p.returned = true;
    });

    // Trigger end-of-round state processing instantly safely
    endTurnProcess();
  };

  // --- PHYSICS ENGINE COLLISION SHIFT (Core Canvas Engine Loop) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    // Laser lines drawing reference queues
    let laserBeamsDraw: { x?: number; y?: number; decay: number; power: number }[] = [];

    // Main real-time physics drawing & update tick
    const updateTick = () => {
      const state = runtimeStateRef.current;
      const physicsSpeed = state.fastSpeedMultiplier; // Speed scalars 1x, 2.5x, 4x

      // Screen shaking decay
      if (state.screenShake > 0) {
        state.screenShake *= 0.88;
        if (state.screenShake < 0.2) state.screenShake = 0;
      }

      // --- 1. GAMEPLAY STAGE UPDATES ---
      if (state.gameState === "shooting") {
        // Sequential ball deployment queue
        const sequence = state.firingSequence;
        if (sequence.deployCount < state.ballsToShoot) {
          sequence.nextFireTimer -= 1 * physicsSpeed;
          if (sequence.nextFireTimer <= 0) {
            // Deploy next ball
            // Base ball velocity using aim angle
            const speedMagnitude = 6.8;
            const vx = Math.cos(state.aimAngle) * speedMagnitude;
            const vy = Math.sin(state.aimAngle) * speedMagnitude;

            // Determine if this bullet triggers the upgraded pierce/drill effect (random chance based on Shop levels)
            const isDrill = Math.random() < (state.upgradeDrillLevel * 0.12);

            state.projectiles.push({
              x: state.launcherX,
              y: state.launcherY - BALL_RADIUS,
              vx,
              vy,
              isDrill,
              color: isDrill ? "#facc15" : "#00ffff", // Glowing gold or standard neon cyan
              active: true,
              returned: false,
              trail: [],
            });

            audioSfx.playShoot(sequence.deployCount);
            sequence.deployCount++;
            sequence.nextFireTimer = 4.2; // Interval frames between fires
          }
        } else {
          // Transition to pure bouncing once all balls are deployed
          setGameState("bouncing");
        }
      }

      // Physics integration loops (Run multiple step increments at higher speeds to avoid tunneling bugs!)
      const subSteps = physicsSpeed > 2 ? 3 : (physicsSpeed > 1 ? 2 : 1);
      const stepSpeedRatio = physicsSpeed / subSteps;

      for (let step = 0; step < subSteps; step++) {
        // Update Laser animation decays
        laserBeamsDraw = laserBeamsDraw
          .map(beam => ({ ...beam, decay: beam.decay - 0.04 * stepSpeedRatio }))
          .filter(beam => beam.decay > 0);

        if (state.gameState === "shooting" || state.gameState === "bouncing") {
          let ballsActive = false;

          for (let p of state.projectiles) {
            if (!p.active) continue;
            ballsActive = true;

            // Save trace positions for elegant long neon tails
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 7) p.trail.shift();

            // Direct physics update
            p.x += p.vx * stepSpeedRatio;
            p.y += p.vy * stepSpeedRatio;

            // BOUNDS COLLISIONS (Sides and Top)
            if (p.x - BALL_RADIUS < 0) {
              p.x = BALL_RADIUS;
              p.vx = -p.vx;
              audioSfx.playBounce(state.comboMultiplier);
            } else if (p.x + BALL_RADIUS > ARENA_WIDTH) {
              p.x = ARENA_WIDTH - BALL_RADIUS;
              p.vx = -p.vx;
              audioSfx.playBounce(state.comboMultiplier);
            }

            if (p.y - BALL_RADIUS < 0) {
              p.y = BALL_RADIUS;
              p.vy = -p.vy;
              audioSfx.playBounce(state.comboMultiplier);
            }

            // OUT OF LOWER BOUNDS (Returns back to baseline)
            if (p.y - BALL_RADIUS > ARENA_HEIGHT) {
              p.active = false;
              p.returned = true;

              // The FIRST returned ball determines the next turrret anchor point
              if (state.projectiles.filter(pj => pj.returned).length === 1) {
                state.nextLauncherX = Math.max(BALL_RADIUS * 2, Math.min(ARENA_WIDTH - BALL_RADIUS * 2, p.x));
              }
              continue;
            }

            // --- BRICK MATRIX HIT CORRELATION ---
            for (let i = state.bricks.length - 1; i >= 0; i--) {
              const b = state.bricks[i];
              const bx = b.gridX * COL_WIDTH;
              const by = b.gridY * ROW_HEIGHT + 50; // Offset by 50px HUD ceiling

              // Collision bounding parameters
              const cx = Math.max(bx, Math.min(p.x, bx + COL_WIDTH));
              const cy = Math.max(by, Math.min(p.y, by + ROW_HEIGHT));
              const distSq = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);

              if (distSq < BALL_RADIUS * BALL_RADIUS) {
                // COLLISION DETECTED!
                state.comboMultiplier++;

                // Shield brick reduces weak incoming damage
                let dmgAmount = 1;
                if (b.type === "shield") {
                  dmgAmount = Math.random() < 0.5 ? 1 : 2; // Resists standard constant hits
                }

                b.hp -= dmgAmount;

                // Produce dynamic collision sparks
                triggerParticleBurst(p.x, p.y, getBrickColor(b.type, b.hp), 8);

                // Create score popups
                state.popups.push({
                  id: `popup_${Date.now()}_${Math.random()}`,
                  x: p.x,
                  y: p.y - 12,
                  text: `-${dmgAmount}`,
                  color: getBrickColor(b.type, b.hp),
                  alpha: 1.0,
                  life: 30,
                });

                // Scoring calculation
                const hitPoints = 10 * state.comboMultiplier;
                state.gameScore += hitPoints;

                // Handle brick bounce physics unless ball is in high-pierce drill mode!
                if (!p.isDrill) {
                  // Standard reflective physics. Pivot bouncing off closest edge
                  const overlapX = BALL_RADIUS - Math.abs(p.x - (bx + COL_WIDTH / 2));
                  const overlapY = BALL_RADIUS - Math.abs(p.y - (by + ROW_HEIGHT / 2));

                  // Triangle shapes redirect balls at exact 45 deg angles
                  if (b.type === "triangle" && b.triangleDir) {
                    const dir = b.triangleDir;
                    const relativeX = p.x - bx;
                    const relativeY = p.y - by;
                    let shouldDeflect = false;

                    if (dir === "tl" && relativeX + relativeY < ROW_HEIGHT) shouldDeflect = true;
                    if (dir === "tr" && relativeX > relativeY) shouldDeflect = true;
                    if (dir === "bl" && relativeX < relativeY) shouldDeflect = true;
                    if (dir === "br" && relativeX + relativeY > ROW_HEIGHT) shouldDeflect = true;

                    if (shouldDeflect) {
                      // Deflection vector matrix
                      const tempVx = p.vx;
                      p.vx = -p.vy;
                      p.vy = -tempVx;
                    } else {
                      // Fallback normal block bounce
                      if (Math.abs(p.x - cx) > Math.abs(p.y - cy)) {
                        p.vx = -p.vx;
                      } else {
                        p.vy = -p.vy;
                      }
                    }
                  } else {
                    // Regular rectangular brick deflection
                    const leftDist = Math.abs(p.x - bx);
                    const rightDist = Math.abs(p.x - (bx + COL_WIDTH));
                    const topDist = Math.abs(p.y - by);
                    const bottomDist = Math.abs(p.y - (by + ROW_HEIGHT));

                    const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
                    if (minDist === leftDist) {
                      p.vx = -Math.abs(p.vx);
                      p.x = bx - BALL_RADIUS;
                    } else if (minDist === rightDist) {
                      p.vx = Math.abs(p.vx);
                      p.x = bx + COL_WIDTH + BALL_RADIUS;
                    } else if (minDist === topDist) {
                      p.vy = -Math.abs(p.vy);
                      p.y = by - BALL_RADIUS;
                    } else {
                      p.vy = Math.abs(p.vy);
                      p.y = by + ROW_HEIGHT + BALL_RADIUS;
                    }
                  }
                }

                // Play interactive sound wave
                audioSfx.playBounce(state.comboMultiplier);

                // --- BRICK KILLED ACTIVATIONS ---
                if (b.hp <= 0) {
                  state.bricks.splice(i, 1);
                  audioSfx.playExplosion();
                  state.screenShake = Math.min(state.screenShake + 5, 18);

                  // Earn gold crystal currency random drop
                  if (Math.random() < 0.6) {
                    const cryptoDrop = Math.floor(Math.random() * 3) + 1;
                    state.gameScore += 100;
                  }

                  // 1. BOMB BRICK RADIAL BLOWOUT
                  if (b.type === "bomb") {
                    triggerRadialExplosion(bx + COL_WIDTH / 2, by + ROW_HEIGHT / 2);
                  }

                  // 2. LASER BRICK CROSS SCAN
                  if (b.type === "laser") {
                    triggerLaserSweep(b.gridX, b.gridY, laserBeamsDraw);
                  }
                }
                break; // Break the brick checking loop for this ball's step
              }
            }

            // --- FLOATING POWERUP ITEM COLLISIONS ---
            for (let j = state.items.length - 1; j >= 0; j--) {
              const it = state.items[j];
              const ix = it.gridX * COL_WIDTH + COL_WIDTH / 2;
              const iy = it.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 50;

              const dx = p.x - ix;
              const dy = p.y - iy;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < BALL_RADIUS + 16) {
                // POWERUP HIT!
                audioSfx.playItemCollected();
                triggerParticleBurst(ix, iy, it.type === "plusBall" ? "#34d399" : "#fb923c", 12);

                if (it.type === "plusBall") {
                  // Permanent ball addition state to feed next turn
                  state.collectedCountThisTurn++;
                  state.items.splice(j, 1);

                  // Score add
                  state.gameScore += 50;
                  state.popups.push({
                    id: `popup_${Date.now()}_${Math.random()}`,
                    x: ix,
                    y: iy - 10,
                    text: "+1 彈珠",
                    color: "#34d399",
                    alpha: 1.0,
                    life: 40,
                  });
                } else if (it.type === "fission") {
                  // Fission Crystal immediately cascades split bouncing ball into 2 additional balls!
                  state.items.splice(j, 1);
                  
                  state.popups.push({
                    id: `popup_${Date.now()}_${Math.random()}`,
                    x: ix,
                    y: iy - 10,
                    text: "分裂倍增!",
                    color: "#fb923c",
                    alpha: 1.0,
                    life: 40,
                  });

                  // Add divided ball to physics engine list
                  const angleVar = 0.15; // random divergence angle
                  const speedMag = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                  const baseAngle = Math.atan2(p.vy, p.vx);

                  for (let bi = 0; bi < 2; bi++) {
                    const newAngle = baseAngle + (bi === 0 ? angleVar : -angleVar) + (Math.random() - 0.5) * 0.1;
                    state.projectiles.push({
                      x: p.x,
                      y: p.y,
                      vx: Math.cos(newAngle) * speedMag,
                      vy: Math.sin(newAngle) * speedMag,
                      isDrill: p.isDrill,
                      color: "#f97316", // vivid fission orange
                      active: true,
                      returned: false,
                      trail: [],
                    });
                  }
                }
              }
            }
          }

          // If shooting seq is finished and all balls have hit baseline, cycle turn
          if (!ballsActive && state.gameState === "bouncing") {
            endTurnProcess();
          }
        }
      }

      // --- 2. UPDATE COSMETIC SPARKS & FLOATING POPUPS ---
      state.sparks.forEach(sp => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.98;
        sp.vy *= 0.98;
        sp.life--;
        sp.alpha = sp.life / sp.maxLife;
      });
      state.sparks = state.sparks.filter(sp => sp.life > 0);

      state.popups.forEach(pop => {
        pop.y -= 0.6;
        pop.life--;
        pop.alpha = pop.life / 30;
      });
      state.popups = state.popups.filter(pop => pop.life > 0);

      // --- 3. RENDERING ENGINE CANVAS ---
      ctx.save();
      
      // Screen shake translation matrix
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake;
        const shakeY = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Clear Screen with deep obsidian backdrop
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

      // Render aesthetic sci-fi vertical grids
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let col = 0; col <= GRID_COLS; col++) {
        const cx = col * COL_WIDTH;
        ctx.beginPath();
        ctx.moveTo(cx, 50);
        ctx.lineTo(cx, ARENA_HEIGHT);
        ctx.stroke();
      }
      for (let row = 0; row <= GRID_ROWS; row++) {
        const ry = row * ROW_HEIGHT + 50;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(ARENA_WIDTH, ry);
        ctx.stroke();
      }

      // Draw bottom turret anchor baseline
      ctx.strokeStyle = "rgba(51, 65, 85, 0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, TURRET_Y);
      ctx.lineTo(ARENA_WIDTH, TURRET_Y);
      ctx.stroke();

      // Render floating bubbles / upgrade bubbles items
      state.items.forEach(it => {
        const ix = it.gridX * COL_WIDTH + COL_WIDTH / 2;
        const iy = it.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 50;
        
        it.pulseAnim += 0.05;
        const pulseRatio = 1 + Math.sin(it.pulseAnim) * 0.12;

        ctx.save();
        ctx.shadowBlur = 10;
        
        if (it.type === "plusBall") {
          ctx.strokeStyle = "#10b981";
          ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
          ctx.shadowColor = "#10b981";
          ctx.beginPath();
          ctx.arc(ix, iy, 12 * pulseRatio, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Plus Text sign
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("+", ix, iy);
        } else if (it.type === "fission") {
          ctx.strokeStyle = "#f97316";
          ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
          ctx.shadowColor = "#f97316";
          ctx.beginPath();
          ctx.arc(ix, iy, 11 * pulseRatio, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Double inner core circle
          ctx.beginPath();
          ctx.arc(ix, iy, 5 * pulseRatio, 0, Math.PI * 2);
          ctx.fillStyle = "#ffedd5";
          ctx.fill();
        }

        ctx.restore();
      });

      // Render Active Bricks
      state.bricks.forEach(b => {
        const bx = b.gridX * COL_WIDTH;
        const by = b.gridY * ROW_HEIGHT + 50;
        const pad = 4;
        const bw = COL_WIDTH - pad * 2;
        const bh = ROW_HEIGHT - pad * 2;

        const neonCol = getBrickColor(b.type, b.hp);

        // Apply Canvas visual glow
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = neonCol;
        ctx.strokeStyle = neonCol;
        ctx.lineWidth = 2.5;

        // Custom render patterns depending on properties
        if (b.type === "triangle" && b.triangleDir) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.beginPath();
          // Draw triangles with corner slope
          const bLeft = bx + pad;
          const bRight = bx + COL_WIDTH - pad;
          const bTop = by + pad;
          const bBottom = by + ROW_HEIGHT - pad;

          if (b.triangleDir === "tl") {
            ctx.moveTo(bLeft, bBottom);
            ctx.lineTo(bLeft, bTop);
            ctx.lineTo(bRight, bTop);
          } else if (b.triangleDir === "tr") {
            ctx.moveTo(bLeft, bTop);
            ctx.lineTo(bRight, bTop);
            ctx.lineTo(bRight, bBottom);
          } else if (b.triangleDir === "bl") {
            ctx.moveTo(bLeft, bTop);
            ctx.lineTo(bLeft, bBottom);
            ctx.lineTo(bRight, bBottom);
          } else {
            ctx.moveTo(bLeft, bBottom);
            ctx.lineTo(bRight, bBottom);
            ctx.lineTo(bRight, bTop);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Rounded Rect drawing for standard square bricks
          ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
          drawRoundedRect(ctx, bx + pad, by + pad, bw, bh, 6);
          ctx.fill();
          ctx.stroke();

          // Metal shield bracket for armored bricks
          if (b.type === "shield") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(bx + COL_WIDTH / 2, by + ROW_HEIGHT / 2, 14, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Bomb symbols inside the explosive blocks
          else if (b.type === "bomb") {
            ctx.fillStyle = "rgba(ef, 44, 44, 0.2)";
            ctx.beginPath();
            ctx.arc(bx + COL_WIDTH / 2, by + ROW_HEIGHT / 2, 11, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();

        // HP Text count labels centered
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let labelYOffset = 0;
        // Shift triangle label slightly away from angled slope edges
        if (b.type === "triangle" && b.triangleDir) {
          if (b.triangleDir === "tl") labelYOffset = -4;
          if (b.triangleDir === "br") labelYOffset = 4;
        }

        ctx.fillText(
          b.hp.toString(), 
          bx + COL_WIDTH / 2, 
          by + ROW_HEIGHT / 2 + labelYOffset
        );

        // Icon/property indicators
        if (ROW_HEIGHT >= 38) {
          if (b.type === "bomb") {
            ctx.fillStyle = "#f87171";
            ctx.font = "8px system-ui";
            ctx.fillText("BOMB", bx + COL_WIDTH / 2, by + ROW_HEIGHT - 12);
          } else if (b.type === "laser") {
            ctx.fillStyle = "#fb923c";
            ctx.font = "8px system-ui";
            ctx.fillText("💥LASER💥", bx + COL_WIDTH / 2, by + ROW_HEIGHT - 12);
          } else if (b.type === "shield") {
            ctx.fillStyle = "#a78bfa";
            ctx.font = "8px system-ui";
            ctx.fillText("SHIELD", bx + COL_WIDTH / 2, by + ROW_HEIGHT - 12);
          }
        } else {
          // Draw neat minimal mini-icons inside when scaling is compact
          ctx.font = "10px system-ui";
          if (b.type === "bomb") {
            ctx.fillStyle = "#f87171";
            ctx.fillText("💣", bx + COL_WIDTH - 12, by + ROW_HEIGHT - 8);
          } else if (b.type === "laser") {
            ctx.fillStyle = "#fb923c";
            ctx.fillText("⚡", bx + COL_WIDTH - 12, by + ROW_HEIGHT - 8);
          } else if (b.type === "shield") {
            ctx.fillStyle = "#a78bfa";
            ctx.fillText("🛡️", bx + COL_WIDTH - 12, by + ROW_HEIGHT - 8);
          }
        }
      });

      // Render Laser lines sweep animations
      laserBeamsDraw.forEach(beam => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#f97316";
        ctx.strokeStyle = `rgba(253, 186, 116, ${beam.decay})`;
        ctx.lineWidth = 14 * beam.decay;

        if (beam.x !== undefined) {
          // Vertical scanning ray
          ctx.beginPath();
          ctx.moveTo(beam.x, 50);
          ctx.lineTo(beam.x, ARENA_HEIGHT);
          ctx.stroke();
        }
        if (beam.y !== undefined) {
          // Horizontal scanning ray
          ctx.beginPath();
          ctx.moveTo(0, beam.y);
          ctx.lineTo(ARENA_WIDTH, beam.y);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Render bouncing Projectile Balls
      state.projectiles.forEach(p => {
        if (!p.active) return;

        // Trace glow trails
        if (p.trail.length > 1) {
          ctx.lineWidth = 1.8;
          for (let ti = 0; ti < p.trail.length - 1; ti++) {
            const ratio = ti / p.trail.length;
            ctx.strokeStyle = p.isDrill ? `rgba(234, 179, 8, ${ratio * 0.45})` : `rgba(0, 255, 255, ${ratio * 0.45})`;
            ctx.beginPath();
            ctx.moveTo(p.trail[ti].x, p.trail[ti].y);
            ctx.lineTo(p.trail[ti + 1].x, p.trail[ti + 1].y);
            ctx.stroke();
          }
        }

        // Draw ball body
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Turret Launcher ring & indicators
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#38bdf8";
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(state.launcherX, state.launcherY + 4, 18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Mini barrel nozzle aiming pointer direction
      if (state.gameState === "aiming" && state.isDragging) {
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(state.launcherX, state.launcherY);
        ctx.lineTo(
          state.launcherX + Math.cos(state.aimAngle) * 35,
          state.launcherY + Math.sin(state.aimAngle) * 35
        );
        ctx.stroke();
      }
      ctx.restore();

      // Render aim Dotted trajectory vector line with bounces (虛線軌道模擬)
      if (state.gameState === "aiming" && state.isDragging) {
        drawAimTrajectory(ctx, state.launcherX, state.launcherY - BALL_RADIUS, state.aimAngle);
      }

      // Render particle sparks
      state.sparks.forEach(sp => {
        ctx.fillStyle = `rgba(${hexToRgb(sp.color)}, ${sp.alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render score splash text pops
      state.popups.forEach(pop => {
        ctx.save();
        ctx.fillStyle = pop.color;
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();
      });

      // Floating Ball Multiplier HUD indicators above turret
      if (state.gameState === "aiming") {
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`x${state.ballsToShoot} 彈珠`, state.launcherX, state.launcherY - 26);
      } else {
        // Render current rolling status
        const total = state.projectiles.length;
        const returned = state.projectiles.filter(p => p.returned).length;
        const activeCount = total - returned;
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`滾動中: ${activeCount} / ${state.ballsToShoot}`, state.launcherX, state.launcherY - 24);
      }

      ctx.restore(); // Restore screen shake translate
      animFrameId = requestAnimationFrame(updateTick);
    };

    animFrameId = requestAnimationFrame(updateTick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [gameState, wave, fastForward, upgradeLevels]);

  // --- TRAJECTORY CALCULATION WITH WALL REFLECTIONS (軌道與反射計算) ---
  const drawAimTrajectory = (ctx: CanvasRenderingContext2D, startX: number, startY: number, angle: number) => {
    ctx.save();
    ctx.strokeStyle = "#38bdf8";
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#38bdf8";

    let px = startX;
    let py = startY;
    let vx = Math.cos(angle);
    let vy = Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(px, py);

    // Limit angle bounce depth to 4 points to keep calculation light & neat
    for (let bounce = 0; bounce < 3; bounce++) {
      let tMin = Infinity;
      let hitWall: "left" | "right" | "top" | "bottom" | "none" = "none";

      // Collision equations to locate intersecting target distances
      // Left border: px + vx * t = BALL_RADIUS => t = (BALL_RADIUS - px) / vx
      if (vx < 0) {
        const t = (BALL_RADIUS - px) / vx;
        if (t > 0 && t < tMin) {
          tMin = t;
          hitWall = "left";
        }
      }
      // Right border: px + vx * t = Arena - BALL_RADIUS => t = (Arena - BALL_RADIUS - px) / vx
      if (vx > 0) {
        const t = (ARENA_WIDTH - BALL_RADIUS - px) / vx;
        if (t > 0 && t < tMin) {
          tMin = t;
          hitWall = "right";
        }
      }
      // Top ceiling height limit: py + vy * t = BALL_RADIUS => t = (BALL_RADIUS - py) / vy
      if (vy < 0) {
        const t = (BALL_RADIUS - py) / vy;
        if (t > 0 && t < tMin) {
          tMin = t;
          hitWall = "top";
        }
      }
      // Bottom floor limit: py + vy * t = ARENA_HEIGHT + BALL_RADIUS => t = (ARENA_HEIGHT + BALL_RADIUS - py) / vy
      if (vy > 0) {
        const t = (ARENA_HEIGHT + BALL_RADIUS - py) / vy;
        if (t > 0 && t < tMin) {
          tMin = t;
          hitWall = "bottom";
        }
      }

      if (tMin === Infinity) {
        // No collide path, trace to top or infinite edge
        px += vx * 1000;
        py += vy * 1000;
        ctx.lineTo(px, py);
        break;
      } else {
        // Point intersection
        px += vx * tMin;
        py += vy * tMin;
        ctx.lineTo(px, py);

        // Reflect velocities or stop at bottom
        if (hitWall === "left" || hitWall === "right") {
          vx = -vx;
        } else if (hitWall === "top") {
          vy = -vy;
        } else if (hitWall === "bottom") {
          break;
        }
      }
    }

    ctx.stroke();
    ctx.restore();
  };

  // --- RADIAL AREA EXPLOSIONS TRIGGERS (爆炸磚範圍傷害) ---
  const triggerRadialExplosion = (targetX: number, targetY: number) => {
    const state = runtimeStateRef.current;
    const blastRange = 110; // radius pixel range of damage

    // Create custom particle rings
    for (let c = 0; c < 28; c++) {
      const angle = (c / 28) * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      state.sparks.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: "#ef4444",
        size: 2 + Math.random() * 3,
        alpha: 1.0,
        life: 25 + Math.random() * 20,
        maxLife: 45,
      });
    }

    // Process splash damage on neighboring bricks
    for (let i = state.bricks.length - 1; i >= 0; i--) {
      const b = state.bricks[i];
      const bx = b.gridX * COL_WIDTH + COL_WIDTH / 2;
      const by = b.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 50;

      const dist = Math.sqrt((bx - targetX) * (bx - targetX) + (by - targetY) * (by - targetY));
      if (dist <= blastRange) {
        const blastDmg = 5 + Math.floor(wave * 0.8);
        b.hp -= blastDmg;

        state.popups.push({
          id: `popup_blast_${Date.now()}_${Math.random()}`,
          x: bx,
          y: by - 14,
          text: `轟爆 -${blastDmg}`,
          color: "#ef4444",
          alpha: 1.0,
          life: 30,
        });

        if (b.hp <= 0) {
          state.bricks.splice(i, 1);
          // Chain explosion delays elegantly
          setTimeout(() => {
            if (b.type === "bomb") triggerRadialExplosion(bx, by);
            if (b.type === "laser") triggerLaserSweep(b.gridX, b.gridY, []);
          }, 80);
        }
      }
    }
  };

  // --- COLLATERAL LASER BEAM BURST SWEEP (雷射磚十字掃描) ---
  const triggerLaserSweep = (
    gridCol: number, 
    gridRow: number, 
    laserBeamsDrawArray: any[]
  ) => {
    const state = runtimeStateRef.current;
    audioSfx.playLaser();

    const beamX = gridCol * COL_WIDTH + COL_WIDTH / 2;
    const beamY = gridRow * ROW_HEIGHT + ROW_HEIGHT / 2 + 50;

    // Direct drawing variables to canvas
    laserBeamsDrawArray.push({ x: beamX, decay: 1.0, power: 1.3 });
    laserBeamsDrawArray.push({ y: beamY, decay: 1.0, power: 1.3 });

    // Instantly pierce all blocks sharing column or row indices!
    for (let i = state.bricks.length - 1; i >= 0; i--) {
      const b = state.bricks[i];
      if (b.gridX === gridCol || b.gridY === gridRow) {
        // Do heavy collateral laser damage
        const laserDamage = 4 + Math.floor(wave * 0.6);
        b.hp -= laserDamage;

        state.popups.push({
          id: `popup_laser_${Date.now()}_${Math.random()}`,
          x: b.gridX * COL_WIDTH + COL_WIDTH / 2,
          y: b.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 36,
          text: `雷射 -${laserDamage}`,
          color: "#f97316",
          alpha: 1.0,
          life: 25,
        });

        if (b.hp <= 0) {
          state.bricks.splice(i, 1);
          setTimeout(() => {
            if (b.type === "bomb") triggerRadialExplosion(b.gridX * COL_WIDTH + COL_WIDTH / 2, b.gridY * ROW_HEIGHT + ROW_HEIGHT / 2 + 50);
            if (b.type === "laser") triggerLaserSweep(b.gridX, b.gridY, laserBeamsDrawArray);
          }, 80);
        }
      }
    }
  };

  // --- TRANSITION TURNS PROCESS ON BASING ---
  const endTurnProcess = () => {
    const state = runtimeStateRef.current;
    
    // Consolidate permanent ball inventory additions
    const totalNewBalls = state.ballsToShoot + state.collectedCountThisTurn;
    setBalls(totalNewBalls);
    state.ballsToShoot = totalNewBalls;
    state.collectedCountThisTurn = 0; // reset buffer
    
    // Reposition the turret launcher to the first landed ball coordinates
    state.launcherX = state.nextLauncherX;

    // Reset loop dynamic combo indicators
    state.comboMultiplier = 0;

    // Slide existing rows further down
    let currentBricks = [...state.bricks];
    let currentItems = [...state.items];

    // Shift Y axis layout elements down by 1 row
    currentBricks = currentBricks.map(b => ({ ...b, gridY: b.gridY + 1 }));
    currentItems = currentItems.map(it => ({ ...it, gridY: it.gridY + 1 }));

    // Check if any bricks have exceeded the bottom border lines (Row limit)
    const reachedBottom = currentBricks.some(b => b.gridY >= GRID_ROWS - 1);
    if (reachedBottom) {
      // TRIGGER GAME OVER
      audioSfx.playGameOver();
      setGameState("gameover");
      saveHighScore(state.gameScore);
      return;
    }

    // Generate new upper row
    const nextWave = state.currentWave + 1;
    setWave(nextWave);
    state.currentWave = nextWave;

    const { freshBricks, freshItems } = generateNewRow(nextWave);

    const mergedBricks = [...currentBricks, ...freshBricks];
    const mergedItems = [...currentItems, ...freshItems];

    state.bricks = mergedBricks;
    state.items = mergedItems;

    // Earn crystal coins based on finished round
    const earnedRoundCrystals = 15 + nextWave;
    setCoins(prev => prev + earnedRoundCrystals);

    // Update active counters
    setActiveBricksCount(mergedBricks.length);
    setPeakBricksInWave(Math.max(mergedBricks.length, 12));

    // Clear old state projectiles
    state.projectiles = [];
    state.firingSequence.deployCount = 0;
    state.firingSequence.nextFireTimer = 0;

    // Cycle state back to AIM mode
    setGameState("aiming");
  };

  // --- COSMETIC COLLISION PARTICLE BURSTER ---
  const triggerParticleBurst = (cx: number, cy: number, color: string, count: number) => {
    const state = runtimeStateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 3.8;
      state.sparks.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1.5 + Math.random() * 2,
        alpha: 1.0,
        life: 15 + Math.random() * 15,
        maxLife: 30,
      });
    }
  };

  // --- MOUSE & TOUCH AIM DRAGGING GESTURES (滑鼠拖曳操控軌道) ---
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;

    // Scale dynamically according to physical backing store versus render bounds
    const scaleX = rect.width > 0 ? (ARENA_WIDTH / rect.width) : 1;
    const scaleY = rect.height > 0 ? (ARENA_HEIGHT / rect.height) : 1;

    return {
      x: relativeX * scaleX,
      y: relativeY * scaleY,
    };
  };

  const startDragAim = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== "aiming") return;

    const pos = getMousePos(e);
    const state = runtimeStateRef.current;
    state.isDragging = true;
    state.dragStartX = pos.x;
    state.dragStartY = pos.y;
    state.mouseDragX = pos.x;
    state.mouseDragY = pos.y;

    calculateAimAngle(pos.x, pos.y);
  };

  const moveDragAim = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const state = runtimeStateRef.current;
    if (gameState !== "aiming" || !state.isDragging) return;

    // Prevent scrolling default gestures
    if (e.cancelable) e.preventDefault();

    const pos = getMousePos(e);
    state.mouseDragX = pos.x;
    state.mouseDragY = pos.y;

    calculateAimAngle(pos.x, pos.y);
  };

  const releaseDragAndFire = () => {
    const state = runtimeStateRef.current;
    if (gameState !== "aiming" || !state.isDragging) return;
    state.isDragging = false;

    // Fire sequence trigger!
    setGameState("shooting");
    state.projectiles = [];
    state.firingSequence.deployCount = 0;
    state.firingSequence.nextFireTimer = 0;
  };

  const calculateAimAngle = (mx: number, my: number) => {
    const state = runtimeStateRef.current;
    
    // Relative vector difference pointing from launcher outwards
    const dx = mx - state.launcherX;
    const dy = my - state.launcherY;
    
    // Standard trigonometric atan2 angle lookup
    let angle = Math.atan2(dy, dx);

    // Limit shooting vectors strictly upwards (forcing angles to remain within arena top quarters)
    // Angles in canvas start pointing positive right (0). -Math.PI is left (-180).
    // Ensure firing trajectory isn't too flat (e.g., limit bounds to between -170 deg and -10 deg)
    const minAngleLimit = -Math.PI + 0.18; // ~-170deg
    const maxAngleLimit = -0.18;           // ~-10deg

    if (angle > 0) {
      // Dragging downwards triggers upward mirror reflex shooting (strategic pull-back aim!)
      angle = angle - Math.PI;
    }

    angle = Math.max(minAngleLimit, Math.min(maxAngleLimit, angle));
    state.aimAngle = angle;
  };

  // --- BRICK COLOR ACCORDING TO HEALTH VALUE (動態霓虹色彩變化) ---
  const getBrickColor = (type: BrickType, hp: number) => {
    if (type === "bomb") return "#ef4444"; // intense ruby red
    if (type === "laser") return "#f97316"; // fiery neon orange
    if (type === "shield") return "#c084fc"; // cobalt wizard purple
    if (type === "triangle") return "#f43f5e"; // strawberry warm pink

    // Normal brick color progresses through spectrum as heat indices scale
    if (hp <= 5) return "#a855f7";   // violet amethyst
    if (hp <= 15) return "#d946ef";  // bright pink glow
    if (hp <= 35) return "#3b82f6";  // deep azure sapphire
    return "#06b6d4";                // bright cyan diamond neon
  };

  // --- RETRIEVE UPGRADES PRICE SCHEMA ---
  const getUpgradeCost = (key: keyof typeof upgradeLevels) => {
    const currentLvl = upgradeLevels[key];
    return 30 + currentLvl * 45;
  };

  const buyUpgrade = (key: keyof typeof upgradeLevels) => {
    const price = getUpgradeCost(key);
    if (coins >= price) {
      setCoins(prev => prev - price);
      setUpgradeLevels(prev => {
        const nextLevels = {
          ...prev,
          [key]: prev[key] + 1,
        };
        // If startingBall upgraded, instantly grant extra 3 active ammo balls if aiming/intro
        if (key === "startingBall" && (gameState === "aiming" || gameState === "intro")) {
          setBalls(b => b + 3);
          runtimeStateRef.current.ballsToShoot += 3;
        }
        return nextLevels;
      });
      audioSfx.playItemCollected();
      setPopText(`升級成功! 霓虹效能已解鎖升級`, "#10b981");
    } else {
      audioSfx.playGameOver();
      setPopText(`殘念! 霓虹晶體儲備不足`, "#f87171");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* GLOWING AMBIENT BACKGROUND HEADER FRAME */}
      <header className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              霓虹彈珠打磚塊
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Neon Brick Breaker Engine v2.4</p>
          </div>
        </div>

        {/* HUD NAV ITEMS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-sm text-yellow-300 font-bold">{coins}</span>
          </div>

          <button 
            id="toggle-sound-btn"
            onClick={handleToggleMute}
            className={`p-2 rounded-lg transition-all border ${
              soundOn 
                ? "bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800" 
                : "bg-slate-900 border-rose-950 text-rose-500 hover:text-rose-400 hover:bg-slate-950"
            }`}
            title="音效開關"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* DYNAMIC GENERAL TOAST NOTIFICATIONS */}
      {notificationMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2.5 rounded-full border border-cyan-500/30 bg-slate-900/95 shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">{notificationMsg}</span>
        </div>
      )}

      {/* GAME CABINET BOUNDS */}
      <main className="w-full flex-grow flex flex-col lg:flex-row items-center justify-center gap-6 p-4 max-w-6xl">
        
        {/* LEFT COLUMN: ACTIVE GAME STAGE */}
        <div className="flex flex-col items-center">
          
          {/* STAGE HEADER STATS SUBBAR */}
          <div className="w-full max-w-[500px] mb-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">得分:</span>
              <span className="font-mono text-cyan-400 font-bold text-sm tracking-wide">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">目前波次:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 font-bold">WAVE {wave}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">{highScore}</span>
            </div>
          </div>

          {/* MAIN GRAPHIC CANVAS STAGE */}
          <div 
            id="canvas-parent-frame"
            className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-[0_0_35px_rgba(6,182,212,0.15)] w-full max-w-[500px] aspect-[10/13]"
          >
            {/* RENDER CANVAS LAYER */}
            <canvas
              ref={canvasRef}
              width={ARENA_WIDTH}
              height={ARENA_HEIGHT}
              onMouseDown={startDragAim}
              onMouseMove={moveDragAim}
              onMouseUp={releaseDragAndFire}
              onTouchStart={startDragAim}
              onTouchMove={moveDragAim}
              onTouchEnd={releaseDragAndFire}
              className={`w-full h-full block select-none touch-none ${
                gameState === "aiming" ? "cursor-crosshair" : "cursor-not-allowed"
              }`}
            />

            {/* DEMO LEVEL INTRO BOARD COVER */}
            {gameState === "intro" && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-cyan-950/60 border-2 border-cyan-400 flex items-center justify-center mb-4 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Play className="w-8 h-8 text-cyan-400 fill-cyan-400 ml-1" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-widest mb-2 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                  NEON BRICK SMASHER
                </h2>
                <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
                  拖曳滑鼠或在螢幕上滑動，調整虛線目標發射鋼鐵彈球。消除磚塊並利用特殊元素製造連鎖大爆炸！
                </p>
                <button
                  id="intro-play-btn"
                  onClick={clickPlayStart}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-sm tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  開始裝備戰鬥
                </button>
              </div>
            )}

            {/* GAMEOVER POPUP */}
            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-10 backdrop-blur-sm border-2 border-rose-500">
                <div className="w-14 h-14 rounded-full bg-rose-950/40 border-2 border-rose-500 flex items-center justify-center mb-4 text-rose-500">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black text-rose-500 tracking-wider mb-1">
                  GAME OVER
                </h2>
                <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">波次防禦線已被突破</p>
                
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 w-64">
                  <div className="text-slate-400 text-xs mb-1">最終分數</div>
                  <div className="text-2xl font-mono text-cyan-400 font-extrabold">{score}</div>
                  <div className="text-xs text-indigo-400 font-medium mt-1">到達第 {wave} 波</div>
                </div>

                <button
                  id="game-restart-btn"
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-bold text-sm tracking-wide transition-all transform hover:scale-105"
                >
                  重整旗鼓 再次戰鬥
                </button>
              </div>
            )}
          </div>

          {/* LOWER CONTROLS & SPEEDUPS (多倍物理加速與緊急回收) */}
          <div className="w-full max-w-[490px] mt-3 grid grid-cols-3 gap-2">
            {/* Speed fast-forward multipliers */}
            <div className="col-span-2 flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-950">
              <span className="text-[10px] text-slate-500 px-2 font-semibold uppercase">加速</span>
              {[1, 2.5, 4].map((mult) => (
                <button
                  id={`speed-btn-${mult}`}
                  key={mult}
                  onClick={() => setFastForward(mult)}
                  className={`flex-grow py-1 rounded text-xs font-mono font-bold transition-all ${
                    fastForward === mult
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-black shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  x{mult === 2.5 ? "2.5" : mult}
                </button>
              ))}
            </div>

            {/* Quick Recall all balls */}
            <button
              id="recall-all-btn"
              onClick={handleEmergencyRecall}
              disabled={gameState !== "shooting" && gameState !== "bouncing"}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                gameState === "shooting" || gameState === "bouncing"
                  ? "bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-900 cursor-pointer"
                  : "bg-slate-900/20 text-slate-600 border-slate-950 cursor-not-allowed"
              }`}
              title="節省時間：立刻將場上所有彈球收回並結束本回合"
            >
              <RotateCcw className="w-3.5 h-3.5 animate-spin-reverse" />
              一鍵回收
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION BENTO UPGRADES & MECHANIC RULES */}
        <div className="w-full lg:max-w-md flex flex-col gap-4">
          
          {/* TAB TACTICS BLOCK */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              id="tab-btn-game"
              onClick={() => setActiveTab("game")}
              className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "game" 
                  ? "bg-slate-800 text-cyan-400 shadow-md border-b border-indigo-500/20" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              戰能強化與躍遷
            </button>
            <button
              id="tab-btn-rules"
              onClick={() => setActiveTab("rules")}
              className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "rules" 
                  ? "bg-slate-800 text-cyan-400 shadow-md border-b border-indigo-500/20" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              戰術模組說明
            </button>
          </div>

          {activeTab === "game" ? (
            <div className="flex flex-col gap-4">
              
              {/* SPECIAL WARP ACTION PANEL (打到剩特定量 往後滑推/躍遷升級) */}
              <div className="p-4 rounded-xl border border-indigo-950 bg-gradient-to-br from-indigo-950/20 to-slate-950 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                      重力空間跳躍戰術
                    </h3>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold tracking-widest bg-indigo-950/60 px-2 py-0.5 rounded">
                    ACTIVE METER
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  在一般 BBTAN 模式中，為了打碎角落裡最後一兩顆頑強磚塊常耗費大量時間。本系統搭載<span className="text-indigo-400 font-medium">「空間重力躍遷」</span>：
                  <span className="text-cyan-400">當場上剩餘磚塊數較少時 (低於 32% 或是剩餘 3 顆以下)</span>，你可以手動觸發空間壓縮，將殘餘磚塊雷射爆破為
                  <span className="text-amber-400">霓虹晶體 & 分數補貼</span>，並直接進入下一波新關卡！
                </p>

                {/* Progress bar to visual metric ratio */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">場上剩餘磚塊數:</span>
                    <span className="font-mono text-cyan-400 font-bold">{activeBricksCount} / {peakBricksInWave}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r ${
                        activeBricksCount / peakBricksInWave <= 0.32
                          ? "from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          : "from-cyan-500 to-indigo-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, (activeBricksCount / peakBricksInWave) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Warp Action trigger buttn */}
                <button
                  id="warp-trigger-btn"
                  onClick={handleQuantumWarpShift}
                  disabled={!isWarpAvailable}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
                    !isWarpAvailable
                      ? "bg-slate-900/40 text-slate-500 border-slate-950 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer transform hover:scale-101"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isWarpAvailable 
                    ? "🚀 剩餘極少：啟動光速躍遷 (下一波)" 
                    : gameState !== "aiming"
                      ? "鎖定中：僅在準備瞄準時可用"
                      : `鎖定中：需低於 32% (目前 ${Math.round((activeBricksCount / Math.max(1, peakBricksInWave)) * 100)}%)`}
                </button>
              </div>

              {/* PERMANENT SHIELD SHOP UPGRADES */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40">
                <div className="flex items-center gap-1.5 mb-3">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                    霓虹科技終極強化
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Pierce drill balls */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        黃金加權鑽岩彈 
                        <span className="text-[9px] px-1 rounded bg-yellow-950 text-yellow-300">Lvl {upgradeLevels.drillBall}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">高機率生成穿透一切的鑽石球，不需反彈</p>
                    </div>
                    <button
                      id="upgrade-btn-drill"
                      onClick={() => buyUpgrade("drillBall")}
                      className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold font-mono min-w-16 transition-colors"
                    >
                      {getUpgradeCost("drillBall")} 晶
                    </button>
                  </div>

                  {/* Multiplier Fission boost */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        超能分裂引導素
                        <span className="text-[9px] px-1 rounded bg-orange-950 text-orange-300">Lvl {upgradeLevels.fissionGain}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">提升場上分裂水晶使彈球裂變成x3的分裂率</p>
                    </div>
                    <button
                      id="upgrade-btn-fission"
                      onClick={() => buyUpgrade("fissionGain")}
                      className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold font-mono min-w-16 transition-colors"
                    >
                      {getUpgradeCost("fissionGain")} 晶
                    </button>
                  </div>

                  {/* Initial permanent ball boost */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        微粒子高能增幅
                        <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-300">Lvl {upgradeLevels.startingBall}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">開局/過關時永久增加 +3 顆基礎發射球</p>
                    </div>
                    <button
                      id="upgrade-btn-starting"
                      onClick={() => buyUpgrade("startingBall")}
                      className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 text-xs font-bold font-mono min-w-16 transition-colors"
                    >
                      {getUpgradeCost("startingBall")} 晶
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-200 mb-1 border-b border-slate-800 pb-2">專屬高能磚塊與性質</h3>

              <div className="flex gap-3 items-start text-xs border-b border-slate-900 pb-2.5">
                <div className="w-10 h-10 shrink-0 rounded bg-red-950/60 border border-red-500 flex items-center justify-center font-bold text-red-400 text-sm">
                  ★
                </div>
                <div>
                  <div className="font-extrabold text-slate-200 flex items-center gap-1.5">
                    爆炸雷彈磚 (Bomb)
                    <span className="text-[9px] uppercase font-bold text-slate-400">爆破性質</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">血量歸零時，引發半徑110像素的大型環狀熱核引爆，對鄰近所有磚塊造成劇烈範圍傷害，並觸發連鎖效應。</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs border-b border-slate-900 pb-2.5">
                <div className="w-10 h-10 shrink-0 rounded bg-orange-950/60 border border-orange-500 flex items-center justify-center font-bold text-orange-400 text-sm">
                  ⚡
                </div>
                <div>
                  <div className="font-extrabold text-slate-200 flex items-center gap-1.5">
                    射頻十字雷射磚 (Laser)
                    <span className="text-[9px] uppercase font-bold text-slate-400">列與行爆破</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">被消除時產生十字型聚合激游雷射光束，瞬間對該橫向行、縱向列的所有方塊造成雷射貫穿。是清理大片磚塊的強力戰略核心！</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs border-b border-slate-900 pb-2.5">
                <div className="w-10 h-10 shrink-0 rounded bg-purple-950/60 border border-purple-400 flex items-center justify-center font-bold text-purple-300 text-xs">
                  盾護
                </div>
                <div>
                  <div className="font-extrabold text-slate-200">護盾裝甲磚 (Shield)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">具備抗高能衝擊性質，大機率減免彈珠造成的 1 點生命耗損。需利用更高密度的彈珠壓制才能擊碎。</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs border-b border-slate-900 pb-2.5">
                <div className="w-10 h-10 shrink-0 rounded bg-slate-900 border border-rose-500 flex items-center justify-center font-bold text-rose-300 text-[11px]">
                  斜切
                </div>
                <div>
                  <div className="font-extrabold text-slate-200">三角反射與折設磚 (Triangle)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">45度斜面割裂，能大幅扭轉並加速反射角度，將垂直入射的球轉變為高難度的水平軌道，以製造無窮的頂部反彈爽快連擊！</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-xs">
                <div className="w-10 h-10 shrink-0 rounded bg-emerald-950/50 border border-emerald-400 flex items-center justify-center font-bold text-emerald-450 text-xs">
                  +1
                </div>
                <div>
                  <div className="font-extrabold text-slate-200">複數加球珠 (Collectibles)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">場上浮空點，擊中即可在下回合中永久增加可發射彈球，球疊球、讓你的彈珠攻勢源源不絕！</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER CONTAINER */}
      <footer className="w-full max-w-5xl mx-auto py-4 px-4 text-center border-t border-slate-900 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          使用 <span className="text-cyan-400">Tailwind CSS v4</span> + <span className="text-indigo-400">HTML5 Canvas 精確反彈物理與 Web Audio API</span>
        </div>
        <div className="flex gap-4">
          <span>全站總瀏覽: <span id="vercount_value_site_pv" className="text-cyan-400 font-bold">--</span> 次</span>
          <span>全站獨立訪客: <span id="vercount_value_site_uv" className="text-indigo-400 font-bold">--</span> 人</span>
        </div>
        <div>
          © 2026 霓虹彈珠打磚塊 - 經典街機升級重塑
        </div>
      </footer>
    </div>
  );
}

// --- HELPER GRAPHICS DRAWING FUNCTIONS ---

// Canvas circular rounding rectangle drawer helper
function drawRoundedRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Convert Hex string color code to RGB component for alpha transparency blending
function hexToRgb(hex: string): string {
  // strip hash if present
  const cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return `${r}, ${g}, ${b}`;
  } else if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return "255, 255, 255";
}
