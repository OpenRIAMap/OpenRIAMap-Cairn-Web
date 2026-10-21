# 路径规划设置与共享铁路角色 · 契约 r13

本轮依据已批准的《路径规划设置与对照表折叠升级蓝图 v1.1》实现。r13 是配置读取契约；内容 revision 仍由发布端自动递增。代码上线不会自动升级当前配置，也不改写世界数据。

## 编辑位置和操作

- **总体规则 → 路径规划设置**：铁路、传送、道路的入口开关、名称、基础参数、分类参与范围；通用鞘翅／步行速度。沿用该分区的读取、核验、保存、放弃草稿。
- **总体规则 → 其他应用设置 → 共享铁路角色定义**：线路、站台、站场、车站的全站角色。搜索、信息卡及共享关系索引使用此处的完整范围。
- **要素设计 → 预留对照表格**：每张表独立展开／收起，显示 ID、行数及引用数。既有表初始收起，新建及错误定位自动展开；折叠状态不进入配置文件。
- JSON 字段高级设置新增已注册的值结构模板及只读详情。它声明现有固定解析器可消费的结构，不开放算法编程。

普通编辑仍按各区核验保存，最后顶部全局核验。迁移／导入通过整包候选跨区暂存，最后顶部“核验整包草稿 → 保存整包草稿”；候选未保存前不替换本地活动配置。

## JSON 对照表

路径以下均相对于完整 `config.json`，不能把局部示例单独上传。

| 路径 | 类型／含义 | 初始值及约束 |
| --- | --- | --- |
| `contractRevision` | 整数，最低读取能力 | 13；仍可读取 r11／r12 |
| `application.preferences.railwayRoles.schemaVersion` | 共享角色结构版本 | `cairnmap.railway-roles.v1` |
| `application.preferences.railwayRoles.selectors` | 四角色的共享范围 S | `lines=RLE`、`platforms=PLF`、`stationAreas=STA`、`stations=STB+SBP` |
| `application.navigation.schemaVersion` | 导航结构版本 | `cairnmap.navigation.v1` |
| `application.navigation.rail.enabled/name` | 开关／zh、en 名称 | 默认启用，铁路（新）；至少一种语言非空 |
| `application.navigation.rail.selectors` | 四角色的导航参与范围 N | 默认同 S，但独立保存；逐角色 N⊆S |
| `application.navigation.rail.parameters.transferWalkSpeed` | 站内步行，方块/秒 | 迁移复制旧值，本次基线为 3；正有限数 |
| `…railRideSpeed` | 铁路乘坐，方块/秒 | 原值 16；正有限数 |
| `…transferCostFactor` | 换乘距离成本除数 | 原值 1；正有限数 |
| `…normalPlatformTransferCost` | 普通同台换乘成本，秒 | 原值 5；非负有限数，允许 0 |
| `application.navigation.teleport.enabled/name` | 传送开关及名称 | 默认启用，传送（新） |
| `application.navigation.teleport.hubTableId` | 实时引用的表 ID | `teleport-hubs`；文本值、`functionKind=teleportHub` |
| `application.navigation.teleport.selectors` | 传送点／Warp 范围 | `teleportPoints=TPP`、`warpPoints=WRP` |
| `application.navigation.road.enabled/name` | 道路开关及名称 | 默认启用，道路 |
| `application.navigation.road.travelModesTableId` | 实时引用的表 ID | `road-travel-modes`；文本值、`functionKind=speed` |
| `application.navigation.road.selectors.roads` | 道路参与范围 | ROD |
| `application.navigation.common.elytraSpeed` | 通用鞘翅速度，方块/秒 | 40；正有限数 |
| `application.navigation.common.walkSpeed` | 通用步行速度，方块/秒 | 4.317；正有限数 |
| `nodes[].fields[].valueSchema` | 有限复杂值结构声明 | 单值 JSON 容器；数组是容器内容，不能误改 cardinality 为 multiple |

四级分类行使用 `{ "class":"RLE", "kind":"…", "skind":"…", "skind2":"…" }`。Class 必填，后级连续；省略后级表示全部下辖。一行取交集，多行取并集；空数组表示空范围。导航不根据地图 Zoom、当前屏幕或按钮显隐裁剪。

两层配置局部示例：

```json
{
  "preferences": {
    "railwayRoles": {
      "schemaVersion": "cairnmap.railway-roles.v1",
      "selectors": {
        "lines": [{ "class": "RLE" }],
        "platforms": [{ "class": "PLF" }],
        "stationAreas": [{ "class": "STA" }],
        "stations": [{ "class": "STB" }, { "class": "SBP" }]
      }
    }
  },
  "navigation": {
    "schemaVersion": "cairnmap.navigation.v1",
    "rail": {
      "enabled": true,
      "name": { "zh": "铁路（新）", "en": "" },
      "parameters": {
        "transferWalkSpeed": 3,
        "railRideSpeed": 16,
        "transferCostFactor": 1,
        "normalPlatformTransferCost": 5
      },
      "selectors": {
        "lines": [{ "class": "RLE" }],
        "platforms": [{ "class": "PLF" }],
        "stationAreas": [{ "class": "STA" }],
        "stations": [{ "class": "STB" }, { "class": "SBP" }]
      }
    },
    "teleport": {
      "enabled": true,
      "name": { "zh": "传送（新）", "en": "" },
      "hubTableId": "teleport-hubs",
      "selectors": { "teleportPoints": [{ "class": "TPP" }], "warpPoints": [{ "class": "WRP" }] }
    },
    "road": {
      "enabled": true,
      "name": { "zh": "道路", "en": "" },
      "travelModesTableId": "road-travel-modes",
      "selectors": { "roads": [{ "class": "ROD" }] }
    },
    "common": { "elytraSpeed": 40, "walkSpeed": 4.317 }
  }
}
```

上例省略 application 其余属性。r13 删除旧 `application.preferences.navigation`，新旧参数不能并存。关闭模块保留配置，空绑定仅可在对应模块关闭时使用；已有非空引用仍必须有效。

## 功能表和数据解释

枢纽表的行存储值是 hub 代码，功能值含 world、range 及 returnPoints。当前世界只展开匹配世界的返回点；无点仅禁用返回主城，不关闭传送导航。道路表的行存储值是 Mode 代码，label 用于显示，functionValue 是速度。修改表后所有引用直接读取新表；自定义表改 ID 同步引用，仍被引用的表不能删除。

道路合法 Speed 优先于选中模式的表速度；未设置 Mode 不限制出行方式，填写未知 Mode 明确报错，不能因过滤为空而变成全部畅通。道路表 WALK=4.3 与通用步行 4.317 各有用途，铁路站内步行仍为其专用参数。

| 值结构模板 | 已支持的内容 |
| --- | --- |
| `rail-lines` | 线路 ID 文本或带 ID 的对象数组；已知可用状态、上下车、越行等字段为布尔，stationDistance 为数值 |
| `rail-platforms` / `rail-stations` | ID 文本或 `{ID}` 引用数组 |
| `road-modes` | `[code]`、`[[code]]`、带 code／tgt／ID／id 的对象数组 |
| `road-connections` | mode／Lot 为 endpoint 或 middle，tgt／Tgt 为目标 ID；支持现有大小写组合 |
| `road-blacklist` | ID 文本、嵌套文本数组或带 tgt／ID／id 的对象数组 |
| `target-point` | x、z 必需，y 可选的有限数值坐标对象 |

声明支持 type、anyOf、properties、required、items、enum、minItems／maxItems、minimum／exclusiveMinimum。禁止远程引用和可执行内容，限制结构深度、分支及实际值规模。导航指定的复杂字段必须使用对应注册模板；其他 JSON 字段可按有限声明核验。工作流静态已知不兼容结构阻断，无法确定的动态结构提示试运行，实际采集和 SCF 提交继续检查具体值。

## 范围、关系与缓存

`railNewIndex` 使用 S，导航图使用 N。改 N／速度／开关不重建或裁剪共享索引；改 S 更新共享调用方，并核验原 N。修改显示名称不重建导航图。图缓存包含世界、有效数据来源／发布身份、参数、表格与范围；切换后旧结果与高亮清除，异步旧结果不得回写。

静态检查覆盖分类存在性、继承后的字段及几何、角色重叠、N⊆S、字段引用、枚举域、功能表及数值。已挂载数据再检查 ID／Warp 键唯一、铁路关联、道路连接、传送目标、hub 与具体结构。合法目标在导航范围外时排除相关边并报告，不自动补入。

普通地图启动不新增 SCF 请求，审核／上传入口仍检查 SCF 与 Web 正式身份。未加载世界没有执行数据级检查；保存配置不会为此拉取全部世界。

## 本地复核

```powershell
npm run test:navigation-r13
npm run test:native-contract-schema
node scripts/config-tools/build-server-validation.mjs --check
npm run build
```

固定离线夹具经过真实 formal-release-v2 完整性加载、共享索引及三类算法，不发外部网络请求。浏览器脚本在独立端口及配置中验收真实工作台、逐表折叠和真实导航面板。正式 GitHub 登录、SCF 上传及云端全部世界验证需按部署交接执行，离线通过不等同于已完成线上验收。

候选生成：`npx tsx --tsconfig tsconfig.app.json scripts/config-tools/prepare-navigation-r13.ts <输出目录>`。它从仓库当前 current 的精确摘要生成候选、差异及 SHA256，不改正式指针；通过 JSON／ZIP 和服务端归档回读。
