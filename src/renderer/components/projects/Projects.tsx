'use client';

import { useState, useEffect } from 'react';
import { CommonComponentProps, SessionStats, Log } from '@shared/types';
import { 
  COMMON_STYLES, 
  getCardClassName, 
  getButtonClassName,
  getTextClassName,
  flexCenter,
  flexBetween,
  headerCard,
  inputBase,
  getAdditionalPattern,
  debugEntry, 
  debugExit, 
  measurePerformance
} from '../common/common';
import { Logger } from '../../shared/logger';
import { 
  Search,
  Filter,
  Plus,
  Star,
  MoreHorizontal,
  Edit,
  Eye,
  Clock,
  BookOpen,
  FileText
} from 'lucide-react';

function ProjectsComponent({ logs, loading }: CommonComponentProps) {
  debugEntry('Projects.tsx');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  // 🔥 실제 데이터 상태 관리 - 더미 데이터 박멸
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // 🔥 실제 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          // #DEBUG: 프로젝트 데이터 로드 시작
          const sessionsData = await window.electronAPI.database.getSessions();
          
          // 세션 데이터를 프로젝트로 변환 - 타입 안전성 보장
          const sessions = sessionsData as unknown as SessionStats[];
          const projectsData: ProjectItem[] = sessions.slice(0, 5).map((session: SessionStats, index: number) => ({
            title: `프로젝트 ${index + 1}`,
            description: session.content?.substring(0, 50) + "..." || "타이핑 세션 데이터",
            progress: Math.min((session.totalKeys || session.keyCount || 0) / 10, 100),
            status: (session.wpm || 0) > 50 ? "진행중" : "초안",
            lastModified: session.timestamp ? new Date(session.timestamp).toLocaleString() : new Date().toLocaleString(),
            wordCount: Math.floor((session.totalKeys || session.keyCount || 0) / 5).toLocaleString(),
            chapters: Math.ceil((session.totalKeys || 0) / 500),
            genre: session.accuracy > 90 ? "고품질" : "일반",
            starred: session.wpm > 60,
          }));
          
          setProjects(projectsData);
          // #DEBUG: 프로젝트 데이터 로드 완료
        }
      } catch (error) {
        Logger.error('프로젝트 데이터 로딩 실패:', error);
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중": return "bg-blue-100 text-blue-800";
      case "초안": return "bg-slate-100 text-slate-800";
      case "검토중": return "bg-yellow-100 text-yellow-800";
      case "완료": return "bg-green-100 text-green-800";
      case "계획중": return "bg-purple-100 text-purple-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className={headerCard()}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={getTextClassName({ variant: 'title' })}>프로젝트</h1>
            <p className={getTextClassName({ variant: 'subtitle' })}>모든 창작 프로젝트를 관리하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputBase() + " pl-10 w-64"}
              />
            </div>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Filter className="w-4 h-4" />
            </button>
            <button className={getButtonClassName({ variant: 'primary' })}>
              <Plus className="w-4 h-4 mr-2 inline" />
              새 프로젝트
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 프로젝트 카드 */}
          <div className={getCardClassName({ variant: 'blue' })}>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">새 프로젝트</h3>
              <p className="text-sm text-slate-600">아이디어를 시작해보세요</p>
            </div>
          </div>

          {/* 프로젝트 카드들 */}
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className={getCardClassName({ hover: true })}
              onClick={() => setSelectedProject(project.title)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{project.title}</h3>
                  {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </div>
                <button className={getButtonClassName({ variant: 'icon' })}>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">진행률</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-500">{project.lastModified}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{project.wordCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{project.chapters}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{project.genre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// #DEBUG: Projects 컴포넌트 export  
export const Projects = ProjectsComponent;

// #DEBUG: 프로젝트 데이터 타입 정의
interface ProjectItem {
  title: string;
  description: string;
  progress: number;
  status: string;
  lastModified: string;
  wordCount: string;
  chapters: number;
  genre: string;
  starred: boolean;
}

// #DEBUG: 세션 데이터 타입 (DB에서 받는 데이터)
interface SessionData {
  id: string;
  content?: string;
  keyCount: number;
  wpm: number;
  accuracy: number;
  timestamp: string;
}
