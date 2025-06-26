/**
 * 🔥 기가차드 헬스체크 매니저
 * Loop Advanced Health Check Manager - 시스템 상태 모니터링
 */

import { EventEmitter } from 'events';
import { KEYBOARD_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';
import { GigaChadLogger } from '../../shared/logger';
const logger = GigaChadLogger.getInstance();

export interface SystemHealth {
  memory: {
    used: number;
    limit: number;
    percentage: number;
    isHealthy: boolean;
  };
  permissions: {
    accessibility: boolean | null;
    inputMonitoring: boolean | null;
    screenRecording: boolean | null;
    isHealthy: boolean;
  };
  queues: {
    keyEventQueue: number;
    batchQueue: number;
    isHealthy: boolean;
  };
  performance: {
    averageProcessingTime: number;
    errorRate: number;
    isHealthy: boolean;
  };
  overall: 'healthy' | 'warning' | 'critical';
}

export interface HealthAlert {
  level: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * 🔥 기가차드 헬스체크 매니저
 */
export class HealthCheckManager extends EventEmitter {
  private static instance: HealthCheckManager;
  private isRunning = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private performanceMetrics: Map<string, number[]> = new Map();
  private errorCount = 0;
  private lastErrorTime = 0;
  private alerts: HealthAlert[] = [];

  private constructor() {
    super();
  }

  static getInstance(): HealthCheckManager {
    if (!HealthCheckManager.instance) {
      HealthCheckManager.instance = new HealthCheckManager();
    }
    return HealthCheckManager.instance;
  }

  /**
   * 헬스체크 시작
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, KEYBOARD_CONSTANTS.PERMISSION_CHECK_INTERVAL); // 30초마다

    logger.info('HealthCheck', '🏥 헬스체크 매니저 시작됨');
  }

  /**
   * 헬스체크 중지
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    logger.info('HealthCheck', '🏥 헬스체크 매니저 중지됨');
  }

  /**
   * 성능 메트릭 기록
   */
  public recordPerformanceMetric(operation: string, duration: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }

    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(duration);

    // 최근 100개 기록만 유지
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * 에러 기록
   */
  public recordError(component: string, error: Error): void {
    this.errorCount++;
    this.lastErrorTime = Date.now();

    const alert: HealthAlert = {
      level: 'error',
      component,
      message: error.message,
      timestamp: Date.now(),
      metadata: { stack: error.stack }
    };

    this.addAlert(alert);
  }

  /**
   * 경고 추가
   */
  public addAlert(alert: HealthAlert): void {
    this.alerts.push(alert);

    // 최근 50개 알림만 유지
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }

    this.emit('health-alert', alert);
    logger.warn('HealthCheck', `🚨 ${alert.level}: ${alert.component} - ${alert.message}`);
  }

  /**
   * 메모리 상태 확인
   */
  private checkMemoryHealth(): SystemHealth['memory'] {
    const memoryUsage = process.memoryUsage();
    const used = memoryUsage.heapUsed;
    const limit = KEYBOARD_CONSTANTS.MAX_QUEUE_SIZE * 1024 * 1024; // MB to bytes
    const percentage = (used / limit) * 100;

    return {
      used,
      limit,
      percentage,
      isHealthy: percentage < 80
    };
  }

  /**
   * 큐 상태 확인
   */
  private checkQueueHealth(keyEventQueueSize: number, batchQueueSize: number): SystemHealth['queues'] {
    const totalQueueSize = keyEventQueueSize + batchQueueSize;
    const isHealthy = totalQueueSize < KEYBOARD_CONSTANTS.MAX_QUEUE_SIZE * 0.8;

    if (!isHealthy) {
      this.addAlert({
        level: 'warning',
        component: 'QueueManager',
        message: `큐 크기가 임계값을 초과했습니다: ${totalQueueSize}`,
        timestamp: Date.now()
      });
    }

    return {
      keyEventQueue: keyEventQueueSize,
      batchQueue: batchQueueSize,
      isHealthy
    };
  }

  /**
   * 성능 상태 확인
   */
  private checkPerformanceHealth(): SystemHealth['performance'] {
    const averageProcessingTime = this.calculateAverageProcessingTime();
    const errorRate = this.calculateErrorRate();

    return {
      averageProcessingTime,
      errorRate,
      isHealthy: averageProcessingTime < 50 && errorRate < 0.01 // 50ms 미만, 1% 미만
    };
  }

  /**
   * 평균 처리 시간 계산
   */
  private calculateAverageProcessingTime(): number {
    let totalTime = 0;
    let totalCount = 0;

    for (const metrics of this.performanceMetrics.values()) {
      totalTime += metrics.reduce((sum, time) => sum + time, 0);
      totalCount += metrics.length;
    }

    return totalCount > 0 ? totalTime / totalCount : 0;
  }

  /**
   * 에러율 계산
   */
  private calculateErrorRate(): number {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // 지난 1시간 내 에러만 계산
    if (now - this.lastErrorTime > oneHour) {
      this.errorCount = 0;
      return 0;
    }

    // 간단한 에러율 계산 (실제로는 더 정교한 계산 필요)
    return this.errorCount / 1000; // 가정: 1시간에 1000회 작업
  }

  /**
   * 전체 헬스체크 수행
   */
  private async performHealthCheck(): Promise<SystemHealth> {
    try {
      const memory = this.checkMemoryHealth();
      
      // 권한 상태는 KeyboardEngine에서 가져와야 함 (임시로 건전한 상태로 설정)
      const permissions = {
        accessibility: true,
        inputMonitoring: true,
        screenRecording: true,
        isHealthy: true
      };

      // 큐 상태는 실제 큐 크기를 받아야 함 (임시로 0으로 설정)
      const queues = this.checkQueueHealth(0, 0);
      const performance = this.checkPerformanceHealth();

      // 전체 상태 결정
      let overall: SystemHealth['overall'] = 'healthy';
      if (!memory.isHealthy || !permissions.isHealthy || !queues.isHealthy) {
        overall = 'warning';
      }
      if (!performance.isHealthy || memory.percentage > 90) {
        overall = 'critical';
      }

      const health: SystemHealth = {
        memory,
        permissions,
        queues,
        performance,
        overall
      };

      this.emit('health-check', health);

      if (overall !== 'healthy') {
        logger.warn('HealthCheck', `⚠️ 시스템 상태: ${overall}`, health);
      }

      return health;

    } catch (error) {
      logger.error('HealthCheck', '헬스체크 수행 실패', error);
      this.recordError('HealthCheckManager', error as Error);
      
      return {
        memory: { used: 0, limit: 0, percentage: 100, isHealthy: false },
        permissions: { accessibility: null, inputMonitoring: null, screenRecording: null, isHealthy: false },
        queues: { keyEventQueue: 0, batchQueue: 0, isHealthy: false },
        performance: { averageProcessingTime: 1000, errorRate: 1, isHealthy: false },
        overall: 'critical'
      };
    }
  }

  /**
   * 현재 알림 목록 가져오기
   */
  public getAlerts(): HealthAlert[] {
    return [...this.alerts];
  }

  /**
   * 성능 메트릭 가져오기
   */
  public getPerformanceMetrics(): Map<string, number[]> {
    return new Map(this.performanceMetrics);
  }

  /**
   * 정리
   */
  public cleanup(): void {
    this.stop();
    this.performanceMetrics.clear();
    this.alerts.length = 0;
    this.removeAllListeners();
  }
}
