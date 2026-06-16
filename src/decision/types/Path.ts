export const validPaths = [
  'build_it_yourself',
  'mui_core',
  'mui_x_premium',
  'mui_x_enterprise'
] as const;

export type Path =
  | 'build_it_yourself'
  | 'mui_core'
  | 'mui_x_premium'
  | 'mui_x_enterprise';
