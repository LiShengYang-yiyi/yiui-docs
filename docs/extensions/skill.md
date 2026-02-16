# YIUI Skill System (yiuiskill)

## Scope

- Package: `cn.etetet.yiuiskill`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuiskill`
- Total C# files scanned: 301
- This document covers runtime skill/buff/target/threat/effect behavior, NPBehave skill nodes, handlers, enums, and config surfaces.

## High-Level Architecture

- `SkillComponent` owns all learned skills for a `Unit`.
- `SkillInfoChild` is one runtime skill instance (config + runtime numeric + behavior context).
- Skill casting runs behavior trees through `BehaveComponent` and waits on `SkillWait_CastEnd`.
- Buff application/removal/effects are managed under `BuffComponent` -> `BuffChild`.
- Buff effects are dispatched through invoke handlers (`AInvokeHandler<BuffEffectInvoke>`).
- Client view effects are driven by event handlers and `EffectGameObject*` components.
- AI casting order is numeric-driven (`ENumericType.SkillAICastWeight0`) and sorted in `SkillComponentSystem`.

## Runtime Flow (Skill -> Buff -> Effect)

1. Unit loads skill list via `SkillComponent.InitializeSkillInfos`.
2. Each skill becomes one `SkillInfoChild` and is initialized from `SkillConfigCategory`.
3. Cast call enters `SkillInfoChild.Cast` with checks: owner/state/frame/cooldown.
4. Skill behavior command (`SkillBehaveCommand`) executes NPBehave tree.
5. Buff nodes create `SkillSource`, copy numeric snapshot, and add/remove buffs on targets.
6. Buff lifecycle runs: start effects, periodic execute effects, end/remove/over effects.
7. Buff effects trigger invoke handlers (damage, cure, numeric mods, etc.).
8. Events are published for gameplay and client visualization (damage tips, effect objects, threat updates).

## Core Components and Entities

## Skill Domain

- `SkillComponent` (`ComponentOf(Unit)`)
  - Owner ref + ordered list of `SkillInfoChild`.
  - Maintains AI cast priority ordering.
- `SkillInfoChild` (`ChildOf(SkillComponent)`)
  - Runtime skill instance containing:
    - `SkillInitializeData` (id/level)
    - `SkillConfig`
    - `NumericDataComponent` (skill runtime numerics)
    - `BehaveComponent` and `BehaveFrameComponent` references

## Buff Domain

- `BuffComponent` (`ComponentOf(Unit)`)
  - Multi-index runtime store for buffs:
    - by instance id
    - by buff id
    - by base buff id
    - by group
    - by remove type
  - Client-side visible buff index (UNITY path).
- `BuffChild` (`ChildOf(BuffComponent)`)
  - Full runtime buff state:
    - source/creator/owner
    - timing and frame lifecycle
    - execute count/layer/remove flags
    - effect phase flags (`InitEffect`, `EndEffect`, `RemoveEffect`, `EndRemoveEffect`)
- `BuffModNumericChange` (`ComponentOf(BuffChild)`)
  - Runtime modifier component that applies/reverts numeric deltas on add/destroy.

## Target/Threat Domain

- `TargetsComponent` (`ComponentOf`) stores target set for arbitrary parent entity.
- `ThreatComponent` (`ComponentOf(Unit)`) manages threat children.
- `ThreatInfo` (`ChildOf(ThreatComponent)`) stores one unit's threat value.

## Skill-Buff Bridge Component

- `SkillEvent1Listener` (`ComponentOf(BuffChild)`, dynamic event listener)
  - Reacts to damage events and can chain-add follow-up buffs.

## Client Effect Domain

- `EffectGameObjectComponent` (`ComponentOf(Unit)`)
- `EffectGameObjectChild` (`ChildOf(EffectGameObjectComponent)`)
- `EffectMoveToComponent` (`ComponentOf(EffectGameObjectChild)`)
- `EffectMoveToBezierComponent` (`ComponentOf(EffectGameObjectChild)`)

## Systems

## Core Skill Systems

- `SkillComponentSystem`
  - Initializes owner, builds/removes skill children, sorts skills by cast weight.
  - Provides cast entry (`Cast`) and AI auto-cast (`AICast`).
- `SkillInfoChildSystem`
  - Resolves config, initializes skill numerics and level.
  - Executes cast pipeline with cancel handling and cooldown reset.
- `TargetsComponentSystem`
  - Add/remove/clear targets, filtered list by `EUnitStateType`.
- `ThreatComponentSystem`
  - Threat add/reduce/remove, distance validation, max/min/random threat selection.

## Buff Core Systems

- `BuffComponentSystem`
  - Base awake/destroy hooks.
- `BuffComponentSystem_Add`
  - Add buff, create `BuffChild`, maintain all indexes, apply conflict/cover/replace rules.
- `BuffComponentSystem_Remove`
  - Remove by id/base/group/remove-type/instance; supports layered decrement then removal.
- `BuffComponentSystem_Get`
  - Query total layers and buff instance lists.
- `BuffComponentSystem_Filter`
  - Predicate checks (exist/non-exist + creator + layer range).
- `BuffChildSystem`
  - Frame lifecycle update, reset runtime data, trigger periodic execution, force-remove on destroy.
- `BuffChildSystem_Life`
  - Effect phase orchestration: start/execute/end/remove/over.
- `BuffChildSystem_Effect`
  - Dispatches `BuffEffectInvoke` by effect type.
- `BuffChildSystem_Remove`
  - Centralized remove path with effect-phase rules and event publication.
- `BuffChildSystem_Helper`
  - Numeric accessors for source/tree/skill numeric contexts, source procedure recording.
- `BuffModNumericChangeSystem`
  - Applies numeric delta on awake, reverts on destroy.

## Buff Formula Systems

- `BuffEffectFormulaHelper`
  - Invokes formula handlers by formula id.
- `FormulaHelper`
  - Shared formula utility placeholders/helpers.
- Generated formula handlers:
  - `BuffEffectFormulaInvokeHandler_0_1`
  - `BuffEffectFormulaInvokeHandler_0_2`

## Buff/Skill Effect Handlers (Invoke/Event)

- Invoke handlers:
  - `On_BuffEffectInvoke_Damage_Handler`
  - `On_BuffEffectInvoke_Cure_Handler`
  - `On_BuffEffectInvoke_ModNumericChange_Handler`
  - `On_BuffEffectInvoke_ModSkillLevelNumericChange_Handler`
  - `BuffEffectFormulaInvokeHandler_0_1`
  - `BuffEffectFormulaInvokeHandler_0_2`
- Event handlers:
  - `OnBuffEffectEvent_Damage_AddThreatHandler`
  - `OnBuffEffectEvent_DamageHandler` (client)
  - `OnBuffEffectEvent_CureHandler` (client)
  - `On_Event_SkillView_CreateEffectGameObject_Handler` (client)
  - `OnEvent_SkillView_EffectGameObject_Handler` (client)
  - `OnEvent_Skill_Cancel_DestroyEffect_Handler` (client)

## NPBehave Skill Node Systems

The package includes NPBehave action systems for skill graph execution in these groups:

- Common Buff
  - `NP_CommonBuffAddOrRemoveDataSkillSystem`
  - `NP_CommonBuffAddOrRemoveDataSkillActionSystem`
  - `NP_CommonBuffEventDataSkillSystem`
  - `NP_CommonBuffEventDataSkillActionSystem`
  - `SkillEvent1ListenerSystem`
- Common Event
  - `NP_CommonEventCasEndDataSkillSystem`
  - `NP_CommonEventCasEndDataSkillActionSystem`
- Common Filtrate
  - `NP_CommonFiltrateBuffDataSkillSystem`
  - `NP_CommonFiltrateBuffDataSkillActionSystem`
  - `NP_CommonFiltrateCountDataSkillSystem`
  - `NP_CommonFiltrateCountDataSkillActionSystem`
  - `NP_CommonFiltrateNumericDataSkillSystem`
  - `NP_CommonFiltrateNumericDataSkillActionSystem`
  - `NP_CommonFiltrateNumericMaxHPRatioDataSkillSystem`
  - `NP_CommonFiltrateNumericMaxHPRatioDataSkillActionSystem`
  - `NP_CommonFiltrateRelationshipDataSkillSystem`
  - `NP_CommonFiltrateRelationshipDataSkillActionSystem`
  - `NP_CommonFiltrateSelfDataSkillSystem`
  - `NP_CommonFiltrateSelfDataSkillActionSystem`
  - `NP_CommonFiltrateStateDataSkillSystem`
  - `NP_CommonFiltrateStateDataSkillActionSystem`
  - `NP_CommonFiltrateUnitTypeDataSkillSystem`
  - `NP_CommonFiltrateUnitTypeDataSkillActionSystem`
- Common Numeric
  - `NP_CommonNumericCheckRealDataSkillSystem`
  - `NP_CommonNumericCheckRealDataSkillActionSystem`
  - `NP_CommonNumericGetBoolDataSkillSystem`
  - `NP_CommonNumericGetBoolDataSkillActionSystem`
  - `NP_CommonNumericGetFloatDataSkillSystem`
  - `NP_CommonNumericGetFloatDataSkillActionSystem`
  - `NP_CommonNumericGetIntDataSkillSystem`
  - `NP_CommonNumericGetIntDataSkillActionSystem`
  - `NP_CommonNumericGetLongDataSkillSystem`
  - `NP_CommonNumericGetLongDataSkillActionSystem`
  - `NP_CommonNumericGetRealDataSkillSystem`
  - `NP_CommonNumericGetRealDataSkillActionSystem`
- Common Target
  - `NP_CommonTargetCopyListDataSkillSystem`
  - `NP_CommonTargetCopyListDataSkillActionSystem`
  - `NP_CommonTargetCreateBox2DDataSkillSystem`
  - `NP_CommonTargetCreateBox2DDataSkillActionSystem`
  - `NP_CommonTargetCreateCircleColliderDataSkillSystem`
  - `NP_CommonTargetCreateCircleColliderDataSkillActionSystem`
  - `NP_CommonTargetDestroyBox2DDataSkillSystem`
  - `NP_CommonTargetDestroyBox2DDataSkillActionSystem`
  - `NP_CommonTargetGetTargetsDataSkillSystem`
  - `NP_CommonTargetGetTargetsDataSkillActionSystem`
  - `NP_CommonTargetHaveTargetsDataSkillSystem`
  - `NP_CommonTargetHaveTargetsDataSkillActionSystem`
  - `NP_CommonTargetLookAtDataSkillSystem`
  - `NP_CommonTargetLookAtDataSkillActionSystem`
  - `NP_CommonTargetMoveToDataSkillSystem`
  - `NP_CommonTargetMoveToDataSkillActionSystem`
  - `NP_CommonTargetSelectDataSkillSystem`
  - `NP_CommonTargetSelectDataSkillActionSystem`
  - `NP_CommonTargetSortDistanceDataSkillSystem`
  - `NP_CommonTargetSortDistanceDataSkillActionSystem`
  - `NP_CommonTargetSortHPDataSkillSystem`
  - `NP_CommonTargetSortHPDataSkillActionSystem`
  - `NP_CommonTargetSortNumericDataSkillSystem`
  - `NP_CommonTargetSortNumericDataSkillActionSystem`
  - `NP_CommonTargetSortRandomDataSkillSystem`
  - `NP_CommonTargetSortRandomDataSkillActionSystem`
- Common Unit
  - `NP_CommonUnitCreateUnitDataSkillSystem`
  - `NP_CommonUnitCreateUnitDataSkillActionSystem`
  - `NP_CommonUnitCreateUnitNullDataSkillSystem`
  - `NP_CommonUnitCreateUnitNullDataSkillActionSystem`
  - `NP_CommonUnitDeleteUnitDataSkillSystem`
  - `NP_CommonUnitDeleteUnitDataSkillActionSystem`
  - `NP_CommonUnitMoveToTargetDataDataSkillSystem`
  - `NP_CommonUnitMoveToTargetDataDataSkillActionSystem`
- Client Skill View
  - `NP_ClientAnimancerTryPlayDataSkillSystem`
  - `NP_ClientAnimancerTryPlayDataSkillActionSystem`
  - `NP_ClientAudioPlayDataSkillSystem`
  - `NP_ClientAudioPlayDataSkillActionSystem`
  - `NP_ClientGameObjectChangeGameObjectDataSkillSystem`
  - `NP_ClientGameObjectChangeGameObjectDataSkillActionSystem`
  - `NP_ClientGameObjectCreateGameObjectDataSkillSystem`
  - `NP_ClientGameObjectCreateGameObjectDataSkillActionSystem`
  - `NP_ClientGameObjectDeleteGameObjectDataSkillSystem`
  - `NP_ClientGameObjectDeleteGameObjectDataSkillActionSystem`
  - `NP_ClientGameObjectMoveToBezierTargetDataSkillSystem`
  - `NP_ClientGameObjectMoveToBezierTargetDataSkillActionSystem`
  - `NP_ClientGameObjectMoveToTargetDataSkillSystem`
  - `NP_ClientGameObjectMoveToTargetDataSkillActionSystem`

## Client Effect Systems

- `EffectGameObjectChildSystem`
  - Owns spawned `GameObject` lifetime; binds/cancels by runtime behavior tree child.
- `EffectGameObjectComponentSystem`
  - Cancels all effect children tied to a canceled tree.
- `EffectMoveToComponentSystem`
  - Linear move-to-target or move-to-position and delayed cleanup.
- `EffectMoveToBezierComponentSystem`
  - Bezier move with optional facing and delayed cleanup.

## Events and Commands

- Commands
  - `SkillBehaveCommand` (skill id/tree routing command for behavior runtime)
- Wait types
  - `SkillWait_CastEnd`
- Skill events
  - `SkillEvent_Cast`
  - `Event_Skill_Cancel`
  - `SkillEvent_TryPlayAnim` (client)
- Buff lifecycle events
  - `BuffEvent_Add`
  - `BuffEvent_Change`
  - `BuffEvent_Remove`
- Buff effect events
  - `BuffEffectInvoke`
  - `BuffEffectFormulaInvoke`
  - `BuffEffectEvent_Damage`
  - `BuffEffectEvent_Cure`

## Enums (Complete List)

### Config/Runtime shared (generated in Client/Server/ClientServer)

- `EBuffAddType`: `Replace`, `ReplaceLayer`, `Time`, `Layer`, `TimeLayer`
- `EBuffEffectType`: `None`, `Damage`, `Cure`, `ModNumericChange`, `ModSkillNumericChange`, `UseSkill`, `ModAddBuff`, `TriggerSkillEvent`, `ModNewGameObject`, `ModStateChange`, `ModSkillLevelNumericChange`
- `EBuffGroup`: `None`, `Default_1` ... `Default_10`, `Default_1000`
- `EBuffRemoveType`: `None`, `Range1`, `DontDead`, `InBattle`, `OutBattle`, `Move`, `Damage`, `CreateDamage`, `Dispersed`, `Replace`, `Cover`, `ChangeLayer`, `RefreshTime`, `Mutex`, `Force`, `System`, `Range2`, `EntityDestroy`, `TimeEnd`
- `EBuffType`: `None`
- `ESkillActionType`: `None`, `Normal`, `Skill`, `Fetter`, `Double`, `Follow`, `DodgeBack`, `HitBack`
- `ESkillType`: `None`, `Normal`, `Active`, `Passive`, `ActivePassive`, `Fetter`
- `ESourceProcedureType`: `None`, `Counter`, `UnCounter`, `Critical`, `Suppress`, `Dodge`
- `ESourceType`: `None`, `Skill`, `Buff`

### Runtime/editor enums in Scripts/Editor

- `AnimancerFadeMode`
- `EBuffMacroType`
- `EBuffQueryType`
- `EBuffToEntityType`
- `EColliderDestroyType`
- `ECreateGameObjectDataSkillType`
- `EFiltrateCountType`
- `EGetTargetsType`
- `ENodeMoveType`
- `ESelectTargetType`
- `ESelectType`
- `ESkillErrorCode`
- `ESkillMacroType`
- `ESkillMountPoint`
- `ESortTargetHPType`
- `ESortType`
- `EUnitStateType`

## Configs (Complete List)

## Primary config objects

- `SkillConfig`
- `BuffConfig`
- `BaseBuffConfig`
- `BuffEffectConfig`
- `FormulaConfig`

## Config categories

- `SkillConfigCategory`
- `BuffConfigCategory`
- `BaseBuffConfigCategory`
- `BuffEffectConfigCategory`
- `FormulaConfigCategory`

## Effect param configs

- `BuffEffectParam` (base)
- `BuffEffectParamDamage`
- `BuffEffectParamCure`
- `BuffEffectParamNumericChange`
- `BuffEffectParamSkillLevelNumericChange`

## Local config extension points

- `Scripts/Model/Share/Config/SkillConfig_Extend.cs`
- `Scripts/Model/Share/Config/BuffConfig_Extend.cs`
- `Scripts/Model/Share/Config/BaseBuffConfig_Extend.cs`
- `Scripts/Model/Share/Config/BuffEffectConfig_Extend.cs`
- `Scripts/Hotfix/Share/Buff/System/Config/BuffEffectConfigHelper.cs`

## Buff Data and Query Models

- `BuffData`: internal add/remove construction payload.
- `BuffParam`: external buff add/remove request (`BuffId`, `Layer`).
- `BuffQuery`: query selector (`Id`, `BaseId`, `Group`, `RemoveGroup`).
- `BuffFilterData`: boolean predicate data for existence checks.
- `BuffGetData`: data for layer/instance retrieval.

## Source Model

- `SkillSource : BaseSource`
  - Source type: `ESourceType.Skill`
  - Carries owner unit, runtime tree child, skill info child.
  - Provides numeric snapshot/procedure chain used by buff/effect logic.

## Dependencies

## Direct runtime dependencies observed in code

- Entity framework: `Entity`, `ComponentOf`, `ChildOf`, `EntitySystemOf`, `IAwake`, `IDestroy`, `IFrame`, `IUpdate`.
- Unit state and numeric: `Unit`, `ENumericType`, `NumericDataComponent`, `NumericConst`.
- Behavior runtime: `BehaveComponent`, `BehaveFrameComponent`, `NPBehaveTreeChild`, `IBehaveCommand`.
- Event bus: `EventSystem`, `AInvokeHandler<T>`, `AEvent<TScene, TEvent>`.
- Async/runtime services: `ETTask`, `ETCancellationToken`, `FrameSystem`, timer/frame helpers.
- Random/math: `RandomComponent`, `Unity.Mathematics`.
- Source/procedure pipeline: `BaseSource`, `SkillSource`, `BuffSource`, `ESourceProcedureType`.

## Numeric dependency hotspots

- Skill cast ordering: `ENumericType.SkillAICastWeight0`.
- Skill init/cooldown: `SkillLevel1`, `SkillInitCD0`, `SkillCD0`, `SkillNextCastFrame0`.
- HP effect resolution: `ENumericType.Hp0` in damage/cure handlers.
- Formula-driven values: skill power/attack and other numeric types read from source snapshots.

## Known Behavior Notes

- Several TODO markers exist in runtime paths (dynamic add/remove skill, CD change APIs, partial formula helpers).
- Formula helper file contains placeholder logic for several advanced combat modifiers.
- Some add/remove behavior depends on configured ranges in `EBuffRemoveType` (`Range1`/`Range2`) for effect phase semantics.

## AI-Oriented Summary

- To cast a skill safely, ensure `SkillComponent` is initialized and `SkillInfoChild.Cast` state checks pass.
- To add buff logic, use `BuffComponent.AddBuff` and let conflict/cover/layer logic run in system add path.
- To implement new buff effects, add a new `EBuffEffectType` mapping and corresponding `AInvokeHandler<BuffEffectInvoke>`.
- To expose visual behavior, publish/subscribe skill view events and use `EffectGameObject*` systems.
- To support formula variants, register generated `BuffEffectFormulaInvoke` handlers and map `Formula` ids in config.
