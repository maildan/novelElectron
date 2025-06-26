// TODO: Loop 프로젝트 strict 타입/스타일/로깅/접근성/IPC 규칙에 맞게 리팩터링 필요
"use client"

import { Button } from "@components/ui/Button"
import { Avatar, AvatarFallback } from "@components/ui/Avatar"
import { Tooltip, TooltipProvider } from "@components/ui/Tooltip"
import { ChevronLeft } from "lucide-react"
import { NAVIGATION_ITEMS, SETTINGS_NAV } from "@constants/data"
import type { ViewType } from "@types/index"

interface SidebarProps {
  activeView: ViewType
  setActiveView: (view: ViewType) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Sidebar({
  activeView,
  setActiveView,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  return (
    <>
      <TooltipProvider>
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
              {NAVIGATION_ITEMS.map((item: typeof NAVIGATION_ITEMS[number]) => {
                const NavButton = (
                  <button
                    key={item.id}
                    className={`nav-item ${activeView === item.id ? "nav-item-active" : "nav-item-inactive"}`}
                    onClick={() => setActiveView(item.id as ViewType)}
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
              <Tooltip content={SETTINGS_NAV.label}>
                <button
                  className={`nav-item ${activeView === "settings" ? "nav-item-active" : "nav-item-inactive"}`}
                  onClick={() => setActiveView("settings")}
                >
                  <SETTINGS_NAV.icon className="w-4 h-4" />
                </button>
              </Tooltip>
            ) : (
              <button
                className={`nav-item ${activeView === "settings" ? "nav-item-active" : "nav-item-inactive"}`}
                onClick={() => setActiveView("settings")}
              >
                <SETTINGS_NAV.icon className="w-4 h-4" />
                <span>{SETTINGS_NAV.label}</span>
              </button>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* 모바일 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  )
} 