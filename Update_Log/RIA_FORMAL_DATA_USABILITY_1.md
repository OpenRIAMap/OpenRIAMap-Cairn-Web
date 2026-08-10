# RIA_FORMAL_DATA_USABILITY_1

- Uses the existing generic data-source settings card extension to show the
  existing source-link selector only when the applied source is the formal
  GitHub mirror. Selecting a link mode clears the affected cache and reloads
  the current world; neither failure path auto-switches data sources.
- Adds transport identity to the formal reader/cache scope so the COS source
  and each GitHub-compatible transport mode cannot reuse one another's cache.
- Reads the optional additive `formalVersion` from current Data pointers. The
  Settings card presents a compact six-digit version label and exposes the full
  formal version plus the immutable technical release ID in the existing title
  tooltip. Missing metadata remains `未分配` until the Pipeline migration runs.
- Keeps the normal player path same-origin proxy-only. Direct satellite access
  is now an explicit diagnostic opt-in; transient proxy failures retain the
  last snapshot, avoid overlapping requests, and back off quietly.
- Does not modify Mapping controls, Review Workbench UI, Review button
  bindings, relay semantics, CAM/COS credentials, or cloud configuration.
