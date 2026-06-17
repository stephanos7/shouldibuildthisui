import ExpandMoreIcon from '@mui/material/SvgIcon';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Stack,
  Typography
} from '@mui/material';
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
  const visibleFactors = getVisibleFactors(appliedRules, recommendation);
  const hiddenFactors = getHiddenFactors(appliedRules, recommendation);

  return (
    <Box component="section" aria-labelledby="key-factors-heading">
      <Stack spacing={2}>
        <Box>
          <Typography id="key-factors-heading" variant="h5" component="h2">
            Key factors behind this recommendation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            These are the main signals that influenced the recommended path.
          </Typography>
        </Box>

        {appliedRules.length === 0 ? (
          <Alert severity="info">
            No scoring factors were returned for this recommendation.
          </Alert>
        ) : (
          <FactorList
            factors={visibleFactors}
            density="comfortable"
            ariaLabel="Top scoring factors"
          />
        )}

        {hiddenFactors.length > 0 ? (
          <Accordion disableGutters variant="outlined" sx={{ borderRadius: 2 }}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon viewBox="0 0 24 24">
                  <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </ExpandMoreIcon>
              }
              aria-controls="all-scoring-factors-content"
              id="all-scoring-factors-header"
            >
              <Typography variant="body2" fontWeight={600}>
                {getViewAllFactorsLabel(appliedRules.length)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id="all-scoring-factors-content">
              <FactorList
                factors={[...visibleFactors, ...hiddenFactors]}
                density="compact"
                ariaLabel="All scoring factors"
              />
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Stack>
    </Box>
  );
}
