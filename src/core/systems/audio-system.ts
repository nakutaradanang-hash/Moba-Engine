/**
 * Audio System - Manages sound and music playback
 * Handles audio context, sound pooling, and audio playback
 */

import { Logger } from '@utils/logger';
import type { ISystem } from '../types';

export class AudioSystem implements ISystem {
  enabled: boolean = true;
  private logger: Logger;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private activeSources: AudioBufferSource[] = [];

  constructor() {
    this.logger = new Logger('AudioSystem');
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.logger.info('Audio context initialized');
      }
    } catch (error) {
      this.logger.warn('Audio context not available', error);
    }
  }

  initialize(): void {
    this.logger.info('Audio system initialized');
  }

  update(deltaTime: number): void {
    // Cleanup finished sources
    this.activeSources = this.activeSources.filter((source) => !source.context);
  }

  destroy(): void {
    this.activeSources.forEach((source) => source.stop());
    this.activeSources = [];
    this.sounds.clear();
    this.audioContext?.close();
    this.logger.info('Audio system destroyed');
  }
}

// Type definitions for AudioBufferSource
declare class AudioBufferSource {
  context: AudioContext | null;
  stop(): void;
}
