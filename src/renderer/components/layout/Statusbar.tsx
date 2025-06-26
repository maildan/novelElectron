// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요
"use client"

interface StatusbarProps {
  isMonitoring: boolean
}

export function Statusbar({ isMonitoring }: StatusbarProps) {
  return (
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
  )
} 