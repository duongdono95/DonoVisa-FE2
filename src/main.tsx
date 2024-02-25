import React from 'react';
import ReactDOM from 'react-dom/client';
import Provider from './GlobalStyles/Provider.tsx';
import AppRouter from './routes/routes.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider>
    <AppRouter />
  </Provider>,
  // </React.StrictMode>
);
