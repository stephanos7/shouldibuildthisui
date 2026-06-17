import { Chip, Paper, Stack, Typography } from "@mui/material";

export default function AssessmentHero() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 700
          }}
        >
          Find the best path for your React UI
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Answer a short assessment about your team, applications, UI
          complexity, and support needs. You&apos;ll get a recommended path with
          a clear explanation.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label="About 3 minutes" />
          <Chip label="16 questions" />
        </Stack>
      </Stack>
    </Paper>
  );
}
