import { Button } from '@mui/material';
import React from 'react';
import { signInWithGooglePopup } from '../config/firebase.utils';
import { userFunctions } from '../hooks/userFunctions';
import { UserInterface } from '../types/GeneralTypes';
import { randomId } from '../hooks/GeneralHooks';

const GoogleButton = () => {
  const userSignUp = userFunctions.userSignUp({});
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    if (response && response.user.email && response.user.displayName) {
      const googleUser: UserInterface = {
        id: randomId(),
        firstName: response.user.displayName,
        lastName: response.user.providerId,
        email: response.user.email,
        password: 'firebase',
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      userSignUp.mutate(googleUser);
    }
  };
  return (
    <Button
      sx={{
        width: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'var(--white)',
        borderRadius: '5px',
        padding: '10px 20px',
        color: 'var(--black07)',
        fontWeight: 'bold',
        border: '1px solid var(--black02)',
        ':hover': {
          bgcolor: 'var(--primary05)',
          color: 'var(--white)',
        },
      }}
      onClick={logGoogleUser}
    >
      <div className={'google-logo'}></div>Continue With Google
    </Button>
  );
};

export default GoogleButton;
