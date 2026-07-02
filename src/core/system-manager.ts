/**
 * System Manager - Orchestrates all game systems
 * Manages system registration, initialization, updates, and lifecycle
 * Optimized for efficient system execution in priority order
 */

import { Logger } from '@utils/logger';
import type { ISystem } from './types';

interface RegisteredSystem {
  name: string;
  system: ISystem;
  priority: number;
}

/**
 * SystemManager orchestrates all game systems
 * - Registers systems with priority-based execution order
 * - Manages system lifecycle (initialize, update, destroy)
 * - Ensures systems execute in correct order
 */
export class SystemManager {
  private logger: Logger;
  private systems: Map<string, RegisteredSystem> = new Map();
  private sortedSystems: RegisteredSystem[] = [];
  private isDirty: boolean = false;

  constructor() {
    this.logger = new Logger('SystemManager');
  }

  /**
   * Register a system with priority
   * Higher priority = executes earlier in update cycle
   */
  register(name: string, system: ISystem, priority: number = 50): void {
    if (this.systems.has(name)) {
      this.logger.warn(`System '${name}' already registered, replacing`);
    }

    const registered: RegisteredSystem = { name, system, priority };
    this.systems.set(name, registered);
    this.isDirty = true;

    this.logger.info(`System '${name}' registered with priority ${priority}`);
  }

  /**
   * Unregister a system
   */
  unregister(name: string): void {
    const registered = this.systems.get(name);
    if (!registered) {
      this.logger.warn(`System '${name}' not found`);
      return;
    }

    registered.system.destroy();
    this.systems.delete(name);
    this.isDirty = true;

    this.logger.info(`System '${name}' unregistered`);
  }

  /**
   * Get a registered system
   */
  get(name: string): ISystem | undefined {
    return this.systems.get(name)?.system;
  }

  /**
   * Check if system is registered
   */
  has(name: string): boolean {
    return this.systems.has(name);
  }

  /**
   * Initialize all systems
   */
  initializeAll(): void {
    this.sortSystems();

    for (const registered of this.sortedSystems) {
      try {
        registered.system.initialize();
        this.logger.debug(`System '${registered.name}' initialized`);
      } catch (error) {
        this.logger.error(`Failed to initialize system '${registered.name}'`, error);
      }
    }

    this.logger.info(`All ${this.sortedSystems.length} systems initialized`);
  }

  /**
   * Update all systems in priority order
   */
  updateAll(deltaTime: number): void {
    // Re-sort if systems were added/removed
    if (this.isDirty) {
      this.sortSystems();
    }

    for (const registered of this.sortedSystems) {
      if (!registered.system.enabled) continue;

      try {
        registered.system.update(deltaTime);
      } catch (error) {
        this.logger.error(`Error updating system '${registered.name}'`, error);
      }
    }
  }

  /**
   * Destroy all systems in reverse order
   */
  destroyAll(): void {
    // Destroy in reverse order (LIFO - Last In First Out)
    for (let i = this.sortedSystems.length - 1; i >= 0; i--) {
      const registered = this.sortedSystems[i];
      try {
        registered.system.destroy();
        this.logger.debug(`System '${registered.name}' destroyed`);
      } catch (error) {
        this.logger.error(`Error destroying system '${registered.name}'`, error);
      }
    }

    this.systems.clear();
    this.sortedSystems.length = 0;
    this.logger.info('All systems destroyed');
  }

  /**
   * Enable a system
   */
  enable(name: string): void {
    const registered = this.systems.get(name);
    if (!registered) {
      this.logger.warn(`System '${name}' not found`);
      return;
    }

    registered.system.enabled = true;
    this.logger.debug(`System '${name}' enabled`);
  }

  /**
   * Disable a system
   */
  disable(name: string): void {
    const registered = this.systems.get(name);
    if (!registered) {
      this.logger.warn(`System '${name}' not found`);
      return;
    }

    registered.system.enabled = false;
    this.logger.debug(`System '${name}' disabled`);
  }

  /**
   * Get all registered systems
   */
  getAll(): RegisteredSystem[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get system count
   */
  getCount(): number {
    return this.systems.size;
  }

  /**
   * Sort systems by priority (higher = earlier execution)
   * Private method called automatically when needed
   */
  private sortSystems(): void {
    this.sortedSystems = Array.from(this.systems.values()).sort(
      (a, b) => b.priority - a.priority
    );
    this.isDirty = false;

    this.logger.debug(`Systems sorted: ${this.sortedSystems.map((s) => s.name).join(', ')}`);
  }

  /**
   * Get system execution order for debugging
   */
  getExecutionOrder(): string[] {
    return this.sortedSystems.map((s) => `${s.name} (${s.priority})`);
  }

  /**
   * Log all systems and their status
   */
  logStatus(): void {
    this.logger.info('=== System Status ===');
    for (const registered of this.sortedSystems) {
      const status = registered.system.enabled ? '✓ ENABLED' : '✗ DISABLED';
      this.logger.info(`${registered.name}: ${status} (priority: ${registered.priority})`);
    }
  }
}
