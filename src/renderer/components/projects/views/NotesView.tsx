'use client';

// 노트 뷰 쓰고있음
 
import React, { useState } from 'react';
import { ProjectNote } from '../../../../shared/types';
import { Plus, Edit3, Save, X as XIcon, Lightbulb, Target, BookOpen } from 'lucide-react';
import { Logger } from '../../../../shared/logger';

interface NotesViewProps {
  projectId: string;
  notes?: ProjectNote[];
  onNotesChange?: (notes: ProjectNote[]) => void;
}

// 🔥 차분하고 전문적인 노트 스타일 (11원칙 준수)
const NOTES_STYLES = {
  container: 'flex-1 overflow-hidden bg-white dark:bg-gray-900',
  
  // 🔥 깔끔한 헤더
  header: 'p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
  title: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  subtitle: 'text-gray-600 dark:text-gray-400',
  
  // 🔥 컨텐츠 영역
  content: 'flex-1 overflow-y-auto p-6',
  
  // 🔥 타입 필터
  typeButtons: 'flex gap-2 mb-6 flex-wrap',
  typeButton: 'flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
  typeButtonActive: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
  
  // 🔥 간단한 노트 그리드
  notesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  
  // 🔥 미니멀 노트 카드
  noteCard: 'group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
  
  noteHeader: 'flex items-center gap-3 mb-3',
  noteIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400',
  noteTitle: 'font-medium text-gray-900 dark:text-gray-100 flex-1',
  noteContent: 'text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap line-clamp-4',
  noteDate: 'text-xs text-gray-500 dark:text-gray-500 mt-3',
  
  // 🔥 간단한 추가 버튼
  addButton: 'group flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer min-h-[150px]',
  addButtonIcon: 'w-6 h-6 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  addButtonText: 'font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
  addButtonSubtext: 'text-sm text-gray-500 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  
  // 🔥 편집 버튼
  editButton: 'p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors',
  saveButton: 'p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors',
  cancelButton: 'p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors',
  
  // 🔥 편집 인풋
  editInput: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
  editTextarea: 'w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none',
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

export function NotesView({ projectId, notes: propNotes, onNotesChange }: NotesViewProps): React.ReactElement {
  const [notes, setNotes] = useState<ProjectNote[]>(
    propNotes || DEFAULT_NOTES.map(note => ({ ...note, projectId }))
  );
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectNote>>({});
  
  const handleAddNote = (): void => {
    const newNote: ProjectNote = {
      id: Date.now().toString(),
      projectId,
      title: '새 메모',
      content: '여기에 메모를 작성하세요...',
      type: selectedType === 'all' ? 'idea' : selectedType as 'idea' | 'goal' | 'reference',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setEditingId(newNote.id);
    setEditForm(newNote);
    
    if (onNotesChange) {
      onNotesChange(updatedNotes);
    }
    
    Logger.info('NOTES_VIEW', 'New note added', { id: newNote.id });
  };

  const handleEditStart = (note: ProjectNote): void => {
    setEditingId(note.id);
    setEditForm(note);
    Logger.debug('NOTES_VIEW', 'Edit started', { id: note.id });
  };

  const handleEditSave = (): void => {
    if (!editingId || !editForm) return;
    
    const updatedNotes = notes.map(note => 
      note.id === editingId 
        ? { ...note, ...editForm, updatedAt: new Date() }
        : note
    );
    
    setNotes(updatedNotes);
    setEditingId(null);
    setEditForm({});
    
    if (onNotesChange) {
      onNotesChange(updatedNotes);
    }
    
    Logger.info('NOTES_VIEW', 'Note updated', { id: editingId });
  };

  const handleEditCancel = (): void => {
    setEditingId(null);
    setEditForm({});
    Logger.debug('NOTES_VIEW', 'Edit cancelled');
  };

  const getTypeIcon = (type: string | undefined) => {
    const noteType = NOTE_TYPES.find(t => t.id === type);
    return noteType ? noteType.icon : Lightbulb;
  };

  const filteredNotes = selectedType === 'all' 
    ? notes 
    : notes.filter(note => note.type === selectedType);

  return (
    <div className={NOTES_STYLES.container}>
      {/* 🔥 깔끔한 헤더 */}
      <div className={NOTES_STYLES.header}>
        <h2 className={NOTES_STYLES.title}>작가 노트</h2>
        <p className={NOTES_STYLES.subtitle}>
          아이디어, 목표, 참고 자료를 체계적으로 정리하세요
        </p>
      </div>
      
      {/* 🔥 노트 목록 */}
      <div className={NOTES_STYLES.content}>
        {/* 🔥 타입 필터 */}
        <div className={NOTES_STYLES.typeButtons}>
          <button
            onClick={() => setSelectedType('all')}
            className={`${NOTES_STYLES.typeButton} ${
              selectedType === 'all' ? NOTES_STYLES.typeButtonActive : ''
            }`}
          >
            전체
          </button>
          {NOTE_TYPES.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`${NOTES_STYLES.typeButton} ${
                  selectedType === type.id ? NOTES_STYLES.typeButtonActive : ''
                }`}
              >
                <IconComponent size={16} />
                {type.label}
              </button>
            );
          })}
        </div>

        <div className={NOTES_STYLES.notesGrid}>
          {filteredNotes.map((note) => {
            const IconComponent = getTypeIcon(note.type);
            
            return (
              <div key={note.id} className={NOTES_STYLES.noteCard}>
                <div className={NOTES_STYLES.noteHeader}>
                  <IconComponent className={NOTES_STYLES.noteIcon} />
                  {editingId === note.id ? (
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className={NOTES_STYLES.editInput}
                      placeholder="메모 제목"
                    />
                  ) : (
                    <h3 className={NOTES_STYLES.noteTitle}>{note.title}</h3>
                  )}
                  
                  {/* 🔥 액션 버튼들 */}
                  <div className="flex gap-1">
                    {editingId === note.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className={NOTES_STYLES.saveButton}
                          title="저장"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className={NOTES_STYLES.cancelButton}
                          title="취소"
                        >
                          <XIcon size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditStart(note)}
                        className={NOTES_STYLES.editButton}
                        title="편집"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {editingId === note.id ? (
                  <textarea
                    value={editForm.content || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                    className={NOTES_STYLES.editTextarea}
                    placeholder="메모 내용"
                    rows={6}
                  />
                ) : (
                  <p className={NOTES_STYLES.noteContent}>{note.content}</p>
                )}
                
                <div className={NOTES_STYLES.noteDate}>
                  {note.updatedAt.toLocaleDateString()}
                </div>
              </div>
            );
          })}
          
          {/* 🔥 추가 버튼 */}
          <button 
            onClick={handleAddNote}
            className={NOTES_STYLES.addButton}
          >
            <Plus className={NOTES_STYLES.addButtonIcon} />
            <span className={NOTES_STYLES.addButtonText}>새 메모 추가</span>
            <span className={NOTES_STYLES.addButtonSubtext}>
              {selectedType === 'all' ? '아이디어를' : NOTE_TYPES.find(t => t.id === selectedType)?.label + '를'} 기록하세요
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
