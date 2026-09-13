# Staging review broker activation

The browser reaches review APIs only through the existing same-origin Vercel
broker. This deployment does not bind a Review UI button and does not allow a
browser to call COS, GitHub write APIs, Dispatcher, Worker, or Mirror.

The code has two independent runtime gates. Both must be set for the Vercel
deployment used for the staging exercise:

| environment variable | value | sensitivity |
| --- | --- | --- |
| `CAIRN_REVIEW_AUTOMATION_ENABLED` | `true` | non-secret |
| `CAIRN_REVIEW_AUTOMATION_STAGE` | `staging` | non-secret |

All production-facing deployments must leave
`CAIRN_REVIEW_AUTOMATION_ENABLED` unset or `false`. Setting it to `true` with
any stage other than exactly `staging` returns HTTP 503 with
`review-automation-staging-required`; it cannot silently become production
automation.

Existing secret environment variables stay server-side and are not changed by
this step: OAuth client secret, session signing secret, broker-to-dispatcher
secret, and GitHub App private key. Do not commit their values.

`/api/public-review-releases` is intentionally a login-free, read-only
presentation route. It reuses the existing `CAIRN_CONTROL_API_BASE` and
`CAIRN_BROKER_TO_DISPATCHER_SECRET` values to ask the Dispatcher for a redacted
completed-release record or a one-package short-lived download URL. It does not
need `CAIRN_SESSION_SIGNING_SECRET`, does not change COS ACL/CORS, and cannot
read active review submissions.

The public release-record route is intentionally outside those two staging
write gates: `/api/public-review-releases` can be read without login in every
environment, but it is limited to the redacted, completed release projection
and short-lived downloads of already archived individual packages. It is still
signed server-to-server by the Broker and cannot schedule a Worker, alter a
status lamp, read active submissions, or expose a raw COS key.

After a deployment, authenticated callers can use the unbound write routes for
a staging smoke test. A `503 review-automation-disabled` means the first gate
is not enabled; a `503 review-automation-staging-required` means the stage
value is absent or wrong. Neither result schedules a Worker or writes COS data.
