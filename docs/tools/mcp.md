# MCP Tools (Merged: yiuimcp + yiuiunitymcp, yiuicodeanalysis 0 files)

- Source packages merged: yiuimcp, yiuiunitymcp, and yiuicodeanalysis (0 files).
- Summary: Core MCP server tooling, tool discovery, and editor integration.

Template: Overview, Package Structure, Source Stats, Core Components, Systems, Enums, Configs, Dependencies, Usage Flow

## Overview
- MCP server exposes Unity Editor functionality to AI via JSON-RPC.
- It supports tool discovery via reflection and dispatch to main thread when Unity APIs must run on the main thread.
- The two main codebases contribute: yiuimcp (core server), yiuiunitymcp (Editor tools), and yiuicodeanalysis (none).

## Package Structure (Merged)
- yiuimcp (Unity MCP Core)
  - Editor/UnityMCP/Core: YIUIMCPBaseParams.cs, YIUIMCPExecutor.cs, YIUIMCPFlowAttribute.cs, YIUIMCPToolsAttribute.cs
  - Editor/UnityMCP/Tools: YIUIMCPTools_ExecuteMenu.cs
  - Editor: McpToolAttribute.cs, McpParamAttribute.cs, McpToolRegistry.cs, McpHttpServer.cs, McpSettings.cs, McpStdioBridge.cs
  - Editor/McpSettings.cs, Editor/JsonHelper.cs
  - DotNet related proxy tooling (not all files shown here)
- yiuiunitymcp (Editor Tools for MCP)
  - Editor/TTools: UnityEditorTools.cs, AssetTools.cs, ComponentTools.cs, ConsoleTools.cs
  - Editor/Proxy: McpProxyManager.cs
  - Editor: McpSettings.cs, McpHttpServer.cs
- yiuicodeanalysis: 0 files

## Source Stats (Merged)
- Approximate total CS files across merged MCP packages: ~76 files.
- Enums used across MCP: EventType (from YIUIEventBindTools.cs), StepStatus (from FlowCommon.cs).
- Core components include: YIUIMCPBaseParams, YIUIMCPExecutor, YIUIMCPToolsAttribute, YIUIMCPFlowAttribute, YIUIMCPTools_ExecuteMenu, McpToolAttribute, McpToolRegistry, McpHttpServer, McpStdioBridge, McpSettings, JsonHelper, McpProxyManager.
- Editor tools include: UnityEditorTools, AssetTools, ComponentTools, ConsoleTools.
- Configs: McpSettings
- Other: JsonHelper, McpHttpServer, McpStdioBridge, McpProxyManager

## Core Components
- YIUIMCPBaseParams: Base parameter for MCP tools (timeout, delays).
- YIUIMCPExecutor: Central atomic executor handling timeout and lifecycle.
- YIUIMCPToolsAttribute: Tool metadata (name, description).
- YIUIMCPFlowAttribute: Flow metadata for tools (if used).
- YIUIMCPTools_ExecuteMenu: Tool for executing Unity menu items.
- McpToolAttribute: Attribute marking a method as an MCP tool.
- McpToolRegistry: Scans assemblies for MCP tools and builds a registry.
- McpHttpServer: HTTP JSON-RPC server inside Unity Editor.
- McpStdioBridge: Optional stdio bridge for external tooling.
- McpSettings: Settings for MCP (port, auto-start).
- JsonHelper: Lightweight JSON serializer/deserializer.
- McpProxyManager: Manages the external MCP proxy process (start/stop).

## Core Components Details
- YIUIMCPBaseParams: Base class for all MCP tool parameters; includes fields for delay and timeout configuration.
- YIUIMCPExecutor: Encapsulates the execution flow for MCP tools including timeout handling and pre/post actions.
- YIUIMCPToolsAttribute: Attaches human-friendly metadata to MCP tools (name/description) for UI/schema generation.
- YIUIMCPFlowAttribute: Optional metadata to describe complex tool flows.
- YIUIMCPTools_ExecuteMenu: Exposes a tool to trigger Unity Editor menu items programmatically.
- McpToolAttribute: Core attribute to register a static method as an MCP Tool with name/description.
- McpToolRegistry: Scans loaded assemblies to collect all MCP tools, building a lookup for name -> tool info.
- McpHttpServer: In-editor HTTP server implementing JSON-RPC interface for MCP operations.
- McpStdioBridge: Optional bridge to allow external tooling to communicate via stdio instead of HTTP.
- McpSettings: Editor preferences for MCP, such as port and auto-start behavior.
- JsonHelper: Minimal JSON (de)serialization used by the MCP server and clients.
- McpProxyManager: Helper to start/stop a local proxy process that can relay MCP traffic.

## Systems
- Tool discovery via reflection (McpToolRegistry).
- HTTP server request handling (McpHttpServer) and main-thread dispatch for Unity calls.
- Editor Tools implementations (UnityEditorTools, AssetTools, ComponentTools, ConsoleTools).

## Enums
- EventType: AsyncClick, SyncClick, AsyncClickInt, AsyncClickString
- StepStatus: Pending, Success, Failed, Skipped, Timeout

## Configs
- McpSettings: Port and AutoStart (per Unity EditorPrefs).
- Other runtime/config aspects derive from runtime code and reflection.

## Dependencies
- Core: System, System.Collections.Generic, System.Reflection, System.Threading, System.Net, System.Text, UnityEditor, UnityEngine
- JSON: JsonHelper, JsonUtility
- Proxy/Networking: HttpClient, HttpListener, Process (for local proxy) in various files

## Usage Flow
- 1) MCP server is installed and registered in Unity Editor.
- 2) Client AI connects to http://localhost:8090/ with JSON-RPC (initialize, tools/list, tools/call).
- 3) MCP server uses McpToolRegistry to expose available tools and their schemas.
- 4) Client calls a tool; for Unity calls that require main thread, the server dispatches to the main thread and returns results.
- 5) Use McpSettings to adjust port/auto-start and McpHttpServer to control lifecycle.

## How to Extend
- Add new MCP Tool by creating a static method in any Editor assembly and decorate it with [McpTool("name", "desc")]. Expose parameters with [McpParam]. The MCP server will auto-detect on next reflection pass.
