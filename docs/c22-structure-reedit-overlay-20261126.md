# c22 re-edit record overlay and package structure checks

Editing a formal BUD/NOM host to BUD/LAR/CUL left both versions in the
frontend validation pool. Saving an existing member against that host then
failed the unique-main check, even though the search picker showed one match.

The Mapping frontend now shares one effective record pool across full-editor
search/save, native quick workflows and specialized capture. It normalizes
world identities, applies exact formal delete marks, and overlays a single
saved local revision on its same-Class formal record. Classification changes
within that Class do not create duplicate hosts. Genuine duplicates within
either source and cross-Class collisions remain visible to validation.

Standard-package generation rechecks only records actually being exported
against the effective result of the package's writes and deletes. Members
whose main is absent, ambiguous or no longer a main fail before ZIP creation.
Unloaded world data gets a readiness error. The existing export error/report
UI is reused, and the saved layers remain available for correction.

Removing a local revision still falls back to its formal record. A formal
BUD/NOM that remains a valid main is accepted. Search classification scopes
are unchanged, and no new LAR-only constraint is imposed on relation storage.
Unwritten historical orphan members do not acquire new blockers.

## Verification

- `npm run test:mapping-record-overlay`: 12 regressions, included in the
  existing `test:c22-refinement` / `verify:ci` chain.
- `npm run verify:ci` and production build passed locally on Node 24.22.2.
- Isolated Edge, normal configuration lab: edited the formal shrine and
  emakake through the actual UI, selected the updated host, saved floor G,
  downloaded a two-record standard ZIP and checked its contents. Removing
  the local host revision then produced a valid member-only ZIP using the
  formal main.
- Isolated Edge, normal local app: imported a temporary LAR/BUM pair through
  the normal JSON dialog and saved the member through its editor. Export
  succeeded, deleting the local-only main blocked generation with an accurate
  downloadable report, and restoring it allowed generation without resaving
  or losing the member.

## Deployment

Web-only change against main `a0824c458e8c2c038538a7c59011b2390ff7a697`.
The checked formal configuration remains r167/c22. No configuration bytes,
shared server validator, Pipeline, SCF packages, CAM policy, API or formal
records are changed. Merge and deploy the Web PR when ready.
