import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import InternalNav from '../app/navigation/InternalNav';
import PublicNav from '../app/navigation/PublicNav';
import {
  loadDecisionResult,
  RECOMMENDATION_STORAGE_EVENT
} from '../shared/storage/recommendationStorage';

export default function AppLayout() {
  const location = useLocation();
  const isInternalRoute = location.pathname.startsWith('/internal/');
  const [hasSavedResult, setHasSavedResult] = useState(() => loadDecisionResult() !== null);

  useEffect(() => {
    const syncSavedResult = () => {
      setHasSavedResult(loadDecisionResult() !== null);
    };

    syncSavedResult();
    window.addEventListener(RECOMMENDATION_STORAGE_EVENT, syncSavedResult);
    window.addEventListener('storage', syncSavedResult);

    return () => {
      window.removeEventListener(RECOMMENDATION_STORAGE_EVENT, syncSavedResult);
      window.removeEventListener('storage', syncSavedResult);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ fontWeight: 700, color: 'inherit', textDecoration: 'none' }}
          >
            Should I Build This UI
          </Typography>
          {isInternalRoute ? <InternalNav /> : <PublicNav hasSavedResult={hasSavedResult} />}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" component="main" sx={{ py: 0 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
