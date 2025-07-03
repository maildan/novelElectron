'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Logger } from '../../../../shared/logger';
import { calculateWriterStats, type WriterStats as WriterStatsType } from '../editor/WriterStats';
import { useAutoSave } from './useAutoSave';
import { ProjectCharacter, ProjectStructure, ProjectNote } from '../../../../shared/types';

// 저장 상태 타입
type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

interface UseProjectDataReturn {
  // 프로젝트 상태
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  lastSaved: Date | null;
  saveStatus: SaveStatus;
  
  // 작가 데이터
  characters: ProjectCharacter[];
  setCharacters: (characters: ProjectCharacter[]) => void;
  structure: ProjectStructure[];
  setStructure: (structure: ProjectStructure[]) => void;
  writerStats: WriterStatsType;
  
  // 액션
  loadProject: () => Promise<void>;
  saveProject: () => Promise<void>;
  forceSave: () => Promise<void>; // 🔥 즉시 저장 (Ctrl+S)
  updateWriterStats: () => void;
  setWordGoal: (goal: number) => void;
}

export function useProjectData(projectId: string): UseProjectDataReturn {
  const sessionStartRef = useRef<number>(Date.now());
  
  // 🔥 기본 프로젝트 상태
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  
  // 🔥 작가 데이터
  const [characters, setCharacters] = useState<ProjectCharacter[]>([]);
  const [structure, setStructure] = useState<ProjectStructure[]>([]);
  const [writerStats, setWriterStats] = useState<WriterStatsType>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0,
    readingTime: 0,
    wordGoal: 1000,
    progress: 0,
    sessionTime: 0,
    wpm: 0
  });

  // 🔥 프로젝트 로드
  const loadProject = useCallback(async (): Promise<void> => {
    try {
      Logger.debug('PROJECT_DATA', 'Loading project', { projectId });
      
      const result = await window.electronAPI.projects.getById(projectId);
      if (result.success && result.data) {
        setTitle(result.data.title);
        setContent(result.data.content);
        setLastSaved(new Date(result.data.lastModified));
        
        // 🔥 실제 데이터 로드 - 캐릭터 데이터
        try {
          const charactersResult = await window.electronAPI.projects.getCharacters(projectId);
          if (charactersResult.success && charactersResult.data) {
            setCharacters(charactersResult.data);
            Logger.debug('PROJECT_DATA', 'Characters loaded successfully', { count: charactersResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No characters found, using defaults');
            // 기본 캐릭터 데이터
            setCharacters([
              { 
                id: '1', 
                projectId: projectId,
                name: '주인공', 
                role: '주요 인물', 
                notes: '용감하고 정의로운 성격',
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '2', 
                projectId: projectId,
                name: '조력자', 
                role: '조력자', 
                notes: '지혜롭고 경험이 많음',
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '3', 
                projectId: projectId,
                name: '적대자', 
                role: '적대자', 
                notes: '야망이 크고 냉혹함',
                createdAt: new Date(),
                updatedAt: new Date()
              },
            ]);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load characters, using defaults', error);
          setCharacters([
            { 
              id: '1', 
              projectId: projectId,
              name: '주인공', 
              role: '주요 인물', 
              notes: '용감하고 정의로운 성격',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '2', 
              projectId: projectId,
              name: '조력자', 
              role: '조력자', 
              notes: '지혜롭고 경험이 많음',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '3', 
              projectId: projectId,
              name: '적대자', 
              role: '적대자', 
              notes: '야망이 크고 냉혹함',
              createdAt: new Date(),
              updatedAt: new Date()
            },
          ]);
        }
        
        // 🔥 실제 데이터 로드 - 구조 데이터
        try {
          const structureResult = await window.electronAPI.projects.getStructure(projectId);
          if (structureResult.success && structureResult.data) {
            setStructure(structureResult.data);
            Logger.debug('PROJECT_DATA', 'Structure loaded successfully', { count: structureResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No structure found, using defaults');
            // 기본 구조 데이터
            setStructure([
              { 
                id: '1', 
                projectId: projectId,
                type: 'chapter', 
                title: '1장: 시작',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '2', 
                projectId: projectId,
                type: 'scene', 
                title: '첫 번째 장면',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '3', 
                projectId: projectId,
                type: 'scene', 
                title: '두 번째 장면',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '4', 
                projectId: projectId,
                type: 'chapter', 
                title: '2장: 전개',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '5', 
                projectId: projectId,
                type: 'scene', 
                title: '세 번째 장면',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '6', 
                projectId: projectId,
                type: 'note', 
                title: '아이디어 메모',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
            ]);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load structure, using defaults', error);
          setStructure([
            { 
              id: '1', 
              projectId: projectId,
              type: 'chapter', 
              title: '1장: 시작',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '2', 
              projectId: projectId,
              type: 'scene', 
              title: '첫 번째 장면',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '3', 
              projectId: projectId,
              type: 'scene', 
              title: '두 번째 장면',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '4', 
              projectId: projectId,
              type: 'chapter', 
              title: '2장: 전개',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '5', 
              projectId: projectId,
              type: 'scene', 
              title: '세 번째 장면',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '6', 
              projectId: projectId,
              type: 'note', 
              title: '아이디어 메모',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
          ]);
        }
        
      } else {
        Logger.error('PROJECT_DATA', 'Failed to load project', result.error);
        
        // 서버에서 로드 실패 시 로컬 스토리지 백업 확인
        try {
          const backup = localStorage.getItem(`project_backup_${projectId}`);
          if (backup) {
            const backupData = JSON.parse(backup);
            setTitle(backupData.title || '');
            setContent(backupData.content || '');
            Logger.info('PROJECT_DATA', 'Loaded from local backup');
          }
        } catch (storageError) {
          Logger.error('PROJECT_DATA', 'Failed to load backup', storageError);
        }
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error loading project', error);
    }
  }, [projectId]);

  // 🔥 프로젝트 저장 함수 (내부용)
  const saveProjectInternal = useCallback(async (): Promise<void> => {
    try {
      if (!title.trim() && !content.trim()) return;
      
      Logger.debug('PROJECT_DATA', 'Saving project to server', { projectId });
      
      // 🔥 로컬 백업 먼저 저장 (즉시)
      try {
        const backupData = { title, content, lastModified: new Date() };
        localStorage.setItem(`project_backup_${projectId}`, JSON.stringify(backupData));
        Logger.debug('PROJECT_DATA', 'Local backup saved');
      } catch (storageError) {
        Logger.warn('PROJECT_DATA', 'Failed to save local backup', storageError);
      }
      
      // 🔥 즉시 서버 저장
      const result = await window.electronAPI.projects.update(projectId, {
        title,
        content,
        lastModified: new Date()
      });
      
      if (result.success) {
        setLastSaved(new Date());
        Logger.info('PROJECT_DATA', 'Project saved successfully to server');
        
        // 성공 시 로컬 백업 제거
        try {
          localStorage.removeItem(`project_backup_${projectId}`);
        } catch (e) {
          // 무시
        }
      } else {
        throw new Error(result.error || 'Failed to save project');
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving project', error);
      throw error;
    }
  }, [projectId, title, content]);

  // 🔥 개선된 autoSave Hook 사용 - 성능 최적화
  const { debouncedSave, forceSave, isLoading: isSaving } = useAutoSave({
    projectId,
    delay: 800, // 0.8초 딜레이로 더 빠른 반응
    onSave: saveProjectInternal,
    onSaveSuccess: () => {
      setSaveStatus('saved');
      setLastSaved(new Date());
      Logger.info('PROJECT_DATA', '✅ 자동 저장 완료', { projectId });
    },
    onSaveError: (error: Error) => {
      setSaveStatus('error');
      Logger.error('PROJECT_DATA', '❌ 자동 저장 실패', { error: error.message, projectId });
      
      // 에러 발생 시 로컬 백업 생성
      try {
        localStorage.setItem(`project_backup_${projectId}`, JSON.stringify({ title, content }));
        Logger.info('PROJECT_DATA', '📦 로컬 백업 저장됨', { projectId });
      } catch (backupError) {
        Logger.error('PROJECT_DATA', '❌ 로컬 백업 실패', backupError);
      }
    }
  });

  // 🔥 호환성을 위한 saveProject 함수
  const saveProject = useCallback(async (): Promise<void> => {
    await forceSave();
  }, [forceSave]);
  
  // 🔥 작가 통계 업데이트
  const updateWriterStats = useCallback((): void => {
    if (!content) return;
    
    const sessionMinutes = Math.max(1, (Date.now() - sessionStartRef.current) / 1000 / 60);
    const newStats = calculateWriterStats(content, writerStats.wordGoal, sessionStartRef.current);
    
    setWriterStats(newStats);
  }, [content, writerStats.wordGoal]);
  
  const setWordGoal = useCallback((goal: number): void => {
    setWriterStats((prev: WriterStatsType) => ({
      ...prev,
      wordGoal: goal,
      progress: Math.min(100, Math.round((prev.wordCount / goal) * 100))
    }));
  }, []);

  // 🔥 새로운 autoSave 시스템으로 자동 저장 트리거
  useEffect(() => {
    if (title.trim() || content.trim()) {
      setSaveStatus('unsaved');
      debouncedSave(); // 새로운 debounced save 사용
    }
  }, [title, content, debouncedSave]);

  // 🔥 저장 중 상태 관리
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    }
  }, [isSaving]);

  // 🔥 통계 업데이트
  useEffect(() => {
    updateWriterStats();
    
    // 세션 시간 주기적 업데이트 (30초로 단축)
    const interval = setInterval(() => {
      setWriterStats((prev: WriterStatsType) => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStartRef.current) / 1000 / 60)
      }));
    }, 30000); // 1분에서 30초로 단축
    
    return () => clearInterval(interval);
  }, [content, updateWriterStats]);

  return {
    title,
    setTitle,
    content,
    setContent,
    lastSaved,
    saveStatus,
    characters,
    setCharacters,
    structure,
    setStructure,
    writerStats,
    loadProject,
    saveProject,
    forceSave, // 🔥 새로운 즉시 저장 함수
    updateWriterStats,
    setWordGoal
  };
}
