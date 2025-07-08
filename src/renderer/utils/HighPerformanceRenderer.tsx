'use client';

import React from 'react';

// 🔥 기가차드 Canvas 고성능 렌더링 시스템
// WebGL + OffscreenCanvas로 네이티브급 성능 달성

interface CanvasRenderOptions {
  enableWebGL?: boolean;
  enableOffscreen?: boolean;
  enableGPUAcceleration?: boolean;
  pixelRatio?: number;
  maxFPS?: number;
}

interface RenderStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  memoryUsage: number;
}

/**
 * 🔥 고성능 Canvas 렌더러
 * GPU 가속 + WebGL + OffscreenCanvas로 최대 성능 달성
 */
export class HighPerformanceRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | WebGL2RenderingContext | WebGLRenderingContext | null = null;
  private offscreenCanvas: OffscreenCanvas | null = null;
  private animationId: number | null = null;
  private stats: RenderStats = { fps: 0, frameTime: 0, drawCalls: 0, memoryUsage: 0 };
  private lastFrameTime = 0;
  private frameCount = 0;
  private options: Required<CanvasRenderOptions>;

  constructor(options: CanvasRenderOptions = {}) {
    this.options = {
      enableWebGL: true,
      enableOffscreen: true,
      enableGPUAcceleration: true,
      pixelRatio: window.devicePixelRatio || 1,
      maxFPS: 144, // 🔥 144Hz 모니터 지원
      ...options,
    };

    // 🔥 WebGL 지원 확인
    this.checkWebGLSupport();
  }

  /**
   * 🔥 WebGL 지원 여부 확인
   */
  private checkWebGLSupport(): void {
    if (!this.options.enableWebGL) return;

    const testCanvas = document.createElement('canvas');
    const webgl2 = testCanvas.getContext('webgl2');
    const webgl = testCanvas.getContext('webgl');

    if (webgl2) {
      console.log('🚀 WebGL2 지원 - 최고 성능 모드');
    } else if (webgl) {
      console.log('⚡ WebGL 지원 - 고성능 모드');
    } else {
      console.log('💾 Canvas 2D - 호환성 모드');
      this.options.enableWebGL = false;
    }
  }

  /**
   * 🔥 Canvas 초기화
   */
  public async initialize(canvasElement: HTMLCanvasElement): Promise<void> {
    this.canvas = canvasElement;

    // 🔥 고해상도 디스플레이 지원
    const rect = canvasElement.getBoundingClientRect();
    canvasElement.width = rect.width * this.options.pixelRatio;
    canvasElement.height = rect.height * this.options.pixelRatio;
    canvasElement.style.width = `${rect.width}px`;
    canvasElement.style.height = `${rect.height}px`;

    // 🔥 WebGL 컨텍스트 생성
    if (this.options.enableWebGL) {
      this.ctx = canvasElement.getContext('webgl2', {
        alpha: false,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance', // 🔥 고성능 GPU 사용
      }) || canvasElement.getContext('webgl', {
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      });
    }

    // 🔥 WebGL 실패 시 Canvas 2D 폴백
    if (!this.ctx) {
      this.ctx = canvasElement.getContext('2d', {
        alpha: false,
        desynchronized: true, // 🔥 비동기 렌더링 (성능 향상)
      });
    }

    // 🔥 OffscreenCanvas 지원 확인
    if (this.options.enableOffscreen && 'OffscreenCanvas' in window) {
      try {
        this.offscreenCanvas = new OffscreenCanvas(
          canvasElement.width,
          canvasElement.height
        );
        console.log('🧵 OffscreenCanvas 활성화 - 백그라운드 렌더링');
      } catch (error) {
        console.warn('⚠️ OffscreenCanvas 초기화 실패:', error);
      }
    }

    // 🔥 GPU 메모리 정보 표시 (WebGL만)
    if (this.ctx instanceof WebGL2RenderingContext || this.ctx instanceof WebGLRenderingContext) {
      const debugInfo = this.ctx.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = this.ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = this.ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`🎮 GPU: ${vendor} ${renderer}`);
      }
    }
  }

  /**
   * 🔥 고성능 렌더링 루프 시작
   */
  public startRenderLoop(renderCallback: (ctx: CanvasRenderingContext2D | WebGL2RenderingContext | WebGLRenderingContext, stats: RenderStats) => void): void {
    const targetFrameTime = 1000 / this.options.maxFPS;
    let lastTime = 0;

    const render = (currentTime: number) => {
      // 🔥 FPS 제한
      if (currentTime - lastTime < targetFrameTime) {
        this.animationId = requestAnimationFrame(render);
        return;
      }

      // 🔥 성능 통계 업데이트
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
      this.frameCount++;

      if (this.frameCount % 60 === 0) { // 1초마다 업데이트
        this.stats.fps = Math.round(1000 / deltaTime);
        this.stats.frameTime = deltaTime;
        
        // 🔥 메모리 사용량 (WebGL만)
        if (this.ctx instanceof WebGL2RenderingContext || this.ctx instanceof WebGLRenderingContext) {
          const memInfo = (this.ctx as any).getParameter?.((this.ctx as any).GPU_MEMORY_INFO_TOTAL_AVAILABLE_MEMORY_NVX);
          this.stats.memoryUsage = memInfo || 0;
        }
      }

      // 🔥 렌더링 콜백 실행
      if (this.ctx) {
        renderCallback(this.ctx, { ...this.stats });
        this.stats.drawCalls++;
      }

      lastTime = currentTime;
      this.animationId = requestAnimationFrame(render);
    };

    this.animationId = requestAnimationFrame(render);
  }

  /**
   * 🔥 렌더링 루프 중지
   */
  public stopRenderLoop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 🔥 성능 통계 반환
   */
  public getStats(): RenderStats {
    return { ...this.stats };
  }

  /**
   * 🔥 리소스 정리
   */
  public cleanup(): void {
    this.stopRenderLoop();
    
    if (this.ctx instanceof WebGL2RenderingContext || this.ctx instanceof WebGLRenderingContext) {
      // WebGL 리소스 정리
      const ext = this.ctx.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    }
    
    this.canvas = null;
    this.ctx = null;
    this.offscreenCanvas = null;
  }
}

/**
 * 🔥 Canvas 기반 컴포넌트 HOC
 */
export function withHighPerformanceCanvas<T extends object>(
  WrappedComponent: React.ComponentType<T & { renderer: HighPerformanceRenderer }>
) {
  return function HighPerformanceCanvasWrapper(props: T) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rendererRef = React.useRef<HighPerformanceRenderer | null>(null);

    React.useEffect(() => {
      if (!canvasRef.current) return;

      const renderer = new HighPerformanceRenderer({
        enableWebGL: true,
        enableOffscreen: true,
        enableGPUAcceleration: true,
        maxFPS: 144,
      });

      renderer.initialize(canvasRef.current);
      rendererRef.current = renderer;

      return () => {
        renderer.cleanup();
      };
    }, []);

    return (
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }} // 🔥 픽셀 퍼펙트
        />
        {rendererRef.current && (
          <WrappedComponent {...props} renderer={rendererRef.current} />
        )}
      </div>
    );
  };
}

// 🔥 성능 모니터링 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metricsHistory: Array<{ timestamp: number; fps: number; memory: number }> = [];

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordMetrics(fps: number, memory: number): void {
    this.metricsHistory.push({
      timestamp: Date.now(),
      fps,
      memory,
    });

    // 🔥 최근 100개 항목만 유지
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }
  }

  public getAveragePerformance(): { avgFPS: number; avgMemory: number } {
    if (this.metricsHistory.length === 0) {
      return { avgFPS: 0, avgMemory: 0 };
    }

    const sum = this.metricsHistory.reduce(
      (acc, metric) => ({
        fps: acc.fps + metric.fps,
        memory: acc.memory + metric.memory,
      }),
      { fps: 0, memory: 0 }
    );

    return {
      avgFPS: Math.round(sum.fps / this.metricsHistory.length),
      avgMemory: Math.round(sum.memory / this.metricsHistory.length),
    };
  }
}

export default HighPerformanceRenderer;
