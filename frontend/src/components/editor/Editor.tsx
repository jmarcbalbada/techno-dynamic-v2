import { useRef, useState } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextFields from '@mui/icons-material/TextFields';

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

const Editor = (props) => {
  const { index, handleRemovePage } = props;
  const extensions = useTiptapExtensions({
    placeholder: 'Enter details here...'
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [submittedContent, setSubmittedContent] = useState('');

  const onRemove = () => {
    handleRemovePage(index);
  };

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
              <Stack
                direction='row'
                justifyContent='space-between'
                spacing={2}
                sx={{
                  borderTopStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: (theme) => theme.palette.divider,
                  py: 1,
                  px: 1.5
                }}>
                <MenuButton
                  value='formatting'
                  tooltipLabel={
                    showMenuBar ? 'Hide formatting' : 'Show formatting'
                  }
                  size='small'
                  onClick={() =>
                    setShowMenuBar((currentState) => !currentState)
                  }
                  selected={showMenuBar}
                  IconComponent={TextFields}
                />
                <MenuButton
                  value='remove'
                  tooltipLabel='Remove'
                  onClick={() => {
                    onRemove();
                  }}
                  IconComponent={DeleteForeverIcon}
                />
              </Stack>
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

      {/* <Typography variant='h5' sx={{ mt: 5 }}>
        Saved result:
      </Typography>

      {submittedContent ? (
        <>
          <pre style={{ marginTop: 10, overflow: 'auto', maxWidth: '100%' }}>
            <code>{submittedContent}</code>
          </pre>

          <Box my={3}>
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
      )} */}
    </>
  );
};

export default Editor;
