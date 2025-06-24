/**
 * 🔥 데이터베이스 서비스 - 기가차드의 SQLite + Prisma 통합
 */

import { PrismaClient } from '@prisma/client'
import path from 'path'
import { app } from 'electron'

let prisma: PrismaClient | null = null

/**
 * 데이터베이스 초기화
 */
export async function initializeDatabase(): Promise<PrismaClient> {
  try {
    if (prisma) {
      return prisma
    }

    // 사용자 데이터 디렉토리에 DB 파일 생성
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'loop.db')

    console.log(`📊 데이터베이스 경로: ${dbPath}`)

    // Prisma 클라이언트 초기화
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      }
    })

    // 데이터베이스 연결 테스트
    await prisma.$connect()
    console.log('✅ 데이터베이스 연결 성공')

    // 필요시 마이그레이션 실행
    // await prisma.$executeRaw`PRAGMA foreign_keys = ON;`

    return prisma

  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error)
    throw error
  }
}

/**
 * 데이터베이스 연결 종료
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
    console.log('🔄 데이터베이스 연결 종료')
  }
}

/**
 * Prisma 클라이언트 인스턴스 반환
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error('데이터베이스가 초기화되지 않았습니다. initializeDatabase()를 먼저 호출하세요.')
  }
  return prisma
}
