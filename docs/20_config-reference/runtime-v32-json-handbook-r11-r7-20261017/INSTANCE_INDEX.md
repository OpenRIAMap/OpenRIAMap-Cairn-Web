# 当前完整配置的实例定位索引

所有行号对应 [current-full.config.json](current-full.config.json)，数组下标从 0 开始。对象 ID/字段名可在 JSON 编辑器中直接搜索；阅读器支持这些 Pointer 跳转。

## 一级区块

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 文件结构标记；固定字符串用于识别整包、应用设置或对齐报告。 | `schemaVersion` | `/schemaVersion` | 2–2 |
| 配置契约版本；控制结构兼容和迁移，当前为 11，不能用它冒充保存版本。 | `contractRevision` | `/contractRevision` | 3–3 |
| 整包稳定身份；本地历史与导入使用此标识区分配置包。 | `packageId` | `/packageId` | 4–4 |
| 所属项目的稳定标识。 | `projectId` | `/projectId` | 5–5 |
| 同一配置包的保存修订号；当前为 7，保存新版本须满足递增要求。 | `revision` | `/revision` | 6–6 |
| 整包显示名是 zh/en 对象；搜索延伸区域的同名键是显示胶囊名称的布尔值，须按对象判读。 | `displayName` | `/displayName` | 7–10 |
| 全局引擎默认设置，供分类渲染与交互解析。 | `engine` | `/engine` | 11–222 |
| 可用布局、组件与受控能力的登记清单；登记不等于任意代码可执行。 | `registries` | `/registries` | 223–944 |
| 分类节点数组；通过 path 和 children 表达分类树，而非把节点嵌套存储。 | `nodes` | `/nodes` | 945–107987 |
| 旧式指定双方分类的上下文绑定；当前默认空数组，现用 fieldSettings.structure。 | `contextBindings` | `/contextBindings` | 107988–107988 |
| 工作流定义数组；包含组合式采集、外部方案和专供编辑方案。 | `workflows` | `/workflows` | 107989–114667 |
| 与 V1 来源的迁移对齐凭证；不是地图数据或实际渲染规则。 | `parity` | `/parity` | 114668–114957 |
| 总体规则：世界、来源组、图层按钮、模块、审核及偏好。 | `application` | `/application` | 114958–115554 |
| 公共对照表数组；字段、信息卡和工作流可按表格 ID 引用。 | `lookupTables` | `/lookupTables` | 115555–115847 |

## 分类

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| BUD | `class-bud` | `/nodes/0` | 946–2254 |
| BUD/NOM | `class-bud-nom` | `/nodes/1` | 2255–3312 |
| BUD/SPE | `class-bud-spe` | `/nodes/2` | 3313–4370 |
| BUD/NOM/NOM | `class-bud-nom-nom` | `/nodes/3` | 4371–5431 |
| BUD/SPE/SPE | `class-bud-spe-spe` | `/nodes/4` | 5432–6492 |
| FLR | `class-flr` | `/nodes/5` | 6493–7810 |
| FLR/NOM | `class-flr-nom` | `/nodes/6` | 7811–8791 |
| FLR/SPE | `class-flr-spe` | `/nodes/7` | 8792–9772 |
| FLR/NOM/NOM | `class-flr-nom-nom` | `/nodes/8` | 9773–10756 |
| FLR/SPE/SPE | `class-flr-spe-spe` | `/nodes/9` | 10757–11740 |
| ISG | `class-isg` | `/nodes/10` | 11741–13055 |
| ISG/NGF | `class-isg-ngf` | `/nodes/11` | 13056–13442 |
| ISG/ADM | `class-isg-adm` | `/nodes/12` | 13443–13828 |
| ISG/NGF/LAD | `class-isg-ngf-lad` | `/nodes/13` | 13829–15077 |
| ISG/NGF/LIS | `class-isg-ngf-lis` | `/nodes/14` | 15078–16373 |
| ISG/NGF/WTB | `class-isg-ngf-wtb` | `/nodes/15` | 16374–17670 |
| ISG/ADM/DBZ | `class-isg-adm-dbz` | `/nodes/16` | 17671–18897 |
| ISG/ADM/PLZ | `class-isg-adm-plz` | `/nodes/17` | 18898–20151 |
| ISG/NGF/LAD/CON | `class-isg-ngf-lad-con` | `/nodes/18` | 20152–21370 |
| ISG/NGF/LAD/ISD | `class-isg-ngf-lad-isd` | `/nodes/19` | 21371–22589 |
| ISG/NGF/LAD/SBC | `class-isg-ngf-lad-sbc` | `/nodes/20` | 22590–23808 |
| ISG/NGF/LAD/RGC | `class-isg-ngf-lad-rgc` | `/nodes/21` | 23809–25027 |
| ISG/NGF/LAD/PEN | `class-isg-ngf-lad-pen` | `/nodes/22` | 25028–26246 |
| ISG/NGF/LAD/IST | `class-isg-ngf-lad-ist` | `/nodes/23` | 26247–27465 |
| ISG/NGF/LIS/MTN | `class-isg-ngf-lis-mtn` | `/nodes/24` | 27466–28718 |
| ISG/NGF/LIS/BSN | `class-isg-ngf-lis-bsn` | `/nodes/25` | 28719–29971 |
| ISG/NGF/LIS/PLN | `class-isg-ngf-lis-pln` | `/nodes/26` | 29972–31224 |
| ISG/NGF/WTB/SEA | `class-isg-ngf-wtb-sea` | `/nodes/27` | 31225–32477 |
| ISG/NGF/WTB/LKE | `class-isg-ngf-wtb-lke` | `/nodes/28` | 32478–33730 |
| ISG/NGF/WTB/STR | `class-isg-ngf-wtb-str` | `/nodes/29` | 33731–34983 |
| ISG/NGF/WTB/EST | `class-isg-ngf-wtb-est` | `/nodes/30` | 34984–36236 |
| ISG/ADM/DBZ/L1 | `class-isg-adm-dbz-l1` | `/nodes/31` | 36237–37641 |
| ISG/ADM/DBZ/L2 | `class-isg-adm-dbz-l2` | `/nodes/32` | 37642–39046 |
| ISG/ADM/DBZ/L3 | `class-isg-adm-dbz-l3` | `/nodes/33` | 39047–40333 |
| ISG/ADM/PLZ/L1 | `class-isg-adm-plz-l1` | `/nodes/34` | 40334–41755 |
| ISG/ADM/PLZ/L2 | `class-isg-adm-plz-l2` | `/nodes/35` | 41756–43177 |
| ISG/ADM/PLZ/L3 | `class-isg-adm-plz-l3` | `/nodes/36` | 43178–44481 |
| ISG/ADM/PLZ/UP | `class-isg-adm-plz-up` | `/nodes/37` | 44482–45666 |
| ISG/ADM/PLZ/UC | `class-isg-adm-plz-uc` | `/nodes/38` | 45667–46851 |
| ISL | `class-isl` | `/nodes/39` | 46852–47850 |
| ISL/NGF | `class-isl-ngf` | `/nodes/40` | 47851–48160 |
| ISL/ADM | `class-isl-adm` | `/nodes/41` | 48161–48470 |
| ISL/NGF/WTR | `class-isl-ngf-wtr` | `/nodes/42` | 48471–49399 |
| ISL/NGF/BOD | `class-isl-ngf-bod` | `/nodes/43` | 49400–50378 |
| ISL/ADM/DBL | `class-isl-adm-dbl` | `/nodes/44` | 50379–51406 |
| ISL/ADM/PLL | `class-isl-adm-pll` | `/nodes/45` | 51407–52434 |
| ISL/NGF/WTR/RVR | `class-isl-ngf-wtr-rvr` | `/nodes/46` | 52435–53337 |
| ISL/NGF/WTR/CAN | `class-isl-ngf-wtr-can` | `/nodes/47` | 53338–54240 |
| ISL/NGF/BOD/BDY | `class-isl-ngf-bod-bdy` | `/nodes/48` | 54241–55177 |
| ISL/NGF/BOD/STC | `class-isl-ngf-bod-stc` | `/nodes/49` | 55178–56114 |
| ISL/ADM/DBL/LBD | `class-isl-adm-dbl-lbd` | `/nodes/50` | 56115–57085 |
| ISL/ADM/PLL/CBD | `class-isl-adm-pll-cbd` | `/nodes/51` | 57086–58056 |
| ISP | `class-isp` | `/nodes/52` | 58057–59105 |
| ISP/NGF | `class-isp-ngf` | `/nodes/53` | 59106–59488 |
| ISP/ADM | `class-isp-adm` | `/nodes/54` | 59489–59872 |
| ISP/NGF/SCP | `class-isp-ngf-scp` | `/nodes/55` | 59873–60960 |
| ISP/ADM/DBP | `class-isp-adm-dbp` | `/nodes/56` | 60961–62049 |
| ISP/ADM/PLP | `class-isp-adm-plp` | `/nodes/57` | 62050–63138 |
| ISP/NGF/SCP/SPP | `class-isp-ngf-scp-spp` | `/nodes/58` | 63139–64169 |
| ISP/ADM/DBP/LIP | `class-isp-adm-dbp-lip` | `/nodes/59` | 64170–65200 |
| ISP/ADM/PLP/PLP | `class-isp-adm-plp-plp` | `/nodes/60` | 65201–66231 |
| ISP/ADM/PLP/COP | `class-isp-adm-plp-cop` | `/nodes/61` | 66232–67262 |
| ISP/ADM/DBP/SHR | `class-isp-adm-dbp-shr` | `/nodes/62` | 67263–68293 |
| PFB | `class-pfb` | `/nodes/63` | 68294–69192 |
| PLF | `class-plf` | `/nodes/64` | 69193–70439 |
| RLE | `class-rle` | `/nodes/65` | 70440–72986 |
| ROD | `class-rod` | `/nodes/66` | 72987–75112 |
| ROD/NOM | `class-rod-nom` | `/nodes/67` | 75113–76776 |
| ROD/TUK | `class-rod-tuk` | `/nodes/68` | 76777–78440 |
| ROD/PRI | `class-rod-pri` | `/nodes/69` | 78441–80104 |
| ROD/SEC | `class-rod-sec` | `/nodes/70` | 80105–81768 |
| ROD/SED | `class-rod-sed` | `/nodes/71` | 81769–83432 |
| ROD/RES | `class-rod-res` | `/nodes/72` | 83433–85096 |
| ROD/SVS | `class-rod-svs` | `/nodes/73` | 85097–86760 |
| ROD/IDR | `class-rod-idr` | `/nodes/74` | 86761–88424 |
| ROD/SPE | `class-rod-spe` | `/nodes/75` | 88425–90088 |
| SBP | `class-sbp` | `/nodes/76` | 90089–91071 |
| STA | `class-sta` | `/nodes/77` | 91072–92105 |
| STB | `class-stb` | `/nodes/78` | 92106–93229 |
| STF | `class-stf` | `/nodes/79` | 93230–94267 |
| TPP | `class-tpp` | `/nodes/80` | 94268–95624 |
| TPP/NOM | `class-tpp-nom` | `/nodes/81` | 95625–96584 |
| TPP/SPE | `class-tpp-spe` | `/nodes/82` | 96585–97544 |
| TPP/NOM/NOM | `class-tpp-nom-nom` | `/nodes/83` | 97545–98507 |
| TPP/SPE/SPE | `class-tpp-spe-spe` | `/nodes/84` | 98508–99470 |
| TRP | `class-trp` | `/nodes/85` | 99471–100466 |
| TRP/NOM | `class-trp-nom` | `/nodes/86` | 100467–101222 |
| TRP/SPE | `class-trp-spe` | `/nodes/87` | 101223–101978 |
| TRP/NOM/NOM | `class-trp-nom-nom` | `/nodes/88` | 101979–102737 |
| TRP/SPE/SPE | `class-trp-spe-spe` | `/nodes/89` | 102738–103496 |
| WRP | `class-wrp` | `/nodes/90` | 103497–104576 |
| WRP/NOM | `class-wrp-nom` | `/nodes/91` | 104577–105427 |
| WRP/SPE | `class-wrp-spe` | `/nodes/92` | 105428–106278 |
| WRP/NOM/NOM | `class-wrp-nom-nom` | `/nodes/93` | 106279–107132 |
| WRP/SPE/SPE | `class-wrp-spe-spe` | `/nodes/94` | 107133–107986 |

## 字段

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| BUD · Name · 建筑名 | `BUD-Name` | `/nodes/0/fields/0` | 973–996 |
| BUD · Situation · 状态(Situation) | `BUD-Situation` | `/nodes/0/fields/1` | 997–1020 |
| BUD · elevation · 高度(y) | `BUD-elevation` | `/nodes/0/fields/2` | 1021–1044 |
| BUD · height · 高度(height) | `BUD-height` | `/nodes/0/fields/3` | 1045–1068 |
| BUD · tags.nomenclator · 命名者 | `BUD-registry-tags.nomenclator` | `/nodes/0/fields/4` | 1069–1085 |
| BUD · tags.Land · 所属地理单元 | `BUD-registry-tags.Land` | `/nodes/0/fields/5` | 1086–1102 |
| BUD · tags.Adm · 所属聚落 | `BUD-registry-tags.Adm` | `/nodes/0/fields/6` | 1103–1119 |
| BUD · tags.Pop · 相关成员 | `BUD-registry-tags.Pop` | `/nodes/0/fields/7` | 1120–1136 |
| BUD · extensions.link.wiki · WIKI链接 | `BUD-registry-extensions.link.wiki` | `/nodes/0/fields/8` | 1137–1153 |
| BUD · extensions.character.brief · 简介 | `BUD-registry-extensions.character.brief` | `/nodes/0/fields/9` | 1154–1170 |
| FLR · Name · 楼层名 | `FLR-Name` | `/nodes/5/fields/0` | 6520–6543 |
| FLR · NofFloor · 楼层名(NofFloor) | `FLR-NofFloor` | `/nodes/5/fields/1` | 6544–6567 |
| FLR · BuildingID · 所属建筑(BuildingID) | `FLR-BuildingID` | `/nodes/5/fields/2` | 6568–6591 |
| FLR · Situation · 状态(Situation) | `FLR-Situation` | `/nodes/5/fields/3` | 6592–6615 |
| FLR · elevation · 高度(y) | `FLR-elevation` | `/nodes/5/fields/4` | 6616–6639 |
| FLR · height · 高度(height) | `FLR-height` | `/nodes/5/fields/5` | 6640–6663 |
| FLR · FloorID · FloorID | `FLR-runtime-FloorID` | `/nodes/5/fields/6` | 6664–6679 |
| FLR · tags.nomenclator · 命名者 | `FLR-registry-tags.nomenclator` | `/nodes/5/fields/7` | 6680–6696 |
| FLR · tags.Land · 所属地理单元 | `FLR-registry-tags.Land` | `/nodes/5/fields/8` | 6697–6713 |
| FLR · tags.Adm · 所属聚落 | `FLR-registry-tags.Adm` | `/nodes/5/fields/9` | 6714–6730 |
| FLR · tags.Pop · 相关成员 | `FLR-registry-tags.Pop` | `/nodes/5/fields/10` | 6731–6747 |
| FLR · extensions.link.wiki · WIKI链接 | `FLR-registry-extensions.link.wiki` | `/nodes/5/fields/11` | 6748–6764 |
| FLR · extensions.character.brief · 简介 | `FLR-registry-extensions.character.brief` | `/nodes/5/fields/12` | 6765–6781 |
| ISG · Name · 地物面名 | `ISG-Name` | `/nodes/10/fields/0` | 11768–11791 |
| ISG · Situation · 状态(Situation) | `ISG-Situation` | `/nodes/10/fields/1` | 11792–11815 |
| ISG · tags.nomenclator · 命名者 | `ISG-registry-tags.nomenclator` | `/nodes/10/fields/2` | 11816–11832 |
| ISG · extensions.link.wiki · WIKI链接 | `ISG-registry-extensions.link.wiki` | `/nodes/10/fields/3` | 11833–11849 |
| ISG · extensions.character.brief · 简介 | `ISG-registry-extensions.character.brief` | `/nodes/10/fields/4` | 11850–11866 |
| ISG · tags.Land · 所属地理单元 | `ISG-registry-tags.Land` | `/nodes/10/fields/5` | 11867–11883 |
| ISG · tags.Adm · 所属聚落 | `ISG-registry-tags.Adm` | `/nodes/10/fields/6` | 11884–11900 |
| ISG · tags.UAdm · 上级行政/聚落单元 | `ISG-registry-tags.UAdm` | `/nodes/10/fields/7` | 11901–11917 |
| ISG · tags.GAdm · 行政/聚落组 | `ISG-registry-tags.GAdm` | `/nodes/10/fields/8` | 11918–11934 |
| ISG · tags.Pop · 相关成员/人口 | `ISG-registry-tags.Pop` | `/nodes/10/fields/9` | 11935–11951 |
| ISG · tags.YTime · 规划/年代 | `ISG-registry-tags.YTime` | `/nodes/10/fields/10` | 11952–11968 |
| ISL · Name · 线要素名 | `ISL-Name` | `/nodes/39/fields/0` | 46879–46902 |
| ISL · Situation · 状态(Situation) | `ISL-Situation` | `/nodes/39/fields/1` | 46903–46926 |
| ISL · tags.nomenclator · 命名者 | `ISL-registry-tags.nomenclator` | `/nodes/39/fields/2` | 46927–46943 |
| ISL · extensions.link.wiki · WIKI链接 | `ISL-registry-extensions.link.wiki` | `/nodes/39/fields/3` | 46944–46960 |
| ISL · extensions.character.brief · 简介 | `ISL-registry-extensions.character.brief` | `/nodes/39/fields/4` | 46961–46977 |
| ISL · tags.BNgf1 · 边界侧自然地物1 | `ISL-registry-tags.BNgf1` | `/nodes/39/fields/5` | 46978–46994 |
| ISL · tags.BNgf2 · 边界侧自然地物2 | `ISL-registry-tags.BNgf2` | `/nodes/39/fields/6` | 46995–47011 |
| ISL · tags.Land · 所属地理单元 | `ISL-registry-tags.Land` | `/nodes/39/fields/7` | 47012–47028 |
| ISL · tags.BAdm1 · 边界侧行政/聚落1 | `ISL-registry-tags.BAdm1` | `/nodes/39/fields/8` | 47029–47045 |
| ISL · tags.BAdm2 · 边界侧行政/聚落2 | `ISL-registry-tags.BAdm2` | `/nodes/39/fields/9` | 47046–47062 |
| ISL · tags.GAdm · 行政/聚落组 | `ISL-registry-tags.GAdm` | `/nodes/39/fields/10` | 47063–47079 |
| ISP · Name · 要素点名 | `ISP-Name` | `/nodes/52/fields/0` | 58084–58107 |
| ISP · Situation · 状态(Situation) | `ISP-Situation` | `/nodes/52/fields/1` | 58108–58131 |
| ISP · elevation · 高度(y) | `ISP-elevation` | `/nodes/52/fields/2` | 58132–58155 |
| ISP · tags.nomenclator · 命名者 | `ISP-registry-tags.nomenclator` | `/nodes/52/fields/3` | 58156–58172 |
| ISP · tags.Land · 所属地理单元 | `ISP-registry-tags.Land` | `/nodes/52/fields/4` | 58173–58189 |
| ISP · tags.UAdm · 所属行政/聚落单元 | `ISP-registry-tags.UAdm` | `/nodes/52/fields/5` | 58190–58206 |
| ISP · tags.Pop · 相关成员 | `ISP-registry-tags.Pop` | `/nodes/52/fields/6` | 58207–58223 |
| ISP · extensions.character.event · 事件或类型 | `ISP-registry-extensions.character.event` | `/nodes/52/fields/7` | 58224–58240 |
| ISP · extensions.link.wiki · WIKI链接 | `ISP-registry-extensions.link.wiki` | `/nodes/52/fields/8` | 58241–58257 |
| ISP · extensions.character.brief · 简介 | `ISP-registry-extensions.character.brief` | `/nodes/52/fields/9` | 58258–58274 |
| PFB · Name · 站台轮廓名 | `PFB-Name` | `/nodes/63/fields/0` | 68318–68341 |
| PFB · LineID · 线路ID(LineID) | `PFB-LineID` | `/nodes/63/fields/1` | 68342–68365 |
| PFB · elevation · 高度(y) | `PFB-elevation` | `/nodes/63/fields/2` | 68366–68389 |
| PFB · height · 高度(height) | `PFB-height` | `/nodes/63/fields/3` | 68390–68413 |
| PFB · extensions.link.wiki · WIKI链接 | `PFB-registry-extensions.link.wiki` | `/nodes/63/fields/4` | 68414–68430 |
| PFB · extensions.character.brief · 简介 | `PFB-registry-extensions.character.brief` | `/nodes/63/fields/5` | 68431–68447 |
| PLF · Name · 站台名称 | `PLF-Name` | `/nodes/64/fields/0` | 69217–69240 |
| PLF · elevation · 高度(y) | `PLF-elevation` | `/nodes/64/fields/1` | 69241–69264 |
| PLF · Situation · 站台是否启用(Situation) | `PLF-Situation` | `/nodes/64/fields/2` | 69265–69288 |
| PLF · Connect · 外部连接功能(Connect) | `PLF-Connect` | `/nodes/64/fields/3` | 69289–69312 |
| PLF · lines · lines | `PLF-runtime-lines` | `/nodes/64/fields/4` | 69313–69328 |
| PLF · extensions.link.wiki · WIKI链接 | `PLF-registry-extensions.link.wiki` | `/nodes/64/fields/5` | 69329–69345 |
| PLF · extensions.character.brief · 简介 | `PLF-registry-extensions.character.brief` | `/nodes/64/fields/6` | 69346–69362 |
| RLE · Name · 线路名 | `RLE-Name` | `/nodes/65/fields/0` | 70464–70487 |
| RLE · bureau · 路局代码 | `RLE-bureau` | `/nodes/65/fields/1` | 70488–70511 |
| RLE · line · 线路编号 | `RLE-line` | `/nodes/65/fields/2` | 70512–70535 |
| RLE · color · 标准色号(color) | `RLE-color` | `/nodes/65/fields/3` | 70536–70559 |
| RLE · direction · 方向(direction) | `RLE-direction` | `/nodes/65/fields/4` | 70560–70645 |
| RLE · startplf · 起点站台名(startplf) | `RLE-startplf` | `/nodes/65/fields/5` | 70646–70669 |
| RLE · endplf · 终点站台名(endplf) | `RLE-endplf` | `/nodes/65/fields/6` | 70670–70693 |
| RLE · extensions.link.wiki · WIKI链接 | `RLE-registry-extensions.link.wiki` | `/nodes/65/fields/7` | 70694–70710 |
| RLE · extensions.character.brief · 简介 | `RLE-registry-extensions.character.brief` | `/nodes/65/fields/8` | 70711–70727 |
| ROD · Name · 道路名 | `ROD-Name` | `/nodes/66/fields/0` | 73021–73044 |
| ROD · Level · 道路层级(Level) | `ROD-Level` | `/nodes/66/fields/1` | 73045–73068 |
| ROD · Oneway · 是否单向(Oneway) | `ROD-Oneway` | `/nodes/66/fields/2` | 73069–73092 |
| ROD · Enter · 是否可进入(Enter) | `ROD-Enter` | `/nodes/66/fields/3` | 73093–73116 |
| ROD · Exit · 是否可离开(Exit) | `ROD-Exit` | `/nodes/66/fields/4` | 73117–73140 |
| ROD · SelfJunction · 是否允许自交(SelfJunction) | `ROD-SelfJunction` | `/nodes/66/fields/5` | 73141–73164 |
| ROD · Speed · 道路速度(Speed) | `ROD-Speed` | `/nodes/66/fields/6` | 73165–73188 |
| ROD · Situation · 状态(Situation) | `ROD-Situation` | `/nodes/66/fields/7` | 73189–73212 |
| ROD · color · color | `ROD-runtime-color` | `/nodes/66/fields/8` | 73213–73228 |
| ROD · tags.nomenclator · 命名者 | `ROD-registry-tags.nomenclator` | `/nodes/66/fields/9` | 73229–73245 |
| ROD · tags.Land · 所属地理单元 | `ROD-registry-tags.Land` | `/nodes/66/fields/10` | 73246–73262 |
| ROD · tags.UAdm · 所属行政/聚落单元 | `ROD-registry-tags.UAdm` | `/nodes/66/fields/11` | 73263–73279 |
| ROD · tags.UAdmG · 所属行政/聚落组 | `ROD-registry-tags.UAdmG` | `/nodes/66/fields/12` | 73280–73296 |
| ROD · extensions.link.wiki · WIKI链接 | `ROD-registry-extensions.link.wiki` | `/nodes/66/fields/13` | 73297–73313 |
| ROD · extensions.character.brief · 简介 | `ROD-registry-extensions.character.brief` | `/nodes/66/fields/14` | 73314–73330 |
| ROD · ConnectL · 显式连接关系 | `ROD-registry-ConnectL` | `/nodes/66/fields/15` | 73331–73346 |
| ROD · Blacklist · 禁用连接对象 | `ROD-registry-Blacklist` | `/nodes/66/fields/16` | 73347–73362 |
| ROD · Mode · 允许出行方式 | `ROD-registry-Mode` | `/nodes/66/fields/17` | 73363–73378 |
| SBP · Name · 车站建筑名 | `SBP-Name` | `/nodes/76/fields/0` | 90113–90136 |
| SBP · elevation · 高度(y) | `SBP-elevation` | `/nodes/76/fields/1` | 90137–90160 |
| SBP · iconUrl · iconUrl | `SBP-runtime-iconUrl` | `/nodes/76/fields/2` | 90161–90176 |
| SBP · extensions.link.wiki · WIKI链接 | `SBP-registry-extensions.link.wiki` | `/nodes/76/fields/3` | 90177–90193 |
| SBP · extensions.character.brief · 简介 | `SBP-registry-extensions.character.brief` | `/nodes/76/fields/4` | 90194–90210 |
| SBP · Floors · 包含楼层 | `SBP-registry-Floors` | `/nodes/76/fields/5` | 90211–90226 |
| SBP · stations · 包含车站 | `SBP-registry-stations` | `/nodes/76/fields/6` | 90227–90242 |
| STA · Name · 车站名 | `STA-Name` | `/nodes/77/fields/0` | 91096–91119 |
| STA · STBuilding · 车站所属车站建体(STBuilding) | `STA-STBuilding` | `/nodes/77/fields/1` | 91120–91143 |
| STA · elevation · 高度(y) | `STA-elevation` | `/nodes/77/fields/2` | 91144–91167 |
| STA · platforms · platforms | `STA-runtime-platforms` | `/nodes/77/fields/3` | 91168–91183 |
| STA · extensions.link.wiki · WIKI链接 | `STA-registry-extensions.link.wiki` | `/nodes/77/fields/4` | 91184–91200 |
| STA · extensions.character.brief · 简介 | `STA-registry-extensions.character.brief` | `/nodes/77/fields/5` | 91201–91217 |
| STB · Name · 车站建筑名 | `STB-Name` | `/nodes/78/fields/0` | 92130–92153 |
| STB · elevation · 高度(y) | `STB-elevation` | `/nodes/78/fields/1` | 92154–92177 |
| STB · height · 建筑高度(height) | `STB-height` | `/nodes/78/fields/2` | 92178–92201 |
| STB · extensions.link.wiki · WIKI链接 | `STB-registry-extensions.link.wiki` | `/nodes/78/fields/3` | 92202–92218 |
| STB · extensions.character.brief · 简介 | `STB-registry-extensions.character.brief` | `/nodes/78/fields/4` | 92219–92235 |
| STB · Floors · 包含楼层 | `STB-registry-Floors` | `/nodes/78/fields/5` | 92236–92251 |
| STF · Name · 楼层名 | `STF-Name` | `/nodes/79/fields/0` | 93254–93277 |
| STF · NofFloor · 楼层名(NofFloor) | `STF-NofFloor` | `/nodes/79/fields/1` | 93278–93301 |
| STF · staBuildingID · 所属车站建筑(staBuildingID) | `STF-staBuildingID` | `/nodes/79/fields/2` | 93302–93325 |
| STF · Situation · 状态(Situation) | `STF-Situation` | `/nodes/79/fields/3` | 93326–93349 |
| STF · elevation · 高度(y) | `STF-elevation` | `/nodes/79/fields/4` | 93350–93373 |
| STF · height · 层高(height) | `STF-height` | `/nodes/79/fields/5` | 93374–93397 |
| STF · extensions.link.wiki · WIKI链接 | `STF-registry-extensions.link.wiki` | `/nodes/79/fields/6` | 93398–93414 |
| STF · extensions.character.brief · 简介 | `STF-registry-extensions.character.brief` | `/nodes/79/fields/7` | 93415–93431 |
| TPP · Name · 传送点名 | `TPP-Name` | `/nodes/80/fields/0` | 94295–94318 |
| TPP · hub · 枢纽(hub) | `TPP-hub` | `/nodes/80/fields/1` | 94319–94343 |
| TPP · TGTWarp · 目标Warp(TGTWarp) | `TPP-TGTWarp` | `/nodes/80/fields/2` | 94344–94367 |
| TPP · TGT_x · 目标点X(TGT_x) | `TPP-TGT_x` | `/nodes/80/fields/3` | 94368–94391 |
| TPP · TGT_z · 目标点Z(TGT_z) | `TPP-TGT_z` | `/nodes/80/fields/4` | 94392–94415 |
| TPP · elevation · 传送点高度(y) | `TPP-elevation` | `/nodes/80/fields/5` | 94416–94439 |
| TPP · TGTelevation · 目标点高度(TGTelevation) | `TPP-TGTelevation` | `/nodes/80/fields/6` | 94440–94463 |
| TPP · TGTcoordinate.x · TGTcoordinate.x | `TPP-runtime-TGTcoordinate.x` | `/nodes/80/fields/7` | 94464–94486 |
| TPP · TGTcoordinate.y · TGTcoordinate.y | `TPP-runtime-TGTcoordinate.y` | `/nodes/80/fields/8` | 94487–94502 |
| TPP · TGTcoordinate.z · TGTcoordinate.z | `TPP-runtime-TGTcoordinate.z` | `/nodes/80/fields/9` | 94503–94525 |
| TPP · tags.Land · 所属地理单元 | `TPP-registry-tags.Land` | `/nodes/80/fields/10` | 94526–94542 |
| TPP · tags.UAdm · 所属聚落(地标点) | `TPP-registry-tags.UAdm` | `/nodes/80/fields/11` | 94543–94559 |
| TPP · tags.UAdmG · 所属聚落(区划) | `TPP-registry-tags.UAdmG` | `/nodes/80/fields/12` | 94560–94576 |
| TPP · extensions.link.wiki · WIKI链接 | `TPP-registry-extensions.link.wiki` | `/nodes/80/fields/13` | 94577–94593 |
| TPP · extensions.character.brief · 简介 | `TPP-registry-extensions.character.brief` | `/nodes/80/fields/14` | 94594–94610 |
| TPP · TGTcoordinate · 目标坐标 | `TPP-TGTcoordinate` | `/nodes/80/fields/15` | 94611–94626 |
| TRP · Name · 交易点名 | `TRP-Name` | `/nodes/85/fields/0` | 99498–99521 |
| TRP · Interaction · 交互模式(Interaction) | `TRP-Interaction` | `/nodes/85/fields/1` | 99522–99545 |
| TRP · Situation · 启用状况(Situation) | `TRP-Situation` | `/nodes/85/fields/2` | 99546–99569 |
| TRP · TradeJSON · 交易列表(Trade) JSON | `TRP-TradeJSON` | `/nodes/85/fields/3` | 99570–99593 |
| TRP · elevation · 高度(y) | `TRP-elevation` | `/nodes/85/fields/4` | 99594–99617 |
| TRP · tags.Land · 所属地理单元 | `TRP-registry-tags.Land` | `/nodes/85/fields/5` | 99618–99634 |
| TRP · tags.UAdm · 所属聚落(地标点) | `TRP-registry-tags.UAdm` | `/nodes/85/fields/6` | 99635–99651 |
| TRP · tags.UAdmG · 所属聚落(区划) | `TRP-registry-tags.UAdmG` | `/nodes/85/fields/7` | 99652–99668 |
| TRP · Trade · 交易列表 | `TRP-registry-Trade` | `/nodes/85/fields/8` | 99669–99684 |
| TRP · extensions.link.wiki · WIKI链接 | `TRP-registry-extensions.link.wiki` | `/nodes/85/fields/9` | 99685–99701 |
| TRP · extensions.character.brief · 简介 | `TRP-registry-extensions.character.brief` | `/nodes/85/fields/10` | 99702–99718 |
| WRP · WRPointI2D · Warp点游戏内ID(WRPointI2D) | `WRP-WRPointI2D` | `/nodes/90/fields/0` | 103524–103547 |
| WRP · Name · Warp点名 | `WRP-Name` | `/nodes/90/fields/1` | 103548–103571 |
| WRP · hub · 枢纽(hub) | `WRP-hub` | `/nodes/90/fields/2` | 103572–103596 |
| WRP · elevation · 高度(y) | `WRP-elevation` | `/nodes/90/fields/3` | 103597–103620 |
| WRP · tags.Land · 所属地理单元 | `WRP-registry-tags.Land` | `/nodes/90/fields/4` | 103621–103637 |
| WRP · tags.UAdm · 所属行政/聚落单元 | `WRP-registry-tags.UAdm` | `/nodes/90/fields/5` | 103638–103654 |
| WRP · tags.UAdmG · 所属聚落(区划) | `WRP-registry-tags.UAdmG` | `/nodes/90/fields/6` | 103655–103671 |
| WRP · extensions.link.wiki · WIKI链接 | `WRP-registry-extensions.link.wiki` | `/nodes/90/fields/7` | 103672–103688 |
| WRP · extensions.character.brief · 简介 | `WRP-registry-extensions.character.brief` | `/nodes/90/fields/8` | 103689–103705 |

## 渲染规则

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| BUD · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/0` | 1189–1302 |
| BUD · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/1` | 1303–1442 |
| BUD · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/0/geometryProfiles/Polygon/zoomPriority/rules/2` | 1443–1576 |
| BUD/NOM · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/1/geometryProfiles/Polygon/zoomPriority/rules/0` | 2302–2415 |
| BUD/NOM · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/1/geometryProfiles/Polygon/zoomPriority/rules/1` | 2416–2555 |
| BUD/NOM · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/1/geometryProfiles/Polygon/zoomPriority/rules/2` | 2556–2689 |
| BUD/SPE · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/2/geometryProfiles/Polygon/zoomPriority/rules/0` | 3360–3473 |
| BUD/SPE · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/2/geometryProfiles/Polygon/zoomPriority/rules/1` | 3474–3613 |
| BUD/SPE · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/2/geometryProfiles/Polygon/zoomPriority/rules/2` | 3614–3747 |
| BUD/NOM/NOM · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/3/geometryProfiles/Polygon/zoomPriority/rules/0` | 4421–4534 |
| BUD/NOM/NOM · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/3/geometryProfiles/Polygon/zoomPriority/rules/1` | 4535–4674 |
| BUD/NOM/NOM · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/3/geometryProfiles/Polygon/zoomPriority/rules/2` | 4675–4808 |
| BUD/SPE/SPE · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/4/geometryProfiles/Polygon/zoomPriority/rules/0` | 5482–5595 |
| BUD/SPE/SPE · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/4/geometryProfiles/Polygon/zoomPriority/rules/1` | 5596–5735 |
| BUD/SPE/SPE · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/4/geometryProfiles/Polygon/zoomPriority/rules/2` | 5736–5869 |
| FLR · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/0` | 6800–6901 |
| FLR · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/5/geometryProfiles/Polygon/zoomPriority/rules/1` | 6902–7022 |
| FLR/NOM · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/6/geometryProfiles/Polygon/zoomPriority/rules/0` | 7858–7959 |
| FLR/NOM · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/6/geometryProfiles/Polygon/zoomPriority/rules/1` | 7960–8080 |
| FLR/SPE · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/7/geometryProfiles/Polygon/zoomPriority/rules/0` | 8839–8940 |
| FLR/SPE · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/7/geometryProfiles/Polygon/zoomPriority/rules/1` | 8941–9061 |
| FLR/NOM/NOM · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/8/geometryProfiles/Polygon/zoomPriority/rules/0` | 9823–9924 |
| FLR/NOM/NOM · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/8/geometryProfiles/Polygon/zoomPriority/rules/1` | 9925–10045 |
| FLR/SPE/SPE · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/9/geometryProfiles/Polygon/zoomPriority/rules/0` | 10807–10908 |
| FLR/SPE/SPE · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/9/geometryProfiles/Polygon/zoomPriority/rules/1` | 10909–11029 |
| ISG · Polygon · 0–1 | `v1-generic-surface-hidden-before--base` | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/0` | 11987–12104 |
| ISG · Polygon · 2–8 | `v1-generic-surface--base` | `/nodes/10/geometryProfiles/Polygon/zoomPriority/rules/1` | 12105–12223 |
| ISG/NGF · Polygon · 0–1 | `v1-generic-surface-hidden-before--base` | `/nodes/11/geometryProfiles/Polygon/zoomPriority/rules/0` | 13105–13222 |
| ISG/NGF · Polygon · 2–8 | `v1-generic-surface--base` | `/nodes/11/geometryProfiles/Polygon/zoomPriority/rules/1` | 13223–13341 |
| ISG/ADM · Polygon · 0–1 | `v1-generic-surface-hidden-before--base` | `/nodes/12/geometryProfiles/Polygon/zoomPriority/rules/0` | 13491–13608 |
| ISG/ADM · Polygon · 2–8 | `v1-generic-surface--base` | `/nodes/12/geometryProfiles/Polygon/zoomPriority/rules/1` | 13609–13727 |
| ISG/NGF/LAD · Polygon · 0–4 | `v1-isg-land-detail-hidden-before--base` | `/nodes/13/geometryProfiles/Polygon/zoomPriority/rules/0` | 13886–14003 |
| ISG/NGF/LAD · Polygon · 5–8 | `v1-isg-land-detail--base` | `/nodes/13/geometryProfiles/Polygon/zoomPriority/rules/1` | 14004–14122 |
| ISG/NGF/LIS · Polygon · 0–4 | `v1-isg-landform-hidden-before--base` | `/nodes/14/geometryProfiles/Polygon/zoomPriority/rules/0` | 15132–15249 |
| ISG/NGF/LIS · Polygon · 5–8 | `v1-isg-landform--base` | `/nodes/14/geometryProfiles/Polygon/zoomPriority/rules/1` | 15250–15368 |
| ISG/NGF/WTB · Polygon · 0–4 | `v1-isg-water-detail-hidden-before--base` | `/nodes/15/geometryProfiles/Polygon/zoomPriority/rules/0` | 16429–16546 |
| ISG/NGF/WTB · Polygon · 5–8 | `v1-isg-water-detail--base` | `/nodes/15/geometryProfiles/Polygon/zoomPriority/rules/1` | 16547–16665 |
| ISG/ADM/DBZ · Polygon · 0–8 | `v1-isg-admin-unclassified--base` | `/nodes/16/geometryProfiles/Polygon/zoomPriority/rules/0` | 17725–17842 |
| ISG/ADM/PLZ · Polygon · 0–8 | `v1-isg-admin-unclassified--base` | `/nodes/17/geometryProfiles/Polygon/zoomPriority/rules/0` | 18954–19071 |
| ISG/NGF/LAD/CON · Polygon · 0–4 | `v1-isg-land-continent--base` | `/nodes/18/geometryProfiles/Polygon/zoomPriority/rules/0` | 20207–20325 |
| ISG/NGF/LAD/CON · Polygon · 5–8 | `v1-isg-land-continent-hidden-after--base` | `/nodes/18/geometryProfiles/Polygon/zoomPriority/rules/1` | 20326–20443 |
| ISG/NGF/LAD/ISD · Polygon · 0–2 | `v1-isg-land-medium-hidden-before--base` | `/nodes/19/geometryProfiles/Polygon/zoomPriority/rules/0` | 21426–21543 |
| ISG/NGF/LAD/ISD · Polygon · 3–8 | `v1-isg-land-medium--base` | `/nodes/19/geometryProfiles/Polygon/zoomPriority/rules/1` | 21544–21662 |
| ISG/NGF/LAD/SBC · Polygon · 0–4 | `v1-isg-land-detail-hidden-before--base` | `/nodes/20/geometryProfiles/Polygon/zoomPriority/rules/0` | 22645–22762 |
| ISG/NGF/LAD/SBC · Polygon · 5–8 | `v1-isg-land-detail--base` | `/nodes/20/geometryProfiles/Polygon/zoomPriority/rules/1` | 22763–22881 |
| ISG/NGF/LAD/RGC · Polygon · 0–4 | `v1-isg-land-detail-hidden-before--base` | `/nodes/21/geometryProfiles/Polygon/zoomPriority/rules/0` | 23864–23981 |
| ISG/NGF/LAD/RGC · Polygon · 5–8 | `v1-isg-land-detail--base` | `/nodes/21/geometryProfiles/Polygon/zoomPriority/rules/1` | 23982–24100 |
| ISG/NGF/LAD/PEN · Polygon · 0–2 | `v1-isg-land-medium-hidden-before--base` | `/nodes/22/geometryProfiles/Polygon/zoomPriority/rules/0` | 25083–25200 |
| ISG/NGF/LAD/PEN · Polygon · 3–8 | `v1-isg-land-medium--base` | `/nodes/22/geometryProfiles/Polygon/zoomPriority/rules/1` | 25201–25319 |
| ISG/NGF/LAD/IST · Polygon · 0–2 | `v1-isg-land-medium-hidden-before--base` | `/nodes/23/geometryProfiles/Polygon/zoomPriority/rules/0` | 26302–26419 |
| ISG/NGF/LAD/IST · Polygon · 3–8 | `v1-isg-land-medium--base` | `/nodes/23/geometryProfiles/Polygon/zoomPriority/rules/1` | 26420–26538 |
| ISG/NGF/LIS/MTN · Polygon · 0–4 | `v1-isg-landform-hidden-before--base` | `/nodes/24/geometryProfiles/Polygon/zoomPriority/rules/0` | 27521–27638 |
| ISG/NGF/LIS/MTN · Polygon · 5–8 | `v1-isg-landform--base` | `/nodes/24/geometryProfiles/Polygon/zoomPriority/rules/1` | 27639–27757 |
| ISG/NGF/LIS/BSN · Polygon · 0–4 | `v1-isg-landform-hidden-before--base` | `/nodes/25/geometryProfiles/Polygon/zoomPriority/rules/0` | 28774–28891 |
| ISG/NGF/LIS/BSN · Polygon · 5–8 | `v1-isg-landform--base` | `/nodes/25/geometryProfiles/Polygon/zoomPriority/rules/1` | 28892–29010 |
| ISG/NGF/LIS/PLN · Polygon · 0–4 | `v1-isg-landform-hidden-before--base` | `/nodes/26/geometryProfiles/Polygon/zoomPriority/rules/0` | 30027–30144 |
| ISG/NGF/LIS/PLN · Polygon · 5–8 | `v1-isg-landform--base` | `/nodes/26/geometryProfiles/Polygon/zoomPriority/rules/1` | 30145–30263 |
| ISG/NGF/WTB/SEA · Polygon · 0–3 | `v1-isg-water-sea--base` | `/nodes/27/geometryProfiles/Polygon/zoomPriority/rules/0` | 31280–31398 |
| ISG/NGF/WTB/SEA · Polygon · 4–8 | `v1-isg-water-sea-hidden-after--base` | `/nodes/27/geometryProfiles/Polygon/zoomPriority/rules/1` | 31399–31516 |
| ISG/NGF/WTB/LKE · Polygon · 0–4 | `v1-isg-water-detail-hidden-before--base` | `/nodes/28/geometryProfiles/Polygon/zoomPriority/rules/0` | 32533–32650 |
| ISG/NGF/WTB/LKE · Polygon · 5–8 | `v1-isg-water-detail--base` | `/nodes/28/geometryProfiles/Polygon/zoomPriority/rules/1` | 32651–32769 |
| ISG/NGF/WTB/STR · Polygon · 0–4 | `v1-isg-water-detail-hidden-before--base` | `/nodes/29/geometryProfiles/Polygon/zoomPriority/rules/0` | 33786–33903 |
| ISG/NGF/WTB/STR · Polygon · 5–8 | `v1-isg-water-detail--base` | `/nodes/29/geometryProfiles/Polygon/zoomPriority/rules/1` | 33904–34022 |
| ISG/NGF/WTB/EST · Polygon · 0–4 | `v1-isg-water-detail-hidden-before--base` | `/nodes/30/geometryProfiles/Polygon/zoomPriority/rules/0` | 35039–35156 |
| ISG/NGF/WTB/EST · Polygon · 5–8 | `v1-isg-water-detail--base` | `/nodes/30/geometryProfiles/Polygon/zoomPriority/rules/1` | 35157–35275 |
| ISG/ADM/DBZ/L1 · Polygon · 0–3 | `v1-isg-admin-l1-hidden-before--base` | `/nodes/31/geometryProfiles/Polygon/zoomPriority/rules/0` | 36292–36409 |
| ISG/ADM/DBZ/L1 · Polygon · 4–4 | `v1-isg-admin-l1--base` | `/nodes/31/geometryProfiles/Polygon/zoomPriority/rules/1` | 36410–36528 |
| ISG/ADM/DBZ/L1 · Polygon · 5–8 | `v1-isg-admin-l1-hidden-after--base` | `/nodes/31/geometryProfiles/Polygon/zoomPriority/rules/2` | 36529–36646 |
| ISG/ADM/DBZ/L2 · Polygon · 0–5 | `v1-isg-admin-l2-hidden-before--base` | `/nodes/32/geometryProfiles/Polygon/zoomPriority/rules/0` | 37697–37814 |
| ISG/ADM/DBZ/L2 · Polygon · 6–6 | `v1-isg-admin-l2--base` | `/nodes/32/geometryProfiles/Polygon/zoomPriority/rules/1` | 37815–37933 |
| ISG/ADM/DBZ/L2 · Polygon · 7–8 | `v1-isg-admin-l2-hidden-after--base` | `/nodes/32/geometryProfiles/Polygon/zoomPriority/rules/2` | 37934–38051 |
| ISG/ADM/DBZ/L3 · Polygon · 0–7 | `v1-isg-admin-l3-hidden-before--base` | `/nodes/33/geometryProfiles/Polygon/zoomPriority/rules/0` | 39102–39219 |
| ISG/ADM/DBZ/L3 · Polygon · 8–8 | `v1-isg-admin-l3--base` | `/nodes/33/geometryProfiles/Polygon/zoomPriority/rules/1` | 39220–39338 |
| ISG/ADM/PLZ/L1 · Polygon · 0–3 | `v1-isg-admin-l1-hidden-before--base` | `/nodes/34/geometryProfiles/Polygon/zoomPriority/rules/0` | 40389–40506 |
| ISG/ADM/PLZ/L1 · Polygon · 4–4 | `v1-isg-admin-l1--base` | `/nodes/34/geometryProfiles/Polygon/zoomPriority/rules/1` | 40507–40625 |
| ISG/ADM/PLZ/L1 · Polygon · 5–8 | `v1-isg-admin-l1-hidden-after--base` | `/nodes/34/geometryProfiles/Polygon/zoomPriority/rules/2` | 40626–40743 |
| ISG/ADM/PLZ/L2 · Polygon · 0–5 | `v1-isg-admin-l2-hidden-before--base` | `/nodes/35/geometryProfiles/Polygon/zoomPriority/rules/0` | 41811–41928 |
| ISG/ADM/PLZ/L2 · Polygon · 6–6 | `v1-isg-admin-l2--base` | `/nodes/35/geometryProfiles/Polygon/zoomPriority/rules/1` | 41929–42047 |
| ISG/ADM/PLZ/L2 · Polygon · 7–8 | `v1-isg-admin-l2-hidden-after--base` | `/nodes/35/geometryProfiles/Polygon/zoomPriority/rules/2` | 42048–42165 |
| ISG/ADM/PLZ/L3 · Polygon · 0–7 | `v1-isg-admin-l3-hidden-before--base` | `/nodes/36/geometryProfiles/Polygon/zoomPriority/rules/0` | 43233–43350 |
| ISG/ADM/PLZ/L3 · Polygon · 8–8 | `v1-isg-admin-l3--base` | `/nodes/36/geometryProfiles/Polygon/zoomPriority/rules/1` | 43351–43469 |
| ISG/ADM/PLZ/UP · Polygon · 0–8 | `v1-isg-admin-hidden--base` | `/nodes/37/geometryProfiles/Polygon/zoomPriority/rules/0` | 44537–44654 |
| ISG/ADM/PLZ/UC · Polygon · 0–8 | `v1-isg-admin-hidden--base` | `/nodes/38/geometryProfiles/Polygon/zoomPriority/rules/0` | 45722–45839 |
| ISL · LineString · 0–8 | `v1-generic-line--base` | `/nodes/39/geometryProfiles/LineString/zoomPriority/rules/0` | 47098–47258 |
| ISL/NGF · LineString · 0–8 | `v1-generic-line--base` | `/nodes/40/geometryProfiles/LineString/zoomPriority/rules/0` | 47899–48059 |
| ISL/ADM · LineString · 0–8 | `v1-generic-line--base` | `/nodes/41/geometryProfiles/LineString/zoomPriority/rules/0` | 48209–48369 |
| ISL/NGF/WTR · LineString · 0–8 | `v1-generic-line--base` | `/nodes/42/geometryProfiles/LineString/zoomPriority/rules/0` | 48524–48684 |
| ISL/NGF/BOD · LineString · 0–8 | `v1-generic-line--base` | `/nodes/43/geometryProfiles/LineString/zoomPriority/rules/0` | 49453–49613 |
| ISL/ADM/DBL · LineString · 0–8 | `v1-generic-line--base` | `/nodes/44/geometryProfiles/LineString/zoomPriority/rules/0` | 50431–50591 |
| ISL/ADM/PLL · LineString · 0–8 | `v1-generic-line--base` | `/nodes/45/geometryProfiles/LineString/zoomPriority/rules/0` | 51459–51619 |
| ISL/NGF/WTR/RVR · LineString · 0–8 | `v1-generic-line--base` | `/nodes/46/geometryProfiles/LineString/zoomPriority/rules/0` | 52490–52650 |
| ISL/NGF/WTR/CAN · LineString · 0–8 | `v1-generic-line--base` | `/nodes/47/geometryProfiles/LineString/zoomPriority/rules/0` | 53393–53553 |
| ISL/NGF/BOD/BDY · LineString · 0–8 | `v1-generic-line--base` | `/nodes/48/geometryProfiles/LineString/zoomPriority/rules/0` | 54296–54456 |
| ISL/NGF/BOD/STC · LineString · 0–8 | `v1-generic-line--base` | `/nodes/49/geometryProfiles/LineString/zoomPriority/rules/0` | 55233–55393 |
| ISL/ADM/DBL/LBD · LineString · 0–8 | `v1-generic-line--base` | `/nodes/50/geometryProfiles/LineString/zoomPriority/rules/0` | 56170–56330 |
| ISL/ADM/PLL/CBD · LineString · 0–8 | `v1-generic-line--base` | `/nodes/51/geometryProfiles/LineString/zoomPriority/rules/0` | 57141–57301 |
| ISP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/52/geometryProfiles/Point/zoomPriority/rules/0` | 58293–58409 |
| ISP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/52/geometryProfiles/Point/zoomPriority/rules/1` | 58410–58527 |
| ISP/NGF · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/53/geometryProfiles/Point/zoomPriority/rules/0` | 59153–59269 |
| ISP/NGF · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/53/geometryProfiles/Point/zoomPriority/rules/1` | 59270–59387 |
| ISP/ADM · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/54/geometryProfiles/Point/zoomPriority/rules/0` | 59537–59653 |
| ISP/ADM · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/54/geometryProfiles/Point/zoomPriority/rules/1` | 59654–59771 |
| ISP/NGF/SCP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/55/geometryProfiles/Point/zoomPriority/rules/0` | 59925–60041 |
| ISP/NGF/SCP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/55/geometryProfiles/Point/zoomPriority/rules/1` | 60042–60159 |
| ISP/ADM/DBP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/56/geometryProfiles/Point/zoomPriority/rules/0` | 61014–61130 |
| ISP/ADM/DBP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/56/geometryProfiles/Point/zoomPriority/rules/1` | 61131–61248 |
| ISP/ADM/PLP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/57/geometryProfiles/Point/zoomPriority/rules/0` | 62103–62219 |
| ISP/ADM/PLP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/57/geometryProfiles/Point/zoomPriority/rules/1` | 62220–62337 |
| ISP/NGF/SCP/SPP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/58/geometryProfiles/Point/zoomPriority/rules/0` | 63194–63310 |
| ISP/NGF/SCP/SPP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/58/geometryProfiles/Point/zoomPriority/rules/1` | 63311–63428 |
| ISP/ADM/DBP/LIP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/59/geometryProfiles/Point/zoomPriority/rules/0` | 64225–64341 |
| ISP/ADM/DBP/LIP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/59/geometryProfiles/Point/zoomPriority/rules/1` | 64342–64459 |
| ISP/ADM/PLP/PLP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/60/geometryProfiles/Point/zoomPriority/rules/0` | 65256–65372 |
| ISP/ADM/PLP/PLP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/60/geometryProfiles/Point/zoomPriority/rules/1` | 65373–65490 |
| ISP/ADM/PLP/COP · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/61/geometryProfiles/Point/zoomPriority/rules/0` | 66287–66403 |
| ISP/ADM/PLP/COP · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/61/geometryProfiles/Point/zoomPriority/rules/1` | 66404–66521 |
| ISP/ADM/DBP/SHR · Point · 0–3 | `v1-generic-point-symbol--base` | `/nodes/62/geometryProfiles/Point/zoomPriority/rules/0` | 67318–67434 |
| ISP/ADM/DBP/SHR · Point · 4–8 | `v1-generic-point-label--base` | `/nodes/62/geometryProfiles/Point/zoomPriority/rules/1` | 67435–67552 |
| PFB · Polygon · 0–4 | `v1-platform-footprint-hidden-before--base` | `/nodes/63/geometryProfiles/Polygon/zoomPriority/rules/0` | 68464–68576 |
| PFB · Polygon · 5–8 | `v1-platform-footprint--base` | `/nodes/63/geometryProfiles/Polygon/zoomPriority/rules/1` | 68577–68691 |
| PLF · Point · 0–7 | `v1-platform-hidden--base` | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/0` | 69381–69490 |
| PLF · Point · 8–8 | `v1-platform-high--base` | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/1` | 69491–69612 |
| PLF · Point · 8–8 | `v1-platform-high--case-1` | `/nodes/64/geometryProfiles/Point/zoomPriority/rules/2` | 69613–69753 |
| RLE · LineString · 0–1 | `v1-rle-dir3-geometry--base` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/0` | 70746–70932 |
| RLE · LineString · 2–4 | `v1-rle-dir3-geometry--base--zoom2-4` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/1` | 70933–71119 |
| RLE · LineString · 2–4 | `r10-rle-code-pill-zoom2-4` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/2` | 71120–71333 |
| RLE · LineString · 5–7 | `v1-rle-dir3-pill--base` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/3` | 71334–71520 |
| RLE · LineString · 5–7 | `v1-rle-dir3-pill--case-1` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/4` | 71521–71732 |
| RLE · LineString · 8–8 | `v1-rle-exclusive-high--base` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/5` | 71733–71919 |
| RLE · LineString · 8–8 | `v1-rle-exclusive-high--case-2` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/6` | 71920–72143 |
| RLE · LineString · 8–8 | `v1-rle-exclusive-high--case-1` | `/nodes/65/geometryProfiles/LineString/zoomPriority/rules/7` | 72144–72367 |
| ROD · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/0` | 73397–73588 |
| ROD · LineString · 6–6 | `v1-road-low--base` | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/1` | 73589–73784 |
| ROD · LineString · 7–8 | `v1-road-high--base` | `/nodes/66/geometryProfiles/LineString/zoomPriority/rules/2` | 73785–73980 |
| ROD/NOM · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/67/geometryProfiles/LineString/zoomPriority/rules/0` | 75158–75349 |
| ROD/NOM · LineString · 6–6 | `v1-road-low--base` | `/nodes/67/geometryProfiles/LineString/zoomPriority/rules/1` | 75350–75545 |
| ROD/NOM · LineString · 7–8 | `v1-road-high--base` | `/nodes/67/geometryProfiles/LineString/zoomPriority/rules/2` | 75546–75741 |
| ROD/TUK · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/68/geometryProfiles/LineString/zoomPriority/rules/0` | 76822–77013 |
| ROD/TUK · LineString · 6–6 | `v1-road-low--base` | `/nodes/68/geometryProfiles/LineString/zoomPriority/rules/1` | 77014–77209 |
| ROD/TUK · LineString · 7–8 | `v1-road-high--base` | `/nodes/68/geometryProfiles/LineString/zoomPriority/rules/2` | 77210–77405 |
| ROD/PRI · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/69/geometryProfiles/LineString/zoomPriority/rules/0` | 78486–78677 |
| ROD/PRI · LineString · 6–6 | `v1-road-low--base` | `/nodes/69/geometryProfiles/LineString/zoomPriority/rules/1` | 78678–78873 |
| ROD/PRI · LineString · 7–8 | `v1-road-high--base` | `/nodes/69/geometryProfiles/LineString/zoomPriority/rules/2` | 78874–79069 |
| ROD/SEC · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/70/geometryProfiles/LineString/zoomPriority/rules/0` | 80150–80341 |
| ROD/SEC · LineString · 6–6 | `v1-road-low--base` | `/nodes/70/geometryProfiles/LineString/zoomPriority/rules/1` | 80342–80537 |
| ROD/SEC · LineString · 7–8 | `v1-road-high--base` | `/nodes/70/geometryProfiles/LineString/zoomPriority/rules/2` | 80538–80733 |
| ROD/SED · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/71/geometryProfiles/LineString/zoomPriority/rules/0` | 81814–82005 |
| ROD/SED · LineString · 6–6 | `v1-road-low--base` | `/nodes/71/geometryProfiles/LineString/zoomPriority/rules/1` | 82006–82201 |
| ROD/SED · LineString · 7–8 | `v1-road-high--base` | `/nodes/71/geometryProfiles/LineString/zoomPriority/rules/2` | 82202–82397 |
| ROD/RES · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/72/geometryProfiles/LineString/zoomPriority/rules/0` | 83478–83669 |
| ROD/RES · LineString · 6–6 | `v1-road-low--base` | `/nodes/72/geometryProfiles/LineString/zoomPriority/rules/1` | 83670–83865 |
| ROD/RES · LineString · 7–8 | `v1-road-high--base` | `/nodes/72/geometryProfiles/LineString/zoomPriority/rules/2` | 83866–84061 |
| ROD/SVS · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/73/geometryProfiles/LineString/zoomPriority/rules/0` | 85142–85333 |
| ROD/SVS · LineString · 6–6 | `v1-road-low--base` | `/nodes/73/geometryProfiles/LineString/zoomPriority/rules/1` | 85334–85529 |
| ROD/SVS · LineString · 7–8 | `v1-road-high--base` | `/nodes/73/geometryProfiles/LineString/zoomPriority/rules/2` | 85530–85725 |
| ROD/IDR · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/74/geometryProfiles/LineString/zoomPriority/rules/0` | 86806–86997 |
| ROD/IDR · LineString · 6–6 | `v1-road-low--base` | `/nodes/74/geometryProfiles/LineString/zoomPriority/rules/1` | 86998–87193 |
| ROD/IDR · LineString · 7–8 | `v1-road-high--base` | `/nodes/74/geometryProfiles/LineString/zoomPriority/rules/2` | 87194–87389 |
| ROD/SPE · LineString · 0–5 | `v1-road-hidden--base` | `/nodes/75/geometryProfiles/LineString/zoomPriority/rules/0` | 88470–88661 |
| ROD/SPE · LineString · 6–6 | `v1-road-low--base` | `/nodes/75/geometryProfiles/LineString/zoomPriority/rules/1` | 88662–88857 |
| ROD/SPE · LineString · 7–8 | `v1-road-high--base` | `/nodes/75/geometryProfiles/LineString/zoomPriority/rules/2` | 88858–89053 |
| SBP · Point · 0–5 | `v1-station-building-icon--base` | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/0` | 90258–90396 |
| SBP · Point · 6–8 | `v1-station-building-icon-label--base` | `/nodes/76/geometryProfiles/Point/zoomPriority/rules/1` | 90397–90535 |
| STA · Point · 0–3 | `v1-station-hidden--base` | `/nodes/77/geometryProfiles/Point/zoomPriority/rules/0` | 91236–91343 |
| STA · Point · 4–7 | `v1-station-normal--base` | `/nodes/77/geometryProfiles/Point/zoomPriority/rules/1` | 91344–91454 |
| STA · Point · 8–8 | `v1-station-platform-coincident--base` | `/nodes/77/geometryProfiles/Point/zoomPriority/rules/2` | 91455–91577 |
| STB · Polygon · 0–2 | `v1-structure-hidden--base` | `/nodes/78/geometryProfiles/Polygon/zoomPriority/rules/0` | 92270–92383 |
| STB · Polygon · 3–5 | `v1-structure-low-point--base` | `/nodes/78/geometryProfiles/Polygon/zoomPriority/rules/1` | 92384–92523 |
| STB · Polygon · 6–8 | `v1-structure-high-geometry--base` | `/nodes/78/geometryProfiles/Polygon/zoomPriority/rules/2` | 92524–92657 |
| STF · Polygon · 0–5 | `v1-floor-member-hidden-before--base` | `/nodes/79/geometryProfiles/Polygon/zoomPriority/rules/0` | 93450–93551 |
| STF · Polygon · 6–8 | `v1-floor-member--base` | `/nodes/79/geometryProfiles/Polygon/zoomPriority/rules/1` | 93552–93672 |
| TPP · Point · 0–4 | `v1-tpp-point-hidden-before--base` | `/nodes/80/geometryProfiles/Point/zoomPriority/rules/0` | 94645–94760 |
| TPP · Point · 5–8 | `v1-tpp-point--base` | `/nodes/80/geometryProfiles/Point/zoomPriority/rules/1` | 94761–94877 |
| TPP/NOM · Point · 0–4 | `v1-tpp-point-hidden-before--base` | `/nodes/81/geometryProfiles/Point/zoomPriority/rules/0` | 95672–95787 |
| TPP/NOM · Point · 5–8 | `v1-tpp-point--base` | `/nodes/81/geometryProfiles/Point/zoomPriority/rules/1` | 95788–95904 |
| TPP/SPE · Point · 0–4 | `v1-tpp-point-hidden-before--base` | `/nodes/82/geometryProfiles/Point/zoomPriority/rules/0` | 96632–96747 |
| TPP/SPE · Point · 5–8 | `v1-tpp-point--base` | `/nodes/82/geometryProfiles/Point/zoomPriority/rules/1` | 96748–96864 |
| TPP/NOM/NOM · Point · 0–4 | `v1-tpp-point-hidden-before--base` | `/nodes/83/geometryProfiles/Point/zoomPriority/rules/0` | 97595–97710 |
| TPP/NOM/NOM · Point · 5–8 | `v1-tpp-point--base` | `/nodes/83/geometryProfiles/Point/zoomPriority/rules/1` | 97711–97827 |
| TPP/SPE/SPE · Point · 0–4 | `v1-tpp-point-hidden-before--base` | `/nodes/84/geometryProfiles/Point/zoomPriority/rules/0` | 98558–98673 |
| TPP/SPE/SPE · Point · 5–8 | `v1-tpp-point--base` | `/nodes/84/geometryProfiles/Point/zoomPriority/rules/1` | 98674–98790 |
| TRP · Point · 0–4 | `v1-trp-point-hidden-before--base` | `/nodes/85/geometryProfiles/Point/zoomPriority/rules/0` | 99737–99852 |
| TRP · Point · 5–8 | `v1-trp-point--base` | `/nodes/85/geometryProfiles/Point/zoomPriority/rules/1` | 99853–99969 |
| TRP/NOM · Point · 0–4 | `v1-trp-point-hidden-before--base` | `/nodes/86/geometryProfiles/Point/zoomPriority/rules/0` | 100514–100629 |
| TRP/NOM · Point · 5–8 | `v1-trp-point--base` | `/nodes/86/geometryProfiles/Point/zoomPriority/rules/1` | 100630–100746 |
| TRP/SPE · Point · 0–4 | `v1-trp-point-hidden-before--base` | `/nodes/87/geometryProfiles/Point/zoomPriority/rules/0` | 101270–101385 |
| TRP/SPE · Point · 5–8 | `v1-trp-point--base` | `/nodes/87/geometryProfiles/Point/zoomPriority/rules/1` | 101386–101502 |
| TRP/NOM/NOM · Point · 0–4 | `v1-trp-point-hidden-before--base` | `/nodes/88/geometryProfiles/Point/zoomPriority/rules/0` | 102029–102144 |
| TRP/NOM/NOM · Point · 5–8 | `v1-trp-point--base` | `/nodes/88/geometryProfiles/Point/zoomPriority/rules/1` | 102145–102261 |
| TRP/SPE/SPE · Point · 0–4 | `v1-trp-point-hidden-before--base` | `/nodes/89/geometryProfiles/Point/zoomPriority/rules/0` | 102788–102903 |
| TRP/SPE/SPE · Point · 5–8 | `v1-trp-point--base` | `/nodes/89/geometryProfiles/Point/zoomPriority/rules/1` | 102904–103020 |
| WRP · Point · 0–4 | `v1-wrp-point-hidden-before--base` | `/nodes/90/geometryProfiles/Point/zoomPriority/rules/0` | 103724–103839 |
| WRP · Point · 5–8 | `v1-wrp-point--base` | `/nodes/90/geometryProfiles/Point/zoomPriority/rules/1` | 103840–103956 |
| WRP/NOM · Point · 0–4 | `v1-wrp-point-hidden-before--base` | `/nodes/91/geometryProfiles/Point/zoomPriority/rules/0` | 104624–104739 |
| WRP/NOM · Point · 5–8 | `v1-wrp-point--base` | `/nodes/91/geometryProfiles/Point/zoomPriority/rules/1` | 104740–104856 |
| WRP/SPE · Point · 0–4 | `v1-wrp-point-hidden-before--base` | `/nodes/92/geometryProfiles/Point/zoomPriority/rules/0` | 105475–105590 |
| WRP/SPE · Point · 5–8 | `v1-wrp-point--base` | `/nodes/92/geometryProfiles/Point/zoomPriority/rules/1` | 105591–105707 |
| WRP/NOM/NOM · Point · 0–4 | `v1-wrp-point-hidden-before--base` | `/nodes/93/geometryProfiles/Point/zoomPriority/rules/0` | 106329–106444 |
| WRP/NOM/NOM · Point · 5–8 | `v1-wrp-point--base` | `/nodes/93/geometryProfiles/Point/zoomPriority/rules/1` | 106445–106561 |
| WRP/SPE/SPE · Point · 0–4 | `v1-wrp-point-hidden-before--base` | `/nodes/94/geometryProfiles/Point/zoomPriority/rules/0` | 107183–107298 |
| WRP/SPE/SPE · Point · 5–8 | `v1-wrp-point--base` | `/nodes/94/geometryProfiles/Point/zoomPriority/rules/1` | 107299–107415 |

## 信息卡单元

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| BUD · Class | `BUD-classification-card` | `/nodes/0/card/items/0` | 1584–1597 |
| BUD · tags.nomenclator | `bud_building-card-nomenclator-0` | `/nodes/0/card/items/1` | 1598–1619 |
| BUD · tags.Land | `bud_building-card-Land-1` | `/nodes/0/card/items/2` | 1620–1641 |
| BUD · tags.Adm | `bud_building-card-Adm-2` | `/nodes/0/card/items/3` | 1642–1663 |
| BUD · tags.Pop | `bud_building-card-Pop-3` | `/nodes/0/card/items/4` | 1664–1685 |
| BUD · Situation | `bud_building-card-Situation-4` | `/nodes/0/card/items/5` | 1686–1707 |
| BUD · elevation | `bud_building-card-elevation-5` | `/nodes/0/card/items/6` | 1708–1729 |
| BUD · height | `bud_building-card-height-6` | `/nodes/0/card/items/7` | 1730–1751 |
| BUD · extensions.link.wiki | `bud_building-card-wiki-7` | `/nodes/0/card/items/8` | 1752–1777 |
| BUD · extensions.character.brief | `bud_building-card-brief-8` | `/nodes/0/card/items/9` | 1778–1799 |
| BUD · CreateTime | `BUD-CreateTime-meta` | `/nodes/0/card/items/10` | 1800–1812 |
| BUD · CreateBy | `BUD-CreateBy-meta` | `/nodes/0/card/items/11` | 1813–1825 |
| BUD · ModifityTime | `BUD-ModifityTime-meta` | `/nodes/0/card/items/12` | 1826–1838 |
| BUD · ModifityBy | `BUD-ModifityBy-meta` | `/nodes/0/card/items/13` | 1839–1851 |
| BUD/NOM · Class | `BUD-classification-card` | `/nodes/1/card/items/0` | 2697–2714 |
| BUD/NOM · tags.nomenclator | `bud_building-card-nomenclator-0` | `/nodes/1/card/items/1` | 2715–2730 |
| BUD/NOM · tags.Land | `bud_building-card-Land-1` | `/nodes/1/card/items/2` | 2731–2746 |
| BUD/NOM · tags.Adm | `bud_building-card-Adm-2` | `/nodes/1/card/items/3` | 2747–2762 |
| BUD/NOM · tags.Pop | `bud_building-card-Pop-3` | `/nodes/1/card/items/4` | 2763–2778 |
| BUD/NOM · Situation | `bud_building-card-Situation-4` | `/nodes/1/card/items/5` | 2779–2794 |
| BUD/NOM · elevation | `bud_building-card-elevation-5` | `/nodes/1/card/items/6` | 2795–2810 |
| BUD/NOM · height | `bud_building-card-height-6` | `/nodes/1/card/items/7` | 2811–2826 |
| BUD/NOM · extensions.link.wiki | `bud_building-card-wiki-7` | `/nodes/1/card/items/8` | 2827–2846 |
| BUD/NOM · extensions.character.brief | `bud_building-card-brief-8` | `/nodes/1/card/items/9` | 2847–2862 |
| BUD/NOM · CreateTime | `BUD-CreateTime-meta` | `/nodes/1/card/items/10` | 2863–2879 |
| BUD/NOM · CreateBy | `BUD-CreateBy-meta` | `/nodes/1/card/items/11` | 2880–2896 |
| BUD/NOM · ModifityTime | `BUD-ModifityTime-meta` | `/nodes/1/card/items/12` | 2897–2913 |
| BUD/NOM · ModifityBy | `BUD-ModifityBy-meta` | `/nodes/1/card/items/13` | 2914–2930 |
| BUD/SPE · Class | `BUD-classification-card` | `/nodes/2/card/items/0` | 3755–3772 |
| BUD/SPE · tags.nomenclator | `bud_building-card-nomenclator-0` | `/nodes/2/card/items/1` | 3773–3788 |
| BUD/SPE · tags.Land | `bud_building-card-Land-1` | `/nodes/2/card/items/2` | 3789–3804 |
| BUD/SPE · tags.Adm | `bud_building-card-Adm-2` | `/nodes/2/card/items/3` | 3805–3820 |
| BUD/SPE · tags.Pop | `bud_building-card-Pop-3` | `/nodes/2/card/items/4` | 3821–3836 |
| BUD/SPE · Situation | `bud_building-card-Situation-4` | `/nodes/2/card/items/5` | 3837–3852 |
| BUD/SPE · elevation | `bud_building-card-elevation-5` | `/nodes/2/card/items/6` | 3853–3868 |
| BUD/SPE · height | `bud_building-card-height-6` | `/nodes/2/card/items/7` | 3869–3884 |
| BUD/SPE · extensions.link.wiki | `bud_building-card-wiki-7` | `/nodes/2/card/items/8` | 3885–3904 |
| BUD/SPE · extensions.character.brief | `bud_building-card-brief-8` | `/nodes/2/card/items/9` | 3905–3920 |
| BUD/SPE · CreateTime | `BUD-CreateTime-meta` | `/nodes/2/card/items/10` | 3921–3937 |
| BUD/SPE · CreateBy | `BUD-CreateBy-meta` | `/nodes/2/card/items/11` | 3938–3954 |
| BUD/SPE · ModifityTime | `BUD-ModifityTime-meta` | `/nodes/2/card/items/12` | 3955–3971 |
| BUD/SPE · ModifityBy | `BUD-ModifityBy-meta` | `/nodes/2/card/items/13` | 3972–3988 |
| BUD/NOM/NOM · Class | `BUD-classification-card` | `/nodes/3/card/items/0` | 4816–4833 |
| BUD/NOM/NOM · tags.nomenclator | `bud_building-card-nomenclator-0` | `/nodes/3/card/items/1` | 4834–4849 |
| BUD/NOM/NOM · tags.Land | `bud_building-card-Land-1` | `/nodes/3/card/items/2` | 4850–4865 |
| BUD/NOM/NOM · tags.Adm | `bud_building-card-Adm-2` | `/nodes/3/card/items/3` | 4866–4881 |
| BUD/NOM/NOM · tags.Pop | `bud_building-card-Pop-3` | `/nodes/3/card/items/4` | 4882–4897 |
| BUD/NOM/NOM · Situation | `bud_building-card-Situation-4` | `/nodes/3/card/items/5` | 4898–4913 |
| BUD/NOM/NOM · elevation | `bud_building-card-elevation-5` | `/nodes/3/card/items/6` | 4914–4929 |
| BUD/NOM/NOM · height | `bud_building-card-height-6` | `/nodes/3/card/items/7` | 4930–4945 |
| BUD/NOM/NOM · extensions.link.wiki | `bud_building-card-wiki-7` | `/nodes/3/card/items/8` | 4946–4965 |
| BUD/NOM/NOM · extensions.character.brief | `bud_building-card-brief-8` | `/nodes/3/card/items/9` | 4966–4981 |
| BUD/NOM/NOM · CreateTime | `BUD-CreateTime-meta` | `/nodes/3/card/items/10` | 4982–4998 |
| BUD/NOM/NOM · CreateBy | `BUD-CreateBy-meta` | `/nodes/3/card/items/11` | 4999–5015 |
| BUD/NOM/NOM · ModifityTime | `BUD-ModifityTime-meta` | `/nodes/3/card/items/12` | 5016–5032 |
| BUD/NOM/NOM · ModifityBy | `BUD-ModifityBy-meta` | `/nodes/3/card/items/13` | 5033–5049 |
| BUD/SPE/SPE · Class | `BUD-classification-card` | `/nodes/4/card/items/0` | 5877–5894 |
| BUD/SPE/SPE · tags.nomenclator | `bud_building-card-nomenclator-0` | `/nodes/4/card/items/1` | 5895–5910 |
| BUD/SPE/SPE · tags.Land | `bud_building-card-Land-1` | `/nodes/4/card/items/2` | 5911–5926 |
| BUD/SPE/SPE · tags.Adm | `bud_building-card-Adm-2` | `/nodes/4/card/items/3` | 5927–5942 |
| BUD/SPE/SPE · tags.Pop | `bud_building-card-Pop-3` | `/nodes/4/card/items/4` | 5943–5958 |
| BUD/SPE/SPE · Situation | `bud_building-card-Situation-4` | `/nodes/4/card/items/5` | 5959–5974 |
| BUD/SPE/SPE · elevation | `bud_building-card-elevation-5` | `/nodes/4/card/items/6` | 5975–5990 |
| BUD/SPE/SPE · height | `bud_building-card-height-6` | `/nodes/4/card/items/7` | 5991–6006 |
| BUD/SPE/SPE · extensions.link.wiki | `bud_building-card-wiki-7` | `/nodes/4/card/items/8` | 6007–6026 |
| BUD/SPE/SPE · extensions.character.brief | `bud_building-card-brief-8` | `/nodes/4/card/items/9` | 6027–6042 |
| BUD/SPE/SPE · CreateTime | `BUD-CreateTime-meta` | `/nodes/4/card/items/10` | 6043–6059 |
| BUD/SPE/SPE · CreateBy | `BUD-CreateBy-meta` | `/nodes/4/card/items/11` | 6060–6076 |
| BUD/SPE/SPE · ModifityTime | `BUD-ModifityTime-meta` | `/nodes/4/card/items/12` | 6077–6093 |
| BUD/SPE/SPE · ModifityBy | `BUD-ModifityBy-meta` | `/nodes/4/card/items/13` | 6094–6110 |
| FLR · Class | `FLR-classification-card` | `/nodes/5/card/items/0` | 7030–7043 |
| FLR · BuildingID | `flr_unit-card-BuildingID-1` | `/nodes/5/card/items/1` | 7044–7073 |
| FLR · tags.Land | `flr_unit-card-Land-3` | `/nodes/5/card/items/2` | 7074–7106 |
| FLR · tags.Adm | `flr_unit-card-Adm-4` | `/nodes/5/card/items/3` | 7107–7139 |
| FLR · NofFloor | `flr_unit-card-NofFloor-0` | `/nodes/5/card/items/4` | 7140–7161 |
| FLR · tags.nomenclator | `flr_unit-card-nomenclator-2` | `/nodes/5/card/items/5` | 7162–7183 |
| FLR · tags.Pop | `flr_unit-card-Pop-5` | `/nodes/5/card/items/6` | 7184–7205 |
| FLR · Situation | `flr_unit-card-Situation-6` | `/nodes/5/card/items/7` | 7206–7227 |
| FLR · elevation | `flr_unit-card-elevation-7` | `/nodes/5/card/items/8` | 7228–7249 |
| FLR · height | `flr_unit-card-height-8` | `/nodes/5/card/items/9` | 7250–7271 |
| FLR · extensions.link.wiki | `flr_unit-card-wiki-9` | `/nodes/5/card/items/10` | 7272–7297 |
| FLR · extensions.character.brief | `flr_unit-card-brief-10` | `/nodes/5/card/items/11` | 7298–7319 |
| FLR · CreateTime | `FLR-CreateTime-meta` | `/nodes/5/card/items/12` | 7320–7332 |
| FLR · CreateBy | `FLR-CreateBy-meta` | `/nodes/5/card/items/13` | 7333–7345 |
| FLR · ModifityTime | `FLR-ModifityTime-meta` | `/nodes/5/card/items/14` | 7346–7358 |
| FLR · ModifityBy | `FLR-ModifityBy-meta` | `/nodes/5/card/items/15` | 7359–7371 |
| FLR/NOM · Class | `FLR-classification-card` | `/nodes/6/card/items/0` | 8088–8105 |
| FLR/NOM · BuildingID | `flr_unit-card-BuildingID-1` | `/nodes/6/card/items/1` | 8106–8129 |
| FLR/NOM · tags.Land | `flr_unit-card-Land-3` | `/nodes/6/card/items/2` | 8130–8156 |
| FLR/NOM · tags.Adm | `flr_unit-card-Adm-4` | `/nodes/6/card/items/3` | 8157–8183 |
| FLR/NOM · NofFloor | `flr_unit-card-NofFloor-0` | `/nodes/6/card/items/4` | 8184–8199 |
| FLR/NOM · tags.nomenclator | `flr_unit-card-nomenclator-2` | `/nodes/6/card/items/5` | 8200–8215 |
| FLR/NOM · tags.Pop | `flr_unit-card-Pop-5` | `/nodes/6/card/items/6` | 8216–8231 |
| FLR/NOM · Situation | `flr_unit-card-Situation-6` | `/nodes/6/card/items/7` | 8232–8247 |
| FLR/NOM · elevation | `flr_unit-card-elevation-7` | `/nodes/6/card/items/8` | 8248–8263 |
| FLR/NOM · height | `flr_unit-card-height-8` | `/nodes/6/card/items/9` | 8264–8279 |
| FLR/NOM · extensions.link.wiki | `flr_unit-card-wiki-9` | `/nodes/6/card/items/10` | 8280–8299 |
| FLR/NOM · extensions.character.brief | `flr_unit-card-brief-10` | `/nodes/6/card/items/11` | 8300–8315 |
| FLR/NOM · CreateTime | `FLR-CreateTime-meta` | `/nodes/6/card/items/12` | 8316–8332 |
| FLR/NOM · CreateBy | `FLR-CreateBy-meta` | `/nodes/6/card/items/13` | 8333–8349 |
| FLR/NOM · ModifityTime | `FLR-ModifityTime-meta` | `/nodes/6/card/items/14` | 8350–8366 |
| FLR/NOM · ModifityBy | `FLR-ModifityBy-meta` | `/nodes/6/card/items/15` | 8367–8383 |
| FLR/SPE · Class | `FLR-classification-card` | `/nodes/7/card/items/0` | 9069–9086 |
| FLR/SPE · BuildingID | `flr_unit-card-BuildingID-1` | `/nodes/7/card/items/1` | 9087–9110 |
| FLR/SPE · tags.Land | `flr_unit-card-Land-3` | `/nodes/7/card/items/2` | 9111–9137 |
| FLR/SPE · tags.Adm | `flr_unit-card-Adm-4` | `/nodes/7/card/items/3` | 9138–9164 |
| FLR/SPE · NofFloor | `flr_unit-card-NofFloor-0` | `/nodes/7/card/items/4` | 9165–9180 |
| FLR/SPE · tags.nomenclator | `flr_unit-card-nomenclator-2` | `/nodes/7/card/items/5` | 9181–9196 |
| FLR/SPE · tags.Pop | `flr_unit-card-Pop-5` | `/nodes/7/card/items/6` | 9197–9212 |
| FLR/SPE · Situation | `flr_unit-card-Situation-6` | `/nodes/7/card/items/7` | 9213–9228 |
| FLR/SPE · elevation | `flr_unit-card-elevation-7` | `/nodes/7/card/items/8` | 9229–9244 |
| FLR/SPE · height | `flr_unit-card-height-8` | `/nodes/7/card/items/9` | 9245–9260 |
| FLR/SPE · extensions.link.wiki | `flr_unit-card-wiki-9` | `/nodes/7/card/items/10` | 9261–9280 |
| FLR/SPE · extensions.character.brief | `flr_unit-card-brief-10` | `/nodes/7/card/items/11` | 9281–9296 |
| FLR/SPE · CreateTime | `FLR-CreateTime-meta` | `/nodes/7/card/items/12` | 9297–9313 |
| FLR/SPE · CreateBy | `FLR-CreateBy-meta` | `/nodes/7/card/items/13` | 9314–9330 |
| FLR/SPE · ModifityTime | `FLR-ModifityTime-meta` | `/nodes/7/card/items/14` | 9331–9347 |
| FLR/SPE · ModifityBy | `FLR-ModifityBy-meta` | `/nodes/7/card/items/15` | 9348–9364 |
| FLR/NOM/NOM · Class | `FLR-classification-card` | `/nodes/8/card/items/0` | 10053–10070 |
| FLR/NOM/NOM · BuildingID | `flr_unit-card-BuildingID-1` | `/nodes/8/card/items/1` | 10071–10094 |
| FLR/NOM/NOM · tags.Land | `flr_unit-card-Land-3` | `/nodes/8/card/items/2` | 10095–10121 |
| FLR/NOM/NOM · tags.Adm | `flr_unit-card-Adm-4` | `/nodes/8/card/items/3` | 10122–10148 |
| FLR/NOM/NOM · NofFloor | `flr_unit-card-NofFloor-0` | `/nodes/8/card/items/4` | 10149–10164 |
| FLR/NOM/NOM · tags.nomenclator | `flr_unit-card-nomenclator-2` | `/nodes/8/card/items/5` | 10165–10180 |
| FLR/NOM/NOM · tags.Pop | `flr_unit-card-Pop-5` | `/nodes/8/card/items/6` | 10181–10196 |
| FLR/NOM/NOM · Situation | `flr_unit-card-Situation-6` | `/nodes/8/card/items/7` | 10197–10212 |
| FLR/NOM/NOM · elevation | `flr_unit-card-elevation-7` | `/nodes/8/card/items/8` | 10213–10228 |
| FLR/NOM/NOM · height | `flr_unit-card-height-8` | `/nodes/8/card/items/9` | 10229–10244 |
| FLR/NOM/NOM · extensions.link.wiki | `flr_unit-card-wiki-9` | `/nodes/8/card/items/10` | 10245–10264 |
| FLR/NOM/NOM · extensions.character.brief | `flr_unit-card-brief-10` | `/nodes/8/card/items/11` | 10265–10280 |
| FLR/NOM/NOM · CreateTime | `FLR-CreateTime-meta` | `/nodes/8/card/items/12` | 10281–10297 |
| FLR/NOM/NOM · CreateBy | `FLR-CreateBy-meta` | `/nodes/8/card/items/13` | 10298–10314 |
| FLR/NOM/NOM · ModifityTime | `FLR-ModifityTime-meta` | `/nodes/8/card/items/14` | 10315–10331 |
| FLR/NOM/NOM · ModifityBy | `FLR-ModifityBy-meta` | `/nodes/8/card/items/15` | 10332–10348 |
| FLR/SPE/SPE · Class | `FLR-classification-card` | `/nodes/9/card/items/0` | 11037–11054 |
| FLR/SPE/SPE · BuildingID | `flr_unit-card-BuildingID-1` | `/nodes/9/card/items/1` | 11055–11078 |
| FLR/SPE/SPE · tags.Land | `flr_unit-card-Land-3` | `/nodes/9/card/items/2` | 11079–11105 |
| FLR/SPE/SPE · tags.Adm | `flr_unit-card-Adm-4` | `/nodes/9/card/items/3` | 11106–11132 |
| FLR/SPE/SPE · NofFloor | `flr_unit-card-NofFloor-0` | `/nodes/9/card/items/4` | 11133–11148 |
| FLR/SPE/SPE · tags.nomenclator | `flr_unit-card-nomenclator-2` | `/nodes/9/card/items/5` | 11149–11164 |
| FLR/SPE/SPE · tags.Pop | `flr_unit-card-Pop-5` | `/nodes/9/card/items/6` | 11165–11180 |
| FLR/SPE/SPE · Situation | `flr_unit-card-Situation-6` | `/nodes/9/card/items/7` | 11181–11196 |
| FLR/SPE/SPE · elevation | `flr_unit-card-elevation-7` | `/nodes/9/card/items/8` | 11197–11212 |
| FLR/SPE/SPE · height | `flr_unit-card-height-8` | `/nodes/9/card/items/9` | 11213–11228 |
| FLR/SPE/SPE · extensions.link.wiki | `flr_unit-card-wiki-9` | `/nodes/9/card/items/10` | 11229–11248 |
| FLR/SPE/SPE · extensions.character.brief | `flr_unit-card-brief-10` | `/nodes/9/card/items/11` | 11249–11264 |
| FLR/SPE/SPE · CreateTime | `FLR-CreateTime-meta` | `/nodes/9/card/items/12` | 11265–11281 |
| FLR/SPE/SPE · CreateBy | `FLR-CreateBy-meta` | `/nodes/9/card/items/13` | 11282–11298 |
| FLR/SPE/SPE · ModifityTime | `FLR-ModifityTime-meta` | `/nodes/9/card/items/14` | 11299–11315 |
| FLR/SPE/SPE · ModifityBy | `FLR-ModifityBy-meta` | `/nodes/9/card/items/15` | 11316–11332 |
| ISG · CreateTime | `ISG-CreateTime-meta` | `/nodes/10/card/items/0` | 12231–12243 |
| ISG · CreateBy | `ISG-CreateBy-meta` | `/nodes/10/card/items/1` | 12244–12256 |
| ISG · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/10/card/items/2` | 12257–12269 |
| ISG · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/10/card/items/3` | 12270–12282 |
| ISG/NGF · CreateTime | `ISG-CreateTime-meta` | `/nodes/11/card/items/0` | 13349–13365 |
| ISG/NGF · CreateBy | `ISG-CreateBy-meta` | `/nodes/11/card/items/1` | 13366–13382 |
| ISG/NGF · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/11/card/items/2` | 13383–13399 |
| ISG/NGF · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/11/card/items/3` | 13400–13416 |
| ISG/ADM · CreateTime | `ISG-CreateTime-meta` | `/nodes/12/card/items/0` | 13735–13751 |
| ISG/ADM · CreateBy | `ISG-CreateBy-meta` | `/nodes/12/card/items/1` | 13752–13768 |
| ISG/ADM · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/12/card/items/2` | 13769–13785 |
| ISG/ADM · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/12/card/items/3` | 13786–13802 |
| ISG/NGF/LAD · Class | `ISG-classification-card` | `/nodes/13/card/items/0` | 14130–14143 |
| ISG/NGF/LAD · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/13/card/items/1` | 14144–14167 |
| ISG/NGF/LAD · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/13/card/items/2` | 14168–14195 |
| ISG/NGF/LAD · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/13/card/items/3` | 14196–14219 |
| ISG/NGF/LAD · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/13/card/items/4` | 14220–14243 |
| ISG/NGF/LAD · CreateTime | `ISG-CreateTime-meta` | `/nodes/13/card/items/5` | 14244–14260 |
| ISG/NGF/LAD · CreateBy | `ISG-CreateBy-meta` | `/nodes/13/card/items/6` | 14261–14277 |
| ISG/NGF/LAD · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/13/card/items/7` | 14278–14294 |
| ISG/NGF/LAD · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/13/card/items/8` | 14295–14311 |
| ISG/NGF/LIS · Class | `ISG-classification-card` | `/nodes/14/card/items/0` | 15376–15389 |
| ISG/NGF/LIS · tags.nomenclator | `isg_ngf_lis-card-nomenclator-0` | `/nodes/14/card/items/1` | 15390–15413 |
| ISG/NGF/LIS · tags.Land | `isg_ngf_lis-card-Land-1` | `/nodes/14/card/items/2` | 15414–15437 |
| ISG/NGF/LIS · tags.Adm | `isg_ngf_lis-card-Adm-2` | `/nodes/14/card/items/3` | 15438–15461 |
| ISG/NGF/LIS · extensions.link.wiki | `isg_ngf_lis-card-wiki-3` | `/nodes/14/card/items/4` | 15462–15489 |
| ISG/NGF/LIS · extensions.character.brief | `isg_ngf_lis-card-brief-4` | `/nodes/14/card/items/5` | 15490–15513 |
| ISG/NGF/LIS · Situation | `isg_ngf_lis-card-Situation-5` | `/nodes/14/card/items/6` | 15514–15537 |
| ISG/NGF/LIS · CreateTime | `ISG-CreateTime-meta` | `/nodes/14/card/items/7` | 15538–15554 |
| ISG/NGF/LIS · CreateBy | `ISG-CreateBy-meta` | `/nodes/14/card/items/8` | 15555–15571 |
| ISG/NGF/LIS · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/14/card/items/9` | 15572–15588 |
| ISG/NGF/LIS · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/14/card/items/10` | 15589–15605 |
| ISG/NGF/WTB · Class | `ISG-classification-card` | `/nodes/15/card/items/0` | 16673–16686 |
| ISG/NGF/WTB · tags.nomenclator | `isg_ngf_wtb-card-nomenclator-0` | `/nodes/15/card/items/1` | 16687–16710 |
| ISG/NGF/WTB · tags.Land | `isg_ngf_wtb-card-Land-1` | `/nodes/15/card/items/2` | 16711–16734 |
| ISG/NGF/WTB · tags.Adm | `isg_ngf_wtb-card-Adm-2` | `/nodes/15/card/items/3` | 16735–16758 |
| ISG/NGF/WTB · extensions.link.wiki | `isg_ngf_wtb-card-wiki-3` | `/nodes/15/card/items/4` | 16759–16786 |
| ISG/NGF/WTB · extensions.character.brief | `isg_ngf_wtb-card-brief-4` | `/nodes/15/card/items/5` | 16787–16810 |
| ISG/NGF/WTB · Situation | `isg_ngf_wtb-card-Situation-5` | `/nodes/15/card/items/6` | 16811–16834 |
| ISG/NGF/WTB · CreateTime | `ISG-CreateTime-meta` | `/nodes/15/card/items/7` | 16835–16851 |
| ISG/NGF/WTB · CreateBy | `ISG-CreateBy-meta` | `/nodes/15/card/items/8` | 16852–16868 |
| ISG/NGF/WTB · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/15/card/items/9` | 16869–16885 |
| ISG/NGF/WTB · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/15/card/items/10` | 16886–16902 |
| ISG/ADM/DBZ · Class | `ISG-classification-card` | `/nodes/16/card/items/0` | 17850–17863 |
| ISG/ADM/DBZ · tags.nomenclator | `isg_adm_dbz-card-nomenclator-0` | `/nodes/16/card/items/1` | 17864–17887 |
| ISG/ADM/DBZ · tags.Land | `isg_adm_dbz-card-Land-1` | `/nodes/16/card/items/2` | 17888–17911 |
| ISG/ADM/DBZ · tags.UAdm | `isg_adm_dbz-card-UAdm-2` | `/nodes/16/card/items/3` | 17912–17935 |
| ISG/ADM/DBZ · tags.GAdm | `isg_adm_dbz-card-GAdm-3` | `/nodes/16/card/items/4` | 17936–17959 |
| ISG/ADM/DBZ · tags.Pop | `isg_adm_dbz-card-Pop-4` | `/nodes/16/card/items/5` | 17960–17983 |
| ISG/ADM/DBZ · extensions.link.wiki | `isg_adm_dbz-card-wiki-5` | `/nodes/16/card/items/6` | 17984–18011 |
| ISG/ADM/DBZ · extensions.character.brief | `isg_adm_dbz-card-brief-6` | `/nodes/16/card/items/7` | 18012–18035 |
| ISG/ADM/DBZ · Situation | `isg_adm_dbz-card-Situation-7` | `/nodes/16/card/items/8` | 18036–18059 |
| ISG/ADM/DBZ · CreateTime | `ISG-CreateTime-meta` | `/nodes/16/card/items/9` | 18060–18076 |
| ISG/ADM/DBZ · CreateBy | `ISG-CreateBy-meta` | `/nodes/16/card/items/10` | 18077–18093 |
| ISG/ADM/DBZ · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/16/card/items/11` | 18094–18110 |
| ISG/ADM/DBZ · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/16/card/items/12` | 18111–18127 |
| ISG/ADM/PLZ · Class | `ISG-classification-card` | `/nodes/17/card/items/0` | 19079–19092 |
| ISG/ADM/PLZ · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/17/card/items/1` | 19093–19116 |
| ISG/ADM/PLZ · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/17/card/items/2` | 19117–19140 |
| ISG/ADM/PLZ · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/17/card/items/3` | 19141–19164 |
| ISG/ADM/PLZ · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/17/card/items/4` | 19165–19188 |
| ISG/ADM/PLZ · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/17/card/items/5` | 19189–19212 |
| ISG/ADM/PLZ · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/17/card/items/6` | 19213–19236 |
| ISG/ADM/PLZ · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/17/card/items/7` | 19237–19264 |
| ISG/ADM/PLZ · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/17/card/items/8` | 19265–19288 |
| ISG/ADM/PLZ · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/17/card/items/9` | 19289–19312 |
| ISG/ADM/PLZ · CreateTime | `ISG-CreateTime-meta` | `/nodes/17/card/items/10` | 19313–19329 |
| ISG/ADM/PLZ · CreateBy | `ISG-CreateBy-meta` | `/nodes/17/card/items/11` | 19330–19346 |
| ISG/ADM/PLZ · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/17/card/items/12` | 19347–19363 |
| ISG/ADM/PLZ · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/17/card/items/13` | 19364–19380 |
| ISG/NGF/LAD/CON · Class | `ISG-classification-card` | `/nodes/18/card/items/0` | 20451–20468 |
| ISG/NGF/LAD/CON · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/18/card/items/1` | 20469–20484 |
| ISG/NGF/LAD/CON · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/18/card/items/2` | 20485–20504 |
| ISG/NGF/LAD/CON · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/18/card/items/3` | 20505–20520 |
| ISG/NGF/LAD/CON · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/18/card/items/4` | 20521–20536 |
| ISG/NGF/LAD/CON · CreateTime | `ISG-CreateTime-meta` | `/nodes/18/card/items/5` | 20537–20553 |
| ISG/NGF/LAD/CON · CreateBy | `ISG-CreateBy-meta` | `/nodes/18/card/items/6` | 20554–20570 |
| ISG/NGF/LAD/CON · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/18/card/items/7` | 20571–20587 |
| ISG/NGF/LAD/CON · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/18/card/items/8` | 20588–20604 |
| ISG/NGF/LAD/ISD · Class | `ISG-classification-card` | `/nodes/19/card/items/0` | 21670–21687 |
| ISG/NGF/LAD/ISD · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/19/card/items/1` | 21688–21703 |
| ISG/NGF/LAD/ISD · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/19/card/items/2` | 21704–21723 |
| ISG/NGF/LAD/ISD · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/19/card/items/3` | 21724–21739 |
| ISG/NGF/LAD/ISD · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/19/card/items/4` | 21740–21755 |
| ISG/NGF/LAD/ISD · CreateTime | `ISG-CreateTime-meta` | `/nodes/19/card/items/5` | 21756–21772 |
| ISG/NGF/LAD/ISD · CreateBy | `ISG-CreateBy-meta` | `/nodes/19/card/items/6` | 21773–21789 |
| ISG/NGF/LAD/ISD · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/19/card/items/7` | 21790–21806 |
| ISG/NGF/LAD/ISD · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/19/card/items/8` | 21807–21823 |
| ISG/NGF/LAD/SBC · Class | `ISG-classification-card` | `/nodes/20/card/items/0` | 22889–22906 |
| ISG/NGF/LAD/SBC · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/20/card/items/1` | 22907–22922 |
| ISG/NGF/LAD/SBC · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/20/card/items/2` | 22923–22942 |
| ISG/NGF/LAD/SBC · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/20/card/items/3` | 22943–22958 |
| ISG/NGF/LAD/SBC · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/20/card/items/4` | 22959–22974 |
| ISG/NGF/LAD/SBC · CreateTime | `ISG-CreateTime-meta` | `/nodes/20/card/items/5` | 22975–22991 |
| ISG/NGF/LAD/SBC · CreateBy | `ISG-CreateBy-meta` | `/nodes/20/card/items/6` | 22992–23008 |
| ISG/NGF/LAD/SBC · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/20/card/items/7` | 23009–23025 |
| ISG/NGF/LAD/SBC · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/20/card/items/8` | 23026–23042 |
| ISG/NGF/LAD/RGC · Class | `ISG-classification-card` | `/nodes/21/card/items/0` | 24108–24125 |
| ISG/NGF/LAD/RGC · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/21/card/items/1` | 24126–24141 |
| ISG/NGF/LAD/RGC · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/21/card/items/2` | 24142–24161 |
| ISG/NGF/LAD/RGC · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/21/card/items/3` | 24162–24177 |
| ISG/NGF/LAD/RGC · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/21/card/items/4` | 24178–24193 |
| ISG/NGF/LAD/RGC · CreateTime | `ISG-CreateTime-meta` | `/nodes/21/card/items/5` | 24194–24210 |
| ISG/NGF/LAD/RGC · CreateBy | `ISG-CreateBy-meta` | `/nodes/21/card/items/6` | 24211–24227 |
| ISG/NGF/LAD/RGC · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/21/card/items/7` | 24228–24244 |
| ISG/NGF/LAD/RGC · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/21/card/items/8` | 24245–24261 |
| ISG/NGF/LAD/PEN · Class | `ISG-classification-card` | `/nodes/22/card/items/0` | 25327–25344 |
| ISG/NGF/LAD/PEN · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/22/card/items/1` | 25345–25360 |
| ISG/NGF/LAD/PEN · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/22/card/items/2` | 25361–25380 |
| ISG/NGF/LAD/PEN · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/22/card/items/3` | 25381–25396 |
| ISG/NGF/LAD/PEN · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/22/card/items/4` | 25397–25412 |
| ISG/NGF/LAD/PEN · CreateTime | `ISG-CreateTime-meta` | `/nodes/22/card/items/5` | 25413–25429 |
| ISG/NGF/LAD/PEN · CreateBy | `ISG-CreateBy-meta` | `/nodes/22/card/items/6` | 25430–25446 |
| ISG/NGF/LAD/PEN · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/22/card/items/7` | 25447–25463 |
| ISG/NGF/LAD/PEN · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/22/card/items/8` | 25464–25480 |
| ISG/NGF/LAD/IST · Class | `ISG-classification-card` | `/nodes/23/card/items/0` | 26546–26563 |
| ISG/NGF/LAD/IST · tags.nomenclator | `isg_ngf_lad-card-nomenclator-0` | `/nodes/23/card/items/1` | 26564–26579 |
| ISG/NGF/LAD/IST · extensions.link.wiki | `isg_ngf_lad-card-wiki-1` | `/nodes/23/card/items/2` | 26580–26599 |
| ISG/NGF/LAD/IST · extensions.character.brief | `isg_ngf_lad-card-brief-2` | `/nodes/23/card/items/3` | 26600–26615 |
| ISG/NGF/LAD/IST · Situation | `isg_ngf_lad-card-Situation-3` | `/nodes/23/card/items/4` | 26616–26631 |
| ISG/NGF/LAD/IST · CreateTime | `ISG-CreateTime-meta` | `/nodes/23/card/items/5` | 26632–26648 |
| ISG/NGF/LAD/IST · CreateBy | `ISG-CreateBy-meta` | `/nodes/23/card/items/6` | 26649–26665 |
| ISG/NGF/LAD/IST · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/23/card/items/7` | 26666–26682 |
| ISG/NGF/LAD/IST · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/23/card/items/8` | 26683–26699 |
| ISG/NGF/LIS/MTN · Class | `ISG-classification-card` | `/nodes/24/card/items/0` | 27765–27782 |
| ISG/NGF/LIS/MTN · tags.nomenclator | `isg_ngf_lis-card-nomenclator-0` | `/nodes/24/card/items/1` | 27783–27798 |
| ISG/NGF/LIS/MTN · tags.Land | `isg_ngf_lis-card-Land-1` | `/nodes/24/card/items/2` | 27799–27814 |
| ISG/NGF/LIS/MTN · tags.Adm | `isg_ngf_lis-card-Adm-2` | `/nodes/24/card/items/3` | 27815–27830 |
| ISG/NGF/LIS/MTN · extensions.link.wiki | `isg_ngf_lis-card-wiki-3` | `/nodes/24/card/items/4` | 27831–27850 |
| ISG/NGF/LIS/MTN · extensions.character.brief | `isg_ngf_lis-card-brief-4` | `/nodes/24/card/items/5` | 27851–27866 |
| ISG/NGF/LIS/MTN · Situation | `isg_ngf_lis-card-Situation-5` | `/nodes/24/card/items/6` | 27867–27882 |
| ISG/NGF/LIS/MTN · CreateTime | `ISG-CreateTime-meta` | `/nodes/24/card/items/7` | 27883–27899 |
| ISG/NGF/LIS/MTN · CreateBy | `ISG-CreateBy-meta` | `/nodes/24/card/items/8` | 27900–27916 |
| ISG/NGF/LIS/MTN · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/24/card/items/9` | 27917–27933 |
| ISG/NGF/LIS/MTN · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/24/card/items/10` | 27934–27950 |
| ISG/NGF/LIS/BSN · Class | `ISG-classification-card` | `/nodes/25/card/items/0` | 29018–29035 |
| ISG/NGF/LIS/BSN · tags.nomenclator | `isg_ngf_lis-card-nomenclator-0` | `/nodes/25/card/items/1` | 29036–29051 |
| ISG/NGF/LIS/BSN · tags.Land | `isg_ngf_lis-card-Land-1` | `/nodes/25/card/items/2` | 29052–29067 |
| ISG/NGF/LIS/BSN · tags.Adm | `isg_ngf_lis-card-Adm-2` | `/nodes/25/card/items/3` | 29068–29083 |
| ISG/NGF/LIS/BSN · extensions.link.wiki | `isg_ngf_lis-card-wiki-3` | `/nodes/25/card/items/4` | 29084–29103 |
| ISG/NGF/LIS/BSN · extensions.character.brief | `isg_ngf_lis-card-brief-4` | `/nodes/25/card/items/5` | 29104–29119 |
| ISG/NGF/LIS/BSN · Situation | `isg_ngf_lis-card-Situation-5` | `/nodes/25/card/items/6` | 29120–29135 |
| ISG/NGF/LIS/BSN · CreateTime | `ISG-CreateTime-meta` | `/nodes/25/card/items/7` | 29136–29152 |
| ISG/NGF/LIS/BSN · CreateBy | `ISG-CreateBy-meta` | `/nodes/25/card/items/8` | 29153–29169 |
| ISG/NGF/LIS/BSN · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/25/card/items/9` | 29170–29186 |
| ISG/NGF/LIS/BSN · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/25/card/items/10` | 29187–29203 |
| ISG/NGF/LIS/PLN · Class | `ISG-classification-card` | `/nodes/26/card/items/0` | 30271–30288 |
| ISG/NGF/LIS/PLN · tags.nomenclator | `isg_ngf_lis-card-nomenclator-0` | `/nodes/26/card/items/1` | 30289–30304 |
| ISG/NGF/LIS/PLN · tags.Land | `isg_ngf_lis-card-Land-1` | `/nodes/26/card/items/2` | 30305–30320 |
| ISG/NGF/LIS/PLN · tags.Adm | `isg_ngf_lis-card-Adm-2` | `/nodes/26/card/items/3` | 30321–30336 |
| ISG/NGF/LIS/PLN · extensions.link.wiki | `isg_ngf_lis-card-wiki-3` | `/nodes/26/card/items/4` | 30337–30356 |
| ISG/NGF/LIS/PLN · extensions.character.brief | `isg_ngf_lis-card-brief-4` | `/nodes/26/card/items/5` | 30357–30372 |
| ISG/NGF/LIS/PLN · Situation | `isg_ngf_lis-card-Situation-5` | `/nodes/26/card/items/6` | 30373–30388 |
| ISG/NGF/LIS/PLN · CreateTime | `ISG-CreateTime-meta` | `/nodes/26/card/items/7` | 30389–30405 |
| ISG/NGF/LIS/PLN · CreateBy | `ISG-CreateBy-meta` | `/nodes/26/card/items/8` | 30406–30422 |
| ISG/NGF/LIS/PLN · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/26/card/items/9` | 30423–30439 |
| ISG/NGF/LIS/PLN · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/26/card/items/10` | 30440–30456 |
| ISG/NGF/WTB/SEA · Class | `ISG-classification-card` | `/nodes/27/card/items/0` | 31524–31541 |
| ISG/NGF/WTB/SEA · tags.nomenclator | `isg_ngf_wtb-card-nomenclator-0` | `/nodes/27/card/items/1` | 31542–31557 |
| ISG/NGF/WTB/SEA · tags.Land | `isg_ngf_wtb-card-Land-1` | `/nodes/27/card/items/2` | 31558–31573 |
| ISG/NGF/WTB/SEA · tags.Adm | `isg_ngf_wtb-card-Adm-2` | `/nodes/27/card/items/3` | 31574–31589 |
| ISG/NGF/WTB/SEA · extensions.link.wiki | `isg_ngf_wtb-card-wiki-3` | `/nodes/27/card/items/4` | 31590–31609 |
| ISG/NGF/WTB/SEA · extensions.character.brief | `isg_ngf_wtb-card-brief-4` | `/nodes/27/card/items/5` | 31610–31625 |
| ISG/NGF/WTB/SEA · Situation | `isg_ngf_wtb-card-Situation-5` | `/nodes/27/card/items/6` | 31626–31641 |
| ISG/NGF/WTB/SEA · CreateTime | `ISG-CreateTime-meta` | `/nodes/27/card/items/7` | 31642–31658 |
| ISG/NGF/WTB/SEA · CreateBy | `ISG-CreateBy-meta` | `/nodes/27/card/items/8` | 31659–31675 |
| ISG/NGF/WTB/SEA · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/27/card/items/9` | 31676–31692 |
| ISG/NGF/WTB/SEA · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/27/card/items/10` | 31693–31709 |
| ISG/NGF/WTB/LKE · Class | `ISG-classification-card` | `/nodes/28/card/items/0` | 32777–32794 |
| ISG/NGF/WTB/LKE · tags.nomenclator | `isg_ngf_wtb-card-nomenclator-0` | `/nodes/28/card/items/1` | 32795–32810 |
| ISG/NGF/WTB/LKE · tags.Land | `isg_ngf_wtb-card-Land-1` | `/nodes/28/card/items/2` | 32811–32826 |
| ISG/NGF/WTB/LKE · tags.Adm | `isg_ngf_wtb-card-Adm-2` | `/nodes/28/card/items/3` | 32827–32842 |
| ISG/NGF/WTB/LKE · extensions.link.wiki | `isg_ngf_wtb-card-wiki-3` | `/nodes/28/card/items/4` | 32843–32862 |
| ISG/NGF/WTB/LKE · extensions.character.brief | `isg_ngf_wtb-card-brief-4` | `/nodes/28/card/items/5` | 32863–32878 |
| ISG/NGF/WTB/LKE · Situation | `isg_ngf_wtb-card-Situation-5` | `/nodes/28/card/items/6` | 32879–32894 |
| ISG/NGF/WTB/LKE · CreateTime | `ISG-CreateTime-meta` | `/nodes/28/card/items/7` | 32895–32911 |
| ISG/NGF/WTB/LKE · CreateBy | `ISG-CreateBy-meta` | `/nodes/28/card/items/8` | 32912–32928 |
| ISG/NGF/WTB/LKE · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/28/card/items/9` | 32929–32945 |
| ISG/NGF/WTB/LKE · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/28/card/items/10` | 32946–32962 |
| ISG/NGF/WTB/STR · Class | `ISG-classification-card` | `/nodes/29/card/items/0` | 34030–34047 |
| ISG/NGF/WTB/STR · tags.nomenclator | `isg_ngf_wtb-card-nomenclator-0` | `/nodes/29/card/items/1` | 34048–34063 |
| ISG/NGF/WTB/STR · tags.Land | `isg_ngf_wtb-card-Land-1` | `/nodes/29/card/items/2` | 34064–34079 |
| ISG/NGF/WTB/STR · tags.Adm | `isg_ngf_wtb-card-Adm-2` | `/nodes/29/card/items/3` | 34080–34095 |
| ISG/NGF/WTB/STR · extensions.link.wiki | `isg_ngf_wtb-card-wiki-3` | `/nodes/29/card/items/4` | 34096–34115 |
| ISG/NGF/WTB/STR · extensions.character.brief | `isg_ngf_wtb-card-brief-4` | `/nodes/29/card/items/5` | 34116–34131 |
| ISG/NGF/WTB/STR · Situation | `isg_ngf_wtb-card-Situation-5` | `/nodes/29/card/items/6` | 34132–34147 |
| ISG/NGF/WTB/STR · CreateTime | `ISG-CreateTime-meta` | `/nodes/29/card/items/7` | 34148–34164 |
| ISG/NGF/WTB/STR · CreateBy | `ISG-CreateBy-meta` | `/nodes/29/card/items/8` | 34165–34181 |
| ISG/NGF/WTB/STR · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/29/card/items/9` | 34182–34198 |
| ISG/NGF/WTB/STR · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/29/card/items/10` | 34199–34215 |
| ISG/NGF/WTB/EST · Class | `ISG-classification-card` | `/nodes/30/card/items/0` | 35283–35300 |
| ISG/NGF/WTB/EST · tags.nomenclator | `isg_ngf_wtb-card-nomenclator-0` | `/nodes/30/card/items/1` | 35301–35316 |
| ISG/NGF/WTB/EST · tags.Land | `isg_ngf_wtb-card-Land-1` | `/nodes/30/card/items/2` | 35317–35332 |
| ISG/NGF/WTB/EST · tags.Adm | `isg_ngf_wtb-card-Adm-2` | `/nodes/30/card/items/3` | 35333–35348 |
| ISG/NGF/WTB/EST · extensions.link.wiki | `isg_ngf_wtb-card-wiki-3` | `/nodes/30/card/items/4` | 35349–35368 |
| ISG/NGF/WTB/EST · extensions.character.brief | `isg_ngf_wtb-card-brief-4` | `/nodes/30/card/items/5` | 35369–35384 |
| ISG/NGF/WTB/EST · Situation | `isg_ngf_wtb-card-Situation-5` | `/nodes/30/card/items/6` | 35385–35400 |
| ISG/NGF/WTB/EST · CreateTime | `ISG-CreateTime-meta` | `/nodes/30/card/items/7` | 35401–35417 |
| ISG/NGF/WTB/EST · CreateBy | `ISG-CreateBy-meta` | `/nodes/30/card/items/8` | 35418–35434 |
| ISG/NGF/WTB/EST · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/30/card/items/9` | 35435–35451 |
| ISG/NGF/WTB/EST · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/30/card/items/10` | 35452–35468 |
| ISG/ADM/DBZ/L1 · Class | `ISG-classification-card` | `/nodes/31/card/items/0` | 36654–36671 |
| ISG/ADM/DBZ/L1 · tags.nomenclator | `isg_adm_dbz-card-nomenclator-0` | `/nodes/31/card/items/1` | 36672–36687 |
| ISG/ADM/DBZ/L1 · tags.Land | `isg_adm_dbz-card-Land-1` | `/nodes/31/card/items/2` | 36688–36703 |
| ISG/ADM/DBZ/L1 · tags.UAdm | `isg_adm_dbz-card-UAdm-2` | `/nodes/31/card/items/3` | 36704–36719 |
| ISG/ADM/DBZ/L1 · tags.GAdm | `isg_adm_dbz-card-GAdm-3` | `/nodes/31/card/items/4` | 36720–36735 |
| ISG/ADM/DBZ/L1 · tags.Pop | `isg_adm_dbz-card-Pop-4` | `/nodes/31/card/items/5` | 36736–36751 |
| ISG/ADM/DBZ/L1 · extensions.link.wiki | `isg_adm_dbz-card-wiki-5` | `/nodes/31/card/items/6` | 36752–36771 |
| ISG/ADM/DBZ/L1 · extensions.character.brief | `isg_adm_dbz-card-brief-6` | `/nodes/31/card/items/7` | 36772–36787 |
| ISG/ADM/DBZ/L1 · Situation | `isg_adm_dbz-card-Situation-7` | `/nodes/31/card/items/8` | 36788–36803 |
| ISG/ADM/DBZ/L1 · CreateTime | `ISG-CreateTime-meta` | `/nodes/31/card/items/9` | 36804–36820 |
| ISG/ADM/DBZ/L1 · CreateBy | `ISG-CreateBy-meta` | `/nodes/31/card/items/10` | 36821–36837 |
| ISG/ADM/DBZ/L1 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/31/card/items/11` | 36838–36854 |
| ISG/ADM/DBZ/L1 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/31/card/items/12` | 36855–36871 |
| ISG/ADM/DBZ/L2 · Class | `ISG-classification-card` | `/nodes/32/card/items/0` | 38059–38076 |
| ISG/ADM/DBZ/L2 · tags.nomenclator | `isg_adm_dbz-card-nomenclator-0` | `/nodes/32/card/items/1` | 38077–38092 |
| ISG/ADM/DBZ/L2 · tags.Land | `isg_adm_dbz-card-Land-1` | `/nodes/32/card/items/2` | 38093–38108 |
| ISG/ADM/DBZ/L2 · tags.UAdm | `isg_adm_dbz-card-UAdm-2` | `/nodes/32/card/items/3` | 38109–38124 |
| ISG/ADM/DBZ/L2 · tags.GAdm | `isg_adm_dbz-card-GAdm-3` | `/nodes/32/card/items/4` | 38125–38140 |
| ISG/ADM/DBZ/L2 · tags.Pop | `isg_adm_dbz-card-Pop-4` | `/nodes/32/card/items/5` | 38141–38156 |
| ISG/ADM/DBZ/L2 · extensions.link.wiki | `isg_adm_dbz-card-wiki-5` | `/nodes/32/card/items/6` | 38157–38176 |
| ISG/ADM/DBZ/L2 · extensions.character.brief | `isg_adm_dbz-card-brief-6` | `/nodes/32/card/items/7` | 38177–38192 |
| ISG/ADM/DBZ/L2 · Situation | `isg_adm_dbz-card-Situation-7` | `/nodes/32/card/items/8` | 38193–38208 |
| ISG/ADM/DBZ/L2 · CreateTime | `ISG-CreateTime-meta` | `/nodes/32/card/items/9` | 38209–38225 |
| ISG/ADM/DBZ/L2 · CreateBy | `ISG-CreateBy-meta` | `/nodes/32/card/items/10` | 38226–38242 |
| ISG/ADM/DBZ/L2 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/32/card/items/11` | 38243–38259 |
| ISG/ADM/DBZ/L2 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/32/card/items/12` | 38260–38276 |
| ISG/ADM/DBZ/L3 · Class | `ISG-classification-card` | `/nodes/33/card/items/0` | 39346–39363 |
| ISG/ADM/DBZ/L3 · tags.nomenclator | `isg_adm_dbz-card-nomenclator-0` | `/nodes/33/card/items/1` | 39364–39379 |
| ISG/ADM/DBZ/L3 · tags.Land | `isg_adm_dbz-card-Land-1` | `/nodes/33/card/items/2` | 39380–39395 |
| ISG/ADM/DBZ/L3 · tags.UAdm | `isg_adm_dbz-card-UAdm-2` | `/nodes/33/card/items/3` | 39396–39411 |
| ISG/ADM/DBZ/L3 · tags.GAdm | `isg_adm_dbz-card-GAdm-3` | `/nodes/33/card/items/4` | 39412–39427 |
| ISG/ADM/DBZ/L3 · tags.Pop | `isg_adm_dbz-card-Pop-4` | `/nodes/33/card/items/5` | 39428–39443 |
| ISG/ADM/DBZ/L3 · extensions.link.wiki | `isg_adm_dbz-card-wiki-5` | `/nodes/33/card/items/6` | 39444–39463 |
| ISG/ADM/DBZ/L3 · extensions.character.brief | `isg_adm_dbz-card-brief-6` | `/nodes/33/card/items/7` | 39464–39479 |
| ISG/ADM/DBZ/L3 · Situation | `isg_adm_dbz-card-Situation-7` | `/nodes/33/card/items/8` | 39480–39495 |
| ISG/ADM/DBZ/L3 · CreateTime | `ISG-CreateTime-meta` | `/nodes/33/card/items/9` | 39496–39512 |
| ISG/ADM/DBZ/L3 · CreateBy | `ISG-CreateBy-meta` | `/nodes/33/card/items/10` | 39513–39529 |
| ISG/ADM/DBZ/L3 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/33/card/items/11` | 39530–39546 |
| ISG/ADM/DBZ/L3 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/33/card/items/12` | 39547–39563 |
| ISG/ADM/PLZ/L1 · Class | `ISG-classification-card` | `/nodes/34/card/items/0` | 40751–40768 |
| ISG/ADM/PLZ/L1 · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/34/card/items/1` | 40769–40784 |
| ISG/ADM/PLZ/L1 · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/34/card/items/2` | 40785–40800 |
| ISG/ADM/PLZ/L1 · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/34/card/items/3` | 40801–40816 |
| ISG/ADM/PLZ/L1 · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/34/card/items/4` | 40817–40832 |
| ISG/ADM/PLZ/L1 · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/34/card/items/5` | 40833–40848 |
| ISG/ADM/PLZ/L1 · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/34/card/items/6` | 40849–40864 |
| ISG/ADM/PLZ/L1 · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/34/card/items/7` | 40865–40884 |
| ISG/ADM/PLZ/L1 · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/34/card/items/8` | 40885–40900 |
| ISG/ADM/PLZ/L1 · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/34/card/items/9` | 40901–40916 |
| ISG/ADM/PLZ/L1 · CreateTime | `ISG-CreateTime-meta` | `/nodes/34/card/items/10` | 40917–40933 |
| ISG/ADM/PLZ/L1 · CreateBy | `ISG-CreateBy-meta` | `/nodes/34/card/items/11` | 40934–40950 |
| ISG/ADM/PLZ/L1 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/34/card/items/12` | 40951–40967 |
| ISG/ADM/PLZ/L1 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/34/card/items/13` | 40968–40984 |
| ISG/ADM/PLZ/L2 · Class | `ISG-classification-card` | `/nodes/35/card/items/0` | 42173–42190 |
| ISG/ADM/PLZ/L2 · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/35/card/items/1` | 42191–42206 |
| ISG/ADM/PLZ/L2 · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/35/card/items/2` | 42207–42222 |
| ISG/ADM/PLZ/L2 · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/35/card/items/3` | 42223–42238 |
| ISG/ADM/PLZ/L2 · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/35/card/items/4` | 42239–42254 |
| ISG/ADM/PLZ/L2 · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/35/card/items/5` | 42255–42270 |
| ISG/ADM/PLZ/L2 · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/35/card/items/6` | 42271–42286 |
| ISG/ADM/PLZ/L2 · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/35/card/items/7` | 42287–42306 |
| ISG/ADM/PLZ/L2 · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/35/card/items/8` | 42307–42322 |
| ISG/ADM/PLZ/L2 · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/35/card/items/9` | 42323–42338 |
| ISG/ADM/PLZ/L2 · CreateTime | `ISG-CreateTime-meta` | `/nodes/35/card/items/10` | 42339–42355 |
| ISG/ADM/PLZ/L2 · CreateBy | `ISG-CreateBy-meta` | `/nodes/35/card/items/11` | 42356–42372 |
| ISG/ADM/PLZ/L2 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/35/card/items/12` | 42373–42389 |
| ISG/ADM/PLZ/L2 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/35/card/items/13` | 42390–42406 |
| ISG/ADM/PLZ/L3 · Class | `ISG-classification-card` | `/nodes/36/card/items/0` | 43477–43494 |
| ISG/ADM/PLZ/L3 · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/36/card/items/1` | 43495–43510 |
| ISG/ADM/PLZ/L3 · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/36/card/items/2` | 43511–43526 |
| ISG/ADM/PLZ/L3 · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/36/card/items/3` | 43527–43542 |
| ISG/ADM/PLZ/L3 · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/36/card/items/4` | 43543–43558 |
| ISG/ADM/PLZ/L3 · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/36/card/items/5` | 43559–43574 |
| ISG/ADM/PLZ/L3 · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/36/card/items/6` | 43575–43590 |
| ISG/ADM/PLZ/L3 · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/36/card/items/7` | 43591–43610 |
| ISG/ADM/PLZ/L3 · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/36/card/items/8` | 43611–43626 |
| ISG/ADM/PLZ/L3 · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/36/card/items/9` | 43627–43642 |
| ISG/ADM/PLZ/L3 · CreateTime | `ISG-CreateTime-meta` | `/nodes/36/card/items/10` | 43643–43659 |
| ISG/ADM/PLZ/L3 · CreateBy | `ISG-CreateBy-meta` | `/nodes/36/card/items/11` | 43660–43676 |
| ISG/ADM/PLZ/L3 · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/36/card/items/12` | 43677–43693 |
| ISG/ADM/PLZ/L3 · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/36/card/items/13` | 43694–43710 |
| ISG/ADM/PLZ/UP · Class | `ISG-classification-card` | `/nodes/37/card/items/0` | 44662–44679 |
| ISG/ADM/PLZ/UP · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/37/card/items/1` | 44680–44695 |
| ISG/ADM/PLZ/UP · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/37/card/items/2` | 44696–44711 |
| ISG/ADM/PLZ/UP · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/37/card/items/3` | 44712–44727 |
| ISG/ADM/PLZ/UP · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/37/card/items/4` | 44728–44743 |
| ISG/ADM/PLZ/UP · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/37/card/items/5` | 44744–44759 |
| ISG/ADM/PLZ/UP · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/37/card/items/6` | 44760–44775 |
| ISG/ADM/PLZ/UP · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/37/card/items/7` | 44776–44795 |
| ISG/ADM/PLZ/UP · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/37/card/items/8` | 44796–44811 |
| ISG/ADM/PLZ/UP · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/37/card/items/9` | 44812–44827 |
| ISG/ADM/PLZ/UP · CreateTime | `ISG-CreateTime-meta` | `/nodes/37/card/items/10` | 44828–44844 |
| ISG/ADM/PLZ/UP · CreateBy | `ISG-CreateBy-meta` | `/nodes/37/card/items/11` | 44845–44861 |
| ISG/ADM/PLZ/UP · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/37/card/items/12` | 44862–44878 |
| ISG/ADM/PLZ/UP · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/37/card/items/13` | 44879–44895 |
| ISG/ADM/PLZ/UC · Class | `ISG-classification-card` | `/nodes/38/card/items/0` | 45847–45864 |
| ISG/ADM/PLZ/UC · tags.nomenclator | `isg_adm_plz-card-nomenclator-0` | `/nodes/38/card/items/1` | 45865–45880 |
| ISG/ADM/PLZ/UC · tags.Land | `isg_adm_plz-card-Land-1` | `/nodes/38/card/items/2` | 45881–45896 |
| ISG/ADM/PLZ/UC · tags.UAdm | `isg_adm_plz-card-UAdm-2` | `/nodes/38/card/items/3` | 45897–45912 |
| ISG/ADM/PLZ/UC · tags.GAdm | `isg_adm_plz-card-GAdm-3` | `/nodes/38/card/items/4` | 45913–45928 |
| ISG/ADM/PLZ/UC · tags.Pop | `isg_adm_plz-card-Pop-4` | `/nodes/38/card/items/5` | 45929–45944 |
| ISG/ADM/PLZ/UC · tags.YTime | `isg_adm_plz-card-YTime-5` | `/nodes/38/card/items/6` | 45945–45960 |
| ISG/ADM/PLZ/UC · extensions.link.wiki | `isg_adm_plz-card-wiki-6` | `/nodes/38/card/items/7` | 45961–45980 |
| ISG/ADM/PLZ/UC · extensions.character.brief | `isg_adm_plz-card-brief-7` | `/nodes/38/card/items/8` | 45981–45996 |
| ISG/ADM/PLZ/UC · Situation | `isg_adm_plz-card-Situation-8` | `/nodes/38/card/items/9` | 45997–46012 |
| ISG/ADM/PLZ/UC · CreateTime | `ISG-CreateTime-meta` | `/nodes/38/card/items/10` | 46013–46029 |
| ISG/ADM/PLZ/UC · CreateBy | `ISG-CreateBy-meta` | `/nodes/38/card/items/11` | 46030–46046 |
| ISG/ADM/PLZ/UC · ModifityTime | `ISG-ModifityTime-meta` | `/nodes/38/card/items/12` | 46047–46063 |
| ISG/ADM/PLZ/UC · ModifityBy | `ISG-ModifityBy-meta` | `/nodes/38/card/items/13` | 46064–46080 |
| ISL · CreateTime | `ISL-CreateTime-meta` | `/nodes/39/card/items/0` | 47266–47278 |
| ISL · CreateBy | `ISL-CreateBy-meta` | `/nodes/39/card/items/1` | 47279–47291 |
| ISL · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/39/card/items/2` | 47292–47304 |
| ISL · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/39/card/items/3` | 47305–47317 |
| ISL/NGF · CreateTime | `ISL-CreateTime-meta` | `/nodes/40/card/items/0` | 48067–48083 |
| ISL/NGF · CreateBy | `ISL-CreateBy-meta` | `/nodes/40/card/items/1` | 48084–48100 |
| ISL/NGF · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/40/card/items/2` | 48101–48117 |
| ISL/NGF · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/40/card/items/3` | 48118–48134 |
| ISL/ADM · CreateTime | `ISL-CreateTime-meta` | `/nodes/41/card/items/0` | 48377–48393 |
| ISL/ADM · CreateBy | `ISL-CreateBy-meta` | `/nodes/41/card/items/1` | 48394–48410 |
| ISL/ADM · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/41/card/items/2` | 48411–48427 |
| ISL/ADM · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/41/card/items/3` | 48428–48444 |
| ISL/NGF/WTR · Class | `ISL-classification-card` | `/nodes/42/card/items/0` | 48692–48705 |
| ISL/NGF/WTR · tags.nomenclator | `isl_ngf_wtr-card-nomenclator-0` | `/nodes/42/card/items/1` | 48706–48729 |
| ISL/NGF/WTR · extensions.link.wiki | `isl_ngf_wtr-card-wiki-1` | `/nodes/42/card/items/2` | 48730–48757 |
| ISL/NGF/WTR · extensions.character.brief | `isl_ngf_wtr-card-brief-2` | `/nodes/42/card/items/3` | 48758–48781 |
| ISL/NGF/WTR · Situation | `isl_ngf_wtr-card-Situation-3` | `/nodes/42/card/items/4` | 48782–48805 |
| ISL/NGF/WTR · CreateTime | `ISL-CreateTime-meta` | `/nodes/42/card/items/5` | 48806–48822 |
| ISL/NGF/WTR · CreateBy | `ISL-CreateBy-meta` | `/nodes/42/card/items/6` | 48823–48839 |
| ISL/NGF/WTR · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/42/card/items/7` | 48840–48856 |
| ISL/NGF/WTR · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/42/card/items/8` | 48857–48873 |
| ISL/NGF/BOD · Class | `ISL-classification-card` | `/nodes/43/card/items/0` | 49621–49634 |
| ISL/NGF/BOD · tags.nomenclator | `isl_ngf_bod-card-nomenclator-0` | `/nodes/43/card/items/1` | 49635–49658 |
| ISL/NGF/BOD · tags.BNgf1 | `isl_ngf_bod-card-BNgf1-1` | `/nodes/43/card/items/2` | 49659–49682 |
| ISL/NGF/BOD · tags.BNgf2 | `isl_ngf_bod-card-BNgf2-2` | `/nodes/43/card/items/3` | 49683–49706 |
| ISL/NGF/BOD · extensions.link.wiki | `isl_ngf_bod-card-wiki-3` | `/nodes/43/card/items/4` | 49707–49734 |
| ISL/NGF/BOD · extensions.character.brief | `isl_ngf_bod-card-brief-4` | `/nodes/43/card/items/5` | 49735–49758 |
| ISL/NGF/BOD · Situation | `isl_ngf_bod-card-Situation-5` | `/nodes/43/card/items/6` | 49759–49782 |
| ISL/NGF/BOD · CreateTime | `ISL-CreateTime-meta` | `/nodes/43/card/items/7` | 49783–49799 |
| ISL/NGF/BOD · CreateBy | `ISL-CreateBy-meta` | `/nodes/43/card/items/8` | 49800–49816 |
| ISL/NGF/BOD · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/43/card/items/9` | 49817–49833 |
| ISL/NGF/BOD · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/43/card/items/10` | 49834–49850 |
| ISL/ADM/DBL · Class | `ISL-classification-card` | `/nodes/44/card/items/0` | 50599–50612 |
| ISL/ADM/DBL · tags.nomenclator | `isl_adm_dbl-card-nomenclator-0` | `/nodes/44/card/items/1` | 50613–50636 |
| ISL/ADM/DBL · tags.Land | `isl_adm_dbl-card-Land-1` | `/nodes/44/card/items/2` | 50637–50660 |
| ISL/ADM/DBL · tags.BAdm1 | `isl_adm_dbl-card-BAdm1-2` | `/nodes/44/card/items/3` | 50661–50684 |
| ISL/ADM/DBL · tags.BAdm2 | `isl_adm_dbl-card-BAdm2-3` | `/nodes/44/card/items/4` | 50685–50708 |
| ISL/ADM/DBL · tags.GAdm | `isl_adm_dbl-card-GAdm-4` | `/nodes/44/card/items/5` | 50709–50732 |
| ISL/ADM/DBL · extensions.link.wiki | `isl_adm_dbl-card-wiki-5` | `/nodes/44/card/items/6` | 50733–50760 |
| ISL/ADM/DBL · extensions.character.brief | `isl_adm_dbl-card-brief-6` | `/nodes/44/card/items/7` | 50761–50784 |
| ISL/ADM/DBL · Situation | `isl_adm_dbl-card-Situation-7` | `/nodes/44/card/items/8` | 50785–50808 |
| ISL/ADM/DBL · CreateTime | `ISL-CreateTime-meta` | `/nodes/44/card/items/9` | 50809–50825 |
| ISL/ADM/DBL · CreateBy | `ISL-CreateBy-meta` | `/nodes/44/card/items/10` | 50826–50842 |
| ISL/ADM/DBL · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/44/card/items/11` | 50843–50859 |
| ISL/ADM/DBL · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/44/card/items/12` | 50860–50876 |
| ISL/ADM/PLL · Class | `ISL-classification-card` | `/nodes/45/card/items/0` | 51627–51640 |
| ISL/ADM/PLL · tags.nomenclator | `isl_adm_pll-card-nomenclator-0` | `/nodes/45/card/items/1` | 51641–51664 |
| ISL/ADM/PLL · tags.Land | `isl_adm_pll-card-Land-1` | `/nodes/45/card/items/2` | 51665–51688 |
| ISL/ADM/PLL · tags.BAdm1 | `isl_adm_pll-card-BAdm1-2` | `/nodes/45/card/items/3` | 51689–51712 |
| ISL/ADM/PLL · tags.BAdm2 | `isl_adm_pll-card-BAdm2-3` | `/nodes/45/card/items/4` | 51713–51736 |
| ISL/ADM/PLL · tags.GAdm | `isl_adm_pll-card-GAdm-4` | `/nodes/45/card/items/5` | 51737–51760 |
| ISL/ADM/PLL · extensions.link.wiki | `isl_adm_pll-card-wiki-5` | `/nodes/45/card/items/6` | 51761–51788 |
| ISL/ADM/PLL · extensions.character.brief | `isl_adm_pll-card-brief-6` | `/nodes/45/card/items/7` | 51789–51812 |
| ISL/ADM/PLL · Situation | `isl_adm_pll-card-Situation-7` | `/nodes/45/card/items/8` | 51813–51836 |
| ISL/ADM/PLL · CreateTime | `ISL-CreateTime-meta` | `/nodes/45/card/items/9` | 51837–51853 |
| ISL/ADM/PLL · CreateBy | `ISL-CreateBy-meta` | `/nodes/45/card/items/10` | 51854–51870 |
| ISL/ADM/PLL · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/45/card/items/11` | 51871–51887 |
| ISL/ADM/PLL · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/45/card/items/12` | 51888–51904 |
| ISL/NGF/WTR/RVR · Class | `ISL-classification-card` | `/nodes/46/card/items/0` | 52658–52675 |
| ISL/NGF/WTR/RVR · tags.nomenclator | `isl_ngf_wtr-card-nomenclator-0` | `/nodes/46/card/items/1` | 52676–52691 |
| ISL/NGF/WTR/RVR · extensions.link.wiki | `isl_ngf_wtr-card-wiki-1` | `/nodes/46/card/items/2` | 52692–52711 |
| ISL/NGF/WTR/RVR · extensions.character.brief | `isl_ngf_wtr-card-brief-2` | `/nodes/46/card/items/3` | 52712–52727 |
| ISL/NGF/WTR/RVR · Situation | `isl_ngf_wtr-card-Situation-3` | `/nodes/46/card/items/4` | 52728–52743 |
| ISL/NGF/WTR/RVR · CreateTime | `ISL-CreateTime-meta` | `/nodes/46/card/items/5` | 52744–52760 |
| ISL/NGF/WTR/RVR · CreateBy | `ISL-CreateBy-meta` | `/nodes/46/card/items/6` | 52761–52777 |
| ISL/NGF/WTR/RVR · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/46/card/items/7` | 52778–52794 |
| ISL/NGF/WTR/RVR · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/46/card/items/8` | 52795–52811 |
| ISL/NGF/WTR/CAN · Class | `ISL-classification-card` | `/nodes/47/card/items/0` | 53561–53578 |
| ISL/NGF/WTR/CAN · tags.nomenclator | `isl_ngf_wtr-card-nomenclator-0` | `/nodes/47/card/items/1` | 53579–53594 |
| ISL/NGF/WTR/CAN · extensions.link.wiki | `isl_ngf_wtr-card-wiki-1` | `/nodes/47/card/items/2` | 53595–53614 |
| ISL/NGF/WTR/CAN · extensions.character.brief | `isl_ngf_wtr-card-brief-2` | `/nodes/47/card/items/3` | 53615–53630 |
| ISL/NGF/WTR/CAN · Situation | `isl_ngf_wtr-card-Situation-3` | `/nodes/47/card/items/4` | 53631–53646 |
| ISL/NGF/WTR/CAN · CreateTime | `ISL-CreateTime-meta` | `/nodes/47/card/items/5` | 53647–53663 |
| ISL/NGF/WTR/CAN · CreateBy | `ISL-CreateBy-meta` | `/nodes/47/card/items/6` | 53664–53680 |
| ISL/NGF/WTR/CAN · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/47/card/items/7` | 53681–53697 |
| ISL/NGF/WTR/CAN · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/47/card/items/8` | 53698–53714 |
| ISL/NGF/BOD/BDY · Class | `ISL-classification-card` | `/nodes/48/card/items/0` | 54464–54481 |
| ISL/NGF/BOD/BDY · tags.nomenclator | `isl_ngf_bod-card-nomenclator-0` | `/nodes/48/card/items/1` | 54482–54497 |
| ISL/NGF/BOD/BDY · tags.BNgf1 | `isl_ngf_bod-card-BNgf1-1` | `/nodes/48/card/items/2` | 54498–54513 |
| ISL/NGF/BOD/BDY · tags.BNgf2 | `isl_ngf_bod-card-BNgf2-2` | `/nodes/48/card/items/3` | 54514–54529 |
| ISL/NGF/BOD/BDY · extensions.link.wiki | `isl_ngf_bod-card-wiki-3` | `/nodes/48/card/items/4` | 54530–54549 |
| ISL/NGF/BOD/BDY · extensions.character.brief | `isl_ngf_bod-card-brief-4` | `/nodes/48/card/items/5` | 54550–54565 |
| ISL/NGF/BOD/BDY · Situation | `isl_ngf_bod-card-Situation-5` | `/nodes/48/card/items/6` | 54566–54581 |
| ISL/NGF/BOD/BDY · CreateTime | `ISL-CreateTime-meta` | `/nodes/48/card/items/7` | 54582–54598 |
| ISL/NGF/BOD/BDY · CreateBy | `ISL-CreateBy-meta` | `/nodes/48/card/items/8` | 54599–54615 |
| ISL/NGF/BOD/BDY · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/48/card/items/9` | 54616–54632 |
| ISL/NGF/BOD/BDY · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/48/card/items/10` | 54633–54649 |
| ISL/NGF/BOD/STC · Class | `ISL-classification-card` | `/nodes/49/card/items/0` | 55401–55418 |
| ISL/NGF/BOD/STC · tags.nomenclator | `isl_ngf_bod-card-nomenclator-0` | `/nodes/49/card/items/1` | 55419–55434 |
| ISL/NGF/BOD/STC · tags.BNgf1 | `isl_ngf_bod-card-BNgf1-1` | `/nodes/49/card/items/2` | 55435–55450 |
| ISL/NGF/BOD/STC · tags.BNgf2 | `isl_ngf_bod-card-BNgf2-2` | `/nodes/49/card/items/3` | 55451–55466 |
| ISL/NGF/BOD/STC · extensions.link.wiki | `isl_ngf_bod-card-wiki-3` | `/nodes/49/card/items/4` | 55467–55486 |
| ISL/NGF/BOD/STC · extensions.character.brief | `isl_ngf_bod-card-brief-4` | `/nodes/49/card/items/5` | 55487–55502 |
| ISL/NGF/BOD/STC · Situation | `isl_ngf_bod-card-Situation-5` | `/nodes/49/card/items/6` | 55503–55518 |
| ISL/NGF/BOD/STC · CreateTime | `ISL-CreateTime-meta` | `/nodes/49/card/items/7` | 55519–55535 |
| ISL/NGF/BOD/STC · CreateBy | `ISL-CreateBy-meta` | `/nodes/49/card/items/8` | 55536–55552 |
| ISL/NGF/BOD/STC · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/49/card/items/9` | 55553–55569 |
| ISL/NGF/BOD/STC · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/49/card/items/10` | 55570–55586 |
| ISL/ADM/DBL/LBD · Class | `ISL-classification-card` | `/nodes/50/card/items/0` | 56338–56355 |
| ISL/ADM/DBL/LBD · tags.nomenclator | `isl_adm_dbl-card-nomenclator-0` | `/nodes/50/card/items/1` | 56356–56371 |
| ISL/ADM/DBL/LBD · tags.Land | `isl_adm_dbl-card-Land-1` | `/nodes/50/card/items/2` | 56372–56387 |
| ISL/ADM/DBL/LBD · tags.BAdm1 | `isl_adm_dbl-card-BAdm1-2` | `/nodes/50/card/items/3` | 56388–56403 |
| ISL/ADM/DBL/LBD · tags.BAdm2 | `isl_adm_dbl-card-BAdm2-3` | `/nodes/50/card/items/4` | 56404–56419 |
| ISL/ADM/DBL/LBD · tags.GAdm | `isl_adm_dbl-card-GAdm-4` | `/nodes/50/card/items/5` | 56420–56435 |
| ISL/ADM/DBL/LBD · extensions.link.wiki | `isl_adm_dbl-card-wiki-5` | `/nodes/50/card/items/6` | 56436–56455 |
| ISL/ADM/DBL/LBD · extensions.character.brief | `isl_adm_dbl-card-brief-6` | `/nodes/50/card/items/7` | 56456–56471 |
| ISL/ADM/DBL/LBD · Situation | `isl_adm_dbl-card-Situation-7` | `/nodes/50/card/items/8` | 56472–56487 |
| ISL/ADM/DBL/LBD · CreateTime | `ISL-CreateTime-meta` | `/nodes/50/card/items/9` | 56488–56504 |
| ISL/ADM/DBL/LBD · CreateBy | `ISL-CreateBy-meta` | `/nodes/50/card/items/10` | 56505–56521 |
| ISL/ADM/DBL/LBD · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/50/card/items/11` | 56522–56538 |
| ISL/ADM/DBL/LBD · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/50/card/items/12` | 56539–56555 |
| ISL/ADM/PLL/CBD · Class | `ISL-classification-card` | `/nodes/51/card/items/0` | 57309–57326 |
| ISL/ADM/PLL/CBD · tags.nomenclator | `isl_adm_pll-card-nomenclator-0` | `/nodes/51/card/items/1` | 57327–57342 |
| ISL/ADM/PLL/CBD · tags.Land | `isl_adm_pll-card-Land-1` | `/nodes/51/card/items/2` | 57343–57358 |
| ISL/ADM/PLL/CBD · tags.BAdm1 | `isl_adm_pll-card-BAdm1-2` | `/nodes/51/card/items/3` | 57359–57374 |
| ISL/ADM/PLL/CBD · tags.BAdm2 | `isl_adm_pll-card-BAdm2-3` | `/nodes/51/card/items/4` | 57375–57390 |
| ISL/ADM/PLL/CBD · tags.GAdm | `isl_adm_pll-card-GAdm-4` | `/nodes/51/card/items/5` | 57391–57406 |
| ISL/ADM/PLL/CBD · extensions.link.wiki | `isl_adm_pll-card-wiki-5` | `/nodes/51/card/items/6` | 57407–57426 |
| ISL/ADM/PLL/CBD · extensions.character.brief | `isl_adm_pll-card-brief-6` | `/nodes/51/card/items/7` | 57427–57442 |
| ISL/ADM/PLL/CBD · Situation | `isl_adm_pll-card-Situation-7` | `/nodes/51/card/items/8` | 57443–57458 |
| ISL/ADM/PLL/CBD · CreateTime | `ISL-CreateTime-meta` | `/nodes/51/card/items/9` | 57459–57475 |
| ISL/ADM/PLL/CBD · CreateBy | `ISL-CreateBy-meta` | `/nodes/51/card/items/10` | 57476–57492 |
| ISL/ADM/PLL/CBD · ModifityTime | `ISL-ModifityTime-meta` | `/nodes/51/card/items/11` | 57493–57509 |
| ISL/ADM/PLL/CBD · ModifityBy | `ISL-ModifityBy-meta` | `/nodes/51/card/items/12` | 57510–57526 |
| ISP · CreateTime | `ISP-CreateTime-meta` | `/nodes/52/card/items/0` | 58535–58547 |
| ISP · CreateBy | `ISP-CreateBy-meta` | `/nodes/52/card/items/1` | 58548–58560 |
| ISP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/52/card/items/2` | 58561–58573 |
| ISP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/52/card/items/3` | 58574–58586 |
| ISP/NGF · CreateTime | `ISP-CreateTime-meta` | `/nodes/53/card/items/0` | 59395–59411 |
| ISP/NGF · CreateBy | `ISP-CreateBy-meta` | `/nodes/53/card/items/1` | 59412–59428 |
| ISP/NGF · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/53/card/items/2` | 59429–59445 |
| ISP/NGF · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/53/card/items/3` | 59446–59462 |
| ISP/ADM · CreateTime | `ISP-CreateTime-meta` | `/nodes/54/card/items/0` | 59779–59795 |
| ISP/ADM · CreateBy | `ISP-CreateBy-meta` | `/nodes/54/card/items/1` | 59796–59812 |
| ISP/ADM · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/54/card/items/2` | 59813–59829 |
| ISP/ADM · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/54/card/items/3` | 59830–59846 |
| ISP/NGF/SCP · Class | `ISP-classification-card` | `/nodes/55/card/items/0` | 60167–60180 |
| ISP/NGF/SCP · elevation | `isp_ngf_scp-card-elevation-0` | `/nodes/55/card/items/1` | 60181–60204 |
| ISP/NGF/SCP · tags.nomenclator | `isp_ngf_scp-card-nomenclator-1` | `/nodes/55/card/items/2` | 60205–60228 |
| ISP/NGF/SCP · tags.Land | `isp_ngf_scp-card-Land-2` | `/nodes/55/card/items/3` | 60229–60252 |
| ISP/NGF/SCP · tags.UAdm | `isp_ngf_scp-card-UAdm-3` | `/nodes/55/card/items/4` | 60253–60276 |
| ISP/NGF/SCP · tags.Pop | `isp_ngf_scp-card-Pop-4` | `/nodes/55/card/items/5` | 60277–60300 |
| ISP/NGF/SCP · extensions.character.event | `isp_ngf_scp-card-event-5` | `/nodes/55/card/items/6` | 60301–60324 |
| ISP/NGF/SCP · extensions.link.wiki | `isp_ngf_scp-card-wiki-6` | `/nodes/55/card/items/7` | 60325–60352 |
| ISP/NGF/SCP · extensions.character.brief | `isp_ngf_scp-card-brief-7` | `/nodes/55/card/items/8` | 60353–60376 |
| ISP/NGF/SCP · CreateTime | `ISP-CreateTime-meta` | `/nodes/55/card/items/9` | 60377–60393 |
| ISP/NGF/SCP · CreateBy | `ISP-CreateBy-meta` | `/nodes/55/card/items/10` | 60394–60410 |
| ISP/NGF/SCP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/55/card/items/11` | 60411–60427 |
| ISP/NGF/SCP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/55/card/items/12` | 60428–60444 |
| ISP/ADM/DBP · Class | `ISP-classification-card` | `/nodes/56/card/items/0` | 61256–61269 |
| ISP/ADM/DBP · elevation | `isp_adm_dbp-card-elevation-0` | `/nodes/56/card/items/1` | 61270–61293 |
| ISP/ADM/DBP · tags.nomenclator | `isp_adm_dbp-card-nomenclator-1` | `/nodes/56/card/items/2` | 61294–61317 |
| ISP/ADM/DBP · tags.Land | `isp_adm_dbp-card-Land-2` | `/nodes/56/card/items/3` | 61318–61341 |
| ISP/ADM/DBP · tags.UAdm | `isp_adm_dbp-card-UAdm-3` | `/nodes/56/card/items/4` | 61342–61365 |
| ISP/ADM/DBP · tags.Pop | `isp_adm_dbp-card-Pop-4` | `/nodes/56/card/items/5` | 61366–61389 |
| ISP/ADM/DBP · extensions.character.event | `isp_adm_dbp-card-event-5` | `/nodes/56/card/items/6` | 61390–61413 |
| ISP/ADM/DBP · extensions.link.wiki | `isp_adm_dbp-card-wiki-6` | `/nodes/56/card/items/7` | 61414–61441 |
| ISP/ADM/DBP · extensions.character.brief | `isp_adm_dbp-card-brief-7` | `/nodes/56/card/items/8` | 61442–61465 |
| ISP/ADM/DBP · CreateTime | `ISP-CreateTime-meta` | `/nodes/56/card/items/9` | 61466–61482 |
| ISP/ADM/DBP · CreateBy | `ISP-CreateBy-meta` | `/nodes/56/card/items/10` | 61483–61499 |
| ISP/ADM/DBP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/56/card/items/11` | 61500–61516 |
| ISP/ADM/DBP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/56/card/items/12` | 61517–61533 |
| ISP/ADM/PLP · Class | `ISP-classification-card` | `/nodes/57/card/items/0` | 62345–62358 |
| ISP/ADM/PLP · elevation | `isp_adm_plp-card-elevation-0` | `/nodes/57/card/items/1` | 62359–62382 |
| ISP/ADM/PLP · tags.nomenclator | `isp_adm_plp-card-nomenclator-1` | `/nodes/57/card/items/2` | 62383–62406 |
| ISP/ADM/PLP · tags.Land | `isp_adm_plp-card-Land-2` | `/nodes/57/card/items/3` | 62407–62430 |
| ISP/ADM/PLP · tags.UAdm | `isp_adm_plp-card-UAdm-3` | `/nodes/57/card/items/4` | 62431–62454 |
| ISP/ADM/PLP · tags.Pop | `isp_adm_plp-card-Pop-4` | `/nodes/57/card/items/5` | 62455–62478 |
| ISP/ADM/PLP · extensions.character.event | `isp_adm_plp-card-event-5` | `/nodes/57/card/items/6` | 62479–62502 |
| ISP/ADM/PLP · extensions.link.wiki | `isp_adm_plp-card-wiki-6` | `/nodes/57/card/items/7` | 62503–62530 |
| ISP/ADM/PLP · extensions.character.brief | `isp_adm_plp-card-brief-7` | `/nodes/57/card/items/8` | 62531–62554 |
| ISP/ADM/PLP · CreateTime | `ISP-CreateTime-meta` | `/nodes/57/card/items/9` | 62555–62571 |
| ISP/ADM/PLP · CreateBy | `ISP-CreateBy-meta` | `/nodes/57/card/items/10` | 62572–62588 |
| ISP/ADM/PLP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/57/card/items/11` | 62589–62605 |
| ISP/ADM/PLP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/57/card/items/12` | 62606–62622 |
| ISP/NGF/SCP/SPP · Class | `ISP-classification-card` | `/nodes/58/card/items/0` | 63436–63453 |
| ISP/NGF/SCP/SPP · elevation | `isp_ngf_scp-card-elevation-0` | `/nodes/58/card/items/1` | 63454–63469 |
| ISP/NGF/SCP/SPP · tags.nomenclator | `isp_ngf_scp-card-nomenclator-1` | `/nodes/58/card/items/2` | 63470–63485 |
| ISP/NGF/SCP/SPP · tags.Land | `isp_ngf_scp-card-Land-2` | `/nodes/58/card/items/3` | 63486–63501 |
| ISP/NGF/SCP/SPP · tags.UAdm | `isp_ngf_scp-card-UAdm-3` | `/nodes/58/card/items/4` | 63502–63517 |
| ISP/NGF/SCP/SPP · tags.Pop | `isp_ngf_scp-card-Pop-4` | `/nodes/58/card/items/5` | 63518–63533 |
| ISP/NGF/SCP/SPP · extensions.character.event | `isp_ngf_scp-card-event-5` | `/nodes/58/card/items/6` | 63534–63549 |
| ISP/NGF/SCP/SPP · extensions.link.wiki | `isp_ngf_scp-card-wiki-6` | `/nodes/58/card/items/7` | 63550–63569 |
| ISP/NGF/SCP/SPP · extensions.character.brief | `isp_ngf_scp-card-brief-7` | `/nodes/58/card/items/8` | 63570–63585 |
| ISP/NGF/SCP/SPP · CreateTime | `ISP-CreateTime-meta` | `/nodes/58/card/items/9` | 63586–63602 |
| ISP/NGF/SCP/SPP · CreateBy | `ISP-CreateBy-meta` | `/nodes/58/card/items/10` | 63603–63619 |
| ISP/NGF/SCP/SPP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/58/card/items/11` | 63620–63636 |
| ISP/NGF/SCP/SPP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/58/card/items/12` | 63637–63653 |
| ISP/ADM/DBP/LIP · Class | `ISP-classification-card` | `/nodes/59/card/items/0` | 64467–64484 |
| ISP/ADM/DBP/LIP · elevation | `isp_adm_dbp-card-elevation-0` | `/nodes/59/card/items/1` | 64485–64500 |
| ISP/ADM/DBP/LIP · tags.nomenclator | `isp_adm_dbp-card-nomenclator-1` | `/nodes/59/card/items/2` | 64501–64516 |
| ISP/ADM/DBP/LIP · tags.Land | `isp_adm_dbp-card-Land-2` | `/nodes/59/card/items/3` | 64517–64532 |
| ISP/ADM/DBP/LIP · tags.UAdm | `isp_adm_dbp-card-UAdm-3` | `/nodes/59/card/items/4` | 64533–64548 |
| ISP/ADM/DBP/LIP · tags.Pop | `isp_adm_dbp-card-Pop-4` | `/nodes/59/card/items/5` | 64549–64564 |
| ISP/ADM/DBP/LIP · extensions.character.event | `isp_adm_dbp-card-event-5` | `/nodes/59/card/items/6` | 64565–64580 |
| ISP/ADM/DBP/LIP · extensions.link.wiki | `isp_adm_dbp-card-wiki-6` | `/nodes/59/card/items/7` | 64581–64600 |
| ISP/ADM/DBP/LIP · extensions.character.brief | `isp_adm_dbp-card-brief-7` | `/nodes/59/card/items/8` | 64601–64616 |
| ISP/ADM/DBP/LIP · CreateTime | `ISP-CreateTime-meta` | `/nodes/59/card/items/9` | 64617–64633 |
| ISP/ADM/DBP/LIP · CreateBy | `ISP-CreateBy-meta` | `/nodes/59/card/items/10` | 64634–64650 |
| ISP/ADM/DBP/LIP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/59/card/items/11` | 64651–64667 |
| ISP/ADM/DBP/LIP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/59/card/items/12` | 64668–64684 |
| ISP/ADM/PLP/PLP · Class | `ISP-classification-card` | `/nodes/60/card/items/0` | 65498–65515 |
| ISP/ADM/PLP/PLP · elevation | `isp_adm_plp-card-elevation-0` | `/nodes/60/card/items/1` | 65516–65531 |
| ISP/ADM/PLP/PLP · tags.nomenclator | `isp_adm_plp-card-nomenclator-1` | `/nodes/60/card/items/2` | 65532–65547 |
| ISP/ADM/PLP/PLP · tags.Land | `isp_adm_plp-card-Land-2` | `/nodes/60/card/items/3` | 65548–65563 |
| ISP/ADM/PLP/PLP · tags.UAdm | `isp_adm_plp-card-UAdm-3` | `/nodes/60/card/items/4` | 65564–65579 |
| ISP/ADM/PLP/PLP · tags.Pop | `isp_adm_plp-card-Pop-4` | `/nodes/60/card/items/5` | 65580–65595 |
| ISP/ADM/PLP/PLP · extensions.character.event | `isp_adm_plp-card-event-5` | `/nodes/60/card/items/6` | 65596–65611 |
| ISP/ADM/PLP/PLP · extensions.link.wiki | `isp_adm_plp-card-wiki-6` | `/nodes/60/card/items/7` | 65612–65631 |
| ISP/ADM/PLP/PLP · extensions.character.brief | `isp_adm_plp-card-brief-7` | `/nodes/60/card/items/8` | 65632–65647 |
| ISP/ADM/PLP/PLP · CreateTime | `ISP-CreateTime-meta` | `/nodes/60/card/items/9` | 65648–65664 |
| ISP/ADM/PLP/PLP · CreateBy | `ISP-CreateBy-meta` | `/nodes/60/card/items/10` | 65665–65681 |
| ISP/ADM/PLP/PLP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/60/card/items/11` | 65682–65698 |
| ISP/ADM/PLP/PLP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/60/card/items/12` | 65699–65715 |
| ISP/ADM/PLP/COP · Class | `ISP-classification-card` | `/nodes/61/card/items/0` | 66529–66546 |
| ISP/ADM/PLP/COP · elevation | `isp_adm_plp-card-elevation-0` | `/nodes/61/card/items/1` | 66547–66562 |
| ISP/ADM/PLP/COP · tags.nomenclator | `isp_adm_plp-card-nomenclator-1` | `/nodes/61/card/items/2` | 66563–66578 |
| ISP/ADM/PLP/COP · tags.Land | `isp_adm_plp-card-Land-2` | `/nodes/61/card/items/3` | 66579–66594 |
| ISP/ADM/PLP/COP · tags.UAdm | `isp_adm_plp-card-UAdm-3` | `/nodes/61/card/items/4` | 66595–66610 |
| ISP/ADM/PLP/COP · tags.Pop | `isp_adm_plp-card-Pop-4` | `/nodes/61/card/items/5` | 66611–66626 |
| ISP/ADM/PLP/COP · extensions.character.event | `isp_adm_plp-card-event-5` | `/nodes/61/card/items/6` | 66627–66642 |
| ISP/ADM/PLP/COP · extensions.link.wiki | `isp_adm_plp-card-wiki-6` | `/nodes/61/card/items/7` | 66643–66662 |
| ISP/ADM/PLP/COP · extensions.character.brief | `isp_adm_plp-card-brief-7` | `/nodes/61/card/items/8` | 66663–66678 |
| ISP/ADM/PLP/COP · CreateTime | `ISP-CreateTime-meta` | `/nodes/61/card/items/9` | 66679–66695 |
| ISP/ADM/PLP/COP · CreateBy | `ISP-CreateBy-meta` | `/nodes/61/card/items/10` | 66696–66712 |
| ISP/ADM/PLP/COP · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/61/card/items/11` | 66713–66729 |
| ISP/ADM/PLP/COP · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/61/card/items/12` | 66730–66746 |
| ISP/ADM/DBP/SHR · Class | `ISP-classification-card` | `/nodes/62/card/items/0` | 67560–67577 |
| ISP/ADM/DBP/SHR · elevation | `isp_adm_dbp-card-elevation-0` | `/nodes/62/card/items/1` | 67578–67593 |
| ISP/ADM/DBP/SHR · tags.nomenclator | `isp_adm_dbp-card-nomenclator-1` | `/nodes/62/card/items/2` | 67594–67609 |
| ISP/ADM/DBP/SHR · tags.Land | `isp_adm_dbp-card-Land-2` | `/nodes/62/card/items/3` | 67610–67625 |
| ISP/ADM/DBP/SHR · tags.UAdm | `isp_adm_dbp-card-UAdm-3` | `/nodes/62/card/items/4` | 67626–67641 |
| ISP/ADM/DBP/SHR · tags.Pop | `isp_adm_dbp-card-Pop-4` | `/nodes/62/card/items/5` | 67642–67657 |
| ISP/ADM/DBP/SHR · extensions.character.event | `isp_adm_dbp-card-event-5` | `/nodes/62/card/items/6` | 67658–67673 |
| ISP/ADM/DBP/SHR · extensions.link.wiki | `isp_adm_dbp-card-wiki-6` | `/nodes/62/card/items/7` | 67674–67693 |
| ISP/ADM/DBP/SHR · extensions.character.brief | `isp_adm_dbp-card-brief-7` | `/nodes/62/card/items/8` | 67694–67709 |
| ISP/ADM/DBP/SHR · CreateTime | `ISP-CreateTime-meta` | `/nodes/62/card/items/9` | 67710–67726 |
| ISP/ADM/DBP/SHR · CreateBy | `ISP-CreateBy-meta` | `/nodes/62/card/items/10` | 67727–67743 |
| ISP/ADM/DBP/SHR · ModifityTime | `ISP-ModifityTime-meta` | `/nodes/62/card/items/11` | 67744–67760 |
| ISP/ADM/DBP/SHR · ModifityBy | `ISP-ModifityBy-meta` | `/nodes/62/card/items/12` | 67761–67777 |
| PFB · Class | `PFB-classification-card` | `/nodes/63/card/items/0` | 68699–68712 |
| PFB · LineID | `rail_platform_boundary-card-LineID-0` | `/nodes/63/card/items/1` | 68713–68744 |
| PFB · elevation | `rail_platform_boundary-card-elevation-1` | `/nodes/63/card/items/2` | 68745–68766 |
| PFB · height | `rail_platform_boundary-card-height-2` | `/nodes/63/card/items/3` | 68767–68788 |
| PFB · extensions.link.wiki | `rail_platform_boundary-card-wiki-3` | `/nodes/63/card/items/4` | 68789–68814 |
| PFB · extensions.character.brief | `rail_platform_boundary-card-brief-4` | `/nodes/63/card/items/5` | 68815–68836 |
| PFB · CreateTime | `PFB-CreateTime-meta` | `/nodes/63/card/items/6` | 68837–68849 |
| PFB · CreateBy | `PFB-CreateBy-meta` | `/nodes/63/card/items/7` | 68850–68862 |
| PFB · ModifityTime | `PFB-ModifityTime-meta` | `/nodes/63/card/items/8` | 68863–68875 |
| PFB · ModifityBy | `PFB-ModifityBy-meta` | `/nodes/63/card/items/9` | 68876–68888 |
| PLF · Class | `PLF-classification-card` | `/nodes/64/card/items/0` | 69761–69774 |
| PLF · ID | `plf-card-line-chips` | `/nodes/64/card/items/1` | 69775–69789 |
| PLF · Situation | `rail_platform-card-Situation-0` | `/nodes/64/card/items/2` | 69790–69814 |
| PLF · Connect | `rail_platform-card-Connect-1` | `/nodes/64/card/items/3` | 69815–69839 |
| PLF · elevation | `rail_platform-card-elevation-2` | `/nodes/64/card/items/4` | 69840–69861 |
| PLF · extensions.link.wiki | `rail_platform-card-wiki-3` | `/nodes/64/card/items/5` | 69862–69887 |
| PLF · extensions.character.brief | `rail_platform-card-brief-4` | `/nodes/64/card/items/6` | 69888–69909 |
| PLF · lines | `rail_platform-card-lines-0` | `/nodes/64/card/items/7` | 69910–69934 |
| PLF · CreateTime | `PLF-CreateTime-meta` | `/nodes/64/card/items/8` | 69935–69947 |
| PLF · CreateBy | `PLF-CreateBy-meta` | `/nodes/64/card/items/9` | 69948–69960 |
| PLF · ModifityTime | `PLF-ModifityTime-meta` | `/nodes/64/card/items/10` | 69961–69973 |
| PLF · ModifityBy | `PLF-ModifityBy-meta` | `/nodes/64/card/items/11` | 69974–69986 |
| RLE · Class | `RLE-classification-card` | `/nodes/65/card/items/0` | 72375–72388 |
| RLE · color | `rail_line-card-color-2` | `/nodes/65/card/items/1` | 72389–72414 |
| RLE · bureau | `rail_line-card-bureau-0` | `/nodes/65/card/items/2` | 72415–72436 |
| RLE · line | `rail_line-card-line-1` | `/nodes/65/card/items/3` | 72437–72458 |
| RLE · direction | `rail_line-card-direction-3` | `/nodes/65/card/items/4` | 72459–72480 |
| RLE · startplf | `rail_line-card-startplf-4` | `/nodes/65/card/items/5` | 72481–72502 |
| RLE · endplf | `rail_line-card-endplf-5` | `/nodes/65/card/items/6` | 72503–72524 |
| RLE · extensions.link.wiki | `rail_line-card-wiki-6` | `/nodes/65/card/items/7` | 72525–72550 |
| RLE · extensions.character.brief | `rail_line-card-brief-7` | `/nodes/65/card/items/8` | 72551–72572 |
| RLE · CreateTime | `RLE-CreateTime-meta` | `/nodes/65/card/items/9` | 72573–72585 |
| RLE · CreateBy | `RLE-CreateBy-meta` | `/nodes/65/card/items/10` | 72586–72598 |
| RLE · ModifityTime | `RLE-ModifityTime-meta` | `/nodes/65/card/items/11` | 72599–72611 |
| RLE · ModifityBy | `RLE-ModifityBy-meta` | `/nodes/65/card/items/12` | 72612–72624 |
| ROD · Class | `ROD-classification-card` | `/nodes/66/card/items/0` | 73988–74001 |
| ROD · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/66/card/items/1` | 74002–74023 |
| ROD · tags.Land | `rod_road-card-Land-1` | `/nodes/66/card/items/2` | 74024–74045 |
| ROD · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/66/card/items/3` | 74046–74067 |
| ROD · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/66/card/items/4` | 74068–74089 |
| ROD · Level | `rod_road-card-Level-4` | `/nodes/66/card/items/5` | 74090–74111 |
| ROD · Oneway | `rod_road-card-Oneway-5` | `/nodes/66/card/items/6` | 74112–74136 |
| ROD · Enter | `rod_road-card-Enter-6` | `/nodes/66/card/items/7` | 74137–74161 |
| ROD · Exit | `rod_road-card-Exit-7` | `/nodes/66/card/items/8` | 74162–74186 |
| ROD · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/66/card/items/9` | 74187–74211 |
| ROD · Speed | `rod_road-card-Speed-9` | `/nodes/66/card/items/10` | 74212–74233 |
| ROD · Situation | `rod_road-card-Situation-10` | `/nodes/66/card/items/11` | 74234–74255 |
| ROD · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/66/card/items/12` | 74256–74281 |
| ROD · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/66/card/items/13` | 74282–74303 |
| ROD · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/66/card/items/14` | 74304–74328 |
| ROD · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/66/card/items/15` | 74329–74353 |
| ROD · Mode | `rod_road-card-Mode-2` | `/nodes/66/card/items/16` | 74354–74378 |
| ROD · CreateTime | `ROD-CreateTime-meta` | `/nodes/66/card/items/17` | 74379–74391 |
| ROD · CreateBy | `ROD-CreateBy-meta` | `/nodes/66/card/items/18` | 74392–74404 |
| ROD · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/66/card/items/19` | 74405–74417 |
| ROD · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/66/card/items/20` | 74418–74430 |
| ROD/NOM · Class | `ROD-classification-card` | `/nodes/67/card/items/0` | 75749–75766 |
| ROD/NOM · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/67/card/items/1` | 75767–75782 |
| ROD/NOM · tags.Land | `rod_road-card-Land-1` | `/nodes/67/card/items/2` | 75783–75798 |
| ROD/NOM · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/67/card/items/3` | 75799–75814 |
| ROD/NOM · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/67/card/items/4` | 75815–75830 |
| ROD/NOM · Level | `rod_road-card-Level-4` | `/nodes/67/card/items/5` | 75831–75846 |
| ROD/NOM · Oneway | `rod_road-card-Oneway-5` | `/nodes/67/card/items/6` | 75847–75865 |
| ROD/NOM · Enter | `rod_road-card-Enter-6` | `/nodes/67/card/items/7` | 75866–75884 |
| ROD/NOM · Exit | `rod_road-card-Exit-7` | `/nodes/67/card/items/8` | 75885–75903 |
| ROD/NOM · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/67/card/items/9` | 75904–75922 |
| ROD/NOM · Speed | `rod_road-card-Speed-9` | `/nodes/67/card/items/10` | 75923–75938 |
| ROD/NOM · Situation | `rod_road-card-Situation-10` | `/nodes/67/card/items/11` | 75939–75954 |
| ROD/NOM · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/67/card/items/12` | 75955–75974 |
| ROD/NOM · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/67/card/items/13` | 75975–75990 |
| ROD/NOM · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/67/card/items/14` | 75991–76009 |
| ROD/NOM · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/67/card/items/15` | 76010–76028 |
| ROD/NOM · Mode | `rod_road-card-Mode-2` | `/nodes/67/card/items/16` | 76029–76047 |
| ROD/NOM · CreateTime | `ROD-CreateTime-meta` | `/nodes/67/card/items/17` | 76048–76064 |
| ROD/NOM · CreateBy | `ROD-CreateBy-meta` | `/nodes/67/card/items/18` | 76065–76081 |
| ROD/NOM · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/67/card/items/19` | 76082–76098 |
| ROD/NOM · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/67/card/items/20` | 76099–76115 |
| ROD/TUK · Class | `ROD-classification-card` | `/nodes/68/card/items/0` | 77413–77430 |
| ROD/TUK · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/68/card/items/1` | 77431–77446 |
| ROD/TUK · tags.Land | `rod_road-card-Land-1` | `/nodes/68/card/items/2` | 77447–77462 |
| ROD/TUK · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/68/card/items/3` | 77463–77478 |
| ROD/TUK · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/68/card/items/4` | 77479–77494 |
| ROD/TUK · Level | `rod_road-card-Level-4` | `/nodes/68/card/items/5` | 77495–77510 |
| ROD/TUK · Oneway | `rod_road-card-Oneway-5` | `/nodes/68/card/items/6` | 77511–77529 |
| ROD/TUK · Enter | `rod_road-card-Enter-6` | `/nodes/68/card/items/7` | 77530–77548 |
| ROD/TUK · Exit | `rod_road-card-Exit-7` | `/nodes/68/card/items/8` | 77549–77567 |
| ROD/TUK · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/68/card/items/9` | 77568–77586 |
| ROD/TUK · Speed | `rod_road-card-Speed-9` | `/nodes/68/card/items/10` | 77587–77602 |
| ROD/TUK · Situation | `rod_road-card-Situation-10` | `/nodes/68/card/items/11` | 77603–77618 |
| ROD/TUK · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/68/card/items/12` | 77619–77638 |
| ROD/TUK · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/68/card/items/13` | 77639–77654 |
| ROD/TUK · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/68/card/items/14` | 77655–77673 |
| ROD/TUK · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/68/card/items/15` | 77674–77692 |
| ROD/TUK · Mode | `rod_road-card-Mode-2` | `/nodes/68/card/items/16` | 77693–77711 |
| ROD/TUK · CreateTime | `ROD-CreateTime-meta` | `/nodes/68/card/items/17` | 77712–77728 |
| ROD/TUK · CreateBy | `ROD-CreateBy-meta` | `/nodes/68/card/items/18` | 77729–77745 |
| ROD/TUK · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/68/card/items/19` | 77746–77762 |
| ROD/TUK · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/68/card/items/20` | 77763–77779 |
| ROD/PRI · Class | `ROD-classification-card` | `/nodes/69/card/items/0` | 79077–79094 |
| ROD/PRI · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/69/card/items/1` | 79095–79110 |
| ROD/PRI · tags.Land | `rod_road-card-Land-1` | `/nodes/69/card/items/2` | 79111–79126 |
| ROD/PRI · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/69/card/items/3` | 79127–79142 |
| ROD/PRI · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/69/card/items/4` | 79143–79158 |
| ROD/PRI · Level | `rod_road-card-Level-4` | `/nodes/69/card/items/5` | 79159–79174 |
| ROD/PRI · Oneway | `rod_road-card-Oneway-5` | `/nodes/69/card/items/6` | 79175–79193 |
| ROD/PRI · Enter | `rod_road-card-Enter-6` | `/nodes/69/card/items/7` | 79194–79212 |
| ROD/PRI · Exit | `rod_road-card-Exit-7` | `/nodes/69/card/items/8` | 79213–79231 |
| ROD/PRI · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/69/card/items/9` | 79232–79250 |
| ROD/PRI · Speed | `rod_road-card-Speed-9` | `/nodes/69/card/items/10` | 79251–79266 |
| ROD/PRI · Situation | `rod_road-card-Situation-10` | `/nodes/69/card/items/11` | 79267–79282 |
| ROD/PRI · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/69/card/items/12` | 79283–79302 |
| ROD/PRI · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/69/card/items/13` | 79303–79318 |
| ROD/PRI · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/69/card/items/14` | 79319–79337 |
| ROD/PRI · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/69/card/items/15` | 79338–79356 |
| ROD/PRI · Mode | `rod_road-card-Mode-2` | `/nodes/69/card/items/16` | 79357–79375 |
| ROD/PRI · CreateTime | `ROD-CreateTime-meta` | `/nodes/69/card/items/17` | 79376–79392 |
| ROD/PRI · CreateBy | `ROD-CreateBy-meta` | `/nodes/69/card/items/18` | 79393–79409 |
| ROD/PRI · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/69/card/items/19` | 79410–79426 |
| ROD/PRI · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/69/card/items/20` | 79427–79443 |
| ROD/SEC · Class | `ROD-classification-card` | `/nodes/70/card/items/0` | 80741–80758 |
| ROD/SEC · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/70/card/items/1` | 80759–80774 |
| ROD/SEC · tags.Land | `rod_road-card-Land-1` | `/nodes/70/card/items/2` | 80775–80790 |
| ROD/SEC · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/70/card/items/3` | 80791–80806 |
| ROD/SEC · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/70/card/items/4` | 80807–80822 |
| ROD/SEC · Level | `rod_road-card-Level-4` | `/nodes/70/card/items/5` | 80823–80838 |
| ROD/SEC · Oneway | `rod_road-card-Oneway-5` | `/nodes/70/card/items/6` | 80839–80857 |
| ROD/SEC · Enter | `rod_road-card-Enter-6` | `/nodes/70/card/items/7` | 80858–80876 |
| ROD/SEC · Exit | `rod_road-card-Exit-7` | `/nodes/70/card/items/8` | 80877–80895 |
| ROD/SEC · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/70/card/items/9` | 80896–80914 |
| ROD/SEC · Speed | `rod_road-card-Speed-9` | `/nodes/70/card/items/10` | 80915–80930 |
| ROD/SEC · Situation | `rod_road-card-Situation-10` | `/nodes/70/card/items/11` | 80931–80946 |
| ROD/SEC · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/70/card/items/12` | 80947–80966 |
| ROD/SEC · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/70/card/items/13` | 80967–80982 |
| ROD/SEC · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/70/card/items/14` | 80983–81001 |
| ROD/SEC · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/70/card/items/15` | 81002–81020 |
| ROD/SEC · Mode | `rod_road-card-Mode-2` | `/nodes/70/card/items/16` | 81021–81039 |
| ROD/SEC · CreateTime | `ROD-CreateTime-meta` | `/nodes/70/card/items/17` | 81040–81056 |
| ROD/SEC · CreateBy | `ROD-CreateBy-meta` | `/nodes/70/card/items/18` | 81057–81073 |
| ROD/SEC · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/70/card/items/19` | 81074–81090 |
| ROD/SEC · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/70/card/items/20` | 81091–81107 |
| ROD/SED · Class | `ROD-classification-card` | `/nodes/71/card/items/0` | 82405–82422 |
| ROD/SED · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/71/card/items/1` | 82423–82438 |
| ROD/SED · tags.Land | `rod_road-card-Land-1` | `/nodes/71/card/items/2` | 82439–82454 |
| ROD/SED · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/71/card/items/3` | 82455–82470 |
| ROD/SED · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/71/card/items/4` | 82471–82486 |
| ROD/SED · Level | `rod_road-card-Level-4` | `/nodes/71/card/items/5` | 82487–82502 |
| ROD/SED · Oneway | `rod_road-card-Oneway-5` | `/nodes/71/card/items/6` | 82503–82521 |
| ROD/SED · Enter | `rod_road-card-Enter-6` | `/nodes/71/card/items/7` | 82522–82540 |
| ROD/SED · Exit | `rod_road-card-Exit-7` | `/nodes/71/card/items/8` | 82541–82559 |
| ROD/SED · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/71/card/items/9` | 82560–82578 |
| ROD/SED · Speed | `rod_road-card-Speed-9` | `/nodes/71/card/items/10` | 82579–82594 |
| ROD/SED · Situation | `rod_road-card-Situation-10` | `/nodes/71/card/items/11` | 82595–82610 |
| ROD/SED · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/71/card/items/12` | 82611–82630 |
| ROD/SED · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/71/card/items/13` | 82631–82646 |
| ROD/SED · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/71/card/items/14` | 82647–82665 |
| ROD/SED · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/71/card/items/15` | 82666–82684 |
| ROD/SED · Mode | `rod_road-card-Mode-2` | `/nodes/71/card/items/16` | 82685–82703 |
| ROD/SED · CreateTime | `ROD-CreateTime-meta` | `/nodes/71/card/items/17` | 82704–82720 |
| ROD/SED · CreateBy | `ROD-CreateBy-meta` | `/nodes/71/card/items/18` | 82721–82737 |
| ROD/SED · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/71/card/items/19` | 82738–82754 |
| ROD/SED · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/71/card/items/20` | 82755–82771 |
| ROD/RES · Class | `ROD-classification-card` | `/nodes/72/card/items/0` | 84069–84086 |
| ROD/RES · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/72/card/items/1` | 84087–84102 |
| ROD/RES · tags.Land | `rod_road-card-Land-1` | `/nodes/72/card/items/2` | 84103–84118 |
| ROD/RES · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/72/card/items/3` | 84119–84134 |
| ROD/RES · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/72/card/items/4` | 84135–84150 |
| ROD/RES · Level | `rod_road-card-Level-4` | `/nodes/72/card/items/5` | 84151–84166 |
| ROD/RES · Oneway | `rod_road-card-Oneway-5` | `/nodes/72/card/items/6` | 84167–84185 |
| ROD/RES · Enter | `rod_road-card-Enter-6` | `/nodes/72/card/items/7` | 84186–84204 |
| ROD/RES · Exit | `rod_road-card-Exit-7` | `/nodes/72/card/items/8` | 84205–84223 |
| ROD/RES · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/72/card/items/9` | 84224–84242 |
| ROD/RES · Speed | `rod_road-card-Speed-9` | `/nodes/72/card/items/10` | 84243–84258 |
| ROD/RES · Situation | `rod_road-card-Situation-10` | `/nodes/72/card/items/11` | 84259–84274 |
| ROD/RES · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/72/card/items/12` | 84275–84294 |
| ROD/RES · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/72/card/items/13` | 84295–84310 |
| ROD/RES · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/72/card/items/14` | 84311–84329 |
| ROD/RES · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/72/card/items/15` | 84330–84348 |
| ROD/RES · Mode | `rod_road-card-Mode-2` | `/nodes/72/card/items/16` | 84349–84367 |
| ROD/RES · CreateTime | `ROD-CreateTime-meta` | `/nodes/72/card/items/17` | 84368–84384 |
| ROD/RES · CreateBy | `ROD-CreateBy-meta` | `/nodes/72/card/items/18` | 84385–84401 |
| ROD/RES · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/72/card/items/19` | 84402–84418 |
| ROD/RES · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/72/card/items/20` | 84419–84435 |
| ROD/SVS · Class | `ROD-classification-card` | `/nodes/73/card/items/0` | 85733–85750 |
| ROD/SVS · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/73/card/items/1` | 85751–85766 |
| ROD/SVS · tags.Land | `rod_road-card-Land-1` | `/nodes/73/card/items/2` | 85767–85782 |
| ROD/SVS · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/73/card/items/3` | 85783–85798 |
| ROD/SVS · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/73/card/items/4` | 85799–85814 |
| ROD/SVS · Level | `rod_road-card-Level-4` | `/nodes/73/card/items/5` | 85815–85830 |
| ROD/SVS · Oneway | `rod_road-card-Oneway-5` | `/nodes/73/card/items/6` | 85831–85849 |
| ROD/SVS · Enter | `rod_road-card-Enter-6` | `/nodes/73/card/items/7` | 85850–85868 |
| ROD/SVS · Exit | `rod_road-card-Exit-7` | `/nodes/73/card/items/8` | 85869–85887 |
| ROD/SVS · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/73/card/items/9` | 85888–85906 |
| ROD/SVS · Speed | `rod_road-card-Speed-9` | `/nodes/73/card/items/10` | 85907–85922 |
| ROD/SVS · Situation | `rod_road-card-Situation-10` | `/nodes/73/card/items/11` | 85923–85938 |
| ROD/SVS · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/73/card/items/12` | 85939–85958 |
| ROD/SVS · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/73/card/items/13` | 85959–85974 |
| ROD/SVS · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/73/card/items/14` | 85975–85993 |
| ROD/SVS · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/73/card/items/15` | 85994–86012 |
| ROD/SVS · Mode | `rod_road-card-Mode-2` | `/nodes/73/card/items/16` | 86013–86031 |
| ROD/SVS · CreateTime | `ROD-CreateTime-meta` | `/nodes/73/card/items/17` | 86032–86048 |
| ROD/SVS · CreateBy | `ROD-CreateBy-meta` | `/nodes/73/card/items/18` | 86049–86065 |
| ROD/SVS · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/73/card/items/19` | 86066–86082 |
| ROD/SVS · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/73/card/items/20` | 86083–86099 |
| ROD/IDR · Class | `ROD-classification-card` | `/nodes/74/card/items/0` | 87397–87414 |
| ROD/IDR · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/74/card/items/1` | 87415–87430 |
| ROD/IDR · tags.Land | `rod_road-card-Land-1` | `/nodes/74/card/items/2` | 87431–87446 |
| ROD/IDR · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/74/card/items/3` | 87447–87462 |
| ROD/IDR · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/74/card/items/4` | 87463–87478 |
| ROD/IDR · Level | `rod_road-card-Level-4` | `/nodes/74/card/items/5` | 87479–87494 |
| ROD/IDR · Oneway | `rod_road-card-Oneway-5` | `/nodes/74/card/items/6` | 87495–87513 |
| ROD/IDR · Enter | `rod_road-card-Enter-6` | `/nodes/74/card/items/7` | 87514–87532 |
| ROD/IDR · Exit | `rod_road-card-Exit-7` | `/nodes/74/card/items/8` | 87533–87551 |
| ROD/IDR · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/74/card/items/9` | 87552–87570 |
| ROD/IDR · Speed | `rod_road-card-Speed-9` | `/nodes/74/card/items/10` | 87571–87586 |
| ROD/IDR · Situation | `rod_road-card-Situation-10` | `/nodes/74/card/items/11` | 87587–87602 |
| ROD/IDR · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/74/card/items/12` | 87603–87622 |
| ROD/IDR · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/74/card/items/13` | 87623–87638 |
| ROD/IDR · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/74/card/items/14` | 87639–87657 |
| ROD/IDR · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/74/card/items/15` | 87658–87676 |
| ROD/IDR · Mode | `rod_road-card-Mode-2` | `/nodes/74/card/items/16` | 87677–87695 |
| ROD/IDR · CreateTime | `ROD-CreateTime-meta` | `/nodes/74/card/items/17` | 87696–87712 |
| ROD/IDR · CreateBy | `ROD-CreateBy-meta` | `/nodes/74/card/items/18` | 87713–87729 |
| ROD/IDR · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/74/card/items/19` | 87730–87746 |
| ROD/IDR · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/74/card/items/20` | 87747–87763 |
| ROD/SPE · Class | `ROD-classification-card` | `/nodes/75/card/items/0` | 89061–89078 |
| ROD/SPE · tags.nomenclator | `rod_road-card-nomenclator-0` | `/nodes/75/card/items/1` | 89079–89094 |
| ROD/SPE · tags.Land | `rod_road-card-Land-1` | `/nodes/75/card/items/2` | 89095–89110 |
| ROD/SPE · tags.UAdm | `rod_road-card-UAdm-2` | `/nodes/75/card/items/3` | 89111–89126 |
| ROD/SPE · tags.UAdmG | `rod_road-card-UAdmG-3` | `/nodes/75/card/items/4` | 89127–89142 |
| ROD/SPE · Level | `rod_road-card-Level-4` | `/nodes/75/card/items/5` | 89143–89158 |
| ROD/SPE · Oneway | `rod_road-card-Oneway-5` | `/nodes/75/card/items/6` | 89159–89177 |
| ROD/SPE · Enter | `rod_road-card-Enter-6` | `/nodes/75/card/items/7` | 89178–89196 |
| ROD/SPE · Exit | `rod_road-card-Exit-7` | `/nodes/75/card/items/8` | 89197–89215 |
| ROD/SPE · SelfJunction | `rod_road-card-SelfJunction-8` | `/nodes/75/card/items/9` | 89216–89234 |
| ROD/SPE · Speed | `rod_road-card-Speed-9` | `/nodes/75/card/items/10` | 89235–89250 |
| ROD/SPE · Situation | `rod_road-card-Situation-10` | `/nodes/75/card/items/11` | 89251–89266 |
| ROD/SPE · extensions.link.wiki | `rod_road-card-wiki-11` | `/nodes/75/card/items/12` | 89267–89286 |
| ROD/SPE · extensions.character.brief | `rod_road-card-brief-12` | `/nodes/75/card/items/13` | 89287–89302 |
| ROD/SPE · ConnectL | `rod_road-card-ConnectL-0` | `/nodes/75/card/items/14` | 89303–89321 |
| ROD/SPE · Blacklist | `rod_road-card-Blacklist-1` | `/nodes/75/card/items/15` | 89322–89340 |
| ROD/SPE · Mode | `rod_road-card-Mode-2` | `/nodes/75/card/items/16` | 89341–89359 |
| ROD/SPE · CreateTime | `ROD-CreateTime-meta` | `/nodes/75/card/items/17` | 89360–89376 |
| ROD/SPE · CreateBy | `ROD-CreateBy-meta` | `/nodes/75/card/items/18` | 89377–89393 |
| ROD/SPE · ModifityTime | `ROD-ModifityTime-meta` | `/nodes/75/card/items/19` | 89394–89410 |
| ROD/SPE · ModifityBy | `ROD-ModifityBy-meta` | `/nodes/75/card/items/20` | 89411–89427 |
| SBP · Class | `SBP-classification-card` | `/nodes/76/card/items/0` | 90543–90556 |
| SBP · elevation | `rail_station_building_point-card-elevation-0` | `/nodes/76/card/items/1` | 90557–90578 |
| SBP · extensions.link.wiki | `rail_station_building_point-card-wiki-1` | `/nodes/76/card/items/2` | 90579–90604 |
| SBP · extensions.character.brief | `rail_station_building_point-card-brief-2` | `/nodes/76/card/items/3` | 90605–90626 |
| SBP · Floors | `rail_station_building_point-card-Floors-0` | `/nodes/76/card/items/4` | 90627–90651 |
| SBP · stations | `rail_station_building_point-card-stations-1` | `/nodes/76/card/items/5` | 90652–90676 |
| SBP · CreateTime | `SBP-CreateTime-meta` | `/nodes/76/card/items/6` | 90677–90689 |
| SBP · CreateBy | `SBP-CreateBy-meta` | `/nodes/76/card/items/7` | 90690–90702 |
| SBP · ModifityTime | `SBP-ModifityTime-meta` | `/nodes/76/card/items/8` | 90703–90715 |
| SBP · ModifityBy | `SBP-ModifityBy-meta` | `/nodes/76/card/items/9` | 90716–90728 |
| STA · Class | `STA-classification-card` | `/nodes/77/card/items/0` | 91585–91598 |
| STA · STBuilding | `rail_station-card-STBuilding-0` | `/nodes/77/card/items/1` | 91599–91630 |
| STA · ID | `sta-card-line-chips` | `/nodes/77/card/items/2` | 91631–91645 |
| STA · elevation | `rail_station-card-elevation-1` | `/nodes/77/card/items/3` | 91646–91667 |
| STA · extensions.link.wiki | `rail_station-card-wiki-2` | `/nodes/77/card/items/4` | 91668–91693 |
| STA · extensions.character.brief | `rail_station-card-brief-3` | `/nodes/77/card/items/5` | 91694–91715 |
| STA · platforms | `rail_station-card-platforms-0` | `/nodes/77/card/items/6` | 91716–91740 |
| STA · CreateTime | `STA-CreateTime-meta` | `/nodes/77/card/items/7` | 91741–91753 |
| STA · CreateBy | `STA-CreateBy-meta` | `/nodes/77/card/items/8` | 91754–91766 |
| STA · ModifityTime | `STA-ModifityTime-meta` | `/nodes/77/card/items/9` | 91767–91779 |
| STA · ModifityBy | `STA-ModifityBy-meta` | `/nodes/77/card/items/10` | 91780–91792 |
| STB · Class | `STB-classification-card` | `/nodes/78/card/items/0` | 92665–92678 |
| STB · height | `STB-height-enhancement` | `/nodes/78/card/items/1` | 92679–92705 |
| STB · ID | `stb-card-line-chips` | `/nodes/78/card/items/2` | 92706–92720 |
| STB · elevation | `rail_station_building-card-elevation-0` | `/nodes/78/card/items/3` | 92721–92742 |
| STB · extensions.link.wiki | `rail_station_building-card-wiki-2` | `/nodes/78/card/items/4` | 92743–92768 |
| STB · extensions.character.brief | `rail_station_building-card-brief-3` | `/nodes/78/card/items/5` | 92769–92790 |
| STB · Floors | `rail_station_building-card-Floors-0` | `/nodes/78/card/items/6` | 92791–92815 |
| STB · CreateTime | `STB-CreateTime-meta` | `/nodes/78/card/items/7` | 92816–92828 |
| STB · CreateBy | `STB-CreateBy-meta` | `/nodes/78/card/items/8` | 92829–92841 |
| STB · ModifityTime | `STB-ModifityTime-meta` | `/nodes/78/card/items/9` | 92842–92854 |
| STB · ModifityBy | `STB-ModifityBy-meta` | `/nodes/78/card/items/10` | 92855–92867 |
| STF · Class | `STF-classification-card` | `/nodes/79/card/items/0` | 93680–93693 |
| STF · staBuildingID | `rail_station_building_floor-card-staBuildingID-1` | `/nodes/79/card/items/1` | 93694–93723 |
| STF · NofFloor | `rail_station_building_floor-card-NofFloor-0` | `/nodes/79/card/items/2` | 93724–93745 |
| STF · Situation | `rail_station_building_floor-card-Situation-2` | `/nodes/79/card/items/3` | 93746–93767 |
| STF · elevation | `rail_station_building_floor-card-elevation-3` | `/nodes/79/card/items/4` | 93768–93789 |
| STF · height | `rail_station_building_floor-card-height-4` | `/nodes/79/card/items/5` | 93790–93811 |
| STF · extensions.link.wiki | `rail_station_building_floor-card-wiki-5` | `/nodes/79/card/items/6` | 93812–93837 |
| STF · extensions.character.brief | `rail_station_building_floor-card-brief-6` | `/nodes/79/card/items/7` | 93838–93859 |
| STF · CreateTime | `STF-CreateTime-meta` | `/nodes/79/card/items/8` | 93860–93872 |
| STF · CreateBy | `STF-CreateBy-meta` | `/nodes/79/card/items/9` | 93873–93885 |
| STF · ModifityTime | `STF-ModifityTime-meta` | `/nodes/79/card/items/10` | 93886–93898 |
| STF · ModifityBy | `STF-ModifityBy-meta` | `/nodes/79/card/items/11` | 93899–93911 |
| TPP · Class | `TPP-classification-card` | `/nodes/80/card/items/0` | 94885–94898 |
| TPP · TGTWarp | `tpp_teleport-card-TGTWarp-4` | `/nodes/80/card/items/1` | 94899–94930 |
| TPP · hub | `tpp_teleport-card-hub-0` | `/nodes/80/card/items/2` | 94931–94952 |
| TPP · tags.Land | `tpp_teleport-card-Land-1` | `/nodes/80/card/items/3` | 94953–94974 |
| TPP · tags.UAdm | `tpp_teleport-card-UAdm-2` | `/nodes/80/card/items/4` | 94975–94996 |
| TPP · tags.UAdmG | `tpp_teleport-card-UAdmG-3` | `/nodes/80/card/items/5` | 94997–95018 |
| TPP · TGTcoordinate.x | `tpp_teleport-card-TGT_x-5` | `/nodes/80/card/items/6` | 95019–95040 |
| TPP · TGTcoordinate.z | `tpp_teleport-card-TGT_z-6` | `/nodes/80/card/items/7` | 95041–95062 |
| TPP · elevation | `tpp_teleport-card-elevation-7` | `/nodes/80/card/items/8` | 95063–95084 |
| TPP · TGTelevation | `tpp_teleport-card-TGTelevation-8` | `/nodes/80/card/items/9` | 95085–95106 |
| TPP · extensions.link.wiki | `tpp_teleport-card-wiki-9` | `/nodes/80/card/items/10` | 95107–95132 |
| TPP · extensions.character.brief | `tpp_teleport-card-brief-10` | `/nodes/80/card/items/11` | 95133–95154 |
| TPP · CreateTime | `TPP-CreateTime-meta` | `/nodes/80/card/items/12` | 95155–95167 |
| TPP · CreateBy | `TPP-CreateBy-meta` | `/nodes/80/card/items/13` | 95168–95180 |
| TPP · ModifityTime | `TPP-ModifityTime-meta` | `/nodes/80/card/items/14` | 95181–95193 |
| TPP · ModifityBy | `TPP-ModifityBy-meta` | `/nodes/80/card/items/15` | 95194–95206 |
| TPP/NOM · Class | `TPP-classification-card` | `/nodes/81/card/items/0` | 95912–95929 |
| TPP/NOM · TGTWarp | `tpp_teleport-card-TGTWarp-4` | `/nodes/81/card/items/1` | 95930–95955 |
| TPP/NOM · hub | `tpp_teleport-card-hub-0` | `/nodes/81/card/items/2` | 95956–95971 |
| TPP/NOM · tags.Land | `tpp_teleport-card-Land-1` | `/nodes/81/card/items/3` | 95972–95987 |
| TPP/NOM · tags.UAdm | `tpp_teleport-card-UAdm-2` | `/nodes/81/card/items/4` | 95988–96003 |
| TPP/NOM · tags.UAdmG | `tpp_teleport-card-UAdmG-3` | `/nodes/81/card/items/5` | 96004–96019 |
| TPP/NOM · TGTcoordinate.x | `tpp_teleport-card-TGT_x-5` | `/nodes/81/card/items/6` | 96020–96035 |
| TPP/NOM · TGTcoordinate.z | `tpp_teleport-card-TGT_z-6` | `/nodes/81/card/items/7` | 96036–96051 |
| TPP/NOM · elevation | `tpp_teleport-card-elevation-7` | `/nodes/81/card/items/8` | 96052–96067 |
| TPP/NOM · TGTelevation | `tpp_teleport-card-TGTelevation-8` | `/nodes/81/card/items/9` | 96068–96083 |
| TPP/NOM · extensions.link.wiki | `tpp_teleport-card-wiki-9` | `/nodes/81/card/items/10` | 96084–96103 |
| TPP/NOM · extensions.character.brief | `tpp_teleport-card-brief-10` | `/nodes/81/card/items/11` | 96104–96119 |
| TPP/NOM · CreateTime | `TPP-CreateTime-meta` | `/nodes/81/card/items/12` | 96120–96136 |
| TPP/NOM · CreateBy | `TPP-CreateBy-meta` | `/nodes/81/card/items/13` | 96137–96153 |
| TPP/NOM · ModifityTime | `TPP-ModifityTime-meta` | `/nodes/81/card/items/14` | 96154–96170 |
| TPP/NOM · ModifityBy | `TPP-ModifityBy-meta` | `/nodes/81/card/items/15` | 96171–96187 |
| TPP/SPE · Class | `TPP-classification-card` | `/nodes/82/card/items/0` | 96872–96889 |
| TPP/SPE · TGTWarp | `tpp_teleport-card-TGTWarp-4` | `/nodes/82/card/items/1` | 96890–96915 |
| TPP/SPE · hub | `tpp_teleport-card-hub-0` | `/nodes/82/card/items/2` | 96916–96931 |
| TPP/SPE · tags.Land | `tpp_teleport-card-Land-1` | `/nodes/82/card/items/3` | 96932–96947 |
| TPP/SPE · tags.UAdm | `tpp_teleport-card-UAdm-2` | `/nodes/82/card/items/4` | 96948–96963 |
| TPP/SPE · tags.UAdmG | `tpp_teleport-card-UAdmG-3` | `/nodes/82/card/items/5` | 96964–96979 |
| TPP/SPE · TGTcoordinate.x | `tpp_teleport-card-TGT_x-5` | `/nodes/82/card/items/6` | 96980–96995 |
| TPP/SPE · TGTcoordinate.z | `tpp_teleport-card-TGT_z-6` | `/nodes/82/card/items/7` | 96996–97011 |
| TPP/SPE · elevation | `tpp_teleport-card-elevation-7` | `/nodes/82/card/items/8` | 97012–97027 |
| TPP/SPE · TGTelevation | `tpp_teleport-card-TGTelevation-8` | `/nodes/82/card/items/9` | 97028–97043 |
| TPP/SPE · extensions.link.wiki | `tpp_teleport-card-wiki-9` | `/nodes/82/card/items/10` | 97044–97063 |
| TPP/SPE · extensions.character.brief | `tpp_teleport-card-brief-10` | `/nodes/82/card/items/11` | 97064–97079 |
| TPP/SPE · CreateTime | `TPP-CreateTime-meta` | `/nodes/82/card/items/12` | 97080–97096 |
| TPP/SPE · CreateBy | `TPP-CreateBy-meta` | `/nodes/82/card/items/13` | 97097–97113 |
| TPP/SPE · ModifityTime | `TPP-ModifityTime-meta` | `/nodes/82/card/items/14` | 97114–97130 |
| TPP/SPE · ModifityBy | `TPP-ModifityBy-meta` | `/nodes/82/card/items/15` | 97131–97147 |
| TPP/NOM/NOM · Class | `TPP-classification-card` | `/nodes/83/card/items/0` | 97835–97852 |
| TPP/NOM/NOM · TGTWarp | `tpp_teleport-card-TGTWarp-4` | `/nodes/83/card/items/1` | 97853–97878 |
| TPP/NOM/NOM · hub | `tpp_teleport-card-hub-0` | `/nodes/83/card/items/2` | 97879–97894 |
| TPP/NOM/NOM · tags.Land | `tpp_teleport-card-Land-1` | `/nodes/83/card/items/3` | 97895–97910 |
| TPP/NOM/NOM · tags.UAdm | `tpp_teleport-card-UAdm-2` | `/nodes/83/card/items/4` | 97911–97926 |
| TPP/NOM/NOM · tags.UAdmG | `tpp_teleport-card-UAdmG-3` | `/nodes/83/card/items/5` | 97927–97942 |
| TPP/NOM/NOM · TGTcoordinate.x | `tpp_teleport-card-TGT_x-5` | `/nodes/83/card/items/6` | 97943–97958 |
| TPP/NOM/NOM · TGTcoordinate.z | `tpp_teleport-card-TGT_z-6` | `/nodes/83/card/items/7` | 97959–97974 |
| TPP/NOM/NOM · elevation | `tpp_teleport-card-elevation-7` | `/nodes/83/card/items/8` | 97975–97990 |
| TPP/NOM/NOM · TGTelevation | `tpp_teleport-card-TGTelevation-8` | `/nodes/83/card/items/9` | 97991–98006 |
| TPP/NOM/NOM · extensions.link.wiki | `tpp_teleport-card-wiki-9` | `/nodes/83/card/items/10` | 98007–98026 |
| TPP/NOM/NOM · extensions.character.brief | `tpp_teleport-card-brief-10` | `/nodes/83/card/items/11` | 98027–98042 |
| TPP/NOM/NOM · CreateTime | `TPP-CreateTime-meta` | `/nodes/83/card/items/12` | 98043–98059 |
| TPP/NOM/NOM · CreateBy | `TPP-CreateBy-meta` | `/nodes/83/card/items/13` | 98060–98076 |
| TPP/NOM/NOM · ModifityTime | `TPP-ModifityTime-meta` | `/nodes/83/card/items/14` | 98077–98093 |
| TPP/NOM/NOM · ModifityBy | `TPP-ModifityBy-meta` | `/nodes/83/card/items/15` | 98094–98110 |
| TPP/SPE/SPE · Class | `TPP-classification-card` | `/nodes/84/card/items/0` | 98798–98815 |
| TPP/SPE/SPE · TGTWarp | `tpp_teleport-card-TGTWarp-4` | `/nodes/84/card/items/1` | 98816–98841 |
| TPP/SPE/SPE · hub | `tpp_teleport-card-hub-0` | `/nodes/84/card/items/2` | 98842–98857 |
| TPP/SPE/SPE · tags.Land | `tpp_teleport-card-Land-1` | `/nodes/84/card/items/3` | 98858–98873 |
| TPP/SPE/SPE · tags.UAdm | `tpp_teleport-card-UAdm-2` | `/nodes/84/card/items/4` | 98874–98889 |
| TPP/SPE/SPE · tags.UAdmG | `tpp_teleport-card-UAdmG-3` | `/nodes/84/card/items/5` | 98890–98905 |
| TPP/SPE/SPE · TGTcoordinate.x | `tpp_teleport-card-TGT_x-5` | `/nodes/84/card/items/6` | 98906–98921 |
| TPP/SPE/SPE · TGTcoordinate.z | `tpp_teleport-card-TGT_z-6` | `/nodes/84/card/items/7` | 98922–98937 |
| TPP/SPE/SPE · elevation | `tpp_teleport-card-elevation-7` | `/nodes/84/card/items/8` | 98938–98953 |
| TPP/SPE/SPE · TGTelevation | `tpp_teleport-card-TGTelevation-8` | `/nodes/84/card/items/9` | 98954–98969 |
| TPP/SPE/SPE · extensions.link.wiki | `tpp_teleport-card-wiki-9` | `/nodes/84/card/items/10` | 98970–98989 |
| TPP/SPE/SPE · extensions.character.brief | `tpp_teleport-card-brief-10` | `/nodes/84/card/items/11` | 98990–99005 |
| TPP/SPE/SPE · CreateTime | `TPP-CreateTime-meta` | `/nodes/84/card/items/12` | 99006–99022 |
| TPP/SPE/SPE · CreateBy | `TPP-CreateBy-meta` | `/nodes/84/card/items/13` | 99023–99039 |
| TPP/SPE/SPE · ModifityTime | `TPP-ModifityTime-meta` | `/nodes/84/card/items/14` | 99040–99056 |
| TPP/SPE/SPE · ModifityBy | `TPP-ModifityBy-meta` | `/nodes/84/card/items/15` | 99057–99073 |
| WRP · Class | `WRP-classification-card` | `/nodes/90/card/items/0` | 103964–103977 |
| WRP · WRPointI2D | `wrp_warp-card-WRPointI2D-0` | `/nodes/90/card/items/1` | 103978–103999 |
| WRP · hub | `wrp_warp-card-hub-1` | `/nodes/90/card/items/2` | 104000–104021 |
| WRP · elevation | `wrp_warp-card-elevation-2` | `/nodes/90/card/items/3` | 104022–104043 |
| WRP · tags.Land | `wrp_warp-card-Land-3` | `/nodes/90/card/items/4` | 104044–104065 |
| WRP · tags.UAdm | `wrp_warp-card-UAdm-4` | `/nodes/90/card/items/5` | 104066–104087 |
| WRP · tags.UAdmG | `wrp_warp-card-UAdmG-5` | `/nodes/90/card/items/6` | 104088–104109 |
| WRP · extensions.link.wiki | `wrp_warp-card-wiki-6` | `/nodes/90/card/items/7` | 104110–104135 |
| WRP · extensions.character.brief | `wrp_warp-card-brief-7` | `/nodes/90/card/items/8` | 104136–104157 |
| WRP · CreateTime | `WRP-CreateTime-meta` | `/nodes/90/card/items/9` | 104158–104170 |
| WRP · CreateBy | `WRP-CreateBy-meta` | `/nodes/90/card/items/10` | 104171–104183 |
| WRP · ModifityTime | `WRP-ModifityTime-meta` | `/nodes/90/card/items/11` | 104184–104196 |
| WRP · ModifityBy | `WRP-ModifityBy-meta` | `/nodes/90/card/items/12` | 104197–104209 |
| WRP/NOM · Class | `WRP-classification-card` | `/nodes/91/card/items/0` | 104864–104881 |
| WRP/NOM · WRPointI2D | `wrp_warp-card-WRPointI2D-0` | `/nodes/91/card/items/1` | 104882–104897 |
| WRP/NOM · hub | `wrp_warp-card-hub-1` | `/nodes/91/card/items/2` | 104898–104913 |
| WRP/NOM · elevation | `wrp_warp-card-elevation-2` | `/nodes/91/card/items/3` | 104914–104929 |
| WRP/NOM · tags.Land | `wrp_warp-card-Land-3` | `/nodes/91/card/items/4` | 104930–104945 |
| WRP/NOM · tags.UAdm | `wrp_warp-card-UAdm-4` | `/nodes/91/card/items/5` | 104946–104961 |
| WRP/NOM · tags.UAdmG | `wrp_warp-card-UAdmG-5` | `/nodes/91/card/items/6` | 104962–104977 |
| WRP/NOM · extensions.link.wiki | `wrp_warp-card-wiki-6` | `/nodes/91/card/items/7` | 104978–104997 |
| WRP/NOM · extensions.character.brief | `wrp_warp-card-brief-7` | `/nodes/91/card/items/8` | 104998–105013 |
| WRP/NOM · CreateTime | `WRP-CreateTime-meta` | `/nodes/91/card/items/9` | 105014–105030 |
| WRP/NOM · CreateBy | `WRP-CreateBy-meta` | `/nodes/91/card/items/10` | 105031–105047 |
| WRP/NOM · ModifityTime | `WRP-ModifityTime-meta` | `/nodes/91/card/items/11` | 105048–105064 |
| WRP/NOM · ModifityBy | `WRP-ModifityBy-meta` | `/nodes/91/card/items/12` | 105065–105081 |
| WRP/SPE · Class | `WRP-classification-card` | `/nodes/92/card/items/0` | 105715–105732 |
| WRP/SPE · WRPointI2D | `wrp_warp-card-WRPointI2D-0` | `/nodes/92/card/items/1` | 105733–105748 |
| WRP/SPE · hub | `wrp_warp-card-hub-1` | `/nodes/92/card/items/2` | 105749–105764 |
| WRP/SPE · elevation | `wrp_warp-card-elevation-2` | `/nodes/92/card/items/3` | 105765–105780 |
| WRP/SPE · tags.Land | `wrp_warp-card-Land-3` | `/nodes/92/card/items/4` | 105781–105796 |
| WRP/SPE · tags.UAdm | `wrp_warp-card-UAdm-4` | `/nodes/92/card/items/5` | 105797–105812 |
| WRP/SPE · tags.UAdmG | `wrp_warp-card-UAdmG-5` | `/nodes/92/card/items/6` | 105813–105828 |
| WRP/SPE · extensions.link.wiki | `wrp_warp-card-wiki-6` | `/nodes/92/card/items/7` | 105829–105848 |
| WRP/SPE · extensions.character.brief | `wrp_warp-card-brief-7` | `/nodes/92/card/items/8` | 105849–105864 |
| WRP/SPE · CreateTime | `WRP-CreateTime-meta` | `/nodes/92/card/items/9` | 105865–105881 |
| WRP/SPE · CreateBy | `WRP-CreateBy-meta` | `/nodes/92/card/items/10` | 105882–105898 |
| WRP/SPE · ModifityTime | `WRP-ModifityTime-meta` | `/nodes/92/card/items/11` | 105899–105915 |
| WRP/SPE · ModifityBy | `WRP-ModifityBy-meta` | `/nodes/92/card/items/12` | 105916–105932 |
| WRP/NOM/NOM · Class | `WRP-classification-card` | `/nodes/93/card/items/0` | 106569–106586 |
| WRP/NOM/NOM · WRPointI2D | `wrp_warp-card-WRPointI2D-0` | `/nodes/93/card/items/1` | 106587–106602 |
| WRP/NOM/NOM · hub | `wrp_warp-card-hub-1` | `/nodes/93/card/items/2` | 106603–106618 |
| WRP/NOM/NOM · elevation | `wrp_warp-card-elevation-2` | `/nodes/93/card/items/3` | 106619–106634 |
| WRP/NOM/NOM · tags.Land | `wrp_warp-card-Land-3` | `/nodes/93/card/items/4` | 106635–106650 |
| WRP/NOM/NOM · tags.UAdm | `wrp_warp-card-UAdm-4` | `/nodes/93/card/items/5` | 106651–106666 |
| WRP/NOM/NOM · tags.UAdmG | `wrp_warp-card-UAdmG-5` | `/nodes/93/card/items/6` | 106667–106682 |
| WRP/NOM/NOM · extensions.link.wiki | `wrp_warp-card-wiki-6` | `/nodes/93/card/items/7` | 106683–106702 |
| WRP/NOM/NOM · extensions.character.brief | `wrp_warp-card-brief-7` | `/nodes/93/card/items/8` | 106703–106718 |
| WRP/NOM/NOM · CreateTime | `WRP-CreateTime-meta` | `/nodes/93/card/items/9` | 106719–106735 |
| WRP/NOM/NOM · CreateBy | `WRP-CreateBy-meta` | `/nodes/93/card/items/10` | 106736–106752 |
| WRP/NOM/NOM · ModifityTime | `WRP-ModifityTime-meta` | `/nodes/93/card/items/11` | 106753–106769 |
| WRP/NOM/NOM · ModifityBy | `WRP-ModifityBy-meta` | `/nodes/93/card/items/12` | 106770–106786 |
| WRP/SPE/SPE · Class | `WRP-classification-card` | `/nodes/94/card/items/0` | 107423–107440 |
| WRP/SPE/SPE · WRPointI2D | `wrp_warp-card-WRPointI2D-0` | `/nodes/94/card/items/1` | 107441–107456 |
| WRP/SPE/SPE · hub | `wrp_warp-card-hub-1` | `/nodes/94/card/items/2` | 107457–107472 |
| WRP/SPE/SPE · elevation | `wrp_warp-card-elevation-2` | `/nodes/94/card/items/3` | 107473–107488 |
| WRP/SPE/SPE · tags.Land | `wrp_warp-card-Land-3` | `/nodes/94/card/items/4` | 107489–107504 |
| WRP/SPE/SPE · tags.UAdm | `wrp_warp-card-UAdm-4` | `/nodes/94/card/items/5` | 107505–107520 |
| WRP/SPE/SPE · tags.UAdmG | `wrp_warp-card-UAdmG-5` | `/nodes/94/card/items/6` | 107521–107536 |
| WRP/SPE/SPE · extensions.link.wiki | `wrp_warp-card-wiki-6` | `/nodes/94/card/items/7` | 107537–107556 |
| WRP/SPE/SPE · extensions.character.brief | `wrp_warp-card-brief-7` | `/nodes/94/card/items/8` | 107557–107572 |
| WRP/SPE/SPE · CreateTime | `WRP-CreateTime-meta` | `/nodes/94/card/items/9` | 107573–107589 |
| WRP/SPE/SPE · CreateBy | `WRP-CreateBy-meta` | `/nodes/94/card/items/10` | 107590–107606 |
| WRP/SPE/SPE · ModifityTime | `WRP-ModifityTime-meta` | `/nodes/94/card/items/11` | 107607–107623 |
| WRP/SPE/SPE · ModifityBy | `WRP-ModifityBy-meta` | `/nodes/94/card/items/12` | 107624–107640 |

## 工作流

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 铁路一体工作流 · external | `external-railway-integrated` | `/workflows/0` | 107990–108017 |
| 车站一体工作流 · external | `external-station-integrated` | `/workflows/1` | 108018–108065 |
| 交易点一体工作流 · external | `external-trp-integrated` | `/workflows/2` | 108066–108093 |
| 自然要素-陆地 · composed | `v3-isg_ngf_lad` | `/workflows/3` | 108094–108287 |
| 自然要素-陆面要素 · composed | `v3-isg_ngf_lis` | `/workflows/4` | 108288–108549 |
| 自然要素-水域 · composed | `v3-isg_ngf_wtb` | `/workflows/5` | 108550–108743 |
| 聚落范围-确定范围 · composed | `v3-isg_adm_dbz` | `/workflows/6` | 108744–109039 |
| 聚落范围-规划范围 · composed | `v3-isg_adm_plz` | `/workflows/7` | 109040–109352 |
| 自然要素-河道 · composed | `v3-isl_ngf_wtr` | `/workflows/8` | 109353–109546 |
| 自然要素-地理边界 · composed | `v3-isl_ngf_bod` | `/workflows/9` | 109547–109808 |
| 聚落边界线要素-确定边界 · composed | `v3-isl_adm_dbl` | `/workflows/10` | 109809–110121 |
| 聚落边界线要素-规划边界 · composed | `v3-isl_adm_pll` | `/workflows/11` | 110122–110434 |
| 特定自然要素点 · composed | `v3-isp_ngf_scp` | `/workflows/12` | 110435–110730 |
| 特定人文/地标点 · composed | `v3-isp_adm_dbp` | `/workflows/13` | 110731–111026 |
| 规划/建设点 · composed | `v3-isp_adm_plp` | `/workflows/14` | 111027–111322 |
| 建筑 · composed | `v3-bud_building` | `/workflows/15` | 111323–111607 |
| 建筑楼层 · composed | `v3-flr_unit` | `/workflows/16` | 111608–111945 |
| 道路 · composed | `v3-rod_road` | `/workflows/17` | 111946–112510 |
| 传送点 · composed | `v3-tpp_teleport` | `/workflows/18` | 112511–112883 |
| Warp点 · composed | `v3-wrp_warp` | `/workflows/19` | 112884–113195 |
| 车站（专供编辑） · composed · 非便捷采集 | `v3-editor-sta` | `/workflows/20` | 113196–113371 |
| 站台（专供编辑） · composed · 非便捷采集 | `v3-editor-plf` | `/workflows/21` | 113372–113626 |
| 铁路（专供编辑） · composed · 非便捷采集 | `v3-editor-rle` | `/workflows/22` | 113627–113902 |
| 站台轮廓（专供编辑） · composed · 非便捷采集 | `v3-editor-pfb` | `/workflows/23` | 113903–114058 |
| 车站建筑（专供编辑） · composed · 非便捷采集 | `v3-editor-stb` | `/workflows/24` | 114059–114242 |
| 车站建筑点（专供编辑） · composed · 非便捷采集 | `v3-editor-sbp` | `/workflows/25` | 114243–114446 |
| 车站建筑楼层（专供编辑） · composed · 非便捷采集 | `v3-editor-stf` | `/workflows/26` | 114447–114634 |
| 交易点（专供编辑） · external · 非便捷采集 | `v3-editor-trp-external` | `/workflows/27` | 114635–114666 |

## 工作流页

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| v3-isg_ngf_lad · actor · 填写人 | `isg_ngf_lad-actor` | `/workflows/3/steps/0` | 108107–108114 |
| v3-isg_ngf_lad · form · 基本信息 | `isg_ngf_lad-form` | `/workflows/3/steps/1` | 108115–108217 |
| v3-isg_ngf_lad · geometry · 绘制 | `isg_ngf_lad-geometry` | `/workflows/3/steps/2` | 108218–108236 |
| v3-isg_ngf_lis · actor · 填写人 | `isg_ngf_lis-actor` | `/workflows/4/steps/0` | 108301–108308 |
| v3-isg_ngf_lis · form · 基本信息 | `isg_ngf_lis-form` | `/workflows/4/steps/1` | 108309–108469 |
| v3-isg_ngf_lis · geometry · 绘制 | `isg_ngf_lis-geometry` | `/workflows/4/steps/2` | 108470–108488 |
| v3-isg_ngf_wtb · actor · 填写人 | `isg_ngf_wtb-actor` | `/workflows/5/steps/0` | 108563–108570 |
| v3-isg_ngf_wtb · form · 基本信息 | `isg_ngf_wtb-form` | `/workflows/5/steps/1` | 108571–108673 |
| v3-isg_ngf_wtb · geometry · 绘制 | `isg_ngf_wtb-geometry` | `/workflows/5/steps/2` | 108674–108692 |
| v3-isg_adm_dbz · actor · 填写人 | `isg_adm_dbz-actor` | `/workflows/6/steps/0` | 108757–108764 |
| v3-isg_adm_dbz · form · 基本信息 | `isg_adm_dbz-form` | `/workflows/6/steps/1` | 108765–108949 |
| v3-isg_adm_dbz · geometry · 绘制 | `isg_adm_dbz-geometry` | `/workflows/6/steps/2` | 108950–108968 |
| v3-isg_adm_plz · actor · 填写人 | `isg_adm_plz-actor` | `/workflows/7/steps/0` | 109053–109060 |
| v3-isg_adm_plz · form · 基本信息 | `isg_adm_plz-form` | `/workflows/7/steps/1` | 109061–109257 |
| v3-isg_adm_plz · geometry · 绘制 | `isg_adm_plz-geometry` | `/workflows/7/steps/2` | 109258–109276 |
| v3-isl_ngf_wtr · actor · 填写人 | `isl_ngf_wtr-actor` | `/workflows/8/steps/0` | 109366–109373 |
| v3-isl_ngf_wtr · form · 基本信息 | `isl_ngf_wtr-form` | `/workflows/8/steps/1` | 109374–109476 |
| v3-isl_ngf_wtr · geometry · 绘制 | `isl_ngf_wtr-geometry` | `/workflows/8/steps/2` | 109477–109495 |
| v3-isl_ngf_bod · actor · 填写人 | `isl_ngf_bod-actor` | `/workflows/9/steps/0` | 109560–109567 |
| v3-isl_ngf_bod · form · 基本信息 | `isl_ngf_bod-form` | `/workflows/9/steps/1` | 109568–109728 |
| v3-isl_ngf_bod · geometry · 绘制 | `isl_ngf_bod-geometry` | `/workflows/9/steps/2` | 109729–109747 |
| v3-isl_adm_dbl · actor · 填写人 | `isl_adm_dbl-actor` | `/workflows/10/steps/0` | 109822–109829 |
| v3-isl_adm_dbl · form · 基本信息 | `isl_adm_dbl-form` | `/workflows/10/steps/1` | 109830–110031 |
| v3-isl_adm_dbl · geometry · 绘制 | `isl_adm_dbl-geometry` | `/workflows/10/steps/2` | 110032–110050 |
| v3-isl_adm_pll · actor · 填写人 | `isl_adm_pll-actor` | `/workflows/11/steps/0` | 110135–110142 |
| v3-isl_adm_pll · form · 基本信息 | `isl_adm_pll-form` | `/workflows/11/steps/1` | 110143–110344 |
| v3-isl_adm_pll · geometry · 绘制 | `isl_adm_pll-geometry` | `/workflows/11/steps/2` | 110345–110363 |
| v3-isp_ngf_scp · actor · 填写人 | `isp_ngf_scp-actor` | `/workflows/12/steps/0` | 110448–110455 |
| v3-isp_ngf_scp · form · 基本信息 | `isp_ngf_scp-form` | `/workflows/12/steps/1` | 110456–110640 |
| v3-isp_ngf_scp · geometry · 绘制 | `isp_ngf_scp-geometry` | `/workflows/12/steps/2` | 110641–110659 |
| v3-isp_adm_dbp · actor · 填写人 | `isp_adm_dbp-actor` | `/workflows/13/steps/0` | 110744–110751 |
| v3-isp_adm_dbp · form · 基本信息 | `isp_adm_dbp-form` | `/workflows/13/steps/1` | 110752–110936 |
| v3-isp_adm_dbp · geometry · 绘制 | `isp_adm_dbp-geometry` | `/workflows/13/steps/2` | 110937–110955 |
| v3-isp_adm_plp · actor · 填写人 | `isp_adm_plp-actor` | `/workflows/14/steps/0` | 111040–111047 |
| v3-isp_adm_plp · form · 基本信息 | `isp_adm_plp-form` | `/workflows/14/steps/1` | 111048–111232 |
| v3-isp_adm_plp · geometry · 绘制 | `isp_adm_plp-geometry` | `/workflows/14/steps/2` | 111233–111251 |
| v3-bud_building · actor · 填写人 | `bud_building-actor` | `/workflows/15/steps/0` | 111334–111341 |
| v3-bud_building · form · 基本信息 | `bud_building-form` | `/workflows/15/steps/1` | 111342–111524 |
| v3-bud_building · geometry · 绘制 | `bud_building-geometry` | `/workflows/15/steps/2` | 111525–111543 |
| v3-flr_unit · actor · 填写人 | `flr_unit-actor` | `/workflows/16/steps/0` | 111619–111626 |
| v3-flr_unit · form · 基本信息 | `flr_unit-form` | `/workflows/16/steps/1` | 111627–111852 |
| v3-flr_unit · geometry · 绘制 | `flr_unit-geometry` | `/workflows/16/steps/2` | 111853–111871 |
| v3-rod_road · actor · 填写人 | `rod_road-actor` | `/workflows/17/steps/0` | 111957–111964 |
| v3-rod_road · form · 基本信息 | `rod_road-form` | `/workflows/17/steps/1` | 111965–112382 |
| v3-rod_road · geometry · 绘制 | `rod_road-geometry` | `/workflows/17/steps/2` | 112383–112401 |
| v3-tpp_teleport · actor · 填写人 | `tpp_teleport-actor` | `/workflows/18/steps/0` | 112522–112529 |
| v3-tpp_teleport · form · 基本信息 | `tpp_teleport-form` | `/workflows/18/steps/1` | 112530–112733 |
| v3-tpp_teleport · geometry · 起点坐标 | `tpp_teleport-geometry` | `/workflows/18/steps/2` | 112734–112773 |
| v3-tpp_teleport · geometry · 目标点坐标 | `extra-tpp_teleport-target-point` | `/workflows/18/steps/3` | 112774–112822 |
| v3-wrp_warp · actor · 填写人 | `wrp_warp-actor` | `/workflows/19/steps/0` | 112895–112902 |
| v3-wrp_warp · form · 基本信息 | `wrp_warp-form` | `/workflows/19/steps/1` | 112903–113091 |
| v3-wrp_warp · geometry · 绘制 | `wrp_warp-geometry` | `/workflows/19/steps/2` | 113092–113131 |
| v3-editor-sta · actor · 填写人 | `edit-STA-actor` | `/workflows/20/steps/0` | 113218–113225 |
| v3-editor-sta · form · 编辑信息 | `edit-STA-form` | `/workflows/20/steps/1` | 113226–113313 |
| v3-editor-sta · geometry · 编辑几何 | `edit-STA-geometry` | `/workflows/20/steps/2` | 113314–113331 |
| v3-editor-plf · actor · 填写人 | `edit-PLF-actor` | `/workflows/21/steps/0` | 113394–113401 |
| v3-editor-plf · form · 编辑信息 | `edit-PLF-form` | `/workflows/21/steps/1` | 113402–113563 |
| v3-editor-plf · geometry · 编辑几何 | `edit-PLF-geometry` | `/workflows/21/steps/2` | 113564–113581 |
| v3-editor-rle · actor · 填写人 | `edit-RLE-actor` | `/workflows/22/steps/0` | 113649–113656 |
| v3-editor-rle · form · 编辑信息 | `edit-RLE-form` | `/workflows/22/steps/1` | 113657–113829 |
| v3-editor-rle · geometry · 编辑几何 | `edit-RLE-geometry` | `/workflows/22/steps/2` | 113830–113847 |
| v3-editor-pfb · actor · 填写人 | `edit-PFB-actor` | `/workflows/23/steps/0` | 113925–113932 |
| v3-editor-pfb · form · 编辑信息 | `edit-PFB-form` | `/workflows/23/steps/1` | 113933–114000 |
| v3-editor-pfb · geometry · 编辑几何 | `edit-PFB-geometry` | `/workflows/23/steps/2` | 114001–114018 |
| v3-editor-stb · actor · 填写人 | `edit-STB-actor` | `/workflows/24/steps/0` | 114081–114088 |
| v3-editor-stb · form · 编辑信息 | `edit-STB-form` | `/workflows/24/steps/1` | 114089–114184 |
| v3-editor-stb · geometry · 编辑几何 | `edit-STB-geometry` | `/workflows/24/steps/2` | 114185–114202 |
| v3-editor-sbp · actor · 填写人 | `edit-SBP-actor` | `/workflows/25/steps/0` | 114265–114272 |
| v3-editor-sbp · form · 编辑信息 | `edit-SBP-form` | `/workflows/25/steps/1` | 114273–114388 |
| v3-editor-sbp · geometry · 编辑几何 | `edit-SBP-geometry` | `/workflows/25/steps/2` | 114389–114406 |
| v3-editor-stf · actor · 填写人 | `edit-STF-actor` | `/workflows/26/steps/0` | 114469–114476 |
| v3-editor-stf · form · 编辑信息 | `edit-STF-form` | `/workflows/26/steps/1` | 114477–114566 |
| v3-editor-stf · geometry · 编辑几何 | `edit-STF-geometry` | `/workflows/26/steps/2` | 114567–114584 |

## 控件

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| v3-isg_ngf_lad · 无槽位 · 类型（Kind=NGF, SKind=LAD） | `isg_ngf_lad-classification` | `/workflows/3/steps/1/controls/0` | 108123–108139 |
| v3-isg_ngf_lad · A · 名称 | `isg_ngf_lad-Name-A` | `/workflows/3/steps/1/controls/1` | 108140–108151 |
| v3-isg_ngf_lad · E · 字符简称（用于ID） | `isg_ngf_lad-abbr-E` | `/workflows/3/steps/1/controls/2` | 108152–108164 |
| v3-isg_ngf_lad · B · 命名者（tags.nomenclator，可选） | `isg_ngf_lad-nomenclator-B` | `/workflows/3/steps/1/controls/3` | 108165–108176 |
| v3-isg_ngf_lad · C · wiki链接（可选，将写入 extensions.link.wiki） | `isg_ngf_lad-wiki-C` | `/workflows/3/steps/1/controls/4` | 108177–108188 |
| v3-isg_ngf_lad · D · 简介（可选，将写入 extensions.character.brief） | `isg_ngf_lad-brief-D` | `/workflows/3/steps/1/controls/5` | 108189–108201 |
| v3-isg_ngf_lad · 无槽位 · 标签与扩展 | `isg_ngf_lad-tail` | `/workflows/3/steps/1/controls/6` | 108202–108215 |
| v3-isg_ngf_lis · 无槽位 · 类型（Kind=NGF, SKind=LIS） | `isg_ngf_lis-classification` | `/workflows/4/steps/1/controls/0` | 108317–108333 |
| v3-isg_ngf_lis · A · 名称 | `isg_ngf_lis-Name-A` | `/workflows/4/steps/1/controls/1` | 108334–108345 |
| v3-isg_ngf_lis · G · 字符简称（用于ID） | `isg_ngf_lis-abbr-G` | `/workflows/4/steps/1/controls/2` | 108346–108358 |
| v3-isg_ngf_lis · B · 命名者（tags.nomenclator，可选） | `isg_ngf_lis-nomenclator-B` | `/workflows/4/steps/1/controls/3` | 108359–108370 |
| v3-isg_ngf_lis · C · 所属地理单元（可选，将写入 tags.Land） | `isg_ngf_lis-Land-C` | `/workflows/4/steps/1/controls/4` | 108371–108399 |
| v3-isg_ngf_lis · D · 所属聚落(一级)（可选，将写入 tags.Adm） | `isg_ngf_lis-Adm-D` | `/workflows/4/steps/1/controls/5` | 108400–108428 |
| v3-isg_ngf_lis · E · wiki链接（可选，将写入 extensions.link.wiki） | `isg_ngf_lis-wiki-E` | `/workflows/4/steps/1/controls/6` | 108429–108440 |
| v3-isg_ngf_lis · F · 简介（可选，将写入 extensions.character.brief） | `isg_ngf_lis-brief-F` | `/workflows/4/steps/1/controls/7` | 108441–108453 |
| v3-isg_ngf_lis · 无槽位 · 标签与扩展 | `isg_ngf_lis-tail` | `/workflows/4/steps/1/controls/8` | 108454–108467 |
| v3-isg_ngf_wtb · 无槽位 · 类型（Kind=NGF, SKind=WTB） | `isg_ngf_wtb-classification` | `/workflows/5/steps/1/controls/0` | 108579–108595 |
| v3-isg_ngf_wtb · A · 名称 | `isg_ngf_wtb-Name-A` | `/workflows/5/steps/1/controls/1` | 108596–108607 |
| v3-isg_ngf_wtb · E · 字符简称（用于ID） | `isg_ngf_wtb-abbr-E` | `/workflows/5/steps/1/controls/2` | 108608–108620 |
| v3-isg_ngf_wtb · B · 命名者（tags.nomenclator，可选） | `isg_ngf_wtb-nomenclator-B` | `/workflows/5/steps/1/controls/3` | 108621–108632 |
| v3-isg_ngf_wtb · C · wiki链接（可选，将写入 extensions.link.wiki） | `isg_ngf_wtb-wiki-C` | `/workflows/5/steps/1/controls/4` | 108633–108644 |
| v3-isg_ngf_wtb · D · 简介（可选，将写入 extensions.character.brief） | `isg_ngf_wtb-brief-D` | `/workflows/5/steps/1/controls/5` | 108645–108657 |
| v3-isg_ngf_wtb · 无槽位 · 标签与扩展 | `isg_ngf_wtb-tail` | `/workflows/5/steps/1/controls/6` | 108658–108671 |
| v3-isg_adm_dbz · 无槽位 · 类型（Kind=ADM, SKind=DBZ） | `isg_adm_dbz-classification` | `/workflows/6/steps/1/controls/0` | 108773–108789 |
| v3-isg_adm_dbz · A · 名称 | `isg_adm_dbz-Name-A` | `/workflows/6/steps/1/controls/1` | 108790–108801 |
| v3-isg_adm_dbz · I · 字符简称（用于ID） | `isg_adm_dbz-abbr-I` | `/workflows/6/steps/1/controls/2` | 108802–108814 |
| v3-isg_adm_dbz · B · 命名者（tags.nomenclator，可选） | `isg_adm_dbz-nomenclator-B` | `/workflows/6/steps/1/controls/3` | 108815–108826 |
| v3-isg_adm_dbz · C · 所属地理单元（可选，将写入 tags.Land） | `isg_adm_dbz-Land-C` | `/workflows/6/steps/1/controls/4` | 108827–108855 |
| v3-isg_adm_dbz · D · 所属上级要素（可选，将写入 tags.UAdm） | `isg_adm_dbz-UAdm-D` | `/workflows/6/steps/1/controls/5` | 108856–108884 |
| v3-isg_adm_dbz · E · 相关人员（可选，将写入 tags.Pop） | `isg_adm_dbz-Pop-E` | `/workflows/6/steps/1/controls/6` | 108885–108896 |
| v3-isg_adm_dbz · F · 所属聚落群(名称)（可选，将写入 tags.GAdm） | `isg_adm_dbz-GAdm-F` | `/workflows/6/steps/1/controls/7` | 108897–108908 |
| v3-isg_adm_dbz · G · wiki链接（可选，将写入 extensions.link.wiki） | `isg_adm_dbz-wiki-G` | `/workflows/6/steps/1/controls/8` | 108909–108920 |
| v3-isg_adm_dbz · H · 简介（可选，将写入 extensions.character.brief） | `isg_adm_dbz-brief-H` | `/workflows/6/steps/1/controls/9` | 108921–108933 |
| v3-isg_adm_dbz · 无槽位 · 标签与扩展 | `isg_adm_dbz-tail` | `/workflows/6/steps/1/controls/10` | 108934–108947 |
| v3-isg_adm_plz · 无槽位 · 类型（Kind=ADM, SKind=PLZ） | `isg_adm_plz-classification` | `/workflows/7/steps/1/controls/0` | 109069–109085 |
| v3-isg_adm_plz · A · 名称 | `isg_adm_plz-Name-A` | `/workflows/7/steps/1/controls/1` | 109086–109097 |
| v3-isg_adm_plz · J · 字符简称（用于ID） | `isg_adm_plz-abbr-J` | `/workflows/7/steps/1/controls/2` | 109098–109110 |
| v3-isg_adm_plz · B · 命名者（tags.nomenclator，可选） | `isg_adm_plz-nomenclator-B` | `/workflows/7/steps/1/controls/3` | 109111–109122 |
| v3-isg_adm_plz · C · 所属地理单元（可选，将写入 tags.Land） | `isg_adm_plz-Land-C` | `/workflows/7/steps/1/controls/4` | 109123–109151 |
| v3-isg_adm_plz · D · 所属上级要素（可选，将写入 tags.UAdm） | `isg_adm_plz-UAdm-D` | `/workflows/7/steps/1/controls/5` | 109152–109180 |
| v3-isg_adm_plz · E · 负责人员（可选，将写入 tags.Pop） | `isg_adm_plz-Pop-E` | `/workflows/7/steps/1/controls/6` | 109181–109192 |
| v3-isg_adm_plz · F · 所属聚落群(名称)（可选，将写入 tags.GAdm） | `isg_adm_plz-GAdm-F` | `/workflows/7/steps/1/controls/7` | 109193–109204 |
| v3-isg_adm_plz · G · 预期完成时间（可选，将写入 tags.YTime） | `isg_adm_plz-YTime-G` | `/workflows/7/steps/1/controls/8` | 109205–109216 |
| v3-isg_adm_plz · H · wiki链接（可选，将写入 extensions.link.wiki） | `isg_adm_plz-wiki-H` | `/workflows/7/steps/1/controls/9` | 109217–109228 |
| v3-isg_adm_plz · I · 简介（可选，将写入 extensions.character.brief） | `isg_adm_plz-brief-I` | `/workflows/7/steps/1/controls/10` | 109229–109241 |
| v3-isg_adm_plz · 无槽位 · 标签与扩展 | `isg_adm_plz-tail` | `/workflows/7/steps/1/controls/11` | 109242–109255 |
| v3-isl_ngf_wtr · 无槽位 · 类型（Kind=NGF, SKind=WTR） | `isl_ngf_wtr-classification` | `/workflows/8/steps/1/controls/0` | 109382–109398 |
| v3-isl_ngf_wtr · A · 名称 | `isl_ngf_wtr-Name-A` | `/workflows/8/steps/1/controls/1` | 109399–109410 |
| v3-isl_ngf_wtr · E · 字符简称（用于ID） | `isl_ngf_wtr-abbr-E` | `/workflows/8/steps/1/controls/2` | 109411–109423 |
| v3-isl_ngf_wtr · B · 命名者（tags.nomenclator，可选） | `isl_ngf_wtr-nomenclator-B` | `/workflows/8/steps/1/controls/3` | 109424–109435 |
| v3-isl_ngf_wtr · C · wiki链接（可选，将写入 extensions.link.wiki） | `isl_ngf_wtr-wiki-C` | `/workflows/8/steps/1/controls/4` | 109436–109447 |
| v3-isl_ngf_wtr · D · 简介（可选，将写入 extensions.character.brief） | `isl_ngf_wtr-brief-D` | `/workflows/8/steps/1/controls/5` | 109448–109460 |
| v3-isl_ngf_wtr · 无槽位 · 标签与扩展 | `isl_ngf_wtr-tail` | `/workflows/8/steps/1/controls/6` | 109461–109474 |
| v3-isl_ngf_bod · 无槽位 · 类型（Kind=NGF, SKind=BOD） | `isl_ngf_bod-classification` | `/workflows/9/steps/1/controls/0` | 109576–109592 |
| v3-isl_ngf_bod · A · 名称 | `isl_ngf_bod-Name-A` | `/workflows/9/steps/1/controls/1` | 109593–109604 |
| v3-isl_ngf_bod · G · 字符简称（用于ID） | `isl_ngf_bod-abbr-G` | `/workflows/9/steps/1/controls/2` | 109605–109617 |
| v3-isl_ngf_bod · B · 命名者（tags.nomenclator，可选） | `isl_ngf_bod-nomenclator-B` | `/workflows/9/steps/1/controls/3` | 109618–109629 |
| v3-isl_ngf_bod · C · 边界1（可选，将写入 tags.BNgf1） | `isl_ngf_bod-BNgf1-C` | `/workflows/9/steps/1/controls/4` | 109630–109658 |
| v3-isl_ngf_bod · D · 边界2（可选，将写入 tags.BNgf2） | `isl_ngf_bod-BNgf2-D` | `/workflows/9/steps/1/controls/5` | 109659–109687 |
| v3-isl_ngf_bod · E · wiki链接（可选，将写入 extensions.link.wiki） | `isl_ngf_bod-wiki-E` | `/workflows/9/steps/1/controls/6` | 109688–109699 |
| v3-isl_ngf_bod · F · 简介（可选，将写入 extensions.character.brief） | `isl_ngf_bod-brief-F` | `/workflows/9/steps/1/controls/7` | 109700–109712 |
| v3-isl_ngf_bod · 无槽位 · 标签与扩展 | `isl_ngf_bod-tail` | `/workflows/9/steps/1/controls/8` | 109713–109726 |
| v3-isl_adm_dbl · 无槽位 · 类型（Kind=ADM 下所有线要素） | `isl_adm_dbl-classification` | `/workflows/10/steps/1/controls/0` | 109838–109854 |
| v3-isl_adm_dbl · A · 名称 | `isl_adm_dbl-Name-A` | `/workflows/10/steps/1/controls/1` | 109855–109866 |
| v3-isl_adm_dbl · I · 字符简称（用于ID） | `isl_adm_dbl-abbr-I` | `/workflows/10/steps/1/controls/2` | 109867–109879 |
| v3-isl_adm_dbl · B · 命名者（tags.nomenclator，可选） | `isl_adm_dbl-nomenclator-B` | `/workflows/10/steps/1/controls/3` | 109880–109891 |
| v3-isl_adm_dbl · C · 所属地理单元（可选，将写入 tags.Land） | `isl_adm_dbl-Land-C` | `/workflows/10/steps/1/controls/4` | 109892–109920 |
| v3-isl_adm_dbl · D · 边界1（可选，将写入 tags.BAdm1） | `isl_adm_dbl-BAdm1-D` | `/workflows/10/steps/1/controls/5` | 109921–109949 |
| v3-isl_adm_dbl · E · 边界2（可选，将写入 tags.BAdm2） | `isl_adm_dbl-BAdm2-E` | `/workflows/10/steps/1/controls/6` | 109950–109978 |
| v3-isl_adm_dbl · F · 所属聚落群(名称)（可选，将写入 tags.GAdm） | `isl_adm_dbl-GAdm-F` | `/workflows/10/steps/1/controls/7` | 109979–109990 |
| v3-isl_adm_dbl · G · wiki链接（可选，将写入 extensions.link.wiki） | `isl_adm_dbl-wiki-G` | `/workflows/10/steps/1/controls/8` | 109991–110002 |
| v3-isl_adm_dbl · H · 简介（可选，将写入 extensions.character.brief） | `isl_adm_dbl-brief-H` | `/workflows/10/steps/1/controls/9` | 110003–110015 |
| v3-isl_adm_dbl · 无槽位 · 标签与扩展 | `isl_adm_dbl-tail` | `/workflows/10/steps/1/controls/10` | 110016–110029 |
| v3-isl_adm_pll · 无槽位 · 类型（Kind=ADM 下所有线要素） | `isl_adm_pll-classification` | `/workflows/11/steps/1/controls/0` | 110151–110167 |
| v3-isl_adm_pll · A · 名称 | `isl_adm_pll-Name-A` | `/workflows/11/steps/1/controls/1` | 110168–110179 |
| v3-isl_adm_pll · I · 字符简称（用于ID） | `isl_adm_pll-abbr-I` | `/workflows/11/steps/1/controls/2` | 110180–110192 |
| v3-isl_adm_pll · B · 命名者（tags.nomenclator，可选） | `isl_adm_pll-nomenclator-B` | `/workflows/11/steps/1/controls/3` | 110193–110204 |
| v3-isl_adm_pll · C · 所属地理单元（可选，将写入 tags.Land） | `isl_adm_pll-Land-C` | `/workflows/11/steps/1/controls/4` | 110205–110233 |
| v3-isl_adm_pll · D · 边界1（可选，将写入 tags.BAdm1） | `isl_adm_pll-BAdm1-D` | `/workflows/11/steps/1/controls/5` | 110234–110262 |
| v3-isl_adm_pll · E · 边界2（可选，将写入 tags.BAdm2） | `isl_adm_pll-BAdm2-E` | `/workflows/11/steps/1/controls/6` | 110263–110291 |
| v3-isl_adm_pll · F · 所属聚落群(名称)（可选，将写入 tags.GAdm） | `isl_adm_pll-GAdm-F` | `/workflows/11/steps/1/controls/7` | 110292–110303 |
| v3-isl_adm_pll · G · wiki链接（可选，将写入 extensions.link.wiki） | `isl_adm_pll-wiki-G` | `/workflows/11/steps/1/controls/8` | 110304–110315 |
| v3-isl_adm_pll · H · 简介（可选，将写入 extensions.character.brief） | `isl_adm_pll-brief-H` | `/workflows/11/steps/1/controls/9` | 110316–110328 |
| v3-isl_adm_pll · 无槽位 · 标签与扩展 | `isl_adm_pll-tail` | `/workflows/11/steps/1/controls/10` | 110329–110342 |
| v3-isp_ngf_scp · 无槽位 · 类型（Kind=NGF 下所有点要素） | `isp_ngf_scp-classification` | `/workflows/12/steps/1/controls/0` | 110464–110480 |
| v3-isp_ngf_scp · A · 名称 | `isp_ngf_scp-Name-A` | `/workflows/12/steps/1/controls/1` | 110481–110492 |
| v3-isp_ngf_scp · I · 字符简称（用于ID） | `isp_ngf_scp-abbr-I` | `/workflows/12/steps/1/controls/2` | 110493–110505 |
| v3-isp_ngf_scp · B · 命名者（tags.nomenclator，可选） | `isp_ngf_scp-nomenclator-B` | `/workflows/12/steps/1/controls/3` | 110506–110517 |
| v3-isp_ngf_scp · C · 所属地理单元（可选，将写入 tags.Land） | `isp_ngf_scp-Land-C` | `/workflows/12/steps/1/controls/4` | 110518–110546 |
| v3-isp_ngf_scp · D · 所属上级要素（可选，将写入 tags.UAdm） | `isp_ngf_scp-UAdm-D` | `/workflows/12/steps/1/controls/5` | 110547–110575 |
| v3-isp_ngf_scp · E · 参与人员（可选，将写入 tags.Pop） | `isp_ngf_scp-Pop-E` | `/workflows/12/steps/1/controls/6` | 110576–110587 |
| v3-isp_ngf_scp · F · 事件或类型（可选，将写入 extensions.character.event） | `isp_ngf_scp-event-F` | `/workflows/12/steps/1/controls/7` | 110588–110599 |
| v3-isp_ngf_scp · G · wiki链接（可选，将写入 extensions.link.wiki） | `isp_ngf_scp-wiki-G` | `/workflows/12/steps/1/controls/8` | 110600–110611 |
| v3-isp_ngf_scp · H · 简介（可选，将写入 extensions.character.brief） | `isp_ngf_scp-brief-H` | `/workflows/12/steps/1/controls/9` | 110612–110624 |
| v3-isp_ngf_scp · 无槽位 · 标签与扩展 | `isp_ngf_scp-tail` | `/workflows/12/steps/1/controls/10` | 110625–110638 |
| v3-isp_adm_dbp · 无槽位 · 类型（Kind=ADM 下所有点要素） | `isp_adm_dbp-classification` | `/workflows/13/steps/1/controls/0` | 110760–110776 |
| v3-isp_adm_dbp · A · 名称 | `isp_adm_dbp-Name-A` | `/workflows/13/steps/1/controls/1` | 110777–110788 |
| v3-isp_adm_dbp · I · 字符简称（用于ID） | `isp_adm_dbp-abbr-I` | `/workflows/13/steps/1/controls/2` | 110789–110801 |
| v3-isp_adm_dbp · B · 命名者（tags.nomenclator，可选） | `isp_adm_dbp-nomenclator-B` | `/workflows/13/steps/1/controls/3` | 110802–110813 |
| v3-isp_adm_dbp · C · 所属地理单元（可选，将写入 tags.Land） | `isp_adm_dbp-Land-C` | `/workflows/13/steps/1/controls/4` | 110814–110842 |
| v3-isp_adm_dbp · D · 所属上级要素（可选，将写入 tags.UAdm） | `isp_adm_dbp-UAdm-D` | `/workflows/13/steps/1/controls/5` | 110843–110871 |
| v3-isp_adm_dbp · E · 参与人员（可选，将写入 tags.Pop） | `isp_adm_dbp-Pop-E` | `/workflows/13/steps/1/controls/6` | 110872–110883 |
| v3-isp_adm_dbp · F · 事件或类型（可选，将写入 extensions.character.event） | `isp_adm_dbp-event-F` | `/workflows/13/steps/1/controls/7` | 110884–110895 |
| v3-isp_adm_dbp · G · wiki链接（可选，将写入 extensions.link.wiki） | `isp_adm_dbp-wiki-G` | `/workflows/13/steps/1/controls/8` | 110896–110907 |
| v3-isp_adm_dbp · H · 简介（可选，将写入 extensions.character.brief） | `isp_adm_dbp-brief-H` | `/workflows/13/steps/1/controls/9` | 110908–110920 |
| v3-isp_adm_dbp · 无槽位 · 标签与扩展 | `isp_adm_dbp-tail` | `/workflows/13/steps/1/controls/10` | 110921–110934 |
| v3-isp_adm_plp · 无槽位 · 类型（Kind=ADM 下所有点要素） | `isp_adm_plp-classification` | `/workflows/14/steps/1/controls/0` | 111056–111072 |
| v3-isp_adm_plp · A · 名称 | `isp_adm_plp-Name-A` | `/workflows/14/steps/1/controls/1` | 111073–111084 |
| v3-isp_adm_plp · I · 字符简称（用于ID） | `isp_adm_plp-abbr-I` | `/workflows/14/steps/1/controls/2` | 111085–111097 |
| v3-isp_adm_plp · B · 命名者（tags.nomenclator，可选） | `isp_adm_plp-nomenclator-B` | `/workflows/14/steps/1/controls/3` | 111098–111109 |
| v3-isp_adm_plp · C · 所属地理单元（可选，将写入 tags.Land） | `isp_adm_plp-Land-C` | `/workflows/14/steps/1/controls/4` | 111110–111138 |
| v3-isp_adm_plp · D · 所属上级要素（可选，将写入 tags.UAdm） | `isp_adm_plp-UAdm-D` | `/workflows/14/steps/1/controls/5` | 111139–111167 |
| v3-isp_adm_plp · E · 参与人员（可选，将写入 tags.Pop） | `isp_adm_plp-Pop-E` | `/workflows/14/steps/1/controls/6` | 111168–111179 |
| v3-isp_adm_plp · F · 事件或类型（可选，将写入 extensions.character.event） | `isp_adm_plp-event-F` | `/workflows/14/steps/1/controls/7` | 111180–111191 |
| v3-isp_adm_plp · G · wiki链接（可选，将写入 extensions.link.wiki） | `isp_adm_plp-wiki-G` | `/workflows/14/steps/1/controls/8` | 111192–111203 |
| v3-isp_adm_plp · H · 简介（可选，将写入 extensions.character.brief） | `isp_adm_plp-brief-H` | `/workflows/14/steps/1/controls/9` | 111204–111216 |
| v3-isp_adm_plp · 无槽位 · 标签与扩展 | `isp_adm_plp-tail` | `/workflows/14/steps/1/controls/10` | 111217–111230 |
| v3-bud_building · 无槽位 · 类型（Class=BUD） | `bud_building-classification` | `/workflows/15/steps/1/controls/0` | 111350–111364 |
| v3-bud_building · A · 名称 | `bud_building-Name-A` | `/workflows/15/steps/1/controls/1` | 111365–111377 |
| v3-bud_building · H · 所属分类代号（仅用于ID组装，可选） | `bud_building-catAbbr-H` | `/workflows/15/steps/1/controls/2` | 111378–111389 |
| v3-bud_building · I · 字符简称（用于ID后缀） | `bud_building-abbr-I` | `/workflows/15/steps/1/controls/3` | 111390–111402 |
| v3-bud_building · B · 命名者（tags.nomenclator，可选） | `bud_building-nomenclator-B` | `/workflows/15/steps/1/controls/4` | 111403–111414 |
| v3-bud_building · C · 所属地理单元（可选，将写入 tags.Land） | `bud_building-Land-C` | `/workflows/15/steps/1/controls/5` | 111415–111443 |
| v3-bud_building · D · 所属聚落(一级)（可选，将写入 tags.Adm） | `bud_building-Adm-D` | `/workflows/15/steps/1/controls/6` | 111444–111472 |
| v3-bud_building · E · 相关成员（可选） | `bud_building-Pop-E` | `/workflows/15/steps/1/controls/7` | 111473–111483 |
| v3-bud_building · F · wiki链接（可选） | `bud_building-wiki-F` | `/workflows/15/steps/1/controls/8` | 111484–111495 |
| v3-bud_building · G · 简介（可选，将写入 extensions.character.brief） | `bud_building-brief-G` | `/workflows/15/steps/1/controls/9` | 111496–111508 |
| v3-bud_building · 无槽位 · 标签与扩展 | `bud_building-tail` | `/workflows/15/steps/1/controls/10` | 111509–111522 |
| v3-flr_unit · 无槽位 · 类型（Class=FLR） | `flr_unit-classification` | `/workflows/16/steps/1/controls/0` | 111635–111649 |
| v3-flr_unit · A · 名称 | `flr_unit-Name-A` | `/workflows/16/steps/1/controls/1` | 111650–111662 |
| v3-flr_unit · J · 所属分类代号（仅用于ID组装，可选） | `flr_unit-catAbbr-J` | `/workflows/16/steps/1/controls/2` | 111663–111674 |
| v3-flr_unit · K · 字符简称（用于ID后缀） | `flr_unit-abbr-K` | `/workflows/16/steps/1/controls/3` | 111675–111687 |
| v3-flr_unit · B · 命名者（tags.nomenclator，可选） | `flr_unit-nomenclator-B` | `/workflows/16/steps/1/controls/4` | 111688–111699 |
| v3-flr_unit · C · 所属建筑（BuildingID）[必填] | `flr_unit-BuildingID-C` | `/workflows/16/steps/1/controls/5` | 111700–111729 |
| v3-flr_unit · D · 楼层（NofFloor）[必填] | `flr_unit-NofFloor-D` | `/workflows/16/steps/1/controls/6` | 111730–111742 |
| v3-flr_unit · E · 所属地理单元（可选，将写入 tags.Land） | `flr_unit-Land-E` | `/workflows/16/steps/1/controls/7` | 111743–111771 |
| v3-flr_unit · F · 所属聚落(一级)（可选，将写入 tags.Adm） | `flr_unit-Adm-F` | `/workflows/16/steps/1/controls/8` | 111772–111800 |
| v3-flr_unit · G · 相关成员（可选） | `flr_unit-Pop-G` | `/workflows/16/steps/1/controls/9` | 111801–111811 |
| v3-flr_unit · H · wiki链接（可选） | `flr_unit-wiki-H` | `/workflows/16/steps/1/controls/10` | 111812–111823 |
| v3-flr_unit · I · 简介（可选，将写入 extensions.character.brief） | `flr_unit-brief-I` | `/workflows/16/steps/1/controls/11` | 111824–111836 |
| v3-flr_unit · 无槽位 · 标签与扩展 | `flr_unit-tail` | `/workflows/16/steps/1/controls/12` | 111837–111850 |
| v3-rod_road · 无槽位 · 道路类型（Class=ROD） | `rod_road-classification` | `/workflows/17/steps/1/controls/0` | 111973–111987 |
| v3-rod_road · F · 道路层级（Level，必选） | `rod_road-Level-F` | `/workflows/17/steps/1/controls/1` | 111988–111999 |
| v3-rod_road · G · 是否单向（Oneway，必选） | `rod_road-Oneway-G` | `/workflows/17/steps/1/controls/2` | 112000–112011 |
| v3-rod_road · H · 是否可进入（Enter，可选，缺省=true） | `rod_road-Enter-H` | `/workflows/17/steps/1/controls/3` | 112012–112022 |
| v3-rod_road · I · 是否可离开（Exit，可选，缺省=true） | `rod_road-Exit-I` | `/workflows/17/steps/1/controls/4` | 112023–112033 |
| v3-rod_road · J · 是否允许自交（SelfJunction，可选，缺省=false） | `rod_road-SelfJunction-J` | `/workflows/17/steps/1/controls/5` | 112034–112044 |
| v3-rod_road · A · 道路名称（Name） | `rod_road-Name-A` | `/workflows/17/steps/1/controls/6` | 112045–112057 |
| v3-rod_road · N · 所属分类代号（仅用于ID组装，可选） | `rod_road-catAbbr-N` | `/workflows/17/steps/1/controls/7` | 112058–112069 |
| v3-rod_road · O · 字符简称（用于ID末尾） | `rod_road-abbr-O` | `/workflows/17/steps/1/controls/8` | 112070–112082 |
| v3-rod_road · P · 显式连接关系（ConnectL，可选） | `rod_road-ConnectL-P` | `/workflows/17/steps/1/controls/9` | 112083–112157 |
| v3-rod_road · Q · 黑名单（Blacklist，可选） | `rod_road-Blacklist-Q` | `/workflows/17/steps/1/controls/10` | 112158–112202 |
| v3-rod_road · R · 允许的出行方式（Mode，可选） | `rod_road-Mode-R` | `/workflows/17/steps/1/controls/11` | 112203–112230 |
| v3-rod_road · K · 限速（Speed，可选，float） | `rod_road-Speed-K` | `/workflows/17/steps/1/controls/12` | 112231–112242 |
| v3-rod_road · B · 命名者（tags.nomenclator，可选） | `rod_road-nomenclator-B` | `/workflows/17/steps/1/controls/13` | 112243–112254 |
| v3-rod_road · C · 所属地理单元（可选，将写入 tags.Land） | `rod_road-Land-C` | `/workflows/17/steps/1/controls/14` | 112255–112283 |
| v3-rod_road · D · 所属聚落(地标点)（可选，将写入 tags.UAdm） | `rod_road-UAdm-D` | `/workflows/17/steps/1/controls/15` | 112284–112312 |
| v3-rod_road · E · 所属聚落(区划)（可选，将写入 tags.UAdmG） | `rod_road-UAdmG-E` | `/workflows/17/steps/1/controls/16` | 112313–112341 |
| v3-rod_road · L · Wiki（可选，将写入 extensions.link.wiki） | `rod_road-wiki-L` | `/workflows/17/steps/1/controls/17` | 112342–112353 |
| v3-rod_road · M · 简介（可选，将写入 extensions.character.brief） | `rod_road-brief-M` | `/workflows/17/steps/1/controls/18` | 112354–112366 |
| v3-rod_road · 无槽位 · 标签与扩展 | `rod_road-tail` | `/workflows/17/steps/1/controls/19` | 112367–112380 |
| v3-tpp_teleport · 无槽位 · 类型（Class=TPP） | `tpp_teleport-classification` | `/workflows/18/steps/1/controls/0` | 112538–112552 |
| v3-tpp_teleport · A · 名称 | `tpp_teleport-Name-A` | `/workflows/18/steps/1/controls/1` | 112553–112565 |
| v3-tpp_teleport · H · 字符简称（用于ID） | `tpp_teleport-abbr-H` | `/workflows/18/steps/1/controls/2` | 112566–112578 |
| v3-tpp_teleport · B · 所属枢纽区（可选，将写入 hub） | `tpp_teleport-hub-B` | `/workflows/18/steps/1/controls/3` | 112579–112590 |
| v3-tpp_teleport · C · 所属地理单元（可选，将写入 tags.Land） | `tpp_teleport-Land-C` | `/workflows/18/steps/1/controls/4` | 112591–112619 |
| v3-tpp_teleport · D · 所属聚落(地标点)（可选，将写入 tags.UAdm） | `tpp_teleport-UAdm-D` | `/workflows/18/steps/1/controls/5` | 112620–112648 |
| v3-tpp_teleport · E · 所属聚落(区划)（可选，将写入 tags.UAdmG） | `tpp_teleport-UAdmG-E` | `/workflows/18/steps/1/controls/6` | 112649–112677 |
| v3-tpp_teleport · G · wiki链接（可选，将写入 extensions.link.wiki） | `tpp_teleport-wiki-G` | `/workflows/18/steps/1/controls/7` | 112678–112689 |
| v3-tpp_teleport · F · 目标Warp点(若有)（可选，将写入 TGTWarp；填写后将跳过“目标点坐标”页面） | `tpp_teleport-TGTWarp-F` | `/workflows/18/steps/1/controls/8` | 112690–112717 |
| v3-tpp_teleport · 无槽位 · 标签与扩展 | `tpp_teleport-tail` | `/workflows/18/steps/1/controls/9` | 112718–112731 |
| v3-tpp_teleport · SOURCE_ELEVATION · 起点高度(y) | `tpp_teleport-elevation` | `/workflows/18/steps/2/controls/0` | 112761–112770 |
| v3-tpp_teleport · TARGET_ELEVATION · 目标点高度(y) | `tpp_teleport-target-elevation` | `/workflows/18/steps/3/controls/0` | 112790–112799 |
| v3-wrp_warp · 无槽位 · 类别（Kind/SKind） | `wrp_warp-classification` | `/workflows/19/steps/1/controls/0` | 112911–112925 |
| v3-wrp_warp · B · Warp点名称（Name） | `wrp_warp-Name-B` | `/workflows/19/steps/1/controls/1` | 112926–112938 |
| v3-wrp_warp · H · 字符简称（用于组装 ID） | `wrp_warp-abbr-H` | `/workflows/19/steps/1/controls/2` | 112939–112951 |
| v3-wrp_warp · A · 服内Warp名（必填，将写入 WRPointI2D） | `wrp_warp-WRPointI2D-A` | `/workflows/19/steps/1/controls/3` | 112952–112964 |
| v3-wrp_warp · C · 所属枢纽区（可选，hub） | `wrp_warp-hub-C` | `/workflows/19/steps/1/controls/4` | 112965–112976 |
| v3-wrp_warp · D · 所属地理单元（可选，写入 tags.Land） | `wrp_warp-Land-D` | `/workflows/19/steps/1/controls/5` | 112977–113005 |
| v3-wrp_warp · E · 所属聚落(地标点)（可选，写入 tags.UAdm） | `wrp_warp-UAdm-E` | `/workflows/19/steps/1/controls/6` | 113006–113034 |
| v3-wrp_warp · F · 所属聚落(区划)（可选，写入 tags.UAdmG） | `wrp_warp-UAdmG-F` | `/workflows/19/steps/1/controls/7` | 113035–113063 |
| v3-wrp_warp · G · wiki链接（可选，写入 extensions.link.wiki） | `wrp_warp-wiki-G` | `/workflows/19/steps/1/controls/8` | 113064–113075 |
| v3-wrp_warp · 无槽位 · 标签与扩展 | `wrp_warp-tail` | `/workflows/19/steps/1/controls/9` | 113076–113089 |
| v3-wrp_warp · SOURCE_ELEVATION · 起点高度(y) | `wrp_warp-elevation` | `/workflows/19/steps/2/controls/0` | 113119–113128 |
| v3-editor-sta · F1 · 车站名 | `edit-STA-Name` | `/workflows/20/steps/1/controls/0` | 113234–113244 |
| v3-editor-sta · F2 · 所属车站建体 | `edit-STA-STBuilding` | `/workflows/20/steps/1/controls/1` | 113245–113255 |
| v3-editor-sta · F3 · 高度(y) | `edit-STA-elevation` | `/workflows/20/steps/1/controls/2` | 113256–113266 |
| v3-editor-sta · F4 · 包含站台 | `edit-STA-platforms` | `/workflows/20/steps/1/controls/3` | 113267–113297 |
| v3-editor-sta · 无槽位 · 标签与扩展 | `edit-STA-annotations` | `/workflows/20/steps/1/controls/4` | 113298–113311 |
| v3-editor-plf · F1 · 站台名称 | `edit-PLF-Name` | `/workflows/21/steps/1/controls/0` | 113410–113420 |
| v3-editor-plf · F2 · 高度(y) | `edit-PLF-elevation` | `/workflows/21/steps/1/controls/1` | 113421–113431 |
| v3-editor-plf · F3 · 站台是否启用 | `edit-PLF-Situation` | `/workflows/21/steps/1/controls/2` | 113432–113442 |
| v3-editor-plf · F4 · 外部连接功能 | `edit-PLF-Connect` | `/workflows/21/steps/1/controls/3` | 113443–113453 |
| v3-editor-plf · F5 · 经行线路 | `edit-PLF-lines` | `/workflows/21/steps/1/controls/4` | 113454–113547 |
| v3-editor-plf · 无槽位 · 标签与扩展 | `edit-PLF-annotations` | `/workflows/21/steps/1/controls/5` | 113548–113561 |
| v3-editor-rle · F1 · 线路名 | `edit-RLE-Name` | `/workflows/22/steps/1/controls/0` | 113665–113675 |
| v3-editor-rle · F2 · 路局代码 | `edit-RLE-bureau` | `/workflows/22/steps/1/controls/1` | 113676–113686 |
| v3-editor-rle · F3 · 线路编号 | `edit-RLE-line` | `/workflows/22/steps/1/controls/2` | 113687–113697 |
| v3-editor-rle · F4 · 标准色号 | `edit-RLE-color` | `/workflows/22/steps/1/controls/3` | 113698–113708 |
| v3-editor-rle · F5 · 方向 | `edit-RLE-direction` | `/workflows/22/steps/1/controls/4` | 113709–113791 |
| v3-editor-rle · F6 · 起点站台名 | `edit-RLE-startplf` | `/workflows/22/steps/1/controls/5` | 113792–113802 |
| v3-editor-rle · F7 · 终点站台名 | `edit-RLE-endplf` | `/workflows/22/steps/1/controls/6` | 113803–113813 |
| v3-editor-rle · 无槽位 · 标签与扩展 | `edit-RLE-annotations` | `/workflows/22/steps/1/controls/7` | 113814–113827 |
| v3-editor-pfb · F1 · 站台轮廓名 | `edit-PFB-Name` | `/workflows/23/steps/1/controls/0` | 113941–113951 |
| v3-editor-pfb · F2 · 线路ID | `edit-PFB-LineID` | `/workflows/23/steps/1/controls/1` | 113952–113962 |
| v3-editor-pfb · F3 · 高度(y) | `edit-PFB-elevation` | `/workflows/23/steps/1/controls/2` | 113963–113973 |
| v3-editor-pfb · F4 · 高度/层高(height) | `edit-PFB-height` | `/workflows/23/steps/1/controls/3` | 113974–113984 |
| v3-editor-pfb · 无槽位 · 标签与扩展 | `edit-PFB-annotations` | `/workflows/23/steps/1/controls/4` | 113985–113998 |
| v3-editor-stb · F1 · 车站建筑名 | `edit-STB-Name` | `/workflows/24/steps/1/controls/0` | 114097–114107 |
| v3-editor-stb · F2 · 高度(y) | `edit-STB-elevation` | `/workflows/24/steps/1/controls/1` | 114108–114118 |
| v3-editor-stb · F3 · 高度/层高(height) | `edit-STB-height` | `/workflows/24/steps/1/controls/2` | 114119–114129 |
| v3-editor-stb · F4 · 包含楼层 | `edit-STB-Floors` | `/workflows/24/steps/1/controls/3` | 114130–114168 |
| v3-editor-stb · 无槽位 · 标签与扩展 | `edit-STB-annotations` | `/workflows/24/steps/1/controls/4` | 114169–114182 |
| v3-editor-sbp · F1 · 车站建筑名 | `edit-SBP-Name` | `/workflows/25/steps/1/controls/0` | 114281–114291 |
| v3-editor-sbp · F2 · 高度(y) | `edit-SBP-elevation` | `/workflows/25/steps/1/controls/1` | 114292–114302 |
| v3-editor-sbp · F3 · 包含楼层 | `edit-SBP-Floors` | `/workflows/25/steps/1/controls/2` | 114303–114341 |
| v3-editor-sbp · F4 · 包含车站 | `edit-SBP-stations` | `/workflows/25/steps/1/controls/3` | 114342–114372 |
| v3-editor-sbp · 无槽位 · 标签与扩展 | `edit-SBP-annotations` | `/workflows/25/steps/1/controls/4` | 114373–114386 |
| v3-editor-stf · F1 · 楼层名 | `edit-STF-Name` | `/workflows/26/steps/1/controls/0` | 114485–114495 |
| v3-editor-stf · F2 · 楼层名/楼层号 | `edit-STF-NofFloor` | `/workflows/26/steps/1/controls/1` | 114496–114506 |
| v3-editor-stf · F3 · 所属车站建筑 | `edit-STF-staBuildingID` | `/workflows/26/steps/1/controls/2` | 114507–114517 |
| v3-editor-stf · F4 · 状态 | `edit-STF-Situation` | `/workflows/26/steps/1/controls/3` | 114518–114528 |
| v3-editor-stf · F5 · 高度(y) | `edit-STF-elevation` | `/workflows/26/steps/1/controls/4` | 114529–114539 |
| v3-editor-stf · F6 · 高度/层高(height) | `edit-STF-height` | `/workflows/26/steps/1/controls/5` | 114540–114550 |
| v3-editor-stf · 无槽位 · 标签与扩展 | `edit-STF-annotations` | `/workflows/26/steps/1/controls/6` | 114551–114564 |

## 工作流输出

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| v3-isg_ngf_lad · ISG/NGF/LAD | `isg_ngf_lad-output-1` | `/workflows/3/outputs/0` | 108239–108276 |
| v3-isg_ngf_lis · ISG/NGF/LIS | `isg_ngf_lis-output-1` | `/workflows/4/outputs/0` | 108491–108538 |
| v3-isg_ngf_wtb · ISG/NGF/WTB | `isg_ngf_wtb-output-1` | `/workflows/5/outputs/0` | 108695–108732 |
| v3-isg_adm_dbz · ISG/ADM/DBZ | `isg_adm_dbz-output-1` | `/workflows/6/outputs/0` | 108971–109028 |
| v3-isg_adm_plz · ISG/ADM/PLZ | `isg_adm_plz-output-1` | `/workflows/7/outputs/0` | 109279–109341 |
| v3-isl_ngf_wtr · ISL/NGF/WTR | `isl_ngf_wtr-output-1` | `/workflows/8/outputs/0` | 109498–109535 |
| v3-isl_ngf_bod · ISL/NGF/BOD | `isl_ngf_bod-output-1` | `/workflows/9/outputs/0` | 109750–109797 |
| v3-isl_adm_dbl · ISL/ADM/DBL | `isl_adm_dbl-output-1` | `/workflows/10/outputs/0` | 110053–110110 |
| v3-isl_adm_pll · ISL/ADM/PLL | `isl_adm_pll-output-1` | `/workflows/11/outputs/0` | 110366–110423 |
| v3-isp_ngf_scp · ISP/NGF/SCP | `isp_ngf_scp-output-1` | `/workflows/12/outputs/0` | 110662–110719 |
| v3-isp_adm_dbp · ISP/ADM/DBP | `isp_adm_dbp-output-1` | `/workflows/13/outputs/0` | 110958–111015 |
| v3-isp_adm_plp · ISP/ADM/PLP | `isp_adm_plp-output-1` | `/workflows/14/outputs/0` | 111254–111311 |
| v3-bud_building · BUD | `bud_building-output-1` | `/workflows/15/outputs/0` | 111546–111596 |
| v3-flr_unit · FLR | `flr_unit-output-1` | `/workflows/16/outputs/0` | 111874–111934 |
| v3-rod_road · ROD | `rod_road-output-1` | `/workflows/17/outputs/0` | 112404–112499 |
| v3-tpp_teleport · TPP | `tpp_teleport-output-1` | `/workflows/18/outputs/0` | 112825–112875 |
| v3-wrp_warp · WRP | `wrp_warp-output-1` | `/workflows/19/outputs/0` | 113134–113184 |
| v3-editor-sta · STA | `edit-STA-output` | `/workflows/20/outputs/0` | 113334–113369 |
| v3-editor-plf · PLF | `edit-PLF-output` | `/workflows/21/outputs/0` | 113584–113624 |
| v3-editor-rle · RLE | `edit-RLE-output` | `/workflows/22/outputs/0` | 113850–113900 |
| v3-editor-pfb · PFB | `edit-PFB-output` | `/workflows/23/outputs/0` | 114021–114056 |
| v3-editor-stb · STB | `edit-STB-output` | `/workflows/24/outputs/0` | 114205–114240 |
| v3-editor-sbp · SBP | `edit-SBP-output` | `/workflows/25/outputs/0` | 114409–114444 |
| v3-editor-stf · STF | `edit-STF-output` | `/workflows/26/outputs/0` | 114587–114632 |

## 组装赋值

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| v3-isg_ngf_lad · Name ← A | `isg_ngf_lad-assignment-Name-A` | `/workflows/3/outputs/0/assignments/0` | 108247–108251 |
| v3-isg_ngf_lad · tags.nomenclator ← B | `isg_ngf_lad-assignment-nomenclator-B` | `/workflows/3/outputs/0/assignments/1` | 108252–108256 |
| v3-isg_ngf_lad · extensions.link.wiki ← C | `isg_ngf_lad-assignment-wiki-C` | `/workflows/3/outputs/0/assignments/2` | 108257–108261 |
| v3-isg_ngf_lad · extensions.character.brief ← D | `isg_ngf_lad-assignment-brief-D` | `/workflows/3/outputs/0/assignments/3` | 108262–108266 |
| v3-isg_ngf_lad · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,E) | `isg_ngf_lad-assignment-id` | `/workflows/3/outputs/0/assignments/4` | 108267–108271 |
| v3-isg_ngf_lis · Name ← A | `isg_ngf_lis-assignment-Name-A` | `/workflows/4/outputs/0/assignments/0` | 108499–108503 |
| v3-isg_ngf_lis · tags.nomenclator ← B | `isg_ngf_lis-assignment-nomenclator-B` | `/workflows/4/outputs/0/assignments/1` | 108504–108508 |
| v3-isg_ngf_lis · tags.Land ← C | `isg_ngf_lis-assignment-Land-C` | `/workflows/4/outputs/0/assignments/2` | 108509–108513 |
| v3-isg_ngf_lis · tags.Adm ← D | `isg_ngf_lis-assignment-Adm-D` | `/workflows/4/outputs/0/assignments/3` | 108514–108518 |
| v3-isg_ngf_lis · extensions.link.wiki ← E | `isg_ngf_lis-assignment-wiki-E` | `/workflows/4/outputs/0/assignments/4` | 108519–108523 |
| v3-isg_ngf_lis · extensions.character.brief ← F | `isg_ngf_lis-assignment-brief-F` | `/workflows/4/outputs/0/assignments/5` | 108524–108528 |
| v3-isg_ngf_lis · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,G) | `isg_ngf_lis-assignment-id` | `/workflows/4/outputs/0/assignments/6` | 108529–108533 |
| v3-isg_ngf_wtb · Name ← A | `isg_ngf_wtb-assignment-Name-A` | `/workflows/5/outputs/0/assignments/0` | 108703–108707 |
| v3-isg_ngf_wtb · tags.nomenclator ← B | `isg_ngf_wtb-assignment-nomenclator-B` | `/workflows/5/outputs/0/assignments/1` | 108708–108712 |
| v3-isg_ngf_wtb · extensions.link.wiki ← C | `isg_ngf_wtb-assignment-wiki-C` | `/workflows/5/outputs/0/assignments/2` | 108713–108717 |
| v3-isg_ngf_wtb · extensions.character.brief ← D | `isg_ngf_wtb-assignment-brief-D` | `/workflows/5/outputs/0/assignments/3` | 108718–108722 |
| v3-isg_ngf_wtb · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,E) | `isg_ngf_wtb-assignment-id` | `/workflows/5/outputs/0/assignments/4` | 108723–108727 |
| v3-isg_adm_dbz · Name ← A | `isg_adm_dbz-assignment-Name-A` | `/workflows/6/outputs/0/assignments/0` | 108979–108983 |
| v3-isg_adm_dbz · tags.nomenclator ← B | `isg_adm_dbz-assignment-nomenclator-B` | `/workflows/6/outputs/0/assignments/1` | 108984–108988 |
| v3-isg_adm_dbz · tags.Land ← C | `isg_adm_dbz-assignment-Land-C` | `/workflows/6/outputs/0/assignments/2` | 108989–108993 |
| v3-isg_adm_dbz · tags.UAdm ← D | `isg_adm_dbz-assignment-UAdm-D` | `/workflows/6/outputs/0/assignments/3` | 108994–108998 |
| v3-isg_adm_dbz · tags.Pop ← E | `isg_adm_dbz-assignment-Pop-E` | `/workflows/6/outputs/0/assignments/4` | 108999–109003 |
| v3-isg_adm_dbz · tags.GAdm ← F | `isg_adm_dbz-assignment-GAdm-F` | `/workflows/6/outputs/0/assignments/5` | 109004–109008 |
| v3-isg_adm_dbz · extensions.link.wiki ← G | `isg_adm_dbz-assignment-wiki-G` | `/workflows/6/outputs/0/assignments/6` | 109009–109013 |
| v3-isg_adm_dbz · extensions.character.brief ← H | `isg_adm_dbz-assignment-brief-H` | `/workflows/6/outputs/0/assignments/7` | 109014–109018 |
| v3-isg_adm_dbz · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isg_adm_dbz-assignment-id` | `/workflows/6/outputs/0/assignments/8` | 109019–109023 |
| v3-isg_adm_plz · Name ← A | `isg_adm_plz-assignment-Name-A` | `/workflows/7/outputs/0/assignments/0` | 109287–109291 |
| v3-isg_adm_plz · tags.nomenclator ← B | `isg_adm_plz-assignment-nomenclator-B` | `/workflows/7/outputs/0/assignments/1` | 109292–109296 |
| v3-isg_adm_plz · tags.Land ← C | `isg_adm_plz-assignment-Land-C` | `/workflows/7/outputs/0/assignments/2` | 109297–109301 |
| v3-isg_adm_plz · tags.UAdm ← D | `isg_adm_plz-assignment-UAdm-D` | `/workflows/7/outputs/0/assignments/3` | 109302–109306 |
| v3-isg_adm_plz · tags.Pop ← E | `isg_adm_plz-assignment-Pop-E` | `/workflows/7/outputs/0/assignments/4` | 109307–109311 |
| v3-isg_adm_plz · tags.GAdm ← F | `isg_adm_plz-assignment-GAdm-F` | `/workflows/7/outputs/0/assignments/5` | 109312–109316 |
| v3-isg_adm_plz · tags.YTime ← G | `isg_adm_plz-assignment-YTime-G` | `/workflows/7/outputs/0/assignments/6` | 109317–109321 |
| v3-isg_adm_plz · extensions.link.wiki ← H | `isg_adm_plz-assignment-wiki-H` | `/workflows/7/outputs/0/assignments/7` | 109322–109326 |
| v3-isg_adm_plz · extensions.character.brief ← I | `isg_adm_plz-assignment-brief-I` | `/workflows/7/outputs/0/assignments/8` | 109327–109331 |
| v3-isg_adm_plz · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,J) | `isg_adm_plz-assignment-id` | `/workflows/7/outputs/0/assignments/9` | 109332–109336 |
| v3-isl_ngf_wtr · Name ← A | `isl_ngf_wtr-assignment-Name-A` | `/workflows/8/outputs/0/assignments/0` | 109506–109510 |
| v3-isl_ngf_wtr · tags.nomenclator ← B | `isl_ngf_wtr-assignment-nomenclator-B` | `/workflows/8/outputs/0/assignments/1` | 109511–109515 |
| v3-isl_ngf_wtr · extensions.link.wiki ← C | `isl_ngf_wtr-assignment-wiki-C` | `/workflows/8/outputs/0/assignments/2` | 109516–109520 |
| v3-isl_ngf_wtr · extensions.character.brief ← D | `isl_ngf_wtr-assignment-brief-D` | `/workflows/8/outputs/0/assignments/3` | 109521–109525 |
| v3-isl_ngf_wtr · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,E) | `isl_ngf_wtr-assignment-id` | `/workflows/8/outputs/0/assignments/4` | 109526–109530 |
| v3-isl_ngf_bod · Name ← A | `isl_ngf_bod-assignment-Name-A` | `/workflows/9/outputs/0/assignments/0` | 109758–109762 |
| v3-isl_ngf_bod · tags.nomenclator ← B | `isl_ngf_bod-assignment-nomenclator-B` | `/workflows/9/outputs/0/assignments/1` | 109763–109767 |
| v3-isl_ngf_bod · tags.BNgf1 ← C | `isl_ngf_bod-assignment-BNgf1-C` | `/workflows/9/outputs/0/assignments/2` | 109768–109772 |
| v3-isl_ngf_bod · tags.BNgf2 ← D | `isl_ngf_bod-assignment-BNgf2-D` | `/workflows/9/outputs/0/assignments/3` | 109773–109777 |
| v3-isl_ngf_bod · extensions.link.wiki ← E | `isl_ngf_bod-assignment-wiki-E` | `/workflows/9/outputs/0/assignments/4` | 109778–109782 |
| v3-isl_ngf_bod · extensions.character.brief ← F | `isl_ngf_bod-assignment-brief-F` | `/workflows/9/outputs/0/assignments/5` | 109783–109787 |
| v3-isl_ngf_bod · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,G) | `isl_ngf_bod-assignment-id` | `/workflows/9/outputs/0/assignments/6` | 109788–109792 |
| v3-isl_adm_dbl · Name ← A | `isl_adm_dbl-assignment-Name-A` | `/workflows/10/outputs/0/assignments/0` | 110061–110065 |
| v3-isl_adm_dbl · tags.nomenclator ← B | `isl_adm_dbl-assignment-nomenclator-B` | `/workflows/10/outputs/0/assignments/1` | 110066–110070 |
| v3-isl_adm_dbl · tags.Land ← C | `isl_adm_dbl-assignment-Land-C` | `/workflows/10/outputs/0/assignments/2` | 110071–110075 |
| v3-isl_adm_dbl · tags.BAdm1 ← D | `isl_adm_dbl-assignment-BAdm1-D` | `/workflows/10/outputs/0/assignments/3` | 110076–110080 |
| v3-isl_adm_dbl · tags.BAdm2 ← E | `isl_adm_dbl-assignment-BAdm2-E` | `/workflows/10/outputs/0/assignments/4` | 110081–110085 |
| v3-isl_adm_dbl · tags.GAdm ← F | `isl_adm_dbl-assignment-GAdm-F` | `/workflows/10/outputs/0/assignments/5` | 110086–110090 |
| v3-isl_adm_dbl · extensions.link.wiki ← G | `isl_adm_dbl-assignment-wiki-G` | `/workflows/10/outputs/0/assignments/6` | 110091–110095 |
| v3-isl_adm_dbl · extensions.character.brief ← H | `isl_adm_dbl-assignment-brief-H` | `/workflows/10/outputs/0/assignments/7` | 110096–110100 |
| v3-isl_adm_dbl · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isl_adm_dbl-assignment-id` | `/workflows/10/outputs/0/assignments/8` | 110101–110105 |
| v3-isl_adm_pll · Name ← A | `isl_adm_pll-assignment-Name-A` | `/workflows/11/outputs/0/assignments/0` | 110374–110378 |
| v3-isl_adm_pll · tags.nomenclator ← B | `isl_adm_pll-assignment-nomenclator-B` | `/workflows/11/outputs/0/assignments/1` | 110379–110383 |
| v3-isl_adm_pll · tags.Land ← C | `isl_adm_pll-assignment-Land-C` | `/workflows/11/outputs/0/assignments/2` | 110384–110388 |
| v3-isl_adm_pll · tags.BAdm1 ← D | `isl_adm_pll-assignment-BAdm1-D` | `/workflows/11/outputs/0/assignments/3` | 110389–110393 |
| v3-isl_adm_pll · tags.BAdm2 ← E | `isl_adm_pll-assignment-BAdm2-E` | `/workflows/11/outputs/0/assignments/4` | 110394–110398 |
| v3-isl_adm_pll · tags.GAdm ← F | `isl_adm_pll-assignment-GAdm-F` | `/workflows/11/outputs/0/assignments/5` | 110399–110403 |
| v3-isl_adm_pll · extensions.link.wiki ← G | `isl_adm_pll-assignment-wiki-G` | `/workflows/11/outputs/0/assignments/6` | 110404–110408 |
| v3-isl_adm_pll · extensions.character.brief ← H | `isl_adm_pll-assignment-brief-H` | `/workflows/11/outputs/0/assignments/7` | 110409–110413 |
| v3-isl_adm_pll · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isl_adm_pll-assignment-id` | `/workflows/11/outputs/0/assignments/8` | 110414–110418 |
| v3-isp_ngf_scp · Name ← A | `isp_ngf_scp-assignment-Name-A` | `/workflows/12/outputs/0/assignments/0` | 110670–110674 |
| v3-isp_ngf_scp · tags.nomenclator ← B | `isp_ngf_scp-assignment-nomenclator-B` | `/workflows/12/outputs/0/assignments/1` | 110675–110679 |
| v3-isp_ngf_scp · tags.Land ← C | `isp_ngf_scp-assignment-Land-C` | `/workflows/12/outputs/0/assignments/2` | 110680–110684 |
| v3-isp_ngf_scp · tags.UAdm ← D | `isp_ngf_scp-assignment-UAdm-D` | `/workflows/12/outputs/0/assignments/3` | 110685–110689 |
| v3-isp_ngf_scp · tags.Pop ← E | `isp_ngf_scp-assignment-Pop-E` | `/workflows/12/outputs/0/assignments/4` | 110690–110694 |
| v3-isp_ngf_scp · extensions.character.event ← F | `isp_ngf_scp-assignment-event-F` | `/workflows/12/outputs/0/assignments/5` | 110695–110699 |
| v3-isp_ngf_scp · extensions.link.wiki ← G | `isp_ngf_scp-assignment-wiki-G` | `/workflows/12/outputs/0/assignments/6` | 110700–110704 |
| v3-isp_ngf_scp · extensions.character.brief ← H | `isp_ngf_scp-assignment-brief-H` | `/workflows/12/outputs/0/assignments/7` | 110705–110709 |
| v3-isp_ngf_scp · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isp_ngf_scp-assignment-id` | `/workflows/12/outputs/0/assignments/8` | 110710–110714 |
| v3-isp_adm_dbp · Name ← A | `isp_adm_dbp-assignment-Name-A` | `/workflows/13/outputs/0/assignments/0` | 110966–110970 |
| v3-isp_adm_dbp · tags.nomenclator ← B | `isp_adm_dbp-assignment-nomenclator-B` | `/workflows/13/outputs/0/assignments/1` | 110971–110975 |
| v3-isp_adm_dbp · tags.Land ← C | `isp_adm_dbp-assignment-Land-C` | `/workflows/13/outputs/0/assignments/2` | 110976–110980 |
| v3-isp_adm_dbp · tags.UAdm ← D | `isp_adm_dbp-assignment-UAdm-D` | `/workflows/13/outputs/0/assignments/3` | 110981–110985 |
| v3-isp_adm_dbp · tags.Pop ← E | `isp_adm_dbp-assignment-Pop-E` | `/workflows/13/outputs/0/assignments/4` | 110986–110990 |
| v3-isp_adm_dbp · extensions.character.event ← F | `isp_adm_dbp-assignment-event-F` | `/workflows/13/outputs/0/assignments/5` | 110991–110995 |
| v3-isp_adm_dbp · extensions.link.wiki ← G | `isp_adm_dbp-assignment-wiki-G` | `/workflows/13/outputs/0/assignments/6` | 110996–111000 |
| v3-isp_adm_dbp · extensions.character.brief ← H | `isp_adm_dbp-assignment-brief-H` | `/workflows/13/outputs/0/assignments/7` | 111001–111005 |
| v3-isp_adm_dbp · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isp_adm_dbp-assignment-id` | `/workflows/13/outputs/0/assignments/8` | 111006–111010 |
| v3-isp_adm_plp · Name ← A | `isp_adm_plp-assignment-Name-A` | `/workflows/14/outputs/0/assignments/0` | 111262–111266 |
| v3-isp_adm_plp · tags.nomenclator ← B | `isp_adm_plp-assignment-nomenclator-B` | `/workflows/14/outputs/0/assignments/1` | 111267–111271 |
| v3-isp_adm_plp · tags.Land ← C | `isp_adm_plp-assignment-Land-C` | `/workflows/14/outputs/0/assignments/2` | 111272–111276 |
| v3-isp_adm_plp · tags.UAdm ← D | `isp_adm_plp-assignment-UAdm-D` | `/workflows/14/outputs/0/assignments/3` | 111277–111281 |
| v3-isp_adm_plp · tags.Pop ← E | `isp_adm_plp-assignment-Pop-E` | `/workflows/14/outputs/0/assignments/4` | 111282–111286 |
| v3-isp_adm_plp · extensions.character.event ← F | `isp_adm_plp-assignment-event-F` | `/workflows/14/outputs/0/assignments/5` | 111287–111291 |
| v3-isp_adm_plp · extensions.link.wiki ← G | `isp_adm_plp-assignment-wiki-G` | `/workflows/14/outputs/0/assignments/6` | 111292–111296 |
| v3-isp_adm_plp · extensions.character.brief ← H | `isp_adm_plp-assignment-brief-H` | `/workflows/14/outputs/0/assignments/7` | 111297–111301 |
| v3-isp_adm_plp · ID ← join("_",WorldPrefix+Kind+Skind+Skind2,I) | `isp_adm_plp-assignment-id` | `/workflows/14/outputs/0/assignments/8` | 111302–111306 |
| v3-bud_building · Name ← A | `bud_building-assignment-Name-A` | `/workflows/15/outputs/0/assignments/0` | 111552–111556 |
| v3-bud_building · tags.nomenclator ← B | `bud_building-assignment-nomenclator-B` | `/workflows/15/outputs/0/assignments/1` | 111557–111561 |
| v3-bud_building · tags.Land ← C | `bud_building-assignment-Land-C` | `/workflows/15/outputs/0/assignments/2` | 111562–111566 |
| v3-bud_building · tags.Adm ← D | `bud_building-assignment-Adm-D` | `/workflows/15/outputs/0/assignments/3` | 111567–111571 |
| v3-bud_building · tags.Pop ← E | `bud_building-assignment-Pop-E` | `/workflows/15/outputs/0/assignments/4` | 111572–111576 |
| v3-bud_building · extensions.link.wiki ← F | `bud_building-assignment-wiki-F` | `/workflows/15/outputs/0/assignments/5` | 111577–111581 |
| v3-bud_building · extensions.character.brief ← G | `bud_building-assignment-brief-G` | `/workflows/15/outputs/0/assignments/6` | 111582–111586 |
| v3-bud_building · ID ← join("_",WorldPrefix+Class,H,I) | `bud_building-assignment-id` | `/workflows/15/outputs/0/assignments/7` | 111587–111591 |
| v3-flr_unit · Name ← A | `flr_unit-assignment-Name-A` | `/workflows/16/outputs/0/assignments/0` | 111880–111884 |
| v3-flr_unit · tags.nomenclator ← B | `flr_unit-assignment-nomenclator-B` | `/workflows/16/outputs/0/assignments/1` | 111885–111889 |
| v3-flr_unit · BuildingID ← C | `flr_unit-assignment-BuildingID-C` | `/workflows/16/outputs/0/assignments/2` | 111890–111894 |
| v3-flr_unit · NofFloor ← D | `flr_unit-assignment-NofFloor-D` | `/workflows/16/outputs/0/assignments/3` | 111895–111899 |
| v3-flr_unit · tags.Land ← E | `flr_unit-assignment-Land-E` | `/workflows/16/outputs/0/assignments/4` | 111900–111904 |
| v3-flr_unit · tags.Adm ← F | `flr_unit-assignment-Adm-F` | `/workflows/16/outputs/0/assignments/5` | 111905–111909 |
| v3-flr_unit · tags.Pop ← G | `flr_unit-assignment-Pop-G` | `/workflows/16/outputs/0/assignments/6` | 111910–111914 |
| v3-flr_unit · extensions.link.wiki ← H | `flr_unit-assignment-wiki-H` | `/workflows/16/outputs/0/assignments/7` | 111915–111919 |
| v3-flr_unit · extensions.character.brief ← I | `flr_unit-assignment-brief-I` | `/workflows/16/outputs/0/assignments/8` | 111920–111924 |
| v3-flr_unit · ID ← join("_",WorldPrefix+Class,J,K) | `flr_unit-assignment-id` | `/workflows/16/outputs/0/assignments/9` | 111925–111929 |
| v3-rod_road · Name ← A | `rod_road-assignment-Name-A` | `/workflows/17/outputs/0/assignments/0` | 112410–112414 |
| v3-rod_road · tags.nomenclator ← B | `rod_road-assignment-nomenclator-B` | `/workflows/17/outputs/0/assignments/1` | 112415–112419 |
| v3-rod_road · tags.Land ← C | `rod_road-assignment-Land-C` | `/workflows/17/outputs/0/assignments/2` | 112420–112424 |
| v3-rod_road · tags.UAdm ← D | `rod_road-assignment-UAdm-D` | `/workflows/17/outputs/0/assignments/3` | 112425–112429 |
| v3-rod_road · tags.UAdmG ← E | `rod_road-assignment-UAdmG-E` | `/workflows/17/outputs/0/assignments/4` | 112430–112434 |
| v3-rod_road · Level ← F | `rod_road-assignment-Level-F` | `/workflows/17/outputs/0/assignments/5` | 112435–112439 |
| v3-rod_road · Oneway ← G | `rod_road-assignment-Oneway-G` | `/workflows/17/outputs/0/assignments/6` | 112440–112444 |
| v3-rod_road · Enter ← H | `rod_road-assignment-Enter-H` | `/workflows/17/outputs/0/assignments/7` | 112445–112449 |
| v3-rod_road · Exit ← I | `rod_road-assignment-Exit-I` | `/workflows/17/outputs/0/assignments/8` | 112450–112454 |
| v3-rod_road · SelfJunction ← J | `rod_road-assignment-SelfJunction-J` | `/workflows/17/outputs/0/assignments/9` | 112455–112459 |
| v3-rod_road · Speed ← K | `rod_road-assignment-Speed-K` | `/workflows/17/outputs/0/assignments/10` | 112460–112464 |
| v3-rod_road · extensions.link.wiki ← L | `rod_road-assignment-wiki-L` | `/workflows/17/outputs/0/assignments/11` | 112465–112469 |
| v3-rod_road · extensions.character.brief ← M | `rod_road-assignment-brief-M` | `/workflows/17/outputs/0/assignments/12` | 112470–112474 |
| v3-rod_road · ConnectL ← P | `rod_road-assignment-ConnectL-P` | `/workflows/17/outputs/0/assignments/13` | 112475–112479 |
| v3-rod_road · Blacklist ← Q | `rod_road-assignment-Blacklist-Q` | `/workflows/17/outputs/0/assignments/14` | 112480–112484 |
| v3-rod_road · Mode ← R | `rod_road-assignment-Mode-R` | `/workflows/17/outputs/0/assignments/15` | 112485–112489 |
| v3-rod_road · ID ← join("_",WorldPrefix+Class,N,O) | `rod_road-assignment-id` | `/workflows/17/outputs/0/assignments/16` | 112490–112494 |
| v3-tpp_teleport · Name ← A | `tpp_teleport-assignment-Name-A` | `/workflows/18/outputs/0/assignments/0` | 112831–112835 |
| v3-tpp_teleport · hub ← B | `tpp_teleport-assignment-hub-B` | `/workflows/18/outputs/0/assignments/1` | 112836–112840 |
| v3-tpp_teleport · tags.Land ← C | `tpp_teleport-assignment-Land-C` | `/workflows/18/outputs/0/assignments/2` | 112841–112845 |
| v3-tpp_teleport · tags.UAdm ← D | `tpp_teleport-assignment-UAdm-D` | `/workflows/18/outputs/0/assignments/3` | 112846–112850 |
| v3-tpp_teleport · tags.UAdmG ← E | `tpp_teleport-assignment-UAdmG-E` | `/workflows/18/outputs/0/assignments/4` | 112851–112855 |
| v3-tpp_teleport · TGTWarp ← F | `tpp_teleport-assignment-TGTWarp-F` | `/workflows/18/outputs/0/assignments/5` | 112856–112860 |
| v3-tpp_teleport · extensions.link.wiki ← G | `tpp_teleport-assignment-wiki-G` | `/workflows/18/outputs/0/assignments/6` | 112861–112865 |
| v3-tpp_teleport · ID ← join("_",WorldPrefix+Class+Kind+Skind,H) | `tpp_teleport-assignment-id` | `/workflows/18/outputs/0/assignments/7` | 112866–112870 |
| v3-wrp_warp · WRPointI2D ← A | `wrp_warp-assignment-WRPointI2D-A` | `/workflows/19/outputs/0/assignments/0` | 113140–113144 |
| v3-wrp_warp · Name ← B | `wrp_warp-assignment-Name-B` | `/workflows/19/outputs/0/assignments/1` | 113145–113149 |
| v3-wrp_warp · hub ← C | `wrp_warp-assignment-hub-C` | `/workflows/19/outputs/0/assignments/2` | 113150–113154 |
| v3-wrp_warp · tags.Land ← D | `wrp_warp-assignment-Land-D` | `/workflows/19/outputs/0/assignments/3` | 113155–113159 |
| v3-wrp_warp · tags.UAdm ← E | `wrp_warp-assignment-UAdm-E` | `/workflows/19/outputs/0/assignments/4` | 113160–113164 |
| v3-wrp_warp · tags.UAdmG ← F | `wrp_warp-assignment-UAdmG-F` | `/workflows/19/outputs/0/assignments/5` | 113165–113169 |
| v3-wrp_warp · extensions.link.wiki ← G | `wrp_warp-assignment-wiki-G` | `/workflows/19/outputs/0/assignments/6` | 113170–113174 |
| v3-wrp_warp · ID ← join("_",WorldPrefix+Class+Kind+Skind,H) | `wrp_warp-assignment-id` | `/workflows/19/outputs/0/assignments/7` | 113175–113179 |
| v3-editor-sta · ID ← ID | `edit-STA-id` | `/workflows/20/outputs/0/assignments/0` | 113343–113347 |
| v3-editor-sta · Name ← F1 | `edit-STA-bind-Name` | `/workflows/20/outputs/0/assignments/1` | 113348–113352 |
| v3-editor-sta · STBuilding ← F2 | `edit-STA-bind-STBuilding` | `/workflows/20/outputs/0/assignments/2` | 113353–113357 |
| v3-editor-sta · elevation ← F3 | `edit-STA-bind-elevation` | `/workflows/20/outputs/0/assignments/3` | 113358–113362 |
| v3-editor-sta · platforms ← F4 | `edit-STA-bind-platforms` | `/workflows/20/outputs/0/assignments/4` | 113363–113367 |
| v3-editor-plf · ID ← ID | `edit-PLF-id` | `/workflows/21/outputs/0/assignments/0` | 113593–113597 |
| v3-editor-plf · Name ← F1 | `edit-PLF-bind-Name` | `/workflows/21/outputs/0/assignments/1` | 113598–113602 |
| v3-editor-plf · elevation ← F2 | `edit-PLF-bind-elevation` | `/workflows/21/outputs/0/assignments/2` | 113603–113607 |
| v3-editor-plf · Situation ← F3 | `edit-PLF-bind-Situation` | `/workflows/21/outputs/0/assignments/3` | 113608–113612 |
| v3-editor-plf · Connect ← F4 | `edit-PLF-bind-Connect` | `/workflows/21/outputs/0/assignments/4` | 113613–113617 |
| v3-editor-plf · lines ← F5 | `edit-PLF-bind-lines` | `/workflows/21/outputs/0/assignments/5` | 113618–113622 |
| v3-editor-rle · ID ← ID | `edit-RLE-id` | `/workflows/22/outputs/0/assignments/0` | 113859–113863 |
| v3-editor-rle · Name ← F1 | `edit-RLE-bind-Name` | `/workflows/22/outputs/0/assignments/1` | 113864–113868 |
| v3-editor-rle · bureau ← F2 | `edit-RLE-bind-bureau` | `/workflows/22/outputs/0/assignments/2` | 113869–113873 |
| v3-editor-rle · line ← F3 | `edit-RLE-bind-line` | `/workflows/22/outputs/0/assignments/3` | 113874–113878 |
| v3-editor-rle · color ← F4 | `edit-RLE-bind-color` | `/workflows/22/outputs/0/assignments/4` | 113879–113883 |
| v3-editor-rle · direction ← F5 | `edit-RLE-bind-direction` | `/workflows/22/outputs/0/assignments/5` | 113884–113888 |
| v3-editor-rle · startplf ← F6 | `edit-RLE-bind-startplf` | `/workflows/22/outputs/0/assignments/6` | 113889–113893 |
| v3-editor-rle · endplf ← F7 | `edit-RLE-bind-endplf` | `/workflows/22/outputs/0/assignments/7` | 113894–113898 |
| v3-editor-pfb · ID ← ID | `edit-PFB-id` | `/workflows/23/outputs/0/assignments/0` | 114030–114034 |
| v3-editor-pfb · Name ← F1 | `edit-PFB-bind-Name` | `/workflows/23/outputs/0/assignments/1` | 114035–114039 |
| v3-editor-pfb · LineID ← F2 | `edit-PFB-bind-LineID` | `/workflows/23/outputs/0/assignments/2` | 114040–114044 |
| v3-editor-pfb · elevation ← F3 | `edit-PFB-bind-elevation` | `/workflows/23/outputs/0/assignments/3` | 114045–114049 |
| v3-editor-pfb · height ← F4 | `edit-PFB-bind-height` | `/workflows/23/outputs/0/assignments/4` | 114050–114054 |
| v3-editor-stb · ID ← ID | `edit-STB-id` | `/workflows/24/outputs/0/assignments/0` | 114214–114218 |
| v3-editor-stb · Name ← F1 | `edit-STB-bind-Name` | `/workflows/24/outputs/0/assignments/1` | 114219–114223 |
| v3-editor-stb · elevation ← F2 | `edit-STB-bind-elevation` | `/workflows/24/outputs/0/assignments/2` | 114224–114228 |
| v3-editor-stb · height ← F3 | `edit-STB-bind-height` | `/workflows/24/outputs/0/assignments/3` | 114229–114233 |
| v3-editor-stb · Floors ← F4 | `edit-STB-bind-Floors` | `/workflows/24/outputs/0/assignments/4` | 114234–114238 |
| v3-editor-sbp · ID ← ID | `edit-SBP-id` | `/workflows/25/outputs/0/assignments/0` | 114418–114422 |
| v3-editor-sbp · Name ← F1 | `edit-SBP-bind-Name` | `/workflows/25/outputs/0/assignments/1` | 114423–114427 |
| v3-editor-sbp · elevation ← F2 | `edit-SBP-bind-elevation` | `/workflows/25/outputs/0/assignments/2` | 114428–114432 |
| v3-editor-sbp · Floors ← F3 | `edit-SBP-bind-Floors` | `/workflows/25/outputs/0/assignments/3` | 114433–114437 |
| v3-editor-sbp · stations ← F4 | `edit-SBP-bind-stations` | `/workflows/25/outputs/0/assignments/4` | 114438–114442 |
| v3-editor-stf · ID ← ID | `edit-STF-id` | `/workflows/26/outputs/0/assignments/0` | 114596–114600 |
| v3-editor-stf · Name ← F1 | `edit-STF-bind-Name` | `/workflows/26/outputs/0/assignments/1` | 114601–114605 |
| v3-editor-stf · NofFloor ← F2 | `edit-STF-bind-NofFloor` | `/workflows/26/outputs/0/assignments/2` | 114606–114610 |
| v3-editor-stf · staBuildingID ← F3 | `edit-STF-bind-staBuildingID` | `/workflows/26/outputs/0/assignments/3` | 114611–114615 |
| v3-editor-stf · Situation ← F4 | `edit-STF-bind-Situation` | `/workflows/26/outputs/0/assignments/4` | 114616–114620 |
| v3-editor-stf · elevation ← F5 | `edit-STF-bind-elevation` | `/workflows/26/outputs/0/assignments/5` | 114621–114625 |
| v3-editor-stf · height ← F6 | `edit-STF-bind-height` | `/workflows/26/outputs/0/assignments/6` | 114626–114630 |

## 重复组子字段

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| v3-rod_road · P.mode · 连接方式 | `mode` | `/workflows/17/steps/1/controls/9/group/itemFields/0` | 112099–112128 |
| v3-rod_road · P.tgt · 目标道路ID | `tgt` | `/workflows/17/steps/1/controls/9/group/itemFields/1` | 112129–112154 |
| v3-rod_road · Q.tgt · 目标道路ID | `tgt` | `/workflows/17/steps/1/controls/10/group/itemFields/0` | 112174–112199 |
| v3-rod_road · R.code · 出行方式编码 | `code` | `/workflows/17/steps/1/controls/11/group/itemFields/0` | 112219–112227 |
| v3-editor-sta · F4.ID · 站台ID | `ID` | `/workflows/20/steps/1/controls/3/group/itemFields/0` | 113282–113290 |
| v3-editor-plf · F5.ID · 线路ID | `ID` | `/workflows/21/steps/1/controls/4/group/itemFields/0` | 113469–113477 |
| v3-editor-plf · F5.stationCode · 站台编号 | `stationCode` | `/workflows/21/steps/1/controls/4/group/itemFields/1` | 113478–113486 |
| v3-editor-plf · F5.stationDistance · 线路距离 | `stationDistance` | `/workflows/21/steps/1/controls/4/group/itemFields/2` | 113487–113495 |
| v3-editor-plf · F5.Avaliable · 可使用性 | `Avaliable` | `/workflows/21/steps/1/controls/4/group/itemFields/3` | 113496–113504 |
| v3-editor-plf · F5.Overtaking · 越行 | `Overtaking` | `/workflows/21/steps/1/controls/4/group/itemFields/4` | 113505–113513 |
| v3-editor-plf · F5.getin · 可上车 | `getin` | `/workflows/21/steps/1/controls/4/group/itemFields/5` | 113514–113522 |
| v3-editor-plf · F5.getout · 可下车 | `getout` | `/workflows/21/steps/1/controls/4/group/itemFields/6` | 113523–113531 |
| v3-editor-plf · F5.NextOT · 下一站越行 | `NextOT` | `/workflows/21/steps/1/controls/4/group/itemFields/7` | 113532–113540 |
| v3-editor-stb · F4.ID · 楼层ID | `ID` | `/workflows/24/steps/1/controls/3/group/itemFields/0` | 114144–114152 |
| v3-editor-stb · F4.Group · 分组 | `Group` | `/workflows/24/steps/1/controls/3/group/itemFields/1` | 114153–114161 |
| v3-editor-sbp · F3.ID · 楼层ID | `ID` | `/workflows/25/steps/1/controls/2/group/itemFields/0` | 114317–114325 |
| v3-editor-sbp · F3.Group · 分组 | `Group` | `/workflows/25/steps/1/controls/2/group/itemFields/1` | 114326–114334 |
| v3-editor-sbp · F4.ID · 车站ID | `ID` | `/workflows/25/steps/1/controls/3/group/itemFields/0` | 114357–114365 |

## 公共表

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 所属枢纽区 · 2 行 | `teleport-hubs` | `/lookupTables/0` | 115556–115632 |
| 出行方式 · 2 行 | `road-travel-modes` | `/lookupTables/1` | 115633–115659 |
| 标准标签字段 · 16 行 | `standard-tag-fields` | `/lookupTables/2` | 115660–115846 |

## 世界

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 零洲 | `zth` | `/application/worlds/0` | 114961–114977 |
| 伊甸 | `eden` | `/application/worlds/1` | 114978–114994 |
| 奈落洲 | `naraku` | `/application/worlds/2` | 114995–115011 |
| 后土洲 | `houtu` | `/application/worlds/3` | 115012–115028 |
| 拉普塔 | `laputa` | `/application/worlds/4` | 115029–115045 |
| 云端 | `yunduan` | `/application/worlds/5` | 115046–115062 |

## 图层按钮

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 铁路-新 | `railway_new` | `/application/buttons/items/0` | 115082–115126 |
| 道路 | `road` | `/application/buttons/items/1` | 115127–115153 |
| 自然地理 | `natural_geo` | `/application/buttons/items/2` | 115154–115185 |
| 聚落 | `settlement` | `/application/buttons/items/3` | 115186–115219 |
| 规划 | `planning` | `/application/buttons/items/4` | 115220–115248 |
| 传送点 | `teleport_point` | `/application/buttons/items/5` | 115249–115278 |
| 交易点 | `trade_point` | `/application/buttons/items/6` | 115279–115305 |
| 建筑 | `building` | `/application/buttons/items/7` | 115306–115341 |

## 来源组

| 名称/说明 | 稳定 ID / 键 | JSON Pointer | 行号 |
| --- | --- | --- | --- |
| 默认共享来源 | `default` | `/application/sources/groups/0` | 115349–115437 |
