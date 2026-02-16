# Super Scroll (yiuisuperscroll + yiuisuperscrolldemo)

## Scope

- Packages: `cn.etetet.yiuisuperscroll` and `cn.etetet.yiuisuperscrolldemo`
- Source roots:
  - `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuisuperscroll`
  - `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuisuperscrolldemo`
- Total C# files scanned: 349 (70 + 279)
- This document merges runtime super-scroll infrastructure and demo UI implementations into one AI-facing reference.

## Package Structure

### cn.etetet.yiuisuperscroll (core runtime)

- `Runtime`: third-party SuperScrollView runtime types (loop list/grid/staggered behavior)
- `RuntimeExtend`: project-specific runtime extensions
- `Scripts/ModelView/Client/Event`: event contracts and callback signatures for list/grid/staggered adapters
- `Scripts/ModelView/Client/YIUIComponent`: YIUI component wrappers around loop list/grid controls
- `Scripts/HotfixView/Client/YIUISystem`: component lifecycle and event bridge systems

### cn.etetet.yiuisuperscrolldemo (demo package)

- `Scripts/ModelView/Client/YIUIComponent/SuperScrollDemo`: demo panels and demo item components
- `Scripts/HotfixView/Client/YIUISystem/SuperScrollDemo`: demo behavior systems per panel/item
- `Scripts/ModelView/Client/GM` and `Scripts/HotfixView/Client/GM`: GM command entry for launching demo flows
- `Runtime`: demo helper/runtime scripts (animation, drag, tween, message item models)

## High-Level Architecture

- Core package provides three adapters: list, grid, and staggered grid.
- Each adapter is represented as a YIUI component and configured through init/setting param objects.
- Rendering, prefab lookup, click dispatch, and item-selection callbacks are routed through typed system interfaces.
- Demo package supplies concrete panels and item renderers that consume these callbacks.
- Demo systems show practical usage for chat list, tree list, standard list, multi-list, grid, staggered grid, and spin/date-picker patterns.

## Components

### Core components (yiuisuperscroll)

- `YIUISuperScrollListComponent`
- `YIUISuperScrollGridComponent`
- `YIUISuperScrollStaggeredGridComponent`

### Demo components (yiuisuperscrolldemo)

- `SuperScrollDemoPanelComponent`
- `SuperScrollDemoBackCommonComponent`
- `SuperScrollDemoButtonCommonComponent`
- `SuperScrollDemoItemComponent`
- `SuperScrollDemoItem2Component`
- `SuperScrollDemoItem3Component`
- `SuperScrollDemoItem4Component`
- `SuperScrollDemoGridViewItem1Component`
- `SuperScrollDemoGridViewItem2Component`
- `SuperScrollDemoGridViewItem3Component`
- `SuperScrollDemoSpinViewItem1Component`
- `SuperScrollChatViewDemoViewComponent`
- `SuperScrollChatViewDemoItem1Component`
- `SuperScrollChatViewDemoItem2Component`
- `SuperScrollTreeViewDemoViewComponent`
- `SuperScrollTreeViewDemoItem1Component`
- `SuperScrollTreeViewDemoItem2Component`
- `SuperScrollListViewTopToBottomDemoViewComponent`
- `SuperScrollListViewMultipleTopToBottomDemoViewComponent`
- `SuperScrollListViewLeftToRightDemoViewComponent`
- `SuperScrollGridViewTopToBottomDemoViewComponent`
- `SuperScrollGridViewLeftToRightDemoViewComponent`
- `SuperScrollGridViewDiagonalTopLeftDemoViewComponent`
- `SuperScrollStaggeredViewTopToBottomDemoViewComponent`
- `SuperScrollStaggeredViewDemoItem1Component`
- `SuperScrollSpinDatePickerDemoViewComponent`

## Systems

### Core systems (yiuisuperscroll)

- `YIUISuperScrollListComponentSystem`
- `YIUISuperScrollGridComponentSystem`
- `YIUISuperScrollStaggeredGridComponentSystem`
- `YIUISuperScrollListRendererSystem`
- `YIUISuperScrollListGetPrefabSystem`
- `YIUISuperScrollListOnClickSystem`
- `YIUISuperScrollListOnClickCheckSystem`
- `YIUISuperScrollListChangedSystem`
- `YIUISuperScrollListFinishedSystem`
- `YIUISuperScrollListMovedSystem`
- `YIUISuperScrollListHelper`
- `YIUISuperScrollGridRendererSystem`
- `YIUISuperScrollGridGetPrefabSystem`
- `YIUISuperScrollGridOnClickSystem`
- `YIUISuperScrollGridOnClickCheckSystem`
- `YIUISuperScrollGridChangedSystem`
- `YIUISuperScrollGridFinishedSystem`
- `YIUISuperScrollGridHelper`
- `YIUISuperScrollStaggeredGridRendererSystem`
- `YIUISuperScrollStaggeredGridGetPrefabSystem`
- `YIUISuperScrollStaggeredGridGetItemSizeSystem`
- `YIUISuperScrollStaggeredGridOnClickSystem`
- `YIUISuperScrollStaggeredGridOnClickCheckSystem`
- `YIUISuperScrollStaggeredGridHelper`

### Demo systems and helpers (yiuisuperscrolldemo)

- `SuperScrollDemoPanelComponentSystem`
- `SuperScrollDemoBackCommonComponentSystem`
- `SuperScrollDemoButtonCommonComponentSystem`
- `SuperScrollDemoItemComponentSystem`
- `SuperScrollDemoItem2ComponentSystem`
- `SuperScrollDemoItem3ComponentSystem`
- `SuperScrollDemoItem4ComponentSystem`
- `SuperScrollDemoGridViewItem1ComponentSystem`
- `SuperScrollDemoGridViewItem2ComponentSystem`
- `SuperScrollDemoGridViewItem3ComponentSystem`
- `SuperScrollDemoSpinViewItem1ComponentSystem`
- `SuperScrollChatViewDemoViewComponentSystem`
- `SuperScrollChatViewDemoItem1ComponentSystem`
- `SuperScrollChatViewDemoItem2ComponentSystem`
- `SuperScrollTreeViewDemoViewComponentSystem`
- `SuperScrollTreeViewDemoItem1ComponentSystem`
- `SuperScrollTreeViewDemoItem2ComponentSystem`
- `SuperScrollListViewTopToBottomDemoViewComponentSystem`
- `SuperScrollListViewMultipleTopToBottomDemoViewComponentSystem`
- `SuperScrollListViewLeftToRightDemoViewComponentSystem`
- `SuperScrollGridViewTopToBottomDemoViewComponentSystem`
- `SuperScrollGridViewLeftToRightDemoViewComponentSystem`
- `SuperScrollGridViewDiagonalTopLeftDemoViewComponentSystem`
- `SuperScrollStaggeredViewTopToBottomDemoViewComponentSystem`
- `SuperScrollStaggeredViewDemoItem1ComponentSystem`
- `SuperScrollSpinDatePickerDemoViewComponentSystem`
- `AnimationHelper`
- `DragEventHelper`
- `OneDirectionDragHelper`
- `TweenHelper`
- `GM_SuperScrollDemo_1`

## Enums

### Core enums (yiuisuperscroll)

- `ItemCornerEnum`
- `ListItemArrangeType`
- `GridItemArrangeType`
- `GridFixedType`
- `SnapStatus`

### Demo enums (yiuisuperscrolldemo)

- `EGMType`
- `AnimationType`
- `ExpandAnimationType`
- `LoadingTipStatus`
- `MsgTypeEnum`

## Configs and Param Models

- `LoopListViewInitParam`
- `LoopGridViewInitParam`
- `LoopGridViewSettingParam`
- `GridViewLayoutParam`
- `StaggeredGridViewInitParam`

## Dependencies

- Package manifest dependency (both core and demo): `cn.etetet.core`.
- Runtime/library dependencies visible in source:
  - SuperScrollView runtime namespace (loop list/grid controls)
  - Unity UI event/runtime APIs
  - ET entity/system extension model and YIUI component lifecycle hooks

## Usage Flow

1. Create panel component and attach one of the super-scroll wrapper components (list, grid, or staggered grid).
2. Initialize item count and data source in panel `YIUIOpen` or equivalent setup path.
3. Register renderer, prefab resolver, click, and optional changed/finished callbacks through system interfaces.
4. Map each index to one concrete demo item component and refresh visual state in renderer callback.
5. Use helper systems to update selection state, movement callbacks, and dynamic data refresh.

## AI-Oriented Summary

- Treat `yiuisuperscroll` as reusable infrastructure and `yiuisuperscrolldemo` as authoritative usage examples.
- For implementation, focus first on the three core components plus callback system interfaces.
- For behavior parity, mirror the demo panel/item system pairs for your chosen layout direction and list type.
- For tooling/automation, the complete component/system/enum/config inventories above are the canonical extraction from all 349 C# files.
