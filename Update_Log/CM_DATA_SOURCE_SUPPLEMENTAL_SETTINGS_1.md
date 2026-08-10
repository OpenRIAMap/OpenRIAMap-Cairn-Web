# CM_DATA_SOURCE_SUPPLEMENTAL_SETTINGS_1

Adds an optional, application-owned supplemental settings slot to the generic data-source Settings section. The slot receives only the draft/applied generic source definitions and apply state. It intentionally has no knowledge of deployment providers, repository names, transport URLs, credentials, or application-specific configuration.

Downstreams can use the slot to render a source-dependent setting beneath the selected reader while retaining explicit application and source-scoped cache isolation.
