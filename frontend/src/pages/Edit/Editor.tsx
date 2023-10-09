import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef
} from 'mui-tiptap';
import EditorMenuControls from './EditorMenuControls';
import useTiptapExtensions from '../../hooks/useTiptapExtensions';

const Editor = () => {
  const extensions = useTiptapExtensions({
    placeholder: 'Enter details here...'
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [submittedContent, setSubmittedContent] = useState('');

  return (
    <>
      <Box
        sx={{
          '& .ProseMirror': {
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              scrollMarginTop: showMenuBar ? 50 : 0
            }
          }
        }}>
        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          editable={isEditable}
          renderControls={() => <EditorMenuControls />}
          RichTextFieldProps={{
            variant: 'outlined',
            MenuBarProps: {
              hide: !showMenuBar
            },
            footer: (
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  setSubmittedContent(rteRef.current?.editor?.getHTML() ?? '');
                }}>
                Save
              </Button>
            )
          }}>
          {() => (
            <>
              <LinkBubbleMenu />
              <TableBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>

      <Typography variant='h5' sx={{ mt: 5 }}>
        Saved result:
      </Typography>

      {submittedContent ? (
        <>
          <pre style={{ marginTop: 10, overflow: 'auto', maxWidth: '100%' }}>
            <code>{submittedContent}</code>
          </pre>

          <Box mt={3}>
            <Typography variant='overline' sx={{ mb: 2 }}>
              Read-only saved snapshot:
            </Typography>

            <RichTextReadOnly
              content={submittedContent}
              extensions={extensions}
            />
          </Box>
        </>
      ) : (
        <>
          Press “Save” above to show the HTML markup for the editor content.
          Typically you’d use a similar <code>editor.getHTML()</code> approach
          to save your data in a form.
        </>
      )}
    </>
  );
};

export default Editor;
