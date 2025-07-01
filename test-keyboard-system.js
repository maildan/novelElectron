// 🔥 키보드 시스템 실제 작동 테스트

const { KeyboardService } = require('./dist/main/keyboard/keyboardService');

async function testKeyboardSystem() {
  console.log('🔥 키보드 시스템 실제 작동 테스트 시작...');
  
  try {
    // 1. KeyboardService 인스턴스 생성
    const keyboardService = new KeyboardService();
    console.log('✅ KeyboardService 인스턴스 생성 성공');

    // 2. 초기화
    await keyboardService.initialize();
    console.log('✅ KeyboardService 초기화 성공');

    // 3. 시작
    await keyboardService.start();
    console.log('✅ KeyboardService 시작 성공');

    // 4. 모니터링 시작
    const monitoringResult = await keyboardService.startMonitoring();
    console.log('✅ 키보드 모니터링 시작:', monitoringResult);

    // 5. 상태 확인
    const status = await keyboardService.getStatus();
    console.log('✅ 키보드 상태:', status);

    // 6. 5초 대기 (키 입력 감지 테스트)
    console.log('⏳ 5초 동안 키 입력 테스트...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 7. 통계 확인
    const stats = await keyboardService.getRealtimeStats();
    console.log('✅ 실시간 통계:', stats);

    // 8. 모니터링 중지
    const stopResult = await keyboardService.stopMonitoring();
    console.log('✅ 키보드 모니터링 중지:', stopResult);

    // 9. 정리
    await keyboardService.stop();
    await keyboardService.cleanup();
    console.log('✅ KeyboardService 정리 완료');

    console.log('🎉 키보드 시스템 테스트 완료!');

  } catch (error) {
    console.error('❌ 키보드 시스템 테스트 실패:', error);
    process.exit(1);
  }
}

// 테스트 실행
testKeyboardSystem();
