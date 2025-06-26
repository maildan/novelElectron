// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요
"use client"

import { Button } from "@components/ui/Button"
import { Textarea } from "@components/ui/Textarea"
import { Sparkles, X, Send } from "lucide-react"

interface AIPanelProps {
  isOpen: boolean
  onClose: () => void
  prompt: string
  setPrompt: (prompt: string) => void
}

export function AIPanel({ isOpen, onClose, prompt, setPrompt }: AIPanelProps) {
  if (!isOpen) return null

  return (
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
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
          💡 <strong>추천 질문:</strong>
          <br />• "오늘 작성할 내용 아이디어 줘"
          <br />• "이 문단을 더 매력적으로 써줘"
          <br />• "캐릭터 설정 도움 필요해"
        </div>
        <Textarea
          placeholder="질문을 입력하세요..."
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          className="focus-ring min-h-[80px] resize-none"
        />
        <Button onClick={() => setPrompt("")} className="btn-primary w-full" disabled={!prompt.trim()}>
          <Send className="w-4 h-4 mr-2" />
          질문하기
        </Button>
      </div>
    </div>
  )
} 