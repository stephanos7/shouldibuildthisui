import CheckCircleOutlineIcon from '@mui/material/SvgIcon';
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import type { AppliedRule } from '../../decision/types/DecisionResult';

type FactorListItemProps = {
  factor: AppliedRule;
  density: 'comfortable' | 'compact';
};

export default function FactorListItem({ factor, density }: FactorListItemProps) {
  return (
    <ListItem
      alignItems="flex-start"
      disableGutters
      sx={{ py: density === 'compact' ? 1 : 1.5 }}
    >
      <ListItemIcon sx={{ minWidth: 32, color: 'primary.main', mt: 0.25 }}>
        <CheckCircleOutlineIcon fontSize="small" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
        </CheckCircleOutlineIcon>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
            {factor.label}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {factor.reason}
          </Typography>
        }
      />
    </ListItem>
  );
}
