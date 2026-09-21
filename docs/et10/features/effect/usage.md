---
title: 怎么用
---

# 怎么用

> 粒子用 `UIParticle` 加上一个粒子预制体；材质效果用 `UIEffect` 预设或 YIUI 的置灰绑定组件。特效的回收要自己做。

**关键词**：SetParticleSystemPrefab · SetParticleSystemInstance · RefreshParticles · UIEffect.LoadPreset · ToneFilter · UIDataBindGrayAll

## 1 在 UI 上放粒子

两种挂法：

```csharp
// 方式一：给一个预制体，内部自己实例化
uiparticle.SetParticleSystemPrefab(particlePrefab);

// 方式二：已经实例化好了，直接塞进去
uiparticle.SetParticleSystemInstance(instance);
uiparticle.SetParticleSystemInstance(instance, destroyOldParticles: true);
```

方式二带 `destroyOldParticles` 时，会先遍历直接子节点、跳过烘焙相机与渲染节点，把旧的粒子节点销毁再换新的。**换特效时用这个重载，不要自己先删再加。**

换完粒子后调一次 `RefreshParticles()` 让组件重新收集。

## 2 播放控制

```csharp
uiparticle.Play();
uiparticle.Stop();
uiparticle.Pause();
uiparticle.Resume();

uiparticle.StartEmission();   // 只开/关发射，已在飞的粒子不受影响
uiparticle.StopEmission();
uiparticle.Clear();           // 清空当前所有粒子
```

**`Play()` 只重置模拟，不会让一个已经停掉的粒子重新播起来。** 需要重播时用 `SetParticleSystemInstance` 换一遍，或直接 `Clear()` 后 `StartEmission()`。

要的是「停止发射但让现有粒子飞完」，用 `StopEmission()` 而不是 `Stop()`。

## 3 尺寸与速度

```csharp
uiparticle.scale3D = new Vector3(10, 10, 10);
uiparticle.scale = 10f;                 // 等价于三个分量都设成同一个值
uiparticle.timeScaleMultiplier = 1.5f;  // 整体快慢
```

`timeScaleMultiplier` 影响的是这条特效自己的时间，不动全局。

## 4 吸附特效

让粒子往一个目标飞，用 `UIParticleAttractor` 挂在同一个节点上。它和 `UIParticle` 是搭配关系，不需要写代码。

## 5 材质级特效

`UIEffect` 提供一组常见的 UI 效果：灰度、色调、对比度、锐化、模糊、溶解、翻转等。

两种用法：

```csharp
// 用预设
uieffect.LoadPreset("Gray");   // 预设名来自工程预设目录

// 直接设参数
uieffect.toneFilter = ToneFilter.Grayscale;
uieffect.toneIntensity = 1f;   // 取值范围 0~1，内部自动钳制
```

预设是 `Assets/ProjectSettings/UIEffectPresets` 下的资源，也可以手工拼装后另存为预设。

## 6 置灰绑定

`UIDataBindGray` 把「置灰」接到 YIUI 数据绑定上：数据为真时用一个灰度强度，为假时用另一个。

在预制体上配好 Key、组件、两个灰度值即可，不用写代码。数据变化时组件内部就是设 `toneFilter` 与 `toneIntensity` 两个值。

`UIDataBindGrayAll` 是它的全量版：会作用于子节点上的全部目标，并额外提供一个变化检查开关。

## 7 特效的回收

包内**不提供**对象池，也不参与 YIUI 的对象池。`UIParticle` 播完不会自己消失。

业务侧要自己决定生命周期，两条路：

| 方式 | 做法 |
|---|---|
| 一次性特效 | 播完后 `Destroy` 节点，或用 YIUI 对象池回收 |
| 常驻特效 | 节点一直留着，用 `StartEmission` / `StopEmission` 控制 |

判断「播完了没有」靠粒子自身的存活状态，组件没有播放完成回调。

## 8 工程级设置

两个设置资产，都在 `Assets/ProjectSettings/`：

| 资产 | 管什么 |
|---|---|
| `UIParticleProjectSettings` | 线性转伽马、生成物隐藏标记 |
| `UIEffectProjectSettings` | 预设列表、着色器变体注册表、HDR 取色 |

编辑器入口分别在 `Project/UI/UI Particle` 与 `Project/UI/UI Effect`。

生成物默认隐藏，所以在层级里不一定能看到那个烘焙相机和渲染节点——它们是正常存在的。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticle.cs` | 粒子 API 与刷新 |
| `Packages/cn.etetet.yiuieffect/Plugins/UIParticle/UIParticleAttractor.cs` | 吸附效果 |
| `Packages/cn.etetet.yiuieffect/Plugins/UIEffect/Runtime/UIEffect.cs` | 材质特效参数 |
| `Packages/cn.etetet.yiuieffect/Runtime/YIUIBind/Data/UIDataBindGray.cs` | 置灰绑定 |
| `Packages/cn.etetet.yiuieffect/Plugins/UIEffect/Runtime/UIEffectProjectSettings.cs` | 预设与着色器注册 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 网格合并与包围盒 | `Plugins/UIParticle/UIParticleRenderer.cs` |
| 网格共享与分组 | `Plugins/UIParticle/UIParticle.cs` 里的 `useMeshSharing` 与 `groupId` |
| 材质缓存 | `Plugins/UIParticle/Internal/Utilities/` |
| 预设资源 | `Plugins/UIEffect/UIEffectPresets/` |
| 着色器 | `Plugins/UIParticle/Shaders/UIAdditive.shader` · `Plugins/UIEffect/Shaders/UIEffect.shader` |

## 下一步

→ [排查](./troubleshooting)
