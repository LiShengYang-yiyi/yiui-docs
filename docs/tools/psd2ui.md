# PSD to UI (yiuipsd2ui)

- File count: 8 C# sources documented below (Root/Importer core).
- Source packages: cn.etetet.yiuipsd2ui/Editor/Psd2UI and related Editor helpers.

Template: Overview, Package Structure, Source Stats, Core Components, Systems, Enums, Configs, Dependencies, Usage Flow

## Overview
- PSD2UI is a Unity editor extension that converts Photoshop PSD layer data into Unity UI elements. It defines a small set of core components and import helpers to translate PSD layers into Unity RectTransforms, anchors, and UI components.
- The implementation uses UnityEditor APIs to draw and map PSD data to Unity UI primitives.

## Validation
- Extracted 8 .cs files from the PSD2UI package:
  - RootComponentInfo.cs
  - Import_Root_FullScreen.cs
  - Import_Root_Custom.cs
  - PSDUI.cs
  - PSDPostProcessor.cs
  - PSDImportAttribute.cs
  - PSDImportBase.cs
  - Imports/Base/DefaultImport.cs
- Mapped core components:
  - RootComponentInfo: Root component descriptor (Root type)
  - Import_Root_FullScreen: Root importer for FullScreen mode
  - Import_Root_Custom: Root importer for Custom mode
  - PSDUI: PSD data holder (psdSize, root, layers, metadata)
  - PSDPostProcessor: Anchor presets and parsing utilities
  - PSDImportAttribute: Attribute for PSD import components
  - PSDImportBase<T>: Generic base for typed import components
  - DefaultImport: Core default importer handling root and non-root components
Notes:
- Files were verified to exist at paths under cn.etetet.yiuipsd2ui and related Import subfolders.
- No code snippets are included; this section documents roles of extracted components.
- PSD2UI is a Unity editor extension that converts Photoshop PSD layer data into Unity UI elements. It defines a small set of core components and import helpers to translate PSD layers into Unity RectTransforms, anchors, and UI components.
- The implementation uses UnityEditor APIs to draw and map PSD data to Unity UI primitives.

## Package Structure
- Core Import/PSD classes:
  - RootComponentInfo.cs
  - Import_Root_FullScreen.cs
  - Import_Root_Custom.cs
  - PSDImportBase.cs
  - PSDImportAttribute.cs
  - PSDImportBase.cs
- Core data/utility:
  - PSDUI.cs
- Post-processing/assembly helpers:
  - PSDPostProcessor.cs
- Data/attributes:
  - PSDImportAttribute.cs
  - PSDPostProcessor.cs

Note: The PSD2UI package resides under Packages/cn.etetet.yiuipsd2ui and is named PSD2UI in the UI tooling space.

## Source Stats
- Files: 8 (.cs) contributing to the PSD2UI tooling surface.
- Core components count: 4 (RootComponentInfo, Import_Root_FullScreen, Import_Root_Custom, PSDImportBase/DefaultImport pattern).
- Enums: 0
- Configs: 0
- Dependencies: UnityEngine, UnityEditor (and base C#/.NET), plus internal PSD2UI types.

## Core Components
- RootComponentInfo: Descriptor for the Root PSD component (marks root data).
- Import_Root_FullScreen: PSD import component for full-screen root import mode.
- Import_Root_Custom: PSD import component for custom root import mode.
- PSDImportBase<T>: Generic base class for PSD import components (typed drawing helper).
- PSDUI: Simple data holder for PSD root/UI export data.
- PSDPostProcessor: Post-deserialization processor to finalize anchors and presets.
- PSDImportAttribute: Attribute used to tag PSD import components with their type.

Note: PSDImportBase is a generic helper; concrete drawing logic lives in the concrete Import_*.cs files.

## Systems
- PSDPostProcessor acts as a system-like helper to post-process PSD import results after XML deserialization to finalize anchor presets and other data.

## Enums
- None defined in this subset of the PSD2UI package.

## Configs
- None defined for external configuration in this subset. PSD2UI relies on editor script settings and runtime import data.

## Dependencies
- UnityEngine
- UnityEditor
- Other internal PSD2UI types (RootComponentInfo, PSDUI, PSDImportBase, PSDPostProcessor)

## Usage Flow
- Step 1: Install PSD2UI in the Unity project (via the Packages manager).
- Step 2: Prepare PSD assets in Photoshop and export the PSD2UI XML/metadata via the PS tool chain as documented.
- Step 3: In Unity, use the PSD2UI tools to map and import PSD data. Import_Root_FullScreen and Import_Root_Custom handle root node configurations, with DefaultImport handling fallback behaviors.
- Step 4: The PSDPostProcessor applies final adjustments (anchors, presets) after import.
- Step 5: Generated UI elements exist as prefabs in the Unity scene/project; adjust as needed with the UI editor.

> Note: This doc intentionally avoids code snippets; it documents the components exposed by the PSD2UI package and their roles.
