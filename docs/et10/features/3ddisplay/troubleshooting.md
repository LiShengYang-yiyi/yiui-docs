---
title: 排查
---

# 排查

> 症状 → 根因 → 处置。多数问题会在启动阶段直接报错，日志里能定位到具体是哪一环缺失。

**关键词**：LogError · 层级不存在 · 必须设置显示对象 · 黑屏 · 点了没反应

## 1 先看日志，再猜现象

这套系统的缺失项基本都有明确的错误输出。先按下面的清单对日志：

| 日志 | 含义 | 处置 |
|---|---|---|
| 当前设定的UI层级不存在 … 请手动添加 | 工程 Layer 列表里没有那个层 | 手动加层，名字与常量一致 |
| 必须设置显示对象 | 组件上模型根节点字段为空 | 检查预制体赋值 |
| 必须设置参考摄像机 | 组件上相机字段为空 | 建议直接用官方模板预制体，别自己拼 |
| ShowCamera == null 这是不允许的 | 相机字段被清空 | 同上 |
| 目标摄像机找不到 | `cameraName` 写错 | 改用默认相机或核对子相机名 |
| 没有具体实现的事件 YIUI3DDisplayClick | 点了但没实现接口 | 实现接口，或检查参数个数 |
| 多目标 使用前 需要一个父级对象 | 还没显示就先加多目标 | 先 `ShowAsync` 再 `AddMultipleTarget` |
| 多目标模式 未初始化 | 没开多目标模式就加目标 | 先调 `ResetMultipleTargetMode(true)` |

## 2 五类高频症状

### 2.1 界面上一片黑 / 全白

按顺序查：

1. 独立层是否存在于工程 Layer 列表
2. 相机是否被启用（界面隐藏时会被停用）
3. 模型是否被改到了正确层
4. 模型缩放是否过小 —— 缩放根节点会反向补偿 UI 缩放

### 2.2 点击没反应

三个必要条件缺一不可：

- `ResetOnClick(true)` 已调用
- 模型有碰撞体
- 点击实现已注册

三者都满足还不行，就看点击容差 —— 触摸抖动超出容差会被判为非点击。

### 2.3 两个模型互相入镜

**这是层的机制问题，不是配置错误**。同层多实例必须依赖隔离网格偏移。

自行改了模型的世界坐标、或绕开 `AddChild` 创建实例导致 Id 取模落在同一格点，就会出现叠加。

### 2.4 换装后还是旧样子

漏了 `RefreshShowRenderers()`。渲染器层级是缓存过的，外观资源换了不会自动重扫。

### 2.5 相机视角不对

`cameraName` 写错时不会崩溃，会静默回退到默认相机 —— 表现就是「角度不对但功能正常」。这时优先核对预制体里的子相机名。

## 3 渲染开销怎么估

每显示一个模型 = 一台相机 + 一张 RT + 一盏灯。

| 因素 | 影响 |
|---|---|
| 分辨率 | 像素量按面积增长，512→1024 是 4 倍 |
| 实例数 | 线性叠加，且每个都独立渲染 |
| 深度缓冲 | 需要深度测试的场景才有意义，纯展示可关 |

不需要深度时把深度缓冲设为 0 可以省一部分带宽。

## 4 释放与复用

| 时机 | 行为 |
|---|---|
| 界面隐藏 | 释放临时 RT、置空贴图、相机停用 |
| 加载新模型 | 旧对象只隐藏，留在包内字典缓存里复用 |
| 实体销毁 | 释放 RT、清阴影、置空相机引用 |

包内缓存不清空是刻意的 —— 目的是复用。真正的资源归还交给资源实例上的释放组件，在节点被销毁时执行。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Mono.cs` | 生命周期、隔离网格、错误分支 |
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs` | RT 创建、相机参数、断言 |
| `Packages/cn.etetet.yiui3ddisplay/Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Event.cs` | 点击与拖拽的异常处理 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 断言位置 | `Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs` |
| 层号获取与报错 | `Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Mono.cs` |
| 相机回退逻辑 | `Scripts/HotfixView/Client/Display/YIUI3DDisplayChildSystem_Base.cs` |
| 组件字段定义 | `Runtime/UI3DDisplay.cs` |

## 下一步

→ [伤害提示](../damagetips/)
