# Red Dot (yiuireddot)

## Scope

- Package: `cn.etetet.yiuireddot`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuireddot`
- Total C# files scanned: 48
- This document covers runtime red-dot graph/count logic, bind components, debug UI panel systems, event bridge, and editor key/config tooling.

## Package Structure

- `Runtime/Mgr`: manager init, public API, dirty refresh loop, and key asset loading
- `Runtime/Data`: red-dot node model, dirty write model, operation stack models
- `Runtime/Config`: relation config asset/data models
- `Runtime/Key`: key asset/data models and reflection helper
- `Runtime/Bind`: MonoBehaviour red-dot binders for show/count rendering
- `Scripts/ModelView/Client/YIUIComponent/RedDot`: debug panel/item components and click event payloads
- `Scripts/HotfixView/Client/YIUISystem/RedDot`: debug panel/item behavior systems
- `Scripts/Model/Share` + `Scripts/HotfixView/Client/System`: key constants and scene event bridge
- `Editor/RedDot` + `Editor/YIUIAutoTool`: key/config edit modules, generation helpers, DAG checks

## High-Level Architecture

- `RedDotMgr` builds all runtime nodes from key/config assets and controls updates through sync or dirty-batch modes.
- `RedDotData` represents one node with parent-child links, tips switch state, count aggregation, and change callbacks.
- Leaf-node count changes propagate upward recursively to parent nodes.
- Runtime bind components (`RedDotBind` family) subscribe to node changes and update GameObject visibility/text.
- `RedDotPanelComponentSystem` provides an inspect/debug UI for key search, parent-child navigation, and stack trace inspection.
- Editor tooling maintains key definitions, relation configs, and generation assets.

## Components

- `RedDotMgr`
- `RedDotData`
- `RedDotStack`
- `FirstRedDotChangeData`
- `RedDotBind`
- `RedDotTextBind`
- `RedDotTmpBind`
- `RedDotPanelComponent`
- `RedDotDataItemComponent`
- `RedDotStackItemComponent`

## Systems

- `RedDotMgr` (partial set: `RedDotMgr`, `RedDotMgr_API`, `RedDotMgr_Dirty`, `RedDotMgr_KeyAsset`)
- `RedDotStackHelper`
- `RedDotKeyHelper`
- `RedDotPanelComponentSystem`
- `RedDotDataItemComponentSystem`
- `RedDotStackItemComponentSystem`
- `RedDotPanelComponentSystemGen`
- `RedDotDataItemComponentSystemGen`
- `RedDotStackItemComponentSystemGen`
- `On_Event_RedDot_Change_Handler`
- `GM_OpenRedDotPanel`
- `UIRedDotModule`
- `UIRedDotConfigView`
- `UIRedDotConfigDAG`
- `UIRedDotConfigEditorData`
- `UIRedDotKeyEditorData`
- `UIRedDotKeyView`
- `UIRedDotKeyEditorHelper`
- `UICreateRedDotKeyCode`
- `UICreateRedDotKeyData`
- `UICreateRedDotKeyGet`
- `RedDotConfigAsset_Extend`
- `RedDotKeyAsset_Extend`

## Enums

- `ERedDotOSType`
- `UIRedDotConfigView.ERedDotConfigViewIndexType`
- `UIRedDotKeyView.ERedDotKeyViewIndexType`
- `UIRedDotModule.EUIRedDotViewType`

## Configs and Data Models

- Runtime config/key assets:
  - `RedDotConfigAsset`
  - `RedDotConfigData`
  - `RedDotKeyAsset`
  - `RedDotKeyData`
- Runtime state payloads:
  - `FirstRedDotChangeData`
  - `RedDotStack`
- ET key constants and event payload:
  - `ERedDotKeyType`
  - `Event_RedDot_Change`
- Editor config/state payloads:
  - `UIRedDotConfigEditorData`
  - `UIRedDotKeyEditorData`
  - `UICreateRedDotKeyData`
  - `RedDotLinkData`

## UI-Related Classes (Complete)

- Runtime bind UI classes:
  - `RedDotBind`
  - `RedDotTextBind`
  - `RedDotTmpBind`
- Debug panel UI entities/systems:
  - `RedDotPanelComponent`
  - `RedDotDataItemComponent`
  - `RedDotStackItemComponent`
  - `RedDotPanelComponentSystem`
  - `RedDotDataItemComponentSystem`
  - `RedDotStackItemComponentSystem`
- Generated debug UI wrappers:
  - `RedDotPanelComponentGen`
  - `RedDotDataItemComponentGen`
  - `RedDotStackItemComponentGen`
  - `RedDotPanelComponentSystemGen`
  - `RedDotDataItemComponentSystemGen`
  - `RedDotStackItemComponentSystemGen`
- Debug UI event payloads:
  - `OnClickParentListEvent`
  - `OnClickChildListEvent`
  - `OnClickItemEvent`

## Dependencies

- Package manifest dependency: `cn.etetet.core`.
- Runtime dependencies visible in source:
  - ET scene/event pipeline and GM command model
  - YIUI singleton/invoke/load framework integration
  - Unity MonoBehaviour/UI (`GameObject`, `Text`, optional TextMeshPro)
  - Odin Inspector/Serialization for asset/editor/runtime debug metadata

## Usage Flow

1. `RedDotMgr` loads assets and creates `RedDotData` nodes for all reflected keys.
2. Parent-child relations are built from `RedDotConfigData.ParentList`.
3. Gameplay sets leaf counts (`SetCount`) or publishes `Event_RedDot_Change`.
4. Changes propagate to parents, trigger listeners, and update bind components/UI.
5. Optional debug panel can inspect node links, change stacks, and stack source traces.
6. Editor module updates key/config assets and supports relation validation/editing workflows.

## AI-Oriented Summary

- `RedDotMgr` + `RedDotData` are the canonical runtime core; bind and panel layers are consumers on top.
- Only leaf nodes should be mutated directly; parent nodes are aggregation outputs.
- Use runtime binds for production UI and panel systems for diagnostics/troubleshooting.
- Component/system/enum/config inventories above are complete for all 48 scanned C# files.
