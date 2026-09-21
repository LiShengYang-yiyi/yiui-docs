---
title: 循环列表
---

# 循环列表

> 循环列表把 SuperScrollView 的三套控件接进 ET 的组件体系：控件负责虚拟化与滚动，Item 的创建、绑定、点击、选中全部回到 YIUI 既有链路。

**关键词**：yiuisuperscroll · LoopListView2 · LoopGridView · LoopStaggeredGridView · ItemPool · SetDataRefresh · Renderer · GetPrefab

## 1 定位与边界

管三件事：

- 三套控件的 YIUI 封装：线性列表、固定网格、错列网格
- Item 预制体的按需创建、池化复用与回收
- 刷新、定位、点击、选中、滚动回调

不管三件事：

- Item 里显示什么 —— 由业务自己实现的 `Renderer` 决定
- 数据源本身 —— 列表只认「数量 + index」，不持有业务数据
- Panel / View / CDE 表 —— 沿用 YIUI 框架既有机制

强依赖 YIUI。`Runtime/` 与 `Scripts/` 全域引用 `YIUIFramework`、`ET.ModelView`、`ET.HotfixView`，不能脱离 YIUI 单独使用。

## 2 三套控件怎么选

| 控件 | 排列方式 | 每项尺寸 |
|---|---|---|
| `LoopListView2` | 线性：上→下 / 下→上 / 左→右 / 右→左 | 可变，改完调 `OnItemSizeChanged` |
| `LoopGridView` | 固定行列的网格 | 统一，用 `SetItemSize` 设定 |
| `LoopStaggeredGridView` | 错列网格，按 column / row 分组 | 逐项可变，**必须**实现 `GetItemSize` |

选择依据：

- 一行拉到底、条目高矮不一 → `LoopListView2`
- 规整的格子 → `LoopGridView`
- 瀑布流、卡片高矮不一 → `LoopStaggeredGridView`

`LoopGridView` 的固定维度由 `GridFixedType` 决定（固定列数或固定行数），排列方向由 `GridItemArrangeType` 决定（四种角）。

`LoopStaggeredGridView` 的布局模型与网格不同：网格用「行列对」，它用 `ItemIndexData { mGroupIndex, mIndexInGroup }`，分组数量与尺寸由运行时传入的 `GridViewLayoutParam` 决定。

## 3 Item 预制体与池

三套控件各自带一套 Item 池，**键是预制体里 GameObject 的名字**。

| 池 | 位置 |
|---|---|
| `LoopListItemPool` | `Runtime/ListView/LoopListItemPool.cs` |
| `LoopGridItemPool` | `Runtime/GridView/LoopGridItemPool.cs` |
| `StaggeredGridItemPool` | `Runtime/StaggeredGridView/StaggeredGridItemPool.cs` |

池内部是两层列表：帧内先回收进临时池，之后并入真实池并 `SetActive(false)`。取项时优先复用 ItemIndex 相同的那一个。

两条硬约束：

- Item 预制体必须挂 `UIBindCDETable`，并在 `YIUIBind` 里注册好
- **同一个列表里 Item 预制体不能重名**，重名时只保留第一个

Item 侧被追加的 YIUI 成员（都在 `Runtime/RuntimeExtend/**/*_Extend.cs`）：

| 成员 | 含义 |
|---|---|
| `OwnerEntity` | 该 Item 对应的 ET 实体 |
| `YIUICDETable` | Item 的 CDE 资源表 |
| `ResName` | 资源名，取自 `YIUICDETable.ResName` |

这套扩展不改上游控件源码，全部用 `partial class` 追加，所以控件本体可以按原版升级。

## 4 接入 YIUI 的方式

三个组件类，都直接继承 `Entity`：

| 组件 | 路径 |
|---|---|
| `YIUISuperScrollListComponent` | `Scripts/ModelView/Client/SuperScroll/List/` |
| `YIUISuperScrollGridComponent` | `Scripts/ModelView/Client/SuperScroll/Grid/` |
| `YIUISuperScrollStaggeredGridComponent` | `Scripts/ModelView/Client/SuperScroll/StaggeredGrid/` |

组件由业务 View 在 `YIUIInitialize` 里 `AddChild` 创建，控件实例来自生成的 `u_ComXXX` 字段。

系统侧按职责拆成四类分片：

| 分片 | 职责 |
|---|---|
| `XxxComponentSystem.cs` | Awake / Destroy、取项回调 |
| `_API.cs` | 对外 API |
| `_Event.cs` | 滚动回调（**只有 List 与 Grid 有**） |
| `_OnClick.cs` | 点击与选中逻辑 |

业务能力的接入方式是**接口 + 动态取实现**，不给组件加基类。接口命名规则：`IYIUISuperScroll{List|Grid|StaggeredGrid}{GetPrefab|Renderer|Finished|Changed|Moved|OnClick|OnClickCheck|GetItemSize}`。

设计意图一句话：**列表不需要知道业务类是什么。业务按约定写一个同名方法，Helper 运行时反射取到它。**

## 5 刷新一次数据会发生什么

1. 业务调 `SetDataRefresh(count, moveToIndex)`
2. 转到控件扩展的 `SetListItemCountAndRefreshAllShownItem`
3. 控件清掉 snap 状态，写入新的 `mItemTotalCount`
4. `count == 0` 时回收全部 Item 并归零；否则重建首项位置并刷新全部已显示项
5. 视口算出需要哪些 index，回调 `OnGetItemByIndex`
6. 多预制体时先走 `GetPrefabIndex` 决定用哪一个，再 `NewListViewItem(prefabIndex)` 从池里取
7. 首次拿到该 Item 时：按 `ResName` 反查绑定 → `CreateByObjVo` 建实体 → `SetOwnerEntity` → 挂点击事件
8. 交给业务实现的 `Renderer` 填写内容
9. 滚动停靠时触发 snap 回调，再由 Helper 分发到 `Changed` / `Finished` / `Moved`

第 6、8 步都靠 Helper 动态取实现。**没实现只会打一条 Error 日志，不会中断流程** —— 表现为「列表有数量但一片空白」，这是排查时最容易误判的一类。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuisuperscroll/Runtime/Common/CommonDefine.cs` | 排列类型、行列对等公共定义 |
| `Packages/cn.etetet.yiuisuperscroll/Runtime/RuntimeExtend/ListView/LoopListView2_Extend.cs` | 列表侧的 YIUI 扩展 |
| `Packages/cn.etetet.yiuisuperscroll/Scripts/ModelView/Client/SuperScroll/List/` | 列表组件与接口定义 |
| `Packages/cn.etetet.yiuisuperscroll/Scripts/HotfixView/Client/SuperScroll/List/` | 列表系统分片（API / Event / OnClick） |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 上游三套控件本体 | `Runtime/ListView/` · `Runtime/GridView/` · `Runtime/StaggeredGridView/` |
| YIUI 扩展层 | `Runtime/RuntimeExtend/` |
| 动态取实现的 Helper | `Scripts/HotfixView/Client/SuperScroll/*/` 下的 `*Helper.cs` |
| 编辑器与模板预制体 | `Editor/` · `Editor/TemplatePrefabs/` |
| 完整用法示例 | `Packages/cn.etetet.yiuisuperscrolldemo/` |

## 下一步

→ [接入与刷新](./usage)
