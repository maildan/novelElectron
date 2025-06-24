'use client';

import { useState } from 'react';
import { CommonComponentProps } from '../../../shared/types';
import { 
  Lightbulb,
  PenTool,
  BarChart3,
  Users,
  MessageSquare,
  Bot,
  Send
} from 'lucide-react';

export function AIAnalytics({ logs, loading }: CommonComponentProps) {
  const [aiPrompt, setAiPrompt] = useState("");

  // TODO: Replace with actual data from IPC
  const mockAIFeatures = [
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
  ];

  const mockQuickQuestions = [
    "오늘 쓸 내용 아이디어 줘",
    "이 문단을 더 생동감 있게 써줘",
    "캐릭터 설정 도움이 필요해",
    "글의 구조를 분석해줘",
    "대화 장면을 개선해줘",
    "배경 묘사를 풍부하게 해줘",
  ];

  const mockChatHistory = [
    {
      type: 'ai',
      message: '안녕하세요! Loop AI입니다. 창작 활동에 어떤 도움이 필요하신가요?'
    },
    {
      type: 'user',
      message: 'SF 소설의 캐릭터 설정에 대해 조언을 구하고 싶어요.'
    },
    {
      type: 'ai',
      message: `SF 소설의 캐릭터 설정에 대해 도움을 드리겠습니다! 먼저 몇 가지 질문을 드릴게요:

1. 어떤 시대적 배경인가요? (근미래, 먼 미래 등)
2. 주인공의 직업이나 역할은 무엇인가요?
3. 어떤 갈등이나 문제를 다루고 싶으신가요?`
    }
  ];

  const getFeatureColor = (color: string) => {
    switch (color) {
      case "purple": return "bg-purple-100 text-purple-600";
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "orange": return "bg-orange-100 text-orange-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
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
            {mockAIFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`w-10 h-10 mb-3 rounded-lg flex items-center justify-center ${getFeatureColor(feature.color)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
                  <div className="text-xs text-slate-500">{feature.count}</div>
                </div>
              );
            })}
          </div>

          {/* AI 채팅 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-lg p-6 h-96">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  AI와 대화하기
                </h3>
                <div className="flex-1 bg-slate-50 rounded-lg p-4 mb-4 overflow-y-auto h-64">
                  <div className="space-y-4">
                    {mockChatHistory.map((chat, index) => (
                      <div key={index} className={`flex items-start gap-3 ${chat.type === 'user' ? 'justify-end' : ''}`}>
                        {chat.type === 'ai' && (
                          <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div className={`p-3 rounded-lg shadow-sm max-w-xs ${
                          chat.type === 'ai' 
                            ? 'bg-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{chat.message}</p>
                        </div>
                        {chat.type === 'user' && (
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium">작</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <textarea
                    placeholder="AI에게 질문하거나 도움을 요청하세요..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 h-12 p-3 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md font-medium transition-colors disabled:opacity-50"
                    disabled={!aiPrompt.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">빠른 질문</h3>
                <div className="space-y-2">
                  {mockQuickQuestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left justify-start h-auto p-3 text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={() => setAiPrompt(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
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
  );
}
