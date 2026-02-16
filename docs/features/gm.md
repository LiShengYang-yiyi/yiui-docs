# GM commands (yiuigm, 32 files)

Purpose
- AI-friendly documentation for GM (Game Master) commands. This entry maps to 32 code files.

Overview
- GM commands provide debug, admin, and in-game management utilities. They are exposed via a central GMController with a local command registry.

Components
- GMController
- CommandRegistry
- CommandBase
- CommandAttribute
- HelpProvider
- AdminTools
- PlayerDiagnostics
- WorldStateDebugger

Systems
- GMSystem
- CommandExecutionEngine
- PermissionChecker

Enums
- GmCommandCode
- CommandScope
- PermissionLevel
- GmResultCode

Configs
- GMSettings
- PermissionConfig
- DebugConfig
- CommandConfig

Data Models
- GmCommand
- CommandContext
- CommandResult

Interfaces
- IGmCommand
- ICommandHandler
- IPermissionProvider

Events
- OnCommandExecuted
- OnCommandFailed
- OnPermissionDenied

Notes
- 32 related files reflected in the command registry and GM tooling.
- Ensure command metadata aligns with runtime behavior and help output.

References
- See GM tooling module for command coverage and scenarios.
