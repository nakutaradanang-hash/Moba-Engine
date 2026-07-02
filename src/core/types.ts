/**
 * Core Type Definitions
 * Comprehensive TypeScript interfaces for the game engine
 */

export interface ISystem {
  enabled: boolean;
  initialize(): void;
  update(deltaTime: number): void;
  destroy(): void;
}

export interface IComponent {
  entity?: Entity;
  onAttach?(): void;
  onDetach?(): void;
  onEnable?(): void;
  onDisable?(): void;
}

export interface Entity {
  id: string;
  name: string;
  enabled: boolean;
  visible: boolean;
  components: Map<string, IComponent>;
  addComponent(type: string, component: IComponent): IComponent;
  getComponent(type: string): IComponent | undefined;
  hasComponent(type: string): boolean;
  removeComponent(type: string): void;
  destroy(): void;
}

export interface Scene {
  id: string;
  name: string;
  entities: Map<string, Entity>;
  onLoad(): Promise<void>;
  onUnload(): Promise<void>;
  onUpdate(deltaTime: number): void;
  onRender(context: RenderContext): void;
}

export interface GameConfig {
  canvasSelector?: string;
  enableGestures?: boolean;
  enableInput?: boolean;
  targetFPS?: number;
  renderingMode?: 'canvas2d' | 'webgl' | 'webgl2';
  backgroundColor?: [number, number, number, number];
  memoryLimit?: number;
}

export interface MobileDeviceConfig {
  isMobile: boolean;
  isTablet: boolean;
  platform: 'android' | 'ios' | 'web';
  dpr: number;
  memory: number;
  cores: number;
  touchEnabled(): boolean;
  maxTextureSize?: number;
  maxCanvasSize?: number;
  maxFramebufferSize?: number;
}

export interface DeviceCapabilities {
  maxMemory: number;
  cpuCores: number;
  gpu: boolean;
  webglVersion: '1.0' | '2.0' | 'none';
  touchSupport: boolean;
  orientationSupport: boolean;
  vibrationSupport: boolean;
  maxTextureSize: number;
  maxFramebufferSize: number;
}

export interface RenderContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext;
  dpr: number;
  width: number;
  height: number;
  isWebGL: boolean;
}

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

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scale?: number;
  visible?: boolean;
  zIndex?: number;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D | WebGLRenderingContext): void;
  destroy?(): void;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  position: Vector2;
  rotation: number;
  scale: Vector2;
}
