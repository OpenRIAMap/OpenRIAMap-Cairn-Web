# RIA_REVIEW_RELEASE_PRECHECK_GATE_V3_1

## Downstream-only Broker surface

The same-origin `/api/review-control` Broker now recognizes:

- `publish-precheck` — signed request with a versioned submission reference;
- `publish-confirm` — the same versioned request plus `attemptId`,
  `expectedGateVersion`, and `precheckReportSha256`;
- `release-gate` — current read-only Gate snapshot.

The Browser still calls only the Vercel same-origin route. It receives no COS
bucket name, GitHub write token, SCF credential, or private endpoint. The SCF
Dispatcher remains the Team-authorized authority.

## Intentional non-changes

- No `.tsx` file, MapContainer, Review Workbench layout, or button binding was
  changed.
- Existing `publish` remains recognized only so the Dispatcher can return the
  explicit `publish-must-use-precheck-and-confirm` migration error; new clients
  must use the two-step route.
- This candidate does not deploy Vercel, modify environment variables, alter
  COS CORS/ACL, or create a remote branch/PR.
