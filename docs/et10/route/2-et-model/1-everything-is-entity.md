---
title: 2.1 一切皆实体
---

# 2.1 一切皆实体

> **一句话**：ET 里没有 `GameObject`，所有数据都是 `Entity`；`Entity` 既可以是独立对象，也可以当组件挂到别的 `Entity` 上，整个游戏的数据是一棵树。

**关键词**：Entity · Component · 树状结构 · InstanceId · 对象池 · AddComponent

**目标**：能把一个熟悉的 Unity 场景结构，翻译成 ET 的实体树。

## 和 Unity 的对应关系

| Unity | ET | 说明 |
|---|---|---|
| `GameObject` | `Entity` | 数据载体 |
| `MonoBehaviour` | `Component`（也是 `Entity`） | 挂在别人身上的数据 |
| 组件上的方法 | `System` 类 | **方法和数据分离**，见 [2.2](./2-component-based-design) |
| 场景层级 | 实体树 | `Game.Scene` 是根 |
| `transform.parent` | `Parent` / `AddComponent` | 两种挂载关系 |

关键差别：Unity 的 `GameObject` 和 `MonoBehaviour` 是两个不同的类型；ET 里 `Entity` 和 `Component` **是同一个基类的不同用法**。

## 数据是一棵树，不是一张表

ET 的结构允许「套娃」：`Entity` 挂 `Entity`，`Entity` 再挂 `Entity`。

```
Game.Scene
├── Player
│   ├── MoveComponent
│   ├── ItemsComponent
│   └── SpellComponent
└── 活动组件（全服级）
```

顶层是 `Game.Scene`，各模块的数据挂在它下面。新增功能时不需要纠结「类该怎么继承」，只需要判断**这份数据挂在哪一层**。

> **判定惯例**：通用的数据放在 `Entity` 自身做成员（比如道具的 `ConfigId` / `Count` / `Level`）；不太通用、可能被裁剪的数据做成组件挂上去。

## 组件的三个细节

### 1. 创建

不要自己 `new` 组件，走挂载 API（`AddComponent` / 工厂方法）。原因：创建过程除了构造对象，还要**注册进事件系统并抛出 `Awake`**，可能还要从对象池取。

自己 `new` 出来的组件不会被事件系统认识，它的 `Awake` / `Update` 永远不会被调用——**这是新手最常见的「代码没报错但没生效」**。

### 2. 释放

组件有非托管资源，删除必须走 `Dispose`，不能只把引用置空。`Dispose` 会做三件事：

1. 抛出 `Destroy` 事件；
2. 如果组件来自对象池，放回池中；
3. 从事件系统注销，并把 `InstanceId` 置 0。

父对象 `Dispose` 时会自动 `Dispose` 它身上所有组件。

### 3. InstanceId

每个组件带一个 `InstanceId`，构造或从对象池取出时重新赋值——**它标识的是「这一轮使用」而不是「这个对象」**。

因为它存在，异步代码才能识别「我 await 回来时，手上这个对象是不是已经被释放甚至被别人拿去用了」：

```
long instanceId = self.InstanceId;
...await 某个操作...
if (self.InstanceId != instanceId) return;   // 对象已经换人了，必须放弃
```

对象池会让这个判断成为必需——没有它，回调里的 `self` 可能是别人的数据。

> **规则**：任何跨 `await` 使用 `self` 的地方，都要比对 `InstanceId`。相关约定见 [2.3](./3-single-thread-async)。

## 真源

- **树状结构、组件创建 / 释放 / InstanceId 的完整讲解（中文）**<br>`Book/3.3一切皆实体.md`
- **同上，英文版**<br>`Book/3.3Everything is Entity.md`
- **组件初始化、`GetOrAdd` 禁令、组件缺失的错误处理约定**<br>`AGENTS.md`（工程根）

## 源码落点

- **`Entity` / `Component` 基类定义**<br>`Packages/cn.etetet.core/Scripts/Model/`
- **组件工厂与对象池**<br>`Packages/cn.etetet.core/Scripts/`
- **组件生命周期 System 写法**<br>任意包的 `Scripts/Hotfix/` 下的 `*System.cs`

> 具体文件路径随版本变动，建议在 `Packages/cn.etetet.core/` 下按类型名检索。

## 读完能回答

- ET 里的「玩家」由哪些数据组成？和 Unity 的 `GameObject` 有什么本质区别？
- 为什么不能自己 `new` 一个组件？
- `InstanceId` 解决的是什么问题？什么场景下必须用它？
- 一份新数据，该做成 `Entity` 的成员，还是做成组件？

## 下一步

→ [2.2 组件式设计](./2-component-based-design)
