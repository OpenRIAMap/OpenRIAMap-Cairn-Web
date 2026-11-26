# c22 refinement candidate — 2026-11-26

An audit window could jump to the top when its parent rendered, and an active older map configuration could leave newly opened audit prices stale. This change keeps its portal attached during ordinary renders, restores scroll only across real layout migrations, and reads verified current defaults without activating a new map configuration. Late defaults preserve individually edited or cleared prices; failures identify the verified fallback.

The UI also adds complete dark tone mappings for existing colored controls, retains data and configured symbol colors, bounds the floor selector to the remaining map area, shows human category names before divergent code suffixes, and fixes the icon designer's checkerboard and candidate thumbnails. Existing untyped parent geometry presets can be edited without assigning a geometry type that would constrain their children.

## Configuration and release boundary

- Base: Web main `8eeadf17579e4a5695f88cd7c3f02d8cb247f731`, production r163/c22, formal data batch 26.
- All business configuration was authored through the normal configuration studio in an isolated Edge window. Browser helpers only used normal DOM input, selection, click and drag events. No generator, direct state setter or storage write authored the candidate.
- The fixture `scripts/config-tools/fixtures/c22-refinement-candidate.config.json.gz` contains the exact JSON bytes from the studio's standard ZIP download; it is a test fixture, not an activated production configuration.
- JSON SHA-256: `e2a495508377fca9c2a4d28db9047ec1c34f0aec9097fcbfa1c400c952bb7fab`.
- Standard ZIP SHA-256: `f6906d179fd1cbdc5823f3bbdd00d10e9b1b604eb2dc4d231c4bff9ec0fb01c1`.
- The configuration remains c22 and retains the formal base revision. The publication service allocates the next r when the operator publishes it. This PR does not replace the formal pointer or production data.

The 149-node/37-workflow candidate consolidates 14 definitions into seven three-step capture/edit workflows covering 39 leaf classifications; preserves six-world availability ordering; adds a dedicated BUD polygon editor with historical BUD/NOM retention; and retains BUP/FLR editors. SWB gains the existing basic water fields and label rendering. LWB displays from zoom 1 at 14px; SWB from zoom 3 at 12.5px. Building icons have 13px cores with white halo; LAR enters floor view at 5, and BUM/FLR use representative icons at 4–7 and geometry at 8. BUP keeps its prior intervals.

The shared validation kernel is `cairnmap-c22-production-2`, SHA-256 `717ace83734e2ea1127b9e20883cad5b7a6570f614c0ff2716a109c58c21f6e7`. A legal main-to-BUM edit may leave *unwritten existing* members with inactive references. Newly written members still require a valid same-world main; no rebinding, cascading deletion or second-level membership is introduced. The Pipeline companion change accepts prior pins and distinguishes new validation results from old cached refusals.

## Validation

- Node 24 full `npm run verify:ci` passed; the added final-candidate matrix passed with 39 real output evaluations and reversible edits, all seven layouts/routes, six-world order and all building/water rules. `npm run build` passed.
- Pipeline companion suite passed 307/307 on Node 20.19 and Node 24; the final UI candidate additionally passed all five role-change/cache regressions.
- Normal Edge audit checks: old r162 map retained while new audit uses r163 prices; delayed defaults preserve manual and cleared inputs; reopen resets defaults; failed read identifies r162 fallback. Input/parent updates, repeated desktop/mobile migrations and a 96-second observation retained scroll without repeated host removals.
- Real map floor selector checks covered sidebar open/hidden/restored/enlarged and entering floor view with an already open sidebar; measured right gap was 16px.
- Runtime laboratory: 13 representative captures and 13 cross-class edits across all seven workflows preserved IDs, geometry, creation metadata and extensions. Five BUD/FLR capture flows, NOM→BUM→LAR→NOM edits, required-table focus, hidden draft retention, floor 0, BUP/FLR routes and an actual historical BUD/NOM information-card import/edit were verified through normal UI.
- Reimporting the final standard ZIP into the studio, validating, saving and exporting again preserved the exact JSON digest. No test features are in the business package.
- Dark inventory covered 166 files/1720 candidate sites and 195 colored utility mappings. Populated layer controls and icon previews were visually checked; this is not a claim that every possible business state was manually opened.

The four global warnings are inherited TPT dedicated-editor coordinate dependencies for NOM/SPE (`TGT_COORD_X/Z`); no new blocker was introduced. The repository's standalone `npm run lint` lacks an ESLint 9 configuration; no unrelated lint setup was added. Existing Vite chunk-size warnings remain.

## Deployment

Deploy the compatible Pipeline consumers first, then merge/deploy Web and import/publish the standard configuration ZIP through the existing studio entry. Keep the deployment and permission settings; no CAM, COS path, CORS or endpoint change is needed. The operator performs merge, SCF deployment and configuration publication; the generation task only opens PRs and prepares packages.
