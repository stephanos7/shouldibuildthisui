import { Alert, Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { AppliedRule } from '../../decision/types/DecisionResult';
import type { Path } from '../../decision/types/Path';
import {
  getHiddenFactors,
  getVisibleFactors,
  getViewAllFactorsLabel
} from './resultContent';
import FactorList from './FactorList';

type KeyFactorsSectionProps = {
  appliedRules: AppliedRule[];
  recommendation: Path;
};

export default function KeyFactorsSection({
  appliedRules,
  recommendation
}: KeyFactorsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleFactors = getVisibleFactors(appliedRules, recommendation);
  const hiddenFactors = getHiddenFactors(appliedRules, recommendation);
  const hasHiddenFactors = hiddenFactors.length > 0;

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="key-factors-heading"
      sx={{ p: { xs: 3, md: 4 }, borderRadius: '28px' }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography id="key-factors-heading" variant="h4" component="h2">
            Key factors behind this recommendation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
            These are the main scoring factors behind the recommendation.
          </Typography>
        </Box>

        {appliedRules.length === 0 ? (
          <Alert severity="info">
            No scoring factors were returned for this recommendation.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            <FactorList
              factors={visibleFactors}
              density="comfortable"
              ariaLabel="Top scoring factors"
            />

            {hasHiddenFactors ? (
              <Stack spacing={1.5}>
                <Button
                  type="button"
                  variant="text"
                  color="inherit"
                  onClick={() => setExpanded((currentExpanded) => !currentExpanded)}
                  sx={{ alignSelf: 'flex-start', px: 0, minWidth: 0, textTransform: 'none' }}
                >
                  {getViewAllFactorsLabel(hiddenFactors.length, expanded)}
                </Button>

                {expanded ? (
                  <Stack spacing={1.5}>
                    <Divider />
                    <FactorList
                      factors={hiddenFactors}
                      density="comfortable"
                      ariaLabel="Additional scoring factors"
                    />
                  </Stack>
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
