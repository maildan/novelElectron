'use client';

import { Bell, Search, User, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useState } from 'react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - macOS 스타일
const HEADER_STYLES = {
  container: 'h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-6 z-80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60',
  leftSection: 'flex items-center space-x-4',
  menuButton: 'lg:hidden',
  searchContainer: 'relative hidden md:block w-96',
  rightSection: 'flex items-center space-x-3',
  notificationButton: 'relative',
  userSection: 'flex items-center space-x-2',
  userName: 'hidden sm:block font-medium text-slate-900 dark:text-slate-100',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
interface AppHeaderProps {
  readonly onMenuToggle?: () => void;
  readonly user?: {
    readonly name: string;
    readonly avatar?: string;
    readonly status?: 'online' | 'away' | 'busy' | 'offline';
  };
  readonly notificationCount?: number;
  readonly onSearch?: (query: string) => void;
  readonly onNotificationClick?: () => void;
  readonly onUserClick?: () => void;
}

export function AppHeader({ 
  onMenuToggle, 
  user = { name: '작가님', status: 'online' },
  notificationCount = 0,
  onSearch,
  onNotificationClick,
  onUserClick,
}: AppHeaderProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (searchQuery.trim()) {
      Logger.info('HEADER', 'Search performed', { query: searchQuery });
      onSearch?.(searchQuery.trim());
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleNotificationClick = (): void => {
    Logger.info('HEADER', 'Notifications clicked', { count: notificationCount });
    onNotificationClick?.();
  };

  const handleUserClick = (): void => {
    Logger.info('HEADER', 'User menu clicked', { user: user.name });
    onUserClick?.();
  };

  const handleMenuToggle = (): void => {
    Logger.info('HEADER', 'Menu toggle clicked');
    onMenuToggle?.();
  };

  return (
    <header className={HEADER_STYLES.container} role="banner">
      {/* 좌측 섹션 */}
      <div className={HEADER_STYLES.leftSection}>
        {/* 모바일 메뉴 버튼 */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            className={HEADER_STYLES.menuButton}
            onClick={handleMenuToggle}
            aria-label="메뉴 토글"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* 검색 */}
        <div className={HEADER_STYLES.searchContainer}>
          <form onSubmit={handleSearch}>
            <SearchInput
              placeholder="프로젝트, 파일 검색..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="검색어 입력"
            />
          </form>
        </div>
      </div>

      {/* 우측 섹션 */}
      <div className={HEADER_STYLES.rightSection}>
        {/* 알림 버튼 */}
        <div className={HEADER_STYLES.notificationButton}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            aria-label={`알림 ${notificationCount}개`}
          >
            <Bell className="w-5 h-5" />
          </Button>
          {notificationCount > 0 && (
            <Badge
              variant="danger"
              size="sm"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </div>

        {/* 사용자 프로필 */}
        <div className={HEADER_STYLES.userSection}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUserClick}
            aria-label="사용자 메뉴"
            className="flex items-center space-x-2 px-2"
          >
            <Avatar
              size="sm"
              src={user.avatar}
              fallback={user.name.charAt(0)}
              status={user.status}
              alt={`${user.name} 프로필`}
            />
            <span className={HEADER_STYLES.userName}>{user.name}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
