

import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '~/components/editor/use-create-editor';
import { Editor, EditorContainer } from '~/components/editor/ui/editor';

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <Plate editor={editor}>
      
      <EditorContainer>
        <Editor variant="demo" placeholder="Type..." />
      </EditorContainer>
    </Plate>
  );
}
