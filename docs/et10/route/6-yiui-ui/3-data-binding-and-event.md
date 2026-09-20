---
title: 6.3 数据绑定与事件
---

# 6.3 数据绑定与事件

> **一句话**：Data Table 声明「数据变了要改什么」，Event Table 声明「什么触发了什么回调」；两边都配置化，再由 UIBind 生成代码——业务只写回调与数据操作。

**关键词**：Data Table · Event Table · UIBind · 值改变事件 · 同步/异步事件 · 动态消息

**目标**：会写一个数据绑定、会注册一个事件，并知道代码生成后哪些文件要碰。

## Data Table：数据怎么驱动 UI

### 它能做什么

数据表的定位是「**组件上跟数值有关的所有事都能做**」：

| 绑定目标 | 效果 |
|---|---|
| 文本 | 数据值直接显示为文字 |
| `Active` 布尔 | 控制控件显隐 |
| `Slider` | 控制滑动条数值 |
| 图片 | 换图 |
| 颜色 | 改文字 / 图片颜色 |
| 置灰 | 切换不可用状态 |

### 命名与定义

命名规则由工具约定（配置表里定义），目的是**生成可读的绑定代码**。配置完成后，数据会有对应的 C# 属性可以直接读写。

### UIData 的 API

| API | 用途 |
|---|---|
| `Set` | 设置数据（触发绑定刷新） |
| `GetValue` | 读当前值 |
| `AddValueChangeAction` | 注册**值改变**的回调 |
| `RemoveValueChangeAction` | 移除值改变回调 |

**值改变回调**是数据驱动逻辑的关键：数据变了，关心它的人各自响应，不需要谁去「通知」谁。

> `AddValueChangeAction` 注册了就要在合适的时机 `Remove`。界面销毁时忘了移除，回调会打到已经销毁的对象上——这类问题不会立刻报错。

## Event Table：事件怎么接

### 常用事件类型

| 事件 | 场合 |
|---|---|
| `Active` | 显隐变化 |
| `Click` | 点击 |
| 按下 / 抬起 / 进入 / 退出 | 参照 `Click` 的方式扩展 |
| `ChangeData` | 数据改变 |
| `Dropdown` | 下拉菜单 |
| `InputField` | 输入框 |
| `Scrollbar` | 滚动条 |
| `Slider` | 滑动条 |
| `Toggle` | 开关 |

### 同步事件与异步事件

事件可以配成同步或异步，区别在**回调里能不能 await**：

| 类型 | 用在哪 |
|---|---|
| 同步 | 纯表现操作：切页签、播动画 |
| 异步 | 内部涉及等待的操作 |

配异步事件时要多加一个 `async` 开关；生成的方法签名也会不同。

> 判断依据与 [2.3 单线程异步](../2-et-model/3-single-thread-async) 一致：**真的需要等什么才用异步**，否则多出的 `await` 只会引入「实体已失效」的窗口。

## UIBind：自动生成

C / D / E 三张表配好之后，由 **UIBind** 生成代码，产物是四个文件：

| 文件 | 覆盖 | 放什么 |
|---|---|---|
| `XxxComponentGen.cs` | ✅ | 控件引用、绑定声明 |
| `XxxComponent.cs` | ❌ | 手写扩展 |
| `XxxComponentSystemGen.cs` | ✅ | 事件方法声明 |
| `XxxComponentSystem.cs` | ❌ | **手写业务逻辑** |

有两条工程约定值得注意：

1. **UIBind 会改变打包流程**——它涉及独立的 SGDLL（Source Generator DLL）；
2. **DLL 的 `.meta` 需要带分析器标签**——设置错了会报错。

具体操作见 ET9 的 [`UIBind 自动生成`](/et9/features/uibind)。

## 一条容易被忽略的规则

> **UI 刷新不要直接找 Panel 去刷。**

业务层、Handler、业务组件都**不应该**「找到某个具体的 Panel / View 然后调用它的刷新方法」，而要抛**语义明确的动态消息**，由界面自行订阅刷新——发消息的人不需要知道有哪些界面存在。

这条规则的完整机制（订阅要写几个类、发送有哪些入口、和 ET 原生事件的区别）见 [6.4 动态消息](./4-dynamic-message)。

## 完整流程串起来

```
1. 预制体上配 C / D / E 三张表
        ↓
2. UIBind 生成四个文件
        ↓
3. 在 XxxComponentSystem.cs 里实现事件回调、操作 UIData
        ↓
4. 业务数据变化 → 抛动态消息 → 界面订阅并刷新
```

## 真源

| 文件 | 内容 |
|---|---|
| ET9 · [`Data Table`](/et9/cde-table/data) | 数据表的定义、命名、能力与 UIData API |
| ET9 · [`Event Table`](/et9/cde-table/event) | 事件表的定义、命名、各控件事件与同步/异步区别 |
| ET9 · [`UIBind 自动生成`](/et9/features/uibind) | 生成的四个文件、SGDLL、`.meta` 要求与报错 |
| `AGENTS.md`（工程根） | UI 刷新、协议错误、请求节流的边界规则 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 绑定与数据实现 | `Packages/cn.etetet.yiuiframework/Scripts/` |
| 生成器 | `Packages/cn.etetet.yiuiframework/YIUI.BindSourceGenerator.dll` |
| 手写业务逻辑 | `Packages/<包>/Scripts/HotfixView/Client/YIUISystem/` |
| 完整实例（含事件绑定） | `Packages/cn.etetet.yiuimcp/Docs/Flows/ModifyUIPrefab完整指南-添加按钮事件绑定.md` |

## 读完能回答

- 数据绑定是怎么做到「改数据、UI 自动更新」的？
- `AddValueChangeAction` 注册了之后为什么必须移除？
- 什么时候事件该配成异步？
- UI 刷新为什么用动态消息而不是直接找 Panel？

## 下一步

→ [6.4 动态消息](./4-dynamic-message)
