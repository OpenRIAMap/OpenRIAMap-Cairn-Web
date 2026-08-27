import type { ReviewPackageUploadPort } from './contracts';
import {
  createReviewRevisionUploadRequest,
  createReviewSubmissionIdentity,
  saveReviewPackageRevision,
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

function resolveRevisionSubmission(result: unknown): { submissionId: string; revisionId: string; stateVersion: number; revisionCount: number } {
  if (!result || typeof result !== 'object') throw new Error('review-revision-upload-completion-invalid');
  const value = result as Record<string, unknown>;
  const submissionId = typeof value.submissionId === 'string' ? value.submissionId : '';
  const revisionId = typeof value.currentRevisionId === 'string' ? value.currentRevisionId : '';
  const stateVersion = typeof value.stateVersion === 'number' && Number.isSafeInteger(value.stateVersion) && value.stateVersion >= 0
    ? value.stateVersion
    : -1;
  const revisionCount = Array.isArray(value.revisions) ? value.revisions.length : -1;
  if (!submissionId || !revisionId || stateVersion < 0 || revisionCount < 1) throw new Error('review-revision-upload-completion-invalid');
  return { submissionId, revisionId, stateVersion, revisionCount };
}

export type RiaReviewRevisionUploadInput = {
  packageName: string;
  blob: Blob;
  summary?: string;
  submissionId: string;
  revisionCount: number;
  expectedStateVersion: number;
  onProgress?: (stage: 'building-request' | 'requesting-upload' | 'uploading' | 'finalizing' | 'completed') => void;
};

export type RiaReviewRevisionUploadResult = {
  submissionId: string;
  revisionId: string;
  stateVersion: number;
  revisionCount: number;
};

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

/**
 * RIA binding for the generic immutable-revision protocol. Browser code sends
 * bytes only to a broker-issued short-lived PUT URL and never receives cloud
 * credentials. A stale state version is rejected by the completion endpoint.
 */
export async function uploadRiaReviewRevision(input: RiaReviewRevisionUploadInput): Promise<RiaReviewRevisionUploadResult> {
  const session = await openriamapGithubReviewAuth.getSession();
  if (session.status !== 'authenticated' || !session.principalId) {
    if (window.confirm('保存审核修改需要 GitHub 组织身份。现在前往登录吗？登录后请重新执行保存。')) {
      openriamapGithubReviewAuth.beginLogin();
    }
    throw new Error('review-login-required');
  }
  if (!window.confirm(`确认保存审核修改？这会为当前审核包创建第 ${input.revisionCount + 1} 个不可变版本，原版本会保留。`)) {
    throw new Error('review-revision-save-cancelled');
  }

  const saved = await saveReviewPackageRevision({
    artifact: { packageName: input.packageName, blob: input.blob },
    submissionId: input.submissionId,
    revisionCount: input.revisionCount,
    expectedStateVersion: input.expectedStateVersion,
    summary: input.summary,
    transport: openriamapReviewSubmissionTransport,
    onProgress: input.onProgress,
  });
  const resolved = resolveRevisionSubmission(saved.result.submission);
  window.dispatchEvent(new CustomEvent('cairn-review-submission-uploaded', { detail: resolved }));
  return resolved;
}

export default openriamapReviewPackageUploader;
