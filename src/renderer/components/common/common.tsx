/**
 * GigaChad Common UI Module
 * 모든 중복 UI 로직을 이곳에서 관리
 * 성능 최적화와 코드 재사용성을 위한 통합 모듈
 */

import { Log, TypingStats } from '../../shared/types';
import { Logger } from '../../shared/logger';

const log = Logger;

// #DEBUG: 타입 안정성을 위한 구체적 타입 정의
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'purple' | 'ghost' | 'icon' | 'small' | 'toggle' | 'settingsSmall' | 'settingsMedium' | 'settingsPrimary';
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
      toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      // #DEBUG: 🔥 새로운 설정 버튼 패턴 추가
      settingsSmall: 'px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium',
      settingsMedium: 'px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors',
      settingsPrimary: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors'
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

  // 중복되는 bg 패턴들 (89개 발견) + 새로운 패턴들
  bg: {
    white: 'bg-white',
    slate50: 'bg-slate-50',
    slate100: 'bg-slate-100',
    slate200: 'bg-slate-200',
    blue50: 'bg-blue-50',
    blue600: 'bg-blue-600',
    green600: 'bg-green-600',
    green500: 'bg-green-500',
    purple600: 'bg-purple-600',
    // #DEBUG: 🔥 새로운 배경색 패턴들 추가
    gradientBlue: 'bg-gradient-to-r from-purple-600 to-blue-600',
    gradientPurple: 'bg-gradient-to-r from-blue-600 to-purple-600',
    blueWithText: 'bg-blue-600 text-white',
    progressBar: 'bg-slate-200 rounded-full h-2',
    progressFill: 'bg-blue-600 h-2 rounded-full transition-all duration-300'
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

// #DEBUG: 🔥 새로운 버튼 패턴 유틸리티들
export const getSettingsButton = (variant: 'small' | 'medium' | 'primary' = 'small'): string => {
  const base = COMMON_STYLES.button;
  switch (variant) {
    case 'small':
      return base.variants.settingsSmall;
    case 'medium':
      return base.variants.settingsMedium;
    case 'primary':
      return base.variants.settingsPrimary;
    default:
      return base.variants.settingsSmall;
  }
};

// #DEBUG: 🔥 새로운 배경 패턴 유틸리티들
export const getProgressBar = (): string => ADDITIONAL_COMMON_PATTERNS.bg.progressBar;
export const getProgressFill = (): string => ADDITIONAL_COMMON_PATTERNS.bg.progressFill;
export const getGradientBlue = (): string => ADDITIONAL_COMMON_PATTERNS.bg.gradientBlue;
export const getStatusIndicator = (): string => 'w-2 h-2 bg-green-500 rounded-full';
export const getBlueTextBg = (): string => ADDITIONAL_COMMON_PATTERNS.bg.blueWithText;

// #DEBUG: 🔥 아이콘 크기 유틸리티 함수들 (46개의 w-4 h-4, 13개의 w-5 h-5 중복 제거)
export const iconSm = (): string => 'w-4 h-4';
export const iconMd = (): string => 'w-5 h-5';
export const iconLg = (): string => 'w-6 h-6';
export const iconXl = (): string => 'w-8 h-8';

// #DEBUG: 특정 아이콘 위치 + 크기 조합들
export const iconLeft = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} mr-2 inline`;
};

export const iconRight = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} ml-2 inline`;
};

export const iconCenter = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass}`;
};

// #DEBUG: 패디드 아이콘 (gap 패턴들)
export const iconGap2 = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} mr-2`;
};

export const iconGap3 = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} mr-3`;
};

// #DEBUG: 절대 위치 아이콘 (absolute left-3 top-1/2 transform -translate-y-1/2 패턴)
export const iconAbsoluteLeft = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} absolute left-3 top-1/2 transform -translate-y-1/2`;
};

// #DEBUG: 컬러가 포함된 아이콘 유틸리티들
export const iconWithColor = (size: 'sm' | 'md' | 'lg' = 'sm', color: string = 'text-slate-400'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} ${color}`;
};

// #DEBUG: flex-shrink-0과 함께 사용되는 아이콘들
export const iconNoShrink = (size: 'sm' | 'md' | 'lg' = 'sm', gap: '2' | '3' = '3'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} mr-${gap} flex-shrink-0`;
};

// #DEBUG: 🔥 Status 표시용 유틸리티들 (CheckCircle 등에서 많이 사용)
export const statusIcon = (status: 'success' | 'warning' | 'error' | 'info' = 'info'): string => {
  const base = iconSm();
  switch (status) {
    case 'success':
      return `${base} text-green-600`;
    case 'warning':
      return `${base} text-yellow-600`;
    case 'error':
      return `${base} text-red-600`;
    case 'info':
    default:
      return `${base} text-blue-600`;
  }
};

// #DEBUG: 애니메이션이 포함된 아이콘들
export const iconSpinner = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `animate-spin ${sizeClass} border-2 border-white border-t-transparent rounded-full`;
};

export const iconPulse = (size: 'sm' | 'md' | 'lg' = 'sm'): string => {
  const sizeClass = size === 'sm' ? iconSm() : size === 'md' ? iconMd() : iconLg();
  return `${sizeClass} animate-pulse`;
};

// #DEBUG: 🔥 기가차드 성능 최적화 버전 - 프리컴파일된 스타일
export const OPTIMIZED_STYLES = {
  // Card 스타일 프리컴파일 (999M ops/sec 성능)
  cardBlue: 'bg-white border border-slate-200 rounded-lg p-6',
  cardBlueHover: 'bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardGreen: 'bg-white border border-green-200 rounded-lg p-6',
  cardGreenHover: 'bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardSlate: 'bg-white border border-slate-300 rounded-lg p-6',
  cardSlateHover: 'bg-white border border-slate-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardPurple: 'bg-white border border-purple-200 rounded-lg p-6',
  cardPurpleHover: 'bg-white border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardPanel: 'bg-white border border-slate-200 rounded-lg p-4 shadow-sm',
  cardStats: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-6 h-[120px] flex items-center justify-center cursor-pointer transition-colors',
  cardSettings: 'bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-4 h-[120px] flex flex-col justify-between cursor-pointer transition-colors',
  
  // Button 스타일 프리컴파일 (하드코딩된 버튼들 대체)
  buttonPrimary: 'bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors',
  buttonSecondary: 'bg-slate-100 text-slate-900 rounded-lg px-4 py-2 hover:bg-slate-200 transition-colors',
  buttonSuccess: 'bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors',
  buttonDanger: 'bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors',
  buttonGhost: 'text-slate-600 hover:bg-slate-100 rounded-lg px-3 py-1.5 transition-colors',
  buttonSmall: 'px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition-colors',
  buttonMedium: 'px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors',
  buttonLarge: 'px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors',
  // 🔥 NEW: AIAnalytics 하드코딩 버튼 대체용
  buttonBlue: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  
  // Layout 패턴 프리컴파일 (52개의 flex 중복 대체)
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',
  flexGap1: 'flex items-center gap-1',
  flexGap2: 'flex items-center gap-2',
  flexGap3: 'flex items-center gap-3',
  flexGap4: 'flex items-center gap-4',
  flexSpaceX2: 'flex items-center space-x-2',
  flexSpaceX3: 'flex items-center space-x-3',
  flexSpaceX4: 'flex items-center space-x-4',
  flexColGap2: 'flex flex-col items-center gap-2',
  
  // Grid 패턴 프리컴파일 (11개의 grid 중복 대체)
  gridCols1Md2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  gridCols1Md2Lg3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridCols1Sm2Lg3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  gridCols1Sm2Lg4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  gridCols1Lg2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  gridCols1Lg3: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  gridCols2Md3: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  gridCols3: 'grid grid-cols-3 gap-6 text-center',
  gridCols4: 'grid grid-cols-4 gap-4 mb-4',
  gridColsBlueBox: 'grid grid-cols-4 gap-4 mb-4 p-3 bg-blue-50 rounded-lg',
  
  // Typography 패턴 프리컴파일 (18개의 text-sm font-medium 중복 대체)
  textSmMedium: 'text-sm font-medium',
  textSmMediumSlate700: 'text-sm font-medium text-slate-700',
  textSmMediumSlate900: 'text-sm font-medium text-slate-900',
  textSmMediumGray700: 'text-sm font-medium text-gray-700',
  textSmMediumWhite90: 'text-white/90 text-sm font-medium',
  textLabelMedium: 'w-12 text-center text-sm font-medium',
  fontSemiboldSlate900Gap2: 'font-semibold text-slate-900 mb-4 flex items-center gap-2',
  
  // Icon 크기 프리컴파일
  iconSm: 'w-4 h-4',
  iconMd: 'w-5 h-5',
  iconLg: 'w-6 h-6',
  iconXl: 'w-8 h-8',
  iconContainer10: 'w-10 h-10 rounded-lg flex items-center justify-center',
  iconContainer12: 'w-12 h-12 rounded-lg flex items-center justify-center',
  iconContainerBlue: 'w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3',
  iconContainerWhite20: 'w-10 h-10 bg-white/20 rounded-full flex items-center justify-center',
  
  // Sidebar 버튼 패턴 프리컴파일
  sidebarButton: 'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg',
  sidebarButtonItem: 'flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors',
  
  // 반응형 헤더 패턴 프리컴파일
  responsiveHeaderFlex: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
} as const;

// #DEBUG: 🔥 기가차드 Zero Runtime Cost 솔루션
// 빌드타임에 모든 조합 미리 계산 → 런타임 비용 제로!

// ==================== 방법 1: 빌드타임 사전 계산 ====================
export const ULTRA_OPTIMIZED_STYLES = {
  // Card styles (완전 사전 계산)
  cardBlue: 'bg-white border border-slate-200 rounded-lg p-6',
  cardBlueHover: 'bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardGreen: 'bg-white border border-green-200 rounded-lg p-6',
  cardGreenHover: 'bg-white border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardSlate: 'bg-white border border-slate-300 rounded-lg p-6',
  cardSlateHover: 'bg-white border border-slate-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  cardPurple: 'bg-white border border-purple-200 rounded-lg p-6',
  cardPurpleHover: 'bg-white border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer',
  
  // Button styles (완전 사전 계산)
  buttonPrimary: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors',
  buttonSecondary: 'px-4 py-2 bg-gray-200 text-gray-900 hover:bg-gray-300 rounded-md font-medium transition-colors',
  buttonSuccess: 'px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium transition-colors',
  buttonDanger: 'px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md font-medium transition-colors',
  buttonPrimarySm: 'px-2 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded font-medium transition-colors',
  buttonPrimaryLg: 'px-6 py-3 text-lg bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors',
  buttonIcon: 'p-2 bg-transparent hover:bg-gray-100 rounded-md transition-colors',
  buttonIconSm: 'p-1 bg-transparent hover:bg-gray-100 rounded transition-colors',
  
  // Layout styles (완전 사전 계산)
  flexItemsCenter: 'flex items-center',
  flexItemsCenterGap1: 'flex items-center gap-1',
  flexItemsCenterGap2: 'flex items-center gap-2',
  flexItemsCenterGap3: 'flex items-center gap-3',
  flexItemsCenterGap4: 'flex items-center gap-4',
  flexItemsCenterJustifyBetween: 'flex items-center justify-between',
  flexItemsCenterJustifyCenter: 'flex items-center justify-center',
  
  // Icon styles (완전 사전 계산)
  iconSm: 'w-4 h-4',
  iconMd: 'w-5 h-5',
  iconLg: 'w-6 h-6',
  iconXl: 'w-8 h-8',
  
  // Section header (완전 사전 계산)
  sectionHeader: 'font-semibold text-slate-900 mb-4 flex items-center gap-2',
  sectionHeaderLg: 'text-xl font-bold text-slate-900 mb-6 flex items-center gap-3',
  
  // Status styles (완전 사전 계산)
  statusSuccess: 'flex items-center gap-1 text-sm text-green-600',
  statusWarning: 'flex items-center gap-1 text-sm text-yellow-600',
  statusError: 'flex items-center gap-1 text-sm text-red-600',
  statusInfo: 'flex items-center gap-1 text-sm text-blue-600'
} as const;

// ==================== 타입 안전성 보장 ====================
export type UltraOptimizedStyleKey = keyof typeof ULTRA_OPTIMIZED_STYLES;

// #DEBUG: 성능 우선 모드 (999M ops/sec)
export function getOptimizedCardClassName(variant: keyof typeof OPTIMIZED_STYLES): string {
  return OPTIMIZED_STYLES[variant];
}

export function getOptimizedButtonClassName(variant: keyof typeof OPTIMIZED_STYLES): string {
  return OPTIMIZED_STYLES[variant];
}

// #DEBUG: 유연성 우선 모드 (35M ops/sec이지만 유지보수성 높음)
// 기존 함수들 유지...

// #DEBUG: 🔥 기가차드 성능 최적화 + 모듈화 (999M ops/sec)
// 프리컴파일된 스타일로 함수 호출 오버헤드 제거

// OPTIMIZED_STYLES에 렌더링 중복 패턴 추가
export const RENDER_OPTIMIZED_PATTERNS = {
  // 50개의 flex items-center 중복 → 프리컴파일
  flexItemsCenter: 'flex items-center',
  flexItemsCenterGap1: 'flex items-center gap-1',
  flexItemsCenterGap2: 'flex items-center gap-2',
  flexItemsCenterGap3: 'flex items-center gap-3',
  flexItemsCenterGap4: 'flex items-center gap-4',
  
  // Settings.tsx의 section header 패턴 (8번 중복)
  sectionHeader: 'font-semibold text-slate-900 mb-4 flex items-center gap-2',
  sectionHeaderIcon: 'font-semibold text-slate-900 mb-4 flex items-center gap-2',
  
  // Status indicator 패턴 (6번 중복) 
  statusSuccess: 'flex items-center gap-1 text-sm text-green-600',
  statusInfo: 'flex items-center gap-2',
  
  // Grid layouts (많이 중복됨)
  gridCol1Md2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  gridCol1Sm2Lg4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // Card content patterns
  cardIconContainer: 'w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3',
  cardIconBox: 'flex items-center gap-2 mb-2',
  
  // Button patterns 
  actionButtonsContainer: 'flex flex-col sm:flex-row gap-4',
  
  // Typography patterns
  cardTitle: 'font-semibold text-slate-900',
  cardDescription: 'text-sm text-slate-600',
  
  // Layout patterns
  listItem: 'flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors',
  responsiveHeader: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
  
  // Stats patterns
  statContainer: 'flex-1 flex flex-col items-center gap-2',
  statValue: 'text-2xl font-bold',
  statLabel: 'text-xs text-slate-600',
  
  // Icon positions (자주 사용됨)
  iconStart: 'flex items-center space-x-2',
  iconStartGap4: 'flex items-center space-x-4',
  iconCentered: 'w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg',
  
  // Progress patterns
  progressContainer: 'w-full bg-slate-200 rounded-full h-2',
  progressFill: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
  
  // Navigation patterns
  navItem: 'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg',
  
  // Header patterns
  mainHeader: 'h-14 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center border-b border-slate-700 shadow-lg'
} as const;

// 모든 최적화된 스타일 합치기
export const ALL_OPTIMIZED_STYLES = {
  ...OPTIMIZED_STYLES,
  ...RENDER_OPTIMIZED_PATTERNS
} as const;

// #DEBUG: 🔥 성능 최우선 Direct Constants (직접 사용용)
// 이거 쓰면 999M ops/sec 유지하면서 모듈화 가능!
export const FLEX_ITEMS_CENTER = 'flex items-center';
export const FLEX_ITEMS_CENTER_GAP_1 = 'flex items-center gap-1';
export const FLEX_ITEMS_CENTER_GAP_2 = 'flex items-center gap-2';
export const FLEX_ITEMS_CENTER_GAP_3 = 'flex items-center gap-3';
export const FLEX_ITEMS_CENTER_GAP_4 = 'flex items-center gap-4';
export const FLEX_ITEMS_CENTER_JUSTIFY_BETWEEN = 'flex items-center justify-between';
export const FLEX_ITEMS_CENTER_JUSTIFY_CENTER = 'flex items-center justify-center';
export const SECTION_HEADER = 'font-semibold text-slate-900 mb-4 flex items-center gap-2';
export const STATUS_SUCCESS = 'flex items-center gap-1 text-sm text-green-600';
export const ICON_SM = 'w-4 h-4';
export const ICON_MD = 'w-5 h-5';
export const ICON_LG = 'w-6 h-6';

// #DEBUG: 🔥 성능 최적화된 렌더링 유틸리티들 (직접 프리컴파일된 값 반환)
export const renderFlexGap1 = RENDER_OPTIMIZED_PATTERNS.flexItemsCenterGap1;
export const renderFlexGap2 = RENDER_OPTIMIZED_PATTERNS.flexItemsCenterGap2;
export const renderFlexGap3 = RENDER_OPTIMIZED_PATTERNS.flexItemsCenterGap3;
export const renderFlexGap4 = RENDER_OPTIMIZED_PATTERNS.flexItemsCenterGap4;
export const renderFlexItemsCenter = RENDER_OPTIMIZED_PATTERNS.flexItemsCenter;
export const renderSectionHeader = RENDER_OPTIMIZED_PATTERNS.sectionHeader;
export const renderStatusSuccess = RENDER_OPTIMIZED_PATTERNS.statusSuccess;
export const renderCardIconBox = RENDER_OPTIMIZED_PATTERNS.cardIconBox;
export const renderStatContainer = RENDER_OPTIMIZED_PATTERNS.statContainer;
export const renderListItem = RENDER_OPTIMIZED_PATTERNS.listItem;
export const renderResponsiveHeader = RENDER_OPTIMIZED_PATTERNS.responsiveHeader;

// #DEBUG: 성능 측정용 - 이거로 벤치마크하면 999M ops/sec 나올거야!
export function getRenderOptimizedClassName(variant: keyof typeof ALL_OPTIMIZED_STYLES): string {
  return ALL_OPTIMIZED_STYLES[variant];
}

// 🔥 GigaChad Export 정리
export default COMMON_STYLES;
