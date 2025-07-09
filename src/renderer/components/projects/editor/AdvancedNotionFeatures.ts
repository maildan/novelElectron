// 🔥 TipTap 에디터에 추가할 노션 기능들
// src/renderer/components/projects/editor/AdvancedNotionFeatures.ts

import { Node, Mark } from '@tiptap/core';

// 1. 체크박스 확장
export const TaskList = Node.create({
  name: 'taskList',
  group: 'block',
  content: 'taskItem+',
  parseHTML() {
    return [{ tag: 'ul[data-type="taskList"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['ul', { 'data-type': 'taskList', ...HTMLAttributes }, 0];
  },
});

export const TaskItem = Node.create({
  name: 'taskItem',
  content: 'paragraph block*',
  defining: true,
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-checked') === 'true',
        renderHTML: (attributes: any) => ({
          'data-checked': attributes.checked,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'li[data-type="taskItem"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['li', { 'data-type': 'taskItem', ...HTMLAttributes }, 0];
  },
});

// 2. 콜아웃 확장
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      type: {
        default: 'info',
        renderHTML: (attributes: any) => ({
          'data-type': attributes.type,
        }),
      },
      icon: {
        default: '💡',
        renderHTML: (attributes: any) => ({
          'data-icon': attributes.icon,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-callout': true, ...HTMLAttributes }, 0];
  },
});

// 3. 토글 확장
export const Toggle = Node.create({
  name: 'toggle',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      open: {
        default: false,
        renderHTML: (attributes: any) => ({
          'data-open': attributes.open,
        }),
      },
      summary: {
        default: '토글 제목',
        renderHTML: (attributes: any) => ({
          'data-summary': attributes.summary,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'details[data-toggle]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['details', { 'data-toggle': true, ...HTMLAttributes }, 
      ['summary', {}, HTMLAttributes['data-summary'] || '토글 제목'],
      ['div', { class: 'toggle-content' }, 0]
    ];
  },
});

// 4. 하이라이트 확장
export const Highlight = Mark.create({
  name: 'highlight',
  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-color'),
        renderHTML: (attributes: any) => {
          if (!attributes.color) {
            return {};
          }
          return {
            'data-color': attributes.color,
          };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'mark[data-highlight]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', { 'data-highlight': true, ...HTMLAttributes }, 0];
  },
});

// 5. 확장된 슬래시 커맨드
export const extendedSlashCommands = [
  {
    title: '체크박스',
    description: '☑️ 할 일 목록',
    icon: '☑️',
    searchTerms: ['checkbox', 'todo', 'task', '체크', '할일'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .toggleTaskList()
        .run();
    },
  },
  {
    title: '콜아웃 - 정보',
    description: '💡 정보 강조',
    icon: '💡',
    searchTerms: ['callout', 'info', '콜아웃', '정보'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'info', icon: '💡' })
        .run();
    },
  },
  {
    title: '콜아웃 - 경고',
    description: '⚠️ 경고 메시지',
    icon: '⚠️',
    searchTerms: ['warning', 'caution', '경고', '주의'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'warning', icon: '⚠️' })
        .run();
    },
  },
  {
    title: '콜아웃 - 에러',
    description: '❌ 에러 메시지',
    icon: '❌',
    searchTerms: ['error', 'danger', '에러', '오류'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'error', icon: '❌' })
        .run();
    },
  },
  {
    title: '토글',
    description: '▼ 접을 수 있는 섹션',
    icon: '▼',
    searchTerms: ['toggle', 'collapse', '토글', '접기'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setToggle({ summary: '토글 제목', open: false })
        .run();
    },
  },
  {
    title: '하이라이트',
    description: '🖍️ 텍스트 강조',
    icon: '🖍️',
    searchTerms: ['highlight', 'mark', '하이라이트', '강조'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent('하이라이트 텍스트')
        .selectTextblockEnd()
        .setHighlight({ color: 'yellow' })
        .run();
    },
  },
  {
    title: '수식',
    description: '🔢 LaTeX 수식',
    icon: '🔢',
    searchTerms: ['math', 'latex', 'formula', '수식', '공식'],
    command: ({ editor, range }: any) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent('$E = mc^2$')
        .run();
    },
  },
];

// 6. 키보드 단축키 확장
export const extendedKeyboardShortcuts = [
  {
    key: 'Mod-Shift-1',
    description: '제목 1',
    command: ({ editor }: any) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    key: 'Mod-Shift-2',
    description: '제목 2',
    command: ({ editor }: any) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    key: 'Mod-Shift-3',
    description: '제목 3',
    command: ({ editor }: any) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    key: 'Mod-Shift-7',
    description: '번호 리스트',
    command: ({ editor }: any) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    key: 'Mod-Shift-8',
    description: '불릿 리스트',
    command: ({ editor }: any) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    key: 'Mod-Shift-9',
    description: '체크박스',
    command: ({ editor }: any) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    key: 'Mod-Shift-.',
    description: '인용구',
    command: ({ editor }: any) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    key: 'Mod-Alt-C',
    description: '코드 블록',
    command: ({ editor }: any) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    key: 'Mod-Shift-H',
    description: '하이라이트',
    command: ({ editor }: any) => editor.chain().focus().toggleHighlight().run(),
  },
];
