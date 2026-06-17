import { Box, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material';

export type QuestionnaireProgressHeaderProps = {
  sectionIndex: number;
  sectionCount: number;
  sectionTitle: string;
  answeredCount: number;
  totalQuestionCount: number;
};

function clampCompletionPercent(answeredCount: number, totalQuestionCount: number) {
  if (totalQuestionCount <= 0) {
    return 0;
  }

  return Math.round((answeredCount / totalQuestionCount) * 100);
}

export default function QuestionnaireProgressHeader({
  sectionIndex,
  sectionCount,
  sectionTitle,
  answeredCount,
  totalQuestionCount
}: QuestionnaireProgressHeaderProps) {
  const sectionNumber = sectionIndex + 1;
  const completionPercent = clampCompletionPercent(answeredCount, totalQuestionCount);

  return (
    <Box
      component="header"
      sx={{
        mb: { xs: 3, md: 4 }
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          spacing={1.5}
        >
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 0.8 }}
            >
              SECTION {sectionNumber} OF {sectionCount}
            </Typography>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                mt: 1,
                fontSize: { xs: '2rem', md: '2.75rem' },
                lineHeight: 1.1
              }}
            >
              {sectionTitle}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ pb: { md: 0.5 } }}
          >
            <Chip
              size="small"
              variant="outlined"
              label={`${answeredCount} of ${totalQuestionCount} answered`}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Step ${sectionNumber} of ${sectionCount}`}
            />
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={completionPercent}
          aria-label="Assessment completion progress"
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999
            }
          }}
        />

        <Divider />
      </Stack>
    </Box>
  );
}
