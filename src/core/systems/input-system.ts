/**
 * Input System - Manages input handling
 * Handles keyboard and mouse input events
 */

import { Logger } from '@utils/logger';
import type { ISystem } from '../types';

export class InputSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private canvas: HTMLCanvasElement;
  private keysPressed: Set<string> = new Set();
  private mousePos: { x: number; y: number } = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.logger = new Logger('InputSystem');
    this.canvas = canvas;
  }

  initialize(): void {
    this.setupEventListeners();
    this.logger.info('Input system initialized');
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (e) => this.keysPressed.add(e.key));
    document.addEventListener('keyup', (e) => this.keysPressed.delete(e.key));
    this.canvas.addEventListener('mousemove', (e) => {
      this.mousePos = { x: e.clientX, y: e.clientY };
    });
  }

  update(deltaTime: number): void {
    // Input updates if needed
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  getMousePosition(): { x: number; y: number } {
    return this.mousePos;
  }

  destroy(): void {
    this.keysPressed.clear();
    this.logger.info('Input system destroyed');
  }
}
