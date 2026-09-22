---
title: UI 内 3D 显示
---

# UI 内 3D 显示

> 在界面里显示一个真实 3D 模型：模型实例化进 UI 层级，由一台独立相机渲染到 RenderTexture，再贴回 `RawImage`。

**关键词**：yiui3ddisplay · UI3DDisplay · UI3DDisplayCamera · YIUI3DDisplayChild · ShowAsync · YIUI3DLayer · RenderTexture · 隔离网格

## 1 定位与边界

解决一件事：**让界面里的模型是真 3D**，不是一张会动的图。

与直接用 `RawImage` 贴一张贴图的差别：

| 做法 | 能得到什么 |
|---|---|
| `RawImage` + 静态贴图 | 只能显示固定画面，不能换角度、不能带动画光照 |
| UI 内 3D 显示 | 模型实例在 UI 层级里，独立相机每帧实时渲染 → 可旋转、可拖拽、可射线点击、可带动画与光照 |

它不管的事：模型资源本身（由资源管线提供）、模型里的动画逻辑（Animator 原样跑）、界面其它内容。

强依赖 YIUI。显示组件 `UI3DDisplay` 属于 `ET.YIUIFramework` 程序集，业务层通过实体 `YIUI3DDisplayChild` 操作它。

## 2 渲染方案

**方案是 RenderTexture，不是屏幕叠加相机。**

每显示一个模型会创建一套独立的小世界：

| 组成 | 说明 |
|---|---|
| `RawImage` | UI 上显示结果的载体 |
| `Camera` | 挂在该 UI 节点下，`targetTexture` 指向临时 RT |
| `Light` | 只照这个模型的灯 |
| Layer | 模型整棵渲染树被改到独立层，专属相机只渲染这一层 |

关键做法：

1. `RenderTexture.GetTemporary(宽, 高, 深度)` 拿到临时 RT，默认 512×512、深度缓冲 16
2. `RawImage.texture = rt`，`Camera.targetTexture = rt`
3. 相机 `cullingMask = 1 << 独立层`，模型的所有 `Renderer` 逐层改到同一层
4. 界面隐藏时 `RenderTexture.ReleaseTemporary` 并置空贴图，相机停用

相机参数从参考相机复制：正交开关、正交尺寸、视场角、近裁剪面、远裁剪面；`clearFlags` 被强制为纯色。参考相机自身会被 SetActive(false)，只当参数模板用。

## 3 ⭐ 多实例同屏：隔离网格

**同一层里放多个 UI 3D 模型，相机只认层不认节点，会互相入镜。**

源码的解法是把每个实例在世界空间错开很远的一段距离，形成格点：

| 常量 | 值 |
|---|---|
| 格子总数 | 2147 |
| 列数 | 47 |
| 间距 | 100 |
| 偏移量 | 实例 Id % 2147 |

偏移同时参与最终位置计算，所以业务调 `SetOffset` 时是在这个全局偏移之上再叠加。

超过 2147 个实例时 Id 取模会复用格点 —— 这是本方案的容量边界。

## 4 关键类

| 角色 | 类名 |
|---|---|
| UI 侧显示组件（Mono） | `UI3DDisplay` |
| 相机与层控制 | `UI3DDisplayCamera` |
| 渲染器层级记录与还原 | `UI3DDisplayRecord` |
| 逻辑实体 | `YIUI3DDisplayChild` |
| 实体系统（7 个分片） | `YIUI3DDisplayChildSystem` |
| 点击事件接口 | `IYIUI3DDisplayClick` |
| 点击事件派发 | `YIUI3DDisplayClickHelper` |

系统分片按职责拆开：`_Base` 是 RT 与相机参数核心，`_API` 是对外 API，`_Async` 是加载，`_Event` 是拖拽与射线点击，`_Mono` 是生命周期与隔离网格，`_Multiple` 是多目标。

## 5 与调用系统、资源管线的关系

- **交互走 `YIUIInvoke`**：`UI3DDisplay` 在框架程序集里，不能直接引用 `YIUI3DDisplayChild`，所以拖拽与点击通过 `YIUI3DDisplayInvoke` 的三个键派发到 HotfixView 的注册实现。
- **资源走 YooAssets**：模型通过 `YIUIFactory.InstantiateGameObjectAsync` 加载，最终落到默认资源包。
- **不走全局对象池**：包内自带 `m_ObjPool` 与 `m_CameraPool` 两级字典缓存，换模型时旧对象只做 `SetActive(false)` 复用；真正的释放依赖资源实例上的释放组件在销毁时归还。

## 6 三个必须准备好的东西

| 项 | 要求 |
|---|---|
| 独立层 | 工程 Layer 列表里要有一个与常量同名的层，否则取层号得到 -1 并报错 |
| 显示组件 | `UI3DDisplay` 上 `RawImage`、`Camera`、`Light`、缩放根节点都必须赋值，为空直接报错 |
| 模型预制体 | 资源名可被资源管线命中；若要自定义相机参数，预制体里放一个命名的子相机 |

## 真源

- **显示组件与全部 Inspector 字段**<br>`Packages/cn.etetet.yiui3ddisplay/Runtime/UI3DDisplay.cs`
- **实体与缓存字典**<br>`Packages/cn.etetet.yiui3ddisplay/Scripts/ModelView/Client/Display/YIUI3DDisplayChild.cs`
- **显示入口 `ShowAsync`**<br>`Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Async.cs`
- **独立层名常量**<br>`Packages/cn.etetet.yiui3ddisplay/Runtime/YIUIConstAsset_3DDisplay.cs`

## 源码落点

- **RT 创建与相机参数拷贝**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs`
- **隔离网格与生命周期**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Mono.cs`
- **层切换与还原**<br>`Runtime/UI3DDisplayCamera.cs`
- **拖拽与射线点击**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Event.cs`
- **多目标模式**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Multiple.cs`
- **完整可跑示例**<br>`Scripts/HotfixView/Client/YIUISystem/ModelDisplay/`

## 下一步

→ [显示一个模型](./usage)
