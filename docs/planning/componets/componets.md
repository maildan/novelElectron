
# Tooltip Component
"use client"

import type React from "react"
import { useState } from "react"

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
}

export function Tooltip({ content, children, side = "right" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const sideClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded whitespace-nowrap ${sideClasses[side]}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}



# Chart Component
"use client"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: ChartData[]
  height?: number
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden">
              <div
                className={`${item.color || "bg-blue-600"} transition-all duration-500 rounded-t-md`}
                style={{
                  height: `${(item.value / maxValue) * (height - 40)}px`,
                  minHeight: "4px",
                }}
              />
            </div>
            <div className="text-xs font-medium text-slate-700 text-center">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LineChartProps {
  data: { label: string; value: number }[]
  height?: number
}

export function LineChart({ data, height = 200 }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / range) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <div className="relative" style={{ height: `${height}px` }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value - minValue) / range) * 80
            return <circle key={index} cx={x} cy={y} r="3" fill="#3b82f6" vectorEffect="non-scaling-stroke" />
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}


# page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/tooltip"
import { BarChart, LineChart } from "@/components/chart"
import {
  Home,
  BarChart3,
  Settings,
  Bot,
  FileText,
  FolderOpen,
  Plus,
  Minimize2,
  Maximize2,
  X,
  Target,
  Clock,
  Sparkles,
  Play,
  Pause,
  CheckCircle,
  Send,
  Menu,
  ChevronLeft,
  Globe,
  Cloud,
  TrendingUp,
  Calendar,
  Zap,
  BookOpen,
  PenTool,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Share2,
  Star,
  MessageSquare,
  Lightbulb,
  Moon,
  Sun,
  Monitor,
  Activity,
  Users,
  Award,
  Bookmark,
  Tag,
  RefreshCw,
  Info,
  HelpCircle,
} from "lucide-react"

export default function LoopApp() {
  const [activeView, setActiveView] = useState("dashboard")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringData, setMonitoringData] = useState({
    wpm: 0,
    words: 0,
    time: 0,
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    theme: "system",
    notifications: true,
    autoSave: true,
    spellCheck: true,
    wordWrap: true,
    fontSize: 14,
    lineHeight: 1.6,
    tabSize: 2,
  })

  // 실시간 모니터링
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMonitoring) {
      interval = setInterval(() => {
        setMonitoringData((prev) => ({
          wpm: Math.floor(Math.random() * 20) + 50,
          words: prev.words + Math.floor(Math.random() * 3),
          time: prev.time + 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isMonitoring])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // 대시보드
  const renderDashboard = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* AI 패널 */}
      {aiPanelOpen && (
        <div
          className="fixed top-4 right-4 w-80 bg-white shadow-xl border border-slate-200 z-50 max-h-[80vh] overflow-hidden"
          style={{ borderRadius: "var(--radius-lg)" }}
          role="dialog"
        >
          <div className="bg-purple-600 text-white flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-semibold">Loop AI</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiPanelOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
              💡 <strong>추천 질문:</strong>
              <br />• "오늘 작성할 내용 아이디어 줘"
              <br />• "이 문단을 더 매력적으로 써줘"
              <br />• "캐릭터 설정 도움이 필요해"
            </div>
            <Textarea
              placeholder="질문을 입력하세요..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="focus-ring min-h-[80px] resize-none"
            />
            <Button onClick={() => setAiPrompt("")} className="btn-primary w-full" disabled={!aiPrompt.trim()}>
              <Send className="w-4 h-4 mr-2" />
              질문하기
            </Button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
            <p className="text-slate-600 mt-1">오늘의 창작을 시작하세요</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`btn-primary ${aiPanelOpen ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              aria-pressed={aiPanelOpen}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Loop AI
            </Button>

            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={isMonitoring ? "btn-danger" : "btn-primary"}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  중지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  시작
                </>
              )}
            </Button>

            <Button variant="ghost" className="btn-secondary">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 모니터링 패널 */}
        {isMonitoring && (
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold">실시간 모니터링</h2>
              </div>
              <div className="font-mono text-lg">{formatTime(monitoringData.time)}</div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{monitoringData.wpm}</div>
                <div className="text-blue-200 text-sm">분당 단어</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{monitoringData.words}</div>
                <div className="text-blue-200 text-sm">총 단어</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {monitoringData.time > 0 ? Math.round(monitoringData.words / (monitoringData.time / 60)) : 0}
                </div>
                <div className="text-blue-200 text-sm">평균 속도</div>
              </div>
            </div>
          </div>
        )}

        {/* 빠른 시작 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">빠른 시작</h2>

          <div className="card card-fixed-height flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">새 프로젝트 시작</h3>
              <p className="text-sm text-slate-600">새로운 창작을 시작하세요</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card card-fixed-height flex flex-col justify-between bg-green-50 border-green-200 hover:border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Globe className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Google Docs</h3>
                <p className="text-sm text-slate-600 mb-2">문서 동기화</p>
                <div className="text-xs text-green-700 font-medium">마지막 동기화: 2분 전</div>
              </div>
            </div>

            <div className="card card-fixed-height flex flex-col justify-between bg-slate-50 border-slate-200 hover:border-slate-300">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                <Cloud className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Loop 클라우드</h3>
                <p className="text-sm text-slate-600 mb-2">백업 동기화</p>
                <div className="text-xs text-slate-700 font-medium">마지막 백업: 5분 전</div>
              </div>
            </div>

            <div className="card card-fixed-height flex flex-col justify-between bg-purple-50 border-purple-200 hover:border-purple-300">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">최근 파일</h3>
                <p className="text-sm text-slate-600 mb-2">작업 이어가기</p>
                <div className="text-xs text-purple-700 font-medium">3개 파일 대기 중</div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">활성 프로젝트</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">시간의 강</h4>
                  <Badge className="bg-blue-600 text-white text-xs font-medium">진행중</Badge>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: "67%" }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">67% 완료</span>
                  <span className="text-xs text-slate-500">목표: 12월 31일</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">일상의 철학</h4>
                  <Badge className="bg-slate-600 text-white text-xs font-medium">초안</Badge>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: "30%" }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">30% 완료</span>
                  <span className="text-xs text-slate-500">목표: 1월 15일</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">최근 파일</h3>
            </div>

            <div className="space-y-2">
              {[
                { name: "chapter-12.md", project: "시간의 강", time: "2분 전", status: "수정됨" },
                { name: "intro.md", project: "일상의 철학", time: "1시간 전", status: "저장됨" },
                { name: "outline.md", project: "도시 이야기", time: "3시간 전", status: "동기화됨" },
              ].map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors focus-ring"
                  role="button"
                  tabIndex={0}
                >
                  <FileText className="w-4 h-4 text-slate-600 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate">{file.name}</div>
                    <div className="text-xs text-slate-500">{file.project}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-slate-700">{file.time}</div>
                    <div className="text-xs text-green-600">{file.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 프로젝트 페이지
  const renderProjects = () => (
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
              <Input
                placeholder="프로젝트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" className="btn-secondary">
              <Filter className="w-4 h-4" />
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />새 프로젝트
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
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
            {
              title: "새 프로젝트",
              description: "아이디어를 시작해보세요",
              progress: 0,
              status: "새로 만들기",
              lastModified: "",
              wordCount: "0",
              chapters: 0,
              genre: "",
              starred: false,
              isNew: true,
            },
          ].map((project, index) => (
            <div
              key={index}
              className={`card hover:shadow-lg transition-all ${
                project.isNew ? "border-dashed border-2 border-blue-300 bg-blue-50/50 hover:bg-blue-50" : ""
              }`}
              onClick={() => !project.isNew && setSelectedProject(project.title)}
            >
              {project.isNew ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{project.title}</h3>
                      {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs font-medium ${
                          project.status === "진행중"
                            ? "bg-blue-100 text-blue-800"
                            : project.status === "초안"
                              ? "bg-slate-100 text-slate-800"
                              : project.status === "검토중"
                                ? "bg-yellow-100 text-yellow-800"
                                : project.status === "완료"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
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

                  <div className="progress-bar mb-3">
                    <div
                      className={`h-full transition-all duration-300 ${
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
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        보기
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Edit3 className="w-3 h-3 mr-1" />
                        편집
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 통계 페이지
  const renderStats = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">통계</h1>
            <p className="text-slate-600 mt-1">창작 활동을 분석하고 개선하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
            <Button variant="ghost" className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 주요 지표 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "오늘 작성", value: "1,234", unit: "단어", icon: PenTool, color: "blue", change: "+12%" },
            { label: "이번 주", value: "8,567", unit: "단어", icon: Calendar, color: "green", change: "+8%" },
            { label: "평균 속도", value: "68", unit: "WPM", icon: Zap, color: "purple", change: "+5%" },
            { label: "총 프로젝트", value: "12", unit: "개", icon: FolderOpen, color: "orange", change: "+2" },
          ].map((stat, index) => (
            <div key={index} className="card">
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
                  <stat.icon className="w-5 h-5" />
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
          ))}
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              주간 작성량
            </h3>
            <LineChart
              data={[
                { label: "월", value: 1200 },
                { label: "화", value: 1800 },
                { label: "수", value: 1400 },
                { label: "목", value: 2200 },
                { label: "금", value: 1900 },
                { label: "토", value: 2800 },
                { label: "일", value: 2100 },
              ]}
              height={200}
            />
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              프로젝트별 진행률
            </h3>
            <BarChart
              data={[
                { label: "시간의 강", value: 67, color: "bg-blue-600" },
                { label: "일상의 철학", value: 30, color: "bg-slate-600" },
                { label: "도시 이야기", value: 85, color: "bg-green-600" },
                { label: "미래의 기억", value: 15, color: "bg-purple-600" },
              ]}
              height={200}
            />
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              활동 패턴
            </h3>
            <div className="space-y-3">
              {[
                { time: "오전 9-12시", percentage: 35, color: "bg-blue-600" },
                { time: "오후 1-5시", percentage: 45, color: "bg-green-600" },
                { time: "오후 6-9시", percentage: 15, color: "bg-yellow-600" },
                { time: "오후 9시 이후", percentage: 5, color: "bg-purple-600" },
              ].map((period, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-900">{period.time}</span>
                    <span className="text-slate-600">{period.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`h-full ${period.color}`} style={{ width: `${period.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              달성 목표
            </h3>
            <div className="space-y-4">
              {[
                { goal: "일일 1,000단어", current: 1234, target: 1000, achieved: true },
                { goal: "주간 7,000단어", current: 8567, target: 7000, achieved: true },
                { goal: "월간 30,000단어", current: 24500, target: 30000, achieved: false },
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{goal.goal}</span>
                    {goal.achieved ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`h-full ${goal.achieved ? "bg-green-600" : "bg-blue-600"}`}
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

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              장르별 분포
            </h3>
            <div className="space-y-3">
              {[
                { genre: "SF", count: 4, percentage: 40, color: "bg-blue-600" },
                { genre: "에세이", count: 3, percentage: 30, color: "bg-green-600" },
                { genre: "단편", count: 2, percentage: 20, color: "bg-purple-600" },
                { genre: "기타", count: 1, percentage: 10, color: "bg-slate-600" },
              ].map((genre, index) => (
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
  )

  // AI 페이지
  const renderAI = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loop AI</h1>
          <p className="text-slate-600 mt-1">AI와 함께 더 나은 글을 써보세요</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* AI 기능 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "아이디어 생성",
                description: "새로운 스토리 아이디어나 주제를 제안받으세요",
                icon: Lightbulb,
                color: "purple",
                count: "24회 사용",
              },
              {
                title: "문체 개선",
                description: "더 매력적이고 읽기 쉬운 문장으로 다듬어보세요",
                icon: PenTool,
                color: "blue",
                count: "18회 사용",
              },
              {
                title: "구조 분석",
                description: "글의 구조와 흐름을 분석하고 개선점을 찾아보세요",
                icon: BarChart3,
                color: "green",
                count: "12회 사용",
              },
              {
                title: "캐릭터 개발",
                description: "생동감 있는 캐릭터 설정과 대화를 만들어보세요",
                icon: Users,
                color: "orange",
                count: "8회 사용",
              },
            ].map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div
                  className={`w-10 h-10 mb-3 rounded-lg flex items-center justify-center ${
                    feature.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : feature.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : feature.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                  }`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
                <div className="text-xs text-slate-500">{feature.count}</div>
              </div>
            ))}
          </div>

          {/* AI 채팅 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card h-96">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  AI와 대화하기
                </h3>
                <div className="flex-1 bg-slate-50 rounded-lg p-4 mb-4 overflow-y-auto h-64">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-900">
                          안녕하세요! Loop AI입니다. 창작 활동에 어떤 도움이 필요하신가요?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-blue-600 text-white p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm">SF 소설의 캐릭터 설정에 대해 조언을 구하고 싶어요.</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">작</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-900">
                          SF 소설의 캐릭터 설정에 대해 도움을 드리겠습니다! 먼저 몇 가지 질문을 드릴게요:
                          <br />
                          <br />
                          1. 어떤 시대적 배경인가요? (근미래, 먼 미래 등)
                          <br />
                          2. 주인공의 직업이나 역할은 무엇인가요?
                          <br />
                          3. 어떤 갈등이나 문제를 다루고 싶으신가요?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="AI에게 질문하거나 도움을 요청하세요..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="focus-ring resize-none h-12"
                  />
                  <Button className="btn-primary px-4" disabled={!aiPrompt.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-slate-900 mb-4">빠른 질문</h3>
                <div className="space-y-2">
                  {[
                    "오늘 쓸 내용 아이디어 줘",
                    "이 문단을 더 생동감 있게 써줘",
                    "캐릭터 설정 도움이 필요해",
                    "글의 구조를 분석해줘",
                    "대화 장면을 개선해줘",
                    "배경 묘사를 풍부하게 해줘",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="btn-secondary w-full text-left justify-start h-auto p-3 text-sm"
                      onClick={() => setAiPrompt(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-slate-900 mb-4">AI 사용 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">이번 달 사용</span>
                    <span className="font-semibold text-slate-900">62회</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">가장 많이 사용한 기능</span>
                    <span className="font-semibold text-slate-900">아이디어 생성</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">평균 응답 시간</span>
                    <span className="font-semibold text-slate-900">2.3초</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 설정 페이지
  const renderSettings = () => (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">설정</h1>
          <p className="text-slate-600 mt-1">앱을 개인화하고 환경을 설정하세요</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 일반 설정 */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-600" />
              일반 설정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">테마</div>
                  <div className="text-sm text-slate-600">앱의 외관을 선택하세요</div>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { value: "light", icon: Sun, label: "라이트" },
                    { value: "dark", icon: Moon, label: "다크" },
                    { value: "system", icon: Monitor, label: "시스템" },
                  ].map((theme) => (
                    <Button
                      key={theme.value}
                      variant="ghost"
                      size="sm"
                      className={`btn-secondary ${settings.theme === theme.value ? "bg-blue-100 text-blue-700" : ""}`}
                      onClick={() => setSettings({ ...settings, theme: theme.value })}
                    >
                      <theme.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">알림</div>
                  <div className="text-sm text-slate-600">시스템 알림을 받을지 설정하세요</div>
                </div>
                <button
                  className={`toggle-switch ${settings.notifications ? "toggle-switch-active" : "toggle-switch-inactive"}`}
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                >
                  <span
                    className={`toggle-thumb ${settings.notifications ? "toggle-thumb-active" : "toggle-thumb-inactive"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 저장</div>
                  <div className="text-sm text-slate-600">작업 내용을 자동으로 저장합니다</div>
                </div>
                <button
                  className={`toggle-switch ${settings.autoSave ? "toggle-switch-active" : "toggle-switch-inactive"}`}
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                >
                  <span
                    className={`toggle-thumb ${settings.autoSave ? "toggle-thumb-active" : "toggle-thumb-inactive"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 편집기 설정 */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-600" />
              편집기 설정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">맞춤법 검사</div>
                  <div className="text-sm text-slate-600">입력하는 동안 맞춤법을 확인합니다</div>
                </div>
                <button
                  className={`toggle-switch ${settings.spellCheck ? "toggle-switch-active" : "toggle-switch-inactive"}`}
                  onClick={() => setSettings({ ...settings, spellCheck: !settings.spellCheck })}
                >
                  <span
                    className={`toggle-thumb ${settings.spellCheck ? "toggle-thumb-active" : "toggle-thumb-inactive"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 줄바꿈</div>
                  <div className="text-sm text-slate-600">긴 줄을 자동으로 줄바꿈합니다</div>
                </div>
                <button
                  className={`toggle-switch ${settings.wordWrap ? "toggle-switch-active" : "toggle-switch-inactive"}`}
                  onClick={() => setSettings({ ...settings, wordWrap: !settings.wordWrap })}
                >
                  <span
                    className={`toggle-thumb ${settings.wordWrap ? "toggle-thumb-active" : "toggle-thumb-inactive"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">글꼴 크기</div>
                  <div className="text-sm text-slate-600">편집기의 글꼴 크기를 조정합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-secondary"
                    onClick={() => setSettings({ ...settings, fontSize: Math.max(10, settings.fontSize - 1) })}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{settings.fontSize}px</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-secondary"
                    onClick={() => setSettings({ ...settings, fontSize: Math.min(24, settings.fontSize + 1) })}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">줄 간격</div>
                  <div className="text-sm text-slate-600">텍스트의 줄 간격을 조정합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-secondary"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.max(1.0, settings.lineHeight - 0.1) })}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{settings.lineHeight.toFixed(1)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-secondary"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.min(3.0, settings.lineHeight + 0.1) })}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 동기화 설정 */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-slate-600" />
              동기화 설정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Google Docs 동기화</div>
                  <div className="text-sm text-slate-600">Google Docs와 자동으로 동기화합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>연결됨</span>
                  </div>
                  <Button variant="ghost" size="sm" className="btn-secondary">
                    설정
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">Loop 클라우드</div>
                  <div className="text-sm text-slate-600">Loop 클라우드에 백업합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>활성</span>
                  </div>
                  <Button variant="ghost" size="sm" className="btn-secondary">
                    관리
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 백업</div>
                  <div className="text-sm text-slate-600">5분마다 자동으로 백업합니다</div>
                </div>
                <button className="toggle-switch toggle-switch-active">
                  <span className="toggle-thumb toggle-thumb-active" />
                </button>
              </div>
            </div>
          </div>

          {/* AI 설정 */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-slate-600" />
              AI 설정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">AI 모델</div>
                  <div className="text-sm text-slate-600">사용할 AI 모델을 선택하세요</div>
                </div>
                <select className="input-field w-48">
                  <option>GPT-4 (권장)</option>
                  <option>GPT-3.5 Turbo</option>
                  <option>Claude 3</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">창의성 수준</div>
                  <div className="text-sm text-slate-600">AI 응답의 창의성을 조정합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">보수적</span>
                  <input type="range" min="0" max="100" defaultValue="70" className="w-24" />
                  <span className="text-sm text-slate-600">창의적</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">응답 길이</div>
                  <div className="text-sm text-slate-600">AI 응답의 기본 길이를 설정합니다</div>
                </div>
                <select className="input-field w-32">
                  <option>짧게</option>
                  <option>보통</option>
                  <option>길게</option>
                  <option>매우 길게</option>
                </select>
              </div>
            </div>
          </div>

          {/* 시스템 정보 */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              시스템 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">앱 버전</span>
                  <span className="text-sm font-medium text-slate-900">Loop v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">플랫폼</span>
                  <span className="text-sm font-medium text-slate-900">macOS 14.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">메모리 사용량</span>
                  <span className="text-sm font-medium text-slate-900">128 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">디스크 사용량</span>
                  <span className="text-sm font-medium text-slate-900">2.4 GB</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">마지막 업데이트</span>
                  <span className="text-sm font-medium text-slate-900">2024년 12월 15일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">라이선스</span>
                  <span className="text-sm font-medium text-slate-900">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">지원 만료</span>
                  <span className="text-sm font-medium text-slate-900">2025년 12월 15일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">네트워크 상태</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">온라인</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              설정 내보내기
            </Button>
            <Button variant="ghost" className="btn-secondary">
              <Upload className="w-4 h-4 mr-2" />
              설정 가져오기
            </Button>
            <Button variant="ghost" className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              기본값으로 재설정
            </Button>
            <Button variant="ghost" className="btn-secondary">
              <HelpCircle className="w-4 h-4 mr-2" />
              도움말
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "projects":
        return renderProjects()
      case "stats":
        return renderStats()
      case "ai":
        return renderAI()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 타이틀바 */}
      <div
        className="h-8 bg-slate-100 flex items-center justify-between border-b border-slate-200 px-3"
        data-tauri-drag-region
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-sm"></div>
          <span className="text-slate-800 font-medium text-sm">Loop</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-500 hover:bg-slate-200">
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-500 hover:bg-slate-200">
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-slate-500 hover:bg-red-100">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 모바일 메뉴 */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden fixed top-3 left-3 z-50 bg-white shadow-md border h-8 w-8 p-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* 사이드바 */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ${
            mobileMenuOpen ? "fixed inset-y-0 left-0 z-40 lg:relative shadow-lg" : "hidden lg:flex"
          }`}
        >
          {/* 프로필 */}
          <div className="border-b border-slate-200 p-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">작</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-slate-900 text-sm">작가님</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-slate-500">작업 중</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                  onClick={() => setSidebarCollapsed(true)}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">작</AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                  onClick={() => setSidebarCollapsed(false)}
                >
                  <ChevronLeft className="w-3 h-3 rotate-180" />
                </Button>
              </div>
            )}
          </div>

          {/* 네비게이션 */}
          <div className="flex-1 p-3">
            <div className="space-y-1">
              {[
                { id: "dashboard", icon: Home, label: "대시보드" },
                { id: "projects", icon: FolderOpen, label: "프로젝트" },
                { id: "stats", icon: BarChart3, label: "통계" },
                { id: "ai", icon: Bot, label: "Loop AI" },
              ].map((item) => {
                const NavButton = (
                  <button
                    key={item.id}
                    className={`nav-item ${activeView === item.id ? "nav-item-active" : "nav-item-inactive"}`}
                    onClick={() => setActiveView(item.id)}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                )

                return sidebarCollapsed ? (
                  <Tooltip key={item.id} content={item.label}>
                    {NavButton}
                  </Tooltip>
                ) : (
                  NavButton
                )
              })}
            </div>
          </div>

          {/* 설정 */}
          <div className="border-t border-slate-200 p-3">
            {sidebarCollapsed ? (
              <Tooltip content="설정">
                <button
                  className={`nav-item ${activeView === "settings" ? "nav-item-active" : "nav-item-inactive"}`}
                  onClick={() => setActiveView("settings")}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </Tooltip>
            ) : (
              <button
                className={`nav-item ${activeView === "settings" ? "nav-item-active" : "nav-item-inactive"}`}
                onClick={() => setActiveView("settings")}
              >
                <Settings className="w-4 h-4" />
                <span>설정</span>
              </button>
            )}
          </div>
        </div>

        {/* 모바일 오버레이 */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* 메인 콘텐츠 */}
        {renderMainContent()}
      </div>

      {/* 상태바 */}
      <div className="h-6 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">Loop v1.0.0</span>
          {isMonitoring && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>모니터링 중</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>AI: 활성</span>
          <span>•</span>
          <span>온라인</span>
        </div>
      </div>
    </div>
  )
}


# loading.css
export default function Loading() {
  return null
}


# global.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@layer components {
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2;
  }

  .card {
    @apply bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .card-fixed-height {
    height: 120px;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors focus-ring;
    border-radius: var(--radius-md);
  }

  .btn-secondary {
    @apply bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors focus-ring;
    border-radius: var(--radius-md);
  }

  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700 font-medium transition-colors focus-ring;
    border-radius: var(--radius-md);
  }

  .btn-success {
    @apply bg-green-600 text-white hover:bg-green-700 font-medium transition-colors focus-ring;
    border-radius: var(--radius-md);
  }

  .nav-item {
    @apply w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors focus-ring;
    border-radius: var(--radius-md);
  }

  .nav-item-active {
    @apply bg-blue-50 text-blue-700 border border-blue-200;
  }

  .nav-item-inactive {
    @apply text-slate-600 hover:text-slate-900 hover:bg-slate-50;
  }

  .progress-bar {
    @apply bg-slate-200 rounded-full overflow-hidden;
    height: 6px;
  }

  .progress-fill {
    @apply bg-blue-600 h-full transition-all duration-300;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
  }

  .toggle-switch {
    @apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  }

  .toggle-switch-active {
    @apply bg-blue-600;
  }

  .toggle-switch-inactive {
    @apply bg-slate-200;
  }

  .toggle-thumb {
    @apply inline-block h-4 w-4 transform rounded-full bg-white transition-transform;
  }

  .toggle-thumb-active {
    @apply translate-x-6;
  }

  .toggle-thumb-inactive {
    @apply translate-x-1;
  }
}

