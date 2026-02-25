const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateStr(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayDateStr(): string {
  return toDateStr(new Date());
}

/** "24 Feb" — no year, for compact timeline rows */
export function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** "24 Feb 2025" — full date for trip lists */
export function formatLongDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatDateRange(start: string, end: string): string {
  return `${formatLongDate(start)} – ${formatLongDate(end)}`;
}

/** Days elapsed from dateStr to todayStr (positive = dateStr is in the past) */
export function daysSince(dateStr: string, todayStr: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(todayStr).getTime() - new Date(dateStr).getTime()) / msPerDay);
}
