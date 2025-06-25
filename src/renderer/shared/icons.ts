/**
 * 🔥 기가차드 공통 아이콘 모듈
 * Loop Typing Analytics - Common Icons Module
 */

import React from 'react';

// #DEBUG: 모든 아이콘을 한 곳에서 export
export {
  // Layout & Navigation
  Menu,
  X,
  Home,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  
  // Actions
  Play,
  Pause,
  Plus,
  Send,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  Edit,
  Trash2 as Delete,
  Copy,
  Share,
  
  // Data & Analytics
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Calendar,
  
  // Status & UI
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Loader,
  
  // Tech & Apps
  Globe,
  Cloud,
  FileText,
  FolderOpen,
  Brain,
  Sparkles,
  Zap,
  
  // User & Social
  User,
  Users,
  Heart,
  Star,
  
  // Communication
  MessageSquare,
  MessageCircle,
  Mail,
  Phone,
  
  // Media
  Image,
  Video,
  Music,
  
} from 'lucide-react';

// #DEBUG: 아이콘 크기 프리셋
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// #DEBUG: 공통 아이콘 Props 타입
export type IconSize = keyof typeof iconSizes;

// #DEBUG: 사이즈 헬퍼 함수
export const getIconSize = (size: IconSize | number = 'md'): number => {
  return typeof size === 'string' ? iconSizes[size] : size;
};
