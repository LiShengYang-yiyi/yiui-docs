---
title: 层级与交互
---

# 层级与交互

> 模型能被正确渲染靠「独立层 + 专属相机」，能被点到靠「射线 + 独立碰撞层」。这两件事都依赖工程里的层配置。

**关键词**：YIUI3DLayer · cullingMask · 射线点击 · 碰撞层 · YIUI3DDisplayInvoke · IYIUI3DDisplayClick

## 1 独立层是硬前提

显示组件上有一个层名常量，运行时用它换层号：

```
LayerMask.NameToLayer(层名) → -1 时直接报错「当前设定的UI层级不存在 请手动添加」
```

**层名必须在工程的 Layer 列表里存在**，且与常量值一致。整条链路依赖它：

1. 模型的所有 `Renderer` 被改到该层
2. 相机的 `cullingMask` 设为只渲染该层
3. 灯光同样只作用于该层

组件停用时会把模型的层还原回默认层 —— 如果外部代码自己改过层，要注意会被还原覆盖。

## 2 交互为什么走调用系统

显示组件在框架程序集里，**不能直接引用业务实体类型**。所以三个指针事件不做直接调用：

| 指针事件 | 派发键 |
|---|---|
| 拖拽 | `OnDragInvoke` |
| 按下 | `OnPointerDownInvoke` |
| 抬起 | `OnPointerUpInvoke` |

框架侧发键 → HotfixView 侧按属性注册的实现被取到。业务想接自己的逻辑，实现对应签名的方法即可，不需要改组件。

## 3 射线点击

点击判定不是靠 UI 事件，是**从相机往模型打射线**：

1. 指针按下位置换算到相机射线
2. 命中的碰撞体反查属于哪个子对象
3. 按类型找到已注册的点击实现并派发

要点：

- 模型必须有碰撞体，且碰撞体要能被该层射线命中
- 组件可自动把碰撞体设到独立层，省掉手工配置
- 命中的容差由 `m_OnClickOffset` 控制，超出容差不判定为点击

点击实现用接口 + 反射查找。**找不到实现时只打一条错误日志，不抛异常** —— 所以「点了没反应」往往要先去日志里找这条。

## 4 拖拽旋转

拖拽在组件侧直接改模型朝向，速度由 `m_DragSpeed` 控制。

两种写法二选一：

- 用内置拖拽：打开 `m_CanDrag`，业务不写代码
- 自己接管：关掉内置拖拽，在指针事件实现里自己算角度

同时开内置拖拽又自己改朝向，会互相打架。

## 5 与相机同步

组件支持把显示相机的位姿同步到一台参考相机上：

| 开关 | 作用 |
|---|---|
| `m_UseLookCameraColor` | 参考相机的背景色同步给显示相机 |
| `m_AutoSyncLookCamera` | 每帧把显示相机对齐到参考相机 |

参考相机自身始终不参与渲染，只做参数与位姿来源。

## 6 定向约束

| 项 | 约束 |
|---|---|
| 独立层 | 必须在工程 Layer 里有同名层 |
| 拖拽与点击 | 点击开关默认关，要点击必须先打开 |
| 换装 | 换完外观必须刷新渲染器 |
| 多实例 | 靠隔离网格错开，容量 2147 |
| 渲染成本 | 每个实例一台相机 + 一张 RT + 一盏灯 |

## 真源

- **拖拽与点击的实体侧实现**<br>`Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Event.cs`
- **点击接口与基类**<br>`Packages/cn.etetet.yiui3ddisplay/Scripts/ModelView/Client/Event/YIUI3DDisplayClick.cs`
- **点击实现查找与派发**<br>`Packages/cn.etetet.yiui3ddisplay/Scripts/ModelView/Client/Event/YIUI3DDisplayClickHelper.cs`
- **层切换、层还原**<br>`Packages/cn.etetet.yiui3ddisplay/Runtime/UI3DDisplayCamera.cs`

## 源码落点

- **指针事件派发的三个键**<br>`Runtime/UI3DDisplay.cs` 内的键常量
- **相机参数与位姿同步**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Sync.cs`
- **碰撞层自动设置**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs`
- **多目标命中查找**<br>`Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Multiple.cs`

## 下一步

→ [排查](./troubleshooting)
