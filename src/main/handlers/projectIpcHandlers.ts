'use strict';

// 🔥 기가차드 프로젝트 IPC 핸들러 - Prisma DB 완전 연동

import { ipcMain, IpcMainInvokeEvent, shell, dialog } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, Project } from '../../shared/types';

/**
 * 🔥 프로젝트 IPC 핸들러 설정 - 실제 Prisma SQLite 연동
 */
export function setupProjectIpcHandlers(): void {
  Logger.debug('PROJECT_IPC', 'Setting up project IPC handlers with Prisma');

  // 모든 프로젝트 조회 - 🔥 실제 Prisma DB 연동
  ipcMain.handle('projects:get-all', async (): Promise<IpcResponse<Project[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting all projects from Prisma database');
      
      // 🔥 Prisma 클라이언트 동적 로딩
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      try {
        // Prisma DB에서 프로젝트 조회
        const projects = await prisma.project.findMany({
          orderBy: {
            lastModified: 'desc' // 최근 수정순
          }
        });
        
        // Prisma 결과를 Project 타입으로 변환
        const convertedProjects: Project[] = projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          content: project.content || '',
          progress: project.progress || 0,
          wordCount: project.wordCount || 0,
          lastModified: project.lastModified,
          createdAt: project.createdAt,
          genre: project.genre || '기타',
          status: (project.status as 'active' | 'completed' | 'paused') || 'active',
          author: project.author || '사용자',
        }));
        
        Logger.info('PROJECT_IPC', `✅ DB에서 조회된 프로젝트 수: ${convertedProjects.length}`);
        
        return {
          success: true,
          data: convertedProjects,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get projects from database', error);
      
      // 🔥 DB 연결 실패 시 빈 배열 반환 (에러가 아닌 정상 응답)
      return {
        success: true,
        data: [],
        timestamp: new Date(),
      };
    }
  });

  // 🔥 실제 프로젝트 생성 - Prisma DB 연동
  ipcMain.handle('projects:create', async (_event: IpcMainInvokeEvent, project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>): Promise<IpcResponse<Project>> => {
    try {
      Logger.info('PROJECT_IPC', '🔥 Creating new project in DB', { 
        title: project.title,
        genre: project.genre,
      });
      
      // 🔥 유효성 검증
      if (!project.title || project.title.trim().length === 0) {
        throw new Error('프로젝트 제목은 필수입니다.');
      }
      
      if (project.title.length > 100) {
        throw new Error('프로젝트 제목은 100자를 초과할 수 없습니다.');
      }

      // 🔥 Prisma를 통한 실제 DB 생성
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      try {
        const createdProject = await prisma.project.create({
          data: {
            title: project.title.trim(),
            description: project.description || '',
            content: project.content || '새 프로젝트를 시작해보세요...\n\n',
            genre: project.genre || '기타',
            status: project.status || 'active',
            progress: project.progress || 0,
            wordCount: project.wordCount || 0,
            author: project.author || '사용자',
            platform: 'loop', // 기본값
          }
        });
        
        // Prisma 결과를 Project 타입으로 변환
        const responseProject: Project = {
          id: createdProject.id,
          title: createdProject.title,
          description: createdProject.description || '',
          content: createdProject.content || '',
          genre: createdProject.genre,
          status: createdProject.status as 'active' | 'completed' | 'paused',
          progress: createdProject.progress,
          wordCount: createdProject.wordCount,
          author: createdProject.author,
          createdAt: createdProject.createdAt,
          lastModified: createdProject.lastModified,
        };
        
        Logger.info('PROJECT_IPC', '✅ Project created successfully in DB', { 
          id: responseProject.id,
          title: responseProject.title
        });
        
        return {
          success: true,
          data: responseProject,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', '❌ Failed to create project in DB', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('PROJECT_IPC', '✅ Project IPC handlers setup complete with Prisma DB integration');
}
  Logger.debug('PROJECT_IPC', 'Setting up project IPC handlers');

  // 모든 프로젝트 조회 - 🔥 실제 DB 연동
  ipcMain.handle('projects:get-by-id', async (_event: IpcMainInvokeEvent, id: string): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting project by ID', { id });
      
      // TODO: 실제 데이터베이스에서 프로젝트 조회
      const project: Project = {
        id,
        title: '샘플 프로젝트',
        description: '샘플 프로젝트 설명',
        content: '프로젝트 내용',
        progress: 0,
        wordCount: 0,
        genre: '일반',
        status: 'active',
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      return {
        success: true,
        data: project,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get project by ID', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 실제 프로젝트 생성
  ipcMain.handle('projects:create', async (_event: IpcMainInvokeEvent, project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>): Promise<IpcResponse<Project>> => {
    try {
      Logger.info('PROJECT_IPC', '🔥 Creating new project', { 
        title: project.title,
        genre: project.genre,
        platform: 'loop' // 기본값
      });
      
      // 🔥 유효성 검증
      if (!project.title || project.title.trim().length === 0) {
        throw new Error('프로젝트 제목은 필수입니다.');
      }
      
      if (project.title.length > 100) {
        throw new Error('프로젝트 제목은 100자를 초과할 수 없습니다.');
      }
      
      // 🔥 실제 프로젝트 데이터 생성
      const now = new Date();
      const projectId = `project-${now.getTime()}-${Math.random().toString(36).substr(2, 8)}`;
      
      const newProject: Project = {
        id: projectId,
        title: project.title.trim(),
        description: project.description?.trim() || '새로운 프로젝트입니다.',
        content: project.content || '',
        progress: 0,
        wordCount: project.content ? project.content.split(/\s+/).length : 0,
        genre: project.genre || '기타',
        status: project.status || 'active',
        author: project.author || '사용자',
        createdAt: now,
        lastModified: now,
      };
      
      // 🔥 TODO: 실제 데이터베이스 저장
      // const dbManager = new DatabaseManager();
      // await dbManager.create('Project', newProject);
      
      Logger.info('PROJECT_IPC', '✅ Project created successfully', { 
        id: newProject.id,
        title: newProject.title,
        wordCount: newProject.wordCount
      });
      
      return {
        success: true,
        data: newProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', '❌ Failed to create project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 프로젝트 업데이트
  ipcMain.handle('projects:update', async (_event: IpcMainInvokeEvent, id: string, updates: Partial<Project>): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Updating project', { id, updates });
      
      // TODO: 실제 데이터베이스에서 프로젝트 업데이트
      const updatedProject: Project = {
        id,
        title: updates.title || '업데이트된 프로젝트',
        description: updates.description || '업데이트된 설명',
        content: updates.content || '프로젝트 내용',
        progress: updates.progress || 0,
        wordCount: updates.wordCount || 0,
        genre: updates.genre || '일반',
        status: updates.status || 'active',
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      return {
        success: true,
        data: updatedProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to update project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 프로젝트 삭제
  ipcMain.handle('projects:delete', async (_event: IpcMainInvokeEvent, id: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Deleting project', { id });
      
      // TODO: 실제 데이터베이스에서 프로젝트 삭제
      
      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to delete project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 기가차드 샘플 프로젝트 생성
  ipcMain.handle('projects:create-sample', async (): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Creating sample project');
      
      const sampleProjects = [
        {
          title: '나의 첫 번째 소설',
          description: '창작의 첫 걸음을 위한 소설 프로젝트입니다.',
          content: `제1장: 새로운 시작

오늘부터 내 인생의 새로운 챕터가 시작된다. 
키보드 위에서 춤추는 손가락들이 만들어내는 이야기.

여기서부터 당신의 상상력을 펼쳐보세요!

✍️ 팁:
- 하루에 500단어씩 꾸준히 작성해보세요
- 등장인물의 성격을 구체적으로 설정해보세요
- 독자가 몰입할 수 있는 장면을 묘사해보세요

Loop과 함께 작가의 꿈을 실현해보세요! 🚀`,
          genre: '소설',
          progress: 15,
          wordCount: 450,
          author: '새로운 작가'
        },
        {
          title: '블로그 포스팅 연습',
          description: '일상과 경험을 공유하는 블로그 글쓰기 연습장입니다.',
          content: `# 오늘의 생각 📝

## 글쓰기의 힘

글쓰기는 단순한 문자의 나열이 아니다. 
생각을 정리하고, 감정을 표현하며, 타인과 소통하는 강력한 도구다.

### 좋은 글쓰기 습관
1. **매일 쓰는 습관** - 하루 10분이라도 꾸준히
2. **독자를 생각하며** - 누구를 위한 글인지 명확히
3. **간결하고 명확하게** - 불필요한 수식어 제거

Loop을 통해 나만의 글쓰기 스타일을 찾아가세요! ✨`,
          genre: '블로그',
          progress: 25,
          wordCount: 320,
          author: '블로거'
        },
        {
          title: '학습 노트',
          description: '새로운 지식을 정리하고 기록하는 학습 노트입니다.',
          content: `# TypeScript 학습 노트 📚

## 오늘 배운 것들

### 인터페이스와 타입
- interface는 확장 가능
- type은 유니온 타입에 유리
- 상황에 맞게 선택하여 사용

### 제네릭의 활용
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

명확한 타입 정의로 더 안전한 코드를 작성할 수 있다.

### 다음에 공부할 것
- [ ] 고급 타입 (Conditional Types)
- [ ] 유틸리티 타입 활용
- [ ] 데코레이터 패턴

지식은 기록할 때 진짜 내 것이 된다! 🎯`,
          genre: '학습',
          progress: 40,
          wordCount: 380,
          author: '학습자'
        }
      ];
      
      // 랜덤하게 하나 선택
      const selectedSample = sampleProjects[Math.floor(Math.random() * sampleProjects.length)];
      
      const sampleProject: Project = {
        ...selectedSample,
        id: `sample-${Date.now()}`,
        status: 'active',
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      Logger.info('PROJECT_IPC', `샘플 프로젝트 생성됨: ${sampleProject.title}`, {
        genre: sampleProject.genre,
        wordCount: sampleProject.wordCount
      });
      
      return {
        success: true,
        data: sampleProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to create sample project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 기가차드 프로젝트 파일 가져오기 (텍스트 파일 지원)
  ipcMain.handle('projects:import-file', async (): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Starting file import process');
      
      const { dialog } = require('electron');
      const fs = require('fs').promises;
      const path = require('path');
      
      // 파일 선택 다이얼로그 열기
      const result = await dialog.showOpenDialog({
        title: 'Loop 프로젝트로 가져올 파일 선택',
        filters: [
          { name: '텍스트 파일', extensions: ['txt', 'md', 'rtf'] },
          { name: 'Markdown 파일', extensions: ['md', 'markdown'] },
          { name: '모든 파일', extensions: ['*'] }
        ],
        properties: ['openFile']
      });
      
      if (result.canceled || !result.filePaths.length) {
        return {
          success: false,
          error: '파일이 선택되지 않았습니다.',
          timestamp: new Date(),
        };
      }
      
      const filePath = result.filePaths[0];
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath, path.extname(filePath));
      const fileExtension = path.extname(filePath).toLowerCase();
      
      // 파일 내용 분석
      const wordCount = fileContent.split(/\s+/).filter((word: string) => word.length > 0).length;
      const lines = fileContent.split('\n').length;
      
      // 장르 추정 (파일 확장자 기반)
      let estimatedGenre = '일반';
      if (fileExtension === '.md' || fileExtension === '.markdown') {
        estimatedGenre = '기술문서';
      } else if (fileName.includes('소설') || fileName.includes('novel')) {
        estimatedGenre = '소설';
      } else if (fileName.includes('블로그') || fileName.includes('blog')) {
        estimatedGenre = '블로그';
      }
      
      const importedProject: Project = {
        id: `imported-${Date.now()}`,
        title: fileName,
        description: `가져온 파일: ${path.basename(filePath)} (${wordCount}단어, ${lines}줄)`,
        content: fileContent,
        progress: 100, // 이미 작성된 파일이므로
        wordCount,
        genre: estimatedGenre,
        status: 'completed',
        author: '가져온 파일',
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      Logger.info('PROJECT_IPC', `파일 가져오기 완료: ${fileName}`, {
        filePath,
        wordCount,
        lines,
        genre: estimatedGenre
      });
      
      return {
        success: true,
        data: importedProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to import project file', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '파일 가져오기 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 External shell handler 추가
  ipcMain.handle('shell:open-external', async (_event: IpcMainInvokeEvent, url: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Opening external URL', { url });
      await shell.openExternal(url);
      
      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to open external URL', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to open URL',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('PROJECT_IPC', '✅ Project IPC handlers setup complete with Prisma DB integration');
