#!/usr/bin/env node

/**
 * 🔥 기가차드 긴급 한글 패치 - 즉시 적용용
 */

const fs = require('fs');
const path = require('path');

// LanguageDetector.ts 경로
const languageDetectorPath = path.join(__dirname, '../src/main/keyboard/detectors/LanguageDetector.ts');

console.log('🔥 기가차드 한글 긴급 패치 시작...');

// 현재 파일 읽기
let content = fs.readFileSync(languageDetectorPath, 'utf8');

// 1. 특수문자 → 한글 역매핑 테이블 추가
const specialCharMapping = `
  // 🔥 macOS IME 변조 keycode → 한글 역매핑 (긴급 패치!)
  private readonly SPECIAL_CHAR_TO_HANGUL: Map<number, string> = new Map([
    [33, 'ㅂ'],  // ! → ㅂ (Q키, Shift)
    [34, 'ㅈ'],  // " → ㅈ (W키, Shift)  
    [35, 'ㄷ'],  // # → ㄷ (E키, Shift)
    [64, 'ㄱ'],  // @ → ㄱ (R키, Shift)
    [37, 'ㅅ'],  // % → ㅅ (T키, Shift)
    [94, 'ㅛ'],  // ^ → ㅛ (Y키, Shift)
    [38, 'ㅕ'],  // & → ㅕ (U키, Shift)
    [42, 'ㅑ'],  // * → ㅑ (I키, Shift)
    [40, 'ㅐ'],  // ( → ㅐ (O키, Shift)
    [41, 'ㅔ'],  // ) → ㅔ (P키, Shift)
    
    // 일반 특수문자 (한글 모드에서)
    [39, 'ㅓ'],  // ' → ㅓ (J키)
    [59, 'ㅏ'],  // ; → ㅏ (K키)  
    [58, 'ㅣ'],  // : → ㅣ (L키, Shift)
    [44, 'ㅜ'],  // , → ㅜ (N키)
    [46, 'ㅡ'],  // . → ㅡ (M키)
    [47, '?'],   // / → ? (일반)
  ]);`;

// 기존 KEYCODE_TO_HANGUL 뒤에 추가
content = content.replace(
  '  ]);',
  `  ]);
${specialCharMapping}`
);

// 2. detectByKeycodeOnly 메서드에 역매핑 로직 추가
const enhancedDetection = `
    // 🔥 STEP 1: 기존 물리적 키코드 체크
    if (this.KEYCODE_TO_HANGUL.has(physicalKeycode)) {
      const hangulChar = this.KEYCODE_TO_HANGUL.get(physicalKeycode);
      this.currentLanguage = 'ko';
      
      Logger.debug(this.componentName, '🔥 물리적 keycode 기반 한글 감지!', {
        physicalKeycode,
        hangulChar,
        keycodeHex: \`0x\${physicalKeycode.toString(16)}\`
      });
      
      return this.finalizeResult({
        language: 'ko',
        confidence: 0.95,
        method: 'keycode',
        isComposing: true,
        metadata: { 
          physicalKeycode,
          hangulChar,
          reason: 'physical-keycode-mapping'
        }
      }, startTime);
    }
    
    // 🔥 STEP 2: 특수문자 역매핑 체크 (긴급 패치!)
    if (this.SPECIAL_CHAR_TO_HANGUL.has(keycode)) {
      const hangulChar = this.SPECIAL_CHAR_TO_HANGUL.get(keycode);
      this.currentLanguage = 'ko';
      
      Logger.debug(this.componentName, '🔥🔥🔥 특수문자 역매핑으로 한글 감지!', {
        keycode,
        hangulChar,
        keycodeHex: \`0x\${keycode.toString(16)}\`,
        reason: 'macOS-IME-reverse-mapping'
      });
      
      return this.finalizeResult({
        language: 'ko', 
        confidence: 0.90, // 높은 신뢰도
        method: 'reverse-mapping',
        isComposing: true,
        metadata: {
          keycode,
          hangulChar,
          reason: 'special-char-reverse-mapping'
        }
      }, startTime);
    }`;

// 기존 한글 키매핑 확인 로직 교체
content = content.replace(
  /\/\/ 한글 키매핑 확인[\s\S]*?reason: 'keycode-hangul-mapping'/,
  enhancedDetection.trim()
);

// 파일 백업 및 저장
const backupPath = languageDetectorPath + '.backup.' + Date.now();
fs.writeFileSync(backupPath, fs.readFileSync(languageDetectorPath));
fs.writeFileSync(languageDetectorPath, content);

console.log('✅ 한글 긴급 패치 완료!');
console.log('📁 백업 파일:', backupPath);
console.log('🔄 Loop 앱을 재시작해서 테스트하세요.');
console.log('🎯 이제 한글 타이핑시 특수문자(!, ", #)가 한글로 감지됩니다.');
