import React, { PropsWithChildren } from 'react';
import './GlobalStyles.scss';

import { GlobalTheme } from './GlobalThemes';

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { DnDcontextProvider } from '../pages/Board/DnD/DnDContext';

const queryClient = new QueryClient();
const Provider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={GlobalTheme}>
        <CssBaseline />
        {children}
        <ToastContainer position="top-center" />
      </CssVarsProvider>
    </QueryClientProvider>
  );
};

export default Provider;
