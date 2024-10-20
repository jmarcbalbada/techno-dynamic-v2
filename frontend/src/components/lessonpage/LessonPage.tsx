import { useNavigate } from 'react-router-dom';
import { RichTextReadOnly } from 'mui-tiptap';
import useTiptapExtensions from '../../hooks/useTiptapExtensions';
import { useEffect } from 'react';
import { cleanHTMLContent } from '../../helpers/CleanMarkAiContent';

const LessonPage = (props) => {
  let { pageContent } = props; // Changed to 'let' to allow reassignment
  const extensions = useTiptapExtensions();
  const navigate = useNavigate();

  useEffect(() => {
    if (pageContent === null || pageContent === undefined) {
      // Uncomment the next line to navigate to 404 if page content is null or undefined
      // navigate('/404');
    } else {
      pageContent = cleanHTMLContent(pageContent); // Ensure proper function usage
    }
  }, [pageContent]); // Added dependency

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
