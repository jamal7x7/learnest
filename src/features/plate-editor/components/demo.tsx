import * as React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '~/components/editor/plugins/editor-plugins';
import { useCreateEditor } from '~/components/editor/use-create-editor';
import { Editor, EditorContainer } from '~/components/editor/ui/editor';

import { DEMO_VALUES } from './values/demo-values';

export default function Demo({ id }: { id: string }) {
  const editor = useCreateEditor({
    plugins: [...editorPlugins],
    value: DEMO_VALUES[id],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
