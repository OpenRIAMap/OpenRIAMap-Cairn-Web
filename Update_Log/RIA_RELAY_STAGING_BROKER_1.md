# RIA_RELAY_STAGING_BROKER_1

This downstream-only addition introduces `/api/review-relay-transfer`. It is intentionally an unbound server-side port: no Review UI, Mapping UI, MapContainer, button, or browser transport is modified in this change.

The route requires the existing OAuth session and the `CAIRN_REVIEW_AUTOMATION_ENABLED=true` Vercel gate. It overwrites any browser-supplied actor with the authenticated GitHub login, HMAC-signs the request for Dispatcher, and forwards only these operations:

- `relay-upload-request`
- `relay-upload-complete`
- `relay-inbox-list`
- `status`

It never returns a cloud credential, never calls GitHub write APIs from the browser, and never creates a Worker or Mirror public endpoint. GitHub Team authorization remains entirely in the Shanghai Dispatcher.

The existing generic workflow Broker also now overwrites the top-level dispatch actor as well as the nested request actor. A browser cannot select a different GitHub login in either route.

The downstream-only [`deployment/ria-review-relay-staging-transport.json`](../deployment/ria-review-relay-staging-transport.json) declares the five-minute upload grant, 64 MiB package maximum, required MD5/SHA-256/byte-size completion checks, and the fixed `RelayPackages/pending/{packageId}.zip` target. The frozen RIA showcase files under `project-config/packages/openriamap-ria/` are deliberately unchanged. Their existing local `enabled: false` status remains unchanged, so this change cannot activate an existing front-end flow.

The showcase-freeze validator now canonicalizes text configuration line endings before hashing. It keeps the manifest's existing source hash valid for both LF and Windows CRLF worktrees, without weakening the content check.

The manifest hash is also rebased to the already-merged Review Team/OAuth configuration baseline; before this change, `origin/main` itself failed the freeze check because that earlier approved workflow-modularization change had not refreshed the metadata. This rebase changes metadata only, not a showcase template file or its synchronization direction.
