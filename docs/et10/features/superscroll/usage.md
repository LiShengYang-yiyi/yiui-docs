---
title: 接入与刷新
---

# 接入与刷新

> 一次完整接入 = 三个 `AddChild` + 最多三个业务方法；之后日常只调 `SetDataRefresh`。

**关键词**：AddChild · YIUIInitialize · Renderer · GetPrefabIndex · SetDataRefresh · SetDataRefreshSelect · MovePanelToItemIndex

## 1 创建组件

在业务 View 的 `YIUIInitialize` 里创建，控件实例来自生成字段 `u_ComXXX`：

```csharp
self.AddChild<YIUISuperScrollListComponent, LoopListView2>(self.u_ComListView);
```

网格与错列网格参数更多：

```csharp
self.AddChild<YIUISuperScrollGridComponent, LoopGridView>(self.u_ComGridView);

self.AddChild<YIUISuperScrollStaggeredGridComponent, LoopStaggeredGridView, GridViewLayoutParam>(
    self.u_ComStaggeredView, layoutParam);
```

`GridViewLayoutParam` 由业务构造，内部 `CheckParam()` 会校验分组数大于 0、且偏移数组长度与分组数一致。**不通过就直接报错返回，列表不工作。**

组件 `Awake` 里会读控件的 `ItemPrefabDataList` 决定走哪条分支：

| 数量 | 行为 |
|---|---|
| `0` | 打 Error 并**直接返回**，之后调任何 API 都不会有反应 |
| `1` | 走单预制体回调，不需要 `GetPrefabIndex` |
| `> 1` | 走多预制体回调，**必须**实现 `GetPrefabIndex` |

## 2 业务要实现的方法

实现方式：在持有者 View 组件的系统里写同名方法并标 `[EntitySystem]`，由 Helper 运行时取到。

| 接口 | 什么时候被调 | 是否必须 |
|---|---|---|
| `IYIUISuperScrollListRenderer` | 每次取到一个 Item | **必须** |
| `IYIUISuperScrollListGetPrefab` | Item 数 > 1 时，决定用哪个预制体 | 单预制体不需要 |
| `IYIUISuperScrollListOnClick` | Item 被点击 | 用到点击才需要 |
| `IYIUISuperScrollListGetItemSize` | 错列网格排版时 | 错列网格**必须** |

`Renderer` 的真实形态：

```csharp
[EntitySystem]
private static void YIUISuperScrollListRenderer(
    this MyPanelComponent self,
    MyItemComponent item,
    YIUISuperScrollListComponent superScrollList,
    int index,
    bool select)
```

常规做法：在 `Renderer` 里按 `index` 从业务数据源取数据，写进 Item 组件；`select` 直接用来切选中表现。

## 3 刷新

列表：

| 方法 | 作用 |
|---|---|
| `SetDataRefresh(count, moveToIndex = 0)` | 一键刷新，最常用 |
| `SetDataRefreshSelect(count, index, moveToIndex = 0)` | 刷新并选中一个 |
| `SetDataRefreshSelect(count, indexList, moveToIndex = 0)` | 刷新并选中多个 |
| `SetListItemCount(count, resetPos = true)` | 只改数量，不刷内容 |
| `RefreshAllShownItem()` | 只重刷当前可见项 |
| `OnItemSizeChanged(index)` | 通知某项尺寸变了 |

**`SetDataRefreshSelect` 是累加语义**：连续刷新想每次选中不同项时，先自己调一次 `ClearSelect()`，否则选中的会一直叠上去。

网格另有：

| 方法 | 作用 |
|---|---|
| `RefreshItemByItemIndex(index)` | 只刷一项 |
| `RefreshItemByRowColumn(row, column)` | 按行列刷 |
| `SetGridFixedGroupCount(type, count)` | 改固定行列数 |
| `SetItemSize(size)` · `SetItemPadding(padding)` · `SetPadding(offset)` | 改布局参数 |

错列网格另有：

| 方法 | 作用 |
|---|---|
| `ResetGridViewLayoutParam(itemTotalCount, layoutParam)` | 换分组参数，**必须在 Init 之后调** |
| `UpdateContentSizeUpToItemIndex(index)` | 手动推进内容高度 |
| `GetContentSize()` · `GetViewPortWidth()` · `GetViewPortHeight()` | 读尺寸 |

## 4 滚动与读取

| 方法 | 说明 |
|---|---|
| `MovePanelToItemIndex(index, offset, duration)` | 滚到某项。`duration > 0` 才会触发「移动完成」回调 |
| `MoveToRowColumnWithCenter(row, column)` | 网格专用，滚到某格并居中 |
| `GetItemByIndex(index)` | **只能拿当前可见项**，不可见的拿不到 |
| `GetSelectIndex()` · `GetSelectItem()` | 读当前选中 |
| `IsSelect(entity)` · `IsSelectByIndex(index)` | 判断是否选中 |
| `ClearSelect(reset = true)` | 清空选中，`reset` 一律传 `true` |

跨屏数据不要依赖 `GetItemByIndex`。可见项会被回收复用，它的内容只代表「此刻屏幕上的那一格」，不代表业务数据源里的那一条。需要业务数据请从自己的数据源按 `index` 取。

## 5 目录与方向

| 方法 | 作用 |
|---|---|
| `Vertical(bool)` · `Horizontal(bool)` | 切列表方向 |

方向也可以在预制体的 `LoopListView2` 组件上用 `mArrangeType` 直接配。运行时代码改方向属于非常规操作，优先在预制体上定死。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/List/*ComponentSystem_API.cs` | 全部对外 API 的真实签名 |
| `Packages/cn.etetet.yiuisuperscroll/Scripts/ModelView/Client/Event/` | 业务需要实现的接口定义 |
| `Packages/cn.etetet.yiuisuperscroll/Runtime/RuntimeExtend/ListView/LoopListView2_Extend.cs` | `SetListItemCountAndRefreshAllShownItem` 等底层入口 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 列表 API | `Scripts/HotfixView/Client/SuperScroll/List/YIUISuperScrollListComponentSystem_API.cs` |
| 网格 API | `Scripts/HotfixView/Client/SuperScroll/Grid/YIUISuperScrollGridComponentSystem_API.cs` |
| 错列网格 API | `Scripts/HotfixView/Client/SuperScroll/StaggeredGrid/YIUISuperScrollStaggeredGridComponentSystem_API.cs` |
| 组件 Awake（读预制体配置） | `Scripts/HotfixView/Client/SuperScroll/*/YIUISuperScroll*ComponentSystem.cs` |
| 可取用的现成示例 | `Packages/cn.etetet.yiuisuperscrolldemo/Scripts/` |

## 下一步

→ [点击与选中](./interaction)
