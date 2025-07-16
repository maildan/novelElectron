'use client';

// 스토리 뷰 쓰고있음

import React, { useState } from 'react';
import { ProjectStructure } from '../../../../shared/types';
import { FileText, Hash, Bookmark, Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

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
  structureItem: 'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
  itemIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
  itemContent: 'flex-1',
  itemTitle: 'font-medium text-gray-900 dark:text-gray-100',
  itemType: 'text-xs text-gray-500 dark:text-gray-400',
  itemActions: 'flex items-center gap-2',
  actionButton: 'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
  
  // 추가 메뉴
  addMenuContainer: 'relative',
  addButton: 'flex items-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors',
  addMenu: 'absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10',
  addMenuItem: 'flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg',
  
  // 편집 모드
  editInput: 'w-full px-2 py-1 border border-blue-400 rounded text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
} as const;

// 타입별 아이콘 매핑
const TYPE_ICONS = {
  chapter: Hash,
  scene: FileText,
  note: Bookmark,
} as const;

// 추가 메뉴 아이템
const ADD_MENU_ITEMS = [
  { type: 'chapter', label: '새 장', icon: Hash, description: '스토리의 큰 단위' },
  { type: 'scene', label: '새 장면', icon: FileText, description: '장 안의 세부 구성' },
  { type: 'note', label: '새 메모', icon: Bookmark, description: '아이디어와 참고사항' },
] as const;

export function StructureView({ structure, onStructureChange }: StructureViewProps): React.ReactElement {
  
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  
  const handleAddItem = (type: 'chapter' | 'scene' | 'note'): void => {
    const defaultTitles = {
      chapter: `${structure.filter(item => item.type === 'chapter').length + 1}장`,
      scene: '새 장면',
      note: '새 메모'
    };
    
    const newItem: ProjectStructure = {
      id: Date.now().toString(),
      projectId: structure[0]?.projectId || '',
      type,
      title: defaultTitles[type],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    onStructureChange([...structure, newItem]);
    setShowAddMenu(false);
  };

  const handleEditStart = (item: ProjectStructure): void => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleEditSave = (id: string): void => {
    if (editTitle.trim()) {
      const updatedStructure = structure.map(item => 
        item.id === id 
          ? { ...item, title: editTitle.trim(), updatedAt: new Date() }
          : item
      );
      onStructureChange(updatedStructure);
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = (): void => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: string): void => {
    const updatedStructure = structure.filter(item => item.id !== id);
    onStructureChange(updatedStructure);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string): void => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
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
            const isEditing = editingId === item.id;
            
            return (
              <div key={item.id} className={STRUCTURE_STYLES.structureItem}>
                <IconComponent className={STRUCTURE_STYLES.itemIcon} />
                <div className={STRUCTURE_STYLES.itemContent}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, item.id)}
                      onBlur={() => handleEditSave(item.id)}
                      className={STRUCTURE_STYLES.editInput}
                      autoFocus
                    />
                  ) : (
                    <>
                      <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                      <div className={STRUCTURE_STYLES.itemType}>
                        {item.type === 'chapter' ? '장' : 
                         item.type === 'scene' ? '장면' : '메모'}
                      </div>
                    </>
                  )}
                </div>
                <div className={STRUCTURE_STYLES.itemActions}>
                  <button
                    onClick={() => handleEditStart(item)}
                    className={STRUCTURE_STYLES.actionButton}
                    title="편집"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={STRUCTURE_STYLES.actionButton}
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* 추가 메뉴 */}
          <div className={STRUCTURE_STYLES.addMenuContainer}>
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={STRUCTURE_STYLES.addButton}
            >
              <Plus className="w-5 h-5" />
              <span>새 항목 추가</span>
              {showAddMenu ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {showAddMenu && (
              <div className={STRUCTURE_STYLES.addMenu}>
                {ADD_MENU_ITEMS.map(({ type, label, icon: Icon, description }) => (
                  <div
                    key={type}
                    onClick={() => handleAddItem(type)}
                    className={STRUCTURE_STYLES.addMenuItem}
                  >
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
