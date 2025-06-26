// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요
"use client"

import { Button } from "@/components/ui/button"
import { Minimize2, Maximize2, X } from "lucide-react"

export function Titlebar() {
  return (
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
  )
} 