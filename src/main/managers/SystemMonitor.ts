import { Logger } from "@shared/logger";
const log = Logger;/**
 * 🔥 기가차드 시스템 모니터 - 간단 버전
 * Loop Typing Analytics - System Monitor
 */

import { EventEmitter } from 'events';
import * as os from 'os';
import { app } from 'electron';

export interface SystemStats {
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  cpu: {
    count: number;
    usage: number;
  };
  uptime: number;
  loadAverage: number[];
}

export class SystemMonitor extends EventEmitter {
  private static instance: SystemMonitor;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  private constructor() {
    super();
  }

  static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  /**
   * 모니터링 시작
   */
  startMonitoring(intervalMs: number = 5000): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      const stats = this.getSystemStats();
      this.emit('stats', stats);
    }, intervalMs);

    log.info("Console", '📊 시스템 모니터링 시작됨');
  }

  /**
   * 모니터링 중지
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    log.info("Console", '📊 시스템 모니터링 중지됨');
  }

  /**
   * 현재 시스템 통계 가져오기
   */
  getSystemStats(): SystemStats {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percentage: Math.round((usedMem / totalMem) * 100)
      },
      cpu: {
        count: os.cpus().length,
        usage: 0 // CPU 사용률은 복잡하므로 나중에 구현
      },
      uptime: os.uptime(),
      loadAverage: os.loadavg()
    };
  }

  /**
   * 앱 통계 가져오기
   */
  getAppStats() {
    const memoryUsage = process.memoryUsage();
    
    return {
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
      },
      uptime: Math.round(process.uptime()) + 's'
    };
  }

  /**
   * 정리
   */
  cleanup(): void {
    this.stopMonitoring();
    this.removeAllListeners();
    log.info("Console", '🧹 시스템 모니터 정리 완료');
  }
}
