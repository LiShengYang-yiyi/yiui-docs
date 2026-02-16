# Behave Extension

## Overview
- Packages: `cn.etetet.yiuibehave` (`ET.YIUI.Behave`) + `cn.etetet.yiuibehaveclass` (0 C# files in current source snapshot).
- Purpose: unified behavior authoring/runtime framework combining NPBehave behavior trees, SLATE timelines, frame scheduling, event routing, and serialization-driven resource loading.
- Runtime style: ET component-system architecture with behavior command abstraction (`IBehaveCommand`) and tree/timeline runtime objects.

## Package Structure
- `cn.etetet.yiuibehave` top-level folders: `.Template/`, `Documentation/`, `Editor/`, `Plugins/`, `Scripts/`.
- `Editor/`: behavior graph tools, code generation modules, inspectors, module menus, and editor UX.
- `Plugins/`: embedded third-party frameworks (`SLATE`, `NodeGraphProcessor`) and related editor/runtime assemblies.
- `Scripts/Model`: runtime data structures, components, events, commands, and NP/SLATE model types.
- `Scripts/Hotfix` + `Scripts/HotfixView`: runtime systems and handlers for behavior execution, events, and serialization fetch hooks.
- `cn.etetet.yiuibehaveclass`: only `Editor/` exists in this snapshot, with 0 `.cs` files detected.

## Source Stats
- `cn.etetet.yiuibehave` C# files: 651.
- `cn.etetet.yiuibehaveclass` C# files: 0.
- Approx. C# lines (`yiuibehave`): 67,374.
- Distribution (`yiuibehave`): `Plugins` 294, `Scripts` 211, `Editor` 134, `.Template` 12.

## Core Components
- `BehaveComponent`: unit-level behavior entry manager.
- `BehaveEventComponent`: scene-level event bus storage (`AllEvents`, cache/temp node maps).
- `BehaveFrameComponent`: frame clock and pause/multiplier control for behavior update cadence.
- `BehaveFrameTimerComponent`: async frame/timer scheduling bridge for behavior runtime.
- `BehaveSyncContextComponent`: synchronized context holder for behavior execution flow.
- `NPBehaveTreeChild`: concrete behavior-tree runtime instance per command/tree.
- `SlateChild`: timeline runtime child object bound to behavior or standalone command execution.
- `RandomComponent`, `ScenePauseComponent`: support components for randomization and pause state management.

## Systems
- Full detected system inventory:
- `BehaveCheckSystem`, `BehaveComponentAwakeSystem`, `BehaveComponentDestroySystem`, `BehaveComponentSystem`, `BehaveEventComponentSystem`, `BehaveEventExecuteSystem`, `BehaveEventSystem`, `BehaveFrameComponentSystem`, `BehaveFrameTimerActionSystem`, `BehaveFrameTimerComponentSystem`, `BehaveSyncContextComponentAwakeSystem`, `BehaveSyncContextComponentDestroySystem`, `BehaveSyncContextComponentFrameSystem`, `BehaveSyncContextComponentSystem`, `BehaveTimerComponentFrameSystem`, `CreateNPBehaveCodeSystem`, `CreateSlateCodeSystem`, `FrameSystem`, `FrameSystemExtensions`, `IBehaveCheckSystem`, `IBehaveEventExecuteSystem`, `IBehaveEventSystem`, `INPBehaveActionSystem`, `ISlateEnterSystem`, `ISlateExitSystem`, `ISlateInitializeSystem`, `ISlateUpdateSystem`, `NPBehaveActionSystem`, `NPBehaveTreeChildSystem`, `NP_ActionNodeDataBehaveCheckSystem`, `NP_BlackboardConditionNodeDataBehaveCheckSystem`, `NP_BlackboardMultipleConditionsNodeDataBehaveCheckSystem`, `NP_ClientLogShowDataActionSystem`, `NP_ClientLogShowDataSystem`, `NP_CommonBlackChangeValueDataActionSystem`, `NP_CommonBlackChangeValueDataSystem`, `NP_CommonBlackCheckValueDataActionSystem`, `NP_CommonBlackCheckValueDataSystem`, `NP_CommonEventRefreshDataActionSystem`, `NP_CommonEventRefreshDataSystem`, `NP_CommonEventTreeAddDataActionSystem`, `NP_CommonEventTreeAddDataSystem`, `NP_CommonEventTreeRemoveDataActionSystem`, `NP_CommonEventTreeRemoveDataSystem`, `NP_CommonEventTreeTriggerDataActionSystem`, `NP_CommonEventTreeTriggerDataSystem`, `NP_CommonLogShowDataActionSystem`, `NP_CommonLogShowDataSystem`, `NP_CommonMacroInvokeDataActionSystem`, `NP_CommonMacroInvokeDataSystem`, `NP_CommonTimeAsyncWaitDataActionSystem`, `NP_CommonTimeAsyncWaitDataSystem`, `NP_CommonTimeLineExecuteDataActionSystem`, `NP_CommonTimeLineExecuteDataSystem`, `NP_CommonTimeLineExecuteSpeedDataActionSystem`, `NP_CommonTimeLineExecuteSpeedDataSystem`, `NP_CommonTimeUpdateWaitDataActionSystem`, `NP_CommonTimeUpdateWaitDataSystem`, `NP_CommonTreeCreateChildDataActionSystem`, `NP_CommonTreeCreateChildDataSystem`, `NP_CommonTreeRemoveDataActionSystem`, `NP_CommonTreeRemoveDataSystem`, `NP_CommonTreeStopDataActionSystem`, `NP_CommonTreeStopDataSystem`, `OnBehaveEvent_CommonTreeEventBehaveSystem`, `OnBehaveEvent_CommonTreeEventSystem`, `OnBehaveEvent_CommonTreeEventUnitBehaveSystem`, `RandomComponentSystem`, `ST_ClientAnimatorTryPlayDataEnterSystem`, `ST_ClientAnimatorTryPlayDataExitSystem`, `ST_ClientAnimatorTryPlayDataSystem`, `ST_ClientLogShowDataEnterSystem`, `ST_ClientLogShowDataSystem`, `ST_CommonBehaveCreateDataEnterSystem`, `ST_CommonBehaveCreateDataSystem`, `ST_CommonLogDebugDataEnterSystem`, `ST_CommonLogDebugDataSystem`, `SampleParticleSystem`, `ScenePauseComponentSystem`, `SlateChildSystem`, `SlateEnterSystem`, `SlateExitSystem`, `SlateInitializeSystem`, `SlateUpdateSystem`, `TimerComponentSystem`

## Enums
- Full detected enum inventory:
- `ActiveState`, `ActorInitialTransformation`, `ActorReferenceMode`, `BBValueMathOperator`, `BlendInEffectType`, `BlendOutEffectType`, `CalculateMode`, `ClipWrapMode`, `ColorMode`, `ComputeOrderType`, `ContextAction`, `EActionExecuteType`, `ECodeModuleType`, `ECreateModuleType`, `ELogType`, `ENPActionType`, `ENodeSkipType`, `EST_RuntimeType`, `ESerializeModuleViewType`, `EWaiteTime2Type`, `EWaiteTimeType`, `EaseType`, `EditorPlaybackState`, `ElementType`, `ExitMode`, `FileNameMode`, `FloatMode`, `GradientColorMode`, `HandleStyle`, `IntMode`, `KeyframesStyle`, `MatchType`, `MiniTransformSpace`, `NP_BBValue_EType`, `NodeMessageType`, `NodeType`, `NumericType`, `OffsetMode`, `Operator`, `ParameterAccessor`, `ParameterType`, `PlayingDirection`, `Policy`, `Request`, `Result`, `RwFlag`, `ST_GroupType`, `StartingTransformsMode`, `State`, `StopMode`, `Stops`, `StoreMode`, `TangentMode`, `TimeStepMode`, `TrackingMode`, `TransformSpace`, `Type`, `UpdateMode`, `Vector2Mode`, `VideoRenderTarget`, `WrapMode`

## Configs
- `BehaveSerializationConfig`

## Dependencies
- Package manifest dependency: `cn.etetet.yiuicodeanalysis`.
- Main asmdef dependencies (`ET.YIUI.Behave`): `Unity.EditorCoroutines.Editor`, `com.alelievr.NodeGraphProcessor.Editor`, `com.alelievr.NodeGraphProcessor.Runtime`, `SLATE`, `ET.Model`, `ET.Core`, `ET.Core.Editor`, `Unity.Mathematics`.
- Embedded plugin asmdefs include `SLATE` and `NodeGraphProcessor` (editor/runtime).
- Runtime coupling in source:
  - NPBehave (`Root`, `Blackboard`, action/request/result flow).
  - ET event/invoke/wait abstractions (`Event_BehaveHotReload`, `Invoke_GetSerializationBytes`, `Event_BehaveComplete`).
  - YooAssets/resource pipeline via serialization-byte invoke handlers.

## Usage Flow
- Authoring starts in editor modules (`YIUIBehaveModule_*`) to create NPBehave graphs and SLATE assets.
- Runtime unit gets `BehaveComponent`; scene owns event/frame/timer/sync-context components.
- Caller builds an `IBehaveCommand`, then runs behavior tree (`NPBehaveTreeChild`) and/or creates timeline runtime (`SlateFactory`).
- `BehaveSerializationConfig` lazily fetches serialized behavior/timeline bytes on demand and caches results.
- Frame systems drive behavior-timer updates; event systems dispatch behavior-specific event subscriptions.
- On hot reload, matching trees/timelines receive dynamic events, rebuild runtime data, and continue with updated serialized resources.
