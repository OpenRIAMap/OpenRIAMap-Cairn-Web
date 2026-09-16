# Change Baseline Protocol

Every blueprint-driven change must start from a recorded, freshly fetched
`origin/main` commit. This rule applies to the Web and Pipeline repositories
independently: a matching feature name or a previously generated branch is
never a substitute for the current repository baseline.

## Required preparation report

Before implementation begins, report all of the following in the task:

1. repository and remote URL;
2. the result of `git fetch origin main`;
3. the exact `origin/main` SHA and subject selected as the baseline;
4. the intended feature branch name; and
5. a brief matrix of main behaviour to retain and blueprint requirements that
   intentionally override it.

Create the feature branch directly from that fetched ref:

```text
git switch -c <feature-branch> origin/main
```

Do not start a new large change from an earlier feature branch, a preview
deployment, or an unverified local `main` branch.

## Integration and audit gate

During integration, classify every changed area as either:

- **main retained**: the blueprint has no requirement to alter it; or
- **blueprint override**: the requirement and reason for replacing the main
  implementation are recorded.

Before a pull request is created, all of these checks are mandatory:

```text
git fetch origin main
git merge-base --is-ancestor <baseline-sha> HEAD
git diff --check <baseline-sha> HEAD
git grep -n -E '^(<<<<<<<|=======|>>>>>>>)' HEAD -- .
```

For a single-commit regenerated candidate, `HEAD^` must equal the recorded
baseline SHA. If `origin/main` moves during the work, stop the release and
either regenerate from the new baseline or explicitly rebase, repeat the full
audit, and report the new SHA. A pull request must never be used to conceal a
baseline mismatch.

## PR and deployment handoff

The pull request description must include the baseline evidence, retention /
override matrix, validation results, and known inherited tooling limitations.
Deployment instructions must identify each changed SCF, COS, CAM and CORS
artifact by repository-relative path. Generated ZIPs must be rebuilt only from
the audited commit and handed off with SHA-256 values.
