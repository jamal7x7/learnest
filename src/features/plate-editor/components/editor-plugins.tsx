
import emojiMartData from '@emoji-mart/data';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { DocxPlugin } from '@udecode/plate-docx';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { FixedToolbarPlugin } from '~/components/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '~/components/editor/plugins/floating-toolbar-plugin';
import { SuggestionBelowNodes } from '~/components/editor/ui/suggestion-line-break';

import { aiPlugins } from '~/components/editor/plugins/ai-plugins';
import { alignPlugin } from '~/components/editor/plugins/align-plugin';
import { autoformatPlugin } from '~/components/editor/plugins/autoformat-plugin';
import { basicNodesPlugins } from '~/components/editor/plugins/basic-nodes-plugins';
import { blockMenuPlugins } from '~/components/editor/plugins/block-menu-plugins';
import { commentsPlugin } from '~/components/editor/plugins/comments-plugin';
import { cursorOverlayPlugin } from '~/components/editor/plugins/cursor-overlay-plugin';
import { deletePlugins } from '~/components/editor/plugins/delete-plugins';
import { discussionPlugin } from '~/components/editor/plugins/discussion-plugin';
import { dndPlugins } from '~/components/editor/plugins/dnd-plugins';
import { equationPlugins } from '~/components/editor/plugins/equation-plugins';
import { exitBreakPlugin } from '~/components/editor/plugins/exit-break-plugin';
import { indentListPlugins } from '~/components/editor/plugins/indent-list-plugins';
import { lineHeightPlugin } from '~/components/editor/plugins/line-height-plugin';
import { linkPlugin } from '~/components/editor/plugins/link-plugin';
import { markdownPlugin } from '~/components/editor/plugins/markdown-plugin';
import { mediaPlugins } from '~/components/editor/plugins/media-plugins';
import { mentionPlugin } from '~/components/editor/plugins/mention-plugin';
import { resetBlockTypePlugin } from '~/components/editor/plugins/reset-block-type-plugin';
import { skipMarkPlugin } from '~/components/editor/plugins/skip-mark-plugin';
import { softBreakPlugin } from '~/components/editor/plugins/soft-break-plugin';
import { suggestionPlugin } from '~/components/editor/plugins/suggestion-plugin';
import { tablePlugin } from '~/components/editor/plugins/table-plugin';
import { tocPlugin } from '~/components/editor/plugins/toc-plugin';

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  linkPlugin,
  DatePlugin,
  mentionPlugin,
  tablePlugin,
  TogglePlugin,
  tocPlugin,
  ...mediaPlugins,
  ...equationPlugins,
  CalloutPlugin,
  ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,
  KbdPlugin,
  skipMarkPlugin,

  // Block Style
  alignPlugin,
  ...indentListPlugins,
  lineHeightPlugin,

  // Collaboration
  discussionPlugin,
  commentsPlugin,
  suggestionPlugin.configure({
    render: { belowNodes: SuggestionBelowNodes as any },
  }),
] as const;

export const editorPlugins = [
  // AI
  ...aiPlugins,

  // Nodes
  ...viewPlugins,

  // Functionality
  SlashPlugin.extend({
    options: {
      triggerQuery(editor) {
        return !editor.api.some({
          match: { type: editor.getType(CodeBlockPlugin) },
        });
      },
    },
  }),
  autoformatPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  ...dndPlugins,
  EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,
  TrailingBlockPlugin,

  // Deserialization
  DocxPlugin,
  markdownPlugin,
  JuicePlugin,

  // UI
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
