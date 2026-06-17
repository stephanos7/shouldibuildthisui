import { Box, FormHelperText, Grid, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export type ResponsiveQuestionRowProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export default function ResponsiveQuestionRow({
  id,
  label,
  error,
  children
}: ResponsiveQuestionRowProps) {
  return (
    <Box
      component="section"
      aria-labelledby={`${id}-question`}
      sx={{
        py: { xs: 3, md: 3.5 },
        borderTop: 1,
        borderColor: 'divider',
        '&:first-of-type': {
          borderTop: 0,
          pt: 0
        }
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="flex-start">
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography
              id={`${id}-question`}
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25
              }}
            >
              {label}
            </Typography>
            {error ? (
              <FormHelperText id={`${id}-error`} error sx={{ m: 0 }}>
                {error}
              </FormHelperText>
            ) : null}
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
