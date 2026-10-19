const validationErrors = new Set([
  'invalid-configuration-json', 'invalid-configuration-operation',
  'invalid-configuration-request-id', 'configuration-snapshot-mismatch',
  'invalid-configuration-job', 'invalid-configuration-preflight-receipt',
]);
const timeoutCodes = new Set(['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT']);
const diagnosticCodes = new Set([
  ...timeoutCodes, 'ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN',
  'EHOSTUNREACH', 'ENETUNREACH', 'EPIPE', 'UND_ERR_SOCKET', 'UND_ERR_ABORTED',
  'ERR_TLS_CERT_ALTNAME_INVALID', 'CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
]);
const diagnosticNames = new Set([
  'Error', 'TypeError', 'SyntaxError', 'AggregateError', 'AbortError', 'TimeoutError',
  'ConnectTimeoutError', 'HeadersTimeoutError', 'BodyTimeoutError', 'SocketError',
  'RequestAbortedError',
]);

export class ConfigurationPublicationForwardError extends Error {
  constructor(cause, stage, upstreamStatus) {
    super('configuration-publication-forward-failed', { cause });
    this.name = 'ConfigurationPublicationForwardError';
    this.stage = stage;
    this.upstreamStatus = upstreamStatus;
  }
}

function safeCauses(error) {
  const pending = [error], seen = new Set(), names = new Set(), codes = new Set();
  // Bound traversal even for circular causes or nested AggregateErrors.
  for (let count = 0; pending.length && count < 16; count++) {
    const current = pending.shift();
    if (!current || typeof current !== 'object' || seen.has(current)) continue;
    seen.add(current);
    names.add(diagnosticNames.has(current.name) ? current.name : 'Error');
    if (diagnosticCodes.has(current.code)) codes.add(current.code);
    if (current.cause) pending.push(current.cause);
    if (Array.isArray(current.errors)) pending.push(...current.errors.slice(0, 8));
  }
  return { names: [...names], codes: [...codes] };
}

/** Never expose raw messages, stacks, URLs, headers, or request bodies. */
export function publicationFailure(error, diagnosticId) {
  let status = 500, code = 'configuration-publication-failed';
  let message = '配置发布请求处理失败，请使用诊断编号查看服务日志。';
  let diagnostic = { stage: 'internal' };
  if (error instanceof ConfigurationPublicationForwardError) {
    const causes = safeCauses(error.cause);
    const timedOut = causes.names.includes('TimeoutError') || causes.codes.some(value => timeoutCodes.has(value));
    status = timedOut ? 504 : 502;
    code = timedOut ? 'configuration-publication-upstream-timeout'
      : error.stage === 'response' ? 'configuration-publication-upstream-invalid-response'
        : 'configuration-publication-upstream-unavailable';
    message = (timedOut ? '配置发布服务响应超时。'
      : error.stage === 'response' ? '配置发布服务返回了无法解析的响应。'
        : '配置发布服务暂时无法连接。') + '若刚执行发布，请先查询进度确认任务状态。';
    diagnostic = {
      stage: error.stage, errorName: causes.names[0] ?? 'Error',
      causeNames: causes.names, causeCodes: causes.codes,
      ...(Number.isInteger(error.upstreamStatus) && error.upstreamStatus >= 100 && error.upstreamStatus <= 599
        ? { upstreamStatus: error.upstreamStatus } : {}),
    };
  } else if (validationErrors.has(error?.message)) {
    status = 400; code = error.message;
    message = '配置发布请求格式或候选信息无效，请重新核验。';
    diagnostic = { stage: 'validation' };
  } else if (error?.message === 'configuration-publisher-not-configured') {
    status = 503; code = error.message;
    message = '配置发布服务尚未配置完整。';
    diagnostic = { stage: 'configuration' };
  }
  return { status, payload: { error: code, message, diagnosticId }, diagnostic };
}
