/**
 * Moba-Engine: Main Entry Point
 * Professional Game Engine for Mobile Devices
 * Optimized for zero bugs, maximum performance, and full mobile compatibility
 */

export { MobaEngine } from '@core/engine';
export { GestureManager } from '@gesture/gesture-manager';
export type { GestureEvent, GestureTypes } from '@gesture/types';
export { Builder } from '@builder/builder';
export type { BuilderComponent, BuilderProject } from '@builder/builder';
export { EncryptionService } from '@encryption/encryption-service';
export { ExportService } from '@export-import/export-service';
export { ImportService } from '@export-import/import-service';
export { PerformanceMonitor } from '@performance/performance-monitor';
export type { PerformanceStats } from '@performance/performance-monitor';
export { Logger } from '@utils/logger';
export { MemoryManager } from '@utils/memory-manager';
export { DeviceDetector } from '@utils/device-detector';
export type { MobileDeviceConfig, GameConfig, GameObject } from '@utils/types';

export const VERSION = '1.0.0';
export const BUILD_TARGET = 'mobile';

// Singleton instance
let engineInstance: MobaEngine | null = null;

/**
 * Initialize Moba Engine with configuration
 * @param config Game configuration object
 * @returns Promise that resolves when engine is ready
 */
export async function initializeMobaEngine(config: GameConfig): Promise<MobaEngine> {
  if (engineInstance) {
    console.warn('Moba Engine already initialized');
    return engineInstance;
  }

  try {
    const { MobaEngine: Engine } = await import('@core/engine');
    engineInstance = new Engine();
    await engineInstance.initialize(config);
    return engineInstance;
  } catch (error) {
    console.error('Failed to initialize Moba Engine:', error);
    throw error;
  }
}

/**
 * Get existing engine instance
 * @returns Current engine instance or null
 */
export function getMobaEngine(): MobaEngine | null {
  return engineInstance;
}

/**
 * Destroy engine instance
 */
export function destroyMobaEngine(): void {
  if (engineInstance) {
    engineInstance.destroy();
    engineInstance = null;
  }
}
