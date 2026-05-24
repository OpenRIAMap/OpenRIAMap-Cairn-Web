# RB_EDO_7 Change Log

Baseline: `OpenRIAMap-Web_RB_EDO_6_F5.zip`

## Scope

EDO_7 is a small incremental update focused on measuring-mode interaction safety and two workflow copy fixes.

## Changes

### Measuring interaction suppression

- Added a measuring-panel toggle for `要素交互抑制`.
- When enabled, ordinary rule-feature label / symbol / geometry clicks are suppressed only while the user is actively drawing on the map.
- Existing open info cards are not force-closed.
- Dedicated measuring pick modes, including delete-pick and assist-line pick, are not suppressed.

### Measuring auxiliary toolbar display suppression

- Added a measuring-panel toggle for `工具栏显示抑制`.
- When enabled, the auxiliary drawing tool area is hidden while no drawing mode is active.
- The hidden tool area remains mounted, so internal tool states are preserved.
- When disabled, the auxiliary tool area remains visible as before.

### Measuring panel controls

- Added two compact toggle buttons in the measuring panel header:
  - `要素交互抑制`
  - `工具栏显示抑制`

### Workflow wording fixes

- Changed StationWorkflow platform input label from `站台号` to `车站内站台编号` for both downbound and upbound platform pages.
- Changed WarpPointWorkflow coordinate page title from `Warp点：起点坐标` to `Warp点坐标`.

## Modified files

- `src/components/Mapping/core/MeasuringModule.tsx`
- `src/components/Rules/core/RuleDrivenLayer.tsx`
- `src/components/Mapping/Workflow/StationWorkflow.tsx`
- `src/components/Mapping/Workflow/WarpPointWorkflow.tsx`
