import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './app/routes';
import { theme } from './app/theme';

const browserRouter = createBrowserRouter(routes);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={browserRouter} />
    </ThemeProvider>
  );
}
