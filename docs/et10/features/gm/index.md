---
title: GM 面板
---

# GM 面板

> GM 面板把「实现了命令接口、标了命令特性」的类反射成一张运行态命令表，再给这些命令生成可搜索、可传参的调试界面。加一条命令不用动面板代码。

**关键词**：yiuigm · GMAttribute · IGMCommand · GMCommandComponent · EGMType · GMParamInfo · ForeverCache

## 1 定位与边界

管三件事：

- 收集命令：扫描全部标了特性的命令类，按分类建表
- 渲染界面：分类页签、命令列表、按参数类型自动生成输入控件
- 记录历史：执行过的命令与参数可以一键重跑

不管两件事：

- 命令里做什么 —— 由命令类自己实现
- 权限控制 —— 命令上有一个等级字段，但运行时不做拦截

**和普通业务界面的差别**：GM 面板不走业务的打开 / 关闭 / 压栈逻辑，它是常驻的。

## 2 两个视图

| 组件 | 层级与选项 |
|---|---|
| `GMPanelComponent` | 顶层，优先级 99999，常驻缓存，不参与关闭 / 回退 / 压栈，所有开关动画关闭 |
| `GMViewComponent` | 面板内部的列表视图，独立开关，同样不压栈 |

对应两条交互：

- 面板自带一个**可拖拽的 GM 按钮**，位置记在本地存档里
- 点按钮打开命令列表视图

面板那套「不参与关闭 / 回退」的配置是有意的：业务界面频繁开关，GM 面板不能跟着被关掉。

## 3 什么时候被创建

YIUI 初始化完成后，由框架的初始化完成事件触发创建。

工程侧开关 `CloseGMCommand` 为真时，整个组件不创建，GM 面板完全不存在。

命令表在组件创建时一次性建好：扫描程序集、实例化命令类、读取名称描述、读取参数声明。

**命令类是运行时反射发现的，所以改了命令必须重新编译。**

## 4 命令分类

分类来自一组常量。每个包在自己包里加常量、标上分组名，面板就多一个页签。

分类常量的取值有固定算法：用一个包级基数乘以固定数字再加序号。**同一组常量不能重复**，重复时整个分类被丢弃并打错误日志。

框架自己那份分类文件里写明了不要在这里扩展，要扩展去自己的包。

## 5 等级字段不生效

命令特性上有一个等级字段，会存进命令信息并在界面上展示。

运行时**不做拦截**——执行入口里关于等级判断还只是一个待办注释。要做权限得自己在命令实现里补。

发布版屏蔽只有一个开关，就是前面那个 `CloseGMCommand`。

## 6 入口开关

| 开关 | 作用 |
|---|---|
| `CloseGMCommand` | 为真时完全不创建 GM 模块 |
| `OpenGMViewKey` | 快捷键；填 `None` 表示禁用快捷键 |
| `OpenGMViewFirstType` | 首次打开时默认落在哪个页签 |

工程当前的快捷键配置是禁用状态，实际入口只有面板上那个 GM 按钮。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMAttribute.cs` | 命令与分组特性 |
| `Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/IGMCommand.cs` | 命令接口 |
| `Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMCommandComponent.cs` | 命令表组件 |
| `Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMCommandComponentSystem.cs` | 注册与执行 |
| `Packages/cn.etetet.yiuigm/Scripts/YIUIFramework/YIUIConstAsset_GM.cs` | 工程侧开关 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 面板与视图逻辑 | `Scripts/HotfixView/Client/YIUISystem/GM/` |
| 自动生成的绑定代码 | `Scripts/ModelView/Client/YIUIGen/GM/` · `Scripts/HotfixView/Client/YIUIGen/GM/` |
| 面板预制体 | `Assets/GameRes/YIUI/GM/Prefabs/` |
| 分类页签的反射工具 | `Scripts/ModelView/Client/GM/GMKeyHelper.cs` |
| 模块挂载时机 | `Scripts/HotfixView/Client/GM/YIUIEventInitializeAfterGMHandler.cs` |

## 下一步

→ [写一条命令](./command)
