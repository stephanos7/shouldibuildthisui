import { Button, Chip, Stack, Typography } from '@mui/material';

type AssessmentHeroProps = {
  hasSavedDraft: boolean;
  onStart: () => void;
};

export default function AssessmentHero({ hasSavedDraft, onStart }: AssessmentHeroProps) {
  return (
    <Stack
      component="section"
      spacing={4}
      alignItems="center"
      textAlign="center"
      sx={{
        minHeight: { xs: 'calc(100vh - 90px)', md: 'calc(100vh - 96px)' },
        justifyContent: 'center',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 7, md: 10 }
      }}
    >
      <Stack spacing={2.25} alignItems="center" sx={{ maxWidth: 860 }}>
        <Chip label="Decision guide" variant="outlined" />
        <Typography
          variant="h1"
          component="h1"
          sx={{
            maxWidth: 900,
            textWrap: 'balance'
          }}
        >
          Find the best path for your React UI
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ maxWidth: 720, lineHeight: 1.7 }}
        >
          Answer a short assessment about your team, applications, UI complexity, and support
          needs. You&apos;ll get a recommended path with a clear explanation.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center">
          <Chip label="About 3 minutes" variant="outlined" />
          <Chip label="16 questions" variant="outlined" />
        </Stack>
      </Stack>
      <Button
        type="button"
        variant="contained"
        size="large"
        onClick={onStart}
        sx={{ px: 4, py: 1.3 }}
      >
        {hasSavedDraft ? 'Continue questionnaire' : 'Start questionnaire'}
      </Button>
    </Stack>
  );
}
