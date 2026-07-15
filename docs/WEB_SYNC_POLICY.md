# Cairn Web Sync Policy

This repository is a Cairn-specific Web repository.

Planned sync rule:

- Sync stable program logic from `CairnMap-Web`.
- Preserve Cairn-specific config.
- Preserve built-in data / media / PR repository bindings.
- Do not overwrite environment-specific files without explicit migration notes.

Future sync should be patch-based and include an Update_Log entry.
