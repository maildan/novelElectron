/**
 * 🔥 기가차드 대시보드 타입 정의
 * Dashboard Component Type Definitions
 */

// #DEBUG: 대시보드 모니터링 데이터 타입
export interface MonitoringData {
  wpm: number;
  words: number;
  time: number;
  accuracy?: number;
  errors?: number;
  sessionId?: string;
}

// #DEBUG: 최근 파일 타입
export interface RecentFile {
  id: string;
  name: string;
  path: string;
  type: string;
  project: string;
  time: string;
  status: 'active' | 'completed' | 'draft' | 'archived';
  lastModified: Date;
  size?: number;
  wordCount?: number;
}

// #DEBUG: 활성 프로젝트 타입
export interface ActiveProject {
  id: string;
  title: string;
  progress: number; // 0-100
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  deadline: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  team?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

// #DEBUG: 대시보드 통계 타입
export interface DashboardStats {
  totalSessions: number;
  totalWords: number;
  totalTime: number; // seconds
  averageWPM: number;
  averageAccuracy: number;
  todayStats: {
    sessions: number;
    words: number;
    time: number;
    wpm: number;
  };
  weeklyStats: {
    sessions: number[];
    words: number[];
    time: number[];
  };
}

// #DEBUG: AI 패널 상태 타입
export interface AIPanelState {
  isOpen: boolean;
  isLoading: boolean;
  currentQuery: string;
  suggestions: string[];
  history: AIQueryHistory[];
}

// #DEBUG: AI 쿼리 히스토리 타입
export interface AIQueryHistory {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  rating?: number; // 1-5
}

// #DEBUG: 대시보드 설정 타입
export interface DashboardConfig {
  refreshInterval: number; // milliseconds
  showRecentFiles: boolean;
  showActiveProjects: boolean;
  showStats: boolean;
  showAIPanel: boolean;
  maxRecentFiles: number;
  maxActiveProjects: number;
}

// #DEBUG: 실시간 모니터링 설정 타입
export interface MonitoringConfig {
  enabled: boolean;
  updateInterval: number; // milliseconds
  trackMouseMovement: boolean;
  trackKeyStrokes: boolean;
  trackApplications: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // minutes
}
