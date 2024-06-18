import { useNavigate } from 'react-router-dom';
import { RichTextReadOnly } from 'mui-tiptap';

import useTiptapExtensions from '../../hooks/useTiptapExtensions';
import { useEffect } from 'react';

const LessonPage = (props) => {
  const { pageContent } = props;
  const extensions = useTiptapExtensions();
  const navigate = useNavigate();

  useEffect(() => {
    if (pageContent === null || pageContent === undefined) {
      console.log('hello null');
      // navigate('/404');
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageContent]);

  return (
    <div>
      <RichTextReadOnly content={pageContent} extensions={extensions} />
    </div>
  );
};

export default LessonPage;
