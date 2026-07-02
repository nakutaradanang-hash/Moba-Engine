/**
 * Camera System - Manages camera positioning and projection
 * Handles camera transforms, culling, and viewport management
 */

import { Logger } from '@utils/logger';
import type { ISystem, MobileDeviceConfig } from '../types';

export class CameraSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private canvas: HTMLCanvasElement;
  private deviceConfig: MobileDeviceConfig;
  private x: number = 0;
  private y: number = 0;
  private scale: number = 1;
  private rotation: number = 0;
  private width: number = 0;
  private height: number = 0;
  private viewMatrix: Float32Array = new Float32Array(16);
  private projectionMatrix: Float32Array = new Float32Array(16);

  constructor(canvas: HTMLCanvasElement, deviceConfig: MobileDeviceConfig) {
    this.logger = new Logger('CameraSystem');
    this.canvas = canvas;
    this.deviceConfig = deviceConfig;
    this.width = canvas.width / deviceConfig.dpr;
    this.height = canvas.height / deviceConfig.dpr;
    this.updateMatrices();
  }

  initialize(): void {
    this.logger.info('Camera system initialized');
  }

  update(deltaTime: number): void {
    // Camera update logic can be extended here
    // e.g., smooth following, bounds checking, etc.
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.updateMatrices();
  }

  setScale(scale: number): void {
    this.scale = Math.max(0.1, scale);
    this.updateMatrices();
  }

  setRotation(rotation: number): void {
    this.rotation = rotation;
    this.updateMatrices();
  }

  onResize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.updateMatrices();
  }

  private updateMatrices(): void {
    // Update view matrix
    this.createIdentityMatrix(this.viewMatrix);
    this.translateMatrix(this.viewMatrix, -this.x, -this.y);
    this.scaleMatrix(this.viewMatrix, this.scale, this.scale);

    // Update projection matrix (orthographic for 2D)
    this.createOrthographicMatrix(
      this.projectionMatrix,
      0,
      this.width,
      this.height,
      0,
      -1,
      1
    );
  }

  getViewMatrix(): Float32Array {
    return this.viewMatrix;
  }

  getProjectionMatrix(): Float32Array {
    return this.projectionMatrix;
  }

  private createIdentityMatrix(m: Float32Array): void {
    m.fill(0);
    m[0] = m[5] = m[10] = m[15] = 1;
  }

  private createOrthographicMatrix(
    m: Float32Array,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): void {
    m[0] = 2 / (right - left);
    m[5] = 2 / (top - bottom);
    m[10] = -2 / (far - near);
    m[12] = -(right + left) / (right - left);
    m[13] = -(top + bottom) / (top - bottom);
    m[14] = -(far + near) / (far - near);
    m[15] = 1;
  }

  private translateMatrix(m: Float32Array, x: number, y: number): void {
    m[12] += m[0] * x + m[4] * y;
    m[13] += m[1] * x + m[5] * y;
  }

  private scaleMatrix(m: Float32Array, x: number, y: number): void {
    m[0] *= x;
    m[1] *= x;
    m[4] *= y;
    m[5] *= y;
  }

  destroy(): void {
    this.logger.info('Camera system destroyed');
  }
}
