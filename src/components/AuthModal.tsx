import React, { useState } from 'react';
import { Box, Button, FormControl, IconButton, TextField, useTheme } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import { SignInFormInterface, UserInterface, ValidateSignInForm, userSchema } from '../types/GeneralTypes';
import { emptyUserForm } from '../utils/constants';
import { userFunctions } from '../hooks/userFunctions';

const AuthModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState<SignInFormInterface | UserInterface>(
    location.pathname === '/sign-in'
      ? { email: location?.state?.email ?? '', password: '' }
      : { ...emptyUserForm, email: location?.state?.email ?? '', firstName: '' },
  );
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<{ path: string; message: string }>({ path: '', message: '' });
  const signIn = userFunctions.userSignIn({ setError });
  const signUp = userFunctions.userSignUp({ setError });
  const handleSubmit = () => {
    const validatedForm = location.pathname === '/sign-up' ? userSchema.safeParse(form) : ValidateSignInForm.safeParse(form);
    if (location.pathname === '/sign-up') {
      if (confirmPassword !== form.password) {
        return setError({
          path: 'confirmPassword',
          message: 'Passwords do not match!',
        });
      }
    }
    if (!validatedForm.success) {
      return setError({
        path: validatedForm.error.errors[0].path[0].toString(),
        message: validatedForm.error.errors[0].message,
      });
    }
    if (!error.path && !error.message && validatedForm.success) {
      if (location.pathname === '/sign-up') return signUp.mutate(validatedForm.data as UserInterface & { password: string });
      if (location.pathname === '/sign-in')
        return signIn.mutate({ email: validatedForm.data.email, password: validatedForm.data.password as string });
    }
  };
  return (
    <FormControl
      className={'sign-in-form'}
      sx={{
        boxShadow: theme.palette.mode === 'dark' ? '2px 2px 20px 5px var(--white01)' : '2px 2px 20px 5px var(--black01)',
        maxWidth: '400px',
        width: '100%',
        minWidth: '350px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        borderRadius: '10px',
      }}
    >
      <h4 style={{ opacity: 0.5, fontSize: 20, padding: '10px 0' }}>
        {location.pathname === '/sign-up' ? 'Create An Account With Us' : 'Welcome Back'}
      </h4>
      <GoogleButton />
      <p style={{ fontSize: 14, opacity: 0.7 }}>- Or -</p>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          padding: '20px',
          borderRadius: '5px',
          bgcolor: theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black005)',
        }}
      >
        {location.pathname === '/sign-up' && (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <TextField
              name="firstName"
              label="First Name"
              type={'text'}
              variant="filled"
              sx={{ width: '100%', borderRadius: '6px', overflow: 'hidden' }}
              value={(form as UserInterface).firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              onFocus={(e) => {
                e.target.select();
                setError({ path: '', message: '' });
              }}
              error={error.path === 'firstName'}
              helperText={error.path === 'firstName' ? error.message : ''}
              required
            />
            <TextField
              name="lastName"
              label="Last Name"
              type={'text'}
              variant="filled"
              sx={{ width: '100%', borderRadius: '6px', overflow: 'hidden' }}
              value={(form as UserInterface).lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              onFocus={(e) => {
                e.target.select();
                setError({ path: '', message: '' });
              }}
              error={error.path === 'lastName'}
              helperText={error.path === 'lastName' ? error.message : ''}
              required
            />
          </Box>
        )}
        <TextField
          name="email"
          label="Email"
          type={'email'}
          variant="filled"
          sx={{ width: '100%', borderRadius: '6px', overflow: 'hidden' }}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onFocus={(e) => {
            e.target.select();
            setError({ path: '', message: '' });
          }}
          error={error.path === 'email'}
          helperText={error.path === 'email' ? error.message : ''}
          required
        />
        <TextField
          name="password"
          label="Password"
          variant="filled"
          type={showPassword ? 'text' : 'password'}
          sx={{ width: '100%', borderRadius: '6px', overflow: 'hidden' }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}</IconButton>
            ),
          }}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onFocus={(e) => {
            e.target.select();
            setError({ path: '', message: '' });
          }}
          error={error.path === 'password'}
          helperText={error.path === 'password' ? error.message : ''}
        />
        {location.pathname === '/sign-up' && (
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            variant="filled"
            type={showPassword ? 'text' : 'password'}
            sx={{ width: '100%', borderRadius: '6px', overflow: 'hidden' }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}</IconButton>
              ),
            }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={(e) => {
              e.target.select();
              setError({ path: '', message: '' });
            }}
            error={error.path === 'confirmPassword'}
            helperText={error.path === 'confirmPassword' ? error.message : ''}
          />
        )}
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
          <Button
            onClick={() => {
              setForm(location.pathname === '/sign-in' ? { email: '', password: '' } : emptyUserForm);
              setConfirmPassword('');
              setError({ path: '', message: '' });
            }}
          >
            Reset
          </Button>
          <Button variant={'contained'} onClick={() => handleSubmit()}>
            Submit
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <p style={{ fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
          {location.pathname === '/sign-in' ? 'Not yet ' : 'Already '} having an account ?
        </p>
        <Button
          variant={'text'}
          onClick={() => {
            navigate(location.pathname === '/sign-in' ? '/sign-up' : '/sign-in');
            setForm(location.pathname === '/sign-in' ? emptyUserForm : { email: '', password: '' });
            setError({ path: '', message: '' });
          }}
        >
          <p style={{ paddingTop: '3px', textDecoration: 'underline' }}>Sign {location.pathname === '/sign-in' ? 'Up' : 'In'} Here</p>
        </Button>
      </Box>
    </FormControl>
  );
};

export default AuthModal;
