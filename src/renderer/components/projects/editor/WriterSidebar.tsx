'use client';

import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import {
  Plus,
  ChevronLeft,
  Bookmark,
  FileText,
  Lightbulb,
  Users
} from 'lucide-react';

interface StructureItem {
  id: string;
  type: 'chapter' | 'scene' | 'note' | 'act' | 'section';
  title: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  notes?: string;
}

interface WriterSidebarProps {
  showLeftSidebar: boolean;
  toggleLeftSidebar: () => void;
  structure: StructureItem[];
  characters: Character[];
  onAddStructure?: () => void;
  onAddCharacter?: () => void;
  onAddNote?: () => void;
}

const SIDEBAR_STYLES = {
  leftSidebar: 'w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out',
  leftSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  leftSidebarHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800',
  leftSidebarTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  leftSidebarSectionTitle: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  structureItem: 'flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors',
  structureIcon: 'w-4 h-4 text-slate-500 dark:text-slate-400',
  structureTitle: 'text-sm text-slate-700 dark:text-slate-300 truncate',
  characterItem: 'flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors',
  characterAvatar: 'w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium',
  characterName: 'text-sm font-medium text-slate-700 dark:text-slate-300',
} as const;

export function WriterSidebar({
  showLeftSidebar,
  toggleLeftSidebar,
  structure,
  characters,
  onAddStructure,
  onAddCharacter,
  onAddNote
}: WriterSidebarProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'structure' | 'characters' | 'notes'>('structure');

  return (
    <div className={showLeftSidebar ? SIDEBAR_STYLES.leftSidebar : SIDEBAR_STYLES.leftSidebarCollapsed}>
      <div className={SIDEBAR_STYLES.leftSidebarHeader}>
        <h2 className={SIDEBAR_STYLES.leftSidebarTitle}>프로젝트 구성</h2>
        <button className={SIDEBAR_STYLES.iconButton} onClick={toggleLeftSidebar}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'structure' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setActiveTab('structure')}
        >
          구조
        </button>
        <button 
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'characters' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setActiveTab('characters')}
        >
          인물
        </button>
        <button 
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'notes' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setActiveTab('notes')}
        >
          메모
        </button>
      </div>
      
      {/* 구조 탭 */}
      {activeTab === 'structure' && (
        <div className="overflow-y-auto h-full p-2">
          <div className="flex justify-between items-center px-2 py-1">
            <h3 className={SIDEBAR_STYLES.leftSidebarSectionTitle}>챕터 & 장면</h3>
            <button className={SIDEBAR_STYLES.iconButton} onClick={onAddStructure}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {structure.map(item => (
            <div key={item.id} className={SIDEBAR_STYLES.structureItem}>
              {item.type === 'chapter' ? (
                <Bookmark className={SIDEBAR_STYLES.structureIcon} />
              ) : item.type === 'scene' ? (
                <FileText className={SIDEBAR_STYLES.structureIcon} />
              ) : (
                <Lightbulb className={SIDEBAR_STYLES.structureIcon} />
              )}
              <span className={SIDEBAR_STYLES.structureTitle}>{item.title}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* 인물 탭 */}
      {activeTab === 'characters' && (
        <div className="overflow-y-auto h-full p-2">
          <div className="flex justify-between items-center px-2 py-1">
            <h3 className={SIDEBAR_STYLES.leftSidebarSectionTitle}>등장인물</h3>
            <button className={SIDEBAR_STYLES.iconButton} onClick={onAddCharacter}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {characters.map(character => (
            <div key={character.id} className={SIDEBAR_STYLES.characterItem}>
              <div className={SIDEBAR_STYLES.characterAvatar}>
                {character.name.charAt(0)}
              </div>
              <div className="flex-1 ml-2">
                <div className={SIDEBAR_STYLES.characterName}>{character.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{character.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 메모 탭 */}
      {activeTab === 'notes' && (
        <div className="overflow-y-auto h-full p-2">
          <div className="flex justify-between items-center px-2 py-1">
            <h3 className={SIDEBAR_STYLES.leftSidebarSectionTitle}>메모 & 아이디어</h3>
            <button className={SIDEBAR_STYLES.iconButton} onClick={onAddNote}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
            <Lightbulb className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p>영감이 떠오를 때 메모해두세요</p>
            <Button size="sm" className="mt-2" onClick={onAddNote}>
              <Plus className="w-4 h-4 mr-1" />
              새 메모
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
