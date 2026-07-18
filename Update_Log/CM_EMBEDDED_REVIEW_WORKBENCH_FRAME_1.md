# CM_EMBEDDED_REVIEW_WORKBENCH_FRAME_1

## Objective

Reshape the embedded review module from a read-only preview panel into a frontend-only Chinese review workbench. The workbench separates the review inbox from the single-package layer management area and prepares the UI flow for later GitHub integration without calling GitHub or writing remote data.

## Changed Files

- `src/components/Review/ReviewModule.tsx`
- `src/components/Review/ReviewInboxPanel.tsx`
- `src/components/Review/ReviewLayerManagerPanel.tsx`
- `src/components/Review/ReviewPackageListPanel.tsx`
- `src/components/Review/ReviewPackageDetailPanel.tsx`
- `src/components/Review/reviewPackageSession.ts`
- `src/components/Review/index.ts`
- `src/components/Map/MapContainer.tsx`
- `src/components/Mapping/core/MeasuringModule.tsx`
- `Update_Log/CM_EMBEDDED_REVIEW_WORKBENCH_FRAME_1.md`

## Behavior Before

The embedded review module appeared as one fixed left-side panel with English headings and independent `review::` temporary preview layer toggles. It worked as a read-only preview surface and did not share the mapping-style layer management workflow.

## Behavior After

The review module now appears as a Chinese desktop-only review workbench with draggable panels. The review inbox is separated from the single-package work area. Selecting a package loads it into a review workspace backed by the existing mapping core. In review workspace mode, the layer manager title becomes `审核图层管理` and the top action area becomes six buttons: `保存 / 通过 / 打回 / 临挂 / 导出 / 删除`.

The measuring core is not copied. Instead, it now supports `workspaceMode="review"`, preserving the existing temporary mount, ID conflict validation, standard package export, and delete-mark workflow while changing the surrounding review toolbar semantics.

## Compatibility Notes

- No GitHub token is introduced.
- No GitHub API is called.
- No `workflow_dispatch` is triggered.
- No `Data_Spilt`, `Data_Merge`, or `Media_Index_Merge` writes are performed.
- Normal mapping mode remains available and keeps its existing toolbar buttons.
- Review `保存 / 通过 / 打回` are local frontend workbench states only in this patch.

## Validation

Passed:

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

## Rollback Notes

Revert this patch to restore the previous read-only embedded review preview. The rollback removes the review workbench panels, review package session state, and review workspace props added to the measuring core.

## Handoff Note

After visual and interaction review passes, the next logical patch should add the GitHub auth bridge and remote review inbox reading. Do not add accept/reject remote actions until GitHub token/runtime auth and workflow dispatch boundaries are explicitly confirmed.
