import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';

import TextFields from '@mui/icons-material/TextFields';

import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  type RichTextEditorRef
} from 'mui-tiptap';
import EditorMenuControls from './EditorMenuControls';
import useTiptapExtensions from '../../hooks/useTiptapExtensions';

const Editor = (props, ref) => {
  const { contents } = props;
  const extensions = useTiptapExtensions({
    placeholder: 'Enter the contents here...'
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);

  const getHTMLContent = () => {
    return rteRef.current?.editor?.getHTML() ?? '';
  };

  useImperativeHandle(ref, () => ({
    getHTMLContent
  }));

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
          extensions={extensions}
          editable={isEditable}
          renderControls={() => <EditorMenuControls rteRef={rteRef} />}
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
              </Stack>
            )
          }}>
          {() => (
            <>
              <LinkBubbleMenu
                disablePortal
                PaperProps={{
                  sx: {
                    zIndex: 2000
                  }
                }}
              />
              <TableBubbleMenu disablePortal />
            </>
          )}
        </RichTextEditor>
      </Box>
    </>
  );
};

export default forwardRef(Editor);
