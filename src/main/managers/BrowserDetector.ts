// 🔥 기가차드 브라우저 감지자 - 웹사이트별 타이핑 분석 전문가!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result } from '../../shared/types';
import { WindowTracker } from '../keyboard/WindowTracker';

// #DEBUG: Browser detector entry point
Logger.debug('BROWSER_DETECTOR', 'Browser detector module loaded');

// 🔥 기가차드 브라우저 정보 인터페이스
export interface BrowserInfo {
  browserName: string;
  browserVersion?: string;
  currentUrl?: string;
  currentTitle?: string;
  domain?: string;
  isGoogleDocs?: boolean;
  isProductiveSite?: boolean;
  siteCategory: string;
}

// 🔥 기가차드 브라우저 이벤트
export interface BrowserEvent {
  type: 'navigation' | 'tab-change' | 'browser-switch' | 'google-docs-detected';
  browserInfo: BrowserInfo;
  timestamp: Date;
  previousUrl?: string;
}

// 🔥 기가차드 브라우저 설정
export interface BrowserConfig {
  enableUrlTracking: boolean;
  enableGoogleDocsDetection: boolean;
  enableProductivityTracking: boolean;
  checkInterval: number; // milliseconds
  supportedBrowsers: string[];
}

// 🔥 기가차드 사이트 카테고리
export interface SiteCategories {
  productivity: string[];
  entertainment: string[];
  social: string[];
  shopping: string[];
  news: string[];
  development: string[];
  education: string[];
}

/**
 * 🔥 BrowserDetector - 브라우저 및 웹사이트 감지 시스템
 * 활성 브라우저 감지, URL 추적, Google Docs 특별 처리, 생산성 분석
 */
export class BrowserDetector extends BaseManager {
  private readonly componentName = 'BROWSER_DETECTOR';
  private browserConfig: BrowserConfig;
  private currentBrowserInfo: BrowserInfo | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private windowTracker: WindowTracker;

  // 🔥 지원하는 브라우저 목록
  private readonly supportedBrowsers = [
    'Google Chrome',
    'Safari',
    'Firefox',
    'Microsoft Edge', 
    'Arc',
    'Brave Browser',
    'Opera',
    'Vivaldi'
  ];

  // 🔥 사이트 카테고리 매핑
  private readonly siteCategories: SiteCategories = {
    productivity: [
      'docs.google.com',
      'notion.so',
      'obsidian.md',
      'roamresearch.com',
      'airtable.com',
      'sheets.google.com',
      'slides.google.com',
      'trello.com',
      'asana.com',
      'monday.com',
      'slack.com',
      'teams.microsoft.com',
      'zoom.us',
      'figma.com',
      'canva.com'
    ],
    development: [
      'github.com',
      'gitlab.com',
      'stackoverflow.com',
      'developer.mozilla.org',
      'npmjs.com',
      'codepen.io',
      'jsfiddle.net',
      'codesandbox.io',
      'replit.com',
      'vercel.com',
      'netlify.com'
    ],
    entertainment: [
      'youtube.com',
      'netflix.com',
      'spotify.com',
      'twitch.tv',
      'reddit.com',
      'instagram.com',
      'tiktok.com'
    ],
    social: [
      'facebook.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'discord.com',
      'telegram.org'
    ],
    shopping: [
      'amazon.com',
      'ebay.com',
      'shopify.com',
      'etsy.com',
      'aliexpress.com'
    ],
    news: [
      'bbc.com',
      'cnn.com',
      'reuters.com',
      'techcrunch.com',
      'hackernews.com'
    ],
    education: [
      'coursera.org',
      'udemy.com',
      'khan.academy.org',
      'edx.org',
      'udacity.com'
    ]
  };

  constructor(config: Partial<BrowserConfig> = {}) {
    super({
      name: 'BrowserDetector',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.browserConfig = {
      enableUrlTracking: true,
      enableGoogleDocsDetection: true,
      enableProductivityTracking: true,
      checkInterval: 1000, // 1초마다 체크
      supportedBrowsers: this.supportedBrowsers,
      ...config,
    };

    this.windowTracker = new WindowTracker();
    
    Logger.info(this.componentName, 'Browser detector instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      await this.windowTracker.initialize();
      this.setupEventListeners();
      
      Logger.info(this.componentName, 'Browser detector initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      await this.windowTracker.start();
      this.startBrowserDetection();
      
      Logger.info(this.componentName, 'Browser detector started successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.stopBrowserDetection();
      await this.windowTracker.stop();
      
      Logger.info(this.componentName, 'Browser detector stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      await this.windowTracker.cleanup();
      this.currentBrowserInfo = null;
      
      Logger.info(this.componentName, 'Browser detector cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup browser detector', err);
      throw err;
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    this.windowTracker.on('window-changed', (windowInfo) => {
      const isBrowser = this.isBrowserWindow(windowInfo.owner.name);
      if (isBrowser) {
        this.handleBrowserWindowChange(windowInfo);
      }
    });
  }

  /**
   * 브라우저 감지 시작
   */
  private startBrowserDetection(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      await this.checkBrowserState();
    }, this.browserConfig.checkInterval);
  }

  /**
   * 브라우저 감지 중지
   */
  private stopBrowserDetection(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * 브라우저 윈도우인지 확인
   */
  private isBrowserWindow(processName: string): boolean {
    return this.supportedBrowsers.some(browser => 
      processName.toLowerCase().includes(browser.toLowerCase())
    );
  }

  /**
   * 브라우저 윈도우 변경 처리
   */
  private async handleBrowserWindowChange(windowInfo: { owner: { name: string }; title: string }): Promise<void> {
    try {
      const browserInfo = await this.extractBrowserInfo({
        processName: windowInfo.owner.name,
        title: windowInfo.title
      });
      
      if (this.hasBrowserInfoChanged(browserInfo)) {
        this.currentBrowserInfo = browserInfo;
        this.emitBrowserEvent('browser-switch', browserInfo);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Error handling browser window change', error);
    }
  }

  /**
   * 브라우저 상태 체크
   */
  private async checkBrowserState(): Promise<void> {
    try {
      const currentWindow = this.windowTracker.getCurrentWindow();
      
      if (!currentWindow || !this.isBrowserWindow(currentWindow.owner.name)) {
        return;
      }

      const browserInfo = await this.extractBrowserInfo({
        processName: currentWindow.owner.name,
        title: currentWindow.title
      });
      
      if (this.hasBrowserInfoChanged(browserInfo)) {
        const eventType = this.determineBrowserEventType(browserInfo);
        this.currentBrowserInfo = browserInfo;
        this.emitBrowserEvent(eventType, browserInfo);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Error checking browser state', error);
    }
  }

  /**
   * 브라우저 정보 추출
   */
  private async extractBrowserInfo(windowInfo: { processName: string; title: string }): Promise<BrowserInfo> {
    const browserName = this.normalizeBrowserName(windowInfo.processName);
    const { url, title } = this.parseWindowTitle(windowInfo.title, browserName);
    const domain = this.extractDomain(url);
    const siteCategory = this.categorizeSite(domain);
    
    return {
      browserName,
      currentUrl: url,
      currentTitle: title,
      domain,
      isGoogleDocs: this.isGoogleDocsUrl(url),
      isProductiveSite: this.isProductiveSite(domain),
      siteCategory,
    };
  }

  /**
   * 브라우저 이름 정규화
   */
  private normalizeBrowserName(processName: string): string {
    const normalized = processName.toLowerCase();
    
    if (normalized.includes('chrome')) return 'Google Chrome';
    if (normalized.includes('safari')) return 'Safari';
    if (normalized.includes('firefox')) return 'Firefox';
    if (normalized.includes('edge')) return 'Microsoft Edge';
    if (normalized.includes('arc')) return 'Arc';
    if (normalized.includes('brave')) return 'Brave Browser';
    if (normalized.includes('opera')) return 'Opera';
    if (normalized.includes('vivaldi')) return 'Vivaldi';
    
    return processName;
  }

  /**
   * 윈도우 제목에서 URL과 제목 파싱
   */
  private parseWindowTitle(windowTitle: string, browserName: string): { url?: string; title?: string } {
    // Google Docs 특별 처리
    if (this.isGoogleDocsTitle(windowTitle)) {
      return {
        url: 'https://docs.google.com/',
        title: this.extractGoogleDocsTitle(windowTitle)
      };
    }

    // 일반적인 브라우저 제목 파싱
    if (browserName === 'Safari' && windowTitle.includes(' — ')) {
      const parts = windowTitle.split(' — ');
      return {
        title: parts[0],
        url: parts[1]
      };
    }

    // Chrome, Firefox 등
    if (windowTitle.includes(' - ')) {
      const lastDashIndex = windowTitle.lastIndexOf(' - ');
      return {
        title: windowTitle.substring(0, lastDashIndex),
        url: undefined // URL 추출이 어려운 경우
      };
    }

    return {
      title: windowTitle,
      url: undefined
    };
  }

  /**
   * 도메인 추출
   */
  private extractDomain(url?: string): string {
    if (!url) return 'unknown';
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * 사이트 카테고리 분류
   */
  private categorizeSite(domain: string): string {
    for (const [category, domains] of Object.entries(this.siteCategories)) {
      if (domains.some((siteDomain: string) => domain.includes(siteDomain))) {
        return category;
      }
    }
    return 'other';
  }

  /**
   * Google Docs URL 확인
   */
  private isGoogleDocsUrl(url?: string): boolean {
    if (!url) return false;
    return url.includes('docs.google.com') || url.includes('sheets.google.com') || url.includes('slides.google.com');
  }

  /**
   * Google Docs 제목 확인
   */
  private isGoogleDocsTitle(title: string): boolean {
    return title.includes('Google Docs') || 
           title.includes('Google Sheets') || 
           title.includes('Google Slides') ||
           title.includes('구글 문서') ||
           title.includes('구글 스프레드시트') ||
           title.includes('구글 프레젠테이션');
  }

  /**
   * Google Docs 제목 추출
   */
  private extractGoogleDocsTitle(windowTitle: string): string {
    // "Document Name - Google Docs" 형태에서 문서명 추출
    const patterns = [
      / - Google Docs$/,
      / - Google Sheets$/,
      / - Google Slides$/,
      / - 구글 문서$/,
      / - 구글 스프레드시트$/,
      / - 구글 프레젠테이션$/
    ];

    for (const pattern of patterns) {
      if (pattern.test(windowTitle)) {
        return windowTitle.replace(pattern, '');
      }
    }

    return windowTitle;
  }

  /**
   * 생산성 사이트 확인
   */
  private isProductiveSite(domain: string): boolean {
    return this.siteCategories.productivity.some(site => domain.includes(site)) ||
           this.siteCategories.development.some(site => domain.includes(site)) ||
           this.siteCategories.education.some(site => domain.includes(site));
  }

  /**
   * 브라우저 정보 변경 확인
   */
  private hasBrowserInfoChanged(newInfo: BrowserInfo): boolean {
    if (!this.currentBrowserInfo) return true;
    
    return (
      this.currentBrowserInfo.browserName !== newInfo.browserName ||
      this.currentBrowserInfo.currentUrl !== newInfo.currentUrl ||
      this.currentBrowserInfo.currentTitle !== newInfo.currentTitle
    );
  }

  /**
   * 브라우저 이벤트 타입 결정
   */
  private determineBrowserEventType(browserInfo: BrowserInfo): BrowserEvent['type'] {
    if (!this.currentBrowserInfo) {
      return 'browser-switch';
    }

    if (this.currentBrowserInfo.browserName !== browserInfo.browserName) {
      return 'browser-switch';
    }

    if (browserInfo.isGoogleDocs && !this.currentBrowserInfo.isGoogleDocs) {
      return 'google-docs-detected';
    }

    if (this.currentBrowserInfo.currentUrl !== browserInfo.currentUrl) {
      return 'navigation';
    }

    return 'tab-change';
  }

  /**
   * 브라우저 이벤트 발생
   */
  private emitBrowserEvent(type: BrowserEvent['type'], browserInfo: BrowserInfo): void {
    const event: BrowserEvent = {
      type,
      browserInfo,
      timestamp: new Date(),
      previousUrl: this.currentBrowserInfo?.currentUrl,
    };

    this.emit('browser-event', event);
    this.emit(type, event);

    Logger.debug(this.componentName, `Browser event: ${type}`, {
      browser: browserInfo.browserName,
      domain: browserInfo.domain,
      category: browserInfo.siteCategory,
    });
  }

  /**
   * 공개 API: 현재 브라우저 정보 반환
   */
  public getCurrentBrowserInfo(): BrowserInfo | null {
    return this.currentBrowserInfo ? { ...this.currentBrowserInfo } : null;
  }

  /**
   * 공개 API: 브라우저 설정 업데이트
   */
  public updateConfig(newConfig: Partial<BrowserConfig>): Result<void> {
    try {
      this.browserConfig = { ...this.browserConfig, ...newConfig };
      
      // 체크 인터벌 업데이트
      if (newConfig.checkInterval && this.isRunning()) {
        this.stopBrowserDetection();
        this.startBrowserDetection();
      }

      Logger.info(this.componentName, 'Browser detector config updated', newConfig);
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to update config', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 공개 API: 지원하는 브라우저 목록 반환
   */
  public getSupportedBrowsers(): string[] {
    return [...this.supportedBrowsers];
  }

  /**
   * 공개 API: 사이트 카테고리 목록 반환
   */
  public getSiteCategories(): SiteCategories {
    return { ...this.siteCategories };
  }

  /**
   * 공개 API: 현재 사이트 생산성 점수 계산
   */
  public calculateProductivityScore(): number {
    if (!this.currentBrowserInfo) return 0;

    const { siteCategory, isGoogleDocs, isProductiveSite } = this.currentBrowserInfo;

    let score = 0;

    // Google Docs는 최고 점수
    if (isGoogleDocs) score += 100;
    
    // 생산성 사이트
    else if (isProductiveSite) score += 85;
    
    // 카테고리별 점수
    else {
      switch (siteCategory) {
        case 'development': score += 90; break;
        case 'education': score += 80; break;
        case 'productivity': score += 85; break;
        case 'news': score += 60; break;
        case 'social': score += 30; break;
        case 'entertainment': score += 20; break;
        case 'shopping': score += 25; break;
        default: score += 50; break;
      }
    }

    return Math.min(100, Math.max(0, score));
  }
}

// 🔥 기가차드 전역 브라우저 감지자
export const browserDetector = new BrowserDetector();

// #DEBUG: Browser detector module exit point
Logger.debug('BROWSER_DETECTOR', 'Browser detector module setup complete');

export default browserDetector;
