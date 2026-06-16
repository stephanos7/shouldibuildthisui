import type { Path } from '../types/Path';

export type PathDefinition = {
  id: Path;
  label: string;
  summary: string;
};

export const pathDefinitions = [
  {
    id: 'build_it_yourself',
    label: 'Build it yourself',
    summary: 'Best for narrow, low-risk work where long-term platform overhead is unnecessary.'
  },
  {
    id: 'mui_core',
    label: 'MUI Core',
    summary: 'Best for shared UI foundations that need consistency without heavy enterprise demands.'
  },
  {
    id: 'mui_x_premium',
    label: 'MUI X Premium',
    summary: 'Best for advanced UI needs, especially richer data experiences across growing teams.'
  },
  {
    id: 'mui_x_enterprise',
    label: 'MUI X Enterprise',
    summary: 'Best for broad rollout, governance, critical workflows, and enterprise-grade support.'
  }
] satisfies PathDefinition[];
