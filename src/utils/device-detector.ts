/**
 * Device Detector - Optimized Mobile Device Detection
 * Zero-allocation after initialization, minimal runtime overhead
 */

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

export class DeviceDetector {
  private static instance: DeviceDetector;
  private capabilities: DeviceCapabilities | null = null;
  private cached: boolean = false;

  private constructor() {}

  static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector();
    }
    return DeviceDetector.instance;
  }

  /**
   * Detect device capabilities once and cache
   */
  detectCapabilities(): DeviceCapabilities {
    if (this.cached && this.capabilities) {
      return this.capabilities;
    }

    this.capabilities = {
      maxMemory: this.getDeviceMemory(),
      cpuCores: navigator.hardwareConcurrency || 4,
      gpu: this.detectGPU(),
      webglVersion: this.detectWebGLVersion(),
      touchSupport: this.detectTouchSupport(),
      orientationSupport: this.detectOrientationSupport(),
      vibrationSupport: this.detectVibrationSupport(),
      maxTextureSize: this.getMaxTextureSize(),
      maxFramebufferSize: this.getMaxFramebufferSize(),
    };

    this.cached = true;
    return this.capabilities;
  }

  private getDeviceMemory(): number {
    return (navigator as any).deviceMemory || 4;
  }

  private detectGPU(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl !== null;
    } catch {
      return false;
    }
  }

  private detectWebGLVersion(): '1.0' | '2.0' | 'none' {
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext('webgl2')) return '2.0';
      if (canvas.getContext('webgl')) return '1.0';
      return 'none';
    } catch {
      return 'none';
    }
  }

  private detectTouchSupport(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  private detectOrientationSupport(): boolean {
    return 'orientation' in window;
  }

  private detectVibrationSupport(): boolean {
    return 'vibrate' in navigator;
  }

  private getMaxTextureSize(): number {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 2048;
      return gl.getParameter(gl.MAX_TEXTURE_SIZE);
    } catch {
      return 2048;
    }
  }

  private getMaxFramebufferSize(): number {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 2048;
      return gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    } catch {
      return 2048;
    }
  }

  isPlatform(platform: 'android' | 'ios' | 'web'): boolean {
    const ua = navigator.userAgent.toLowerCase();
    switch (platform) {
      case 'android':
        return /android/.test(ua);
      case 'ios':
        return /iphone|ipad|ipod/.test(ua);
      case 'web':
        return !/android|iphone|ipad|ipod/.test(ua);
      default:
        return false;
    }
  }

  isMobile(): boolean {
    return /mobile|android|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  }

  isTablet(): boolean {
    return /ipad|android(?!.*mobile)/.test(navigator.userAgent.toLowerCase());
  }

  getDevicePixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  getScreenResolution(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
}
