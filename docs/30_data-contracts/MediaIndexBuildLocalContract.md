# MediaIndex Build Local Contract

Patch: `DATA_MEDIA_INDEX_WORLD_FIRST_BUILD_1`

## Scope

This patch defines and implements a local full rebuild path:

```text
Media_Index_Spilt -> Media_Index_Merge
```

It also makes MediaIndex output world-first.

## Input

```text
Media_Index_Spilt/
  assets/{mediaId}.json
  bindings/{worldId}/{classCode}/{kindPath...}/{featureId}.json
```

Legacy input of the following shape may be read with a warning:

```text
Media_Index_Spilt/bindings/{projectId}/{worldId}/{classCode}/{kindPath...}/{featureId}.json
```

## Output

```text
Media_Index_Merge/
  INDEX.json
  {worldId}/
    INDEX.json
    assets/{mediaId}.json
    by-feature/{classCode}/{kindPath...}/{featureId}.json
```

## Non-goals

This patch does not alter Feature JSON, Picture files, current frontend picture loading, GitHub Actions, or admin review UI behavior.
