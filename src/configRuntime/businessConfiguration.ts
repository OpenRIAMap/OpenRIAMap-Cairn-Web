import { assertConfigurationIdentity, getFormalConfiguration, type ConfigurationIdentity } from './formalConfiguration';
import { requestReviewConfirmation } from '../components/Review/ReviewConfirmationHost';

const identityKeys = ['projectId', 'packageId', 'contractRevision', 'revision', 'configSha256', 'manifestSha256', 'releaseId'] as const;
export function businessIdentitiesMatch(web: ConfigurationIdentity, active: ConfigurationIdentity) { return identityKeys.every(key => web[key] === active[key]); }
function describe(value?: ConfigurationIdentity) { return value ? `${value.projectId} / ${value.packageId}\n配置 r${value.revision} · 契约 c${value.contractRevision}\n发布：${value.releaseId}\nSHA-256：${value.configSha256}` : '未获得可验证身份'; }
/** Called only at review admission / relay upload. No pass cache, timer, startup or capture-revision gate. */
export async function checkBusinessConfiguration(fetcher: typeof fetch = fetch, web: ConfigurationIdentity | undefined = getFormalConfiguration()?.identity): Promise<void> {
  if (!web) throw Error('当前 Web 没有已核验的正式配置身份；请回到正式地图后重试。');
  let active: ConfigurationIdentity;
  try {
    const response = await fetcher('/api/configuration?purpose=business', { cache: 'no-store', signal: AbortSignal.timeout(18000) });
    if (!response.ok || response.headers.get('x-cairn-configuration-authority') !== 'scf') throw Error(`无法取得 SCF 生效身份（HTTP ${response.status}）`);
    const value: unknown = await response.json(); assertConfigurationIdentity(value); active = value;
  } catch (error) { throw Error(`无法确认 SCF 与当前 Web 的配置一致，已阻断本次远端业务。\n${String(error)}\n普通地图和本地保存可继续使用；网络或部署恢复后请重试。`); }
  if (!businessIdentitiesMatch(web, active)) throw Error(`当前 Web 与 SCF 的生效配置不一致，已阻断本次远端业务。\n\nWeb：\n${describe(web)}\n\nSCF：\n${describe(active)}\n\n请完成配置部署并刷新当前 Web 后重试；本地编辑内容可先保存或下载。`);
}
export async function requireBusinessConfiguration(): Promise<void> {
  try { await checkBusinessConfiguration(); }
  catch (error) { await requestReviewConfirmation({ title: '配置一致性检查未通过', message: error instanceof Error ? error.message : String(error), confirmLabel: '关闭', cancelLabel: '返回', tone: 'rose' }); throw error; }
}
