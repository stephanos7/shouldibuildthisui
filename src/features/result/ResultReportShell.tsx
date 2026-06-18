import { Container, Stack } from '@mui/material';
import type { ReactNode } from 'react';

type ResultReportShellProps = {
  children: ReactNode;
};

export default function ResultReportShell({ children }: ResultReportShellProps) {
  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        py: { xs: 2.5, sm: 3, md: 5, xl: 8 },
        px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 10 },
        overflowX: 'clip'
      }}
    >
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', maxWidth: 1120, mx: 'auto' }}>
        {children}
      </Stack>
    </Container>
  );
}
