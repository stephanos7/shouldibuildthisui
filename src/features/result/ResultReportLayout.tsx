import { Grid, Stack } from '@mui/material';
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

      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
        <Grid item xs={12} md={7}>
          <Stack spacing={{ xs: 4, md: 5 }}>{keyFactors}</Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={{ xs: 4, md: 5 }}>{scoreComparison}</Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
