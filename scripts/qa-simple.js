#!/usr/bin/env node
// 🔥 기가차드 간단 QA 스크립트 - 핵심 이슈 체크

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔥 기가차드 Loop 프로젝트 QA 시작!\n');

const srcPath = path.join(process.cwd(), 'src');
const issues = [];

/**
 * 🔥 1. TypeScript 컴파일 체크
 */
function checkTypeScript() {
  console.log('🔍 1. TypeScript 타입 안전성 체크...');
  
  try {
    execSync('npx tsc --noEmit --skipLibCheck', { encoding: 'utf8', timeout: 30000 });
    console.log('✅ TypeScript 컴파일 성공');
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || '';
    const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
    
    console.log(`❌ TypeScript 에러 ${errorLines.length}개 발견:`);
    errorLines.slice(0, 5).forEach(line => {
      console.log(`   ${line.trim()}`);
      issues.push({
        category: 'TypeScript',
        severity: 'critical',
        description: line.trim(),
        priority: 'critical'
      });
    });
    
    if (errorLines.length > 5) {
      console.log(`   ... 그리고 ${errorLines.length - 5}개 더`);
    }
  }
  console.log('');
}

/**
 * 🔥 2. any 타입 사용 체크
 */
function checkAnyTypes() {
  console.log('🔍 2. any 타입 남용 체크...');
  
  const tsFiles = getAllTSFiles();
  let anyCount = 0;
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes(': any') && !line.includes('// @allow-any') && !line.includes('* any')) {
        anyCount++;
        if (anyCount <= 5) {
          const relativePath = path.relative(process.cwd(), file);
          console.log(`   ❌ ${relativePath}:${index + 1} - ${line.trim()}`);
          issues.push({
            category: 'Type Safety',
            severity: 'high',
            description: `any 타입 사용: ${relativePath}:${index + 1}`,
            priority: 'high'
          });
        }
      }
    });
  });
  
  if (anyCount === 0) {
    console.log('✅ any 타입 사용 없음');
  } else {
    console.log(`❌ any 타입 ${anyCount}개 발견 ${anyCount > 5 ? '(상위 5개만 표시)' : ''}`);
  }
  console.log('');
}

/**
 * 🔥 3. 무한 루프 위험 체크
 */
function checkInfiniteLoops() {
  console.log('🔍 3. 무한 루프 위험 체크...');
  
  const tsFiles = getAllTSFiles();
  let loopCount = 0;
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('setInterval') && 
          !content.includes('clearInterval') && 
          !line.includes('clearInterval')) {
        loopCount++;
        if (loopCount <= 3) {
          const relativePath = path.relative(process.cwd(), file);
          console.log(`   ❌ ${relativePath}:${index + 1} - setInterval without clearInterval`);
          issues.push({
            category: 'Performance',
            severity: 'critical',
            description: `무한 루프 위험: ${relativePath}:${index + 1}`,
            priority: 'critical'
          });
        }
      }
    });
  });
  
  if (loopCount === 0) {
    console.log('✅ 무한 루프 위험 없음');
  } else {
    console.log(`❌ 무한 루프 위험 ${loopCount}개 발견`);
  }
  console.log('');
}

/**
 * 🔥 4. 메모리 누수 위험 체크
 */
function checkMemoryLeaks() {
  console.log('🔍 4. 메모리 누수 위험 체크...');
  
  const tsFiles = getAllTSFiles();
  let leakCount = 0;
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // addEventListener without removeEventListener
      if (line.includes('addEventListener') && 
          !content.includes('removeEventListener')) {
        leakCount++;
        if (leakCount <= 3) {
          const relativePath = path.relative(process.cwd(), file);
          console.log(`   ❌ ${relativePath}:${index + 1} - addEventListener without cleanup`);
          issues.push({
            category: 'Memory',
            severity: 'high',
            description: `메모리 누수 위험: ${relativePath}:${index + 1}`,
            priority: 'high'
          });
        }
      }
    });
  });
  
  if (leakCount === 0) {
    console.log('✅ 메모리 누수 위험 없음');
  } else {
    console.log(`❌ 메모리 누수 위험 ${leakCount}개 발견`);
  }
  console.log('');
}

/**
 * 🔥 5. 보안 위험 체크
 */
function checkSecurity() {
  console.log('🔍 5. 보안 위험 체크...');
  
  const tsFiles = getAllTSFiles();
  let securityCount = 0;
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // eval(), innerHTML, 하드코딩된 비밀정보 체크
      const securityPatterns = [
        { pattern: /eval\(/, risk: 'eval() 사용' },
        { pattern: /innerHTML/, risk: 'innerHTML 사용' },
        { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, risk: '하드코딩된 패스워드' },
        { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/, risk: '하드코딩된 API 키' }
      ];
      
      securityPatterns.forEach(({ pattern, risk }) => {
        if (pattern.test(line) && !line.includes('process.env')) {
          securityCount++;
          if (securityCount <= 5) {
            const relativePath = path.relative(process.cwd(), file);
            console.log(`   ❌ ${relativePath}:${index + 1} - ${risk}`);
            issues.push({
              category: 'Security',
              severity: 'critical',
              description: `보안 위험: ${risk} at ${relativePath}:${index + 1}`,
              priority: 'critical'
            });
          }
        }
      });
    });
  });
  
  if (securityCount === 0) {
    console.log('✅ 보안 위험 없음');
  } else {
    console.log(`❌ 보안 위험 ${securityCount}개 발견`);
  }
  console.log('');
}

/**
 * 🔥 6. React 성능 이슈 체크
 */
function checkReactPerformance() {
  console.log('🔍 6. React 성능 이슈 체크...');
  
  const tsxFiles = getAllTSFiles().filter(f => f.endsWith('.tsx'));
  let reactCount = 0;
  
  tsxFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // useEffect without dependencies
      if (line.includes('useEffect') && index < lines.length - 5) {
        const nextLines = lines.slice(index, index + 5).join('\n');
        if (!nextLines.includes('], [') && !nextLines.includes('], []')) {
          reactCount++;
          if (reactCount <= 3) {
            const relativePath = path.relative(process.cwd(), file);
            console.log(`   ❌ ${relativePath}:${index + 1} - useEffect without dependencies`);
            issues.push({
              category: 'React Performance',
              severity: 'medium',
              description: `React 성능 이슈: ${relativePath}:${index + 1}`,
              priority: 'medium'
            });
          }
        }
      }
      
      // Inline object creation
      if (line.includes('style={{') || line.includes('className={')) {
        reactCount++;
        if (reactCount <= 3) {
          const relativePath = path.relative(process.cwd(), file);
          console.log(`   ⚠️ ${relativePath}:${index + 1} - Inline object creation`);
        }
      }
    });
  });
  
  if (reactCount === 0) {
    console.log('✅ React 성능 이슈 없음');
  } else {
    console.log(`❌ React 성능 이슈 ${reactCount}개 발견`);
  }
  console.log('');
}

/**
 * 🔥 7. Electron 보안 체크
 */
function checkElectronSecurity() {
  console.log('🔍 7. Electron 보안 체크...');
  
  const tsFiles = getAllTSFiles();
  let electronCount = 0;
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 보안 설정 체크
    if (content.includes('new BrowserWindow')) {
      if (!content.includes('contextIsolation: true')) {
        electronCount++;
        const relativePath = path.relative(process.cwd(), file);
        console.log(`   ❌ ${relativePath} - contextIsolation not enabled`);
        issues.push({
          category: 'Electron Security',
          severity: 'critical',
          description: `Electron 보안: contextIsolation 미활성화 ${relativePath}`,
          priority: 'critical'
        });
      }
      
      if (content.includes('nodeIntegration: true')) {
        electronCount++;
        const relativePath = path.relative(process.cwd(), file);
        console.log(`   ❌ ${relativePath} - nodeIntegration enabled`);
        issues.push({
          category: 'Electron Security',
          severity: 'critical',
          description: `Electron 보안: nodeIntegration 활성화 ${relativePath}`,
          priority: 'critical'
        });
      }
    }
    
    // deprecated remote 모듈 사용 체크
    if (content.includes('remote.')) {
      electronCount++;
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ❌ ${relativePath} - deprecated remote module usage`);
      issues.push({
        category: 'Electron Security',
        severity: 'high',
        description: `Electron 보안: deprecated remote 모듈 사용 ${relativePath}`,
        priority: 'high'
      });
    }
  });
  
  if (electronCount === 0) {
    console.log('✅ Electron 보안 이슈 없음');
  } else {
    console.log(`❌ Electron 보안 이슈 ${electronCount}개 발견`);
  }
  console.log('');
}

/**
 * 🔥 유틸리티 함수들
 */
function getAllTSFiles() {
  const files = [];
  
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walkDir(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    });
  }
  
  walkDir(srcPath);
  return files;
}

/**
 * 🔥 결과 리포트 생성
 */
function generateReport() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔥 기가차드 Loop 프로젝트 QA 결과 요약');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const criticalIssues = issues.filter(i => i.priority === 'critical');
  const highIssues = issues.filter(i => i.priority === 'high');
  const mediumIssues = issues.filter(i => i.priority === 'medium');
  
  console.log(`📊 총 이슈 수: ${issues.length}개`);
  console.log('');
  console.log('🎯 우선순위별 이슈:');
  console.log(`  🔴 Critical: ${criticalIssues.length}개 (즉시 수정 필요)`);
  console.log(`  🟡 High: ${highIssues.length}개 (1주 내 수정)`);
  console.log(`  🟢 Medium: ${mediumIssues.length}개 (기능 개발 후)`);
  console.log('');
  
  // 점수 계산 (100점 만점)
  const score = Math.max(0, 100 - (criticalIssues.length * 20) - (highIssues.length * 10) - (mediumIssues.length * 5));
  console.log(`🏆 전체 품질 점수: ${score}/100`);
  
  if (score >= 90) {
    console.log('🎉 우수한 코드 품질입니다!');
  } else if (score >= 70) {
    console.log('👍 양호한 코드 품질입니다.');
  } else if (score >= 50) {
    console.log('⚠️ 개선이 필요한 코드 품질입니다.');
  } else {
    console.log('🚨 심각한 문제가 있습니다. 즉시 수정이 필요합니다.');
  }
  
  console.log('');
  console.log('🔥 권장 작업 순서:');
  console.log('1. 🔴 Critical 이슈부터 수정');
  console.log('2. 🟡 High 이슈 수정');
  console.log('3. 🟢 Medium 이슈 수정');
  console.log('4. 성능 최적화 및 코드 리팩터링');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // JSON 리포트 저장
  const reportData = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    score,
    summary: {
      critical: criticalIssues.length,
      high: highIssues.length,
      medium: mediumIssues.length
    },
    issues
  };
  
  fs.writeFileSync('qa-report.json', JSON.stringify(reportData, null, 2));
  console.log('📄 상세 리포트가 qa-report.json에 저장되었습니다.');
}

/**
 * 🔥 메인 실행
 */
function main() {
  try {
    checkTypeScript();
    checkAnyTypes();
    checkInfiniteLoops();
    checkMemoryLeaks();
    checkSecurity();
    checkReactPerformance();
    checkElectronSecurity();
    generateReport();
  } catch (error) {
    console.error('❌ QA 실행 중 오류:', error.message);
    process.exit(1);
  }
}

// 실행
main();
