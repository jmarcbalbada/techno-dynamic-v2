import { useMemo } from 'react';
import type { EditorOptions } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
//import FontFamily from '@tiptap/extension-font-family';
import GapCursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import {
  FontSize,
  HeadingWithAnchor,
  LinkBubbleMenuHandler,
  ResizableImage,
  TableImproved
} from 'mui-tiptap';

export type UseExtensionsOptions = {
  placeholder?: string;
};

const CustomLinkExtension = Link.extend({
  inclusive: false
});

const CustomSubscript = Subscript.extend({
  excludes: 'superscript'
});

const CustomSuperscript = Superscript.extend({
  excludes: 'subscript'
});

export default function useTiptapExtensions({
  placeholder
}: UseExtensionsOptions = {}): EditorOptions['extensions'] {
  return useMemo(() => {
    return [
      // Ordering is important to ensure keyboard shortcuts work as expected
      TableImproved.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,

      BulletList,
      CodeBlock,
      Document,
      HardBreak,
      ListItem,
      OrderedList,
      Paragraph,
      CustomSubscript,
      CustomSuperscript,
      Text,

      Bold,
      Blockquote,

      Code,
      Italic,
      Underline,
      Strike,
      CustomLinkExtension.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false
      }),
      LinkBubbleMenuHandler,

      // Extensions
      GapCursor,
      HeadingWithAnchor,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image']
      }),
      TextStyle,
      Color,
      // FontFamily,
      FontSize,
      Highlight.configure({
        multicolor: true
      }),
      HorizontalRule,

      ResizableImage,
      Dropcursor,

      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Placeholder.configure({
        placeholder
      }),

      Youtube.configure({
        inline: false,
        width: 480,
        height: 320,
        disableKBcontrols: true
      }),

      History
    ];
  }, [placeholder]);
}
