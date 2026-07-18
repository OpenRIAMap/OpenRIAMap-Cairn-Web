# CM_EMBEDDED_REVIEW_MODULE_CORE_1

## Objective

Add an embedded, read-only Review Module to the main CairnMap web app. The module establishes the first frontend review surface for RelayPackage inspection without introducing GitHub authentication, GitHub API access, workflow dispatch, or Data repository writes.

## Changed Files

- `src/components/Map/MapContainer.tsx`
  - Adds a `runtime | mapping | review` module mode.
  - Adds a Review launcher beside the existing measuring/mapping controls.
  - Makes review entry close the measuring tools before entering review mode.
  - Mounts the embedded Review Module as an in-app overlay.
- `src/components/Review/ReviewModule.tsx`
  - Adds the Review Module shell, sample inbox loading, local zip preview import, selection state, and cleanup behavior.
- `src/components/Review/ReviewModuleLauncher.tsx`
  - Adds the toolbar launcher for review mode.
- `src/components/Review/ReviewPackageListPanel.tsx`
  - Adds the read-only package inbox list.
- `src/components/Review/ReviewPackageDetailPanel.tsx`
  - Adds package metadata, status, report summary, and mount summary display.
- `src/components/Review/ReviewLayerControls.tsx`
  - Adds create/update/delete/pictures review layer toggles.
- `src/components/Review/reviewInboxReader.ts`
  - Adds browser-side sample inbox loading and local RelayPackage zip preview conversion using the existing RelayPackage parser.
- `src/components/Review/reviewLayerAdapter.ts`
  - Adds review temporary layer mounting through the existing RuleDrivenLayer temporary source mechanism using a `review::` namespace.
- `src/components/Review/reviewStatusTypes.ts`
  - Adds frontend review-status, inbox, and layer visibility types aligned with the existing review workflow contracts.
- `src/components/Review/reviewModuleState.ts`
  - Adds the shared module mode type.
- `src/components/Review/index.ts`
  - Exports the Review Module public surface.
- `public/review-samples/relay-review-inbox.sample.json`
  - Adds a compact browser-readable sample inbox derived from the existing docs contract samples.
- `Update_Log/CM_EMBEDDED_REVIEW_MODULE_CORE_1.md`
  - Adds this update log.

## Behavior Before

The project had RelayPackage contracts, validation scripts, accept guards, and review-status workflow utilities, but the main web app did not expose an embedded review interface. RelayPackage preview existed primarily through the measuring/mapping import path, and review status/inbox data was available only through scripts and docs samples.

## Behavior After

The main app can enter a read-only `review` mode from the toolbar. Review mode is mutually exclusive with the active measuring/mapping tools: entering review sends close signals to measuring modules, while entering measuring/mapping leaves review mode. The embedded panel can list the bundled sample review inbox, display package metadata/status/report summaries, parse a local RelayPackage zip through the existing RelayPackage parser for preview, and mount selected package contents as temporary `review::` rule sources. Exiting review mode clears the review temporary sources and review delete masks.

## Compatibility Notes

- This patch does not use GitHub API.
- This patch does not add token input or token storage.
- This patch does not call `workflow_dispatch`.
- This patch does not add accept/reject/request-changes actions.
- This patch does not write to `Data_Spilt`, `Data_Merge`, `Media_Index_Spilt`, or `Media_Index_Merge`.
- The bundled browser sample is a frontend convenience copy derived from the existing contract examples; it does not replace the authoritative docs contract samples.
- Review layer mounting reuses the existing `ria_temp_rule_sources_v1` mechanism with a `review::` source prefix and an auxiliary `ria_review_temp_delete_ids_v1` key to cleanly remove review delete masks on exit.

## Validation

Executed successfully:

```bash
npm run validate:project-config
npm run validate:storage-profiles
npm run validate:feature-data-contract
npm run validate:native-relay-package
npm run validate:native-relay-config-resolver
npm run validate:media-index-contract
npm run validate:native-relay-accept-guards
npm run validate:relay-review-status
npm run list:relay-review-inbox
node ./node_modules/typescript/bin/tsc -b
```

All listed validations passed in the patch workspace.

## Rollback Notes

To roll back this patch, remove `src/components/Review/`, remove `public/review-samples/relay-review-inbox.sample.json`, and revert the `MapContainer.tsx` changes that add `moduleMode`, `ReviewModuleLauncher`, and `ReviewModule` mounting. No data repository migration or cleanup is required because this patch is frontend-only and writes only browser temporary state at runtime.

## Handoff Note

The next logical patch is `CM_REVIEW_GITHUB_AUTH_BRIDGE_1`, which should add runtime GitHub token/repo-path handling and remote inbox/status reading. Accept/reject/workflow-dispatch actions should remain out of scope until a later `CM_EMBEDDED_REVIEW_ACTIONS_1` patch unless explicitly requested.
