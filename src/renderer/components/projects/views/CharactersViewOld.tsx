'use client';

import React, { useState } from 'react';
import { ProjectCharacter } from '../../../../shared/types';
import { Users, Plus, Edit3, UserPlus } from 'lucide-react';

interface CharactersViewProps {
  characters: ProjectCharacter[];
  onCharactersChange: (characters: ProjectCharacter[]) => void;
}

// 🔥 차분하고 전문적인 작가 도구 스타일 (TypeTak 수준)
const CHARACTERS_STYLES = {
  container: 'flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900',
  
  // 🔥 깔끔한 헤더
  header: 'p-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  subtitle: 'text-slate-600 dark:text-slate-400',
  
  // 🔥 컨텐츠 영역
  content: 'flex-1 overflow-y-auto p-6',
  
  // 🔥 간단한 카드 그리드
  characterGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4',
  
  // 🔥 미니멀 카드
  characterCard: 'group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200',
  
  // 🔥 카드 내부 요소들
  characterHeader: 'flex items-start justify-between mb-3',
  characterInfo: 'flex-1',
  characterName: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2',
  
  // 🔥 간단한 역할 배지
  characterRole: 'inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded',
  
  characterNotes: 'text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2',
  
  // 🔥 간단한 추가 버튼
  addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer',
  
  addButtonIcon: 'w-6 h-6 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  addButtonText: 'font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
  
  // 🔥 편집 버튼
  editButton: 'p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors',
} as const;

export function CharactersView({ characters, onCharactersChange }: CharactersViewProps): React.ReactElement {
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
  };

  const handleEditCharacter = (id: string, updates: Partial<ProjectCharacter>): void => {
    const updatedCharacters = characters.map(char => 
      char.id === id 
        ? { ...char, ...updates, updatedAt: new Date() }
        : char
    );
    onCharactersChange(updatedCharacters);
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
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => handleEditCharacter(character.id, { name: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                      className="w-full bg-transparent border-b border-blue-500 outline-none text-lg font-semibold text-slate-900 dark:text-slate-100"
                      autoFocus
                      placeholder="인물 이름"
                    />
                  ) : (
                    <h3 className={CHARACTERS_STYLES.characterName}>{character.name}</h3>
                  )}
                  <span className={CHARACTERS_STYLES.characterRole}>{character.role}</span>
                </div>
                <button
                  onClick={() => setEditingId(character.id)}
                  className={CHARACTERS_STYLES.editButton}
                  aria-label="인물 편집"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className={CHARACTERS_STYLES.characterNotes}>{character.notes}</p>
            </div>
          ))}
          
          {/* 🔥 간단한 추가 버튼 */}
          <div 
            onClick={handleAddCharacter}
            className={CHARACTERS_STYLES.addButton}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleAddCharacter()}
            aria-label="새 인물 추가"
          >
            <UserPlus className={CHARACTERS_STYLES.addButtonIcon} />
            <span className={CHARACTERS_STYLES.addButtonText}>새 인물 추가</span>
          </div>
        </div>
      </div>
    </div>
  );
}
