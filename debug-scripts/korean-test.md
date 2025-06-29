# 🔥 기가차드 한글 문제 해결 가이드

## 현재 상황
- **실제 로그**: keycode 33(!) , 34(") 같은 특수문자만 나옴
- **예상**: keycode 70(F→ㄹ), 65(A→ㅁ) 등 물리적 키코드가 나와야 함
- **원인**: macOS IME가 물리적 키코드를 완전히 변조함

## 해결 방법

### 1. rawcode 활용 (이미 구현됨)
```typescript
// LanguageDetector.ts 185줄
const rawcode = (rawEvent as any).rawcode;
const physicalKeycode = rawcode || keycode; // rawcode 우선 사용
```

### 2. keychar 기반 역매핑 추가
```typescript
// 특수문자 → 한글 키 역추적
private readonly SPECIAL_CHAR_TO_HANGUL: Map<number, string> = new Map([
  [33, 'ㅂ'],  // ! → ㅂ (Q키)
  [34, 'ㅈ'],  // " → ㅈ (W키)  
  [35, 'ㄷ'],  // # → ㄷ (E키)
  // ... 더 많은 매핑 필요
]);
```

### 3. 키보드 레이아웃 감지
```typescript
// macOS 키보드 입력소스 확인
private detectKeyboardLayout(): 'korean' | 'english' {
  // NSInputSource API 활용 또는
  // 패턴 기반 추정
}
```

## 팩폭: 왜 안 되는가?

1. **macOS 2-Stage IME**: 
   - 1단계: 물리적 F키 누름 
   - 2단계: IME가 keycode를 변조 (70 → 33)

2. **uiohook 한계**: 
   - IME 이후의 keycode만 받음
   - 원본 물리적 keycode 손실

3. **rawcode도 불완전**: 
   - 일부 상황에서만 동작
   - undefined인 경우 많음

## 즉시 해결 방법

### A. 패턴 기반 추정
```typescript
private detectKoreanByPattern(keychar: number): boolean {
  // 한글 타이핑할 때 나오는 특수문자 패턴
  const koreanPatterns = [33, 34, 35, 64, 35]; // !"#@#
  return koreanPatterns.includes(keychar);
}
```

### B. 연속 키 분석
```typescript
private analyzeKeySequence(): boolean {
  // 한글: 자음→모음→자음 패턴
  // 영어: 랜덤 패턴
  // 최근 5개 키 패턴 분석
}
```

### C. 입력 소스 API 
```typescript
// Node.js에서 macOS 입력소스 확인
const currentInputSource = require('child_process')
  .execSync('defaults read com.apple.HIToolbox')
  .toString();
```
