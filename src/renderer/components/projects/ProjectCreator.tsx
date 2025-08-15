'use client';

// 프로젝트 생성

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';
import { 
  FileText, 
  Globe, 
  Upload, 
  X, 
  Plus,
  ExternalLink,
  BookOpen,
  Newspaper,
  Coffee,
  Code,
  Lightbulb,
  Target
} from 'lucide-react';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const PROJECT_CREATOR_STYLES = {
  overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal: 'bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-900/50 w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700',
  header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100',
  closeButton: 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-white dark:bg-slate-900',
  
  // 플랫폼 선택
  platformSection: 'mb-8',
  sectionTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4',
  platformGrid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  platformCard: 'p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20',
  platformCardSelected: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20',
  platformCardDefault: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
  platformIcon: 'w-8 h-8 text-blue-600 dark:text-blue-400 mb-2',
  platformTitle: 'font-semibold text-slate-900 dark:text-slate-100 mb-1',
  platformDescription: 'text-sm text-slate-600 dark:text-slate-400',
  
  // 프로젝트 정보
  formSection: 'mb-6',
  label: 'block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2',
  inputGroup: 'mb-4',
  genreGrid: 'grid grid-cols-2 md:grid-cols-4 gap-2 mt-2',
  genreButton: 'p-2 text-sm border rounded-lg transition-colors',
  genreSelected: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
  genreDefault: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',
  
  // 버튼
  footer: 'flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  secondaryButton: 'px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  primaryButton: 'px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

// 🔥 플랫폼 옵션 타입 정의
interface PlatformOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly recommended?: boolean;
  readonly external?: boolean;
  readonly action?: string;
}

// 🔥 플랫폼 옵션
const PLATFORM_OPTIONS: readonly PlatformOption[] = [
  {
    id: 'loop',
    name: 'Loop Editor',
    description: '통합 타이핑 분석과 함께하는 전용 에디터',
    icon: BookOpen,
    recommended: true,
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: '실시간 협업과 클라우드 동기화',
    icon: Globe,
    external: true,
  },
  {
    id: 'import',
    name: '파일 불러오기',
    description: 'Word, 텍스트 파일에서 프로젝트 생성',
    icon: Upload,
    action: 'import',
  },
] as const;

// 🔥 장르 옵션
const GENRE_OPTIONS = [
  { id: 'novel', name: '소설', icon: BookOpen },
  { id: 'essay', name: '에세이', icon: Coffee },
  { id: 'blog', name: '블로그', icon: Newspaper },
  { id: 'tech', name: '기술', icon: Code },
  { id: 'diary', name: '일기', icon: FileText },
  { id: 'poem', name: '시', icon: Lightbulb },
  { id: 'script', name: '대본', icon: FileText },
  { id: 'other', name: '기타', icon: Plus },
] as const;

export interface ProjectCreatorProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreate: (projectData: ProjectCreationData) => void | Promise<void>;
}

export interface ProjectCreationData {
  readonly title: string;
  readonly description: string;
  readonly genre: string;
  readonly platform: string;
  readonly content?: string;
  readonly targetWords?: number; // 🔥 목표 단어 수 추가
  readonly deadline?: Date; // 🔥 완료 목표 날짜 추가
}

export function ProjectCreator({ isOpen, onClose, onCreate }: ProjectCreatorProps): React.ReactElement | null {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('loop');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('novel');
  const [targetWords, setTargetWords] = useState<number>(10000); // 🔥 목표 단어 수
  const [deadline, setDeadline] = useState<string>(''); // 🔥 완료 목표 날짜
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // 🔥 OAuth 성공 이벤트 리스너 설정
  useEffect(() => {
    const handleOAuthSuccess = () => {
      Logger.info('PROJECT_CREATOR', '🔥 OAuth 성공 이벤트 수신 - Google Docs 목록 새로고침');
      // Google Docs 목록 새로고침
      if (selectedPlatform === 'google-docs') {
        showGoogleDocsList();
      }
    };

    if (typeof window !== 'undefined' && window.electronAPI) {
      // OAuth 성공 이벤트 리스너 등록
      window.electronAPI.on('oauth-success', handleOAuthSuccess);
      
      return () => {
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        window.electronAPI?.removeListener('oauth-success', handleOAuthSuccess);
      };
    }
  }, [selectedPlatform]);

  if (!isOpen) return null;

  // 🔥 Google Docs 연동 처리
  const handleGoogleDocsIntegration = async () => {
    try {
      Logger.info('PROJECT_CREATOR', 'Google Docs 연동 시작');
      
      if (!window.electronAPI) {
        alert('데스크톱 앱에서만 사용 가능합니다');
        return;
      }

      // 먼저 OAuth 브라우저 인증 시도 (기본 브라우저 자동 오픈)
      try {
        const res = await window.electronAPI?.oauth?.startGoogleAuth();
        Logger.info('PROJECT_CREATOR', 'OAuth browser flow triggered', res);
      } catch (e) {
        Logger.warn('PROJECT_CREATOR', 'OAuth browser flow could not be triggered', e);
      }

      // 연결 상태 확인
      const connectionResult = await window.electronAPI?.oauth?.getAuthStatus();
      
      if (connectionResult && connectionResult.data && connectionResult.data.isAuthenticated) {
        // 이미 연결된 경우 문서 목록 표시
        await showGoogleDocsList();
      } else {
        // 인증이 필요한 경우 브라우저에서 로그인 안내
        alert('브라우저에서 Google 계정으로 로그인해주세요. 로그인 완료 후 다시 시도해주세요.');
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Google Docs 연동 실패:', error);
      alert(`Google Docs 연동 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 Google Docs 목록 표시
  const showGoogleDocsList = async () => {
    try {
      const docsResult = await window.electronAPI?.oauth?.getGoogleDocuments();
      
      if (docsResult && docsResult.success && docsResult.data) {
        const docs = docsResult.data;
        
        if (docs.length === 0) {
          alert('Google Docs에서 문서를 찾을 수 없습니다.');
          return;
        }

        // 간단한 선택 다이얼로그 (추후 더 예쁜 UI로 교체 가능)
        const docTitles = docs.map((doc: any, index: number) => `${index + 1}. ${doc.title}`).join('\n');
        const selection = prompt(`가져올 Google Docs를 선택하세요:\n\n${docTitles}\n\n번호를 입력하세요:`);
        
        if (selection) {
          const selectedIndex = parseInt(selection) - 1;
          
          if (selectedIndex >= 0 && selectedIndex < docs.length) {
            const selectedDoc = docs[selectedIndex];
            
            if (selectedDoc) {
              // 선택한 문서로 프로젝트 생성
              setTitle(selectedDoc.title);
              setDescription(`Google Docs에서 가져온 문서: ${selectedDoc.title}`);
              setSelectedPlatform('google-docs');
              
              Logger.info('PROJECT_CREATOR', 'Google Docs 선택됨:', selectedDoc);
              alert(`"${selectedDoc.title}" 문서가 선택되었습니다. 프로젝트를 생성하세요.`);
            }
          } else {
            alert('올바른 번호를 입력해주세요.');
          }
        }
      } else {
        throw new Error(docsResult?.error || '문서 목록을 가져올 수 없습니다');
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Google Docs 목록 조회 실패:', error);
      alert(`문서 목록 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handleCreate = async (): Promise<void> => {
    if (!title.trim()) {
      Logger.warn('PROJECT_CREATOR', 'Project title is required');
      return;
    }

    setIsCreating(true);
    try {
      const projectData: ProjectCreationData = {
        title: title.trim(),
        description: description.trim() || '새로운 프로젝트입니다.',
        genre: selectedGenre,
        platform: selectedPlatform,
        content: selectedPlatform === 'loop' ? getDefaultContent(selectedGenre) : undefined,
        targetWords: targetWords, // 🔥 목표 단어 수 포함
        deadline: deadline ? new Date(deadline) : undefined, // 🔥 목표 날짜 포함
      };

      Logger.info('PROJECT_CREATOR', 'Creating new project', { 
        title: projectData.title, 
        platform: projectData.platform,
        genre: projectData.genre 
      });

      await onCreate(projectData);
      
      // 성공 시 폼 리셋
      setTitle('');
      setDescription('');
      setSelectedGenre('novel');
      setSelectedPlatform('loop');
      setTargetWords(10000);
      setDeadline('');
      onClose();
      
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Failed to create project', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlatformSelect = async (platformId: string): Promise<void> => {
    setSelectedPlatform(platformId);
    Logger.debug('PROJECT_CREATOR', `Platform selected: ${platformId}`);
    
    // 🔥 Google Docs 선택 시 연동 처리 시작
    if (platformId === 'google-docs') {
      await handleGoogleDocsIntegration();
    }
  };

  const handleGenreSelect = (genreId: string): void => {
    setSelectedGenre(genreId);
    Logger.debug('PROJECT_CREATOR', `Genre selected: ${genreId}`);
  };

  const getDefaultContent = (genre: string): string => {
    const templates: Record<string, string> = {
      novel: `제1장: 새로운 시작\n\n여기서부터 당신의 이야기가 시작됩니다.\n\n✍️ 작성 팁:\n- 등장인물을 구체적으로 묘사해보세요\n- 독자가 몰입할 수 있는 장면을 그려보세요\n- 하루에 500단어씩 꾸준히 작성해보세요`,
      essay: `# 제목을 여기에 입력하세요\n\n오늘의 생각을 자유롭게 써보세요.\n\n일상의 작은 순간들이 때로는 가장 의미 있는 글이 됩니다.`,
      blog: `# 블로그 포스트 제목\n\n## 소개\n\n독자들과 공유하고 싶은 이야기를 써보세요.\n\n## 본문\n\n경험, 배움, 생각을 자유롭게 표현해보세요.`,
      tech: `# 기술 문서 제목\n\n## 개요\n\n## 문제 정의\n\n## 해결 방법\n\n## 결론\n\n코드와 설명을 함께 작성해보세요.`,
      diary: `${new Date().toLocaleDateString('ko-KR')} 일기\n\n오늘 있었던 일들을 기록해보세요.\n\n소중한 순간들을 글로 남겨보세요.`,
      other: `새로운 프로젝트가 시작되었습니다.\n\n자유롭게 내용을 작성해보세요.`,
    };

    // genre가 undefined일 경우 대비하여 기본값 제공
    const defaultTemplate = `새로운 프로젝트가 시작되었습니다.\n\n자유롭게 내용을 작성해보세요.`;
    
    if (!genre) {
      return defaultTemplate;
    }
    
    return templates[genre] ?? templates.other ?? defaultTemplate;
  };

  return (
    <div className={PROJECT_CREATOR_STYLES.overlay} onClick={onClose}>
      <div className={PROJECT_CREATOR_STYLES.modal} onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={PROJECT_CREATOR_STYLES.header}>
          <h2 className={PROJECT_CREATOR_STYLES.title}>새 프로젝트 만들기</h2>
          <button 
            onClick={onClose}
            className={PROJECT_CREATOR_STYLES.closeButton}
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className={PROJECT_CREATOR_STYLES.content}>
          {/* 플랫폼 선택 */}
          <div className={PROJECT_CREATOR_STYLES.platformSection}>
            <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>작성 플랫폼 선택</h3>
            <div className={PROJECT_CREATOR_STYLES.platformGrid}>
              {PLATFORM_OPTIONS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.id}
                    className={`${PROJECT_CREATOR_STYLES.platformCard} ${
                      selectedPlatform === platform.id 
                        ? PROJECT_CREATOR_STYLES.platformCardSelected
                        : PROJECT_CREATOR_STYLES.platformCardDefault
                    }`}
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <Icon className={PROJECT_CREATOR_STYLES.platformIcon} />
                    <div className={PROJECT_CREATOR_STYLES.platformTitle}>
                      {platform.name}
                      {platform.recommended && (
                        <Badge className="ml-2 text-xs bg-blue-100 text-blue-700">추천</Badge>
                      )}
                      {platform.external && (
                        <ExternalLink className="inline w-4 h-4 ml-1" />
                      )}
                    </div>
                    <p className={PROJECT_CREATOR_STYLES.platformDescription}>
                      {platform.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 프로젝트 정보 */}
          <div className={PROJECT_CREATOR_STYLES.formSection}>
            <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>프로젝트 정보</h3>
            
            <div className={PROJECT_CREATOR_STYLES.inputGroup}>
              <label className={PROJECT_CREATOR_STYLES.label} htmlFor="project-title">
                프로젝트 제목 *
              </label>
              <Input
                id="project-title"
                type="text"
                placeholder="예: 나의 첫 번째 소설"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className={PROJECT_CREATOR_STYLES.inputGroup}>
              <label className={PROJECT_CREATOR_STYLES.label} htmlFor="project-description">
                프로젝트 설명
              </label>
              <Textarea
                id="project-description"
                placeholder="프로젝트에 대한 간단한 설명을 입력하세요..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            <div className={PROJECT_CREATOR_STYLES.inputGroup}>
              <label className={PROJECT_CREATOR_STYLES.label}>장르</label>
              <div className={PROJECT_CREATOR_STYLES.genreGrid}>
                {GENRE_OPTIONS.map((genre) => {
                  const Icon = genre.icon;
                  return (
                    <button
                      key={genre.id}
                      className={`${PROJECT_CREATOR_STYLES.genreButton} ${
                        selectedGenre === genre.id 
                          ? PROJECT_CREATOR_STYLES.genreSelected
                          : PROJECT_CREATOR_STYLES.genreDefault
                      }`}
                      onClick={() => handleGenreSelect(genre.id)}
                    >
                      <Icon className="w-4 h-4 inline mr-1" />
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🔥 목표 설정 섹션 */}
          <div className={PROJECT_CREATOR_STYLES.formSection}>
            <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>작성 목표 설정</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label} htmlFor="target-words">
                  목표 단어 수
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="target-words"
                    type="number"
                    placeholder="10000"
                    value={targetWords}
                    onChange={(e) => setTargetWords(Number(e.target.value) || 0)}
                    min="100"
                    max="1000000"
                    step="100"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">단어</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  권장: 소설 50,000+ / 에세이 5,000+ / 블로그 1,000+
                </div>
              </div>

              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label} htmlFor="deadline">
                  완료 목표 날짜 (선택사항)
                </label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  목표 날짜를 설정하면 일일 권장 작성량을 계산해드립니다
                </div>
              </div>
            </div>

            {/* 🔥 목표 미리보기 */}
            {targetWords > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">목표 미리보기</span>
                </div>
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  총 목표: {targetWords.toLocaleString()}단어
                  {deadline && (() => {
                    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const dailyWords = Math.ceil(targetWords / days);
                    return days > 0 ? (
                      <span className="block mt-1">
                        일일 권장: {dailyWords.toLocaleString()}단어 (약 {Math.ceil(dailyWords / 200)}분 소요)
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className={PROJECT_CREATOR_STYLES.footer}>
          <button 
            onClick={onClose}
            className={PROJECT_CREATOR_STYLES.secondaryButton}
          >
            취소
          </button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
            className={PROJECT_CREATOR_STYLES.primaryButton}
          >
            {isCreating ? '생성 중...' : '프로젝트 만들기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreator;
