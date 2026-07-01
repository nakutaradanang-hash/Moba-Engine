/**
 * Global Type Definitions
 * Fully typed, optimized for mobile devices
 */

export interface MobileDeviceConfig {
  isMobile: boolean;
  platform: 'android' | 'ios' | 'web';
  dpr: number;
  memory: number;
  cores: number;
  touchEnabled: () => boolean;
  maxTextureSize?: number;
  maxCanvasSize?: number;
}

export interface GameConfig {
  canvasSelector?: string;
  enableGestures?: boolean;
  targetFPS?: number;
  deviceConfig?: MobileDeviceConfig;
  renderingMode?: 'canvas2d' | 'webgl';
  enableDevTools?: boolean;
  enableEncryption?: boolean;
  memoryLimit?: number;
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
  update: (deltaTime: number) => void;
  render: (context: CanvasRenderingContext2D | WebGLRenderingContext) => void;
  destroy?: () => void;
}

export interface RenderContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | WebGLRenderingContext;
  dpr: number;
  width: number;
  height: number;
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
