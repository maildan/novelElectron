'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Menu,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Edit3,
  Settings,
  Save,
  Share2,
  Download,
  Sun,
  Moon,
  Maximize,
  Minimize,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Sidebar,
  Eye,
  EyeOff
} from 'lucide-react';

import { MarkdownEditor } from './editor/MarkdownEditor';
import { EditorProvider } from './editor/EditorProvider';
import { useProjectData } from './hooks/useProjectData';
import { useUIState } from './hooks/useUIState';
import { useProjectActions } from './hooks/useProjectActions';
import { Logger } from '../../../shared/logger';

// 🔥 작가 중심 에디터 스타일 (Notion + Linear 영감)
const WRITER_EDITOR_STYLES = {
  // 전체 레이아웃
  container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',
  
  // 헤더
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex-1 max-w-md mx-auto',
  headerRight: 'flex items-center gap-2',
  
  // 메인 레이아웃
  main: 'flex flex-1 overflow-hidden',
  
  // 사이드바
  sidebar: 'w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
  sidebarCollapsed: 'w-0 overflow-hidden',
  sidebarHeader: 'p-4 border-b border-gray-200 dark:border-gray-700',
  sidebarContent: 'flex-1 overflow-y-auto',
  
  // 에디터 영역
  editorArea: 'flex-1 flex flex-col',
  editorContainer: 'flex-1 overflow-hidden',
  
  // 버튼들
  iconButton: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors',
  primaryButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
  
  // 타이틀
  titleInput: 'w-full px-3 py-2 text-lg font-medium bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
  
  // 사이드바 메뉴
  menuItem: 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer',
  menuItemActive: 'flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  menuItemIcon: 'w-5 h-5',
  menuItemText: 'text-sm font-medium',
} as const;

export interface ProjectEditorProps {
  projectId: string;
}

export function ProjectEditor({ projectId }: ProjectEditorProps): React.ReactElement {
  // 🔥 커스텀 hooks 사용
  const projectData = useProjectData(projectId);
  const uiState = useUIState();
  const projectActions = useProjectActions({
    projectId,
    saveProject: projectData.saveProject,
    title: projectData.title,
    content: projectData.content
  });

  // 🔥 로컬 상태
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'write' | 'structure' | 'characters' | 'notes'>('write');

  // 🔥 키보드 단축키 구현 (작가 전용)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl 조합 단축키
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            projectData.forceSave();
            break;
          case '1':
            e.preventDefault();
            setCurrentView('write');
            break;
          case '2':
            e.preventDefault();
            setCurrentView('structure');
            break;
          case '3':
            e.preventDefault();
            setCurrentView('characters');
            break;
          case '4':
            e.preventDefault();
            setCurrentView('notes');
            break;
          case 'b':
            e.preventDefault();
            setCollapsed(!collapsed);
            break;
          case 'd':
            e.preventDefault();
            uiState.toggleDarkMode();
            break;
          case 'f':
            e.preventDefault();
            uiState.toggleFocusMode();
            break;
        }
      }
      
      // Escape 키
      if (e.key === 'Escape') {
        if (uiState.isFocusMode) {
          uiState.toggleFocusMode();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, projectData, uiState]);

  // 🔥 사이드바 메뉴 아이템 (작가 특화 - Linear 패턴 적용)
  const menuItems = [
    { 
      key: 'write', 
      icon: Edit3, 
      label: '글쓰기', 
      color: 'text-blue-600',
      description: '메인 에디터에서 글 작성'
    },
    { 
      key: 'structure', 
      icon: BookOpen, 
      label: '구조', 
      color: 'text-green-600',
      description: '챕터와 장면 관리'
    },
    { 
      key: 'characters', 
      icon: Users, 
      label: '인물', 
      color: 'text-purple-600',
      description: '등장인물 설정 관리'
    },
    { 
      key: 'notes', 
      icon: FileText, 
      label: '메모', 
      color: 'text-orange-600',
      description: '작업 메모 및 아이디어'
    },
  ];

  // 🔥 헤더 액션 버튼들 (키보드 단축키 포함)
  const headerActions = [
    { icon: Save, label: '저장 (⌘S)', onClick: projectData.saveProject },
    { icon: Share2, label: '공유', onClick: projectActions.handleShare },
    { icon: Download, label: '다운로드', onClick: projectActions.handleDownload },
    { icon: uiState.isDarkMode ? Sun : Moon, label: '테마 전환 (⌘D)', onClick: uiState.toggleDarkMode },
  ];

  // 🔥 이벤트 핸들러
  const handleMenuClick = useCallback((key: string) => {
    setCurrentView(key as any);
    Logger.info('PROJECT_EDITOR', `Menu clicked: ${key}`);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    projectData.setTitle(e.target.value);
  }, [projectData]);

  // 🔥 사이드바 렌더링
  const renderSidebarContent = () => {
    if (collapsed) return null;

    return (
      <div className={WRITER_EDITOR_STYLES.sidebar}>
        {/* 사이드바 헤더 */}
        <div className={WRITER_EDITOR_STYLES.sidebarHeader}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            프로젝트
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {projectData.title || '제목 없음'}
          </p>
        </div>

        {/* 사이드바 메뉴 */}
        <div className={WRITER_EDITOR_STYLES.sidebarContent}>
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              
              return (
                <div
                  key={item.key}
                  className={isActive ? WRITER_EDITOR_STYLES.menuItemActive : WRITER_EDITOR_STYLES.menuItem}
                  onClick={() => handleMenuClick(item.key)}
                  title={item.description}
                >
                  <Icon className={WRITER_EDITOR_STYLES.menuItemIcon} />
                  <span className={WRITER_EDITOR_STYLES.menuItemText}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 구조 섹션 - 프로젝트 전용 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              프로젝트 구조
            </h3>
            <div className="space-y-1 text-sm ml-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>1장: 시작</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>2장: 전개</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>3장: 절정</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 py-1 px-2 rounded text-xs">
                <span>+ 새 챕터 추가</span>
              </div>
            </div>
          </div>

          {/* 통계 섹션 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              글쓰기 통계
            </h3>
            <div className="space-y-3">
              {/* 오늘 진행률 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">오늘 진행률</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">{projectData.writerStats.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${projectData.writerStats.progress}%`}}
                  ></div>
                </div>
              </div>

              {/* 기본 통계 */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {projectData.writerStats.wordCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">단어</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {projectData.writerStats.charCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">문자</div>
                </div>
              </div>

              {/* 세션 정보 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>읽기 시간</span>
                  <span>{projectData.writerStats.readingTime}분</span>
                </div>
                <div className="flex justify-between">
                  <span>세션 시간</span>
                  <span>{Math.floor(projectData.writerStats.sessionTime / 60)}분</span>
                </div>
                <div className="flex justify-between">
                  <span>WPM</span>
                  <span>{projectData.writerStats.wpm}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 작업 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              빠른 작업
            </h3>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                📝 새 메모 추가
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                👤 새 인물 추가
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                🎯 목표 설정
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                📊 진행률 리포트
              </button>
            </div>
          </div>

          {/* 키보드 단축키 가이드 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              ⌨️ 단축키
            </h3>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>저장</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘S</span>
              </div>
              <div className="flex justify-between">
                <span>집중 모드</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘F</span>
              </div>
              <div className="flex justify-between">
                <span>사이드바</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘B</span>
              </div>
              <div className="flex justify-between">
                <span>다크모드</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘D</span>
              </div>
              <div className="flex justify-between">
                <span>글쓰기</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘1</span>
              </div>
              <div className="flex justify-between">
                <span>구조</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">⌘2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 메인 콘텐츠 렌더링 (작가 도구별 특화)
  const renderMainContent = () => {
    switch (currentView) {
      case 'write':
        return (
          <div className={WRITER_EDITOR_STYLES.editorContainer}>
            <MarkdownEditor
              content={projectData.content}
              onChange={projectData.setContent}
              isFocusMode={uiState.isFocusMode}
            />
          </div>
        );
      
      case 'structure':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                프로젝트 구조
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                작품의 전체적인 구조를 한눈에 보고 관리하세요.
              </p>
            </div>

            {/* 챕터 관리 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                챕터 구조
              </h2>
              
              <div className="space-y-4">
                {[
                  { id: 1, title: '시작', scenes: 3, words: 2500, status: 'completed' },
                  { id: 2, title: '전개', scenes: 5, words: 4200, status: 'in-progress' },
                  { id: 3, title: '절정', scenes: 2, words: 1800, status: 'planned' },
                ].map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      chapter.status === 'completed' ? 'bg-green-500' :
                      chapter.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {chapter.id}장: {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {chapter.scenes}개 장면 • {chapter.words.toLocaleString()}단어
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Menu className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  + 새 챕터 추가
                </button>
              </div>
            </div>

            {/* 장면 템플릿 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                장면 템플릿
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: '액션 장면', description: '긴장감 넘치는 액션 시퀀스', color: 'red' },
                  { name: '대화 중심', description: '인물간 대화로 진행', color: 'blue' },
                  { name: '회상 장면', description: '과거 회상을 통한 배경 설명', color: 'purple' },
                  { name: '감정 묘사', description: '인물의 내면 심리 표현', color: 'green' },
                ].map((template) => (
                  <div key={template.name} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                    <div className={`w-3 h-3 rounded-full bg-${template.color}-500 mb-2`}></div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'characters':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                등장인물 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                작품의 등장인물들을 체계적으로 관리하고 추적하세요.
              </p>
            </div>

            {/* 주요 인물 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                주요 인물
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: '김주인공', role: '주인공', age: '25세', description: '정의감이 강한 탐정' },
                  { name: '박조연', role: '조연', age: '30세', description: '주인공의 파트너' },
                  { name: '이악역', role: '적역', age: '40세', description: '범죄 조직의 보스' },
                ].map((character) => (
                  <div key={character.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{character.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{character.role} • {character.age}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{character.description}</p>
                    <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                      자세히 보기 →
                    </button>
                  </div>
                ))}
                
                <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center">
                  + 새 인물 추가
                </button>
              </div>
            </div>

            {/* 인물 관계도 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                인물 관계도
              </h2>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>인물 관계도 기능은 곧 출시됩니다</p>
                <p className="text-sm mt-2">인물간의 관계를 시각적으로 표현해드릴게요</p>
              </div>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                작업 메모
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                아이디어, 연구 자료, 작업 노트를 한곳에서 관리하세요.
              </p>
            </div>

            {/* 메모 카테고리 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  title: '아이디어', 
                  count: 12, 
                  color: 'yellow', 
                  icon: '💡',
                  recent: '새로운 플롯 아이디어'
                },
                { 
                  title: '연구 자료', 
                  count: 8, 
                  color: 'blue', 
                  icon: '📚',
                  recent: '19세기 런던 배경'
                },
                { 
                  title: '작업 노트', 
                  count: 15, 
                  color: 'green', 
                  icon: '📝',
                  recent: '2장 수정 사항'
                },
              ].map((category) => (
                <div key={category.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{category.count}개 메모</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    최근: {category.recent}
                  </div>
                  
                  <button className={`w-full p-2 rounded text-sm font-medium transition-colors
                    ${category.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      category.color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'}`}>
                    메모 보기
                  </button>
                </div>
              ))}
            </div>

            {/* 빠른 메모 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-600" />
                빠른 메모
              </h2>
              
              <div className="space-y-4">
                <textarea
                  placeholder="아이디어나 메모를 빠르게 작성하세요..."
                  className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    메모 저장
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    카테고리 선택
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <EditorProvider>
      <div className={WRITER_EDITOR_STYLES.container}>
        {/* 헤더 */}
        <header className={WRITER_EDITOR_STYLES.header}>
          {/* 헤더 왼쪽 */}
          <div className={WRITER_EDITOR_STYLES.headerLeft}>
            <button
              className={WRITER_EDITOR_STYLES.iconButton}
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? '사이드바 열기' : '사이드바 닫기'}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            
            <button
              className={WRITER_EDITOR_STYLES.iconButton}
              onClick={projectActions.handleBack}
              title="프로젝트 목록으로"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* 헤더 중앙 - 제목 */}
          <div className={WRITER_EDITOR_STYLES.headerCenter}>
            <input
              type="text"
              value={projectData.title}
              onChange={handleTitleChange}
              placeholder="프로젝트 제목을 입력하세요"
              className={WRITER_EDITOR_STYLES.titleInput}
            />
          </div>

          {/* 헤더 오른쪽 */}
          <div className={WRITER_EDITOR_STYLES.headerRight}>
            {headerActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={WRITER_EDITOR_STYLES.iconButton}
                  onClick={action.onClick}
                  title={action.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            
            <button
              className={WRITER_EDITOR_STYLES.iconButton}
              onClick={uiState.toggleFocusMode}
              title={uiState.isFocusMode ? '일반 모드' : '집중 모드'}
            >
              {uiState.isFocusMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* 메인 영역 */}
        <main className={WRITER_EDITOR_STYLES.main}>
          {/* 사이드바 */}
          {renderSidebarContent()}

          {/* 에디터 영역 */}
          <div className={WRITER_EDITOR_STYLES.editorArea}>
            {renderMainContent()}
          </div>
        </main>
      </div>
    </EditorProvider>
  );
}

export default ProjectEditor;
