/** Formats a year string or date into a readable label. */
export function formatYear(year: string | number): string {
  return String(year);
}

/** Formats a date string into a short readable format. */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}
