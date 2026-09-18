/**
 * Web-code entrypoint for the audit surface.  This is intentionally distinct
 * from a downloaded Review ZIP: it only warms application code, while review
 * package bytes remain short-lived, signed, and memory-only in ReviewModule.
 */
export async function loadReviewModuleBundle() {
  const [reviewModule, reviewWorkspace, reviewStatusBoard] = await Promise.all([
    import('@/components/Review/ReviewModule'),
    import('@/components/Review/ReviewWorkspace'),
    import('@/components/Review/ReviewStatusBoardPanel'),
  ]);

  return {
    ReviewModule: reviewModule.default,
    ReviewWorkspace: reviewWorkspace.default,
    ReviewStatusBoardPanel: reviewStatusBoard.ReviewStatusBoardPanel,
  };
}
