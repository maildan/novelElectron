'use client';

import React, { useState } from 'react';
import { ProjectCharacter } from '../../../../shared/types';
import { Plus, Edit3, Save, X } from 'lucide-react';
import { Logger } from '../../../../shared/logger';

interface CharactersViewProps {
  characters: ProjectCharacter[];
  onCharactersChange: (characters: ProjectCharacter[]) => void;
}

// 🔥 차분하고 전문적인 작가 도구 스타일 (11원칙 준수)
const CHARACTERS_STYLES = {
  container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
  
  // 🔥 깔끔한 헤더
  header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
  title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  subtitle: 'text-gray-600 dark:text-gray-400',
  
  // 🔥 컨텐츠 영역
  content: 'flex-1 overflow-y-auto p-6',
  
  // 🔥 간단한 카드 그리드
  characterGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4',
  
  // 🔥 미니멀 카드
  characterCard: 'group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
  
  // 🔥 카드 내부 요소들
  characterHeader: 'flex items-start justify-between mb-3',
  characterInfo: 'flex-1',
  characterName: 'text-lg font-medium text-gray-900 dark:text-gray-100 mb-1',
  
  // 🔥 간단한 역할 배지
  characterRole: 'inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded',
  
  characterNotes: 'text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3',
  
  // 🔥 간단한 추가 버튼
  addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer',
  
  addButtonIcon: 'w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  addButtonText: 'text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
  
  // 🔥 편집 버튼
  editButton: 'p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors',
  saveButton: 'p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors',
  cancelButton: 'p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors',
  
  // 🔥 편집 인풋
  editInput: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
  editTextarea: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none',
} as const;

export function CharactersView({ characters, onCharactersChange }: CharactersViewProps): React.ReactElement {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectCharacter>>({});
  
  const handleAddCharacter = (): void => {
    const newCharacter: ProjectCharacter = {
      id: Date.now().toString(),
      projectId: characters[0]?.projectId || '',
      name: '새 인물',
      role: '역할 미정',
      notes: '인물에 대한 설명을 추가하세요.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    onCharactersChange([...characters, newCharacter]);
    setEditingId(newCharacter.id);
    setEditForm(newCharacter);
    Logger.info('CHARACTERS_VIEW', 'New character added', { id: newCharacter.id });
  };

  const handleEditStart = (character: ProjectCharacter): void => {
    setEditingId(character.id);
    setEditForm(character);
    Logger.debug('CHARACTERS_VIEW', 'Edit started', { id: character.id });
  };

  const handleEditSave = (): void => {
    if (!editingId || !editForm) return;
    
    const updatedCharacters = characters.map(char => 
      char.id === editingId 
        ? { ...char, ...editForm, updatedAt: new Date() }
        : char
    );
    
    onCharactersChange(updatedCharacters);
    setEditingId(null);
    setEditForm({});
    Logger.info('CHARACTERS_VIEW', 'Character updated', { id: editingId });
  };

  const handleEditCancel = (): void => {
    setEditingId(null);
    setEditForm({});
    Logger.debug('CHARACTERS_VIEW', 'Edit cancelled');
  };

  const handleDelete = (id: string): void => {
    const updatedCharacters = characters.filter(char => char.id !== id);
    onCharactersChange(updatedCharacters);
    Logger.info('CHARACTERS_VIEW', 'Character deleted', { id });
  };

  return (
    <div className={CHARACTERS_STYLES.container}>
      {/* 🔥 깔끔한 헤더 */}
      <div className={CHARACTERS_STYLES.header}>
        <h2 className={CHARACTERS_STYLES.title}>등장인물</h2>
        <p className={CHARACTERS_STYLES.subtitle}>
          이야기의 등장인물들을 정리하고 관리하세요
        </p>
      </div>
      
      {/* 🔥 캐릭터 목록 */}
      <div className={CHARACTERS_STYLES.content}>
        <div className={CHARACTERS_STYLES.characterGrid}>
          {characters.map((character) => (
            <div key={character.id} className={CHARACTERS_STYLES.characterCard}>
              <div className={CHARACTERS_STYLES.characterHeader}>
                <div className={CHARACTERS_STYLES.characterInfo}>
                  {editingId === character.id ? (
                    // 🔥 편집 모드
                    <>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className={CHARACTERS_STYLES.editInput}
                        placeholder="인물 이름"
                      />
                      <input
                        type="text"
                        value={editForm.role || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                        className={`${CHARACTERS_STYLES.editInput} mt-2`}
                        placeholder="역할"
                      />
                      <textarea
                        value={editForm.notes || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                        className={`${CHARACTERS_STYLES.editTextarea} mt-2`}
                        placeholder="인물 설명"
                        rows={3}
                      />
                    </>
                  ) : (
                    // 🔥 표시 모드
                    <>
                      <h3 className={CHARACTERS_STYLES.characterName}>{character.name}</h3>
                      <span className={CHARACTERS_STYLES.characterRole}>{character.role}</span>
                      <p className={CHARACTERS_STYLES.characterNotes}>{character.notes}</p>
                    </>
                  )}
                </div>
                
                {/* 🔥 액션 버튼들 */}
                <div className="flex gap-1">
                  {editingId === character.id ? (
                    <>
                      <button
                        onClick={handleEditSave}
                        className={CHARACTERS_STYLES.saveButton}
                        title="저장"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className={CHARACTERS_STYLES.cancelButton}
                        title="취소"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditStart(character)}
                      className={CHARACTERS_STYLES.editButton}
                      title="편집"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* 🔥 추가 버튼 */}
          <button 
            onClick={handleAddCharacter}
            className={CHARACTERS_STYLES.addButton}
          >
            <Plus className={CHARACTERS_STYLES.addButtonIcon} />
            <span className={CHARACTERS_STYLES.addButtonText}>새 인물 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
