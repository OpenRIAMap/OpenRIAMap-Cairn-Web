import { getApplicationSettings } from '../core/project/applicationRuntime';
/** Normal player refresh remains five seconds; sustained failures back off without dropping the last good snapshot. */
export function nextPlayerPollDelayMs(consecutiveFailures: number): number {
  if (!Number.isSafeInteger(consecutiveFailures) || consecutiveFailures <= 2) return getApplicationSettings().modules.players.pollIntervalMs;
  return Math.min(Math.max(60_000,getApplicationSettings().modules.players.pollIntervalMs),getApplicationSettings().modules.players.pollIntervalMs * (2 ** (consecutiveFailures - 2)));
}
