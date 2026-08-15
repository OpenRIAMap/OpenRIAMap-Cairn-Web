import type { ReviewPackageUploadPort } from './contracts';
import {
  createReviewRevisionUploadRequest,
  createReviewSubmissionIdentity,
  submitReviewPackageRevision,
} from './package';
import { openriamapGithubReviewAuth } from './openriamapReviewAuth';
import { openriamapReviewSubmissionTransport } from './openriamapReviewSubmissionTransport';

function resolveSubmission(result: unknown): { submissionId: string; revisionId: string } {
  if (!result || typeof result !== 'object') throw new Error('review-upload-completion-invalid');
  const value = result as Record<string, unknown>;
  const submissionId = typeof value.submissionId === 'string' ? value.submissionId : '';
  const revisionId = typeof value.currentRevisionId === 'string' ? value.currentRevisionId : '';
  if (!submissionId || !revisionId) throw new Error('review-upload-completion-invalid');
  return { submissionId, revisionId };
}

/**
 * RIA-owned binding for the generic package-upload port. It deliberately uses
 * only Vercel's same-origin broker and a short-lived PUT grant; no browser
 * code receives COS or GitHub credentials.
 */
export const openriamapReviewPackageUploader: ReviewPackageUploadPort = {
  async uploadPackage(input) {
    const session = await openriamapGithubReviewAuth.getSession();
    if (session.status !== 'authenticated' || !session.principalId) {
      if (window.confirm('上传到审核序列需要 GitHub 组织身份。现在前往登录吗？登录后请再次点击“上传到审核序列”。')) {
        openriamapGithubReviewAuth.beginLogin();
      }
      throw new Error('review-login-required');
    }
    if (!window.confirm(`确认上传“${input.packageName}”到审核序列？上传完成后将作为新的待审核包，不会直接发布。`)) {
      throw new Error('review-upload-cancelled');
    }
    const identity = createReviewSubmissionIdentity();
    const request = await createReviewRevisionUploadRequest({
      artifact: { packageName: input.packageName, blob: input.blob },
      identity,
      expectedStateVersion: 0,
      summary: input.summary,
    });
    const result = await submitReviewPackageRevision(openriamapReviewSubmissionTransport, request, { blob: input.blob });
    const resolved = resolveSubmission(result.submission);
    window.dispatchEvent(new CustomEvent('cairn-review-submission-uploaded', { detail: resolved }));
    return { ...resolved, ...(result.alreadySubmitted ? { alreadySubmitted: true } : {}) };
  },
};

export default openriamapReviewPackageUploader;
