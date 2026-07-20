export function reviewAutomationEnabled(environment = process.env) {
  return environment.CAIRN_REVIEW_AUTOMATION_ENABLED === 'true';
}

export function requireReviewAutomation(res, environment = process.env) {
  if (reviewAutomationEnabled(environment)) return true;
  res.status(503).json({ error: 'review-automation-disabled' });
  return false;
}
