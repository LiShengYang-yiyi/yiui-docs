# Tips System (yiuitips)

## Scope

- Package: `cn.etetet.yiuitips`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuitips`
- Total C# files scanned: 21
- This document covers shared tips opening APIs, pooling/recycle flow, waitable dialogs, built-in text/message tips views, and GM validation paths.

## Package Structure

- `Scripts/ModelView/Client/YIUIComponent/Tips`: tips panel/view entities and event/data payloads
- `Scripts/HotfixView/Client/YIUISystem/Tips`: tips panel and view behavior systems
- `Scripts/HotfixView/Client/YIUISystem/Helper`: helper APIs (generic, string-resource, waitable)
- `Scripts/ModelView/Client/YIUIGen` + `Scripts/HotfixView/Client/YIUIGen`: generated bind/system wrappers
- `Scripts/ModelView/Client/GM` + `Scripts/HotfixView/Client/GM`: GM group and test commands

## High-Level Architecture

- `TipsHelper` is the public API for opening tips views by component type or resource name.
- `TipsPanelComponent` keeps per-type object pools and centralized reference counting for active tips views.
- `TipsViewComponent` tags views opened by Tips and sends recycle events (`EventPutTipsView`) on close/destroy.
- `TipsTextViewComponentSystem` handles one-shot animated text tips.
- `TipsMessageViewComponentSystem` handles confirm/cancel style dialogs and wait notifications.
- Wait variants (`OpenWait...`) attach hash-wait ids and return `EHashWaitError` results.

## Components

- `TipsPanelComponent`
- `TipsViewComponent`
- `TipsTextViewComponent`
- `TipsMessageViewComponent`
- `MessageTipsExtraData`

## Systems

- Helper API systems/classes:
  - `TipsHelper` (partials: `TipsHelper.cs`, `TipsHelper_String.cs`, `TipsHelper_Wait.cs`, `TipsHelper_Wait_String.cs`)
- ET tips systems:
  - `TipsPanelComponentSystem`
  - `TipsViewComponentSystem`
  - `TipsTextViewComponentSystem`
  - `TipsMessageViewComponentSystem`
- Generated systems:
  - `TipsPanelComponentSystemGen`
  - `TipsTextViewComponentSystemGen`
  - `TipsMessageViewComponentSystemGen`
- GM command systems:
  - `GM_TipsTest0`
  - `GM_TipsTest0_1`
  - `GM_TipsTest0_2`
  - `GM_TipsTest0_3`
  - `GM_TipsTest0_4`
  - `GM_TipsTest1`
  - `GM_TipsTest2`
  - `GM_TipsTest3`
  - `GM_TipsTest4`
  - `GM_TipsTest5`

## Enums

- No enum types are declared in this package's 21 scanned C# files.

## Configs and Data Models

- `MessageTipsExtraData` (dialog UI behavior options)
- `EventPutTipsView` (tips recycle event payload)
- `EGMType` (partial GM constant extension: `Tips`)

## UI-Related Classes (Complete)

- Core UI entities:
  - `TipsPanelComponent`
  - `TipsViewComponent`
  - `TipsTextViewComponent`
  - `TipsMessageViewComponent`
- Core UI systems:
  - `TipsPanelComponentSystem`
  - `TipsViewComponentSystem`
  - `TipsTextViewComponentSystem`
  - `TipsMessageViewComponentSystem`
- Generated UI wrappers:
  - `TipsPanelComponentGen`
  - `TipsTextViewComponentGen`
  - `TipsMessageViewComponentGen`
  - `TipsPanelComponentSystemGen`
  - `TipsTextViewComponentSystemGen`
  - `TipsMessageViewComponentSystemGen`
- UI helper/data classes:
  - `TipsHelper`
  - `MessageTipsExtraData`
  - `EventPutTipsView`

## Dependencies

- Package manifest dependency: `cn.etetet.core`.
- Runtime dependencies visible in source:
  - ET entity/system/task/timer model and dynamic events
  - YIUI panel/view/window/bind framework and hash-wait pipeline
  - Unity runtime objects and animation playback

## Usage Flow

1. Open tips via `TipsHelper.Open...` or `TipsHelper.OpenWait...` with target type/resource and `ParamVo` data.
2. `TipsPanelComponentSystem` obtains/creates a pooled view instance and re-parents it under tips root.
3. Target view opens through `IYIUIOpen<ParamVo>` and optionally configures wait behavior.
4. User actions or auto-close paths close view and trigger `EventPutTipsView` recycle.
5. Panel returns view to pool (or destroys it) and updates reference count.
6. Panel auto-closes when no active tips remain; stale pool entries are cleaned by inactivity timeout.

## AI-Oriented Summary

- Use `TipsHelper` as the only external entry; avoid direct panel manipulation in gameplay code.
- `TipsPanelComponentSystem` already handles pool/recycle/reference correctness and should remain the lifecycle authority.
- Waitable tips flows are first-class through `OpenWait...` APIs and hash-wait callbacks.
- Component/system/enum/config inventories above are complete for all 21 scanned C# files.
