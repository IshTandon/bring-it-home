/**
 * matchUtils.ts
 * Pure helper functions for match status logic.
 * No side effects, no API calls — safe to use anywhere.
 */

const LIVE_STATUSES = new Set(['1H', 'HT', '2H', 'AET', 'PEN']);
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN']);
const UPCOMING_STATUSES = new Set(['NS', 'TBD']);

export function isMatchLive(status: string): boolean {
  return LIVE_STATUSES.has(status);
}

export function isMatchFinished(status: string): boolean {
  return FINISHED_STATUSES.has(status);
}

export function isMatchUpcoming(status: string): boolean {
  return UPCOMING_STATUSES.has(status);
}

/**
 * Formats the match minute for display.
 *
 * Examples:
 *   (45, '1H')  → "45'"
 *   (47, '1H')  → "45+2'"  (injury time in first half)
 *   (90, '2H')  → "90'"
 *   (93, '2H')  → "90+3'"  (injury time in second half)
 *   (0,  'HT')  → "HT"
 *   (90, 'FT')  → "FT"
 *   (105, 'AET') → "105'"
 *   (120, 'PEN') → "PEN"
 */
export function formatMatchMinute(minute: number, status: string): string {
  if (status === 'HT') return 'HT';
  if (status === 'FT') return 'FT';
  if (status === 'PEN') return 'PEN';
  if (status === 'NS') return '';

  if (status === '1H' && minute > 45) {
    return `45+${minute - 45}'`;
  }
  if (status === '2H' && minute > 90) {
    return `90+${minute - 90}'`;
  }
  if (status === 'AET' && minute > 120) {
    return `120+${minute - 120}'`;
  }

  return `${minute}'`;
}
