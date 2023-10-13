import { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextFields from '@mui/icons-material/TextFields';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

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
  const { contents, insert, remove } = props;
  const extensions = useTiptapExtensions({
    placeholder: 'Enter details here...'
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [submittedContent, setSubmittedContent] = useState('');

  const editor = rteRef.current?.editor;
  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }
    if (!editor.isFocused || !editor.isEditable) {
      // Use queueMicrotask per https://github.com/ueberdosis/tiptap/issues/3764#issuecomment-1546854730
      queueMicrotask(() => {
        const currentSelection = editor.state.selection;
        editor
          .chain()
          .setContent(contents)
          .setTextSelection(currentSelection)
          .run();
      });
    }
  }, [contents, editor, editor?.isEditable, editor?.isFocused]);

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
          content={contents}
          //editorDependencies={[contents]} // TODO: this is inefficient for this library
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
                <Box flexGrow='1'>
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
                </Box>
                <Box>
                  <MenuButton
                    value='insert'
                    tooltipLabel='Insert Page'
                    onClick={insert}
                    IconComponent={NoteAddIcon}
                  />
                  <MenuButton
                    value='remove'
                    tooltipLabel='Remove'
                    onClick={remove} // Call the remove function
                    IconComponent={DeleteForeverIcon}
                  />
                </Box>
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
    </>
  );
};

export default Editor;
