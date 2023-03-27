import './App.css';

import { createTheme, ThemeProvider } from '@mui/material';

import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BackdropOverlay from './components/ui/BackdropOverlay';
import NavDrawer from './components/ui/NavDrawer';
import TraceRoutes from './components/ui/TraceRoutes';
import AuthProvider from './context/AuthContext';
import StateProvider from './context/StateContext';

export default function App() {
  const theme = createTheme({
    typography: {
      // link_text: {
      //   fontSize: [16, "!important"],
      // },
    },
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <StateProvider>
            <AuthProvider>
              <NavDrawer>
                <TraceRoutes />
              </NavDrawer>
              <BackdropOverlay />
            </AuthProvider>
          </StateProvider>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
}
