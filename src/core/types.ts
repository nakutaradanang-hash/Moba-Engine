/**
 * Core Type Definitions
 * Comprehensive type system for the engine
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 extends Vector2 {
  z: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type RGBA = [number, number, number, number];

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface GameConfig {
  canvasSelector?: string;
  enableGestures?: boolean;
  enableInput?: boolean;
  targetFPS?: number;
  renderingMode?: 'canvas2d' | 'webgl' | 'webgl2';
  enableDevTools?: boolean;
  enableEncryption?: boolean;
  enableProfiling?: boolean;
  memoryLimit?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  backgroundColor?: RGBA;
  vsync?: boolean;
}

export interface MobileDeviceConfig {
  isMobile: boolean;
  isTablet: boolean;
  platform: 'android' | 'ios' | 'web' | 'unknown';
  dpr: number;
  memory: number;
  cores: number;
  touchEnabled: () => boolean;
  maxTextureSize?: number;
  maxCanvasSize?: number;
  maxFramebufferSize?: number;
}

export interface DeviceCapabilities {
  maxMemory: number;
  cpuCores: number;
  gpu: boolean;
  webglVersion: '1.0' | '2.0' | 'none';
  webgl2Available: boolean;
  touchSupport: boolean;
  orientationSupport: boolean;
  vibrationSupport: boolean;
  maxTextureSize: number;
  maxFramebufferSize: number;
  maxVaryingVectors: number;
  maxVertexAttribs: number;
  maxFragmentUniformVectors: number;
  maxVertexUniformVectors: number;
}

// ============================================================================
// ENTITY & COMPONENT TYPES
// ============================================================================

export interface IComponent {
  entity: Entity | null;
  enabled: boolean;
  onAttach(): void;
  onDetach(): void;
  onEnable(): void;
  onDisable(): void;
  update(deltaTime: number): void;
}

export interface Entity {
  id: string;
  name: string;
  enabled: boolean;
  visible: boolean;
  components: Map<string, IComponent>;
  addComponent<T extends IComponent>(type: string, component: T): T;
  getComponent<T extends IComponent>(type: string): T | undefined;
  hasComponent(type: string): boolean;
  removeComponent(type: string): void;
  destroy(): void;
}

export interface Transform {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // in radians
  width: number;
  height: number;
}

// ============================================================================
// RENDERING TYPES
// ============================================================================

export interface RenderContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext;
  dpr: number;
  width: number;
  height: number;
  isWebGL: boolean;
}

export interface RenderState {
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  clearColor: RGBA;
  scissor: boolean;
  blend: boolean;
  depthTest: boolean;
  cullFace: boolean;
  wireframe: boolean;
}

export interface Camera {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
  width: number;
  height: number;
  near: number;
  far: number;
  fov: number;
  ortho: boolean;
  update(): void;
  getViewMatrix(): Float32Array;
  getProjectionMatrix(): Float32Array;
  screenToWorld(screenX: number, screenY: number): Vector2;
  worldToScreen(worldX: number, worldY: number): Vector2;
}

export interface Sprite {
  texture: WebGLTexture | HTMLImageElement | ImageBitmap;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
  visible: boolean;
  zIndex: number;
}

export interface AnimationFrame {
  textureRegion: Rectangle;
  duration: number;
  eventTriggers?: AnimationEvent[];
}

export interface AnimationEvent {
  frame: number;
  callback: () => void;
}

// ============================================================================
// PHYSICS TYPES
// ============================================================================

export interface PhysicsBody {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  mass: number;
  friction: number;
  restitution: number;
  gravityScale: number;
  isStatic: boolean;
  isDynamic: boolean;
  isSensor: boolean;
  width: number;
  height: number;
  rotation: number;
}

export interface CollisionResult {
  entityA: Entity;
  entityB: Entity;
  penetrationDepth: number;
  normal: Vector2;
  contactPoint: Vector2;
}

export interface RaycastResult {
  entity: Entity;
  distance: number;
  point: Vector2;
  normal: Vector2;
}

// ============================================================================
// INPUT & GESTURE TYPES
// ============================================================================

export interface GestureEvent {
  type: GestureType;
  timestamp: number;
  x: number;
  y: number;
  pointers: number;
  pressure?: number;
  startX?: number;
  startY?: number;
  deltaX?: number;
  deltaY?: number;
  velocity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  rotation?: number;
}

export type GestureType =
  | 'tap'
  | 'doubletap'
  | 'swipe'
  | 'pan'
  | 'pinch'
  | 'rotate'
  | 'longpress'
  | 'custom';

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface InputState {
  touch: TouchPoint[];
  keys: Set<string>;
  mouse: {
    x: number;
    y: number;
    down: boolean;
    button: number;
  };
}

// ============================================================================
// AUDIO TYPES
// ============================================================================

export interface AudioClip {
  id: string;
  buffer: AudioBuffer;
  duration: number;
  channels: number;
  sampleRate: number;
}

export interface SoundInstance {
  id: string;
  source: AudioBufferSourceNode;
  gain: GainNode;
  playing: boolean;
  volume: number;
}

// ============================================================================
// ASSET TYPES
// ============================================================================

export interface Asset {
  id: string;
  type: 'texture' | 'sound' | 'font' | 'data';
  name: string;
  path: string;
  data: any;
  size: number;
  cached: boolean;
}

export interface AssetLoadConfig {
  async: boolean;
  priority: number;
  cache: boolean;
}

// ============================================================================
// SCENE TYPES
// ============================================================================

export interface Scene {
  id: string;
  name: string;
  entities: Map<string, Entity>;
  camera: Camera;
  layers: number;
  active: boolean;
  onLoad(): Promise<void>;
  onUnload(): Promise<void>;
  onUpdate(deltaTime: number): void;
  onRender(context: RenderContext): void;
}

// ============================================================================
// SYSTEM TYPES
// ============================================================================

export interface ISystem {
  priority: number;
  enabled: boolean;
  initialize(): void;
  destroy(): void;
  update(deltaTime: number): void;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface EventData {
  type: string;
  timestamp: number;
  data?: Record<string, any>;
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  updateTime: number;
  renderTime: number;
  memoryUsed: number;
  memoryLimit: number;
  gpuUtilization: number;
  drawCalls: number;
  entityCount: number;
}

export interface FrameStats {
  timestamp: number;
  deltaTime: number;
  fps: number;
  memoryHeap: number;
  memoryLimit: number;
  cpuUsage: number;
}

// ============================================================================
// SHADER TYPES
// ============================================================================

export interface ShaderProgram {
  id: string;
  vertexSource: string;
  fragmentSource: string;
  compiled: boolean;
  uniforms: Map<string, WebGLUniformLocation>;
  attributes: Map<string, GLint>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class GameEngineError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameEngineError';
  }
}

export class ShaderCompileError extends GameEngineError {
  constructor(shader: string, message: string) {
    super('SHADER_COMPILE_ERROR', `Failed to compile shader: ${message}`, { shader });
  }
}

export class AssetLoadError extends GameEngineError {
  constructor(assetId: string, message: string) {
    super('ASSET_LOAD_ERROR', `Failed to load asset ${assetId}: ${message}`, { assetId });
  }
}

export class PhysicsError extends GameEngineError {
  constructor(message: string, context?: Record<string, any>) {
    super('PHYSICS_ERROR', message, context);
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

export interface Disposable {
  dispose(): void;
}

export interface Poolable extends Disposable {
  reset(): void;
}

export interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}
