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
    this.interval = 8 * 60 * 1000; // 8분마다 실행 (더 공격적인 주기)
    this.logFile = path.join(__dirname, '../logs/copilot-keepalive.log');
    this.sessionFile = path.join(__dirname, '../.copilot-session');
    this.touchFile = path.join(__dirname, '../.copilot-touch');
    this.activityFile = path.join(__dirname, '../.copilot-activity');
    
    // 다중 파일 터치로 더 강력한 Keep-Alive
    this.touchFiles = [
      path.join(__dirname, '../.copilot-touch'),
      path.join(__dirname, '../.copilot-activity'),
      path.join(__dirname, '../.copilot-session-active'),
      path.join(__dirname, '../.vscode/.copilot-keepalive')
    ];
    
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
    
    // 메인 Keep-Alive 주기적으로 실행
    this.timer = setInterval(() => {
      if (this.isActive) {
        this.performKeepAlive();
      }
    }, this.interval);

    // 빠른 pulse 신호 (VSCode workspace 파일 터치)
    this.fastTimer = setInterval(() => {
      if (this.isActive) {
        this.performFastPulse();
      }
    }, 3 * 60 * 1000); // 3분마다 빠른 pulse

    // 프로세스 종료 시 정리
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  performFastPulse() {
    try {
      // VSCode workspace 파일에 빠른 pulse
      const workspaceFile = path.join(__dirname, '../loop.code-workspace');
      if (fs.existsSync(workspaceFile)) {
        const stat = fs.statSync(workspaceFile);
        const now = new Date();
        fs.utimesSync(workspaceFile, stat.atime, now); // 수정 시간만 업데이트
        this.log('⚡ 빠른 pulse 신호 전송');
      }
    } catch (error) {
      // 무시 (빠른 pulse는 실패해도 괜찮음)
    }
  }

  performKeepAlive() {
    try {
      this.updateSessionFile();
      
      // 다중 터치 파일로 더 강력한 Keep-Alive
      this.touchFiles.forEach((touchFile, index) => {
        try {
          const dir = path.dirname(touchFile);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          const content = {
            timestamp: new Date().toISOString(),
            index: index + 1,
            sessionId: Date.now(),
            gigachad: true,
            project: 'Loop Typing Analytics',
            keepAliveCount: this.getKeepAliveCount()
          };
          
          fs.writeFileSync(touchFile, JSON.stringify(content, null, 2));
          
          // 즉시 삭제 (1초 후)
          setTimeout(() => {
            try {
              if (fs.existsSync(touchFile)) {
                fs.unlinkSync(touchFile);
              }
            } catch (error) {
              // 무시
            }
          }, 1000 + (index * 200)); // 각 파일마다 약간의 지연
          
        } catch (error) {
          this.log(`터치 파일 ${index + 1} 생성 실패: ${error.message}`);
        }
      });
      
      this.log(`✅ Keep-Alive 신호 전송 완료 (${this.touchFiles.length}개 파일)`);
      
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
    
    if (this.fastTimer) {
      clearInterval(this.fastTimer);
    }
    
    // 남은 터치 파일들 정리
    this.touchFiles.forEach(touchFile => {
      try {
        if (fs.existsSync(touchFile)) {
          fs.unlinkSync(touchFile);
        }
      } catch (error) {
        // 무시
      }
    });
    
    process.exit(0);
  }
}

// 스크립트가 직접 실행될 때만 시작
if (require.main === module) {
  new CopilotKeepAlive();
}

module.exports = CopilotKeepAlive;
