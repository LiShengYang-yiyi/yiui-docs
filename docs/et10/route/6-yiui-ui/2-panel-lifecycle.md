---
title: 6.2 Panel / View 生命周期
---

# 6.2 Panel / View 生命周期

> **一句话**：YIUI 的生命周期分三类钩子——`Invoke`（数据操作入口）、`Publish`（面板开关等节点广播）、`System`（开关 / 显隐 / 动画 / 堆栈的扩展点）——按需要挂在哪一类上。

**关键词**：生命周期 · 钩子 · Invoke · Publish · System · 堆栈回退 · 预加载

**目标**：知道一个界面从创建到销毁，哪些时机可以插入自己的逻辑。

## 三类钩子

| 类 | 定位 | 特点 |
|---|---|---|
| **Invoke** | 数据操作的统一入口 | 见 [6.3](./3-data-binding-and-event) |
| **Publish** | 运行节点广播 | 面板初始化、开关、销毁等固定时机 |
| **System** | 行为扩展点 | 开关、显隐、动画、堆栈回退、预加载 |

`Publish` 是「这时候发生了这件事」的通知；`System` 是「让界面按某种方式完成这个动作」的可替换实现。

## Publish：运行节点

| 钩子 | 时机 |
|---|---|
| `YIUIEventInitializeAfter` | 初始化之后 |
| `YIUIEventPanelOpenBefore` | 面板打开**前** |
| `YIUIEventPanelOpenAfter` | 面板打开**后** |
| `YIUIEventPanelCloseBefore` | 面板关闭**前** |
| `YIUIEventPanelCloseAfter` | 面板关闭**后** |
| `YIUIEventPanelDestroy` | 面板销毁时 |

「Before / After」成对存在，用途不同：

| 用 Before | 用 After |
|---|---|
| 打开前准备数据、拦截 | 打开后播动画、请求数据 |
| 关闭前保存状态、二次确认 | 关闭后清理 |

## System：行为与状态

### 内部生命周期

| 钩子 | 说明 |
|---|---|
| `Initialize` | 初始化 |
| `Bind` | 绑定 |
| `IYIUIPreLoad` | 预加载 |

### 开关

| 钩子 | 说明 |
|---|---|
| `IYIUIOpen` | 打开 |
| `IYIUIClose` | 关闭 |
| `IYIUIWindowClose` | 窗口关闭（与普通面板关闭分开） |
| `DisClose` | 特殊处理下的关闭 |

### 显隐

| 钩子 | 说明 |
|---|---|
| `IYIUIEnable` | 显示 |
| `IYIUIDisable` | 隐藏 |

> **关闭和隐藏是两件事**：关闭会走销毁流程，隐藏只是不可见。用错会导致状态丢失或资源没释放。

### 动画

| 钩子 | 说明 |
|---|---|
| `IYIUIOpenTween` / `IYIUIOpenTweenEnd` | 打开动画的起止 |
| `IYIUICloseTween` / `IYIUICloseTweenEnd` | 关闭动画的起止 |

动画有独立钩子的意义：**逻辑不必等动画**。数据可以在 `IYIUIOpen` 就准备好，动画只是表现。

### 堆栈回退

| 钩子 | 说明 |
|---|---|
| `IYIUIBackOpen` / `IYIUIBackClose` | 堆栈回退时的开关 |
| `Home` | 回主界面 |
| `IYIUIBackHomeOpen` / `IYIUIBackHomeClose` | 回主界面的开关 |

界面是可以入栈的（比如「主界面 → 背包 → 道具详情」）。堆栈回退时的行为与直接打开不同，所以有单独的钩子。

## 怎么选

| 想做的事 | 挂哪 |
|---|---|
| 打开前准备 / 拦截 | `YIUIEventPanelOpenBefore` |
| 打开后播动画、拉数据 | `YIUIEventPanelOpenAfter` |
| 关闭前二次确认 | `YIUIEventPanelCloseBefore` |
| 关闭后清理 | `YIUIEventPanelCloseAfter` |
| 只隐藏不销毁 | `IYIUIDisable` |
| 改开关的默认行为 | `IYIUIOpen` / `IYIUIClose` |
| 入栈界面的回退处理 | `IYIUIBackOpen` / `IYIUIBackClose` |

## Component Table 与生命周期的关系

生命周期钩子挂在**界面组件**上，这些组件由 Component Table 定义（见 [6.1](./1-what-is-yiui)）。

```
Component Table（定义界面里有哪些控件）
        ↓ 生成代码
XxxComponent / XxxComponentSystem（不覆盖的手写文件）
        ↓ 在这里实现
生命周期钩子 + 事件回调
```

所以「界面里有哪些东西」是配出来的，「这些东西什么时候做什么」是写出来的。

## 真源

| 文件 | 内容 |
|---|---|
| ET9 · [`YIUI事件 生命周期`](/et9/features/event-lifecycle) | 全部钩子的清单与触发时机（**最完整**） |
| ET9 · [`Component Table`](/et9/cde-table/component) | 界面组件的定义、命名、创建与关联 |
| `Packages/cn.etetet.yiuiframework/README.md` | 框架包索引 |
| `AGENTS.md`（工程根） | UI 刷新用动态消息解耦的约定 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 框架本体的生命周期实现 | `Packages/cn.etetet.yiuiframework/Scripts/` |
| 界面组件生成物 | 各包 `Assets/GameRes/YIUI/` 对应预制体旁 |
| 手写业务逻辑 | `Packages/<包>/Scripts/HotfixView/Client/YIUISystem/` |

## 读完能回答

- `Publish` 和 `System` 两类钩子的区别是什么？
- 「关闭」和「隐藏」的钩子分别是哪个？用错会怎样？
- 打开动画为什么需要独立的钩子？
- 界面入栈之后，回退时走的是哪套钩子？

## 下一步

→ [6.3 数据绑定与事件](./3-data-binding-and-event)
