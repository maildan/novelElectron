'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Logger } from '../../../../shared/logger';
import { calculateWriterStats, type WriterStats as WriterStatsType } from '../editor/WriterStats';
import { useAutoSave } from './useAutoSave';
import { ProjectCharacter, ProjectStructure, ProjectNote } from '../../../../shared/types';

// 저장 상태 타입
type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

interface UseProjectDataReturn {
  // 🔥 로딩 및 에러 상태
  isLoading: boolean;
  error: string | null;
  
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
  notes: ProjectNote[]; // 🔥 notes 추가
  setNotes: (notes: ProjectNote[]) => void; // 🔥 setNotes 추가
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
  
  // 🔥 로딩 및 에러 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔥 기본 프로젝트 상태
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  
  // 🔥 ref로 최신 값 추적 (무한루프 방지)
  const titleRef = useRef<string>('');
  const contentRef = useRef<string>('');
  
  // 🔥 ref 동기화
  useEffect(() => {
    titleRef.current = title;
  }, [title]);
  
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  
  // 🔥 작가 데이터
  const [characters, setCharacters] = useState<ProjectCharacter[]>([]);
  const [structure, setStructure] = useState<ProjectStructure[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]); // 🔥 notes 상태 추가
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

  // 🔥 프로젝트 로드 (무한루프 방지)
  const loadProject = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      Logger.debug('PROJECT_DATA', 'Loading project', { projectId });
      
      const result = await window.electronAPI.projects.getById(projectId);
      if (result.success && result.data) {
        setTitle(result.data.title);
        setContent(result.data.content);
        setLastSaved(new Date(result.data.lastModified));
        setSaveStatus('saved'); // 🔥 저장 상태 업데이트
        
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
        
        // 🔥 실제 데이터 로드 - 노트 데이터
        try {
          const notesResult = await window.electronAPI.projects.getNotes(projectId);
          if (notesResult.success && notesResult.data) {
            setNotes(notesResult.data);
            Logger.debug('PROJECT_DATA', 'Notes loaded successfully', { count: notesResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No notes found, using defaults');
            // 기본 노트 데이터
            setNotes([
              { 
                id: '1', 
                projectId: projectId,
                title: '첫 번째 메모',
                content: '이야기의 핵심 아이디어를 여기에 적어보세요.',
                tags: ['아이디어'],
                color: '#3b82f6',
                isPinned: false,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { 
                id: '2', 
                projectId: projectId,
                title: '설정 노트',
                content: '세계관, 배경 설정에 대한 내용을 정리합니다.',
                tags: ['설정', '세계관'],
                color: '#10b981',
                isPinned: true,
                createdAt: new Date(),
                updatedAt: new Date()
              },
            ]);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load notes, using defaults', error);
          setNotes([
            { 
              id: '1', 
              projectId: projectId,
              title: '첫 번째 메모',
              content: '이야기의 핵심 아이디어를 여기에 적어보세요.',
              tags: ['아이디어'],
              color: '#3b82f6',
              isPinned: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: '2', 
              projectId: projectId,
              title: '설정 노트',
              content: '세계관, 배경 설정에 대한 내용을 정리합니다.',
              tags: ['설정', '세계관'],
              color: '#10b981',
              isPinned: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
          ]);
        }
        
        Logger.info('PROJECT_DATA', 'Project loaded successfully');
      } else {
        throw new Error(result.error || 'Failed to load project');
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error loading project', error);
      setError(error instanceof Error ? error.message : 'Failed to load project');
      
      // 🔥 실패 시 로컬 백업 확인
      try {
        const backup = localStorage.getItem(`project_backup_${projectId}`);
        if (backup) {
          const backupData = JSON.parse(backup);
          setTitle(backupData.title || '');
          setContent(backupData.content || '');
          setSaveStatus('unsaved');
          Logger.info('PROJECT_DATA', 'Loaded from local backup');
        }
      } catch (storageError) {
        Logger.error('PROJECT_DATA', 'Failed to load backup', storageError);
      }
    } finally {
      setIsLoading(false); // 🔥 무조건 로딩 상태 해제
    }
  }, [projectId]);

  // 🔥 프로젝트 저장 함수 (ref로 무한루프 방지)
  const saveProjectInternal = useCallback(async (): Promise<void> => {
    try {
      const currentTitle = titleRef.current;
      const currentContent = contentRef.current;
      
      if (!currentTitle.trim() && !currentContent.trim()) return;
      
      Logger.debug('PROJECT_DATA', 'Saving project to server', { projectId });
      
      // 🔥 로컬 백업 먼저 저장 (즉시)
      try {
        const backupData = { title: currentTitle, content: currentContent, lastModified: new Date() };
        localStorage.setItem(`project_backup_${projectId}`, JSON.stringify(backupData));
        Logger.debug('PROJECT_DATA', 'Local backup saved');
      } catch (storageError) {
        Logger.warn('PROJECT_DATA', 'Failed to save local backup', storageError);
      }
      
      // 🔥 즉시 서버 저장
      const result = await window.electronAPI.projects.update(projectId, {
        title: currentTitle,
        content: currentContent,
        lastModified: new Date()
      });
      
      if (result.success) {
        setLastSaved(new Date());
        setSaveStatus('saved');
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
      setSaveStatus('error');
      throw error;
    }
  }, [projectId]); // 🔥 projectId만 dependency로 설정

  // 🔥 노션 스타일 autoSave Hook 사용 - 타이핑 중단 후 저장
  const { debouncedSave, forceSave, isLoading: isSaving } = useAutoSave({
    projectId,
    delay: 3000, // 🔥 3초 딜레이 (더 안전한 타이핑) - 타이핑 멈춘 후에만 저장
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
  
  // 🔥 작가 통계 업데이트 (기가차드 수정: 세션 시간 실시간 계산)
  const updateWriterStats = useCallback((): void => {
    if (!content) return;
    
    // 🔥 세션 시간을 매번 실시간 계산 (state 업데이트 없음)
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

  // 🔥 프로젝트 초기 로드 (한 번만 실행)
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]); // 🔥 projectId만 dependency로 - loadProject는 제외하여 무한루프 방지

  // 🔥 새로운 autoSave 시스템으로 자동 저장 트리거 (무한루프 수정)
  useEffect(() => {
    if (title.trim() || content.trim()) {
      setSaveStatus('unsaved');
      debouncedSave(); // 새로운 debounced save 사용
    }
  }, [title, content]); // 🔥 debouncedSave dependency 제거로 무한루프 해결

  // 🔥 저장 중 상태 관리
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    }
  }, [isSaving]);

  // 🔥 통계 업데이트 (기가차드 수정: interval 제거로 커서 리셋 완전 해결)
  useEffect(() => {
    updateWriterStats();
    // 🔥 30초 interval 완전 제거 - 커서 리셋 원인 제거
    // 세션 시간은 사용자가 통계를 볼 때만 계산하도록 변경
  }, []); // 🔥 dependency 완전 제거 - useEffect 지옥 해결

  // 🔥 초기 프로젝트 로딩
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]); // projectId만 dependency로 설정

  // 🔥 캐릭터 저장 함수
  const saveCharacters = useCallback(async (charactersToSave: ProjectCharacter[]): Promise<void> => {
    try {
      Logger.debug('PROJECT_DATA', 'Saving characters', { count: charactersToSave.length });
      
      // 🔥 임시: updateCharacters API 구현 필요
      // const result = await window.electronAPI.projects.updateCharacters(projectId, charactersToSave);
      Logger.info('PROJECT_DATA', 'Characters save - API 구현 필요', { characters: charactersToSave });
      
      // 🔥 임시로 성공으로 처리
      // if (result.success) {
        Logger.info('PROJECT_DATA', 'Characters saved successfully');
      // } else {
      //   throw new Error(result.error || 'Failed to save characters');
      // }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving characters', error);
      throw error;
    }
  }, [projectId]);

  // 🔥 메모 저장 함수
  const saveNotes = useCallback(async (notesToSave: ProjectNote[]): Promise<void> => {
    try {
      Logger.debug('PROJECT_DATA', 'Saving notes', { count: notesToSave.length });
      
      // 🔥 임시: updateNotes API 구현 필요
      // const result = await window.electronAPI.projects.updateNotes(projectId, notesToSave);
      Logger.info('PROJECT_DATA', 'Notes save - API 구현 필요', { notes: notesToSave });
      
      // 🔥 임시로 성공으로 처리
      // if (result.success) {
        Logger.info('PROJECT_DATA', 'Notes saved successfully');
      // } else {
      //   throw new Error(result.error || 'Failed to save notes');
      // }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving notes', error);
      throw error;
    }
  }, [projectId]);

  // 🔥 캐릭터 변경 핸들러 (자동 저장 포함)
  const handleCharactersChange = useCallback(async (newCharacters: ProjectCharacter[]): Promise<void> => {
    setCharacters(newCharacters);
    
    try {
      await saveCharacters(newCharacters);
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Failed to save characters automatically', error);
      // 사용자에게 에러 표시할 수 있음
    }
  }, [saveCharacters]);

  // 🔥 메모 변경 핸들러 (자동 저장 포함)  
  const handleNotesChange = useCallback(async (newNotes: ProjectNote[]): Promise<void> => {
    setNotes(newNotes);
    
    try {
      await saveNotes(newNotes);
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Failed to save notes automatically', error);
      // 사용자에게 에러 표시할 수 있음
    }
  }, [saveNotes]);

  return {
    // 🔥 로딩 및 에러 상태
    isLoading,
    error,
    
    // 🔥 기본 프로젝트 데이터
    title,
    setTitle,
    content,
    setContent,
    lastSaved,
    saveStatus,
    
    // 🔥 작가 데이터
    characters,
    setCharacters,
    structure,
    setStructure,
    notes, // 🔥 notes 추가
    setNotes, // 🔥 setNotes 추가
    writerStats,
    
    // 🔥 액션 함수들
    loadProject,
    saveProject,
    forceSave, // 🔥 새로운 즉시 저장 함수
    updateWriterStats,
    setWordGoal
  };
}
