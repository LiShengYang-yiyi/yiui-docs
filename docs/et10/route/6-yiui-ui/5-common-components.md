---
title: 6.5 常用组件
---

# 6.5 常用组件

> **一句话**：YIUI 把高频需求做成了独立包——循环列表、红点、Tips、条件系统、GM、对象池、音频视频——**装哪个用哪个**，不需要的一律不引。

**关键词**：循环列表 · 红点 · Tips · 条件系统 · GM · Invoke · 对象池 · 扩展包

**目标**：知道遇到某类需求时该装哪个包，而不是自己重写。

## 组件清单

| 需求 | 包 | 说明 |
|---|---|---|
| 长列表 / 无限滚动 | `cn.etetet.yiuisuperscroll` | 当前推荐的循环列表实现 |
| 红点 | `cn.etetet.yiuireddot` | 树状红点计算与刷新 |
| 飘字提示 | `cn.etetet.yiuitips` | 通用 Tips 显示 |
| 条件判断 | `cn.etetet.yiuicondition` | 条件系统（配合 `yiuiconditionconfig`） |
| GM 命令 | `cn.etetet.yiuigm` | 调试用命令面板与命令注册 |
| 统一调用 | `cn.etetet.yiuiinvoke` | Invoke 模式的调用入口 |
| 对象池 | `cn.etetet.yiuigameobjectpool` | GameObject 缓存池 |
| 音频 | `cn.etetet.yiuiaudio` | 音乐与音效 |
| 视频 | `cn.etetet.yiuivideo` | 视频播放 |
| 伤害飘字 | `cn.etetet.yiuidamagetips` | 战斗伤害数字 |
| 零 GC 字符串 | `cn.etetet.yiuizstring` | 高频拼接场景下的字符串优化 |
| PSD 转 UI | `cn.etetet.yiuipsd2ui` | 从设计稿生成界面的辅助工具 |

> **循环列表的版本变化**：早期用 `yiuiloopscrollrectasync` / `yiuiloopscrollrectsync` 两个包，当前推荐 `yiuisuperscroll`。替换方式是改主包 `package.json` 的依赖后重新生成 `MainPackage.txt`——流程见 [0.2](../0-environment/2-project-layout)。

## 三条共性

这些包虽然是不同功能，但写法上有共同点：

| 共性 | 说明 |
|---|---|
| **装哪个用哪个** | 每个包都是可删除的独立扩展包，不引就不编译 |
| **配置化优先** | 能用配置表达的（红点树、条件、数值）都不硬编码 |
| **单一职责** | 每个包只做一件事，组合用 |

## 选包时的判断顺序

```
1. 这个需求是不是「UI 表现」？        → 不是的话看阶段 5
2. 现有包里有没有覆盖？               → 有就用，并显式声明依赖
3. 是既有包的扩展？                   → 做成独立扩展包，单向依赖
4. 谁都不像？                        → 先确认是不是「新的公共基础设施」
```

第 3 条的约束很重要：扩展包**只能增加能力，不能修改核心**（见 [3.4](../3-code-layout/4-where-to-put-new-code)）。

## 每个包的进一步资料

| 主题 | 去哪 |
|---|---|
| 循环列表 | ET9 · [`infinite-scroll`](/et9/features/infinite-scroll/) · [`superscroll`](/et9/packages/superscroll) |
| 红点 | ET9 · [`red-dot`](/et9/features/red-dot/) |
| Tips | ET9 · [`tips`](/et9/features/tips) |
| GM 命令 | ET9 · [`gm-command`](/et9/features/gm-command) |
| 条件系统 | ET9 · [`condition`](/et9/packages/condition/) |
| 对象池 / 音频 / 视频 / 伤害提示 | ET9 · [`packages`](/et9/packages/) 各页 |
| 全部扩展包索引 | ET9 · [`扩展包`](/et9/packages/) |

## 真源

| 文件 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuisuperscroll/README.md` 等各包 `README.md` | 各扩展包的能力与入口 |
| `Packages/cn.etetet.harness/skills/index.md` | 任务路由索引（按任务找 skill） |
| ET9 · [`扩展包`](/et9/packages/) | 各扩展包的完整文档（已整理好的 211 篇之一） |
| `Packages/cn.etetet.harness/skills/et-code/SKILL.md` | 新增扩展包时的落点与依赖规则 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 各扩展包实现 | `Packages/cn.etetet.yiui<功能>/Scripts/` |
| 循环列表示例 | `Packages/cn.etetet.yiuisuperscrolldemo/` |
| 红点配置 | `Packages/cn.etetet.yiuireddot/` |
| 条件配置 | `Packages/cn.etetet.yiuiconditionconfig/` |

## 读完能回答

- 遇到「长列表卡顿」该装哪个包？
- `yiuisuperscroll` 和 `yiuiloopscrollrectasync` 是什么关系？
- 想给某个包加一个能力，该怎么做？
- 这些包为什么可以「不引就不编译」？

## 下一步

→ [6.6 表现增强](./6-presentation)
