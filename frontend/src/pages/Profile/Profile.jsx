import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Box, Container } from '@mui/material';
import BasicInformation from '../../components/profile/BasicInformation';
import UserInformation from '../../components/profile/UserInfo';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Box>
        <h1>{user?.first_name}'s Profile</h1>
        <Box width={1} display="flex" flexDirection="column" gap={1}>
          <Box>
          <BasicInformation 
            user={user} 
            //display the information below the papers
            display={
            <UserInformation 
            />}/>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;