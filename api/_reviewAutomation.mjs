export function reviewAutomationEnabled(environment = process.env) {
  return environment.CAIRN_REVIEW_AUTOMATION_ENABLED === 'true'
    && environment.CAIRN_REVIEW_AUTOMATION_STAGE === 'staging';
}

export function requireReviewAutomation(res, environment = process.env) {
  if (reviewAutomationEnabled(environment)) return true;
  const error = environment.CAIRN_REVIEW_AUTOMATION_ENABLED === 'true'
    ? 'review-automation-staging-required'
    : 'review-automation-disabled';
  res.status(503).json({ error });
  return false;
}
