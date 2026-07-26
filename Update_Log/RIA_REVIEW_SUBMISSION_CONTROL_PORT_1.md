# RIA_REVIEW_SUBMISSION_CONTROL_PORT_1

## Scope

Add a downstream-only, UI-unbound same-origin submission-control transport.

## Included

- `/api/review-control` session-authenticated and Dispatcher-signed broker;
- RIA `ReviewSubmissionAdapter` implementation;
- v2 upstream lock / compatibility update and v3 downstream binding metadata;
- broker request tests and configuration validation.

## Preserved

- Review Workbench visual baseline and every `.tsx` file;
- existing Relay upload broker and inbox behavior;
- browser prohibition on direct COS, GitHub write, and SCF worker access;
- automation remains disabled until a later staging activation approval.

## Binding refinement

The RIA contract now names `reopen` and `publish` as reviewer interactions and
declares the immutable revision, reviewer-workspace, rejected-package and
Control audit prefixes. The feature gate remains disabled; this does not bind
or alter any Review Workbench UI control.
