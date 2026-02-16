# Invoke system (yiuiinvoke, 23 files)

Purpose
- AI-friendly documentation for the Invoke subsystem. This entry maps to 23 code files.

Overview
- The Invoke system coordinates command execution, script invocation, and asynchronous task handling.
- It centralizes error handling, retry policies, and result aggregation for invoked operations.

Components
- InvokeManager
- ScriptInvoker
- CommandHandler
- InvocationRequest
- InvocationResponse
- AsyncInvoker
- TaskRunner
- InvocationContext

Systems
- InvocationSystem
- CommandQueue
- RetryPolicyEngine
- ResultAggregator

Enums
- InvokeMode
- InvocationStatus
- FailureReason
- RetryStrategy

Configs
- InvokeSettings
- RetryPolicy
- ScriptConfig
- CommandConfig

Data Models
- InvocationRecord
- InvokedCommand
- ScriptResult

Interfaces
- IInvoker
- IInvocationSource
- IResultHandler

Events
- OnInvocationStarted
- OnInvocationCompleted
- OnInvocationFailed

Notes
- The list reflects 23 source files and related types used by the runtime.
- Cross-link with the localization module for shared interfaces if applicable.

References
- See project docs for details on invocation lifecycle and error semantics.
