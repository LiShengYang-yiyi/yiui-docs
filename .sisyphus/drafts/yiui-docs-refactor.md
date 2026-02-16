# YIUI 文档重构计划

## 任务概述

**目标**: 完全重构 YIUI 文档，生成 AI 友好的详细 API 文档

**核心约束**:
- 之前的文档全部删除，重新创建
- 目录结构可以改变
- 以 ET9 YIUI 框架各包的说明为中心
- 同一功能的多个包合并为一个大文档
- 不需要代码示例
- 详细 API 文档格式：组件列表、API 方法、属性、事件等

---

## 需要处理的包列表（合并后）

| 序号 | 合并后文档名 | 原始包 | 说明 |
|------|-------------|--------|------|
| 1 | yiui-core | yiui, yiifrframework | 核心框架 |
| 2 | numeric | yiuinumeric, yiuinumericconfig, yiuinumericdemo | 数值系统 |
| 3 | condition | yiuicondition, yiuiconditionconfig, yiuiconditiondemo | 条件系统 |
| 4 | skill | yiuiskill | 技能系统 |
| 5 | autobattle | yiuiautobattle | 自动战斗 |
| 6 | behave | yiuibehave, yiuibehaveclass | 行为系统 |
| 7 | box2d | yiuibox2d | 物理系统 |
| 8 | ai | yiuiai | AI 系统 |
| 9 | effect | yiuieffect | 特效系统 |
| 10 | gameobjectpool | yiuigameobjectpool | 对象池 |
| 11 | audio | yiuiaudio | 音频系统 |
| 12 | animancer | yiuianimancer | 动画系统 |
| 13 | 3d-display | yiui3ddisplay | 3D 显示 |
| 14 | reddot | yiuireddot | 红点系统 |
| 15 | tips | yiuitips | 提示系统 |
| 16 | super-scroll | yiuisuperscroll, yiuisuperscrolldemo | 循环列表 |
| 17 | psd2ui | yiuipsd2ui | PSD 转 UI |
| 18 | localization | yiuilocalizationpro | 多语言 |
| 19 | luban | yiuiluban, yiuilubangen | 配置系统 |
| 20 | invoke | yiuiinvoke | 延迟调用 |
| 21 | gm | yiuigm | GM 命令 |
| 22 | mcp | yiuimcp, yiuicodeanalysis, yiuiunitymcp | MCP 工具 |
| 23 | unit | yiuiunit | 单元系统 |
| 24 | mountpoint | yiuimountpoint | 挂载点 |
| 25 | nino | yiuinino | 序列化 |
| 26 | damage-tips | yiuidamagetips | 伤害飘字 |
| 27 | yooassets | yiuiyooassets | 资源管理 |
| 28 | loop-scroll-async | yiuilubooscrollrectasync | 异步循环列表 |

---

## 文档结构设计

### 顶层分类

根据 ET9 YIUI 框架结构，建议的顶层分类：

1. **介绍** - 概述、概念、安装
2. **核心系统** - yiui-core
3. **扩展包** - numeric, condition, skill, autobattle, behave, box2d, ai 等
4. **工具系统** - invoke, gm, mcp, luban 等
5. **UI 组件** - reddot, tips, super-scroll, psd2ui 等
6. **资源系统** - audio, effect, gameobjectpool, yooassets 等
7. **配套功能** - localization, nino, 3d-display, animancer 等

---

## AI 友好文档模板

每个包的文档结构：

```markdown
# {包名称}

## 概述
- 功能简介
- 用途说明

## 包结构
- cn.etetet.yiuixxx: 主要功能
- cn.etetet.yiuixxxConfig: 配置相关
- cn.etetet.yiuixxxDemo: 示例

## 核心组件列表
### Component
- YIUI{Name}Component: 组件说明
- 属性: ...
- 方法: ...

### System
- YIUI{Name}System: 系统说明
- 方法: ...

## 事件列表
- 事件名称: 说明

## 配置表
- Config1: 用途
- Config2: 用途

## 依赖
- 依赖的包
- 被依赖的包

## 使用流程
1. 初始化
2. 配置
3. 调用
```

---

## 待确认问题

1. 每个包的具体结构需要分析源代码确定
2. 文档内容深度需要根据源代码分析
3. 是否需要包含枚举定义？
4. 是否需要包含编辑器扩展说明？
