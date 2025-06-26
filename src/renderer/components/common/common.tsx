/**
 * GigaChad Common UI Module
 * 모든 중복 UI 로직을 이곳에서 관리
 * 성능 최적화와 코드 재사용성을 위한 통합 모듈
 */

import { Log, TypingStats } from '../../shared/types';
import { Logger } from '../../shared/logger';

const log = Logger;

// #DEBUG: 타입 안정성을 위한 구체적 타입 정의
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'purple' | 'ghost' | 'icon' | 'small' | 'toggle';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type CardVariant = 'blue' | 'green' | 'slate' | 'purple' | 'panel' | 'stats' | 'settings';
export type InputVariant = 'base' | 'search' | 'textarea' | 'large';

export interface CommonButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export interface CommonCardProps {
  variant?: CardVariant;
  hover?: boolean;
  className?: string;
}

export interface CommonComponentProps {
  logs: Log[];
  loading?: boolean;
  onTypingComplete?: (stats: TypingStats) => void;
}


// #DEBUG: 공통 스타일 진입점
export const COMMON_STYLES = {
  // 🔥 Z-Index 체계 (GigaChad 표준)
  zIndex: {
    modal: 'z-[100]',     // 최상위 모달/알림
    tooltip: 'z-[90]',    // 툴팁
    dropdown: 'z-[80]',   // 드롭다운 메뉴
    floatingPanel: 'z-[70]', // 플로팅 패널 (AI, Typing)
    overlay: 'z-[60]',    // 오버레이
    header: 'z-[50]',     // 헤더
    sidebar: 'z-[40]',    // 사이드바
    backdrop: 'z-[30]',   // 백드롭
    mobileMenu: 'z-[20]', // 모바일 메뉴
    card: 'z-[10]'        // 카드
  },

  // Card 관련 중복 패턴들
  card: {
    base: 'bg-white border border-slate-200 rounded-lg p-6',
    hover: 'hover:shadow-lg transition-shadow cursor-pointer',
    variants: {
      blue: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300',
      green: 'bg-green-50 border border-green-200 hover:border-green-300',
      slate: 'bg-slate-50 border border-slate-200 hover:border-slate-300',
      purple: 'bg-purple-50 border border-purple-200 hover:border-purple-300',
      panel: 'bg-white shadow-xl border border-slate-200 z-[70]',
      stats: 'bg-blue-50 rounded-lg p-3',
      settings: 'bg-white border border-slate-200 rounded-lg p-6'
    }
  },

  // Button 관련 중복 패턴들
  button: {
    base: 'px-4 py-2 rounded-md font-medium transition-colors',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      success: 'bg-green-600 text-white hover:bg-green-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      purple: 'bg-purple-600 text-white hover:bg-purple-700',
      ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      icon: 'p-2 text-slate-600 hover:bg-slate-100 rounded-md',
      small: 'flex items-center gap-2 px-3 py-1.5 text-sm',
      toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    },
    sizes: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }
  },

  // Input 관련 중복 패턴들
  input: {
    base: 'border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    search: 'pl-10 w-64 px-3 py-2',
    textarea: 'w-full h-40 p-4 resize-none',
    large: 'w-full min-h-[80px] p-3'
  },

  // Layout 관련 중복 패턴들
  layout: {
    fixedPanel: 'absolute top-4 right-4 w-80 max-h-[80vh] overflow-hidden',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    cardGrid: 'h-[120px] flex flex-col justify-between cursor-pointer transition-colors',
    headerSection: 'bg-white border-b border-slate-200 p-6',
    mainContainer: 'flex-1 flex flex-col bg-slate-50',
    contentContainer: 'flex-1 overflow-y-auto p-6',
    statsGrid: 'grid grid-cols-4 gap-4 mb-4',
    flexColumn: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
  },

  // Text 스타일들
  text: {
    title: 'text-2xl font-bold text-slate-900',
    subtitle: 'text-slate-600 mt-1',
    statValue: 'text-2xl font-bold',
    statLabel: 'text-xs',
    setting: 'font-medium text-slate-900',
    description: 'text-sm text-slate-600'
  },

  // Animation 관련 중복 패턴들
  animations: {
    hoverUp: 'hover:-translate-y-0.5 transition-transform',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    fadeIn: 'animate-fade-in'
  }
} as const;

// #DEBUG: Props 인터페이스 통합 (실제 타입 사용)
export interface CommonPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface CommonCardProps {
  variant?: keyof typeof COMMON_STYLES.card.variants;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface CommonButtonProps {
  variant?: keyof typeof COMMON_STYLES.button.variants;
  size?: keyof typeof COMMON_STYLES.button.sizes;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// #DEBUG: 유틸리티 함수들
export const createClassName = (...classes: (string | undefined | false)[]): string => {
  // #DEBUG: className 결합 함수 진입
  return classes.filter(Boolean).join(' ');
};

export const getCardClassName = ({ 
  variant, 
  hover = true, 
  className = '' 
}: Partial<CommonCardProps>): string => {
  // #DEBUG: Card className 생성 진입
  const baseClass = COMMON_STYLES.card.base;
  const variantClass = variant ? COMMON_STYLES.card.variants[variant] : '';
  const hoverClass = hover ? COMMON_STYLES.card.hover : '';
  
  return createClassName(baseClass, variantClass, hoverClass, className);
};

export const getButtonClassName = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}: Partial<CommonButtonProps>): string => {
  // #DEBUG: Button className 생성 진입
  const baseClass = COMMON_STYLES.button.base;
  const variantClass = COMMON_STYLES.button.variants[variant];
  const sizeClass = COMMON_STYLES.button.sizes[size];
  
  return createClassName(baseClass, variantClass, sizeClass, className);
};

export const getInputClassName = ({ 
  variant = 'base', 
  className = '' 
}: { variant?: 'base' | 'search' | 'textarea' | 'large'; className?: string } = {}): string => {
  // #DEBUG: Input className 생성 진입
  const baseClass = COMMON_STYLES.input.base;
  const variantClass = variant !== 'base' ? COMMON_STYLES.input[variant] : '';
  
  return createClassName(baseClass, variantClass, className);
};

export const getLayoutClassName = ({ 
  variant, 
  className = '' 
}: { variant: keyof typeof COMMON_STYLES.layout; className?: string }): string => {
  // #DEBUG: Layout className 생성 진입
  return createClassName(COMMON_STYLES.layout[variant], className);
};

export const getTextClassName = ({ 
  variant, 
  className = '' 
}: { variant: keyof typeof COMMON_STYLES.text; className?: string }): string => {
  // #DEBUG: Text className 생성 진입
  return createClassName(COMMON_STYLES.text[variant], className);
};

// #DEBUG: 브라우저 메모리 확장 타입
interface WindowWithMemory extends Window {
  performance: Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  };
}

// 🔥 기가차드 메모리 측정 유틸리티 (Logger 사용)
export const measureMemory = (label: string): void => {
  if (typeof window !== 'undefined' && (window as WindowWithMemory).performance?.memory) {
    const memory = (window as WindowWithMemory).performance.memory!;
    const memoryData = {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
    };
    
    log.debug(`#MEMORY: ${label}`, memoryData);
  }
};

// #DEBUG: 성능 타이머 클래스
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    log.debug(`#TIMER: ${this.label} - ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// #DEBUG: 함수 진입/종료 로깅 (타입 안전)
export const debugEntry = (functionName: string, params?: unknown): void => {
  log.debug(`#DEBUG: ${functionName} 진입`, params || '');
};

export const debugExit = (functionName: string, result?: unknown): void => {
  log.debug(`#DEBUG: ${functionName} 종료`, result || '');
};

// #DEBUG: 성능 측정 유틸리티 (타입 안전)
export const measurePerformance = async <T = unknown>(
  operation: () => Promise<T> | T,
  operationName: string
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await operation();
    const end = performance.now();
    log.info(`#PERF: ${operationName} 실행시간: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    log.error(`#PERF: ${operationName} 실패 (${(end - start).toFixed(2)}ms):`, error);
    throw error;
  }
};

// #DEBUG: 벤치마크 유틸리티 (타입 안전)
export const benchmark = (fn: () => void, name: string, iterations: number = 10000): number => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const opsPerSecond = iterations / ((end - start) / 1000);
  log.info(`#BENCHMARK: ${name} - ${opsPerSecond.toFixed(0)} ops/sec`);
  return opsPerSecond;
};

// #DEBUG: 추가 중복 패턴 모듈화 (빈도 높은 것들)
export const ADDITIONAL_COMMON_PATTERNS = {
  // 가장 많이 중복되는 flex 패턴들 (78개 발견)
  flex: {
    itemsCenter: 'flex items-center',
    itemsCenterGap2: 'flex items-center gap-2',
    itemsCenterGap3: 'flex items-center gap-3',
    itemsCenterGap4: 'flex items-center gap-4',
    itemsCenterJustifyBetween: 'flex items-center justify-between',
    itemsCenterJustifyCenter: 'flex items-center justify-center'
  },

  // 중복되는 rounded 패턴들 (89개 발견)
  rounded: {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    button: 'rounded-md',
    card: 'rounded-lg'
  },

  // 중복되는 border 패턴들 (89개 발견)
  border: {
    base: 'border border-slate-300',
    card: 'border border-slate-200',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    bottom: 'border-b border-slate-200'
  },

  // 중복되는 bg 패턴들 (89개 발견)
  bg: {
    white: 'bg-white',
    slate50: 'bg-slate-50',
    slate100: 'bg-slate-100',
    blue600: 'bg-blue-600',
    blue50: 'bg-blue-50',
    green600: 'bg-green-600',
    purple600: 'bg-purple-600'
  },

  // 중복되는 padding 패턴들
  padding: {
    p3: 'p-3',
    p4: 'p-4',
    p6: 'p-6',
    px3py2: 'px-3 py-2',
    px4py2: 'px-4 py-2'
  },

  // 중복되는 icon container 패턴들
  iconContainer: {
    small: 'w-10 h-10 rounded-lg flex items-center justify-center',
    medium: 'w-12 h-12 rounded-lg flex items-center justify-center'
  },

  // 중복되는 transition 패턴들
  transition: {
    colors: 'transition-colors',
    all: 'transition-all duration-300',
    hover: 'hover:bg-slate-100 transition-colors'
  }
} as const;

// #DEBUG: 자주 사용되는 조합 패턴들
export const COMBO_PATTERNS = {
  headerSection: `${ADDITIONAL_COMMON_PATTERNS.bg.white} ${ADDITIONAL_COMMON_PATTERNS.border.bottom} ${ADDITIONAL_COMMON_PATTERNS.padding.p6}`,
  flexHeader: `${ADDITIONAL_COMMON_PATTERNS.flex.itemsCenterGap3}`,
  cardPattern: `${ADDITIONAL_COMMON_PATTERNS.bg.white} ${ADDITIONAL_COMMON_PATTERNS.border.card} ${ADDITIONAL_COMMON_PATTERNS.rounded.lg} ${ADDITIONAL_COMMON_PATTERNS.padding.p6}`,
  buttonPrimary: `${ADDITIONAL_COMMON_PATTERNS.bg.blue600} text-white ${ADDITIONAL_COMMON_PATTERNS.rounded.md} ${ADDITIONAL_COMMON_PATTERNS.padding.px4py2} ${ADDITIONAL_COMMON_PATTERNS.transition.colors}`,
  inputField: `${ADDITIONAL_COMMON_PATTERNS.border.base} ${ADDITIONAL_COMMON_PATTERNS.rounded.md} ${ADDITIONAL_COMMON_PATTERNS.padding.px3py2} ${ADDITIONAL_COMMON_PATTERNS.border.focus}`
} as const;

// #DEBUG: 패턴 유틸리티 함수들 추가
export const getAdditionalPattern = (category: keyof typeof ADDITIONAL_COMMON_PATTERNS, pattern: string): string => {
  // #DEBUG: 추가 패턴 접근 진입
  const categoryPatterns = ADDITIONAL_COMMON_PATTERNS[category] as Record<string, string>;
  return categoryPatterns[pattern] || '';
};

export const getComboPattern = (pattern: keyof typeof COMBO_PATTERNS): string => {
  // #DEBUG: 조합 패턴 접근 진입
  return COMBO_PATTERNS[pattern];
};

// #DEBUG: 단축 유틸리티 함수들
export const flexCenter = (): string => ADDITIONAL_COMMON_PATTERNS.flex.itemsCenterJustifyCenter;
export const flexBetween = (): string => ADDITIONAL_COMMON_PATTERNS.flex.itemsCenterJustifyBetween;
export const iconBox = (size: 'small' | 'medium' = 'small'): string => ADDITIONAL_COMMON_PATTERNS.iconContainer[size];
export const headerCard = (): string => COMBO_PATTERNS.headerSection;
export const baseCard = (): string => COMBO_PATTERNS.cardPattern;
export const primaryButton = (): string => COMBO_PATTERNS.buttonPrimary;
export const inputBase = (): string => COMBO_PATTERNS.inputField;

// 🔥 GigaChad Export 정리
export default COMMON_STYLES;
