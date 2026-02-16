# Numeric
## Overview
- Numeric is a layered ET/YIUI numeric-value framework with three related packages:
  - `cn.etetet.yiuinumeric`: runtime numeric core, event dispatch, handlers, and editor tooling.
  - `cn.etetet.yiuinumericconfig`: Luban-generated config schema/category package used by numeric runtime.
  - `cn.etetet.yiuinumericdemo`: demo handlers and watcher examples for integration patterns.
- The system models numeric values as `int -> long` storage with typed accessors (`int/long/float/bool`) and formula-driven final values.
- Numeric changes can trigger:
  - direct value updates,
  - formula recomputation,
  - affect-chain updates,
  - static and dynamic event handlers.

## Package Structure
- `cn.etetet.yiuinumeric`
  - `Scripts/Model/Share/Numeric/Core`: core entities and constants (`NumericDataComponent`, `NumericData`, `NumericConst`, `NumericConfigData`).
  - `Scripts/Hotfix/Share/System`: `NumericDataComponentSystem` partial methods (init/get/set/change/add/subtract/copy/difference/push).
  - `Scripts/Hotfix/Share/Data`: `NumericDataExtend` partial implementation and numeric algorithm internals.
  - `Scripts/Model/Share/Numeric/Handler`: static/dynamic numeric handler abstractions and registries.
  - `Scripts/Model/Share/Numeric/Event`: invoke/event payload structs.
  - `Scripts/Hotfix/Share/Formula`: formula invoke handler(s).
  - `Editor/*`: numeric generation and debug tooling.
- `cn.etetet.yiuinumericconfig` (template package)
  - `CodeMode/Model/{Client,ClientServer,Server}/LubanGen/Config`: generated enums, beans, categories.
  - `Scripts/Hotfix/Share/Affect`: generated affect invoke handlers.
  - `Scripts/Model/Share/Config`: config extension partials.
- `cn.etetet.yiuinumericdemo` (template package)
  - `Scripts/Hotfix/Share/Demo`: static numeric handler demos.
  - `Scripts/HotfixView/Client`: dynamic watcher demo.
  - `Scripts/Model/Share`: demo component/config extensions.

## Source Stats
- Upstream source scope for this task: **132 files** (provided input scope).
- C# files discovered under package root via glob: **100 files** (glob result cap reached).
- Additional C# counting from source folders:
  - `yiuinumeric/Scripts`: 43
  - `yiuinumericconfig` template: 71
  - `yiuinumericdemo` template: 11
- Runtime API is split as partial classes across many files (`NumericDataExtend`, `NumericDataComponentSystem`) to keep operation groups isolated.

## Core Components
- Runtime data and containers:
  - `NumericDataComponent`
  - `NumericData`
  - `NumericConst`
  - `NumericConfigData` (runtime partial extension)
  - `NumericDictionaryPool<K,V>`
- Numeric event payloads:
  - `Invoke_Numeric_CreateNumericData`
  - `Invoke_NumericFormula`
  - `NumericChange`
  - `NumericGMChange`
  - `NumericAffect`
- Handler infrastructure:
  - `NumericHandlerAttribute`
  - `NumericHandlerComponent`
  - `NumericHandlerDynamicAttribute`
  - `NumericHandlerDynamicComponent`
  - `INumericHandler`, `NumericHandlerSystem<T>`
  - `INumericHandlerDynamic*`, `NumericHandlerDynamicSystem<T1,T2,T3>`
- Runtime helper/entry classes:
  - `NumericDataExtend` (partial static)
  - `NumericCheck`
  - `NumericChangeHelper`
  - `NumericLocalization`
  - `On_Invoke_Numeric_CreateNumericData_Handler`
  - `On_Invoke_NumericFormula_Handler_0_0`

## Systems
- `NumericDataComponentSystem` (partial static system for `NumericDataComponent`)
  - Entity lifecycle: `Awake`, `Destroy`, `Deserialize`.
  - Init: `InitSet`, `InitToServer`.
  - Read: `GetAsBool`, `GetAsFloat`, `GetAsInt`, `GetAsLong`, `GetRealValue`, `GetObjectValue`, `GetNumericDic`.
  - Write: `Set`, `SetUnCheck`, `SetNoEvent`, `SetNoEventUnCheck`.
  - Delta write: `Change`, `ChangeUnCheck`, `ChangeNoEvent`, `ChangeNoEventUnCheck`.
  - Data merge/calc: `Copy`, `Add`, `AddChange`, `Subtract`, `SubtractChange`, `GetDifference`.
  - Event push: `PushEvent`, `PushEventAll`.
- Related event-dispatch systems:
  - `NumericChangeEvent_NotifyHandler`: routes `NumericChange` to static and dynamic handler components.
  - `NumericAffectInvokeHandler_*` (config package): applies generated affect rules when one numeric impacts another.

## Enums
- Core numeric config enums (generated in `yiuinumericconfig`):
  - `ENumericType`
  - `ENumericValueType`
  - `ENumericValueLimitType`
  - `ENumericDefinitionType`
  - `ENumericNoticeType`
  - `ENumericTag`
- Notes:
  - `ENumericType` encodes base/final/growth slot semantics by numeric id layout.
  - `ENumericValueType` controls typed getter expectations and validation behavior.

## Configs
- Primary config beans:
  - `NumericConfigData` (dictionary payload for initialization)
  - `NumericFormulaConfig`
  - `NumericValueCheckConfig`
  - `NumericValueLimitConfig`
  - `NumericValueAffectConfig`
  - `NumericLocalizationConfig`
- Category singletons (lookup surfaces):
  - `NumericFormulaConfigCategory`
  - `NumericValueCheckConfigCategory`
  - `NumericValueLimitConfigCategory`
  - `NumericValueAffectConfigCategory`
  - `NumericLocalizationConfigCategory`
- Limit data polymorphism:
  - `NumericValueLimitData`
  - `NumericValueLimitNone`
  - `NumericValueLimitNumber`
  - `NumericValueLimitNumeric`
  - `NumericValueLimitNumericAdd`
  - `NumericValueLimitFormula`
- Demo config:
  - `NumericDemoConfig`
  - `NumericDemoConfigCategory`

## Dependencies
- Package-level dependency:
  - `cn.etetet.yiuicodeanalysis` (from `cn.etetet.yiuinumeric/package.json`).
- Runtime framework dependencies (by usage/imports):
  - ET entity/event/task/runtime abstractions (`Entity`, `EventSystem`, `ETTask`, invoke/event attributes).
  - Luban generated config runtime (`Luban.BeanBase`, category patterns).
  - MongoDB BSON attributes for serialization in numeric data entities.
- Editor assembly references (`ET.YIUI.Numeric.Editor.asmdef`):
  - `ET.Core`, `ET.Core.Editor`, `ET.Model`, `ET.Hotfix`, `ET.HotfixView`.

## Usage Flow
1. Load numeric config (`NumericConfigData.ConfigData` and related categories) from Luban-generated config tables.
2. Create `NumericData` from config via invoke pipeline (`Invoke_Numeric_CreateNumericData` -> `On_Invoke_Numeric_CreateNumericData_Handler`) or `NumericDataExtend.Create*` helpers.
3. Attach/add `NumericDataComponent` to target entity; `Awake` binds owner entity into `NumericData`.
4. Initialize runtime values using `InitSet` (recompute results + apply limit priority) or `InitToServer` (sync precomputed server values).
5. Read/write through `NumericDataComponentSystem` only (typed getters + `Set/Change/...` APIs), not by direct dictionary mutation.
6. On writes, `NumericDataExtend.ChangeByKey` handles value checks, limit clamping, affect-chain invoke, formula recompute (`Invoke_NumericFormula`), then optional event publish.
7. `NumericChange` events are distributed by `NumericChangeEvent_NotifyHandler` into:
   - static handlers (`NumericHandlerComponent` + `NumericHandlerAttribute`),
   - dynamic handlers (`NumericHandlerDynamicComponent` + `NumericHandlerDynamicAttribute`).
8. Demo package provides practical examples for both static numeric listeners and dynamic watcher-style listeners.
