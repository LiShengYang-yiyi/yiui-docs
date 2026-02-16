# YIUI 文档重构 - 详细工作计划

## 任务状态

**当前阶段**: 等待用户执行 `/start-work`

---

## 已完成工作

### 1. 包结构分析

统计了所有 yiui 包的 .cs 文件数量：

| 包名 | .cs 文件数 |
|------|------------|
| yiui3ddisplay | 26 |
| yiuiai | 37 |
| yiuianimancer | 314 |
| yiuiaudio | 40 |
| yiuiautobattle | 93 |
| yiuibehave | 651 |
| yiuibox2d | 190 |
| yiuicondition | 76 |
| yiuiconditionconfig | 36 |
| yiuiconditiondemo | 22 |
| yiuidamagetips | 48 |
| yiuieffect | 58 |
| yiuigameobjectpool | 13 |
| yiuigm | 32 |
| yiuiinvoke | 23 |
| yiuilocalizationpro | 128 |
| yiuiloopscrollrectasync | 49 |
| yiuiluban | 101 |
| yiuilubangen | 117 |
| yiuimcp | 38 |
| yiuimountpoint | 4 |
| yiuinumeric | 132 |
| yiuinumericconfig | 71 |
| yiuinumericdemo | 11 |
| yiuipsd2ui | 52 |
| yiuireddot | 48 |
| yiuiskill | 305 |
| yiuisuperscroll | 70 |
| yiuisuperscrolldemo | 279 |
| yiuitips | 21 |
| yiuiunit | 72 |
| yiuiunitymcp | 38 |
| yiuiyooassets | 15 |
| yiuizstring | 47 |

**空包**（无 .cs 文件）: yiuibehaveclass, yiuicodeanalysis, yiuinino

### 2. 已删除的旧文档

已删除以下目录：
- cde-table/
- et9/
- faq/
- features/
- guide/
- integration/
- other/
- quick-start/

**保留**:
- index.md (首页)
- changelog/ (更新日志)
- intro/ (入门)
- public/ (静态资源)
- .vitepress/ (配置)

---

## 待执行工作 (TODO)

### TODO 1: 创建文档目录结构

```bash
mkdir -p docs/extensions
mkdir -p docs/ui
mkdir -p docs/resources
mkdir -p docs/features
mkdir -p docs/systems
mkdir -p docs/tools
```

### TODO 2: 生成 28 个包的 AI 友好文档

为以下每个包创建文档 (docs/{分类}/{包名}.md):

**扩展包 (extensions/)**:
- numeric.md (数值系统)
- condition.md (条件系统)
- skill.md (技能系统)
- autobattle.md (自动战斗)
- behave.md (行为系统)
- box2d.md (物理)
- ai.md (AI)

**UI组件 (ui/)**:
- 3d-display.md
- reddot.md
- tips.md
- super-scroll.md
- damage-tips.md
- loop-scroll-async.md

**资源系统 (resources/)**:
- effect.md
- gameobjectpool.md
- audio.md
- animancer.md
- yooassets.md

**功能特性 (features/)**:
- localization.md
- luban.md
- invoke.md
- gm.md
- nino.md

**系统 (systems/)**:
- unit.md
- mountpoint.md

**工具 (tools/)**:
- psd2ui.md
- mcp.md

### TODO 3: 更新侧边栏配置

更新 docs/.vitepress/sidebar.json

### TODO 4: Git 提交

```bash
git add .
git commit -m "docs: 重构为 AI 友好文档格式"
git push
```

---

## 文档模板

每个包的文档使用以下结构:

```markdown
# {包名称}

## 概述
{功能简介}

## 包结构
| 包名 | 说明 |
|------|------|
| cn.etetet.xxx | 主要功能 |

## 核心组件
### ComponentName
- 说明:
- 主要属性:
- 主要方法:

## 系统 (Systems)
### SystemName
- 说明:
- 主要方法:

## 枚举
### EnumName
- 值说明

## 配置表
### ConfigName
- 说明

## 使用流程
1. 步骤1
2. 步骤2

## 依赖
- 依赖: 包名
- 被依赖: 包名
```

---

## 验证

使用 Playwright 访问 https://yiui.xyz/ 验证所有页面可访问
