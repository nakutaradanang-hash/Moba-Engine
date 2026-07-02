/**
 * Render System - Manages rendering pipeline
 * Handles drawing to canvas or WebGL context
 */

import { Logger } from '@utils/logger';
import type { ISystem, MobileDeviceConfig } from '../types';

export class RenderSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private isWebGL: boolean;
  private deviceConfig: MobileDeviceConfig;
  private drawCalls: number = 0;

  constructor(
    context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null,
    canvas: HTMLCanvasElement,
    isWebGL: boolean,
    deviceConfig: MobileDeviceConfig
  ) {
    this.logger = new Logger('RenderSystem');
    this.context = context!;
    this.canvas = canvas;
    this.isWebGL = isWebGL;
    this.deviceConfig = deviceConfig;
  }

  initialize(): void {
    this.logger.info('Render system initialized', {
      isWebGL: this.isWebGL,
      canvasSize: `${this.canvas.width}x${this.canvas.height}`,
    });
  }

  update(deltaTime: number): void {
    this.drawCalls = 0;
  }

  beginFrame(): void {
    if (this.isWebGL) {
      const gl = this.context as WebGLRenderingContext;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    } else {
      const ctx = this.context as CanvasRenderingContext2D;
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  endFrame(): void {
    // Frame-end cleanup if needed
  }

  getDrawCalls(): number {
    return this.drawCalls;
  }

  destroy(): void {
    this.logger.info('Render system destroyed');
  }
}
