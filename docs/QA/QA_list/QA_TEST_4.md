## 🔥 **기가차드 코파일럿 실수 포인트 QA 체크리스트**

### **📋 Electron + TypeScript + React 코파일럿 실수 집중 공략**

---

## **🚨 CRITICAL - 반드시 체크해야 할 것들**

### **1. TypeScript 타입 추론 실패**
```typescript
// ❌ 코파일럿이 자주 하는 실수들
❌ any 타입 남발
❌ 함수 반환값 타입 누락
❌ Generic 타입 잘못된 사용
❌ Union 타입에서 타입 가드 누락
❌ Optional chaining (?.) 과다 사용
❌ Type assertion (as) 남발

// ✅ 체크 포인트
□ 모든 함수에 명시적 반환 타입이 있는가?
□ Event 핸들러에 정확한 타입이 있는가?
□ API 응답에 interface/type이 정의되어 있는가?
□ any 타입이 0개인가?
□ unknown 타입을 적절히 사용했는가?
```

### **2. 비동기 처리 실수**
```typescript
// ❌ 코파일럿 대표적 실수들
❌ async/await 에러 핸들링 누락
❌ Promise 체이닝에서 .catch() 없음
❌ 무한 루프 가능한 useEffect
❌ race condition 무시
❌ 동시 실행 제어 안 함

// ✅ 체크 포인트
□ 모든 async 함수에 try-catch가 있는가?
□ useEffect에 정리 함수(cleanup)가 있는가?
□ Promise.all vs Promise.allSettled 적절한 선택?
□ setTimeout/setInterval 정리되는가?
□ API 호출 중복 방지 로직이 있는가?
```

### **3. React 최적화 실수**
```typescript
// ❌ 코파일럿이 놓치는 것들
❌ 불필요한 리렌더링 발생
❌ useCallback/useMemo 잘못된 사용
❌ 의존성 배열 누락/과도
❌ key prop 누락
❌ ref 잘못된 사용

// ✅ 체크 포인트
□ useCallback 의존성 배열이 정확한가?
□ useMemo가 정말 필요한 곳에만 사용했는가?
□ map()에서 key가 unique한가?
□ React.memo가 적절히 사용되었는가?
□ 상태 업데이트가 immutable한가?
```

---

## **⚠️ HIGH - 자주 발생하는 실수들**

### **4. Electron IPC 통신 실수**
```typescript
// ❌ 코파일럿 IPC 실수들
❌ contextIsolation 무시
❌ preload에서 직접 Node.js API 노출
❌ 타입 안전하지 않은 IPC 채널
❌ 에러 처리 없는 invoke 호출
❌ 메모리 누수되는 이벤트 리스너

// ✅ 체크 포인트
□ preload에서 contextBridge만 사용하는가?
□ 모든 IPC 채널에 타입이 정의되어 있는가?
□ ipcRenderer.on에 대응하는 removeAllListeners가 있는가?
□ IPC 에러가 UI에서 적절히 처리되는가?
□ 보안상 위험한 API가 노출되지 않았는가?
```

### **5. 메모리 누수 패턴**
```typescript
// ❌ 코파일럿이 만드는 메모리 누수들
❌ Event listener 정리 안 함
❌ setTimeout/setInterval 정리 안 함
❌ 큰 객체 참조 유지
❌ closure에서 불필요한 참조
❌ DOM 요소 직접 참조 유지

// ✅ 체크 포인트
□ 모든 addEventListener에 removeEventListener가 있는가?
□ 모든 setTimeout에 clearTimeout이 있는가?
□ useEffect cleanup에서 구독 해제하는가?
□ 큰 데이터는 적절히 해제되는가?
□ WeakMap/WeakSet을 적절히 사용했는가?
```

### **6. 조건문/예외 처리 실수**
```typescript
// ❌ 코파일럿 조건부 로직 실수들
❌ falsy 값 처리 미흡 (0, '', false, null, undefined)
❌ === vs == 혼동
❌ 배열/객체 존재성 체크 누락
❌ try-catch에서 재throw 안 함
❌ 에러 타입 체크 안 함

// ✅ 체크 포인트
□ if (array.length) vs if (array?.length > 0) 구분?
□ null vs undefined 구분해서 처리하는가?
□ error instanceof Error 체크하는가?
□ API 응답 validation이 있는가?
□ edge case들이 고려되었는가?
```

---

## **🔧 MEDIUM - 놓치기 쉬운 실수들**

### **7. Import/Export 순환 의존성**
```typescript
// ❌ 코파일럿 import 실수들
❌ 순환 의존성 (Circular dependency)
❌ 사용하지 않는 import
❌ default export vs named export 혼동
❌ 동적 import 타이밍 실수
❌ 절대 경로 vs 상대 경로 일관성 없음

// ✅ 체크 포인트
□ 순환 의존성이 없는가?
□ 사용하지 않는 import가 정리되었는가?
□ path mapping이 올바르게 설정되었는가?
□ tree shaking에 영향주는 import는 없는가?
□ 동적 import의 에러 처리가 있는가?
```

### **8. 상태 관리 실수**
```typescript
// ❌ 코파일럿 상태 관리 실수들
❌ 상태 불변성 위반
❌ 상태 초기화 순서 문제
❌ 전역 상태 vs 로컬 상태 잘못된 선택
❌ 상태 동기화 문제
❌ 상태 기본값 누락

// ✅ 체크 포인트
□ setState에서 이전 상태를 직접 변경하지 않는가?
□ 초기 상태가 적절히 설정되었는가?
□ 상태 업데이트가 atomic한가?
□ 상태간 의존성이 올바르게 처리되었는가?
□ 상태 리셋 로직이 있는가?
```

### **9. 성능 관련 실수**
```typescript
// ❌ 코파일럿 성능 실수들
❌ 불필요한 DOM 조작
❌ 무거운 계산을 매 렌더마다 실행
❌ 이미지/파일 크기 최적화 안 함
❌ bundle size 최적화 안 함
❌ lazy loading 안 함

// ✅ 체크 포인트
□ 무거운 계산에 useMemo가 적용되었는가?
□ 큰 리스트에 가상화가 적용되었는가?
□ 이미지가 최적화되었는가?
□ 코드 스플리팅이 적절한가?
□ 불필요한 라이브러리가 포함되지 않았는가?
```

---

## **🔍 LOW - 세부적 실수들**

### **10. CSS/스타일링 실수**
```typescript
// ❌ 코파일럿 CSS 실수들
❌ z-index 충돌
❌ CSS specificity 문제
❌ 반응형 breakpoint 누락
❌ 접근성(a11y) 무시
❌ 다크모드 지원 누락

// ✅ 체크 포인트
□ z-index 체계가 일관되는가?
□ 모든 interactive 요소에 focus 스타일이 있는가?
□ 색상 대비가 WCAG 기준을 만족하는가?
□ 키보드 네비게이션이 가능한가?
□ 다크모드에서 정상 작동하는가?
```

### **11. 테스트 관련 실수**
```typescript
// ❌ 코파일럿 테스트 실수들
❌ 비동기 테스트 await 누락
❌ mock 정리 안 함
❌ 테스트 격리 안 됨
❌ edge case 테스트 누락
❌ 실제 DOM vs virtual DOM 혼동

// ✅ 체크 포인트
□ 모든 비동기 테스트에 await이 있는가?
□ afterEach에서 mock이 정리되는가?
□ 테스트간 상태 공유가 없는가?
□ 에러 케이스도 테스트되는가?
□ 테스트 커버리지가 충분한가?
```

### **12. 보안 관련 실수**
```typescript
// ❌ 코파일럿 보안 실수들
❌ XSS 공격 가능한 innerHTML 사용
❌ 민감한 정보 로그 출력
❌ CSP 정책 위반
❌ 입력값 validation 누락
❌ 에러 메시지에 민감한 정보 노출

// ✅ 체크 포인트
□ innerHTML 대신 textContent/createElement 사용?
□ API 키 등이 클라이언트에 노출되지 않는가?
□ 사용자 입력이 모두 validation되는가?
□ 에러 메시지가 적절히 sanitize되는가?
□ HTTPS만 사용하고 있는가?
```

---

## **📝 QA 실행 체크리스트**

### **A. 코드 스캔 자동화**
```bash
# TypeScript 컴파일 체크
□ tsc --noEmit 에러 0개
□ eslint 에러 0개  
□ 사용되지 않는 import 0개
□ any 타입 0개 (허용된 곳 제외)
```

### **B. 수동 코드 리뷰**
```typescript
□ 모든 async 함수에 에러 처리
□ 모든 useEffect에 cleanup
□ 모든 이벤트 리스너에 제거 코드
□ 모든 API 호출에 loading/error 상태
□ 모든 form에 validation
```

### **C. 런타임 테스트**
```typescript
□ 메모리 누수 체크 (DevTools Memory tab)
□ 네트워크 에러 시나리오 테스트
□ 다양한 데이터 크기로 테스트
□ 권한 없을 때 동작 테스트
□ 오프라인 상황 테스트
```

### **D. 크로스 브라우저/플랫폼**
```typescript
□ Chrome/Safari/Firefox 테스트
□ Windows/macOS/Linux 테스트
□ 다양한 화면 크기 테스트
□ 키보드 전용 네비게이션 테스트
□ 스크린 리더 호환성 테스트
```

---

## **🎯 실무 QA 실행 순서**

1. **자동화 도구 실행** (5분)
2. **CRITICAL 항목 수동 체크** (30분)
3. **HIGH 항목 샘플링 체크** (20분)
4. **런타임 테스트** (15분)
5. **보고서 작성** (10분)

**총 80분으로 코파일럿 실수 99% 잡아낸다!** 🔥