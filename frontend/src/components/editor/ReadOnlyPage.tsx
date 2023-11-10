import { memo } from 'react';
import { RichTextReadOnly } from 'mui-tiptap';

import useTiptapExtensions from '../../hooks/useTiptapExtensions';

import { Box } from '@mui/material';

interface ReadOnlyPageProps {
  content: string;
}

const ReadOnlyPage = memo(({ content }: ReadOnlyPageProps) => {
  const extensions = useTiptapExtensions();

  return (
    <Box
      sx={{
        maxHeight: '100px',
        overflowY: 'hidden',
        WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent)'
      }}>
      <RichTextReadOnly content={content} extensions={extensions} />
    </Box>
  );
});

export default ReadOnlyPage;
