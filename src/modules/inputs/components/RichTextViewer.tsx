'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

// Node classes to register
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';

type Props = {
  value: string;
  className?: `${string}`;
};

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  link: 'text-blue-600 underline hover:text-blue-800',
  list: {
    listitem: 'ml-4 list-disc',
  },
};

const RichTextViewer = ({ value, className }: Props) => {
  const initialConfig: InitialConfigType = {
    namespace: 'RichTextViewer',
    editable: false,
    theme,
    nodes: [ListNode, ListItemNode, LinkNode],
    onError: (error) => console.error(error),
    editorState: () => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    },
  };

  return (
    <div className={className}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default RichTextViewer;
