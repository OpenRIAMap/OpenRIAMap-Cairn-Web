/** Chinese reading notes, independent of executable application configuration. */
const text = `
schemaVersion|文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。
contractRevision|配置契约版本；控制结构兼容和迁移，当前为 11，不能用它冒充保存版本。
packageId|整包稳定身份；本地历史与导入使用此标识区分配置包。
projectId|所属项目的稳定标识。
revision|同一配置包的保存修订号；当前为 7，保存新版本须满足递增要求。
displayName|整包显示名是 zh/en 对象；搜索延伸区域的同名键是显示胶囊名称的布尔值，须按对象判读。
sourceManifestSha256|原始迁移来源清单的 SHA-256 摘要；不是整包当前内容的散列。
engine|全局引擎默认设置，供分类渲染与交互解析。
registries|可用布局、组件与受控能力的登记清单；登记不等于任意代码可执行。
lookupTables|公共对照表数组；字段、信息卡和工作流可按表格 ID 引用。
application|总体规则：世界、来源组、图层按钮、模块、审核及偏好。
nodes|分类节点数组；通过 path 和 children 表达分类树，而非把节点嵌套存储。
contextBindings|旧式指定双方分类的上下文绑定；当前默认空数组，现用 fieldSettings.structure。
workflows|工作流定义数组；包含组合式采集、外部方案和专供编辑方案。
parity|与 V1 来源的迁移对齐凭证；不是地图数据或实际渲染规则。
zh|中文名称或说明；不能把实际存储值改写为此显示文本。
en|英文名称或说明；空字符串在当前配置中很常见，具体显示依使用方回退。
field|所引用的数据字段路径；不同位置的可用字段集由对应分类限定。
assignment|系统世界字段的赋值方式；activeWorld 表示当前活动世界。
required|是否必填；系统 World 设置中固定为 true，其他位置按控件或字段解释。
world|引擎的 World 写入约定，或功能行内的目标世界 ID。
contextView|主附属结构视角的全局激活门槛与距离。
minZoom|最小缩放边界；渲染原生规则为含端点，优先读取 when.zoom。
maxZoom|最大缩放边界；渲染原生规则为含端点，优先读取 when.zoom。
activationRadiusPx|激活主结构上下文的屏幕距离，单位像素。
retainRadiusPx|已激活主结构上下文的保留距离，单位像素。
screenGateDefaults|屏幕尺度门槛默认值；规则可继承或明确覆盖。
polygonMinScreenAreaPx|面要素投影到屏幕后的最小面积，单位 px²。
lineMinScreenLengthPx|线要素投影到屏幕后的最小长度，单位 px。
interactionBaselines|点、线、面的全局交互外观基线。
Point|点几何配置键；与 LineString、Polygon 区分。
LineString|线几何配置键；最终记录可具有多个线部件。
Polygon|面几何配置键；外部件与部件内孔环是两个层级。
hover|鼠标悬停状态的交互外观。
selected|选中状态的外观；在工作流 geometry 中则表示固定几何类型。
searchResult|搜索命中状态的交互外观。
editing|编辑状态的交互外观。
deletionMarked|标记删除状态的交互外观。
enabled|启用标记；false 不等于删除定义，具体作用范围取决于所在模块。
symbol|交互点标记配置；并非源几何坐标。
radius|圆形符号半径。
size|符号/文字尺寸或按钮尺寸；单位与数组结构见当前对象类型。
outline|交互覆盖的轮廓线描述。
color|固定颜色文本；可用颜色语法仍须通过实际核验。
width|轮廓宽度或边界框宽度修正；具体由所在对象解释。
height|边界框高度修正，或绘制绑定返回有效高度。
opacity|整体或局部不透明度；通常 0–1。
strokeColor|交互覆盖的描边固定颜色。
strokeColorBinding|交互描边颜色的取值方式，可按字段、关系或值对照求色。
strokeWidth|交互描边宽度，单位像素。
strokeOpacity|描边不透明度，0 为透明，1 为不透明。
fillColor|交互覆盖的固定填充色。
fillOpacity|填充不透明度，0 为透明，1 为不透明。
zIndexOffset|在基础图层顺序上叠加的偏移量；不等于 Label 碰撞优先级。
forceShowLabel|此交互状态请求保留标签，不修改标签文字来源。
labelPriority|交互状态给 Label 的碰撞优先分数。
hitTolerancePx|点击/命中的屏幕容差，单位像素。
mode|当前联合结构的分支选择器；先看 mode，再解释其余字段。
entries|按值设色的逐行条目，或迁移对齐报告中的逐项记录。
value|最终存储值、条件比较值或常量；是否字符串须看当前类型声明。
fallbackColor|主颜色来源无效时使用的回退颜色。
target|目标分类范围，或输出赋值的目标字段路径；二者不能混用。
targetIdField|本记录中保存外部目标 ID 的字段。
targetColorField|外部目标记录中提供颜色的字段。
strategy|关系取色或几何锚点的解析策略。
class|分类路径第一级 Class；此处键名小写，实际要素记录使用 Class。
kind|分类路径第二级，或条件/控件的分支种类；依所在对象判读。
skind|分类路径第三级；实际新要素记录使用 SKind。
skind2|分类路径第四级；实际新要素记录使用 SKind2。
paneDefaults|语义图层名称到实际绘制 pane 的默认映射。
overlay|普通覆盖图层的 pane 名。
overlay-top|较高层覆盖图层的 pane 名。
point|点图层的 pane 名、交互触发标记或单点返回值，依所在对象判读。
point-top|较高层点图层的 pane 名。
renderDefaults|按几何类型设置的渲染扩展默认值；规则局部值再覆盖。
screenGate|当前规则的屏幕尺度门槛设置。
minScreenAreaPx|最小屏幕面积，单位 px²；在候选设置中只限制标签候选。
minScreenLengthPx|最小屏幕线长，单位 px。
pane|绘制 pane；控制真实绘制层级，不能代替碰撞分数。
labelText|标签截断、多行、空文字和透明度处理。
maxChars|标签最多保留的字符数。
minChars|标签缩写或截断时最少保留字符数。
multiline|是否允许标签多行显示。
maxLines|标签最多显示行数。
suffix|截断后追加的字符，如省略号。
abbreviationEnabled|是否允许标签缩写处理。
emptyBehavior|标签无有效文字时的处理分支。
lineLabel|沿线文字的候选、方向、曲线与回退设置。
profile|沿线文字预设或主附属上下文显示预设；由所在对象区分。
endpointPaddingRatio|沿线标签距离端点的比例留白。
endpointPaddingMinPx|沿线标签距离端点的最小像素留白。
maxTurnAngleDeg|候选位置允许的最大转角，单位度。
minLengthPx|候选所需的最小屏幕长度，单位像素。
textMode|自动、旋转文字或沿 SVG 路径文字的选择。
anchorSamples|沿线锚点采样数量。
candidateSpacing|沿线候选之间的间隔参数；由当前候选算法解释。
candidateMinSpacing|候选间隔的下限。
candidateMax|单次沿线候选数量上限。
shortThresholdMultiplier|判断短线文本适配的长度倍率。
longMode|长线候选分配方式，当前可选 evenSplit。
preferPreviousCandidate|优先复用上一次合法候选以减少跳动。
candidateHysteresisPx|候选切换滞后距离，单位像素。
textPathMinLengthPx|使用路径文字所需的最小屏幕长度。
textPathPaddingPx|路径文字边缘留白，单位像素。
textPathMaxAngleDeltaDeg|路径相邻片段最大方向差，单位度。
textPathMaxTotalBendDeg|文字覆盖路径允许的累计弯曲角度。
textPathPreferReadableDirection|路径文字优先采用便于阅读的方向。
textPathFallback|路径文字失败后的回退渲染方式。
textPathCollisionPaddingPx|路径文字碰撞边界额外留白，单位像素。
textPathLetterSpacingPx|路径文字基础字间距，单位像素。
textPathCurvedLetterSpacingPx|曲线路径文字使用的字间距，单位像素。
textPathCurvedSpacingMinBendDeg|触发曲线字间距的最小弯曲角度。
orientationPolicy|中日韩文字直立、始终路径文字或始终旋转的方向策略。
textPathVerticalAngleThresholdDeg|判断路径适合竖排的角度门槛。
textPathVerticalLengthRatio|竖排路径可用长度与文本长度的比例门槛。
candidateOrdering|候选按起终点顺序或从中心向外排列。
candidateWeightMode|候选是否按距中心距离加权。
candidateSwitchThreshold|改选沿线候选所需的优势门槛。
candidateReuseBonus|旧沿线候选的复用评分加成。
candidateViewportPreference|沿线候选评分是否偏好当前视窗。
candidateEdgePenalty|沿线候选靠近视窗边缘的扣分。
centerWeightMode|中心选择的加权方式。
centerSwitchThreshold|中心位置切换门槛。
centerReuseBonus|旧中心位置复用加分。
cjkVerticalRenderMode|中日韩竖排实现方式。
svgVerticalCjkMinLengthPx|SVG 中文竖排的最小屏幕长度。
svgVerticalCjkLetterSpacingPx|SVG 中文竖排字间距，单位像素。
advancedTextEnabled|启用较复杂的沿线文字求解。
advancedTextBudgetGroup|复杂文字求解所属的计算预算组。
advancedTextMaxLabels|复杂文字求解允许处理的标签数量上限。
advancedTextMaxCandidatesPerPass|一次复杂求解可处理的候选数量上限。
cjkGlyphRotationPolicy|中文单字随线旋转或保持直立的策略。
cjkGlyphUprightAngleThresholdDeg|中文单字保持直立的倾角门槛。
cjkGlyphPathMode|中文逐字沿线路径模式。
cjkGlyphSpacingPx|中文逐字路径字间距，单位像素。
cjkGlyphCollisionPaddingPx|中文逐字碰撞边界留白，单位像素。
cjkGlyphMinPathLengthPx|中文逐字模式的最小路径长度。
cjkGlyphMaxCount|中文逐字模式的字数上限。
cjkGlyphMaxAngleDeltaDeg|相邻中文单字路径方向差上限。
cjkGlyphMaxTotalBendDeg|中文逐字路径累计弯曲角度上限。
cjkGlyphPreferReadableDirection|中文逐字路径优先使用可读方向。
cjkGlyphAllowTextPathFallback|中文逐字失败后是否允许回退普通路径文字。
textPathHalfLengthMultiplier|文字路径半长度的放大倍率。
textPathMinHalfLengthWorld|文字路径半长度的世界坐标下限。
textPathMaxHalfLengthWorld|文字路径半长度的世界坐标上限。
textPathMaxHalfLengthRatio|半路径长度相对源路径长度的上限比例。
textCollisionRectMode|路径文字碰撞矩形的计算方式。
cjkGlyphCompactMode|中文逐字碰撞紧凑模式。
cjkGlyphMinAdvanceScale|中文逐字推进距离的最小缩放比例。
cjkGlyphFallbackMode|中文逐字模式失败后的回退策略。
simpleFallbackEnabled|是否允许简化的沿线文字回退。
simpleFallbackRotate|简化回退文字是否随线旋转。
repositionMode|碰撞后是否沿线尝试重新定位。
repositionAttemptsPerDirection|沿线每个方向的重定位尝试次数。
repositionStepMode|重定位步长按标签跨度、世界距离或屏幕像素计算。
repositionFailure|重定位全部失败后的处理。
repositionStrictSvg|重定位时是否限定严格 SVG 路径方案。
avoidLineGeometry|重定位时是否避让线几何。
avoidPolygonGeometry|重定位时是否避让面几何。
avoidPointSymbols|重定位时是否避让点符号。
repositionCollisionScope|沿线重定位需要考虑的碰撞类别集合。
viewportRectMode|用于视窗判断的文字边界矩形计算方式。
viewportCandidateMode|视窗局部候选的回退策略。
viewportCandidateBufferPx|视窗候选缓冲距离，单位像素。
viewportCandidateMaxTargets|视窗回退候选的目标数量上限。
viewportCandidateMinIntervalPx|视窗候选的最小屏幕间隔。
anchor|多部件锚点模式，或规则内详细锚点设置；先看它是字符串还是对象。
candidatePlacement|候选相对既有方向偏移，或围绕几何锚点分布。
candidates|允许尝试的方位候选集合。
offsetPx|屏幕像素偏移对象，含 x/y。
x|X 坐标或水平像素偏移；由所在坐标/偏移对象区分。
y|世界高度坐标或垂直像素偏移；地图平面第二轴通常是 z。
z|世界 Z 平面坐标；不是几何图层 zLevel。
candidateOffsetsPx|可命名的额外屏幕候选偏移数组。
name|候选名称、署名名称等人类可读文本；不是稳定 ID。
allowOutsideGeometry|是否允许标签候选位于源几何外侧。
requireInsideGeometry|是否要求标签候选位于源几何内部。
preferViewportCenter|候选是否偏好当前视窗中心。
polygonCandidates|面要素标签候选的生成与筛选设置。
weightMode|候选加权方式。
weightedSwitchThreshold|加权候选切换的优势门槛。
reuseBonus|复用旧候选的评分加成。
viewportPreference|是否偏好位于当前视窗内的候选。
edgePenalty|候选靠近视窗边缘的扣分。
count|候选生成数量。
gridSize|候选网格的尺度参数；单位须结合生成模式读取。
gridMinSize|候选网格最小尺度。
maxCandidates|候选总数量上限。
scanMax|候选扫描/筛选预算上限。
overflow|候选超额后的裁剪方式。
switchThreshold|改选候选所需的优势门槛。
allowViewportFallback|是否允许退回视窗局部候选。
collision|Label 碰撞角色或详细碰撞扩展；不控制真实几何层级。
boundsAdjustment|碰撞边界的 x/y/width/height 修正。
collideWith|当前对象需要避让的对象类别。
blocks|当前对象会阻挡哪些类别的标签。
allowOverlap|是否允许重叠显示。
paddingPx|碰撞边界额外留白，单位像素。
hidePolicy|碰撞失败时隐藏、缩写、强显或仅几何等策略。
stability|标签候选缓存、失效和抗跳动设置。
cacheKey|稳定候选缓存的上下文组成。
zoomBucketSize|用于稳定缓存的 Zoom 分桶宽度。
freezeDuringPan|地图平移期间是否暂时保留旧候选。
recomputeOnMoveEnd|平移结束后是否重算候选。
recomputeOnZoomEnd|缩放结束后是否重新核验候选。
hysteresisPx|稳定位置的滞后距离，单位像素。
keepPreviousCandidate|是否保留上一轮候选。
keepPreviousAnchor|是否保留上一轮几何锚点。
invalidateWhen|触发候选缓存失效的事件集合。
density|按屏幕网格控制标签/符号数量的策略。
gridSizePx|密度网格边长，单位屏幕像素。
maxLabelsPerGrid|每个密度网格允许的标签数量。
maxSymbolsPerGrid|每个密度网格允许的符号数量。
reduceOrder|超出密度预算时依次采用的降级步骤。
importanceField|从本记录读取重要程度的字段。
preserveSelected|密度降级时是否优先保留选中目标。
preserveRequired|密度降级时是否优先保留必显标签。
fallback|回退策略对象，或默认启用按钮 ID 列表，依所在模块解释。
whenNoLabelText|没有可用标签文字时的回退处理。
whenCollisionFailed|碰撞求解失败后的回退处理。
whenRuleMissing|没有适用规则时的回退；不能默认理解为一定隐藏。
whenGeometryInvalid|源几何无效时的处理方式。
visibility|关系可见性扩展，或附属结构显示策略。
sameId|根据相同 ID 的其他分类记录是否存在控制可见性。
sourceField|当前记录用于匹配关系的字段。
targetField|目标记录用于匹配或筛选的字段。
behavior|存在性判断行为，或按钮互斥/联动设置。
coincidentPoint|根据同位置目标点是否存在控制可见性。
targetEquals|目标记录指定字段需等于的文本值。
targetNotEquals|目标记录指定字段需不等于的文本值。
precision|几何/位置比较精度参数。
lineContainmentChoice|根据低/高 Zoom 与线覆盖关系选择展示线。
primaryValue|低 Zoom 主要展示的字段值。
overlayValues|达到切换 Zoom 后可选的覆盖展示值集合。
switchZoom|关系可见性策略切换所用的逻辑 Zoom。
activeContextMember|仅在当前主结构与层级上下文中显示成员。
bindingId|旧上下文绑定的稳定 ID；不是任意字段名。
requireSelector|是否必须存在有效层级选择才显示成员。
interaction|本几何的命中触发器，或规则内交互外观覆盖。
optionSets|旧式共享选项登记；当前公共表使用 lookupTables。
id|当前对象的稳定标识；唯一性范围取决于对象类型。
label|名称对象或 Label 样式对象；必须结合所在路径解读。
options|控件本地选项数组、组件设置对象等；不能跨对象套用。
cardLayouts|受控信息卡布局登记表。
cardComponents|允许使用的代码信息卡组件登记表。
displayProfiles|迁移/登记用的显示能力清单。
specialDisplayLogic|受控特殊显示能力的登记清单。
workflowControls|受控工作流控件类型登记表。
workflowBlocks|受控外部工作流单元登记表。
allowedClasses|组件允许服务的 Class 代码集合。
optionSchema|受控组件可编辑选项的结构说明。
key|真实数据字段路径或重复组成员键；不等于 fieldId。
type|数据类型，或受控组件选项的输入类型。
valueType|对照表实际存储标量的类型；行内 value 仍用文本编码。
functionKind|公共表功能值的用途：普通、速度、枢纽或标签字段定义。
rows|公共表/本地表的行数组，或文字控件行高；以所在类型区分。
functionValue|公共表的功能值，可为数字、枢纽参数或标签字段元数据。
format|字段/显示格式；只允许当前类型枚举中的受控格式。
valueTable|标签字段内部携带的本地选项表。
valueTableId|标签字段选项引用的公共表 ID。
range|枢纽功能值的范围参数；保留现有 V1 功能语义。
returnPoints|枢纽的候选返回点数组。
worlds|可用世界数组；每个世界按来源组解析资源。
prefix|世界 ID 组装前缀或瓦片文件前缀，二者含义不同。
numericCode|世界的数值编号。
default|是否为该列表默认项；不是字段默认输入值。
center|地图默认中心的世界 x/y/z 坐标。
mapLink|该世界对应的地图链接。
remoteWorldId|来源服务使用的世界标签；省略时使用本地 world.id。
dataSourceId|旧式每世界直接绑定的数据源 ID；来源组模式下不得同时保存。
projection|旧式世界投影显式配置；来源组模式以默认机制解析。
projectionOverride|特殊世界的投影覆写；普通世界无需列出默认矩阵。
worldToMap|世界坐标到地图投影的 9 项变换参数；普通世界不需手填。
mapToWorld|地图投影到世界坐标的 9 项反向参数；普通世界不需手填。
mapzoomin|Dynmap 投影内部放大级数；与共享逻辑 Zoom 分开。
mapzoomout|Dynmap 投影内部缩小级数；与共享逻辑 Zoom 分开。
tileSize|Dynmap 投影瓦片尺寸；当前契约固定 128。
tilescale|Dynmap 投影内部瓦片尺度参数。
tiles|瓦片来源设置；新配置通常位于来源组内。
baseUrl|数据访问/链接模式的根地址，或旧式瓦片地址。
filteredBaseUrl|旧式已过滤/代理瓦片地址；新模式由来源组代理注册解析。
imageFormat|瓦片图片格式 jpg/png/webp。
extraZoomLevels|瓦片额外缩放级数；不改变逻辑 Zoom 的 0–8 范围。
minNativeZoom|原生瓦片下限，采用映射后的 Leaflet Zoom。
maxNativeZoom|原生瓦片上限，采用映射后的 Leaflet Zoom。
attribution|瓦片署名对象；旧格式也可能是 HTML 文本。
maxRetries|资源请求失败后的最大重试次数。
retryDelay|重试间隔，单位毫秒。
buttons|图层按钮及默认选择、互斥和状态保存设置。
storageKey|浏览器持久状态存储键；不是后端接口或数据仓库。
legacyStorageKeys|仅用于读取旧浏览器状态的历史键名列表。
maxActive|同时启用图层按钮的数量上限。
byWorld|以世界 ID 为键的默认启用按钮列表。
items|当前模块的项目数组；项目结构由所在类型说明。
names|图层按钮的中英文显示名称。
group|按钮视觉分组，或重复字段组定义。
tone|受控按钮配色方案键。
iconKey|受控 SVG 图标键；并非任意外部图片地址。
defaultEnabled|按钮默认启用状态，仍受默认列表与状态恢复策略影响。
criteria|图层按钮筛选要素的分类范围。
paths|分类路径范围数组；一行内部各层同时满足，多行之间取并集。
classCode|旧式 Class 过滤列表或字段引用的 Class 目标；先看所属结构。
exclusiveWith|与当前按钮/模块互斥的稳定 ID 列表。
exclusiveGroup|互斥分组名称；同组按按钮算法限制共存。
linkedButtons|当前按钮启用时对其他按钮执行的联动。
targetId|联动的目标按钮 ID。
disableWhenEnabled|当前按钮启用时需关闭的其他按钮 ID 列表。
enableWhenEnabled|当前按钮启用时需开启的其他按钮 ID 列表。
persistState|是否保存按钮开关状态。
sources|数据读取设置；新配置使用 world-groups 来源组形式。
defaultSourceId|当前来源组内默认数据源 ID。
selectionMode|数据源选择方式：固定、用户可选或故障时可选。
retryOnFailure|读取失败时是否允许重试。
selectable|数据源是否作为可选入口显示。
readerKind|数据读取器标识；当前仅正式发布读取器 formal-release-v2。
readerSchemaVersion|正式发布读取协议版本标记。
rootUrl|正式数据仓库的根地址。
mediaRootUrl|媒体资源仓库的根地址。
transport|直连或 GitHub Raw 兼容访问方式。
github|GitHub 访问适配所需的来源 ID 与仓库参数。
sourceIds|使用此 GitHub 适配的数据源 ID 列表。
owner|GitHub 仓库所有者。
repo|GitHub 仓库名称。
branch|GitHub 分支名称。
linkModes|GitHub Raw 兼容链接模式和默认项。
defaultGroupId|没有显式世界绑定时使用的默认来源组 ID。
sharedInterfaceGroupId|审核/玩家等共享接口所属来源组的声明；当前不是多套后端切换器。
groups|来源组数组，或渲染条件命名组；由所在结构区分。
bindings|世界到来源组的映射，或绘制返回字段绑定数组。
dataPathTemplate|相对数据根地址的世界子路径模板；空字符串表示直接使用根。
mediaPathTemplate|相对媒体根地址的世界子路径模板；空字符串表示直接使用根。
baseUrlTemplate|瓦片根地址模板，可用 {world} 代入远端世界标签。
filteredAccess|瓦片使用直连或已注册代理。
proxyId|受控瓦片代理注册键；不能仅写新 ID 就创建服务器代理。
legacyFilteredTemplate|特殊旧瓦片代理模板的兼容保留值。
url|外部链接地址。
legacyText|旧署名文本的兼容保留值。
modules|功能模块入口、加载策略与互斥关系。
load|模块 eager/lazy/preload 加载方式。
players|玩家位置接口与轮询设置。
endpoint|玩家位置的代理请求地址模板。
directEndpoint|玩家位置的直连请求地址模板。
pollIntervalMs|轮询间隔，单位毫秒。
requestTimeoutMs|单次请求超时，单位毫秒。
review|审核功能开关、接口与服务器环境变量引用。
provider|审核身份提供方式；当前受控 github-cookie。
protocol|审核传输协议标记。
auth|审核登录、会话查询与退出接口。
start|启动身份登录的接口路径。
session|查询当前会话的接口路径。
logout|退出身份会话的接口路径。
control|审核控制接口路径，或单个控件定义；结合路径区分。
workflow|审核工作流接口路径，或旧继承策略标记。
publicReleases|公开审核发布信息接口路径。
serverReferences|服务器环境变量名称引用；不是对应密钥的实际值。
oauthClientId|OAuth 客户端 ID 所用的服务器环境变量名。
oauthRedirectUri|OAuth 回跳地址所用的服务器环境变量名。
sessionSigning|会话签名密钥所用的服务器环境变量名。
controlApiBase|控制 API 根地址所用的服务器环境变量名。
brokerSecret|代理调度共享密钥所用的服务器环境变量名。
preferences|语言、搜索、导航、地图及工具栏默认偏好。
language|默认界面语言。
search|分类搜索规则、工作流搜索控件参数或应用搜索偏好。
homepageLimit|主页搜索结果数量上限。
navigationLimit|导航搜索结果数量上限。
debounceMs|搜索输入防抖延迟，单位毫秒。
navigation|路径规划全局参数。
transferWalkSpeed|换乘步行速度的默认数值。
railRideSpeed|铁路乘坐速度的默认数值。
transferCostFactor|换乘成本的全局倍率。
normalPlatformTransferCost|普通站台换乘的基础成本。
map|地图交互与逻辑 Zoom 映射设置。
logicalInitialZoom|初次进入地图的逻辑 Zoom，范围 0–8。
leafletOffset|逻辑 Zoom 到 Leaflet Zoom 的偏移；Leaflet = 逻辑 + 偏移。
scrollWheelZoom|是否启用滚轮缩放。
doubleClickZoom|是否启用地图双击缩放。
dragging|是否启用地图拖动。
toolbar|工具栏布局偏好。
position|工具栏显示在左侧或右侧。
compact|是否使用紧凑工具栏外观。
nodeId|分类节点稳定 ID；children 与字段引用通过它定位。
path|完整且连续的分类路径；决定节点实际所在层级。
classificationLabels|各已填写分类层级的中英文名称。
children|直接子节点 nodeId 列表；必须与实际 path 父子关系一致。
inheritDown|向后代传递字段、显示和信息卡设置的三个开关。
fields|字段定义数组、字段条件组或继承字段开关；先看当前类型。
display|向下传递显示配置的开关或旧继承模式。
card|信息卡定义、继承开关或旧继承模式。
receiveFromParent|当前节点是否接收父级模块；不能用它屏蔽硬继承字段。
geometry|当前绘制的几何类型、几何输入继承选项或输出几何设置。
policies|旧版继承策略；当前解析优先使用 inheritDown。
fieldId|字段稳定身份；同一有效分类内不同 key 不得共用它。
scope|字段根/标签/扩展分组，或编辑工作流适用范围等。
cardinality|字段值数量：single 单值，multiple 数组多值。
input|字段定义建议的输入方式；实际工作流控件仍有自身配置。
validateExistingData|是否将该字段约束用于已挂载的历史记录。
requiredWhen|条件必填规则；字段和工作流使用不同的条件结构。
labels|字段或分类的人类可读中英文标题。
description|字段中英文说明。
optionsTableId|实时引用公共表 lookupTables[].id，不保存独立可编辑副本。
optionTable|当前模块本地对照表；含 valueType 和 rows。
optionValueType|选项保存为文本、数字或布尔值；value 文本会按此解释。
coordinateFormat|JSON 字段声明的坐标结构，供绘制绑定及类型核验。
optionSource|旧 optionSets 的来源引用，原生 r8+ 不作为新公共表入口。
registryKey|旧登记表中的稳定选项 ID。
runtimeField|旧运行时字段提示。
placeholder|输入提示文字；不等于默认值，也不写入记录。
defaultValue|初始输入值；类型须与字段或控件格式相容。
emptyValue|字段空值保留或省略的声明。
sourceRuntimeField|旧运行时字段映射提示。
scenes|该字段的工作流、编辑、信息卡和搜索使用场景声明。
editor|工作流式编辑方案设置，或字段是否可在编辑场景使用。
infocard|字段是否面向信息卡场景。
reference|字段的关联记录查找声明。
matchField|外部记录用于匹配的字段。
displayField|关联目标用于展示的字段。
overrideOf|明确替代继承字段时所对应的原字段 key。
inheritance|字段 localOnly/overridable/sealed 模式，或搜索规则继承模式。
present|是否要求该字段具有有效值；0/false 不是空值。
values|条件允许的比较值集合；严格比较时类型也须匹配。
min|当前数值区间下限；单位取决于所在规则/指标。
max|当前数值区间上限；单位取决于所在规则/指标。
fieldSettings|随字段设计传递的主附属身份与搜索规则。
structure|通用主结构/附属结构身份，不限定对方 Class。
role|结构身份或 Label 碰撞角色；二者是不同概念。
memberField|主结构中可选的附属成员 ID 反向引用字段。
hostField|附属结构中指向主结构 ID 的必填字段。
selectorField|附属结构用于层级/楼层切换的必填字段。
queryFields|可被主页/导航粗搜索匹配的字段路径列表。
priority|搜索排序值或渲染显示权重对象；按所在结构区分。
subtitle|搜索结果副标题设置，或工作流页面副标题。
classificationLabel|搜索副标题当前分类的显示名覆写。
fallbackClassificationLabel|搜索副标题备用分类显示名。
valueMode|原值、意义对照或外部引用显示模式；不同模块枚举不同。
referenceDisplayField|字段值为目标 ID 时，从目标记录读取的展示字段，常用 Name。
valueOptions|搜索副标题或旧信息卡本地意义对照行。
prefillAudit|预填来源的审计指纹；只用于提醒陈旧，不建立运行时绑定。
source|信息卡字段来源、图标来源、预填来源或对齐文件位置；结合路径区分。
fingerprint|预填/来源内容的摘要，用于发现修改。
confirmedFingerprint|用户已确认的来源摘要。
extension|搜索结果延伸区域的胶囊显示设置。
nameField|当前记录中提供胶囊名称的字段。
colorField|当前记录中提供胶囊颜色的字段。
lineChipSource|关联线路胶囊索引入口：站台、站场或车站建筑。
geometryType|当前分类选定的唯一几何类型。
geometryProfiles|按 Point/LineString/Polygon 索引的几何能力与显示规则。
renderState|显示是否已配置；unconfigured 与禁用几何能力不同。
allowMultipleParts|该分类几何是否接受多部件；当前入口即时禁用尚有已知缺口，保存检查仍有效。
style|当前规则的几何外观，或 Label 的字体族/字号等样式。
weight|几何描边宽度，单位屏幕像素。
dashArray|旧版自定义虚线长度字符串。
geometryStack|真实几何的绘制层级 A，与碰撞 B 和显示权重 C 分开。
zLevel|真实几何的基础绘制层级。
visible|是否显示该 Label 或信息卡单元。
conditions|旧式条件数组；当前规则通常使用 when。
basePriority|Label 碰撞基础分数，不等于图层 zLevel。
collisionGroup|Label 参与碰撞的逻辑分组名称。
hideWhenColliding|碰撞时是否隐藏该 Label。
densityLimit|旧式碰撞密度限制参数。
metric|按面积、长度、部件数或字段值计算的指标贡献。
compatibility|明确保留的旧版优先级合成行为标记。
multiplier|指标贡献的乘数。
divisor|指标贡献的正数除数；不可为零。
rounding|指标结果保持原值或向下/就近/向上取整。
zoomPriority|该几何的 Zoom 显示规则容器，核心成员为 rules。
rules|有顺序的渲染规则数组；匹配不是自动平均或同时合并全部规则。
when|当前规则/模块生效条件；渲染、工作流和旧条件数组语法不同。
zoom|原生渲染规则必需的含端点逻辑 Zoom 区间。
op|字段条件树组合：all 全部、any 任一、not 否定。
operator|单个字段/槽位条件的比较操作符。
formula|可见条件编号及手工组合表达式；最终编译为条件树。
expression|工作流组装公式或条件编号布尔公式；两者语法不同。
manual|是否采用手工条件公式，暂停按行连接关系自动生成。
terms|具有稳定编号的原子条件行数组。
relation|条件行连接关系 AND/OR/NOT，或信息卡关系显示配置。
condition|当前编号对应的实际字段比较条件。
representation|命中规则时输出隐藏、几何、点符号或仅文字等显示种类。
symbolOffsetPx|点符号相对其锚点的屏幕偏移，单位像素。
symbolVisibility|点符号独立显示还是随 Label 显示。
symbolAnchor|符号以源几何或 Label 锚点为基准。
pointShape|点符号几何外形。
icon|外部图标描述；存在时覆盖普通点外形。
stroke|描边颜色绑定方式。
fill|填充颜色绑定方式。
dashPreset|实线、虚线或点划线预设。
lineCap|线端样式：平头、圆头或方头。
lineJoin|线段连接转角样式。
font|旧 Label 字体枚举；新配置使用 label.style.family。
italic|文字斜体；新配置存放于 label.style.modifiers。
underline|文字下划线；新配置存放于 label.style.modifiers。
bold|文字粗体开关。
sourceMode|Label 采用单一字段还是组合文字来源。
template|Label 组合模板：双引号内为字段路径，其余为字面文字。
fallbackSources|主来源无文字时依序尝试的备用字段路径。
valueFormat|文字的受控格式化方式，例如楼层值格式。
fallbackValueFormats|以备用字段路径为键的格式化方式映射。
placement|标签相对锚点的方位或相对线的位置。
offsetX|Label 水平方向屏幕偏移。
offsetY|Label 垂直方向屏幕偏移。
withDot|Label 是否带装饰圆点；不等同于实际点几何。
dotAnchorMode|装饰圆点的位置规则。
family|受控 Label 视觉族键，如 gm-outline、rle-pill-color。
modifiers|文字斜体、下划线、粗体等修饰集合。
triggers|可触发交互的命中区域集合。
line|是否允许线几何触发交互。
boundary|是否允许面边界触发交互。
interior|是否允许面内部触发交互。
conditionalOverrides|同一条 Zoom 规则内部的字段条件覆写数组。
base|显示权重或优先分数的基础值。
advanced|旧兼容渲染描述；新原生设置优先使用类型明确的 extensions。
predicates|旧兼容谓词信息，不是可执行 JavaScript。
selection|旧兼容选中状态信息。
specialLogic|旧兼容特殊显示键列表。
legacyRuntime|旧渲染执行器保留策略声明。
preserveFallback|旧渲染执行器是否保留回退行为。
sourceRuleName|旧规则来源名称。
minExclusive|旧版不含端点的最小 Zoom；新规则不应继续使用。
maxExclusive|旧版不含端点的最大 Zoom；新规则不应继续使用。
labelRole|旧版 Label 角色位置；新配置在 label.collision.role。
legacyDisplay|迁移用的旧显示来源索引。
ruleIds|旧显示规则 ID 列表。
profileIds|旧显示预设 ID 列表。
specialLogicKeys|旧特殊显示逻辑键列表。
containment|旧版分类内包含关系；现代配置使用 fieldSettings.structure。
parentReferenceField|旧附属结构指向主结构的字段。
viewProfileKey|旧上下文视图预设键。
fieldBinding|信息卡单元实时绑定字段设计的 nodeId+fieldId 引用。
optionsFieldRef|仅对照表实时绑定到指定字段 nodeId+fieldId。
inheritFrom|信息卡继承来源的 nodeId+itemId 引用。
itemId|信息卡来源单元的稳定 ID。
afterRemaining|此信息卡单元排列在剩余字段区域之后。
renderer|信息卡单元受控显示器：文字、链接、胶囊、媒体等。
section|信息卡主要/其他信息分区。
hideWhenEmpty|值为空时是否隐藏当前信息卡单元或剩余字段。
labelMode|旧信息卡标题来源模式；不等于新字段绑定本身。
colorSource|信息卡胶囊读取颜色的字段路径。
nameSource|信息卡胶囊读取名称的字段路径。
tagColor|信息卡标签的固定颜色。
mediaSource|媒体来自图片索引还是外部 URL。
linkText|外链显示原值或实际 href。
targetRole|按通用主结构身份找目标，当前可选 main。
targetClassification|信息卡关系显示的目标分类范围。
targetMatchField|关联目标记录的匹配字段。
targetDisplayField|关联目标记录的显示字段。
clickable|关系目标是否可以点击定位或查看。
multiple|当前关系是否多目标，或当前绘制页是否允许多部件/多点。
sourceValuePath|关联值是数组/对象时，提取目标 ID 的内部路径。
fallbackDisplay|目标不存在时显示原值或未知提示。
remaining|信息卡未明确列出的其余字段的显示规则。
includeSystem|剩余字段中是否包含系统字段。
exclude|剩余字段中排除的字段路径。
order|剩余字段按记录顺序或字母顺序排列。
maxDepth|剩余字段对象展开的深度上限。
maxArrayLength|剩余字段数组展开的项目数上限。
layoutId|受控信息卡布局 ID。
componentKey|已登记代码组件/外部工作流的稳定键。
legacy|迁移来源及兼容元数据，不应作为新功能的主要入口。
displayRuleIds|分类对应的旧显示规则 ID 列表。
cardLayoutId|分类对应的旧信息卡布局 ID。
specialCardKey|分类对应的旧特殊信息卡组件键。
host|旧上下文关系的主结构端点。
member|旧上下文关系的附属结构端点。
classification|工作流输出或关系端点的分类范围。
referenceField|关系端点所持的对应记录引用字段。
memberSelectorField|旧上下文关系中成员的层级选择字段。
quickMapping|是否允许此工作流从便捷测绘采集入口选用。
dedicated|是否为专供再次编辑的工作流。
backfill|编辑工作流的显式数据回灌映射。
slot|工作流运行中的信息槽位名；不是最终记录字段名。
actor|填写人页要求；运行时收集填写人。
steps|工作流页面数组，顺序即页面执行顺序。
controls|当前页的信息收集控件数组。
prefillField|单次预填后留下的本地目标字段提示，不是实时来源引用。
valueNormalization|输入保存值处理：保留、去空白、简称或转数字。
columns|控件宽度档位：1 占整行，2 半行，3 三分之一行。
fieldSource|旧式字段来源快照和覆写列表；现代预填/绑定另有明确字段。
fieldFormat|工作流控件的填写/显示格式提示。
classificationScope|系统分类控件可选择的分类范围。
outputId|绘制页、系统分类控件或绑定所对应的工作流输出 ID。
systemManaged|编辑器维护的固定单元标记，如分类控件与标签扩展单元。
tagsExtensions|工作流标签与扩展固定单元的启用设置。
tagsEnabled|是否开放标签输入。
extensionsEnabled|是否开放扩展输入。
legacyBlock|旧工作流区块的兼容信息。
legacyPage|旧工作流页面内容的兼容保留信息。
extensions|规则局部的类型化渲染扩展；在字段路径中则表示要素的扩展数据组。
snapshot|旧字段来源的快照，不会自动代表当前实时字段定义。
overrides|旧字段来源快照允许覆写的属性名列表。
token|工作流条件引用的先前槽位/系统值名称。
all|工作流条件数组全部成立才通过；不能与其他条件写法混淆。
any|工作流条件数组至少一个成立才通过。
searchFields|工作流搜索控件使用的候选匹配字段。
returnField|工作流搜索最终返回的目标字段。
returnFields|搜索候选返回字段的列表。
displayFields|搜索候选展示字段列表。
displayTemplate|搜索候选展示模板；使用 {{ID}} 等双花括号，占位语法不同于 Label。
matcher|contains/prefix/token/fuzzy 等受控搜索匹配方式。
cacheScope|搜索只在当前世界还是全部已加载世界中查找。
minQueryLength|触发搜索所需的最少输入字符数。
maxResults|搜索返回候选数量上限。
coarse|搜索控件粗搜索的开关和显示设置。
allowed|粗搜索是否启用。
itemFields|重复字段组中每个项目包含的子字段定义。
storage|重复组保存为对象数组还是纯值数组。
optional|重复组是否允许零项。
minItems|重复组至少需要多少项。
addLabel|重复组添加一项按钮的中英文名称。
geometryRole|此绘制页是输出要素几何还是额外辅助绘制。
specialKey|旧特殊工作流页面键。
drawing|当前绘制页的返回格式、槽位、条件与字段绑定设置。
enabledFromThisPage|进入绘制页时是否自动启用此绘制。
drawMode|旧式绘制模式提示，须与固定点/线/面类型一致。
allowBack|此绘制页是否允许返回上一页。
keepDrawingWhenBack|返回信息页时保留最后离开绘制页的活动绘制状态。
pointSlot|旧单点返回槽位；现代绘制使用 captureSlot 与 returnFormat。
auxiliaryPoints|旧内嵌辅助点列表；现代额外绘制为独立 geometry 页。
captureSlot|绘制返回写入的槽位名，还会派生 _X/_Y/_Z/_HEIGHT 等值。
returnFormat|绘制返回 CoordP/CoordL/CoordG 数组或单点 {x,y,z}。
heightSlot|可选的高度输入槽位，必须对应有效数值输入。
assignments|输出组装规则数组；将槽位/公式结果写入真实数据字段。
output|旧外部工作流输出说明，不是现代 outputs 数组。
outputs|工作流输出要素数组；每个原生输出对应一张输出绘制页。
external|已完成外部工作流单元的受控入口配置。
purpose|外部方案用途：capture 采集，edit 专供编辑。
version|受控外部方案版本。
reason|允许保留该外部方案的集成理由。
coveredClassifications|外部方案明确服务的分类范围列表。
runtimeMode|旧工作流运行模式提示。
status|V1 对齐项的迁移状态，而非要素审核状态。
details|V1 对齐项的说明。
generatedAt|V1 对齐报告的生成时间。
`;
export const glossary = Object.fromEntries(text.trim().split('\n').map(line => {
  const at = line.indexOf('|'); return [line.slice(0, at), line.slice(at + 1)];
}));

export function fieldNote(meta, key) {
  const path = meta.usage;
  if (key === 'displayName' && path.endsWith('.extension')) return '是否显示胶囊名称；这里是布尔值，不是整包 displayName 的中英文对象。';
  if (key === 'source' && meta.name === 'RenderLabelStyle') return '单一 Label 主来源字段，如 Name；组合来源改用 sourceMode 与 template。';
  if (key === 'source' && meta.name === 'CardItem') return '信息卡单元读取的本记录字段路径，如 direction 或 extensions.link.wiki。';
  if (key === 'label' && meta.name === 'ZoomPriorityRule') return '此条规则的 Label 外观、来源、碰撞等设置；不是普通名称字符串。';
  if (key === 'multiple' && path.endsWith('.drawing')) return '当前绘制页是否允许多部件/多点；与分类 allowMultipleParts 是两层设置，当前按钮联动尚有已知缺口。';
  if (key === 'fieldId') return glossary.fieldId;
  if (key === 'source' && meta.name === 'PrefillAudit') return '单次预填时的来源分类/字段审计记录，只提醒内容变化，不建立实时引用。';
  return glossary[key];
}

export function compatibilityNote(meta, key) {
  const doc = meta.properties[key];
  if (doc.deprecated) return '旧版兼容';
  if (['legacy','legacyBlock','legacyDisplay','legacyPage','legacyRuntime','containment','optionSource','optionSets','fieldSource','policies','auxiliaryPoints','pointSlot','sourceRuntimeField'].includes(key)) return '兼容/迁移保留';
  if (key === 'contextBindings') return '旧关系保留；当前默认为空';
  if (meta.name === 'GeometryProfile' && ['color','style','geometryStack','label'].includes(key)) return '旧版兼容；新写入放在规则内';
  if (meta.name === 'ApplicationWorld' && ['dataSourceId','projection','tiles'].includes(key)) return '旧版兼容；来源组模式不可混写';
  if (meta.name === 'CairnMapRuleButtonCriteria' && key !== 'paths') return '旧式分列过滤；新写入使用 paths';
  if (meta.name === 'WorkflowStep' && key === 'kind') return 'actor/form/geometry 为当前主用；其他枚举含兼容项';
  return '当前契约支持';
}
