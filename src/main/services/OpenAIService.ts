// 🔥 기가차드 OpenAI API 서비스 - 작가 친화적 AI 어시스턴트

import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface OpenAIRequest {
  readonly message: string;
  readonly context?: string;
  readonly type?: 'chat' | 'writing' | 'analysis';
}

export interface OpenAIResponse {
  readonly response: string;
  readonly suggestions?: readonly string[];
  readonly analysis?: {
    readonly sentiment: string;
    readonly tone: string;
    readonly keywords: readonly string[];
  };
  readonly usage?: {
    readonly tokens: number;
    readonly cost: number;
  };
}

export interface OpenAIConfig {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

/**
 * 🔥 OpenAIService - 외부 OpenAI API 서버와 통신
 * Loop 전용 OpenAI API 서버에 연결하여 작가를 위한 AI 어시스턴트 기능 제공
 */
export class OpenAIService {
  private readonly componentName = 'OPENAI_SERVICE';
  private readonly config: OpenAIConfig;

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = {
      apiUrl: 'https://loop-openai.onrender.com/api/chat',
      timeout: 30000, // 30초
      retries: 3,
      ...config,
    };

    Logger.info(this.componentName, 'OpenAI service initialized', {
      apiUrl: this.config.apiUrl,
      timeout: this.config.timeout,
    });
  }

  /**
   * 🔥 AI 채팅 메시지 전송
   */
  public async sendMessage(request: OpenAIRequest): Promise<IpcResponse<OpenAIResponse>> {
    const startTime = Date.now();
    
    try {
      Logger.debug(this.componentName, 'Sending message to OpenAI API', {
        messageLength: request.message.length,
        type: request.type || 'chat',
      });

      const response = await this.makeRequest(request);
      const duration = Date.now() - startTime;

      Logger.info(this.componentName, 'OpenAI API response received', {
        duration: `${duration}ms`,
        responseLength: response.response.length,
        hasSuggestions: !!response.suggestions,
      });

      return {
        success: true,
        data: response,
        timestamp: new Date(),
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      Logger.error(this.componentName, 'OpenAI API request failed', {
        error,
        duration: `${duration}ms`,
        message: request.message.substring(0, 100),
      });

      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 텍스트 분석 요청
   */
  public async analyzeText(text: string): Promise<IpcResponse<OpenAIResponse>> {
    return this.sendMessage({
      message: `다음 텍스트를 분석해주세요: ${text}`,
      type: 'analysis',
    });
  }

  /**
   * 🔥 글쓰기 도움 요청
   */
  public async getWritingHelp(prompt: string, context?: string): Promise<IpcResponse<OpenAIResponse>> {
    const message = context 
      ? `컨텍스트: ${context}\n\n요청: ${prompt}`
      : prompt;

    return this.sendMessage({
      message,
      type: 'writing',
      context,
    });
  }

  /**
   * 🔥 실제 API 요청 수행
   */
  private async makeRequest(request: OpenAIRequest): Promise<OpenAIResponse> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        Logger.debug(this.componentName, `API request attempt ${attempt}/${this.config.retries}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Loop-Desktop-App/1.0.0',
          },
          body: JSON.stringify({
            message: request.message,
            context: request.context,
            type: request.type || 'chat',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 🔥 응답 데이터 검증
        if (!data || typeof data.response !== 'string') {
          throw new Error('Invalid response format from OpenAI API');
        }

        return {
          response: data.response,
          suggestions: data.suggestions || [],
          analysis: data.analysis,
          usage: data.usage,
        };

      } catch (error) {
        lastError = error;
        Logger.warn(this.componentName, `API request attempt ${attempt} failed`, {
          attempt,
          error: this.getErrorMessage(error),
        });

        // 마지막 시도가 아니면 잠시 대기
        if (attempt < this.config.retries) {
          await this.delay(1000 * attempt); // 지수 백오프
        }
      }
    }

    throw lastError;
  }

  /**
   * 🔥 에러 메시지 추출
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return `요청 시간 초과 (${this.config.timeout}ms)`;
      }
      if (error.message.includes('fetch')) {
        return '네트워크 연결 오류';
      }
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다';
  }

  /**
   * 🔥 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🔥 서비스 상태 확인
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.sendMessage({
        message: 'health check',
        type: 'chat',
      });
      return response.success;
    } catch {
      return false;
    }
  }
}

// 🔥 싱글톤 인스턴스 생성
export const openAIService = new OpenAIService();
