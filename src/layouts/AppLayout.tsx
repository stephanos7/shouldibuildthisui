import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Should I Build This UI
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/result" color="inherit">
              Result
            </Button>
            <Button component={RouterLink} to="/internal/calibration" color="inherit">
              Calibration
            </Button>
            <Button component={RouterLink} to="/internal/recalibration" color="inherit">
              Recalibration
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
