'use client';

import { useState } from 'react';
import { CommonComponentProps } from '@shared/types';
import { 
  Settings as SettingsIcon,
  Edit3,
  Cloud,
  Bot,
  Info,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
  CheckCircle
} from 'lucide-react';

export function Settings({ logs, loading }: CommonComponentProps) {
  const [settings, setSettings] = useState({
    theme: "system",
    notifications: true,
    autoSave: true,
    spellCheck: true,
    wordWrap: true,
    fontSize: 14,
    lineHeight: 1.6,
    tabSize: 2,
  });

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      }`}
      onClick={onChange}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const themeOptions = [
    { value: "light", icon: Sun, label: "라이트" },
    { value: "dark", icon: Moon, label: "다크" },
    { value: "system", icon: Monitor, label: "시스템" },
  ];

  return (
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
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-slate-600" />
              일반 설정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">테마</div>
                  <div className="text-sm text-slate-600">앱의 외관을 선택하세요</div>
                </div>
                <div className="flex items-center gap-2">
                  {themeOptions.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <button
                        key={theme.value}
                        className={`p-2 rounded-md transition-colors ${
                          settings.theme === theme.value 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        onClick={() => setSettings({ ...settings, theme: theme.value })}
                      >
                        <IconComponent className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">알림</div>
                  <div className="text-sm text-slate-600">시스템 알림을 받을지 설정하세요</div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications}
                  onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 저장</div>
                  <div className="text-sm text-slate-600">작업 내용을 자동으로 저장합니다</div>
                </div>
                <ToggleSwitch
                  checked={settings.autoSave}
                  onChange={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                />
              </div>
            </div>
          </div>

          {/* 편집기 설정 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
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
                <ToggleSwitch
                  checked={settings.spellCheck}
                  onChange={() => setSettings({ ...settings, spellCheck: !settings.spellCheck })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 줄바꿈</div>
                  <div className="text-sm text-slate-600">긴 줄을 자동으로 줄바꿈합니다</div>
                </div>
                <ToggleSwitch
                  checked={settings.wordWrap}
                  onChange={() => setSettings({ ...settings, wordWrap: !settings.wordWrap })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">글꼴 크기</div>
                  <div className="text-sm text-slate-600">편집기의 글꼴 크기를 조정합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
                    onClick={() => setSettings({ ...settings, fontSize: Math.max(10, settings.fontSize - 1) })}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{settings.fontSize}px</span>
                  <button
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
                    onClick={() => setSettings({ ...settings, fontSize: Math.min(24, settings.fontSize + 1) })}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">줄 간격</div>
                  <div className="text-sm text-slate-600">텍스트의 줄 간격을 조정합니다</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.max(1.0, settings.lineHeight - 0.1) })}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{settings.lineHeight.toFixed(1)}</span>
                  <button
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.min(3.0, settings.lineHeight + 0.1) })}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 동기화 설정 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
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
                  <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium">
                    설정
                  </button>
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
                  <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium">
                    관리
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">자동 백업</div>
                  <div className="text-sm text-slate-600">5분마다 자동으로 백업합니다</div>
                </div>
                <ToggleSwitch checked={true} onChange={() => {}} />
              </div>
            </div>
          </div>

          {/* AI 설정 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
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
                <select className="w-48 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                <select className="w-32 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>짧게</option>
                  <option>보통</option>
                  <option>길게</option>
                  <option>매우 길게</option>
                </select>
              </div>
            </div>
          </div>

          {/* 시스템 정보 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
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
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              설정 내보내기
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors">
              <Upload className="w-4 h-4 mr-2 inline" />
              설정 가져오기
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors">
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              기본값으로 재설정
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors">
              <HelpCircle className="w-4 h-4 mr-2 inline" />
              도움말
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
