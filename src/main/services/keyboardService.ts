import { Logger } from "../../shared/logger";
const log = Logger;/**
 * 키보드 서비스 - KeyboardEngine 인터페이스
 */

import { keyboardEngine } from '../keyboard';
import type { KeyboardConfig } from '../../shared/types';

/**
 * 키보드 리스너 등록
 */
export const registerKeyboardListener = async () => {
  try {
    // KeyboardEngine 초기화 확인 및 필요시 초기화
    const status = keyboardEngine.getStatus();
    if (!status.isInitialized) {
      log.info("Console", 'KeyboardEngine 초기화 중...');
      await keyboardEngine.initialize();
    }
    
    log.info("Console", 'KeyboardEngine 리스닝 시작...');
    return keyboardEngine.startListening();
  } catch (error) {
    log.error("Console", '키보드 리스너 등록 실패:', error);
    throw error;
  }
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
export const updateKeyboardConfig = (config: KeyboardConfig) => {
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

/**
 * 키보드 모니터링 상태 확인
 */
export const getMonitoringStatus = () => {
  try {
    const status = keyboardEngine.getStatus();
    return {
      isActive: status.isListening || false,
      isInitialized: status.isInitialized || false,
      message: status.isListening ? '모니터링 중' : '정지됨'
    };
  } catch (error) {
    log.error("Console", '모니터링 상태 확인 실패:', error);
    return {
      isActive: false,
      isInitialized: false,
      message: '상태 확인 실패'
    };
  }
};
