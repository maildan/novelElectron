#!/usr/bin/env node

/**
 * 🔥 기가차드 GitHub Copilot 세션 Keep-Alive 스크립트
 * 
 * 이 스크립트는 주기적으로 간단한 요청을 보내서 
 * Copilot 세션이 타임아웃되는 것을 방지한다.
 * 
 * 사용법:
 * node scripts/copilot-keepalive.js
 */

const fs = require('fs');
const path = require('path');

class CopilotKeepAlive {
  constructor() {
    this.isActive = true;
    this.interval = 25 * 60 * 1000; // 25분마다 실행
    this.logFile = path.join(__dirname, '../logs/copilot-keepalive.log');
    this.sessionFile = path.join(__dirname, '../.copilot-session');
    
    this.ensureLogDirectory();
    this.startKeepAlive();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    
    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      console.error('로그 쓰기 실패:', error.message);
    }
  }

  updateSessionFile() {
    const sessionData = {
      lastActivity: new Date().toISOString(),
      sessionId: Date.now(),
      project: 'Loop Typing Analytics',
      context: '기가차드 모드 활성화',
      keepAliveCount: this.getKeepAliveCount() + 1
    };

    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(sessionData, null, 2));
      this.log(`세션 파일 업데이트: Keep-Alive #${sessionData.keepAliveCount}`);
    } catch (error) {
      this.log(`세션 파일 업데이트 실패: ${error.message}`);
    }
  }

  getKeepAliveCount() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const data = JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
        return data.keepAliveCount || 0;
      }
    } catch (error) {
      this.log(`Keep-Alive 카운트 읽기 실패: ${error.message}`);
    }
    return 0;
  }

  startKeepAlive() {
    this.log('🔥 기가차드 Copilot Keep-Alive 시작');
    
    // 즉시 한 번 실행
    this.performKeepAlive();
    
    // 주기적으로 실행
    this.timer = setInterval(() => {
      if (this.isActive) {
        this.performKeepAlive();
      }
    }, this.interval);

    // 프로세스 종료 시 정리
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  performKeepAlive() {
    try {
      this.updateSessionFile();
      
      // VSCode에 간단한 작업 신호 보내기 (파일 터치)
      const touchFile = path.join(__dirname, '../.copilot-touch');
      fs.writeFileSync(touchFile, `Keep-Alive: ${new Date().toISOString()}`);
      
      this.log('✅ Keep-Alive 신호 전송 완료');
      
      // 터치 파일 즉시 삭제
      setTimeout(() => {
        try {
          if (fs.existsSync(touchFile)) {
            fs.unlinkSync(touchFile);
          }
        } catch (error) {
          // 무시
        }
      }, 1000);
      
    } catch (error) {
      this.log(`❌ Keep-Alive 실패: ${error.message}`);
    }
  }

  cleanup() {
    this.log('🛑 Keep-Alive 스크립트 종료');
    this.isActive = false;
    
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    process.exit(0);
  }
}

// 스크립트가 직접 실행될 때만 시작
if (require.main === module) {
  new CopilotKeepAlive();
}

module.exports = CopilotKeepAlive;
