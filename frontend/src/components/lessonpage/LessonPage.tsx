import { RichTextReadOnly } from 'mui-tiptap';

import useTiptapExtensions from '../../hooks/useTiptapExtensions';

const LessonPage = (props) => {
  const { pageContent } = props;
  console.log('pageContent', pageContent);

  const extensions = useTiptapExtensions();
  return (
    <div>
      <RichTextReadOnly content={pageContent} extensions={extensions} />
    </div>
  );
};

export default LessonPage;
