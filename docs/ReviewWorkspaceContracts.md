# Review workspace contracts

This change adds only UI-neutral contracts. It does not import, replace, mount, restyle, or otherwise modify an application Review panel, `MapContainer`, Mapping module, or existing user interaction.

Applications own their UI and register local adapter implementations through `createReviewWorkspaceAdapterRegistry`. The configuration template declares a local adapter identifier and capabilities only; it must not carry URLs, credentials, repository names, cloud controls, deployment targets, or formal approval behavior.

`ReviewWorkflowTransport` accepts application-owned workflow intents and returns a provider-neutral state snapshot. `approve` only requests a workflow transition; any production authorization is owned by the application adapter outside this package.

## Submission revisions and formal-control seam

`ReviewSubmissionSnapshot` models one logical submission with multiple immutable revisions. A submission-level event always contains `targetRevisionId`, so an edited revision cannot inherit an outcome made for an older revision. `stateVersion` is an optimistic-concurrency token: an application adapter must reject a mutation whose expected version is stale and return a fresh snapshot.

`ReviewSubmissionAdapter` is an application-owned port for reading a submission, dispatching a version-targeted action, and optionally reading a release feed. It intentionally has no URLs, provider identifiers, storage paths, credentials, deployment code, or approval implementation. The host application owns authorization, immutable storage, audit records, and any release execution.

The core semantic is deliberately limited: `save` creates or records a revised candidate under an application adapter and leaves the logical submission pending; `approve`, `reject`, and `publish` are requested actions, not a browser-side authorization or deployment.

The retained RIA configuration is an upstream showcase snapshot. Its synchronization direction is `none`: a downstream runtime profile may never overwrite it.
