# RIA_REVIEW_PACKAGE_PROFILE_AUTH_1

Consumes the merged upstream `CM_REVIEW_PACKAGE_CONTRACT_AUTH_CORE_1`
without changing the established Mapping or Review Workbench presentation.

## Downstream bindings

- Registers `openriamap-ria-relay` as a JSON-only RIA classification profile.
- Maps existing Mapping layers, pictures and delete selections into the generic
  review package input, including explicit delete locations for strict
  submission.
- Keeps historical packages available through compatibility import, while all
  newly exported packages receive the generic pending-only `Review.json`
  marker and `cairnmap.review-package.v1` manifest declaration.
- Adds a concrete two-phase `revision-upload-request` / signed PUT /
  `revision-upload-complete` transport without binding any existing panel
  button in this change.
- Adds GitHub OAuth session, login and logout adapters to the existing
  Settings panel style. No OAuth client secret or cloud credential reaches the
  browser.

## Fixed Relay protocol boundary

`Data_Spilt/`, `Picture/`, `INDEX.json`, `Review.json`, `Delete.json` and
`Tool_Refresh/` are fixed, versioned CairnMap Relay protocol elements. They
are serialized, parsed and validated by the upstream Review package core.
The downstream `src/config/openriamap-ria-review-package-profile.json` may
only declare `profileId` and `nestedKindClasses`; it cannot rename or replace
any Relay ZIP path. The RIA materializer only converts the parsed generic
package into existing map/workspace structures.

## Boundary

RIA class composition, GitHub routes and broker endpoint exist only in the
downstream adapter/profile. Generic package syntax, fixed Relay layout,
validation modes, digest calculation, transport port and settings UI are
imported from the locked upstream merge. The current Review Workbench and
Mapping behavior remain intact.
