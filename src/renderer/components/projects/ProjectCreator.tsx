'use client';

import React, { useState } from 'react';
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
  Lightbulb
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
}

export function ProjectCreator({ isOpen, onClose, onCreate }: ProjectCreatorProps): React.ReactElement | null {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('loop');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('novel');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  if (!isOpen) return null;

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
    
    // 🔥 Google Docs 선택 시 OAuth 인증 시작
    if (platformId === 'google-docs') {
      try {
        Logger.info('PROJECT_CREATOR', 'Starting Google OAuth authentication');
        
        if (window.electronAPI?.oauth?.startGoogleAuth) {
          const result = await window.electronAPI.oauth.startGoogleAuth();
          if (result.success) {
            Logger.info('PROJECT_CREATOR', 'Google OAuth started successfully');
            // OAuth 완료 후 사용자에게 피드백 제공
            // TODO: OAuth 완료 상태 UI 업데이트
          } else {
            Logger.error('PROJECT_CREATOR', 'Google OAuth failed to start');
            alert('Google 인증을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
            setSelectedPlatform('loop'); // 기본값으로 복원
          }
        } else {
          Logger.error('PROJECT_CREATOR', 'Google OAuth API not available');
          alert('Google Docs 연동 기능이 준비되지 않았습니다.');
          setSelectedPlatform('loop'); // 기본값으로 복원
        }
      } catch (error) {
        Logger.error('PROJECT_CREATOR', 'Google OAuth error', error);
        alert('Google 인증 중 오류가 발생했습니다.');
        setSelectedPlatform('loop'); // 기본값으로 복원
      }
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
