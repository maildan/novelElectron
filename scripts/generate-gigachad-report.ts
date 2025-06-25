/**
 * 🔥 기가차드 최종 성과 리포트 생성기
 * GigaChad Final Performance Report Generator
 */

import { runGigaChadBenchmarks } from '../src/shared/common';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateFinalReport() {
  console.log('🔥 기가차드 최종 리포트 생성 시작!');
  
  try {
    const report = await runGigaChadBenchmarks();
    
    // JSON Schema 리포트 저장
    writeFileSync(
      join(__dirname, 'gigachad-performance-schema.json'),
      JSON.stringify(report.jsonSchema, null, 2)
    );
    
    // Diff Patch 리포트 저장
    writeFileSync(
      join(__dirname, 'gigachad-diff-patch.json'),
      JSON.stringify(report.diffPatch, null, 2)
    );
    
    // Markdown 리포트 저장
    writeFileSync(
      join(__dirname, 'GIGACHAD_FINAL_REPORT.md'),
      report.markdownTable
    );
    
    console.log('✅ 기가차드 최종 리포트 생성 완료!');
    console.log('📊 파일 생성:');
    console.log('  - gigachad-performance-schema.json');
    console.log('  - gigachad-diff-patch.json');
    console.log('  - GIGACHAD_FINAL_REPORT.md');
    
  } catch (error) {
    console.error('❌ 리포트 생성 실패:', error);
  }
}

// 실행
generateFinalReport();
