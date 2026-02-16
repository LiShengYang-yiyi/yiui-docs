# YIUI 文档重构执行计划

## 任务清单

- [ ] 1. 创建文档目录结构
  - [ ] 创建 docs/extensions/
  - [ ] 创建 docs/ui/
  - [ ] 创建 docs/resources/
  - [ ] 创建 docs/features/
  - [ ] 创建 docs/systems/
  - [ ] 创建 docs/tools/

- [ ] 2. 生成扩展包文档 (extensions/)
  - [ ] numeric.md - 数值系统 (yiuinumeric, yiuinumericconfig, yiuinumericdemo)
  - [ ] condition.md - 条件系统 (yiuicondition, yiuiconditionconfig, yiuiconditiondemo)
  - [ ] skill.md - 技能系统 (yiuiskill)
  - [ ] autobattle.md - 自动战斗 (yiuiautobattle)
  - [ ] behave.md - 行为系统 (yiuibehave, yiuibehaveclass)
  - [ ] box2d.md - 物理系统 (yiuibox2d)
  - [ ] ai.md - AI系统 (yiuiai)

- [ ] 3. 生成UI组件文档 (ui/)
  - [ ] 3d-display.md - 3D显示 (yiui3ddisplay)
  - [ ] reddot.md - 红点系统 (yiuireddot)
  - [ ] tips.md - 提示系统 (yiuitips)
  - [ ] super-scroll.md - 循环列表 (yiuisuperscroll, yiuisuperscrolldemo)
  - [ ] damage-tips.md - 伤害飘字 (yiuidamagetips)
  - [ ] loop-scroll-async.md - 异步循环列表 (yiuiloopscrollrectasync)

- [ ] 4. 生成资源系统文档 (resources/)
  - [ ] effect.md - 特效系统 (yiuieffect)
  - [ ] gameobjectpool.md - 对象池 (yiuigameobjectpool)
  - [ ] audio.md - 音频系统 (yiuiaudio)
  - [ ] animancer.md - 动画系统 (yiuianimancer)
  - [ ] yooassets.md - 资源管理 (yiuiyooassets)

- [ ] 5. 生成功能特性文档 (features/)
  - [ ] localization.md - 多语言 (yiuilocalizationpro)
  - [ ] luban.md - 配置系统 (yiuiluban, yiuilubangen)
  - [ ] invoke.md - 延迟调用 (yiuiinvoke)
  - [ ] gm.md - GM命令 (yiuigm)
  - [ ] nino.md - 序列化 (yiuinino)

- [ ] 6. 生成系统文档 (systems/)
  - [ ] unit.md - 单元系统 (yiuiunit)
  - [ ] mountpoint.md - 挂载点 (yiuimountpoint)

- [ ] 7. 生成工具文档 (tools/)
  - [ ] psd2ui.md - PSD转UI (yiuipsd2ui)
  - [ ] mcp.md - MCP工具 (yiuimcp, yiuicodeanalysis, yiuiunitymcp)

- [ ] 8. 更新侧边栏配置
  - [ ] 更新 docs/.vitepress/sidebar.json

- [ ] 9. Git提交
  - [ ] git add .
  - [ ] git commit -m "docs: 重构为AI友好文档格式，添加28个包的详细文档"
  - [ ] git push

## 文档模板

每个文档使用以下结构：

```markdown
# {包名称}

## 概述
功能简介和用途说明

## 包结构
| 包名 | 说明 |
|------|------|
| cn.etetet.xxx | 主要功能 |

## 源代码统计
- 包名: X 个 .cs 文件

## 核心组件
### ComponentName
- **说明**: 组件功能
- **主要属性**: 
- **主要方法**:

## 系统 (Systems)
### SystemName
- **说明**: 系统功能
- **主要方法**:

## 枚举 (Enums)
### EnumName
- 值说明

## 配置表 (Configs)
### ConfigName
- 说明

## 依赖
- **依赖**: 包名
- **被依赖**: 包名

## 使用流程
1. 初始化
2. 配置
3. 调用
```

## 包信息

| 包名 | .cs文件数 | 分类 |
|------|-----------|------|
| yiuinumeric | 132 | extensions |
| yiuinumericconfig | 71 | extensions |
| yiuinumericdemo | 11 | extensions |
| yiuicondition | 76 | extensions |
| yiuiconditionconfig | 36 | extensions |
| yiuiconditiondemo | 22 | extensions |
| yiuiskill | 305 | extensions |
| yiuiautobattle | 93 | extensions |
| yiuibehave | 651 | extensions |
| yiuibox2d | 190 | extensions |
| yiuiai | 37 | extensions |
| yiui3ddisplay | 26 | ui |
| yiuireddot | 48 | ui |
| yiuitips | 21 | ui |
| yiuisuperscroll | 70 | ui |
| yiuisuperscrolldemo | 279 | ui |
| yiuidamagetips | 48 | ui |
| yiuiloopscrollrectasync | 49 | ui |
| yiuieffect | 58 | resources |
| yiuigameobjectpool | 13 | resources |
| yiuiaudio | 40 | resources |
| yiuianimancer | 314 | resources |
| yiuiyooassets | 15 | resources |
| yiuilocalizationpro | 128 | features |
| yiuiluban | 101 | features |
| yiuilubangen | 117 | features |
| yiuiinvoke | 23 | features |
| yiuigm | 32 | features |
| yiuinino | 0 | features |
| yiuiunit | 72 | systems |
| yiuimountpoint | 4 | systems |
| yiuipsd2ui | 52 | tools |
| yiuimcp | 38 | tools |
| yiuicodeanalysis | 0 | tools |
| yiuiunitymcp | 38 | tools |
