import { Paper, Stack, Typography } from '@mui/material';

type ReportMetricTileProps = {
  label: string;
  value: string;
  description?: string;
};

export default function ReportMetricTile({
  label,
  value,
  description
}: ReportMetricTileProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        height: '100%',
        bgcolor: 'background.default'
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle1" fontWeight={700}>
          {value}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
