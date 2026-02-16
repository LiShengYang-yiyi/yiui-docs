# Box2D Extension

## Overview
- Package: `cn.etetet.yiuibox2d` (`ET.YIUI.Box2d`).
- Purpose: ET-integrated Box2DSharp physics layer with world stepping, collider lifecycle, contact-listener dispatch, collider config data, and editor/debug tooling.
- Runtime style: scene-level world component + unit-level collider component + frame-driven physics step.

## Package Structure
- Root folders: `Assets/`, `CodeMode/`, `Editor/`, `Runtime/`, `Scripts/`, `Luban/`.
- `Runtime/`: Box2DSharp core port (bodies, fixtures, joints, contacts, math, world internals) and contact listener abstraction.
- `Scripts/Model`: ET-facing components/events/config bridges and serialization config singleton.
- `Scripts/Hotfix`: ET systems for world, colliders, listeners, debug processors, helper operations.
- `CodeMode/`: generated config beans/categories for Client/ClientServer/Server.
- `Editor/`: collider data editors, menu helpers, generation/debug tooling.

## Source Stats
- C# files: 190.
- Approx. C# lines: 24,412.
- Distribution: `Runtime` 115, `Scripts` 35, `CodeMode` 34, `Editor` 6.

## Core Components
- `B2S_WorldComponent`: scene-level physics world holder (`World`, iteration settings, wait-frame task queue, tracked bodies).
- `B2S_ColliderComponent`: unit-level collider manager that creates collider children from config/data.
- `B2S_ColliderChild`: individual collider entity attached under collider component.
- `B2S_CollisionListenerComponent`: world listener component for contact callbacks.
- `B2S_DebuggerComponent`: debug draw/visualization bridge.
- `CampComponent`: unit camp affiliation for friend/foe resolution.
- `ColliderBattleRangeComponent`: reusable battle-range overlap query helper for gameplay systems.

## Systems
- `B2S_ColliderChildFrameSystem`
- `B2S_ColliderChildSystem`
- `B2S_ColliderComponentSystem`
- `B2S_CollisionListenerComponentListenerSystem`
- `B2S_CollisionListenerComponentSystem`
- `B2S_DebuggerComponentFrameSystem`
- `B2S_DebuggerComponentSystems`
- `B2S_WorldComponentFrameSystem`
- `B2S_WorldComponentSystem`
- `Box2dContactListenerSystem`
- `CampComponentSystem`
- `ColliderBattleRangeComponentSystem`
- `IContactListenerSystem`

## Enums
- `BendingModel`
- `BodyFlags`
- `BodyType`
- `ContactFlag`
- `DrawFlag`
- `EB2S_ColliderType`
- `ECamp`
- `ECampRelationship`
- `EColliderType`
- `EPAxisType`
- `FeatureType`
- `FunctionType`
- `JointType`
- `ManifoldType`
- `PointState`
- `ShapeType`
- `StretchingModel`
- `ToiState`

## Configs
- `B2S_SerializationConfig`
- `ColliderConfig`
- `ColliderConfigCategory`
- `ColliderObjectConfig`
- `ColliderObjectConfigCategory`
- `ConfigColliderData`
- `UnitCampRelationshipConfig`
- `UnitCampRelationshipConfigCategory`

## Dependencies
- Package manifest dependencies: none declared.
- Runtime asmdef references (`ET.YIUI.Box2d`): `ET.Core`, `ET.SourceGeneratorAttribute`.
- Editor asmdef references (`ET.YIUI.Box2d.Editor`): `ET.Core`, `ET.Core.Editor`, `ET.Model`, `ET.ModelView`, `ET.Hotfix`, `ET.HotfixView`, `ET.YIUI.Box2d`, `ET.YIUI.Behave`, `Unity.Mathematics`, `UnityEngine.UI`.
- Runtime coupling in source:
  - `Box2DSharp` physics types (`World`, `Body`, `Contact`, impulses/manifolds).
  - ET event system (`Box2DEvent_CreateBody`, `Box2DEvent_DestroyBody`, hot reload event).
  - Behave serialization invoke contract (`Invoke_GetSerializationBytes`) reused for physics serialized data.

## Usage Flow
- Scene initializes `B2S_WorldComponent`, which creates `World` and attaches collision-listener component.
- Frame system steps physics world each tick and wakes any tasks waiting for next physics frame.
- Unit initializes `B2S_ColliderComponent`, binds to scene world, and creates collider children from `ColliderConfig` or direct collider data.
- World add/remove body operations publish create/destroy events for debugger/observer systems.
- Contact callbacks are routed through `IContactListener` extension dispatch into registered `IContactListenerSystem` handlers.
- Gameplay queries use collider overlap/range components and camp-relationship config to convert physics contacts into combat logic.
