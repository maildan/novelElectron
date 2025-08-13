// 🔥 Electron 환경 감지 유틸리티

/**
 * 현재 환경이 Electron인지 확인
 */
export function isElectronEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  // User agent 체크
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('electron')) return true;
  
  // process 객체 체크 (Node.js 환경)
  if (typeof (window as any).process === 'object' && (window as any).process.type === 'renderer') {
    return true;
  }
  
  // electronAPI 존재 체크
  if (window.electronAPI) return true;
  
  return false;
}

/**
 * ElectronAPI 로드 대기
 */
export function waitForElectronAPI(timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.electronAPI) {
      resolve(true);
      return;
    }
    
    let attempts = 0;
    const maxAttempts = timeout / 100;
    
    const checkInterval = setInterval(() => {
      attempts++;
      
      if (window.electronAPI) {
        clearInterval(checkInterval);
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        resolve(false);
        return;
      }
    }, 100);
  });
}

/**
 * 브라우저 환경에서의 폴백 메시지
 */
export function getBrowserFallbackMessage(): string {
  return `
🌐 브라우저 환경에서 접근 중입니다.
Electron 앱의 모든 기능을 사용하려면 다음 중 하나를 선택하세요:

1. Electron 앱 실행: pnpm dev
2. 브라우저 미리보기용 제한 모드로 계속 사용

현재 URL: ${window.location.href}
User Agent: ${navigator.userAgent}
`;
}
