'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';
import { 
  ArrowLeft,
  Save,
  Share2,
  MoreHorizontal,
  Download,
  Star,
  Clock,
  User,
  BarChart3,
  Settings,
  FileText,
  Zap,
  Target
} from 'lucide-react';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - Google Docs 스타일
const PROJECT_EDITOR_STYLES = {
  // 전체 레이아웃
  container: 'min-h-screen bg-white flex flex-col',
  
  // 헤더 (Google Docs 스타일)
  header: 'sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm',
  headerContent: 'max-w-6xl mx-auto px-4 py-3',
  headerTop: 'flex items-center justify-between mb-2',
  headerBottom: 'flex items-center justify-between',
  
  // 제목 영역
  titleSection: 'flex items-center space-x-4',
  backButton: 'p-2 hover:bg-slate-100 rounded-lg transition-colors',
  titleInput: 'text-2xl font-bold border-none outline-none bg-transparent resize-none min-w-0 flex-1',
  
  // 상태 표시
  statusSection: 'flex items-center space-x-3',
  statusBadge: 'px-3 py-1 text-sm font-medium rounded-full',
  lastSaved: 'text-sm text-slate-500',
  
  // 툴바
  toolbar: 'flex items-center space-x-2',
  toolbarGroup: 'flex items-center space-x-1 px-2 py-1 border border-slate-200 rounded-lg',
  toolButton: 'p-2 hover:bg-slate-100 rounded transition-colors text-slate-600',
  
  // 메인 컨텐츠
  main: 'flex-1 bg-slate-50',
  editorContainer: 'max-w-4xl mx-auto py-8 px-4',
  
  // 에디터 (Google Docs 페이지 스타일)
  editorWrapper: 'bg-white shadow-lg rounded-lg min-h-[800px] p-8 md:p-12',
  editor: 'w-full min-h-[700px] border-none outline-none resize-none text-base leading-relaxed font-normal text-slate-900',
  
  // 사이드바 (통계)
  sidebar: 'fixed right-4 top-1/2 -translate-y-1/2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-4 hidden xl:block',
  sidebarTitle: 'text-lg font-semibold text-slate-900 mb-4',
  statCard: 'bg-slate-50 rounded-lg p-3 mb-3',
  statValue: 'text-2xl font-bold text-slate-900',
  statLabel: 'text-sm text-slate-600 mt-1',
  
  // 플로팅 액션 (모바일)
  floatingActions: 'fixed bottom-6 right-6 flex flex-col space-y-3 xl:hidden',
  floatingButton: 'w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center',
} as const;

export interface ProjectEditorProps {
  readonly projectId: string;
}

interface ProjectStats {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly paragraphCount: number;
  readonly readingTime: number;
  readonly wpm: number;
  readonly sessionTime: number;
}

export function ProjectEditor({ projectId }: ProjectEditorProps): React.ReactElement {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 상태 관리
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [stats, setStats] = useState<ProjectStats>({
    wordCount: 0,
    characterCount: 0,
    paragraphCount: 0,
    readingTime: 0,
    wpm: 0,
    sessionTime: 0,
  });

  // 🔥 프로젝트 로드
  useEffect(() => {
    loadProject();
  }, [projectId]);

  // 🔥 실시간 통계 업데이트
  useEffect(() => {
    updateStats();
  }, [content]);

  // 🔥 자동 저장
  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }

    autoSaveRef.current = setTimeout(() => {
      if (title.trim() || content.trim()) {
        saveProject();
      }
    }, 2000); // 2초 후 자동 저장

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [title, content]);

  const loadProject = async (): Promise<void> => {
    try {
      Logger.debug('PROJECT_EDITOR', 'Loading project', { projectId });
      
      const result = await window.electronAPI.projects.getById(projectId);
      if (result.success && result.data) {
        setTitle(result.data.title);
        setContent(result.data.content || '');
        Logger.info('PROJECT_EDITOR', '✅ Project loaded successfully');
      }
    } catch (error) {
      Logger.error('PROJECT_EDITOR', '❌ Failed to load project', error);
    }
  };

  const saveProject = async (): Promise<void> => {
    try {
      setIsSaving(true);
      Logger.debug('PROJECT_EDITOR', 'Saving project', { projectId });
      
      const result = await window.electronAPI.projects.update(projectId, {
        title: title.trim(),
        content: content,
        wordCount: stats.wordCount,
        lastModified: new Date(),
      });

      if (result.success) {
        setLastSaved(new Date());
        Logger.info('PROJECT_EDITOR', '✅ Project saved successfully');
      }
    } catch (error) {
      Logger.error('PROJECT_EDITOR', '❌ Failed to save project', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStats = (): void => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    const paragraphs = content.trim() ? content.trim().split(/\n\s*\n/).length : 0;
    const readingTime = Math.ceil(words / 200); // 분당 200단어 기준

    setStats(prev => ({
      ...prev,
      wordCount: words,
      characterCount: characters,
      paragraphCount: paragraphs,
      readingTime,
    }));
  };

  const handleBack = (): void => {
    Logger.info('PROJECT_EDITOR', 'Navigating back to projects');
    router.push('/projects');
  };

  const handleShare = (): void => {
    Logger.info('PROJECT_EDITOR', 'Share project requested');
    // TODO: 공유 기능 구현
    alert('공유 기능을 구현 중입니다.');
  };

  const handleDownload = (): void => {
    Logger.info('PROJECT_EDITOR', 'Download project requested');
    // TODO: 다운로드 기능 구현
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '프로젝트'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={PROJECT_EDITOR_STYLES.container}>
      {/* 🔥 Google Docs 스타일 헤더 */}
      <header className={PROJECT_EDITOR_STYLES.header}>
        <div className={PROJECT_EDITOR_STYLES.headerContent}>
          {/* 상단 행 */}
          <div className={PROJECT_EDITOR_STYLES.headerTop}>
            <div className={PROJECT_EDITOR_STYLES.titleSection}>
              <button 
                onClick={handleBack}
                className={PROJECT_EDITOR_STYLES.backButton}
                aria-label="프로젝트 목록으로 돌아가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목 없는 문서"
                className={PROJECT_EDITOR_STYLES.titleInput}
              />
            </div>

            <div className={PROJECT_EDITOR_STYLES.statusSection}>
              <Badge 
                className={`${PROJECT_EDITOR_STYLES.statusBadge} bg-green-100 text-green-700`}
              >
                <Zap className="w-3 h-3 mr-1" />
                활성
              </Badge>
              
              {lastSaved && (
                <span className={PROJECT_EDITOR_STYLES.lastSaved}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {lastSaved.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} 저장됨
                </span>
              )}
            </div>
          </div>

          {/* 하단 행 - 툴바 */}
          <div className={PROJECT_EDITOR_STYLES.headerBottom}>
            <div className={PROJECT_EDITOR_STYLES.toolbar}>
              <div className={PROJECT_EDITOR_STYLES.toolbarGroup}>
                <button 
                  onClick={saveProject}
                  disabled={isSaving}
                  className={PROJECT_EDITOR_STYLES.toolButton}
                  title="저장"
                >
                  <Save className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleShare}
                  className={PROJECT_EDITOR_STYLES.toolButton}
                  title="공유"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleDownload}
                  className={PROJECT_EDITOR_STYLES.toolButton}
                  title="다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              <div className={PROJECT_EDITOR_STYLES.toolbarGroup}>
                <span className="text-sm text-slate-600 px-2">
                  {stats.wordCount.toLocaleString()}단어
                </span>
              </div>
            </div>

            <button className={PROJECT_EDITOR_STYLES.toolButton}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 🔥 메인 에디터 영역 */}
      <main className={PROJECT_EDITOR_STYLES.main}>
        <div className={PROJECT_EDITOR_STYLES.editorContainer}>
          <div className={PROJECT_EDITOR_STYLES.editorWrapper}>
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="여기서부터 작성을 시작하세요..."
              className={PROJECT_EDITOR_STYLES.editor}
              autoFocus
            />
          </div>
        </div>
      </main>

      {/* 🔥 사이드바 통계 (데스크톱) */}
      <aside className={PROJECT_EDITOR_STYLES.sidebar}>
        <h3 className={PROJECT_EDITOR_STYLES.sidebarTitle}>
          <BarChart3 className="w-5 h-5 inline mr-2" />
          실시간 통계
        </h3>
        
        <div className={PROJECT_EDITOR_STYLES.statCard}>
          <div className={PROJECT_EDITOR_STYLES.statValue}>
            {stats.wordCount.toLocaleString()}
          </div>
          <div className={PROJECT_EDITOR_STYLES.statLabel}>단어</div>
        </div>
        
        <div className={PROJECT_EDITOR_STYLES.statCard}>
          <div className={PROJECT_EDITOR_STYLES.statValue}>
            {stats.characterCount.toLocaleString()}
          </div>
          <div className={PROJECT_EDITOR_STYLES.statLabel}>문자</div>
        </div>
        
        <div className={PROJECT_EDITOR_STYLES.statCard}>
          <div className={PROJECT_EDITOR_STYLES.statValue}>
            {stats.readingTime}분
          </div>
          <div className={PROJECT_EDITOR_STYLES.statLabel}>읽기 시간</div>
        </div>
        
        <div className={PROJECT_EDITOR_STYLES.statCard}>
          <div className={PROJECT_EDITOR_STYLES.statValue}>
            {stats.paragraphCount}
          </div>
          <div className={PROJECT_EDITOR_STYLES.statLabel}>문단</div>
        </div>
      </aside>

      {/* 🔥 플로팅 액션 버튼 (모바일) */}
      <div className={PROJECT_EDITOR_STYLES.floatingActions}>
        <button 
          onClick={saveProject}
          className={PROJECT_EDITOR_STYLES.floatingButton}
          title="저장"
        >
          <Save className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ProjectEditor;
