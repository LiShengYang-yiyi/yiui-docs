---
title: 显示一个模型
---

# 显示一个模型

> 三步：界面里放好 3D 显示组件 → 初始化时把它转成实体子节点 → 打开界面时调 `ShowAsync`。

**关键词**：ShowAsync · ResetOnClick · SetScale · SetRotation · SetOffset · ClearShow · RefreshShowRenderers

## 1 最小流程

```csharp
// 1) YIUIInitialize：把 UI 上的组件转成实体子节点
self.m_Display = self.AddChild<YIUI3DDisplayChild, UI3DDisplay>(self.u_ComDisplay);

// 2) 界面打开时显示模型
await self.m_Display.ShowAsync("DisplayDemoModel");

// 3) 需要点击模型时，必须显式打开
self.m_Display.ResetOnClick(true);
```

`ShowAsync` 的真实签名：

```csharp
public static async ETTask<GameObject> ShowAsync(
    this YIUI3DDisplayChild self,
    string resName,
    string cameraName = "");
```

- `resName`：模型预制体的资源名
- `cameraName`：模型预制体里那台子相机的节点名；传空则用显示组件上配的相机

## 2 显示期能改什么

| 方法 | 作用 |
|---|---|
| `SetScale(Vector3)` | 缩放到指定倍数 |
| `SetRotation(Vector3)` / `ResetRotation()` | 设置 / 复位朝向 |
| `SetOffset(Vector3)` | 相对隔离网格偏移再位移 |
| `ChangeResolution(Vector2)` | 改渲染分辨率 |
| `RefreshShowRenderers()` | ⭐ **换装、换材质后必须调** |
| `ClearShow()` | 清除当前显示对象 |

`RefreshShowRenderers` 是最容易漏的一个：模型换了外观但渲染器层级没刷新，屏幕上还是旧的样子。

## 3 分辨率与尺寸

组件上有两个开关决定分辨率怎么来：

- `m_AutoChangeSize` 为真时，**编辑器里改分辨率会同步把 RectTransform 尺寸改成同样大小**，方便对齐
- 运行时**不会**按 RectTransform 尺寸自动改分辨率 —— 要变必须手动 `ChangeResolution`

默认 512×512。分辨率越高画面越清晰，代价是每帧多渲染的像素量。

## 4 点击与拖拽

| 需求 | 怎么做 |
|---|---|
| 拖拽旋转 | 组件上 `m_CanDrag` 打开（默认开），速度由 `m_DragSpeed` 决定 |
| 点击模型 | 调 `ResetOnClick(true)` —— 默认是关的 |
| 点击容差 | `m_OnClickOffset`，默认 50×50，适配手指触摸的抖动 |
| 收到点击 | 实现 `IYIUI3DDisplayClick` 系列接口，由 Helper 反射派发 |

**点击开关不打开时，指针事件在组件侧就直接返回**，注册了回调也不会触发 —— 表现为「点了没反应」而不是报错。

## 5 多目标模式

一个界面里显示多个可点击模型时用这套：

```csharp
self.m_Display.ResetMultipleTargetMode(true);
self.m_Display.AddMultipleTarget(go1);
self.m_Display.AddMultipleTarget(go2, camera);
// 移除
self.m_Display.RemoveMultipleTarget(go1);
```

约束：**必须先有一个已显示的父对象**，否则直接报错；未初始化就调用多目标同样报错。

命中不到目标时报找不到对象。

## 6 模型预制体的准备

| 项 | 说明 |
|---|---|
| 根节点 | 普通 `Transform`，不是 RectTransform |
| 命名子相机 | 想让该模型用自己的机位，就放一台子相机并起名，名字传 `cameraName` |
| Animator | 会被强制设为 `AlwaysAnimate` —— 因为实例常被挪到视口外，不这样动画会停 |
| 碰撞体层 | 组件可自动把碰撞体设到独立层，供射线点击识别 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Async.cs` | `ShowAsync` |
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_API.cs` | 缩放 / 朝向 / 偏移 / 分辨率 / 清除 |
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Multiple.cs` | 多目标模式 |
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/YIUISystem/ModelDisplay/ModelDisplayDemoViewComponentSystem.cs` | 可直接抄的最小用法 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 组件上的全部可配字段 | `Runtime/UI3DDisplay.cs` |
| 换模型时的回收与复用 | `Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs` |
| 相机参数同步与阴影镜面 | `Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Sync.cs` |
| 模板预制体与创建菜单 | `Editor/TemplatePrefabs/YIUI3DDisplay.prefab` · `Editor/MenuItem/` |
| 示例模型与界面预制体 | `Assets/GameRes/YIUI/ModelDisplay/` |

## 下一步

→ [层级与交互](./interaction)
