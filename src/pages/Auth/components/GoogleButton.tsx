import { Button } from '@mui/material';
import React from 'react';
import { signInWithGooglePopup } from '../../../config/firebase.utils';
// import { API_AuthSignUp } from '../../../hooks/fetchingFunctions';

const GoogleButton = () => {
  // const signUp = API_AuthSignUp({});
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    if (response && response.user.email && response.user.displayName) {
      // signUp.mutate({
      //   email: response.user.email,
      //   password: response.user.uid,
      //   firstName: response.user.displayName,
      //   lastName: response.user.providerId,
      // });
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
