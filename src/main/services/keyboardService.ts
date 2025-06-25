/**
 * 키보드 서비스 - KeyboardEngine 인터페이스
 */

import { keyboardEngine } from '@main/keyboard';

/**
 * 키보드 리스너 등록
 */
export const registerKeyboardListener = () => {
  return keyboardEngine.startListening();
};

/**
 * 키보드 리스너 중지
 */
export const stopKeyboardListener = () => {
  return keyboardEngine.stopListening();
};

/**
 * 현재 세션 데이터 가져오기
 */
export const getCurrentSession = () => {
  return keyboardEngine.getSessionData();
};

/**
 * 키보드 상태 가져오기
 */
export const getKeyboardStatus = () => {
  return keyboardEngine.getStatus();
};

/**
 * 키보드 설정 업데이트
 */
export const updateKeyboardConfig = (config: any) => {
  return keyboardEngine.updateConfig(config);
};

/**
 * 현재 앱 정보 가져오기
 */
export const getCurrentApp = () => {
  return keyboardEngine.getCurrentApp();
};

/**
 * 키보드 권한 확인
 */
export const checkKeyboardPermissions = () => {
  return keyboardEngine.checkPermissions();
};

/**
 * 키보드 권한 요청
 */
export const requestKeyboardPermissions = () => {
  return keyboardEngine.requestPermissions();
};
