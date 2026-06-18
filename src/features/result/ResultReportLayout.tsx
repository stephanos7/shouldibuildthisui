import { Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';

type ResultReportLayoutProps = {
  reportHeader: ReactNode;
  recommendationHero: ReactNode;
  keyFactors: ReactNode;
  scoreComparison: ReactNode;
};

export default function ResultReportLayout({
  reportHeader,
  recommendationHero,
  keyFactors,
  scoreComparison
}: ResultReportLayoutProps) {
  return (
    <Stack spacing={{ xs: 3, md: 5 }}>
      {reportHeader}
      {recommendationHero}

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 6 },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
          alignItems: 'flex-start'
        }}
      >
        <Box>
          <Stack spacing={{ xs: 4, md: 5 }}>{keyFactors}</Stack>
        </Box>
        <Box>
          <Stack spacing={{ xs: 4, md: 5 }}>{scoreComparison}</Stack>
        </Box>
      </Box>
    </Stack>
  );
}
