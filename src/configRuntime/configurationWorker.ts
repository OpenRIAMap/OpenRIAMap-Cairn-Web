import { decodeVerifiedConfiguration } from './configurationVerification';
import type { ConfigurationIdentity } from './formalConfiguration';
import type { ValidationReceipt } from './formalCache';
const scope = self as unknown as { onmessage: ((event: MessageEvent<{ identity: ConfigurationIdentity; bytes: Uint8Array; receipt?: ValidationReceipt }>) => void) | null; postMessage: (message: unknown) => void };
scope.onmessage = event => {
  const { identity, bytes, receipt } = event.data;
  void decodeVerifiedConfiguration(identity, bytes, receipt).then(config => scope.postMessage({ config }), error => scope.postMessage({ error: String(error instanceof Error ? error.message : error) }));
};
