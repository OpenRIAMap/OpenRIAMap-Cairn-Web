/** Normal player refresh remains five seconds; sustained failures back off without dropping the last good snapshot. */
export function nextPlayerPollDelayMs(consecutiveFailures: number): number {
  if (!Number.isSafeInteger(consecutiveFailures) || consecutiveFailures <= 2) return 5_000;
  return Math.min(60_000, 5_000 * (2 ** (consecutiveFailures - 2)));
}
