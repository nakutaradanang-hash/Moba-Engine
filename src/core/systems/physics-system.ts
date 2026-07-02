/**
 * Physics System - Manages physics simulation
 * Handles rigid bodies, collision detection, and physics updates
 */

import { Logger } from '@utils/logger';
import type { ISystem } from '../types';

export class PhysicsSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private isLowEnd: boolean;
  private gravity: { x: number; y: number } = { x: 0, y: 9.8 };
  private bodies: any[] = [];

  constructor(isLowEnd: boolean = false) {
    this.logger = new Logger('PhysicsSystem');
    this.isLowEnd = isLowEnd;
  }

  initialize(): void {
    this.logger.info('Physics system initialized', { isLowEnd: this.isLowEnd });
  }

  update(deltaTime: number): void {
    // Clamp deltaTime to prevent instability
    const dt = Math.min(deltaTime, 1 / 30);

    // Update bodies
    for (const body of this.bodies) {
      if (!body.active) continue;

      // Apply gravity
      body.velocityY += this.gravity.y * dt;

      // Update position
      body.x += body.velocityX * dt;
      body.y += body.velocityY * dt;

      // Apply friction/damping
      body.velocityX *= 0.99;
      body.velocityY *= 0.99;
    }
  }

  setGravity(x: number, y: number): void {
    this.gravity = { x, y };
  }

  destroy(): void {
    this.bodies = [];
    this.logger.info('Physics system destroyed');
  }
}
