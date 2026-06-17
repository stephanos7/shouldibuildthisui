import React from 'react';
import { Divider, List } from '@mui/material';
import type { AppliedRule } from '../../decision/types/DecisionResult';
import FactorListItem from './FactorListItem';

type FactorListProps = {
  factors: AppliedRule[];
  density: 'comfortable' | 'compact';
  ariaLabel?: string;
};

export default function FactorList({ factors, density, ariaLabel }: FactorListProps) {
  return (
    <List disablePadding aria-label={ariaLabel}>
      {factors.map((factor, index) => (
        <React.Fragment key={factor.ruleId}>
          <FactorListItem factor={factor} density={density} />
          {index < factors.length - 1 ? <Divider component="li" /> : null}
        </React.Fragment>
      ))}
    </List>
  );
}
