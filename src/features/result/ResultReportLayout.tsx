import { Box, Stack } from "@mui/material";
import type { ReactNode } from "react";

type ResultReportLayoutProps = {
  recommendationHero: ReactNode;
  keyFactors: ReactNode;
  scoreComparison: ReactNode;
};

export default function ResultReportLayout({
  recommendationHero,
  keyFactors,
  scoreComparison
}: ResultReportLayoutProps) {
  return (
    <Stack spacing={{ xs: 3, md: 5 }}>
      {recommendationHero}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 3.5, md: 5 },
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 7fr) minmax(0, 5fr)"
          },
          alignItems: "start"
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
