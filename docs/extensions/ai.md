# AI Extension

## Overview
- Package: `cn.etetet.yiuiai` (`ET.YIUI.AI`).
- Purpose: AI behavior package built on top of YIUI Behave + NPBehave, with AI config-driven tree execution, combat/stroll/battle-range nodes, and unit movement events.
- Runtime style: unit-level `AIComponent` periodically schedules behavior tree runs and manages active AI action state.

## Package Structure
- Root folders: `CodeMode/`, `Editor/`, `Scripts/`, `Luban/`.
- `CodeMode/`: generated `AIConfig` and category classes for Client/ClientServer/Server.
- `Editor/`: AI behavior class/module definitions and NP/SLATE menu integration (`YIUIBehaveModuleAI`).
- `Scripts/Model`: AI components, command objects, events, node data classes, and constants.
- `Scripts/Hotfix`: AI component systems and NP action systems for AI nodes.
- No dedicated runtime asmdef was detected in this snapshot (only `Editor/.Editor.asmdef`).

## Source Stats
- C# files: 37.
- Approx. C# lines: 2,460.
- Distribution: `Scripts` 20, `Editor` 11, `CodeMode` 6.

## Core Components
- `AIComponent`: unit AI controller (config binding, behavior tree child reference, timer, current AI action state).
- `MarkBattleRangeComponent`: stores leash/return point and range for disengage/back-to-mark behavior.
- `AAIHandler`: base AI handler abstraction hook.
- `AIBehaveCommand`: `IBehaveCommand` implementation that maps `AIConfig` to behavior tree execution command payload.

## Systems
- `AIComponentSystem`
- `MarkBattleRangeComponentSystem`
- `NP_CommonBattleBattleRangeDataAIActionSystem`
- `NP_CommonBattleBattleRangeDataAISystem`
- `NP_CommonBattleFightingDataAIActionSystem`
- `NP_CommonBattleFightingDataAISystem`
- `NP_CommonCommonNullDataAIActionSystem`
- `NP_CommonCommonNullDataAISystem`
- `NP_CommonCommonStrollDataAIActionSystem`
- `NP_CommonCommonStrollDataAISystem`

## Enums
- No enum declarations were detected in this package.

## Configs
- `AIConfig`
- `AIConfigCategory`

## Dependencies
- Package manifest dependencies: none declared.
- Editor asmdef: `.Editor` (no explicit references).
- Runtime coupling in source:
  - YIUI Behave runtime (`BehaveComponent`, `NPBehaveTreeChild`, `Event_BehaveHotReload`, `IBehaveCommand`).
  - Box2D-related gameplay helpers in AI nodes (`B2S_ColliderComponent`, `ColliderBattleRangeComponent`, `EColliderType`) for target acquisition.
  - Combat/gameplay systems (`TargetsComponent`, `ThreatComponent`, `SkillComponent`, camp relationship checks).
  - AI config fields (`Id`, `Interval`, `TreeName`, numeric bundle) drive scheduling and selected tree.

## Usage Flow
- AI is attached to a `Unit` through `AIComponent` and initialized from `AIConfig` id or config object.
- `AIComponentSystem` starts a repeated frame timer (`TimerInvokeType.AITimer`) via `BehaveFrameTimerComponent`.
- On each tick, AI builds an `AIBehaveCommand` and runs a behavior tree through the owner unit's `BehaveComponent`.
- Active node systems (battle range, fighting, stroll, null) run NP action logic and update current AI action ownership.
- Combat nodes query targets/threat and may use physics overlap checks to find valid enemies before skill execution loops.
- On behavior hot reload, matching trees are cancelled/rebuilt and AI restarts with refreshed serialized behavior resources.
