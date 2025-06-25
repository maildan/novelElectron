/**
 * 클래스명 조합 유틸리티
 * Tailwind CSS 클래스 충돌 해결
 */

export type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassDictionary;
export interface ClassArray extends Array<ClassValue> {}
export interface ClassDictionary {
  [key: string]: boolean | undefined | null;
}

/**
 * 클래스명을 조합하고 중복을 제거하는 함수
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = cn(...input);
      if (result) classes.push(result);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  // 중복 제거 및 Tailwind 충돌 해결
  const uniqueClasses = [...new Set(classes)];
  
  // 간단한 Tailwind 충돌 해결 (완전한 구현은 tailwind-merge 필요)
  const conflictMap: Record<string, string[]> = {
    // 마진
    'm': ['m-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12'],
    // 패딩
    'p': ['p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12'],
    // 배경색
    'bg': ['bg-white', 'bg-black', 'bg-gray-100', 'bg-gray-200', 'bg-blue-500'],
    // 텍스트 색상
    'text': ['text-black', 'text-white', 'text-gray-500', 'text-blue-500']
  };
  
  const result: string[] = [];
  const used = new Set<string>();
  
  for (const cls of uniqueClasses) {
    let shouldAdd = true;
    
    // 충돌 체크
    for (const [prefix, variants] of Object.entries(conflictMap)) {
      if (cls.startsWith(prefix + '-') && variants.includes(cls)) {
        // 이미 같은 prefix의 클래스가 있으면 덮어쓰기
        for (let i = result.length - 1; i >= 0; i--) {
          if (result[i].startsWith(prefix + '-') && variants.includes(result[i])) {
            result.splice(i, 1);
            break;
          }
        }
        break;
      }
    }
    
    if (shouldAdd && !used.has(cls)) {
      result.push(cls);
      used.add(cls);
    }
  }
  
  return result.join(' ');
}

/**
 * 조건부 클래스명 적용
 */
export function conditional(condition: boolean, trueClass: string, falseClass?: string): string {
  return condition ? trueClass : (falseClass || '');
}

/**
 * 변형(variant) 기반 클래스명 생성
 */
export function variant<T extends Record<string, string>>(
  variants: T,
  selected: keyof T,
  base?: string
): string {
  const selectedVariant = variants[selected];
  if (!selectedVariant) return base || '';
  
  return cn(base, selectedVariant);
}
