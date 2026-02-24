export interface EuDaysTheme {
  /** Foreground color — use for text in timeline rows */
  color: string;
  /** Background color — use for the status banner */
  bg: string;
}

export function getEuDaysTheme(count: number): EuDaysTheme {
  if (count > 90) return { color: '#B71C1C', bg: '#B71C1C' }; // over limit
  if (count > 85) return { color: '#E53935', bg: '#E53935' }; // approaching
  if (count > 75) return { color: '#FB8C00', bg: '#FB8C00' }; // caution
  return { color: '#43A047', bg: '#2E7D32' };                 // safe
}
