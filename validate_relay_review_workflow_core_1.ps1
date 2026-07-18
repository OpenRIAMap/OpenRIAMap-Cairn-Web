param(
  [string]$ProjectId = "openriamap-ria",
  [string]$WorldId = "zth",
  [string]$RelaySample = "docs/30_data-contracts/examples/native-relay-package-sample",
  [string]$InboxSample = "docs/30_data-contracts/examples/relay-review-workflow-sample/RelayPackages",
  [string]$WorkRoot = ".cairnmap-tmp/review-workflow-oneclick",
  [string]$ActionsRoot = ".cairnmap-actions/review-workflow-oneclick"
)

$ErrorActionPreference = "Continue"

function NowIso {
  return (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
}

function Ensure-Dir([string]$Path) {
  New-Item -ItemType Directory -Force $Path | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Ensure-Dir $WorkRoot
Ensure-Dir $ActionsRoot

$reportTxt = Join-Path $WorkRoot "RELAY_REVIEW_WORKFLOW_CORE_1_VALIDATION_$timestamp.txt"
$reportJson = Join-Path $WorkRoot "RELAY_REVIEW_WORKFLOW_CORE_1_VALIDATION_$timestamp.json"

$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
  param(
    [string]$Group,
    [string]$Name,
    [string]$Expected,
    [string]$Status,
    [int]$ExitCode,
    [string]$Detail,
    [string]$Log
  )
  $results.Add([pscustomobject]@{
    Group = $Group
    Name = $Name
    Expected = $Expected
    Status = $Status
    ExitCode = $ExitCode
    Detail = $Detail
    Log = $Log
  }) | Out-Null
}

function Invoke-Logged {
  param(
    [string]$Group,
    [string]$Name,
    [string]$Command,
    [bool]$ExpectFail = $false
  )

  $safeName = ($Name -replace "[^\w\-.]+", "_")
  $logPath = Join-Path $WorkRoot "$timestamp-$safeName.log"

  ">>> $Command" | Out-File -Encoding UTF8 $logPath
  $output = & powershell -NoProfile -ExecutionPolicy Bypass -Command $Command 2>&1
  $exit = $LASTEXITCODE
  $output | Out-File -Encoding UTF8 -Append $logPath

  if ($ExpectFail) {
    if ($exit -ne 0) {
      Add-Result $Group $Name "FAIL expected" "PASS" $exit "Command failed as expected." $logPath
    } else {
      Add-Result $Group $Name "FAIL expected" "FAIL" $exit "Command unexpectedly succeeded." $logPath
    }
  } else {
    if ($exit -eq 0) {
      Add-Result $Group $Name "PASS expected" "PASS" $exit "Command completed successfully." $logPath
    } else {
      Add-Result $Group $Name "PASS expected" "FAIL" $exit "Command failed." $logPath
    }
  }
}

function Check-Path {
  param(
    [string]$Group,
    [string]$Name,
    [string]$Path
  )
  if (Test-Path $Path) {
    Add-Result $Group $Name "Exists" "PASS" 0 "Found: $Path" ""
  } else {
    Add-Result $Group $Name "Exists" "FAIL" 1 "Missing: $Path" ""
  }
}

function Check-PackageScript {
  param(
    [string]$Group,
    [string]$ScriptName
  )
  $found = Select-String -Path ".\package.json" -Pattern ([regex]::Escape($ScriptName)) -Quiet
  if ($found) {
    Add-Result $Group "package script: $ScriptName" "Exists" "PASS" 0 "Found in package.json." ""
  } else {
    Add-Result $Group "package script: $ScriptName" "Exists" "FAIL" 1 "Missing in package.json." ""
  }
}

function Check-JsonField {
  param(
    [string]$Group,
    [string]$Name,
    [string]$JsonPath,
    [scriptblock]$Predicate,
    [string]$PassDetail,
    [string]$FailDetail
  )
  try {
    $json = Get-Content $JsonPath -Raw | ConvertFrom-Json
    $ok = & $Predicate $json
    if ($ok) {
      Add-Result $Group $Name "JSON field check" "PASS" 0 $PassDetail ""
    } else {
      Add-Result $Group $Name "JSON field check" "FAIL" 1 $FailDetail ""
    }
  } catch {
    Add-Result $Group $Name "JSON field check" "FAIL" 1 "Failed to read/parse JSON: $($_.Exception.Message)" ""
  }
}

# Guard: script should be run from CairnMap-Web root.
if (!(Test-Path ".\package.json") -or !(Test-Path ".\scripts")) {
  Write-Host "ERROR: Please run this script from the CairnMap-Web root directory." -ForegroundColor Red
  exit 1
}

"RELAY_REVIEW_WORKFLOW_CORE_1 one-click validation started at $(NowIso)" | Out-File -Encoding UTF8 $reportTxt
"Project root: $(Get-Location)" | Out-File -Encoding UTF8 -Append $reportTxt
"Work root: $WorkRoot" | Out-File -Encoding UTF8 -Append $reportTxt
"Actions root: $ActionsRoot" | Out-File -Encoding UTF8 -Append $reportTxt
"" | Out-File -Encoding UTF8 -Append $reportTxt

# 1. File landing checks.
$g = "01 File landing"
Check-Path $g "review status tools" ".\scripts\review\relay-review-status-tools.mjs"
Check-Path $g "init review status" ".\scripts\review\init-relay-review-status.mjs"
Check-Path $g "update review status" ".\scripts\review\update-relay-review-status.mjs"
Check-Path $g "validate review status" ".\scripts\review\validate-relay-review-status.mjs"
Check-Path $g "list review inbox" ".\scripts\review\list-relay-review-inbox.mjs"
Check-Path $g "sync review report" ".\scripts\review\sync-relay-review-report.mjs"
Check-Path $g "review status schema" ".\project-config\schemas\relay\cairnmap.relay-review-status.v1.schema.json"
Check-Path $g "review inbox schema" ".\project-config\schemas\relay\cairnmap.relay-review-inbox.v1.schema.json"
Check-Path $g "relay review workflow config" ".\project-config\packages\openriamap-ria\environment\relayReviewWorkflow.json"
Check-Path $g "update log" ".\Update_Log\RELAY_REVIEW_WORKFLOW_CORE_1.md"

Check-PackageScript $g "init:relay-review-status"
Check-PackageScript $g "update:relay-review-status"
Check-PackageScript $g "validate:relay-review-status"
Check-PackageScript $g "list:relay-review-inbox"
Check-PackageScript $g "sync:relay-review-report"

# 2. Baseline validation chain.
$g = "02 Baseline validation"
Invoke-Logged $g "validate project config" "npm run validate:project-config"
Invoke-Logged $g "audit project config" "npm run audit:project-config"
Invoke-Logged $g "inspect project config" "npm run inspect:project-config"
Invoke-Logged $g "validate storage profiles" "npm run validate:storage-profiles"
Invoke-Logged $g "validate feature data contract" "npm run validate:feature-data-contract"
Invoke-Logged $g "validate native relay package" "npm run validate:native-relay-package"
Invoke-Logged $g "validate native relay config resolver" "npm run validate:native-relay-config-resolver"
Invoke-Logged $g "validate media index contract" "npm run validate:media-index-contract"
Invoke-Logged $g "compare native relay package" "npm run compare:native-relay-package"
Invoke-Logged $g "dry-run native relay apply" "npm run dry-run:native-relay-apply"
Invoke-Logged $g "apply native relay package default" "npm run apply:native-relay-package"
Invoke-Logged $g "build feature merge full" "npm run build:feature-merge-full"
Invoke-Logged $g "verify feature merge full" "npm run verify:feature-merge-full"
Invoke-Logged $g "build media index full" "npm run build:media-index-full"
Invoke-Logged $g "verify media index full" "npm run verify:media-index-full"
Invoke-Logged $g "run native relay local pipeline" "npm run run:native-relay-local-pipeline"
Invoke-Logged $g "action native relay precheck" "npm run action:native-relay-precheck"
Invoke-Logged $g "action native relay accept" "npm run action:native-relay-accept"
Invoke-Logged $g "validate native relay accept guards" "npm run validate:native-relay-accept-guards"
Invoke-Logged $g "typescript build" "npx tsc -b"

# 3. Review status state machine.
$g = "03 Review status state machine"
$statusSmokeDir = Join-Path $WorkRoot "review-status-smoke"
$statusPath = Join-Path $statusSmokeDir "review-status.json"
Remove-Item $statusSmokeDir -Recurse -Force -ErrorAction SilentlyContinue
Ensure-Dir $statusSmokeDir

Invoke-Logged $g "init review status" "npm run init:relay-review-status -- --status-path `"$statusPath`" --package-root `"$RelaySample`" --project-id `"$ProjectId`" --world-id `"$WorldId`""
Invoke-Logged $g "validate initialized review status" "npm run validate:relay-review-status -- --status-path `"$statusPath`""
Invoke-Logged $g "transition pending to prechecked" "npm run update:relay-review-status -- --status-path `"$statusPath`" --status prechecked --stage precheck --reason `"manual smoke precheck`""
Invoke-Logged $g "validate prechecked review status" "npm run validate:relay-review-status -- --status-path `"$statusPath`""
Check-JsonField $g "status is prechecked" $statusPath { param($j) $j.status -eq "prechecked" } "status=prechecked" "status was not prechecked"

Invoke-Logged $g "transition prechecked to accepted" "npm run update:relay-review-status -- --status-path `"$statusPath`" --status accepted --stage accept --reason `"manual smoke accept`""
Invoke-Logged $g "validate accepted review status" "npm run validate:relay-review-status -- --status-path `"$statusPath`""
Check-JsonField $g "status is accepted" $statusPath { param($j) $j.status -eq "accepted" } "status=accepted" "status was not accepted"
Check-JsonField $g "history contains at least two transitions" $statusPath { param($j) $j.history.Count -ge 2 } "history contains transitions" "history missing expected transitions"

Invoke-Logged $g "invalid transition accepted to pending" "npm run update:relay-review-status -- --status-path `"$statusPath`" --status pending --reason `"invalid transition smoke test`"" $true

# 4. Inbox layout and report sync.
$g = "04 Inbox and report sync"
Invoke-Logged $g "list default relay review inbox" "npm run list:relay-review-inbox"
Invoke-Logged $g "list sample relay review inbox" "npm run list:relay-review-inbox -- --inbox-root `"$InboxSample`""

Invoke-Logged $g "generate precheck report for sync" "npm run action:native-relay-precheck"
$precheckReport = ".cairnmap-actions/native-relay-precheck/precheck-report.json"
Invoke-Logged $g "sync precheck report" "npm run sync:relay-review-report -- --report `"$precheckReport`" --status-path `"$statusPath`""

$reportsDir = Join-Path $statusSmokeDir "reports"
if (Test-Path (Join-Path $reportsDir "precheck-report.json")) {
  Add-Result $g "synced precheck-report.json exists" "Exists" "PASS" 0 "Found synced report." ""
} else {
  Add-Result $g "synced precheck-report.json exists" "Exists" "FAIL" 1 "Missing synced report." ""
}

# 5. Action / review-status sync.
$g = "05 Action review-status sync"
$syncDir = Join-Path $WorkRoot "review-action-sync"
$syncStatus = Join-Path $syncDir "review-status.json"
Remove-Item $syncDir -Recurse -Force -ErrorAction SilentlyContinue
Ensure-Dir $syncDir

Invoke-Logged $g "init action sync status" "npm run init:relay-review-status -- --status-path `"$syncStatus`" --package-root `"$RelaySample`" --project-id `"$ProjectId`" --world-id `"$WorldId`""

$precheckSyncOut = Join-Path $ActionsRoot "native-relay-precheck-review-sync"
Invoke-Logged $g "precheck updates review status" "node .\scripts\actions\native-relay-precheck.mjs --relay `"$RelaySample`" --out `"$precheckSyncOut`" --project-id `"$ProjectId`" --review-status-path `"$syncStatus`" --update-review-status"
Check-JsonField $g "precheck status becomes prechecked" $syncStatus { param($j) $j.status -eq "prechecked" -and $j.precheck.status -eq "PASS" } "status=prechecked and precheck.status=PASS" "precheck did not update status correctly"

$acceptSyncOut = Join-Path $ActionsRoot "native-relay-accept-review-sync"
Invoke-Logged $g "accept updates review status" "node .\scripts\actions\native-relay-accept.mjs --relay `"$RelaySample`" --out `"$acceptSyncOut`" --project-id `"$ProjectId`" --review-status-path `"$syncStatus`" --update-review-status"
Check-JsonField $g "accept status becomes accepted" $syncStatus { param($j) $j.status -eq "accepted" -and $j.accept.status -eq "PASS" } "status=accepted and accept.status=PASS" "accept did not update status correctly"

# 6. Default action should not mutate review-status when update flag is absent.
$g = "06 No implicit status mutation"
$hashBefore = ""
try {
  $hashBefore = (Get-FileHash $syncStatus -Algorithm SHA256).Hash
} catch {
  $hashBefore = "HASH_READ_FAILED"
}

$noSyncOut = Join-Path $ActionsRoot "native-relay-precheck-no-status-sync"
Invoke-Logged $g "precheck with status path but no update flag" "node .\scripts\actions\native-relay-precheck.mjs --relay `"$RelaySample`" --out `"$noSyncOut`" --project-id `"$ProjectId`" --review-status-path `"$syncStatus`""

try {
  $hashAfter = (Get-FileHash $syncStatus -Algorithm SHA256).Hash
  if ($hashBefore -eq $hashAfter) {
    Add-Result $g "review-status unchanged without update flag" "No mutation" "PASS" 0 "SHA256 unchanged." ""
  } else {
    Add-Result $g "review-status unchanged without update flag" "No mutation" "FAIL" 1 "SHA256 changed." ""
  }
} catch {
  Add-Result $g "review-status unchanged without update flag" "No mutation" "FAIL" 1 "Could not read hash after command: $($_.Exception.Message)" ""
}

# Summary output.
$total = $results.Count
$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -ne "PASS" }).Count

"`n# Summary" | Out-File -Encoding UTF8 -Append $reportTxt
"Total: $total" | Out-File -Encoding UTF8 -Append $reportTxt
"PASS:  $passed" | Out-File -Encoding UTF8 -Append $reportTxt
"FAIL:  $failed" | Out-File -Encoding UTF8 -Append $reportTxt

"`n# Result Table" | Out-File -Encoding UTF8 -Append $reportTxt
$results |
  Select-Object Group, Name, Expected, Status, ExitCode, Detail, Log |
  Format-Table -AutoSize -Wrap |
  Out-String -Width 240 |
  Out-File -Encoding UTF8 -Append $reportTxt

"`n# Failed Items" | Out-File -Encoding UTF8 -Append $reportTxt
$failItems = $results | Where-Object { $_.Status -ne "PASS" }
if ($failItems.Count -eq 0) {
  "None" | Out-File -Encoding UTF8 -Append $reportTxt
} else {
  $failItems |
    Select-Object Group, Name, Expected, Status, ExitCode, Detail, Log |
    Format-Table -AutoSize -Wrap |
    Out-String -Width 240 |
    Out-File -Encoding UTF8 -Append $reportTxt
}

$results | ConvertTo-Json -Depth 8 | Out-File -Encoding UTF8 $reportJson

Write-Host ""
Write-Host "RELAY_REVIEW_WORKFLOW_CORE_1 one-click validation complete."
Write-Host "  Total: $total"
Write-Host "  PASS:  $passed"
Write-Host "  FAIL:  $failed"
Write-Host "  TXT report:  $reportTxt"
Write-Host "  JSON report: $reportJson"

if ($failed -gt 0) {
  Write-Host "Validation completed with failures. Please upload the TXT report and relevant .log files." -ForegroundColor Yellow
  exit 1
} else {
  Write-Host "Validation PASS. Please upload the TXT report for review." -ForegroundColor Green
  exit 0
}
