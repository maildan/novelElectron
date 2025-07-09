'use client';

// 스토리 뷰 쓰고있음

import React from 'react';
import { ProjectStructure } from '../../../../shared/types';
import { FileText, Hash, Bookmark, Plus } from 'lucide-react';

interface StructureViewProps {
  structure: ProjectStructure[];
  onStructureChange: (structure: ProjectStructure[]) => void;
}

// 🔥 차분하고 전문적인 구조 스타일 (11원칙 준수)
const STRUCTURE_STYLES = {
  container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
  header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
  title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  subtitle: 'text-gray-600 dark:text-gray-400',
  content: 'flex-1 overflow-y-auto p-6',
  
  // 구조 아이템
  structureList: 'space-y-2',
  structureItem: 'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer',
  itemIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
  itemContent: 'flex-1',
  itemTitle: 'font-medium text-gray-900 dark:text-gray-100',
  itemType: 'text-xs text-gray-500 dark:text-gray-400',
  
  // 추가 버튼
  addButton: 'flex items-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors',
} as const;

// 타입별 아이콘 매핑
const TYPE_ICONS = {
  chapter: Hash,
  scene: FileText,
  note: Bookmark,
} as const;

export function StructureView({ structure, onStructureChange }: StructureViewProps): React.ReactElement {
  
  const handleAddItem = (): void => {
    const newItem: ProjectStructure = {
      id: Date.now().toString(),
      projectId: structure[0]?.projectId || '',
      type: 'scene',
      title: '새 장면',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    onStructureChange([...structure, newItem]);
  };

  return (
    <div className={STRUCTURE_STYLES.container}>
      {/* 헤더 */}
      <div className={STRUCTURE_STYLES.header}>
        <h2 className={STRUCTURE_STYLES.title}>스토리 구조</h2>
        <p className={STRUCTURE_STYLES.subtitle}>
          장, 장면, 메모를 관리하여 이야기의 흐름을 구성하세요
        </p>
      </div>
      
      {/* 구조 목록 */}
      <div className={STRUCTURE_STYLES.content}>
        <div className={STRUCTURE_STYLES.structureList}>
          {structure.map((item) => {
            const IconComponent = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || FileText;
            
            return (
              <div key={item.id} className={STRUCTURE_STYLES.structureItem}>
                <IconComponent className={STRUCTURE_STYLES.itemIcon} />
                <div className={STRUCTURE_STYLES.itemContent}>
                  <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                  <div className={STRUCTURE_STYLES.itemType}>
                    {item.type === 'chapter' ? '장' : 
                     item.type === 'scene' ? '장면' : '메모'}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* 추가 버튼 */}
          <button 
            onClick={handleAddItem}
            className={STRUCTURE_STYLES.addButton}
          >
            <Plus className="w-5 h-5" />
            <span>새 항목 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
