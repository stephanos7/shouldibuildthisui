import { Button, Container, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HeroVideoPanel from './HeroVideoPanel';

type HomeHeroProps = {
  hasSavedDraft: boolean;
  hasSavedResult: boolean;
  onStart: () => void;
};

export default function HomeHero({ hasSavedDraft, hasSavedResult, onStart }: HomeHeroProps) {
  return (
    <Container
      component="section"
      maxWidth="lg"
      sx={{
        pt: { xs: 5, md: 8, lg: 10 },
        pb: { xs: 5, md: 8 }
      }}
    >
      <Grid container spacing={{ xs: 5, md: 6, lg: 8 }} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            spacing={{ xs: 3, md: 3.5 }}
            alignItems={{ xs: 'center', md: 'flex-start' }}
            textAlign={{ xs: 'center', md: 'left' }}
            sx={{ width: '100%', maxWidth: 720 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: {
                  xs: '3.25rem',
                  sm: '4.25rem',
                  md: '5.15rem',
                  lg: '6rem'
                },
                lineHeight: 0.95,
                letterSpacing: '-0.065em',
                maxWidth: 720,
                textWrap: 'balance'
              }}
            >
              Find the best path for your React UI
            </Typography>
            <Typography
              variant="h5"
              component="p"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                lineHeight: 1.25,
                maxWidth: 620
              }}
            >
              Answer a short assessment about your team, applications, UI complexity, and support
              needs. You&apos;ll get a recommendation with a clear explanation.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={onStart}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {hasSavedDraft ? 'Continue assessment' : 'Start assessment'}
              </Button>
              {hasSavedResult ? (
                <Button
                  component={RouterLink}
                  to="/result"
                  variant="outlined"
                  size="large"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  View saved result
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <HeroVideoPanel />
        </Grid>
      </Grid>
    </Container>
  );
}
