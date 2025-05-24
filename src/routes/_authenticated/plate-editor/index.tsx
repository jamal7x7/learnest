import { createFileRoute } from '@tanstack/react-router'
// import {PlateEditor} from '~/components/editor/plate-editor'
import PlateEditor from '~/features/plate-editor'


export const Route = createFileRoute('/_authenticated/plate-editor/')({ 
  component: PlateEditor,
})
