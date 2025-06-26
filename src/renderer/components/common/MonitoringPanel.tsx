// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요
"use client"

import type { MonitoringData } from "@/types"
import { formatTime } from "@/utils/formatters"

interface MonitoringPanelProps {
  monitoringData: MonitoringData
}

export function MonitoringPanel({ monitoringData }: MonitoringPanelProps) {
  return (
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
  )
} 