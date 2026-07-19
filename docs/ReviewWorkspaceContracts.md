# Review workspace contracts

This change adds only UI-neutral contracts. It does not import, replace, mount, restyle, or otherwise modify an application Review panel, `MapContainer`, Mapping module, or existing user interaction.

Applications own their UI and register local adapter implementations through `createReviewWorkspaceAdapterRegistry`. The configuration template declares a local adapter identifier and capabilities only; it must not carry URLs, credentials, repository names, cloud controls, deployment targets, or formal approval behavior.

`ReviewWorkflowTransport` accepts application-owned workflow intents and returns a provider-neutral state snapshot. `approve` only requests a workflow transition; any production authorization is owned by the application adapter outside this package.

The retained RIA configuration is an upstream showcase snapshot. Its synchronization direction is `none`: a downstream runtime profile may never overwrite it.
