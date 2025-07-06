'use client';

import React, { useState } from 'react';
import { ProjectNote } from '../../../../shared/types';
import { BookOpen, Plus, StickyNote, Lightbulb, Target } from 'lucide-react';

interface NotesViewProps {
  projectId: string;
  onNotesChange?: (notes: ProjectNote[]) => void;
}

// 🔥 차분하고 전문적인 노트 스타일
const NOTES_STYLES = {
  container: 'flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900',
  
  // 🔥 깔끔한 헤더
  header: 'p-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  subtitle: 'text-slate-600 dark:text-slate-400',
  
  // 🔥 컨텐츠 영역
  content: 'flex-1 overflow-y-auto p-6',
  
  // 🔥 간단한 노트 그리드
  notesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  
  // 🔥 미니멀 노트 카드
  noteCard: 'group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200',
  
  noteHeader: 'flex items-center gap-3 mb-3',
  noteIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
  noteTitle: 'font-semibold text-slate-900 dark:text-slate-100',
  noteContent: 'text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap line-clamp-3',
  noteDate: 'text-xs text-slate-500 dark:text-slate-500 mt-3',
  
  // 🔥 간단한 추가 버튼
  addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer min-h-[150px]',
  addButtonIcon: 'w-6 h-6 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  addButtonText: 'font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
  addButtonSubtext: 'text-sm text-slate-500 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  
  // 🔥 타입 버튼
  typeButtons: 'flex gap-2 mb-6 flex-wrap',
  typeButton: 'flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
  typeButtonActive: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
} as const;

// 기본 메모 데이터
const DEFAULT_NOTES: ProjectNote[] = [
  {
    id: '1',
    projectId: '',
    title: '💡 핵심 아이디어',
    content: '• 주인공의 숨겨진 과거\n• 반전 포인트 3개\n• 감정적 클라이맥스',
    type: 'idea',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    projectId: '',
    title: '🎯 스토리 목표',
    content: '독자가 느껴야 할 감정:\n- 긴장감\n- 경이로움\n- 카타르시스',
    type: 'goal',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    projectId: '',
    title: '📝 참고 자료',
    content: '• 관련 영화: 인셉션, 매트릭스\n• 참고 소설: 1984\n• 연구 자료: 인공지능 윤리학',
    type: 'reference',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const NOTE_TYPES = [
  { id: 'idea', label: '아이디어', icon: Lightbulb },
  { id: 'goal', label: '목표', icon: Target },
  { id: 'reference', label: '참고', icon: BookOpen },
];

export function NotesView({ projectId, onNotesChange }: NotesViewProps): React.ReactElement {
  const [notes, setNotes] = useState<ProjectNote[]>(
    DEFAULT_NOTES.map(note => ({ ...note, projectId }))
  );
  const [selectedType, setSelectedType] = useState<string>('idea');
  
  const handleAddNote = (): void => {
    const newNote: ProjectNote = {
      id: Date.now().toString(),
      projectId,
      title: '새 메모',
      content: '여기에 메모를 작성하세요...',
      type: selectedType as 'idea' | 'goal' | 'reference',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    onNotesChange?.(updatedNotes);
  };

  const getTypeIcon = (type: string) => {
    const noteType = NOTE_TYPES.find(t => t.id === type);
    return noteType?.icon || StickyNote;
  };

  return (
    <div className={NOTES_STYLES.container}>
      {/* 🔥 깔끔한 헤더 */}
      <div className={NOTES_STYLES.header}>
        <h2 className={NOTES_STYLES.title}>작가 노트</h2>
        <p className={NOTES_STYLES.subtitle}>
          아이디어, 참고 자료, 메모를 정리하세요
        </p>
      </div>
      
      {/* 🔥 노트 타입 선택 */}
      <div className="px-6 pt-6">
        <div className={NOTES_STYLES.typeButtons}>
          {NOTE_TYPES.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`${NOTES_STYLES.typeButton} ${
                  selectedType === type.id ? NOTES_STYLES.typeButtonActive : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 🔥 모던 노트 목록 */}
      <div className={NOTES_STYLES.content}>
        <div className={NOTES_STYLES.notesGrid}>
          {notes
            .filter(note => !selectedType || note.type === selectedType)
            .map((note) => {
              const IconComponent = getTypeIcon(note.type || 'idea');
              
              return (
                <div key={note.id} className={NOTES_STYLES.noteCard}>
                  <div className={NOTES_STYLES.noteHeader}>
                    <div className={NOTES_STYLES.noteIcon}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className={NOTES_STYLES.noteTitle}>{note.title}</h3>
                  </div>
                  <p className={NOTES_STYLES.noteContent}>{note.content}</p>
                  <p className={NOTES_STYLES.noteDate}>
                    {note.createdAt.toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              );
            })}
          
          {/* 🔥 모던 추가 버튼 */}
          <div 
            onClick={handleAddNote}
            className={NOTES_STYLES.addButton}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleAddNote()}
            aria-label="새 메모 추가"
          >
            <Plus className={NOTES_STYLES.addButtonIcon} />
            <span className={NOTES_STYLES.addButtonText}>새 메모 추가</span>
            <span className={NOTES_STYLES.addButtonSubtext}>
              ({NOTE_TYPES.find(t => t.id === selectedType)?.label})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
