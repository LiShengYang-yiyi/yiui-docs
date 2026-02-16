# Auto Battle Extension

## Overview
- Package: `cn.etetet.yiuiautobattle` (`ET.YIUI.AutoBattle`), an Auto Battle demo extension for ET/YIUI.
- Purpose: creates and manages per-player battle sub-scenes, battle data, unit spawning, movement, and enter/exit lifecycle events.
- Runtime style: ET `Component + System + Event/Invoke` pattern with staged battle pipeline (`EnterLoad -> Enter1..4 -> EnterAfter`, and matching exit stages).

## Package Structure
- Root folders: `CodeMode/`, `Editor/`, `Runtime/`, `Scripts/`, `Luban/`.
- `CodeMode/`: generated config classes and categories for Client/ClientServer/Server.
- `Scripts/Model`: model-side entities, events, invoke structs, enums, and data containers.
- `Scripts/Hotfix`: runtime systems, factories, helpers, and invoke/event handlers.
- `Scripts/HotfixView` + `Scripts/ModelView`: client-side view events and movement/view sync logic.

## Source Stats
- C# files: 93.
- Approx. C# lines: 5,420.
- Distribution: `Scripts` 75, `CodeMode` 15, `Runtime` 3.
- Key generated configs repeated for Client/ClientServer/Server variants.

## Core Components
- `AutoBattleSceneComponent`: scene-level manager for player battle instances (`CreateBattle/GetBattle/RemoveBattle/HasBattle`).
- `AutoBattleDataComponent`: battle data root, stores selected map and derived battle id.
- `AutoBattleUnitComponent`: per-unit battle marker/state container.
- `AutoBattleMoveComponent`: movement logic carrier for battle units.
- `AutoBattleMoveViewComponent`: visual movement sync side.
- `CurrentSceneSubTypeComponent`, `UnitySceneComponent`: scene mode and Unity scene bridge helpers.

## Systems
- `AutoBattleDataComponentSystem`
- `AutoBattleMoveComponentSystem`
- `AutoBattleMoveViewComponentSystem`
- `AutoBattleSceneChildSystem`
- `AutoBattleSceneComponentSystem`
- `AutoBattleUnitDataChildSystem`
- `CurrentSceneSubTypeComponentSystem`
- `CurrentScenesComponentSystem`
- `ResourcesLoaderComponentSystem`
- `UnitySceneComponentSystem`

## Enums
- `ECurrentSceneSubType`

## Configs
- `AutoBattleFormationConfig`
- `AutoBattleFormationConfigCategory`
- `AutoBattleMapConfig`
- `AutoBattleMapConfigCategory`

## Dependencies
- Package manifest dependencies: none declared in `package.json`.
- Assembly definitions: `ET.YIUI.AutoBattle`, `ET.YIUI.AutoBattle.Editor`, plus ignore asmdef for packaging mode.
- External/runtime coupling observed in source:
  - ET core patterns (`EntitySystem`, `EventSystem`, scene/entity hierarchy).
  - Unity math types (`Unity.Mathematics.float3/quaternion`) in config and spawn paths.
  - Unit/player/scene framework types from the ET game stack.

## Usage Flow
- Enter request starts from client helper (`AutoBattleHelper.EnterBattle`) and invokes `Invoke_AutoBattle_Enter`.
- Enter handler validates `AutoBattleMapConfig`, gets `AutoBattleSceneComponent`, and creates a per-player `AutoBattleSceneChild`.
- Battle scene is created, battle data built from config, then enter events are published in strict staged order.
- Unit creation is routed through `AutoBattleUnitFactory`, publishing unit-create phases (`UnitCreate1/2/3`) for layered setup.
- During runtime, scene/unit/move/view systems maintain battle state and movement/view synchronization.
- Exit request invokes `Invoke_AutoBattle_Exit`, then executes exit stages (`ExitBefore`, `Exit1..4`, `ExitAfter`) for controlled teardown.
