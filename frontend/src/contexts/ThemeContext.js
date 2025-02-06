// import { createContext, useContext, useState, useMemo } from 'react';
// import { ThemeProvider as themeProvider, createTheme } from '@mui/material/styles';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState('light');

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode]
//   );

//   const toggleTheme = () => {
//     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme }}>
//       <themeProvider theme={theme}>{children}</themeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };



//code2
// import { createContext, useContext, useState, useEffect } from 'react';
// import { ThemeProvider as themeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [mode, setMode] = useState(() => {
//     return localStorage.getItem('themeMode') || 'light';
//   });

//   useEffect(() => {
//     localStorage.setItem('themeMode', mode);
//   }, [mode]);

//   const theme = createTheme({
//     palette: {
//       mode,
//       ...(mode === 'dark' ? {
//         background: {
//           default: '#121212',
//           paper: '#1e1e1e',
//         },
//         text: {
//           primary: '#fff',
//           secondary: '#b3b3b3',
//         },
//       } : {
//         background: {
//           default: '#f5f5f5',
//           paper: '#ffffff',
//         },
//       }),
//     },
//   });

//   const toggleTheme = () => {
//     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme }}>
//       <themeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </themeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// export default ThemeProvider;



//code3
import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    return localStorage.getItem('themeMode') || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark' ? {
            // Dark mode colors
            primary: {
              main: '#90caf9',
            },
            secondary: {
              main: '#f48fb1',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#fff',
              secondary: 'rgba(255, 255, 255, 0.7)',
            },
          } : {
            // Light mode colors
            primary: {
              main: '#1976d2',
            },
            secondary: {
              main: '#dc004e',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }),
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = { mode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

//export default ThemeProvider;