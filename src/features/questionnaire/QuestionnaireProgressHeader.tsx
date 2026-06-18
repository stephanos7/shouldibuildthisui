import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import SectionProgressSegments from './SectionProgressSegments';

export type QuestionnaireProgressHeaderProps = {
  sectionIndex: number;
  sectionCount: number;
  completedSectionIndexes: number[];
};

export default function QuestionnaireProgressHeader({
  sectionIndex,
  sectionCount,
  completedSectionIndexes
}: QuestionnaireProgressHeaderProps) {
  const sectionNumber = sectionIndex + 1;

  return (
    <Box
      component="header"
      sx={{
        mb: { xs: 3, md: 4 }
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="flex-end">
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: '0.16em' }}
            >
              SECTION {sectionNumber} OF {sectionCount}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack sx={{ width: '100%' }}>
            <SectionProgressSegments
              sectionIndex={sectionIndex}
              sectionCount={sectionCount}
              completedSectionIndexes={completedSectionIndexes}
            />
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ mt: { xs: 2.5, md: 3 } }} />
    </Box>
  );
}
