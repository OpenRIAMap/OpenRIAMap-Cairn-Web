# r12 候选迁移核对清单

来源为当前注册 r9/契约 r11；目标契约 r12。新修订号仅为候选，正式发布时自动分配。数据源、字段、工作流和表格数量未改动。

| 范围 | 更新方式 | 原设置来源 | 审查重点 |
| --- | --- | --- | --- |
| BUD / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| BUD/NOM / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| BUD/SPE / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| BUD/NOM/NOM / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| BUD/SPE/SPE / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISL / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/ADM / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/WTR / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/BOD / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/ADM/DBL / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/ADM/PLL / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/WTR/RVR / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/WTR/CAN / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/BOD/BDY / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/NGF/BOD/STC / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/ADM/DBL/LBD / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISL/ADM/PLL/CBD / LineString / v1-generic-line--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ISP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/NGF / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/NGF/SCP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/DBP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/PLP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/NGF/SCP/SPP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/DBP/LIP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/PLP/PLP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/PLP/COP / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| ISP/ADM/DBP/SHR / Point / v1-generic-point-label--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| PLF / Point / v1-platform-high--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| RLE / LineString / v1-rle-exclusive-high--case-1 | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/NOM / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/NOM / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/NOM / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/TUK / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/TUK / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/TUK / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/PRI / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/PRI / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/PRI / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SEC / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SEC / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SEC / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SED / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SED / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SED / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/RES / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/RES / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/RES / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SVS / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SVS / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SVS / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/IDR / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/IDR / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/IDR / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SPE / LineString / v1-road-hidden--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SPE / LineString / v1-road-low--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| ROD/SPE / LineString / v1-road-high--base | scriptAware + actualText；严格SVG失败显式hide | strict-on-line | 原候选/端点/字距/急弯/重定位/碰撞/视口参数保留；CJK上限不套用于英文。 |
| SBP / Point / v1-station-building-icon--base | externalImage 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| SBP / Point / v1-station-building-icon-label--base | externalImage 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| STA / Point / v1-station-normal--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| STA / Point / v1-station-platform-coincident--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| STB / Polygon / v1-structure-low-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TPP / Point / v1-tpp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TPP/NOM / Point / v1-tpp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TPP/SPE / Point / v1-tpp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TPP/NOM/NOM / Point / v1-tpp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TPP/SPE/SPE / Point / v1-tpp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TRP / Point / v1-trp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TRP/NOM / Point / v1-trp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TRP/SPE / Point / v1-trp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TRP/NOM/NOM / Point / v1-trp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| TRP/SPE/SPE / Point / v1-trp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| WRP / Point / v1-wrp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| WRP/NOM / Point / v1-wrp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| WRP/SPE / Point / v1-wrp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| WRP/NOM/NOM / Point / v1-wrp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |
| WRP/SPE/SPE / Point / v1-wrp-point--base | shape 单一分支 | 当前逐规则点外观 | 完整颜色、尺寸、旧图片锚点及回退位置保留。 |

已核对 44 个贴线规则及 37 个主点样式规则；条件覆盖中的点样式也由相同迁移器转换。ROD及其他复用同类贴线能力的分类均在表中，不把独立改为其他方向策略的线强制改成ROD。

迁移记录 82 项；未决 hide 回退 0 项。旧 hide 回退若未来出现，必须人工选择完整基础点回退后再保存，不能默默改成圆点。

本候选未自动为所有地点套用新图库，也未将旧线路颜色胶囊替换为自定义胶囊。图标/自定义胶囊是显式选择的新增能力。
