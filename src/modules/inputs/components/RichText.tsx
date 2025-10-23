'use client';

import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState, FORMAT_TEXT_COMMAND, LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  link: 'text-blue-600 underline hover:text-blue-800',
  list: {
    ul: 'list-disc ml-6 mb-2', // <–– bullets + indentation
    ol: 'list-decimal ml-6 mb-2', // <–– numbers + indentation
    listitem: 'mb-1',
  },
};

type Props = {
  value: string;
  onChange: (_: string) => void;
  placeholder?: string;
};

function Toolbar({ editor }: { editor: LexicalEditor }) {
  const applyFormat = (format: 'bold' | 'italic' | 'underline') => {
    // editor.update(() => {
    //   const selection = $getSelection();
    //   if ($isRangeSelection(selection)) {
    //     selection.setStyle('color: #aaaaaa;');
    //   }
    // });
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const toggleLink = () => {
    const url = prompt('Enter URL (leave empty to remove link):');
    if (url === null) return;
    const value = url.trim() === '' ? null : url.trim();
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, value);
  };

  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  return (
    <div className="flex gap-1 border-b border-gray-200 pb-1 mb-2">
      <button onClick={() => applyFormat('bold')} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        <b>B</b>
      </button>
      <button onClick={() => applyFormat('italic')} className="px-2 py-1 text-sm italic rounded hover:bg-gray-100">
        I
      </button>
      <button onClick={() => applyFormat('underline')} className="px-2 py-1 text-sm underline rounded hover:bg-gray-100">
        U
      </button>
      <button onClick={insertBulletList} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        • List
      </button>
      <button onClick={toggleLink} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        🔗 Link
      </button>
      <button onClick={undo} className="px-2 py-1 text-sm rounded hover:bg-gray-100 ml-auto">
        ↺ Undo
      </button>
      <button onClick={redo} className="px-2 py-1 text-sm rounded hover:bg-gray-100">
        ↻ Redo
      </button>
    </div>
  );
}

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const [initialState, setInitialState] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<LexicalEditor | null>(null);

  useEffect(() => {
    setInitialState(value);
  }, [value]);

  if (initialState === null) return null;

  const initialConfig: InitialConfigType = {
    namespace: 'MyRichTextEditor',
    theme,
    nodes: [ListNode, ListItemNode, LinkNode],
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
    editorState: () => {
      try {
        return JSON.parse(initialState);
      } catch {
        return null;
      }
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState);
      onChange(json);
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-2 shadow-sm">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container min-h-[150px]">
          {editorInstance && <Toolbar editor={editorInstance} />}
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none min-h-[120px] p-2" />}
            placeholder={<div className="text-gray-400 p-2">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={(_, editor) => setEditorInstance(editor)} ignoreHistoryMergeTagChange />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditor;
