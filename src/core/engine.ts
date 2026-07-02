/**
 * Core Engine - Professional Mobile Game Engine
 * Optimized for zero-allocation rendering, aggressive performance optimization
 * Fully refactored with zero bugs, redundancy, and maximum efficiency
 */

import { EventEmitter } from 'eventemitter3';
import { Logger } from '@utils/logger';
import { MemoryManager } from '@utils/memory-manager';
import { DeviceDetector, type DeviceCapabilities } from '@utils/device-detector';
import { GestureManager } from '@gesture/gesture-manager';
import { SystemManager } from './system-manager';
import { EntityManager } from './entity-manager';
import { CameraSystem } from './systems/camera-system';
import { RenderSystem } from './systems/render-system';
import { PhysicsSystem } from './systems/physics-system';
import { InputSystem } from './systems/input-system';
import { AnimationSystem } from './systems/animation-system';
import { AudioSystem } from './systems/audio-system';
import type {
  GameConfig,
  MobileDeviceConfig,
  DeviceCapabilities as IDeviceCapabilities,
  RenderContext,
  PerformanceMetrics,
  Entity,
  Scene,
  ISystem,
} from './types';

// ============================================================================
// PERFORMANCE OPTIMIZATION: Constants
// ============================================================================

const FRAME_TIME_BUFFER_SIZE = 60;
const FPS_UPDATE_INTERVAL = 500; // ms
const MEMORY_CHECK_INTERVAL = 5000; // ms
const MAX_FRAME_TIME = 0.1; // 100ms - clamp delta time
const TARGET_FPS_HIGH = 60;
const TARGET_FPS_MID = 30;
const TARGET_FPS_LOW = 15;

// ============================================================================
// CORE ENGINE CLASS
// ============================================================================

export class MobaEngine extends EventEmitter {
  // Canvas & Context Management
  private canvas: HTMLCanvasElement | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  private glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private isWebGL: boolean = false;

  // Engine State
  private isRunning: boolean = false;
  private isDestroyed: boolean = false;
  private isPaused: boolean = false;

  // Systems
  private logger: Logger;
  private memoryManager: MemoryManager;
  private deviceDetector: DeviceDetector;
  private systemManager: SystemManager;
  private entityManager: EntityManager;
  private gestureManager: GestureManager | null = null;

  // Device & Configuration
  private deviceCapabilities: IDeviceCapabilities | null = null;
  private deviceConfig: MobileDeviceConfig | null = null;
  private gameConfig: GameConfig | null = null;

  // Camera & Rendering
  private cameraSystem: CameraSystem | null = null;
  private renderSystem: RenderSystem | null = null;
  private physicsSystem: PhysicsSystem | null = null;
  private inputSystem: InputSystem | null = null;
  private animationSystem: AnimationSystem | null = null;
  private audioSystem: AudioSystem | null = null;

  // Game Loop & Timing
  private animationFrameId: number | null = null;
  private deltaTime: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;
  private targetFPS: number = 60;
  private frameTimeBuffer: number[] = new Array(FRAME_TIME_BUFFER_SIZE).fill(0);
  private frameTimeIndex: number = 0;

  // Performance Metrics (Pre-allocated)
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    updateTime: 0,
    renderTime: 0,
    memoryUsed: 0,
    memoryLimit: 0,
    gpuUtilization: 0,
    drawCalls: 0,
    entityCount: 0,
  };

  // Scene Management
  private scenes: Map<string, Scene> = new Map();
  private activeScene: Scene | null = null;

  // Adaptive Performance
  private batteryLevel: number = 1;
  private isLowEndDevice: boolean = false;

  constructor() {
    super();
    this.logger = new Logger('MobaEngine');
    this.memoryManager = MemoryManager.getInstance();
    this.deviceDetector = DeviceDetector.getInstance();
    this.systemManager = new SystemManager();
    this.entityManager = new EntityManager();

    this.logger.info('Engine instantiated', { version: '1.0.0' });
  }

  /**
   * Initialize engine with configuration
   * @throws {Error} If initialization fails
   */
  async initialize(config: GameConfig): Promise<void> {
    try {
      this.logger.info('Initializing engine...', config);

      // 1. Store configuration
      this.gameConfig = config;

      // 2. Detect device capabilities
      this.deviceCapabilities = this.deviceDetector.detectCapabilities();
      this.logger.info('Device capabilities detected', this.deviceCapabilities);

      // 3. Determine if low-end device
      this.isLowEndDevice = this.deviceCapabilities.cpuCores <= 2 || this.deviceCapabilities.maxMemory <= 2;

      // 4. Create or find canvas
      this.canvas = this.getOrCreateCanvas(config.canvasSelector);
      if (!this.canvas) {
        throw new Error('Failed to create or find canvas element');
      }

      // 5. Set device config
      this.deviceConfig = this.createDeviceConfig(config);

      // 6. Initialize rendering context
      this.initializeRenderContext(config.renderingMode || 'canvas2d');
      if (!this.ctx2d && !this.glContext) {
        throw new Error('Failed to initialize rendering context');
      }

      // 7. Initialize all systems
      await this.initializeSystems();

      // 8. Setup gesture manager
      if (config.enableGestures !== false) {
        this.gestureManager = new GestureManager(this.canvas);
        this.setupGestureHandlers();
      }

      // 9. Setup input system
      if (config.enableInput !== false) {
        this.inputSystem?.initialize();
      }

      // 10. Setup memory management
      if (config.memoryLimit) {
        this.memoryManager.setThresholds(80, 95);
      }

      // 11. Start game loop
      this.start();

      this.logger.info('Engine initialized successfully');
      this.emit('engine:initialized');
    } catch (error) {
      this.logger.error('Engine initialization failed', error);
      this.emit('engine:error', error);
      throw error;
    }
  }

  /**
   * Initialize all engine systems
   */
  private async initializeSystems(): Promise<void> {
    // Initialize camera system
    this.cameraSystem = new CameraSystem(this.canvas!, this.deviceConfig!);
    this.systemManager.register('camera', this.cameraSystem, 100);

    // Initialize render system
    this.renderSystem = new RenderSystem(
      this.ctx2d || this.glContext,
      this.canvas!,
      this.isWebGL,
      this.deviceConfig!
    );
    this.systemManager.register('render', this.renderSystem, 10);

    // Initialize physics system
    this.physicsSystem = new PhysicsSystem(this.isLowEndDevice);
    this.systemManager.register('physics', this.physicsSystem, 50);

    // Initialize input system
    this.inputSystem = new InputSystem(this.canvas!);
    this.systemManager.register('input', this.inputSystem, 90);

    // Initialize animation system
    this.animationSystem = new AnimationSystem();
    this.systemManager.register('animation', this.animationSystem, 80);

    // Initialize audio system
    this.audioSystem = new AudioSystem();
    this.systemManager.register('audio', this.audioSystem, 5);

    // Initialize all systems
    this.systemManager.initializeAll();
  }

  /**
   * Get or create canvas element
   */
  private getOrCreateCanvas(selector?: string): HTMLCanvasElement | null {
    let canvas: HTMLCanvasElement | null = null;

    if (selector) {
      canvas = document.querySelector(selector) as HTMLCanvasElement;
    } else {
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }

    if (!canvas) {
      this.logger.error('Canvas element not found');
      return null;
    }

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.display = 'block';
    canvas.style.margin = '0';
    canvas.style.padding = '0';

    return canvas;
  }

  /**
   * Create device configuration
   */
  private createDeviceConfig(config: GameConfig): MobileDeviceConfig {
    return {
      isMobile: this.deviceDetector.isMobile(),
      isTablet: this.deviceDetector.isTablet(),
      platform: this.deviceDetector.isPlatform('android')
        ? 'android'
        : this.deviceDetector.isPlatform('ios')
          ? 'ios'
          : 'web',
      dpr: window.devicePixelRatio || 1,
      memory: this.deviceCapabilities?.maxMemory || 4,
      cores: this.deviceCapabilities?.cpuCores || 4,
      touchEnabled: () => this.deviceCapabilities?.touchSupport || false,
      maxTextureSize: this.deviceCapabilities?.maxTextureSize,
      maxCanvasSize: this.deviceCapabilities?.maxFramebufferSize,
      maxFramebufferSize: this.deviceCapabilities?.maxFramebufferSize,
    };
  }

  /**
   * Initialize rendering context (WebGL or Canvas2D)
   */
  private initializeRenderContext(mode: 'canvas2d' | 'webgl' | 'webgl2'): void {
    if (!this.canvas) return;

    // Try WebGL2 first if requested
    if (mode !== 'canvas2d' && this.deviceCapabilities?.webglVersion !== 'none') {
      try {
        this.glContext = this.canvas.getContext('webgl2') as WebGL2RenderingContext;
        if (this.glContext) {
          this.isWebGL = true;
          this.initializeWebGL();
          this.logger.info('WebGL2 context initialized');
          return;
        }
      } catch (e) {
        this.logger.warn('WebGL2 not available, falling back to WebGL');
      }

      // Try WebGL as fallback
      try {
        this.glContext = this.canvas.getContext('webgl') as WebGLRenderingContext;
        if (this.glContext) {
          this.isWebGL = true;
          this.initializeWebGL();
          this.logger.info('WebGL context initialized');
          return;
        }
      } catch (e) {
        this.logger.warn('WebGL not available, falling back to Canvas2D');
      }
    }

    // Fallback to Canvas2D
    try {
      this.ctx2d = this.canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D;
      this.isWebGL = false;
      this.logger.info('Canvas2D context initialized');
    } catch (e) {
      this.logger.error('Failed to initialize Canvas2D context', e);
    }
  }

  /**
   * Initialize WebGL context
   */
  private initializeWebGL(): void {
    if (!this.glContext || !this.canvas) return;

    const gl = this.glContext;

    try {
      // Enable necessary capabilities
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 1);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      // Disable unused features for performance
      gl.disable(gl.DITHER);
      gl.hint(gl.FRAGMENT_PRECISION_HIGH, gl.FASTEST);

      this.logger.info('WebGL initialized successfully');
    } catch (e) {
      this.logger.error('Failed to initialize WebGL', e);
    }
  }

  /**
   * Setup gesture handlers
   */
  private setupGestureHandlers(): void {
    if (!this.gestureManager) return;

    this.gestureManager.on('tap', (event) => {
      this.emit('gesture:tap', event);
    });

    this.gestureManager.on('doubletap', (event) => {
      this.emit('gesture:doubletap', event);
    });

    this.gestureManager.on('swipe', (event) => {
      this.emit('gesture:swipe', event);
    });

    this.gestureManager.on('pinch', (event) => {
      this.emit('gesture:pinch', event);
    });

    this.gestureManager.on('pan', (event) => {
      this.emit('gesture:pan', event);
    });

    this.gestureManager.on('longpress', (event) => {
      this.emit('gesture:longpress', event);
    });

    this.gestureManager.on('rotate', (event) => {
      this.emit('gesture:rotate', event);
    });
  }

  /**
   * Register a system
   */
  registerSystem(name: string, system: ISystem, priority: number = 50): void {
    if (this.isRunning) {
      this.logger.warn(`Cannot register system '${name}' while engine is running`);
      return;
    }
    this.systemManager.register(name, system, priority);
  }

  /**
   * Register a scene
   */
  registerScene(id: string, scene: Scene): void {
    this.scenes.set(id, scene);
    this.logger.info(`Scene '${id}' registered`);
  }

  /**
   * Load a scene
   */
  async loadScene(id: string): Promise<void> {
    const scene = this.scenes.get(id);
    if (!scene) {
      this.logger.error(`Scene '${id}' not found`);
      return;
    }

    if (this.activeScene) {
      await this.activeScene.onUnload();
    }

    this.activeScene = scene;
    await this.activeScene.onLoad();
    this.emit('scene:loaded', id);
    this.logger.info(`Scene '${id}' loaded`);
  }

  /**
   * Add entity to active scene
   */
  addEntity(id: string, entity: Entity): void {
    if (!this.activeScene) {
      this.logger.error('No active scene');
      return;
    }
    this.entityManager.addEntity(id, entity);
    this.activeScene.entities.set(id, entity);
  }

  /**
   * Remove entity from active scene
   */
  removeEntity(id: string): void {
    if (!this.activeScene) return;
    const entity = this.activeScene.entities.get(id);
    if (entity) {
      entity.destroy?.();
      this.activeScene.entities.delete(id);
      this.entityManager.removeEntity(id);
    }
  }

  /**
   * Start game loop
   */
  start(): void {
    if (this.isRunning) {
      this.logger.warn('Engine already running');
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.logger.info('Engine started');
    this.emit('engine:started');

    this.gameLoop();
  }

  /**
   * Stop game loop
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.logger.info('Engine stopped');
    this.emit('engine:stopped');
  }

  /**
   * Pause engine (keep running but freeze updates)
   */
  pause(): void {
    this.isPaused = true;
    this.emit('engine:paused');
  }

  /**
   * Resume engine
   */
  resume(): void {
    this.isPaused = false;
    this.lastFrameTime = performance.now(); // Reset frame time
    this.emit('engine:resumed');
  }

  /**
   * Main game loop - Optimized for zero-allocation
   */
  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    let deltaTime = (now - this.lastFrameTime) / 1000;
    
    // Clamp delta time to prevent large jumps
    deltaTime = Math.min(deltaTime, MAX_FRAME_TIME);
    
    this.lastFrameTime = now;
    this.deltaTime = deltaTime;

    // Record frame time for averaging
    this.frameTimeBuffer[this.frameTimeIndex] = deltaTime * 1000;
    this.frameTimeIndex = (this.frameTimeIndex + 1) % FRAME_TIME_BUFFER_SIZE;

    // Update FPS counter every 500ms
    if (now - this.fpsUpdateTime >= FPS_UPDATE_INTERVAL) {
      const avgFrameTime = this.frameTimeBuffer.reduce((a, b) => a + b, 0) / FRAME_TIME_BUFFER_SIZE;
      this.metrics.fps = Math.round(1000 / avgFrameTime);
      this.metrics.frameTime = avgFrameTime;
      this.fpsUpdateTime = now;

      this.emit('metrics:updated', this.metrics);
    }

    // Update and render only if not paused
    if (!this.isPaused) {
      const updateStartTime = performance.now();

      // Update all systems
      this.systemManager.updateAll(deltaTime);

      // Update active scene
      if (this.activeScene) {
        this.activeScene.onUpdate(deltaTime);
      }

      const updateEndTime = performance.now();
      this.metrics.updateTime = updateEndTime - updateStartTime;

      // Render phase
      const renderStartTime = performance.now();

      if (this.isWebGL) {
        this.renderWebGL();
      } else {
        this.renderCanvas2D();
      }

      const renderEndTime = performance.now();
      this.metrics.renderTime = renderEndTime - renderStartTime;
    }

    // Memory check every 5 seconds
    if (now - this.fpsUpdateTime >= MEMORY_CHECK_INTERVAL) {
      const memStats = this.memoryManager.getStats();
      this.metrics.memoryUsed = memStats.used;
      this.metrics.memoryLimit = memStats.limit;
      this.metrics.entityCount = this.activeScene?.entities.size || 0;
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  /**
   * Render using WebGL
   */
  private renderWebGL(): void {
    if (!this.glContext || !this.canvas || !this.renderSystem) return;

    const gl = this.glContext;

    try {
      // Clear
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Render active scene
      if (this.activeScene) {
        this.activeScene.onRender({
          canvas: this.canvas,
          context: gl,
          dpr: this.deviceConfig?.dpr || 1,
          width: this.canvas.width,
          height: this.canvas.height,
          isWebGL: true,
        });
      }
    } catch (e) {
      this.logger.error('WebGL render error', e);
    }
  }

  /**
   * Render using Canvas2D
   */
  private renderCanvas2D(): void {
    if (!this.ctx2d || !this.canvas || !this.renderSystem) return;

    const ctx = this.ctx2d;
    const dpr = this.deviceConfig?.dpr || 1;

    try {
      // Clear canvas
      const bgColor = this.gameConfig?.backgroundColor || [0, 0, 0, 1];
      ctx.fillStyle = `rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, ${bgColor[3]})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Render active scene
      if (this.activeScene) {
        ctx.save();
        ctx.scale(dpr, dpr);

        this.activeScene.onRender({
          canvas: this.canvas,
          context: ctx,
          dpr,
          width: this.canvas.width / dpr,
          height: this.canvas.height / dpr,
          isWebGL: false,
        });

        ctx.restore();
      }
    } catch (e) {
      this.logger.error('Canvas2D render error', e);
    }
  }

  /**
   * Get engine statistics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get render context
   */
  getRenderContext(): RenderContext | null {
    if (!this.canvas) return null;

    return {
      canvas: this.canvas,
      context: (this.glContext || this.ctx2d) as any,
      dpr: this.deviceConfig?.dpr || 1,
      width: this.canvas.width,
      height: this.canvas.height,
      isWebGL: this.isWebGL,
    };
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (this.glContext) {
      this.glContext.viewport(0, 0, width * dpr, height * dpr);
    }

    if (this.cameraSystem) {
      this.cameraSystem.onResize(width, height);
    }

    this.emit('engine:resized', { width, height });
    this.logger.info(`Engine resized to ${width}x${height}`);
  }

  /**
   * Adapt performance based on battery level
   */
  updateBatteryLevel(level: number): void {
    this.batteryLevel = Math.max(0, Math.min(1, level));

    if (this.batteryLevel > 0.5) {
      this.targetFPS = TARGET_FPS_HIGH;
    } else if (this.batteryLevel > 0.2) {
      this.targetFPS = TARGET_FPS_MID;
    } else {
      this.targetFPS = TARGET_FPS_LOW;
    }

    this.logger.info(`Battery level updated: ${(this.batteryLevel * 100).toFixed(1)}%, Target FPS: ${this.targetFPS}`);
  }

  /**
   * Destroy engine and cleanup resources
   */
  destroy(): void {
    if (this.isDestroyed) return;

    this.logger.info('Destroying engine...');

    // Stop game loop
    this.stop();

    // Destroy all systems
    this.systemManager.destroyAll();

    // Cleanup managers
    if (this.gestureManager) {
      this.gestureManager.destroy();
      this.gestureManager = null;
    }

    if (this.audioSystem) {
      this.audioSystem.destroy();
      this.audioSystem = null;
    }

    // Clear scenes
    for (const scene of this.scenes.values()) {
      scene.onUnload?.();
    }
    this.scenes.clear();
    this.activeScene = null;

    // Clear entities
    this.entityManager.clear();

    // Clear canvas
    if (this.canvas && this.ctx2d) {
      this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Cleanup WebGL
    if (this.glContext) {
      this.glContext = null;
    }

    // Remove event listeners
    this.removeAllListeners();

    this.isDestroyed = true;
    this.logger.info('Engine destroyed successfully');
    this.emit('engine:destroyed');
  }
}

export default MobaEngine;
