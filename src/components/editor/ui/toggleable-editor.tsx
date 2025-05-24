'use client';

import * as React from 'react';

import type { PlateContentProps } from '@udecode/plate/react';
import type { VariantProps } from 'class-variance-authority';

import { EditorContainer, Editor, type EditorProps } from './editor';
import { Switch } from '../../ui/switch';
import { cn } from '~/lib/utils';

export type ToggleableEditorProps = EditorProps & {
  /** Label for the rich text mode toggle */
  toggleLabel?: string;
  /** Default state of the rich text mode */
  defaultRichText?: boolean;
  /** Controlled state for rich text mode */
  richText?: boolean;
  /** Callback when rich text mode changes */
  onRichTextChange?: (richText: boolean) => void;
};

/**
 * A toggleable editor component that can switch between simple text input and rich text editing.
 */
export const ToggleableEditor = React.forwardRef<HTMLDivElement, ToggleableEditorProps>(
  ({
    className,
    disabled,
    focused,
    variant,
    toggleLabel = 'Rich Text',
    defaultRichText = false,
    richText: richTextProp,
    onRichTextChange,
    ...props
  }, ref) => {
    // Handle controlled or uncontrolled rich text state
    const [richTextState, setRichTextState] = React.useState(defaultRichText);
    const richText = richTextProp !== undefined ? richTextProp : richTextState;
    
    const handleRichTextToggle = React.useCallback((checked: boolean) => {
      setRichTextState(checked);
      onRichTextChange?.(checked);
    }, [onRichTextChange]);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground">{toggleLabel}</span>
          <Switch
            checked={richText}
            onCheckedChange={handleRichTextToggle}
            disabled={disabled}
            aria-label={`Toggle ${toggleLabel}`}
          />
        </div>
        
        <EditorContainer variant={variant} className={className}>
          <Editor
            ref={ref}
            disabled={disabled}
            focused={focused}
            variant={variant}
            // When not in rich text mode, disable all formatting features
            editableProps={{
              ...(!richText && {
                // Prevent any formatting when not in rich text mode
                onKeyDown: (e) => {
                  // Allow basic navigation and editing keys
                  const allowedKeys = [
                    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                    'Backspace', 'Delete', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'
                  ];
                  
                  // Block keyboard shortcuts for formatting (Ctrl/Cmd + B, etc.)
                  if ((e.ctrlKey || e.metaKey) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }
              })
            }}
            {...props}
          />
        </EditorContainer>
      </div>
    );
  }
);

ToggleableEditor.displayName = 'ToggleableEditor';