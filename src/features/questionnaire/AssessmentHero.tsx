import { Button, Chip, Stack, Typography } from '@mui/material';

type AssessmentHeroProps = {
  hasSavedDraft: boolean;
  onStart: () => void;
};

export default function AssessmentHero({ hasSavedDraft, onStart }: AssessmentHeroProps) {
  return (
    <Stack
      component="section"
      spacing={3}
      alignItems="center"
      textAlign="center"
      sx={{
        minHeight: { xs: 'calc(100vh - 96px)', md: 'calc(100vh - 128px)' },
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, md: 8 }
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ maxWidth: 980 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
            lineHeight: 1,
            fontWeight: 700
          }}
        >
          Find the best path for your React UI
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ maxWidth: 880, lineHeight: 1.45 }}
        >
          Answer a short assessment about your team, applications, UI
          complexity, and support needs. You&apos;ll get a recommended path with
          a clear explanation.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center">
          <Chip label="About 3 minutes" />
          <Chip label="16 questions" />
        </Stack>
      </Stack>
      <Button
        type="button"
        variant="contained"
        size="large"
        onClick={onStart}
        sx={{ px: 4, py: 1.25 }}
      >
        {hasSavedDraft ? 'Continue questionnaire' : 'Start questionnaire'}
      </Button>
    </Stack>
  );
}
