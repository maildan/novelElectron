// TODO: Loop strict 규칙에 맞게 타입/네이밍/공유 구조 리팩터링 필요
export interface MonitoringData {
  wpm: number
  words: number
  time: number
}

export interface Project {
  title: string
  description: string
  progress: number
  status: string
  lastModified: string
  wordCount: string
  chapters: number
  genre: string
  starred: boolean
  isNew?: boolean
}

export interface FileItem {
  name: string
  project: string
  time: string
  status: string
}

export interface StatItem {
  label: string
  value: string
  unit: string
  icon: any
  color: string
  change?: string
}

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface AIFeature {
  title: string
  description: string
  icon: any
  color: string
  count?: string
}

export interface Settings {
  theme: string
  notifications: boolean
  autoSave: boolean
  spellCheck: boolean
  wordWrap: boolean
  fontSize: number
  lineHeight: number
  tabSize: number
}

export type ViewType = "dashboard" | "projects" | "stats" | "ai" | "settings" 