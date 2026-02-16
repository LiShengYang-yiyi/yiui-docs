# Condition System

## Overview

The Condition system provides a scene-scoped rule evaluation and listener pipeline for YIUI + ET projects.

- Core package: `cn.etetet.yiuicondition` (runtime manager, listener orchestration, handler contracts)
- Config package: `cn.etetet.yiuiconditionconfig` (Luban-generated condition/group data models)
- Demo package: `cn.etetet.yiuiconditiondemo` (reference handlers, listener registration patterns, trigger examples)
- Scope model: each `Scene` can own its own `ConditionMgr`, so condition state and listeners are isolated per scene

## Package Structure

### `cn.etetet.yiuicondition` (76 files)

- `Scripts/Model/Share/Condition/Core`: contracts, metadata, singleton registry, manager entity
- `Scripts/Model/Share/Condition/Data`: `IConditionConfig` and `IConditionCheckValue`
- `Scripts/Model/Share/Condition/ConfigExtend`: runtime adapters for generated config and custom config types
- `Scripts/Model/Share/Condition/Event`: built-in typed trigger payload structs
- `Scripts/Hotfix/Share/Condition`: check APIs, group APIs, listener add/remove/trigger flow, helper accessors
- `.Template/*`: package templates that mirror demo/config package skeletons

### `cn.etetet.yiuiconditionconfig` (36 files)

- `CodeMode/Model/Client/LubanGen/Config`: client-side generated enums + config beans + categories
- `CodeMode/Model/ClientServer/LubanGen/Config`: shared generated variants
- `CodeMode/Model/Server/LubanGen/Config`: server-side generated variants
- Same type families appear in all three model targets

### `cn.etetet.yiuiconditiondemo` (22 files)

- `Scripts/ModelView/Client/Demo`: demo components and custom config/check-value examples
- `Scripts/HotfixView/Client/Demo`: component systems showing listener registration and trigger usage
- `Scripts/HotfixView/Client/ConditionCheckSystemHandler`: concrete condition handler implementations
- `Scripts/HotfixView/Client/Event`: bootstrap event creating `ConditionMgr` on scene creation
- `Scripts/HotfixView/Client/GM`: test entry commands for all demo scenarios

## Components

All component classes extracted from the three required packages:

- `ConditionMgr` (`cn.etetet.yiuicondition`)
- `ConditionDemo1Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo2Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo3Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo4Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo5Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo6Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo7Component` (`cn.etetet.yiuiconditiondemo`)
- `ConditionDemo8Component` (`cn.etetet.yiuiconditiondemo`)

## Systems

### Core runtime systems

- `ConditionSystemSingleton`: discovers `[Condition(...)]` handlers, indexes by `(EConditionType, SceneType, CheckSystemType)`
- `ConditionMgrSystem` (partial): runtime API surface for single/group checks, listener lifecycle, and trigger dispatch
- `ConditionInfo`: wraps one resolved condition handler and executes typed checks
- `ConditionListenerInfo`: listener instance state, trigger routing, callback invocation

### Demo system classes

- `ConditionDemo1ComponentSystem`
- `ConditionDemo2ComponentSystem`
- `ConditionDemo3ComponentSystem`
- `ConditionDemo4ComponentSystem`
- `ConditionDemo5ComponentSystem`
- `ConditionDemo6ComponentSystem`
- `ConditionDemo7ComponentSystem`
- `ConditionDemo8ComponentSystem`

### Condition handler classes (demo)

- `On_ConditionCheckSystemHandler_Demo_1_Handler` (`ConditionSystem<ConditionCheckDemo>`)
- `On_ConditionCheckSystemHandler_Demo_2_Handler` (`ConditionSystem<ConditionCheckDemo, ConditionEvent_Unit>`)
- `On_ConditionCheckSystemHandler_Demo_3_Handler` (`ConditionSystem<ConditionCheckDemo, ConditionEvent_Entity>`)
- `On_ConditionCheckSystemHandler_Demo2_1_Handler` (`ConditionSystem<ConditionDemoCustom1CheckValue>`)
- `On_ConditionCheckSystemHandler_Demo2_2_Handler` (`ConditionSystem<ConditionDemoCustom1CheckValue, ConditionEvent_Entity>`)

### Event/timer/command system participants (demo)

- `On_AfterCreateCurrentScene_AddConditionMgr_Handler` (scene bootstrap event)
- `TimerInvoke_ConditionDemo1` to `TimerInvoke_ConditionDemo8` (periodic trigger emitters)
- `GM_Condition_1` to `GM_Condition_8` (manual scenario launch commands)

## Handler Interfaces

### Base interfaces

- `ICondition`: base system type contract for condition handlers
- `IConditionA`: non-generic-args check signature
- `IConditionB<B>`: generic-args check signature
- `IConditionSystem<A>`: typed check-value handler contract
- `IConditionSystem<A, B>`: typed check-value + typed-event-args handler contract

### Check/config interfaces

- `IConditionCheckValue`: marker interface for check payload objects
- `IConditionConfig`: normalized condition config contract used by runtime checks

### Handler base classes

- `ConditionSystem<A>`: abstract base for simple handlers
- `ConditionSystem<A, B>`: abstract base for handlers that require typed event payload args

## Enums

Enums extracted from `cn.etetet.yiuiconditionconfig` (present in Client, ClientServer, and Server generated models):

- `EConditionType` (`Demo`, `Demo2`)
- `EConditionId` (`Demo1`, `Demo2`)
- `EConditionGroupId` (`DemoGroup1`, `DemoGroup2`, `DemoGroup3`)
- `ECompareType` (`Equal`, `NotEqual`, `Less`, `LessEqual`, `Greater`, `GreaterEqual`)
- `EOperatorType` (`And`, `Or`)

## Config Classes

### Generated config classes (`cn.etetet.yiuiconditionconfig`)

- `ConditionConfig`: single condition definition
- `ConditionGroupConfig`: grouped condition definition (group nesting or base check list)
- `ConditionCheckData`: pair of `EConditionId` + optional runtime check value override
- `ConditionCheckValue`: abstract polymorphic base for check value payloads
- `ConditionCheckDemo`: demo concrete check value payload
- `ConditionConfigCategory`: lookup/category for `ConditionConfig`
- `ConditionGroupConfigCategory`: lookup/category for `ConditionGroupConfig`

### Runtime extension/custom config classes

- `ConditionConfig` (partial extension in `yiuicondition`): implements `IConditionConfig`
- `ConditionCheckValue` (partial extension in `yiuicondition`): implements `IConditionCheckValue`
- `ConditionCustomConfig`: base for fully runtime-created custom conditions
- `ConditionCustomCheckValue`: base for fully runtime-created custom check values
- Demo custom examples: `ConditionDemoCustom1Config`, `ConditionDemoCustom2Config`, `ConditionDemoCustom1CheckValue`

## Dependencies

### Package-level dependencies

- `cn.etetet.yiuicondition` depends on `cn.etetet.core` (declared in `package.json`)
- `cn.etetet.yiuiconditionconfig` and `cn.etetet.yiuiconditiondemo` package manifests declare no direct dependencies

### Runtime/framework dependencies observed in source

- ET framework primitives (`Entity`, `Scene`, `ETTask`, `Singleton`, `AEvent`, `ATimer`)
- YIUI invocation/event bridge (`YIUIInvokeSystem`, `[YIUIInvoke]` callback model)
- Luban generated config runtime (`ByteBuf`, generated categories/beans)
- Optional integration paths in demo (`IGMCommand`, GM command metadata)

## Usage Flow

1. Bootstrap: create/add `ConditionMgr` on scene init (demo uses `On_AfterCreateCurrentScene_AddConditionMgr_Handler`).
2. Register handlers: implement classes derived from `ConditionSystem<A>` or `ConditionSystem<A, B>` and decorate with `[Condition(SceneType, EConditionType, listenerFlag)]`.
3. Build registry: `ConditionSystemSingleton.Awake()` scans attributed handler classes and builds runtime lookup maps.
4. Prepare config: use generated `ConditionConfig`/`ConditionGroupConfig` (or custom `ConditionCustomConfig`) with compatible `IConditionCheckValue` payload types.
5. Check on demand: call `CheckCondition(...)` for single rules or `CheckGroup(...)` for grouped rules.
6. Subscribe to changes: call `AddCheckConditionListener(...)` or `AddCheckConditionGroupListener(...)` and store returned listener id.
7. Emit condition events: when state changes, call `TriggerListener(EConditionType)` or `TriggerListener(EConditionType, args)` with matching generic event payload type.
8. Callback dispatch: listener runs checks, then invokes target handler method name through `YIUIInvokeSystem` with `(listenerId, result, errorTips)`.
9. Cleanup: remove listener ids on component destroy, unless scene teardown disposes the whole `ConditionMgr` scope.

## Practical Constraints and Validation Rules

- A single `EConditionType` must map to exactly one check-value type in runtime registry.
- Group listeners require consistent check system type across all contained conditions.
- Generic trigger payload type must match listener registration generic type.
- For `DynamicCondition = true`, caller must provide runtime check value when checking.
- Group evaluation includes recursion-depth guards and supports `And`/`Or` semantics.
