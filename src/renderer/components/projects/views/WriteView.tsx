'use client';

import React from 'react';
import { MarkdownEditor } from '../editor/MarkdownEditor';

interface WriteViewProps {
  content: string;
  onChange: (content: string) => void;
  isFocusMode: boolean;
}

// 🔥 프리컴파일된 스타일 (11원칙 준수)
const WRITE_STYLES = {
  container: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900',
  editorWrapper: 'flex-1 min-h-0 overflow-hidden',
} as const;

export function WriteView({ content, onChange, isFocusMode }: WriteViewProps): React.ReactElement {
  return (
    <div className={WRITE_STYLES.container}>
      <div className={WRITE_STYLES.editorWrapper}>
        <MarkdownEditor
          content={content}
          onChange={onChange}
          isFocusMode={isFocusMode}
        />
      </div>
    </div>
  );
}
