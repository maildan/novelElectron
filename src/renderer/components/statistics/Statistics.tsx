'use client';

import { CommonComponentProps } from '@shared/types';
import { 
  Download,
  RefreshCw,
  PenTool,
  Calendar,
  Zap,
  FolderOpen,
  TrendingUp,
  BarChart3,
  Activity,
  Award,
  CheckCircle,
  Clock,
  Bookmark
} from 'lucide-react';

export function Statistics({ logs, loading }: CommonComponentProps) {
  // TODO: Replace with actual data from IPC
  const mockStats = [
    { label: "오늘 작성", value: "1,234", unit: "단어", icon: PenTool, color: "blue", change: "+12%" },
    { label: "이번 주", value: "8,567", unit: "단어", icon: Calendar, color: "green", change: "+8%" },
    { label: "평균 속도", value: "68", unit: "WPM", icon: Zap, color: "purple", change: "+5%" },
    { label: "총 프로젝트", value: "12", unit: "개", icon: FolderOpen, color: "orange", change: "+2" },
  ];

  const mockWeeklyData = [
    { label: "월", value: 1200 },
    { label: "화", value: 1800 },
    { label: "수", value: 1400 },
    { label: "목", value: 2200 },
    { label: "금", value: 1900 },
    { label: "토", value: 2800 },
    { label: "일", value: 2100 },
  ];

  const mockProjectData = [
    { label: "시간의 강", value: 67, color: "bg-blue-600" },
    { label: "일상의 철학", value: 30, color: "bg-slate-600" },
    { label: "도시 이야기", value: 85, color: "bg-green-600" },
    { label: "미래의 기억", value: 15, color: "bg-purple-600" },
  ];

  const mockActivityPattern = [
    { time: "오전 9-12시", percentage: 35, color: "bg-blue-600" },
    { time: "오후 1-5시", percentage: 45, color: "bg-green-600" },
    { time: "오후 6-9시", percentage: 15, color: "bg-yellow-600" },
    { time: "오후 9시 이후", percentage: 5, color: "bg-purple-600" },
  ];

  const mockGoals = [
    { goal: "일일 1,000단어", current: 1234, target: 1000, achieved: true },
    { goal: "주간 7,000단어", current: 8567, target: 7000, achieved: true },
    { goal: "월간 30,000단어", current: 24500, target: 30000, achieved: false },
  ];

  const mockGenres = [
    { genre: "SF", count: 4, percentage: 40, color: "bg-blue-600" },
    { genre: "에세이", count: 3, percentage: 30, color: "bg-green-600" },
    { genre: "단편", count: 2, percentage: 20, color: "bg-purple-600" },
    { genre: "기타", count: 1, percentage: 10, color: "bg-slate-600" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">통계</h1>
            <p className="text-slate-600 mt-1">창작 활동을 분석하고 개선하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              내보내기
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors">
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              새로고침
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 주요 지표 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      stat.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : stat.color === "green"
                          ? "bg-green-100 text-green-600"
                          : stat.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">
                  {stat.label} <span className="text-slate-500">({stat.unit})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              주간 작성량
            </h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {mockWeeklyData.map((item, index) => {
                const maxValue = Math.max(...mockWeeklyData.map(d => d.value));
                const height = (item.value / maxValue) * 150;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden">
                      <div
                        className="bg-blue-600 transition-all duration-500 rounded-t-md"
                        style={{
                          height: `${height}px`,
                          minHeight: "4px",
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-slate-700 text-center">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              프로젝트별 진행률
            </h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {mockProjectData.map((item, index) => {
                const height = (item.value / 100) * 150;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden">
                      <div
                        className={`${item.color} transition-all duration-500 rounded-t-md`}
                        style={{
                          height: `${height}px`,
                          minHeight: "4px",
                        }}
                      />
                    </div>
                    <div className="text-xs font-medium text-slate-700 text-center">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              활동 패턴
            </h3>
            <div className="space-y-3">
              {mockActivityPattern.map((period, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-900">{period.time}</span>
                    <span className="text-slate-600">{period.percentage}%</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2">
                    <div className={`h-full ${period.color} rounded-full`} style={{ width: `${period.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              달성 목표
            </h3>
            <div className="space-y-4">
              {mockGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{goal.goal}</span>
                    {goal.achieved ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full ${goal.achieved ? "bg-green-600" : "bg-blue-600"} rounded-full`}
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()} 단어
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              장르별 분포
            </h3>
            <div className="space-y-3">
              {mockGenres.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${genre.color}`}></div>
                    <span className="text-sm font-medium text-slate-900">{genre.genre}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{genre.count}개</div>
                    <div className="text-xs text-slate-500">{genre.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
