# 3D Display (yiui3ddisplay)

## Scope

- Package: `cn.etetet.yiui3ddisplay`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiui3ddisplay`
- Total C# files scanned: 26
- This document covers runtime UI 3D rendering hosts, ET child wrappers, click/drag dispatch, multi-target support, and demo panel integration.

## Package Structure

- `Runtime`: Unity-side 3D display host and helpers (`UI3DDisplay`, `UI3DDisplayCamera`, `UI3DDisplayRecord`, `YIUIConstAsset_3DDisplay`)
- `Scripts/ModelView/Client/Display`: ET-side `YIUI3DDisplayChild` runtime state partials
- `Scripts/HotfixView/Client/Display`: `YIUI3DDisplayChildSystem` partial implementations (lifecycle, API, event, async/sync, mono, multiple)
- `Scripts/ModelView/Client/Event`: click callback contracts and dispatch helper
- `Scripts/ModelView/Client/YIUIComponent/ModelDisplay` + `Scripts/HotfixView/Client/YIUISystem/ModelDisplay`: demo component/system
- `Scripts/ModelView/Client/GM` + `Scripts/HotfixView/Client/GM`: GM type and demo open command

## High-Level Architecture

- `UI3DDisplay` is the view-side entry that owns render targets, cameras, drag/click settings, and invoke dispatch.
- `YIUI3DDisplayChild` is the ET child entity that caches loaded models/cameras and tracks runtime display state.
- `YIUI3DDisplayChildSystem` orchestrates show/clear/update flow and translates pointer input into raycast click callbacks.
- `YIUI3DDisplayClickHelper` resolves typed click systems from ET type systems and executes one matching handler.
- `ModelDisplayDemoViewComponentSystem` demonstrates practical setup (`AddChild<YIUI3DDisplayChild, UI3DDisplay>` + `ShowAsync`).

## Components

- `UI3DDisplay`
- `UI3DDisplayCamera`
- `UI3DDisplayRecord`
- `YIUI3DDisplayChild`
- `ModelDisplayDemoViewComponent`

## Systems

- `YIUI3DDisplayChildSystem`
- `ModelDisplayDemoViewComponentSystem`
- `ModelDisplayDemoViewComponentSystemGen`
- `YIUI3DDisplayClickSystem<T1, T2, T3, T4>`
- `YIUI3DDisplayClickHelper`
- `YIUI3DDisplayMenuItem`
- `GM_DisplayTest1`

## Enums

- No enum types are declared in this package's 26 scanned C# files.

## Configs and Constants

- `YIUIConstAsset` (partial extension in `YIUIConstAsset_3DDisplay.cs`, adds `YIUI3DLayer`)
- `YIUI3DDisplayInvoke` (invoke key constants for drag/pointer events)
- `PackageType` (partial package id extension: `YIUI3DDisplay = 1303`)
- `EGMType` (partial GM id extension: `Display3D`)

## UI-Related Classes (Complete)

- `UI3DDisplay`
- `UI3DDisplayCamera`
- `UI3DDisplayRecord`
- `YIUI3DDisplayChild`
- `YIUI3DDisplayChildSystem`
- `ModelDisplayDemoViewComponent`
- `ModelDisplayDemoViewComponentGen`
- `ModelDisplayDemoViewComponentSystem`
- `ModelDisplayDemoViewComponentSystemGen`
- `IYIUI3DDisplayClick`
- `IYIUI3DDisplayClick<T1>`
- `YIUI3DDisplayClickSystem<T1, T2, T3, T4>`
- `YIUI3DDisplayClickHelper`

## Dependencies

- Package manifest dependency: `cn.etetet.core`.
- Runtime dependencies visible in source:
  - ET entity/system and invoke model (`Entity`, `EntityRef`, `EntitySystemOf`, `[YIUIInvoke]`)
  - YIUI runtime factory and lifecycle bridge (`YIUIFactory`, `YIUIInvokeSystem`, bind/open interfaces)
  - Unity UI/input/rendering stack (`RawImage`, `Camera`, `RenderTexture`, pointer handlers, physics raycast)

## Usage Flow

1. Add `UI3DDisplay` to a YIUI-bound view and create `YIUI3DDisplayChild` in component `YIUIInitialize`.
2. Call `ShowAsync` (or `ShowSync`) with model resource name and optional camera name.
3. System prepares temporary render texture, applies layer/culling setup, and binds object/camera state.
4. Optional interaction: enable click (`ResetOnClick`) and drag (`m_CanDrag`, `m_DragSpeed`) paths.
5. Register typed click callback through `YIUI3DDisplayClickSystem<...>` if component-specific model click handling is required.
6. On disable/destroy, render texture and shadow/layer side effects are cleaned.

## AI-Oriented Summary

- Treat `UI3DDisplay` as Unity host and `YIUI3DDisplayChildSystem` as the real runtime behavior center.
- For integration, the minimal path is: init child -> `ShowAsync` -> optional click system registration.
- Multi-target mode and click dispatch are already built into child/system partials and do not require additional framework plumbing.
- Component/system/enum/config inventories above are complete for all 26 scanned C# files.
