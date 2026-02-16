# Damage Tips (yiuidamagetips)

## Scope

- Package: `cn.etetet.yiuidamagetips`
- Source root: `C:/Unity/Project/ET/et.wow.yiui/Packages/cn.etetet.yiuidamagetips`
- Total C# files scanned: 48
- This document covers the YIUI panel integration plus embedded DamageNumbersPro runtime/config surfaces included in the package.

## Package Structure

- `Scripts/ModelView/Client/YIUIComponent/DamageTips`: YIUI panel component
- `Scripts/HotfixView/Client/YIUISystem/DamageTips`: panel behavior system
- `Scripts/HotfixView/Client/Damage`: runtime helper for damage tip display flow
- `Scripts/ModelView/Client/GM` and `Scripts/HotfixView/Client/GM`: GM enum and command entry
- `Plugins/DamageNumbersPro/Scripts`: third-party runtime and settings models
- `Plugins/DamageNumbersPro/Demo`: sample scene scripts for plugin demonstration

## High-Level Architecture

- `DamageTipsPanelComponent` is the YIUI-facing panel entry.
- `DamageTipsPanelComponentSystem` governs panel lifecycle and setup logic.
- `DamageTipsHelper` bridges gameplay events to actual number spawning/display.
- Damage number rendering and behavior are provided by embedded DamageNumbersPro classes.
- GM paths provide quick local validation of tip rendering behavior.

## Components

- `DamageTipsPanelComponent`

## Systems

- `DamageTipsPanelComponentSystem`
- `DamageTipsHelper`
- `GM_DamageTips_1`
- `GM_DamageTips_2`

## Enums

- `EGMType`
- `CombinationMethod`

## Configs and Settings

- `CollisionSettings`
- `ColorByNumberSettings`
- `CombinationSettings`
- `DNPPreset`
- `DNPPresetEditor`
- `DNP_PrefabSettings`
- `DestructionSettings`
- `DigitSettings`
- `DistanceScalingSettings`
- `FollowSettings`
- `LerpSettings`
- `PushSettings`
- `ScaleByNumberSettings`
- `ShakeSettings`
- `TextSettings`
- `VelocitySettings`

## Dependencies

- Package manifest does not declare direct package dependencies.
- Runtime dependencies visible in source:
  - YIUI panel/component lifecycle
  - ET client hotfix patterns and GM command model
  - Embedded DamageNumbersPro runtime/editor stack

## Usage Flow

1. Open the damage tips panel that owns `DamageTipsPanelComponent`.
2. Trigger tip creation through `DamageTipsHelper` from gameplay-side damage/cure events.
3. Configure number behavior through preset/settings classes (movement, shake, text, destruction, scale, color, collision).
4. Validate output and combinations using GM entry points (`GM_DamageTips_1`, `GM_DamageTips_2`).

## AI-Oriented Summary

- The package has one YIUI component and a small ET integration surface, but a broad embedded settings surface from DamageNumbersPro.
- Automation should treat settings classes as the primary configuration API and `DamageTipsHelper` as the runtime dispatch pivot.
- Component/system/enum/config inventories above are complete for all 48 scanned C# files.
