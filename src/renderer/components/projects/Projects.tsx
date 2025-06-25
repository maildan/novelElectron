'use client';

import { useState } from 'react';
import { CommonComponentProps } from '@shared/types';
import { 
  Search,
  Filter,
  Plus,
  BookOpen,
  Tag,
  PenTool,
  Eye,
  Edit3,
  Share2,
  Copy,
  Trash2,
  Star,
  MoreHorizontal
} from 'lucide-react';

export function Projects({ logs, loading }: CommonComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // TODO: Replace with actual data from IPC
  const mockProjects = [
    {
      title: "시간의 강",
      description: "SF 소설 - 시간 여행을 다룬 장편 소설",
      progress: 67,
      status: "진행중",
      lastModified: "2분 전",
      wordCount: "45,230",
      chapters: 12,
      genre: "SF",
      starred: true,
    },
    {
      title: "일상의 철학",
      description: "에세이 - 일상에서 찾는 철학적 사유",
      progress: 30,
      status: "초안",
      lastModified: "1시간 전",
      wordCount: "12,450",
      chapters: 8,
      genre: "에세이",
      starred: false,
    },
    {
      title: "도시 이야기",
      description: "단편집 - 도시를 배경으로 한 단편들",
      progress: 85,
      status: "검토중",
      lastModified: "3시간 전",
      wordCount: "28,900",
      chapters: 15,
      genre: "단편",
      starred: true,
    },
    {
      title: "미래의 기억",
      description: "SF 단편 - 기억을 조작하는 기술에 대한 이야기",
      progress: 15,
      status: "계획중",
      lastModified: "1일 전",
      wordCount: "3,200",
      chapters: 3,
      genre: "SF",
      starred: false,
    },
    {
      title: "요리하는 철학자",
      description: "요리 에세이 - 요리를 통해 본 삶의 철학",
      progress: 92,
      status: "완료",
      lastModified: "2일 전",
      wordCount: "52,100",
      chapters: 20,
      genre: "에세이",
      starred: true,
    },
  ];

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
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">프로젝트</h1>
            <p className="text-slate-600 mt-1">모든 창작 프로젝트를 관리하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Filter className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors">
              <Plus className="w-4 h-4 mr-2 inline" />
              새 프로젝트
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 프로젝트 카드 */}
          <div className="border-dashed border-2 border-blue-300 bg-blue-50/50 hover:bg-blue-50 rounded-lg p-6 cursor-pointer transition-colors">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">새 프로젝트</h3>
              <p className="text-sm text-slate-600">아이디어를 시작해보세요</p>
            </div>
          </div>

          {/* 프로젝트 카드들 */}
          {mockProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project.title)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{project.title}</h3>
                  {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{project.description}</p>

              <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{project.chapters}장</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{project.genre}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PenTool className="w-3 h-3" />
                  <span>{project.wordCount} 단어</span>
                </div>
              </div>

              <div className="bg-slate-200 rounded-full h-2 mb-3">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    project.status === "완료" ? "bg-green-600" : "bg-blue-600"
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-slate-500 mb-4">
                <span>{project.progress}% 완료</span>
                <span>수정: {project.lastModified}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded">
                    <Eye className="w-3 h-3 mr-1 inline" />
                    보기
                  </button>
                  <button className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded">
                    <Edit3 className="w-3 h-3 mr-1 inline" />
                    편집
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Share2 className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
