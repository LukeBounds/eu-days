export const TRIP_COLORS = [
  '#E53935', // red
  '#1E88E5', // blue
  '#43A047', // green
  '#FB8C00', // orange
  '#8E24AA', // purple
  '#00ACC1', // cyan
  '#F4511E', // deep orange
  '#6D4C41', // brown
] as const;

export function nextColorIndex(usedIndices: number[]): number {
  for (let i = 0; i < TRIP_COLORS.length; i++) {
    if (!usedIndices.includes(i)) return i;
  }
  return 0;
}
