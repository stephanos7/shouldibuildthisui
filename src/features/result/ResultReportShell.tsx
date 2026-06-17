import { Container, Stack } from '@mui/material';
import type { ReactNode } from 'react';

type ResultReportShellProps = {
  children: ReactNode;
};

export default function ResultReportShell({ children }: ResultReportShellProps) {
  return (
    <Container maxWidth="lg" disableGutters sx={{ py: { xs: 1, md: 2 } }}>
      <Stack spacing={{ xs: 3, md: 4 }}>{children}</Stack>
    </Container>
  );
}
