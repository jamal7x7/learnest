'use client';

import * as React from 'react';

import { ToggleableEditor } from '~/components/editor/toggleable-editor';

export function ToggleableEditorExample() {
  const [value, setValue] = React.useState([
    {
      type: 'p',
      children: [{ text: 'Try toggling between simple text and rich text mode!' }],
    },
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Toggleable Editor Example</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Toggle the switch to enable rich text editing with formatting options.
      </p>
      
      <ToggleableEditor
        value={value}
        onChange={setValue}
        placeholder="Start typing..."
        variant="default"
        toggleLabel="Rich Text Mode"
        defaultRichText={false}
      />
      
      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h3 className="text-sm font-medium mb-2">Current Editor Value:</h3>
        <pre className="text-xs overflow-auto p-2 bg-background rounded border">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );
}