import type { CategoryNode, ImageReference } from './types';
import type { MigrationChange } from './contractMigration';

/** Never infer old selection intent from a URL, even for a managed library path. */
export function migrateC17Nodes(nodes: CategoryNode[], changes: MigrationChange[]): void {
  const migrate = (reference: ImageReference, path: string) => {
    reference.sourceForm = 'url';
    changes.push({ id: `c16-c17:${path}`, kind: 'default', component: 'render', path,
      message: '新增图片来源形式，按旧版 URL 语义保留；不根据地址猜测图片库。', after: 'url' });
  };
  for (const node of nodes) for (const [geometry, profile] of Object.entries(node.geometryProfiles)) if (profile) {
    for (const rule of profile.zoomPriority.rules) {
      const base = `nodes/${node.nodeId}/geometryProfiles/${geometry}/rules/${rule.id}`;
      const styles = [{ value: rule.style, path: base + '/style' }, ...(rule.conditionalOverrides ?? []).map(branch => ({ value: branch.style, path: `${base}/conditionalOverrides/${branch.id}/style` }))];
      for (const { value, path } of styles) if (value?.pointSymbol?.kind === 'externalImage') {
        const image = value.pointSymbol.image, at = path + '/pointSymbol/image';
        if (image.mode === 'fixed') migrate(image, at + '/sourceForm');
        else if (image.mode === 'valueMap') image.entries.forEach((entry, index) => migrate(entry, `${at}/entries/${index}/sourceForm`));
      }
    }
  }
}
