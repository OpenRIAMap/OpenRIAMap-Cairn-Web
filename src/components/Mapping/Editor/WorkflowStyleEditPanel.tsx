import {externalRolePaths} from '@/configStudio/externalBindings';
import {workflowCategoryOptions} from '@/configStudio/workflowCategoryOptions';
import {specializedReferenceSearch} from '../Workflow/specialized/referenceSearch';
import type {ReactNode} from 'react';
import TRPTradeEditor, { type TradeGroup as TRPTradeGroup } from '@/components/Mapping/SpecialInput/TRPTradeEditor';
import WorkflowFeatureSearchSelect from '@/components/Mapping/Workflow/WorkflowFeatureSearchSelect';
import type { WorkflowBridge } from '@/components/Mapping/Workflow/WorkflowHost';
import {
  type ProjectedRegistryField,
  type ProjectedRegistryGroup,
  type ProjectedRegistryScene,
  type RegistryGroupItemFieldDef,
} from '@/components/Common/formProjection';
import {
  CLASSIFICATION_DRAFT_KEY,
  updateUnparsedEntryValue,
  type WorkflowEditorDraftValues,
  type WorkflowEditorUnparsedEntry,
} from '@/components/Common/workflowEditorParser';

const getText = (value: unknown): string => String(value ?? '');

const referenceKey=(field:{path?:string;searchConfigKey?:string})=>({'tags.Land':'landUnit','tags.UAdm':'settlementPoint','tags.UAdmG':'settlementArea'} as Record<string,string>)[field.path??'']??field.searchConfigKey??'';

type Props = {
  idFirst?:boolean;
  classificationContent?:ReactNode;
  extraContent?:ReactNode;
  view: ProjectedRegistryScene;
  values: WorkflowEditorDraftValues;
  unparsedEntries: WorkflowEditorUnparsedEntry[];
  onChangeValue: (path: string, value: unknown) => void;
  onChangeUnparsedEntries: (entries: WorkflowEditorUnparsedEntry[]) => void;
  bridge: WorkflowBridge;
  editorId: string;
  onChangeEditorId: (value: string) => void;
};

const encodeOptionValue = (option: { kind: string; skind: string; skind2: string }): string => {
  return [option.kind ?? '', option.skind ?? '', option.skind2 ?? ''].join('||');
};

const coerceNumberLike = (raw: string): string => raw;

const renderJsonValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null || value === '') return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const normalizeTradeGroupsForEditor = (value: unknown): TRPTradeGroup[] | undefined => {
  if (Array.isArray(value)) return value as TRPTradeGroup[];
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return undefined;
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? (parsed as TRPTradeGroup[]) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

const readGroupItems = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) return item as Record<string, unknown>;
    return { value: item };
  });
};

const defaultGroupFieldValue = (field: RegistryGroupItemFieldDef): unknown => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.control === 'bool') return false;
  if (field.control === 'select') return field.options?.[0]?.value ?? '';
  return '';
};

const makeEmptyGroupItem = (group: ProjectedRegistryGroup): Record<string, unknown> => {
  const item: Record<string, unknown> = {};
  for (const field of group.fields) {
    item[field.key] = defaultGroupFieldValue(field);
  }
  return item;
};

export default function WorkflowStyleEditPanel(props: Props) {
  const {
    view,
    values,
    unparsedEntries,
    onChangeValue,
    onChangeUnparsedEntries,
    bridge,
    editorId,
    onChangeEditorId,
    idFirst=false,classificationContent,extraContent,
  } = props;
  const context=bridge.getCaptureContext?.();
  const classificationOptions=context?workflowCategoryOptions(context.config,externalRolePaths(context.config,context.workflow,'tradePoint')).map(option=>({kind:option.path.kind??'',skind:option.path.skind??'',skind2:option.path.skind2??'',name:option.label,label:option.label,classCode:option.path.class})):[];

  const renderField = (field: ProjectedRegistryField) => {
    const value = values[field.path];
    const label = field.label;
    if(field.control==='select')return <label key={field.path} data-editor-field={field.path} className="mb-2 block text-xs">{label}{field.required?' *':''}<select className="mt-1 w-full rounded border p-1 text-sm" value={getText(value)} onChange={event=>onChangeValue(field.path,event.target.value)}><option value="">请选择</option>{field.options?.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;

    if (field.control === 'bool') {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChangeValue(field.path, e.target.checked)}
          />
          <label className="text-xs font-semibold">{label}</label>
        </div>
      );
    }

    if (field.control === 'number') {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-2">
          <label className="block text-xs font-semibold mb-1">{label}</label>
          <input
            type="number"
            className="w-full border p-1 rounded text-sm"
            placeholder={field.placeholder ?? field.path}
            value={getText(value)}
            onChange={(e) => onChangeValue(field.path, coerceNumberLike(e.target.value))}
          />
        </div>
      );
    }

    if (field.control === 'textarea') {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-2">
          <label className="block text-xs font-semibold mb-1">{label}</label>
          <textarea
            className="w-full border p-1 rounded text-sm"
            rows={field.rows ?? 4}
            placeholder={field.placeholder ?? field.path}
            value={getText(value)}
            onChange={(e) => onChangeValue(field.path, e.target.value)}
          />
        </div>
      );
    }

    if (field.control === 'trpTrade') {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-3">
          <TRPTradeEditor
            value={normalizeTradeGroupsForEditor(value)}
            onChange={(arr) => onChangeValue(field.path, arr)}
          />
        </div>
      );
    }

    if (field.control === 'json') {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-2">
          <label className="block text-xs font-semibold mb-1">{label}</label>
          <textarea
            className="w-full border p-1 rounded font-mono text-xs"
            rows={field.rows ?? 4}
            value={renderJsonValue(value)}
            onChange={(e) => {
              const text = e.target.value;
              try {
                onChangeValue(field.path, text.trim() ? JSON.parse(text) : []);
              } catch {
                onChangeValue(field.path, text);
              }
            }}
          />
        </div>
      );
    }

    if (field.control === 'featureSearch' && field.searchConfigKey) {
      return (
        <div key={field.path} data-editor-field={field.path} className="mb-2">
          <WorkflowFeatureSearchSelect
            bridge={bridge}
            label={label}
            value={getText(value)}
            onChange={(v) => onChangeValue(field.path, v)}
            placeholder={field.placeholder ?? field.path}
            config={specializedReferenceSearch(bridge,referenceKey(field))}
          />
        </div>
      );
    }

    return (
      <div key={field.path} data-editor-field={field.path} className="mb-2">
        <label className="block text-xs font-semibold mb-1">{label}</label>
        <input
          type="text"
          className="w-full border p-1 rounded text-sm"
          placeholder={field.placeholder ?? field.path}
          value={getText(value)}
          onChange={(e) => onChangeValue(field.path, e.target.value)}
        />
      </div>
    );
  };

  const renderGroupItemField = (
    group: ProjectedRegistryGroup,
    item: Record<string, unknown>,
    itemIndex: number,
    field: RegistryGroupItemFieldDef,
    updateItem: (nextItem: Record<string, unknown>) => void
  ) => {
    const value = item[field.key];
    const label = field.labels.editor ?? field.labels.default;
    const fieldKey = `${group.path}:${itemIndex}:${field.key}`;

    if (field.control === 'bool') {
      return (
        <label key={fieldKey} className="flex items-center gap-2 text-xs font-semibold">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => updateItem({ ...item, [field.key]: e.target.checked })}
          />
          {label}
        </label>
      );
    }

    if (field.control === 'select') {
      return (
        <div key={fieldKey}>
          <label className="block text-[11px] font-semibold mb-1">{label}</label>
          <select
            className="w-full border p-1 rounded text-sm"
            value={getText(value)}
            onChange={(e) => updateItem({ ...item, [field.key]: e.target.value })}
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.control === 'number') {
      return (
        <div key={fieldKey}>
          <label className="block text-[11px] font-semibold mb-1">{label}</label>
          <input
            type="number"
            className="w-full border p-1 rounded text-sm"
            placeholder={field.placeholder ?? field.key}
            value={getText(value)}
            onChange={(e) => updateItem({ ...item, [field.key]: e.target.value })}
          />
        </div>
      );
    }

    if (field.control === 'json') {
      return (
        <div key={fieldKey}>
          <label className="block text-[11px] font-semibold mb-1">{label}</label>
          <textarea
            className="w-full border p-1 rounded font-mono text-xs"
            rows={field.rows ?? 3}
            value={renderJsonValue(value)}
            onChange={(e) => {
              const text = e.target.value;
              try {
                updateItem({ ...item, [field.key]: text.trim() ? JSON.parse(text) : [] });
              } catch {
                updateItem({ ...item, [field.key]: text });
              }
            }}
          />
        </div>
      );
    }

    if (field.control === 'featureSearch' && field.searchConfigKey) {
      return (
        <WorkflowFeatureSearchSelect
          key={fieldKey}
          bridge={bridge}
          label={label}
          value={getText(value)}
          onChange={(v) => updateItem({ ...item, [field.key]: v })}
          placeholder={field.placeholder ?? field.key}
          config={specializedReferenceSearch(bridge,referenceKey(field))}
        />
      );
    }

    return (
      <div key={fieldKey}>
        <label className="block text-[11px] font-semibold mb-1">{label}</label>
        <input
          type="text"
          className="w-full border p-1 rounded text-sm"
          placeholder={field.placeholder ?? field.key}
          value={getText(value)}
          onChange={(e) => updateItem({ ...item, [field.key]: e.target.value })}
        />
      </div>
    );
  };

  const renderGroup = (group: ProjectedRegistryGroup) => {
    const items = readGroupItems(values[group.path]);
    const updateItems = (nextItems: Record<string, unknown>[]) => onChangeValue(group.path, nextItems);

    return (
      <div key={group.path} className="mb-3 rounded border bg-white px-3 py-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-bold">{group.label}({group.key})</div>
          <button
            type="button"
            className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
            onClick={() => updateItems([...items, makeEmptyGroupItem(group)])}
          >
            添加
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-xs text-gray-500">暂无条目</div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const updateItem = (nextItem: Record<string, unknown>) => {
                updateItems(items.map((old, i) => (i === index ? nextItem : old)));
              };
              return (
                <div key={`${group.path}:${index}`} className="rounded border bg-gray-50 p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-gray-600">第 {index + 1} 条</div>
                    <button
                      type="button"
                      className="rounded bg-red-500 px-2 py-1 text-[11px] font-semibold text-white"
                      onClick={() => updateItems(items.filter((_, i) => i !== index))}
                    >
                      删除
                    </button>
                  </div>
                  <div className="space-y-2">
                    {group.fields.map((field) => renderGroupItemField(group, item, index, field, updateItem))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const updateUnparsedAt = (index: number, nextText: string) => {
    const next = unparsedEntries.map((entry, i) => (i === index ? updateUnparsedEntryValue(entry, nextText) : entry));
    onChangeUnparsedEntries(next);
  };

  return (
    <div
      className="mt-2 space-y-3"
      onMouseDownCapture={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      onTouchStartCapture={(e) => e.stopPropagation()}
    >
      <div className="rounded border bg-blue-50 px-3 py-2 text-xs text-blue-900">
        当前使用工作流式编辑：{view.displayName}
      </div>

      {idFirst?renderField(view.idField):null}
      {classificationContent??(view.classification && classificationOptions.length > 0 && (
        <div className="mb-2">
          <label className="block text-xs font-semibold mb-1">{view.classification.label}</label>
          <select
            className="w-full border p-1 rounded text-sm"
            value={getText(values[CLASSIFICATION_DRAFT_KEY])}
            onChange={(e) => onChangeValue(CLASSIFICATION_DRAFT_KEY, e.target.value)}
          >
            {classificationOptions.map((option) => {
              const value = encodeOptionValue(option);
              return (
                <option key={`${value}::${option.name}`} value={value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
      ))}

      {!idFirst?renderField(view.idField):null}

      <div className="border-t pt-2">
        {view.fields.length || view.groups.length ? (
          <>
            {view.fields.map(renderField)}
            {view.groups.map(renderGroup)}
          </>
        ) : (
          <div className="text-xs text-gray-500">该注册类型暂无可解析编辑字段</div>
        )}
      </div>

      {extraContent}
      <div className="border-t pt-2">
        <label className="block text-xs font-bold mb-1">编辑者ID</label>
        <input
          className="w-full border p-1 rounded text-sm"
          placeholder="可选：用于写入 CreateBy / ModifityBy"
          value={editorId}
          onChange={(e) => onChangeEditorId(e.target.value)}
        />
        <div className="mt-1 text-[11px] text-gray-500">
          初次绘制完成时（非空）写入 CreateBy；编辑保存时（非空）写入 ModifityBy。
        </div>
      </div>

      {view.allowUnparsedBlock && (
        <div className="border-t pt-2">
          <div className="text-xs font-bold mb-2">无法解析区</div>
          {unparsedEntries.length ? (
            <div className="space-y-2">
              {unparsedEntries.map((entry, index) => (
                <div key={entry.path}>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">{entry.path}</label>
                  {entry.valueKind === 'json' ? (
                    <textarea
                      className="w-full border p-1 rounded font-mono text-xs"
                      rows={4}
                      value={entry.valueText}
                      onChange={(e) => updateUnparsedAt(index, e.target.value)}
                    />
                  ) : (
                    <input
                      className="w-full border p-1 rounded text-sm"
                      value={entry.valueText}
                      onChange={(e) => updateUnparsedAt(index, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500">无无法解析字段</div>
          )}
        </div>
      )}
    </div>
  );
}
