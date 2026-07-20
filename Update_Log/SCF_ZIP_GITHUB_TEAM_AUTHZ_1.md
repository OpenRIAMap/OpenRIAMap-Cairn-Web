# SCF_ZIP_GITHUB_TEAM_AUTHZ_1

This downstream-only update removes static Vercel username role bindings. GitHub OAuth establishes a browser identity only; the Shanghai SCF Dispatcher resolves live `OpenRIAMap` Team membership through the organization-owned GitHub App for each protected workflow intent.

The roles are `cairn-contributors`, `cairn-reviewers`, and `cairn-maintainers`. Reviewers may approve submitted requests, including their own, by the approved collective workflow policy. This does not change any `.tsx` file, Review UI, MapContainer, Mapping behavior, RelayPackage semantics, accept guards, or local `approved_local` separation.
