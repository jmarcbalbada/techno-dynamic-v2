import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import StudentInfo from './StudentInfo'; // Adjust the import path
import InstructorInfo from './InstructorInfo'; // Adjust the import path

const UserInformation = () => {
  const { user } = useAuth();

  if (user?.role === "student") {
    return <StudentInfo user={user} />;
  } else {
    return <InstructorInfo />;
  }
};

export default UserInformation;
