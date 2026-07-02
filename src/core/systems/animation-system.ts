/**
 * Animation System - Manages sprite and property animations
 * Handles keyframe animations, tweens, and frame-based animations
 */

import { Logger } from '@utils/logger';
import type { ISystem } from '../types';

export class AnimationSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private animations: Map<string, any> = new Map();

  constructor() {
    this.logger = new Logger('AnimationSystem');
  }

  initialize(): void {
    this.logger.info('Animation system initialized');
  }

  update(deltaTime: number): void {
    // Update active animations
    for (const animation of this.animations.values()) {
      if (!animation.active) continue;

      animation.currentTime += deltaTime;
      if (animation.currentTime >= animation.duration) {
        animation.active = false;
      }
    }
  }

  destroy(): void {
    this.animations.clear();
    this.logger.info('Animation system destroyed');
  }
}
