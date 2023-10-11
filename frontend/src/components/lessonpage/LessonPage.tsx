import React, { useEffect, useState } from 'react';
import { LessonsService } from '../../apis/LessonsService.js';

import { RichTextReadOnly } from 'mui-tiptap';
import useTiptapExtensions from '../../hooks/useTiptapExtensions';

const LessonPage = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    getLesson();
  }, []);

  const getLesson = async () => {
    const response = await LessonsService.getById(1);
    console.log('response', response);
    setContent(response.data.pages[0].contents);
  };

  const extensions = useTiptapExtensions();
  return (
    <div>
      <RichTextReadOnly content={content} extensions={extensions} />
    </div>
  );
};

export default LessonPage;
