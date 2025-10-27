'use client';

import { useState, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LexicalEditor, $getSelection, $isRangeSelection } from 'lexical';
import { $getRoot, $insertNodes } from 'lexical';
import { $isHeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $isListNode, $createListNode, $createListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode } from 'lexical';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const theme = {
  text: {
    bold: 'font-bold text-black',
    italic: 'italic text-black',
    underline: 'underline text-black',
    strikethrough: 'line-through text-black',
  },
  heading: {
    h2: 'text-2xl font-bold text-black',
    h3: 'text-xl font-bold text-black',
  },
  paragraph: 'mb-4 text-black',
  list: {
    ul: 'list-disc ml-6 text-black',
    ol: 'list-decimal ml-6 text-black',
  },
  quote: 'text-black',
};

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
        rows={10}
        placeholder="Loading editor..."
      />
    );
  }

  const handleChange = (editorState: LexicalEditor) => {
    editorState.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(editorState, null);
      onChange(htmlString);
    });
  };

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
    ],
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 flex-wrap">
          <FormatToolbar />
        </div>
        <div className="relative bg-white">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[200px] px-3 py-2 outline-none text-black" style={{ color: 'black' }} />
            }
            placeholder={
              <div className="absolute top-2 left-3 text-gray-400 pointer-events-none">
                Enter detailed product description...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <InitialContentPlugin html={value} />
        <OnChangePlugin onChange={handleChange} />
        <ListPlugin />
        <LinkPlugin />
        <TextFormatPlugin />
      </LexicalComposer>
      <style jsx global>{`
        .RichTextEditor__contentEditable {
          min-height: 200px;
          color: black !important;
        }
        .RichTextEditor__contentEditable p {
          color: black;
        }
        .RichTextEditor__contentEditable ul {
          color: black;
        }
        .RichTextEditor__contentEditable ol {
          color: black;
        }
        .RichTextEditor__contentEditable li {
          color: black;
        }
      `}</style>
    </div>
  );
}

// Plugin to initialize HTML content
function InitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (html && html.trim() !== '') {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().clear();
        $getRoot().select();
        $insertNodes(nodes);
      }, { discrete: true });
    }
  }, [editor, html]);

  return null;
}

// Plugin to support text formatting commands
function TextFormatPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<any>(
      'formatBold' as any,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.formatText('bold');
          }
        });
        return true;
      },
      0
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand<any>(
      'formatItalic' as any,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.formatText('italic');
          }
        });
        return true;
      },
      0
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand<any>(
      'formatUnderline' as any,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.formatText('underline');
          }
        });
        return true;
      },
      0
    );
  }, [editor]);

  return null;
}

// Format toolbar with full functionality
function FormatToolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text formatting
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' 
        ? anchorNode 
        : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          setBlockType('heading');
        } else if ($isListNode(element)) {
          setBlockType('list');
        } else {
          setBlockType('paragraph');
        }
      }
    }
  };

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });

    return () => {
      // Cleanup if needed
    };
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand('formatBold' as any, undefined);
  };

  const formatItalic = () => {
    editor.dispatchCommand('formatItalic' as any, undefined);
  };

  const formatUnderline = () => {
    editor.dispatchCommand('formatUnderline' as any, undefined);
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode('h2'));
      }
    });
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <button 
        className={`px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${isBold ? 'bg-amber-100 border-amber-300' : ''}`}
        onClick={formatBold} 
        title="Bold (Ctrl+B)"
        style={{ color: 'black' }}
      >
        <strong className="text-black">B</strong>
      </button>
      <button 
        className={`px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${isItalic ? 'bg-amber-100 border-amber-300' : ''}`}
        onClick={formatItalic} 
        title="Italic (Ctrl+I)"
        style={{ color: 'black' }}
      >
        <em className="text-black">I</em>
      </button>
      <button 
        className={`px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${isUnderline ? 'bg-amber-100 border-amber-300' : ''}`}
        onClick={formatUnderline} 
        title="Underline (Ctrl+U)"
        style={{ color: 'black' }}
      >
        <u className="text-black">U</u>
      </button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <button 
        className={`px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${blockType === 'heading' ? 'bg-amber-100 border-amber-300' : ''}`}
        onClick={formatHeading}
        title="Heading"
        style={{ color: 'black' }}
      >
        <span className="text-black font-semibold">H</span>
      </button>
      
      <button 
        className={`px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${blockType === 'paragraph' ? 'bg-amber-100 border-amber-300' : ''}`}
        onClick={formatParagraph}
        title="Paragraph"
        style={{ color: 'black' }}
      >
        <span className="text-black">¶</span>
      </button>
      
      <div className="h-6 w-px bg-gray-300 mx-1"></div>
      
      <button 
        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        onClick={formatBulletList}
        title="Bullet List"
        style={{ color: 'black' }}
      >
        <span className="text-black">• List</span>
      </button>
      
      <button 
        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        onClick={formatNumberedList}
        title="Numbered List"
        style={{ color: 'black' }}
      >
        <span className="text-black">1. List</span>
      </button>
    </div>
  );
}

export default RichTextEditor;
