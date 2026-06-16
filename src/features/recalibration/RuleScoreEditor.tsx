import { Grid2 as Grid, TextField } from '@mui/material';
import { pathDefinitions } from '../../decision/policy/pathDefinitions';
import type { Path } from '../../decision/types/Path';
import { scoreOptions } from './recalibrationTypes';

type RuleScoreEditorProps = {
  errors: Partial<Record<Path, string>>;
  scores: Record<Path, string>;
  onChange: (path: Path, value: string) => void;
};

const helperText = 'Positive favors this path. Negative pushes against it. Zero means no effect.';

export default function RuleScoreEditor({ errors, scores, onChange }: RuleScoreEditorProps) {
  return (
    <Grid container spacing={2}>
      {pathDefinitions.map((path) => (
        <Grid key={path.id} size={{ xs: 12, md: 6 }}>
          <TextField
            select
            SelectProps={{ native: true }}
            fullWidth
            label={`${path.label} score`}
            value={scores[path.id]}
            onChange={(event) => onChange(path.id, event.target.value)}
            error={Boolean(errors[path.id])}
            helperText={errors[path.id] ?? helperText}
          >
            {scoreOptions.map((score) => (
              <option key={score} value={String(score)}>
                {score}
              </option>
            ))}
          </TextField>
        </Grid>
      ))}
    </Grid>
  );
}
