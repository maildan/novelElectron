/**
 * 🔥 기가차드 공통 스타일 유틸리티
 * Loop Typing Analytics - Common Style Utilities
 */

// #DEBUG: 공통 스타일 패턴 모듈화
export const commonStyles = {
  // Layout patterns
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between', 
  flexCol: 'flex flex-col',
  flexGap2: 'flex items-center gap-2',
  flexGap3: 'flex items-center gap-3',
  flexGap4: 'flex items-center gap-4',
  
  // Card patterns
  card: 'bg-white border border-gray-200 rounded-lg shadow-sm',
  cardHover: 'hover:shadow-md transition-shadow duration-200',
  cardPadding: 'p-6',
  
  // Button patterns
  btnPrimary: 'bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors',
  btnSecondary: 'bg-gray-100 text-gray-900 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors',
  btnDanger: 'bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors',
  
  // Icon containers
  iconContainer: 'w-10 h-10 rounded-lg flex items-center justify-center',
  iconContainerLg: 'w-12 h-12 rounded-lg flex items-center justify-center',
  
  // Status indicators
  statusActive: 'bg-green-500 text-white',
  statusInactive: 'bg-red-500 text-white',
  statusPending: 'bg-yellow-500 text-white',
  
  // Typography
  heading: 'font-semibold text-slate-900',
  subheading: 'text-sm text-slate-600',
  
  // Spacing
  section: 'mb-6',
  sectionHeader: 'mb-4',
  
  // Responsive patterns
  responsiveFlex: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
} as const;

// #DEBUG: 스타일 조합 헬퍼
export const combineStyles = (...styles: string[]) => styles.join(' ');

// #DEBUG: 조건부 스타일 헬퍼
export const conditionalStyle = (condition: boolean, trueStyle: string, falseStyle: string = '') => 
  condition ? trueStyle : falseStyle;

// #DEBUG: 변형 스타일 헬퍼
export const variantStyle = <T extends Record<string, string>>(
  variants: T, 
  variant: keyof T, 
  defaultVariant: keyof T
): string => variants[variant] || variants[defaultVariant];
