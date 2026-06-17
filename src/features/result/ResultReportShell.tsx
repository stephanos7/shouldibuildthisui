import { Container, Stack } from '@mui/material';
import type { ReactNode } from 'react';

type ResultReportShellProps = {
  children: ReactNode;
};

export default function ResultReportShell({ children }: ResultReportShellProps) {
  return (
    <Container
      component="main"
      maxWidth="lg"
      disableGutters
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Stack spacing={{ xs: 3, md: 4 }}>{children}</Stack>
    </Container>
  );
}
