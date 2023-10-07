import React from 'react';
import { useParams } from 'react-router-dom';

const Lesson = () => {
  const { lessonid } = useParams();

  return <div>Lesson</div>;
};

export default Lesson;
