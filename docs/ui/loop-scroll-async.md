# Loop Scroll Async (yiuiloopscrollrectasync)

## Scope

- Package: `cn.etetet.yiuiloopscrollrectasync`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuiloopscrollrectasync`
- Total C# files scanned: 49
- This document covers async loop scroll runtime controls, YIUI child abstraction, and demo panel/item integrations.

## Package Structure

- `Runtime`: loop scroll rect core classes, data sources, prefab source, orientation-specific implementations
- `Runtime/Extend`: extension methods/helpers for runtime loop scroll classes
- `Scripts/ModelView/Client/LoopScroll`: `YIUILoopScrollChild` abstraction and extensions
- `Scripts/HotfixView/Client/LoopScroll`: system APIs for async data/prefab flow and click/renderer callbacks
- `Scripts/ModelView/Client/YIUIComponent/LoopScrollRectDemo`: demo view/item components
- `Scripts/HotfixView/Client/YIUISystem/LoopScrollRectDemo`: demo behavior systems
- `Editor`: inspector and menu integration for loop scroll controls

## High-Level Architecture

- Runtime layer provides reusable loop scroll rect controls for horizontal/vertical and multi-layout variants.
- YIUI layer wraps runtime cells through `YIUILoopScrollChild` and helper events.
- Data and prefab loading contracts are abstracted through async-capable system interfaces.
- Demo components/systems show standard panel setup, item rendering, and click-check flow.

## Components

- `YIUILoopScrollChild`
- `LoopScrollRectDemoPanelComponent`
- `LoopScrollRectDemoItemComponent`
- `LoopScrollHorizontalViewComponent`
- `LoopScrollVerticalViewComponent`
- `LoopScrollVerticalGroupViewComponent`

## Systems

- `YIUILoopScrollChildSystem`
- `YIUILoopScrollDataSourceSystem`
- `YIUILoopScrollPrefabAsyncSourceSystem`
- `IYIUILoopScrollDataSourceSystem`
- `IYIUILoopScrollPrefabAsyncSourceSystem`
- `YIUILoopRendererSystem`
- `YIUILoopOnClickSystem`
- `YIUILoopOnClickCheckSystem`
- `YIUILoopHelper`
- `LoopScrollRectDemoPanelComponentSystem`
- `LoopScrollRectDemoItemComponentSystem`
- `LoopScrollHorizontalViewComponentSystem`
- `LoopScrollVerticalViewComponentSystem`
- `LoopScrollVerticalGroupViewComponentSystem`
- `LoopScrollSizeHelper`
- `GM_LoopDemo_1`

## Enums

- `EGMType`
- `ELoopScrollRectDemoPanelViewEnum`
- `LoopScrollRectDirection`
- `MovementType`
- `ScrollbarVisibility`

## Configs and Data Source Models

- `YIUILoopScrollDataSource`
- `IYIUILoopScrollDataSource`
- `LoopScrollDataSource`
- `LoopScrollMultiDataSource`

## Dependencies

- Package manifest dependency: `cn.etetet.core`.
- Runtime dependencies visible in source:
  - Unity UI scroll rect ecosystem and editor tooling
  - ET/YIUI component lifecycle and system extension model
  - Async data/prefab resolution through hotfix-side system contracts

## Usage Flow

1. Add a runtime loop scroll rect variant (horizontal, vertical, or grouped/multi) to the target UI.
2. Bind `YIUILoopScrollChild`-based item logic and corresponding panel/item components.
3. Implement/attach data source and async prefab source systems for list item retrieval and item prefab creation.
4. Register renderer and click/click-check systems for item refresh and interaction.
5. Use demo systems and GM entry as reference for open/init/refresh patterns.

## AI-Oriented Summary

- `yiuiloopscrollrectasync` is a full stack: runtime controls, YIUI bridge, and demo implementations in one package.
- The key extension points are async data source and prefab source systems plus renderer/click callbacks.
- Component/system/enum/config inventories above are complete for all 49 scanned C# files.
