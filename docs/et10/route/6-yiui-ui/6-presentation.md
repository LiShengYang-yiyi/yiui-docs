---
title: 6.6 表现增强
---

# 6.6 表现增强

> **一句话**：多语言、特效、3D 显示、挂点、资源管理、动画各由独立包承担——其中**挂点系统的边界最容易被误解**：它只负责「标记与查找位置」，不负责加载和生命周期。

**关键词**：多语言 · 特效 · 3D 显示 · 挂点 · MountPoint · 资源管理 · Animancer

**目标**：知道表现类需求分别由哪个包承担，以及每个包的职责边界在哪。

## 包分工

| 需求 | 包 |
|---|---|
| 多语言 | `cn.etetet.yiuilocalizationpro` |
| UI 特效 | `cn.etetet.yiuieffect` |
| UI 中的 3D 模型展示 | `cn.etetet.yiui3ddisplay` |
| 挂点（位置寻址） | `cn.etetet.yiuimountpoint` |
| 资源管理 | `cn.etetet.yiuiyooassets` |
| 动画系统 | `cn.etetet.yiuianimancer` |

## 挂点系统：职责与边界

挂点系统解决的问题是：**给 GameObject 层级中的关键 `Transform` 分配一个稳定键，业务代码按键查找位置。**

典型用途：

- 角色头顶、胸口、脚底的特效位置；
- 武器、翅膀、称号等附着位置；
- UI 或场景中需要稳定寻址的局部节点。

### 它**不**负责什么

| 不管 | 由谁管 |
|---|---|
| 资源加载 | `yiuieffect` / `yooassets` |
| 实例化与对象池 | `yiuigameobjectpool` |
| 特效生命周期 | 特效包 |
| 网络同步 | 网络层 |
| 坐标移动 | `move` 包 |

**只负责「标记、收集、按键查询」三件事。** 把加载或生命周期塞进挂点，是使用这个包最常见的误用。

### 核心结构

```
业务包
├─ MountPointPresetCatalog.asset            挂点键目录（供编辑器选择与校验）
├─ Scripts/ModelView/Client/Generated/
│  └─ MountPoint/MountPointKeys.g.cs        自动生成的强类型键常量
└─ Prefab / 场景
   └─ MountPointCollector                   收集范围的根节点
      ├─ MountPointMark                      一个实际挂点
      └─ MountPointMark                      另一个实际挂点

ET 客户端实体
├─ GameObjectComponent                      提供表现 GameObject
└─ MountPointCollectorComponent             把实体查询转发到 Unity 收集器
```

### 两种查询方式

| 方式 | 场合 |
|---|---|
| 直接查 Unity 收集器 | 纯表现代码，手里有 GameObject |
| 通过 ET 实体组件查 | 业务逻辑里，手里是 Entity |

### ⚠️ 必须理解的失败语义

挂点查询**找不到时怎么表现**是这个系统的关键设计点。缺失的挂点如果不能被发现，问题会一路漂到美术验收才暴露。所以：

- 缺失键必须**明确失败**（有日志、有上下文），而不是静默返回 `null` 让上层撞空引用；
- 编辑器侧有校验清单（配置、代码编译、运行态三层）。

具体的失败语义与验证清单见 `挂点系统使用说明.md`。

## 多语言

`yiuilocalizationpro` 负责多语言。数值系统也有独立的本地化配置（`NumericLocalizationConfig`，见 [5.5](../5-server-chain/5-config-and-numeric)）——**数值的本地化与文本的本地化是两套**。

## 真源

| 文件 | 内容 |
|---|---|
| `挂点系统使用说明.md`（工程根） | 挂点系统的职责、核心结构、接入流程、失败语义、验证清单（**最完整**） |
| `Packages/cn.etetet.yiuimountpoint/README.md` | 挂点包入口 |
| `Packages/cn.etetet.yiuieffect/README.md` | 特效包 |
| `Packages/cn.etetet.yiui3ddisplay/README.md` | 3D 显示包 |
| `Packages/cn.etetet.yiuilocalizationpro/README.md` | 多语言包 |
| ET9 · [`localization`](/et9/features/localization) · [`ui-3d-model`](/et9/features/ui-3d-model/) | 多语言与 3D 显示的整理文档 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 挂点实现 | `Packages/cn.etetet.yiuimountpoint/Scripts/` |
| 挂点键生成物 | `Packages/<包>/Scripts/ModelView/Client/Generated/MountPoint/MountPointKeys.g.cs` |
| 特效 / 3D 显示 / 多语言 | 各包 `Scripts/` |
| 资源管理 | `Packages/cn.etetet.yiuiyooassets/` |

## 读完能回答

- 挂点系统负责什么？明确不负责什么？
- 找一个挂点有哪两种方式？分别用在什么场合？
- 挂点找不到时为什么不能静默返回 `null`？
- 数值的本地化和文本的本地化是同一套吗？

## 下一步

→ [阶段 7 · 工具链与 AI 协作](../7-toolchain/)
