---
title: 排查
---

# 排查

> 循环列表的故障几乎全都能从日志定位，因为它把每一次失败都写成了明确的 Error 文案，且**大部分失败不抛异常**。

**关键词**：ItemPrefabDataList · 索引越界 · 创建失败 · ResName · 重名 · 静默失败

## 1 先分清两类失败

| 类型 | 表现 | 处理 |
|---|---|---|
| **报错型** | 日志里有明确 Error，流程中断或跳过 | 按日志文案直接改配置或代码 |
| **静默型** | 没异常、没崩溃，就是空白或没反应 | 需要按下面的顺序逐层确认 |

静默型是主要耗时点：控件在「没实现业务方法」「拿不到资源」这些情况下只打日志，不抛异常，**列表照常有数量、照常能滚，就是一个 Item 都不显示。**

## 2 按顺序确认六步

1. **控件上配了 Item 预制体吗** —— `Awake` 里读 `ItemPrefabDataList`，为空就只打 Error 然后返回，后面所有 API 都无效
2. **`YIUIInitialize` 里真的 `AddChild` 了吗** —— 没有组件实例时，API 调用不会报错也不会有反应
3. **`GetPrefabIndex` 实现了吗** —— Item 数大于 1 却没实现，取到 `-1` 会直接索引越界
4. **`Renderer` 实现了吗** —— 没实现时列表不会崩，只是内容永远为空
5. **Item 预制体挂 `UIBindCDETable` 并在 `YIUIBind` 注册了吗** —— 没挂会报「创建失败，找不到资源」
6. **同一个列表里 Item 预制体有没有重名** —— 重名时只保留第一个，另一个永远不出现

到第 6 步都正常，再去看 `Renderer` 里按 `index` 取数据的逻辑对不对。

## 3 日志文案对照表

| 日志关键词 | 含义 | 怎么改 |
|---|---|---|
| `ItemPrefabDataList为空` | 控件没配 Item 预制体 | 在控件的 `mItemPrefabDataList` 里加上 |
| `索引越界` | `GetPrefabIndex` 返回了无效值（通常是 `-1`） | 实现或修正 `GetPrefabIndex` |
| `创建失败,找不到资源` | Item 的 `ResName` 反查不到绑定 | 给 Item 挂 `UIBindCDETable` 并注册 |
| `没有具体实现的事件` | 业务少实现了 `Renderer` / `GetPrefab` / `OnClick` 之一 | 在 View 系统里补同名方法 |
| `OnClick 相关只能初始化一次` | 重复调了 `SetOnClick` 系列 | 挪到 `YIUIInitialize` 里只调一次 |
| `有Click 才可以` | 没开点击就调了 `SetOnClickCheck` / `SetBanSelect` | 先 `SetOnClick` |
| `目标item 没有 event表` | Item 预制体缺事件表 | 在 CDE 表里补事件 |
| `无法选中一个不在显示中的对象` | 对不可见项调 `OnClickItem` | 先滚进可见区 |
| `必须滚动到可显示的对象上` | `MovePanelToItemIndex` 目标无法显示 | 检查 index 与数量 |
| `A item prefab with name ... has existed` | 同列表内 Item 预制体重名 | 改预制体名字 |
| `InitListView` 相关报错 | 控件被初始化了两次 | 确认没有重复 `AddChild` |
| `ScrollRect` 相关报错 | 预制体结构不对 | 补齐 ScrollRect，且滚动条 visibility 不能是 `AutoHideAndExpandViewport` |

## 4 从现象反推

**现象：列表有数量，但一个 Item 都没有**

按第 2 节六步走。最常见的是 `Renderer` 没实现或 `GetPrefabIndex` 返回 `-1`。

**现象：点击没反应**

判断顺序：控件有没有 `SetOnClick` → Item 有没有事件表 → 事件名与 `itemClickEventName` 是否一致 → `OnClick` 业务方法有没有实现。

**现象：选中一直叠加，点了几次就全亮**

`SetDataRefreshSelect` 是累加语义。反复刷新选不同项之前先调 `ClearSelect()`。

**现象：滚到某项拿不到对应 Item**

`GetItemByIndex` 只能取当前可见项。跨屏数据从自己的数据源按 `index` 取。

**现象：`OnSmoothMovePanelToItemFinished` 一直不触发**

两个条件必须同时满足：`MovePanelToItemIndex` 的 `duration > 0`，且目标真的滚到了可显示对象上。

**现象：错列网格排不出来**

`GridViewLayoutParam` 为 null，或 `CheckParam()` 没通过（分组数 ≤ 0、偏移数组长度与分组数不一致）。另外错列网格**没有** `Finished` / `Changed` 回调，不要订阅。

## 5 建议的排查动作

| 动作 | 目的 |
|---|---|
| 在 `Renderer` 首行打一条日志 | 确认它到底有没有被调用 |
| 打印 `SetDataRefresh` 传进去的 `count` | 确认数量不是 0 |
| 用 `yiuisuperscrolldemo` 跑同一种控件 | 对照组，快速区分「控件问题」和「业务接入问题」 |
| 临时把 Item 数减到 1 个 | 绕开 `GetPrefabIndex`，判断是不是多预制体分支的问题 |

## 真源

- **Awake 里的预制体校验与取项回调**<br>`Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/List/*ComponentSystem.cs`
- **取项与池复用的错误分支**<br>`Packages/cn.etetet.yiuisuperscroll/Runtime/RuntimeExtend/ListView/LoopListView2_Extend.cs`
- **「没有具体实现」类日志的出处**<br>`Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/*/*Helper.cs`

## 源码落点

- **全部 Error 文案**<br>在包内搜 `Log.Error` / `Debug.LogError`
- **取项与越界判定**<br>`Runtime/ListView/LoopListView2.cs` 的 `NewListViewItem`
- **点击初始化校验**<br>`Scripts/HotfixView/Client/SuperScroll/*/*ComponentSystem_OnClick.cs`
- **可运行的对照组**<br>`Packages/cn.etetet.yiuisuperscrolldemo/`

## 下一步

→ [提示弹窗](../tips/)
