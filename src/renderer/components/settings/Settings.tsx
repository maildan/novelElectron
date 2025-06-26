'use client';

import { useState } from 'react';
import { CommonComponentProps } from '@shared/types';
import { Logger } from '../../shared/logger';
import { 
  OPTIMIZED_STYLES,
  flexItemsCenter,
  flexBetween,
  flexGap2,
  iconSm,
  iconWithText,
  cardSettings,
  textTitle,
  textSubtitle,
  headerBase,
  pageContainer,
  contentArea,
  // 🔥 TEXT 최적화 패턴들
  TEXT_DESCRIPTION,
  TEXT_DESCRIPTION_GREEN,
  TEXT_DATA_VALUE,
  TEXT_DATA_UNIT,
  TEXT_DATA_DESCRIPTION,
} from '../common/optimized-styles';
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
  // #DEBUG: Settings 컴포넌트 진입점
  Logger.info('// #DEBUG: Settings 렌더링 시작');

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
    <div className={pageContainer}>
      <div className={headerBase}>
        <div>
          <h1 className={textTitle}>설정</h1>
          <p className={textSubtitle}>앱을 개인화하고 환경을 설정하세요</p>
        </div>
      </div>

      <div className={contentArea}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 일반 설정 */}
          <div className={cardSettings}>
            <h3 className={`${flexItemsCenter} gap-2 text-lg font-semibold text-slate-900 mb-4`}>
              <SettingsIcon className={`${iconSm} text-slate-600`} />
              일반 설정
            </h3>
            <div className="space-y-4">
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">테마</div>
                  <div className={TEXT_DESCRIPTION}>앱의 외관을 선택하세요</div>
                </div>
                <div className={flexGap2}>
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
                        <IconComponent className={iconSm} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">알림</div>
                  <div className={TEXT_DESCRIPTION}>앱 알림을 받을지 설정하세요</div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications}
                  onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
                />
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">자동 저장</div>
                  <div className={TEXT_DESCRIPTION}>작업 내용을 자동으로 저장합니다</div>
                </div>
                <ToggleSwitch
                  checked={settings.autoSave}
                  onChange={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                />
              </div>
            </div>
          </div>

          {/* 편집 설정 */}
          <div className={cardSettings}>
            <h3 className={`${flexItemsCenter} gap-2 text-lg font-semibold text-slate-900 mb-4`}>
              <Edit3 className={`${iconSm} text-slate-600`} />
              편집 설정
            </h3>
            <div className="space-y-4">
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">맞춤법 검사</div>
                  <div className={TEXT_DESCRIPTION}>실시간으로 맞춤법을 검사합니다</div>
                </div>
                <ToggleSwitch
                  checked={settings.spellCheck}
                  onChange={() => setSettings({ ...settings, spellCheck: !settings.spellCheck })}
                />
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">자동 줄바꿈</div>
                  <div className={TEXT_DESCRIPTION}>긴 줄을 자동으로 줄바꿈합니다</div>
                </div>
                <ToggleSwitch
                  checked={settings.wordWrap}
                  onChange={() => setSettings({ ...settings, wordWrap: !settings.wordWrap })}
                />
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">글자 크기</div>
                  <div className={TEXT_DESCRIPTION}>편집기의 글자 크기를 조정합니다</div>
                </div>
                <div className={flexGap2}>
                  <button 
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    onClick={() => setSettings({ ...settings, fontSize: Math.max(settings.fontSize - 1, 10) })}
                  >
                    A-
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{settings.fontSize}px</span>
                  <button 
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    onClick={() => setSettings({ ...settings, fontSize: Math.min(settings.fontSize + 1, 24) })}
                  >
                    A+
                  </button>
                </div>
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">줄 간격</div>
                  <div className="text-sm text-slate-600">텍스트의 줄 간격을 조정합니다</div>
                </div>
                <div className={flexGap2}>
                  <button 
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.max(settings.lineHeight - 0.1, 1.0) })}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{settings.lineHeight}</span>
                  <button 
                    className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    onClick={() => setSettings({ ...settings, lineHeight: Math.min(settings.lineHeight + 0.1, 3.0) })}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 클라우드 동기화 */}
          <div className={cardSettings}>
            <h3 className={`${flexItemsCenter} gap-2 text-lg font-semibold text-slate-900 mb-4`}>
              <Cloud className={`${iconSm} text-slate-600`} />
              클라우드 동기화
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className={`${flexItemsCenter} gap-2 mb-2`}>
                  <CheckCircle className={iconSm} />
                  <span className="font-medium text-green-900">Google Drive 연결됨</span>
                </div>
                <p className="text-sm text-green-700 mb-3">your-email@gmail.com으로 연결되어 있습니다</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors">
                    동기화 설정
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded transition-colors">
                    연결 해제
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className={`${flexItemsCenter} gap-2 mb-2`}>
                  <CheckCircle className={iconSm} />
                  <span className="font-medium text-slate-900">Loop 클라우드</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Loop의 자체 클라우드 서비스에 연결하세요</p>
                <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium transition-colors">
                  연결하기
                </button>
              </div>
            </div>
          </div>

          {/* AI 설정 */}
          <div className={cardSettings}>
            <h3 className={`${flexItemsCenter} gap-2 text-lg font-semibold text-slate-900 mb-4`}>
              <Bot className={`${iconSm} text-slate-600`} />
              AI 설정
            </h3>
            <div className="space-y-4">
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">AI 제안</div>
                  <div className="text-sm text-slate-600">타이핑 중 AI 제안을 표시합니다</div>
                </div>
                <ToggleSwitch
                  checked={true}
                  onChange={() => {}}
                />
              </div>
              <div className={flexBetween}>
                <div>
                  <div className="font-medium text-slate-900">실시간 분석</div>
                  <div className="text-sm text-slate-600">타이핑 패턴을 실시간으로 분석합니다</div>
                </div>
                <ToggleSwitch
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* 데이터 관리 */}
          <div className={cardSettings}>
            <h3 className={`${flexItemsCenter} gap-2 text-lg font-semibold text-slate-900 mb-4`}>
              <Info className={`${iconSm} text-slate-600`} />
              데이터 관리
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className={`${flexItemsCenter} gap-1 mb-2`}>
                    <span className={TEXT_DATA_VALUE}>1,247</span>
                    <span className={TEXT_DATA_UNIT}>sessions</span>
                  </div>
                  <p className={TEXT_DATA_DESCRIPTION}>총 타이핑 세션</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className={`${flexItemsCenter} gap-1 mb-2`}>
                    <span className={TEXT_DATA_VALUE}>24.3</span>
                    <span className={TEXT_DATA_UNIT}>MB</span>
                  </div>
                  <p className={TEXT_DATA_DESCRIPTION}>사용된 저장 공간</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors">
                  <Download className={iconWithText} />
                  데이터 내보내기
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors">
                  <Upload className={iconWithText} />
                  데이터 가져오기
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors">
                  <RefreshCw className={iconWithText} />
                  캐시 정리
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors">
                  <HelpCircle className={iconWithText} />
                  도움말
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// #DEBUG: Settings 컴포넌트 exit
Logger.info('// #DEBUG: Settings 렌더링 완료');

// #DEBUG: Settings 컴포넌트 export
export default Settings;