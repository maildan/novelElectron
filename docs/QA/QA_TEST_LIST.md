## 코드 품질 & 타입 안전성
**1. 타입 관련 (코파일럿 주요 실수 영역)**
- `any` 타입 남용 여부 확인
- Interface vs Type 일관성 (camelCase 네이밍)
- 함수 매개변수와 반환값의 명시적 타입 선언
- Generic 타입의 적절한 사용
- Optional chaining (`?.`) 과도한 사용 여부

**2. 중복 및 불필요한 코드**
- 동일한 로직을 가진 함수들
- 중복된 타입 정의
- 사용되지 않는 import 문
- Dead code (unreachable code)
- 동일한 이름의 파일 (대소문자 구분)

## Electron 특화 QA 항목
**3. 프로세스 분리 및 통신**
- Main process와 Renderer process 역할 분리가 명확한가?
- IPC 통신에서 `contextIsolation: true` 설정 확인
- `nodeIntegration: false` 보안 설정 준수
- Preload script의 적절한 사용

**4. 보안 관련 (코파일럿이 놓치기 쉬운 부분)**
- CSP (Content Security Policy) 설정
- 외부 리소스 로딩 시 보안 검증
- File system 접근 권한 최소화
- Remote module 사용 금지 (deprecated)

## 성능 및 최적화
**5. 메모리 관리**
- Event listener 정리 (`removeEventListener`)
- 큰 객체나 배열의 메모리 해제
- Renderer process 메모리 누수 확인
- 불필요한 DOM 조작 최소화

**6. UI/UX 최적화**
- 로딩 상태 표시 (스피너, 프로그레스바)
- 에러 상태 처리 및 사용자 피드백
- 키보드 접근성 (Tab navigation)
- 반응형 레이아웃 (창 크기 변경 대응)

## 모듈화 및 구조
**7. 파일 구조 및 모듈화**
- 단일 책임 원칙 준수
- 순환 의존성 (Circular dependency) 확인
- 상대 경로 vs 절대 경로 일관성
- 설정 파일들의 적절한 분리

## 코파일럿 특화 실수 체크 포인트
**8. 자주 놓치는 실수들**
- `async/await` 사용 시 에러 핸들링 누락
- Promise chain에서 `.catch()` 처리 부재
- 배열 메서드 체이닝 시 중간 결과 타입 불일치
- 조건문에서 falsy 값 처리 미흡
- Event callback에서 `this` 바인딩 실수
- 앱 실행 순서 관리 

**9. 디버깅 및 로깅**
- 개발용 console.log 제거 여부
- 적절한 에러 로깅 구현
- DevTools 통합 설정
- 프로덕션 환경에서 디버깅 정보 노출 방지

**10. 데이터 관리**
- 더미 데이터와 실제 데이터 분리
- 환경변수를 통한 설정 관리
- 로컬 스토리지/세션 스토리지 적절한 사용
- 데이터 validation 구현

## 추가 권장 체크 항목
**11. 빌드 및 배포**
- TypeScript 컴파일 에러 없음
- Webpack/번들러 설정 최적화
- 프로덕션 빌드 테스트
- Auto-updater 기능 동작 확인

**12. 테스트**
- 단위 테스트 커버리지
- E2E 테스트 (Spectron 등)
- 크로스 플랫폼 호환성 테스트
