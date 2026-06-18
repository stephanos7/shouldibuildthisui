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
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            width: '100%',
            justifyContent: 'center',
            px: { xs: 2, sm: 3, md: 5 }
          }}
        >
          <Container
            maxWidth="lg"
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                letterSpacing: '-0.03em'
              }}
            >
              Should I Build This UI
            </Typography>
            {isInternalRoute ? <InternalNav /> : <PublicNav hasSavedResult={hasSavedResult} />}
          </Container>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={isInternalRoute ? 'lg' : false}
        disableGutters={!isInternalRoute}
        component="main"
        sx={{ py: 0, position: 'relative' }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
