'use client';

import React from 'react';
import { 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Share2, 
  Trash2,
  Calendar,
  FileText,
  Clock,
  type LucideIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECT_CARD_STYLES = {
  container: 'group hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
  header: 'flex items-start justify-between p-4 pb-2',
  title: 'text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 flex-1 mr-2',
  moreButton: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0',
  content: 'px-4 pb-2',
  description: 'text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3',
  metaSection: 'flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4',
  metaItem: 'flex items-center gap-1',
  progressSection: 'mb-4',
  progressHeader: 'flex items-center justify-between mb-2',
  progressLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  progressValue: 'text-sm text-slate-500 dark:text-slate-400',
  footer: 'px-4 pb-4',
  actionButtons: 'flex items-center gap-2',
  actionButton: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
  statusBadge: 'mb-2',
  icon: 'w-3 h-3',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface ProjectData {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'active' | 'completed' | 'paused' | 'draft';
  readonly progress: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly wordCount?: number;
  readonly author?: string;
  readonly genre?: string;
}

interface ProjectAction {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly variant: 'ghost' | 'outline';
  readonly onClick: (project: ProjectData) => void;
  readonly ariaLabel?: string;
}

export interface ProjectCardProps {
  readonly project: ProjectData;
  readonly onView?: (project: ProjectData) => void;
  readonly onEdit?: (project: ProjectData) => void;
  readonly onShare?: (project: ProjectData) => void;
  readonly onDelete?: (project: ProjectData) => void;
  readonly onMore?: (project: ProjectData) => void;
  readonly showActions?: boolean;
}

export function ProjectCard({
  project,
  onView,
  onEdit,
  onShare,
  onDelete,
  onMore,
  showActions = true
}: ProjectCardProps): React.ReactElement {

  const handleAction = (actionId: string, callback?: (project: ProjectData) => void): void => {
    Logger.info('PROJECT_CARD', `Action triggered: ${actionId}`, { projectId: project.id });
    callback?.(project);
  };

  const getStatusColor = (status: ProjectData['status']): 'success' | 'warning' | 'primary' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'paused': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: ProjectData['status']): string => {
    switch (status) {
      case 'completed': return '완료';
      case 'active': return '진행중';
      case 'paused': return '일시정지';
      case 'draft': return '초안';
      default: return '알 수 없음';
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const projectActions: readonly ProjectAction[] = [
    {
      id: 'view',
      label: '보기',
      icon: Eye,
      variant: 'ghost',
      onClick: (project) => handleAction('view', onView),
      ariaLabel: '프로젝트 보기'
    },
    {
      id: 'edit',
      label: '편집',
      icon: Edit2,
      variant: 'ghost',
      onClick: (project) => handleAction('edit', onEdit),
      ariaLabel: '프로젝트 편집'
    },
    {
      id: 'share',
      label: '공유',
      icon: Share2,
      variant: 'ghost',
      onClick: (project) => handleAction('share', onShare),
      ariaLabel: '프로젝트 공유'
    },
    {
      id: 'delete',
      label: '삭제',
      icon: Trash2,
      variant: 'ghost',
      onClick: (project) => handleAction('delete', onDelete),
      ariaLabel: '프로젝트 삭제'
    }
  ] as const;

  return (
    <Card 
      className={PROJECT_CARD_STYLES.container}
      role="article"
      aria-label={`프로젝트: ${project.title}`}
    >
      {/* 헤더 */}
      <div className={PROJECT_CARD_STYLES.header}>
        <h3 className={PROJECT_CARD_STYLES.title}>{project.title}</h3>
        {showActions && onMore && (
          <Tooltip content="더 보기" side="top">
            <Button
              variant="ghost"
              size="sm"
              className={PROJECT_CARD_STYLES.moreButton}
              onClick={() => handleAction('more', onMore)}
              aria-label="프로젝트 옵션 더 보기"
            >
              <MoreHorizontal className={PROJECT_CARD_STYLES.icon} />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className={PROJECT_CARD_STYLES.content}>
        {/* 상태 배지 */}
        <div className={PROJECT_CARD_STYLES.statusBadge}>
          <Badge 
            variant={getStatusColor(project.status)} 
            size="sm"
          >
            {getStatusText(project.status)}
          </Badge>
        </div>

        {/* 설명 */}
        <p className={PROJECT_CARD_STYLES.description}>
          {project.description}
        </p>

        {/* 메타 정보 */}
        <div className={PROJECT_CARD_STYLES.metaSection}>
          <div className={PROJECT_CARD_STYLES.metaItem}>
            <Calendar className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          {project.wordCount && (
            <div className={PROJECT_CARD_STYLES.metaItem}>
              <FileText className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
              <span>{formatNumber(project.wordCount)}자</span>
            </div>
          )}
          <div className={PROJECT_CARD_STYLES.metaItem}>
            <Clock className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
            <span>{formatDate(project.updatedAt)}</span>
          </div>
        </div>

        {/* 진행률 */}
        <div className={PROJECT_CARD_STYLES.progressSection}>
          <div className={PROJECT_CARD_STYLES.progressHeader}>
            <span className={PROJECT_CARD_STYLES.progressLabel}>진행률</span>
            <span className={PROJECT_CARD_STYLES.progressValue}>
              {Math.round(project.progress)}%
            </span>
          </div>
          <ProgressBar 
            value={project.progress} 
            size="sm"
            color={project.progress >= 100 ? 'green' : 'blue'}
            aria-label={`프로젝트 진행률 ${Math.round(project.progress)}%`}
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      {showActions && (
        <div className={PROJECT_CARD_STYLES.footer}>
          <div className={PROJECT_CARD_STYLES.actionButtons}>
            {projectActions.map((action) => {
              const Icon = action.icon;
              return (
                <Tooltip key={action.id} content={action.label} side="top">
                  <Button
                    variant={action.variant}
                    size="sm"
                    className={PROJECT_CARD_STYLES.actionButton}
                    onClick={() => action.onClick(project)}
                    aria-label={action.ariaLabel}
                  >
                    <Icon className={PROJECT_CARD_STYLES.icon} />
                  </Button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
