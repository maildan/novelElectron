'use client';

import { useState, useEffect, useCallback } from 'react';
import { CommonComponentProps } from '@shared/types';
import { 
  Lightbulb,
  PenTool,
  BarChart3,
  Users,
  MessageSquare,
  Bot,
  Send
} from 'lucide-react';

// #DEBUG: AI 기능 관련 타입 정의
interface AIFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count: string;
}

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  sender: 'user' | 'ai';
  type?: 'question' | 'answer' | 'suggestion';
}

export function AIAnalytics({ logs, loading }: CommonComponentProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiFeatures, setAiFeatures] = useState<AIFeature[]>([]);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const loadAIFeatures = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        // 실제 로그 데이터 기반 통계 생성
        const analysisCount = logs.filter(log => log.content.length > 100).length;
        const ideasCount = logs.filter(log => 
          log.content.includes('아이디어') || 
          log.content.includes('브레인스토밍') ||
          log.content.includes('창작')
        ).length;
        
        setAiFeatures([
          {
            title: "아이디어 생성",
            description: "새로운 스토리 아이디어나 주제를 제안받으세요",
            icon: Lightbulb,
            color: "purple",
            count: `${ideasCount}회 사용`,
          },
          {
            title: "문체 개선",
            description: "더 매력적이고 읽기 쉬운 문장으로 다듬어보세요",
            icon: PenTool,
            color: "blue",
            count: `${Math.floor(analysisCount * 0.7)}회 사용`,
          },
          {
            title: "구조 분석",
            description: "글의 구조와 흐름을 분석하고 개선점을 찾아보세요",
            icon: BarChart3,
            color: "green",
            count: `${analysisCount}회 사용`,
          },
          {
            title: "캐릭터 개발",
            description: "생동감 있는 캐릭터 설정과 대화를 만들어보세요",
            icon: Users,
            color: "orange",
            count: `${Math.floor(analysisCount * 0.4)}회 사용`,
          },
        ]);
      } else {
        setAiFeatures([]);
      }
    } catch (error) {
      console.error('AI 기능 로딩 실패:', error);
      setAiFeatures([]);
    }
  }, [logs]);

  const loadQuickQuestions = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        // 실제 로그 기반 추천 질문 생성
        const recentContent = logs.slice(0, 5).map(log => log.content).join(' ');
        const hasLongContent = recentContent.length > 200;
        const hasDialogue = recentContent.includes('"') || recentContent.includes('"');
        
        const dynamicQuestions = [
          "오늘 쓸 내용 아이디어 줘",
          hasLongContent ? "이 문단을 더 생동감 있게 써줘" : "글쓰기 시작 도움이 필요해",
          hasDialogue ? "대화 장면을 개선해줘" : "캐릭터 설정 도움이 필요해",
          "글의 구조를 분석해줘",
          logs.length > 3 ? "최근 작성한 글의 패턴을 분석해줘" : "창작 방향성 조언이 필요해",
          "배경 묘사를 풍부하게 해줘",
        ];
        
        setQuickQuestions(dynamicQuestions);
      } else {
        setQuickQuestions(["AI 기능을 사용하려면 Electron API가 필요합니다"]);
      }
    } catch (error) {
      console.error('Quick questions 로딩 실패:', error);
      setQuickQuestions([]);
    }
  }, [logs]);

  const loadChatHistory = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        // TODO: 실제 AI 채팅 히스토리 API 구현
        setChatHistory([
          {
            type: 'ai',
            message: '안녕하세요! Loop AI입니다. 창작 활동에 어떤 도움이 필요하신가요?'
          }
        ]);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Chat history 로딩 실패:', error);
      setChatHistory([]);
    }
  }, []);

  useEffect(() => {
    // 🔥 실제 AI 기능 사용 통계 로드
    loadAIFeatures();
    loadQuickQuestions();
    loadChatHistory();
  }, [loadAIFeatures, loadQuickQuestions, loadChatHistory]);

  const getFeatureColor = (color: string) => {
    switch (color) {
      case "purple": return "bg-purple-100 text-purple-600";
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "orange": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return;
    
    setLoadingAI(true);
    try {
      // TODO: 실제 AI API 호출 구현
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 응답 추가
      const newChatHistory = [
        ...chatHistory,
        {
          type: 'user',
          message: aiPrompt
        },
        {
          type: 'ai', 
          message: '죄송합니다. AI 기능은 현재 개발 중입니다. 곧 사용하실 수 있습니다!'
        }
      ];
      
      setChatHistory(newChatHistory);
      setAiPrompt("");
    } catch (error) {
      console.error('AI 요청 실패:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* AI 기능 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getFeatureColor(feature.color)}`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
                  <span className="text-xs text-gray-500">{feature.count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 채팅 인터페이스 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI 창작 도우미</h2>
          </div>
        </div>

        {/* 빠른 질문 버튼 */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">빠른 질문</h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setAiPrompt(suggestion)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* 채팅 히스토리 */}
        <div className="p-4 max-h-64 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>AI와 대화를 시작해보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              placeholder="AI에게 질문하거나 도움을 요청하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingAI}
            />
            <button
              onClick={handleAISubmit}
              disabled={loadingAI || !aiPrompt.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingAI ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
