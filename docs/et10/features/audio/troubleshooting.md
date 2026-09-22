---
title: 排查
---

# 排查

> 声音问题的第一诊断动作是**看返回值**：`Play2DAudio` / `Play3DAudio` 返回 0 表示这次播放根本没发生，不需要再查播放链路。

**关键词**：返回 0 · SpatialBlend · 验证资产有效性 · 引用计数不配对 · AudioMgr.Update · UIDataBindBGM

## 1 先按现象分岔

| 现象 | 往哪查 |
|---|---|
| 返回 0，完全没声音 | 参数校验没过，或加载器缺失 |
| 返回非 0，也没声音 | 资源没加载到，或 clip 为空 |
| 有声音但位置不对 | 3D 参数没生效 |
| 响的次数比预期多 | 增量播放的数量计算 |
| 音量改了没反应 | 改的是组音量，影响范围有限 |
| 切界面后 BGM 还在响 | 界面上的 BGM 绑定组件没被禁用 |
| 播放中卡住不再推进 | 驱动它的对象被禁用或销毁了 |

## 2 四条判定手段

**看返回值。** 返回 0 就是没播。大概率是 `SoundKey` 为空、片段列表为空、组件已销毁，或没挂加载器。

**看编辑器资源校验。** 编辑器下加载前会校验资源有效性，失败日志是「验证资产有效性 没有这个资源 无法加载 请检查 {resName}」。这条日志出现就说明是资源名或资源本身的问题。

**看播放状态。** 播放调度有完整的内部状态机，卡在加载中说明资源没回来；卡在播放中说明没有推进。

**看引用计数。** 出现「存在多次释放音效的情况，导致加载数量和释放数量不配对」说明释放逻辑被绕过了，通常是业务自己在停音效之外又调了释放。

## 3 常见日志对照

| 日志 | 含义 |
|---|---|
| `音频: {clipName} 没有找到!` | 资源名对不上或资源缺失 |
| `验证资产有效性 没有这个资源 无法加载 请检查 {resName}` | 编辑器下的资源校验失败 |
| `通过配置[{x}] 未找到对于的配置信息！请检查对应的配置文件！` | `GroupId` 在音频表里不存在 |
| `存在多次释放音效的情况，导致加载数量和释放数量不配对！` | 引用计数失衡 |
| `当前声音跟随脚本正在播放音乐：【x】中，不能执行方法：[SetFollow]` | 播放中改跟随目标 |
| `音效当前状态[x]非播放状态/非暂停状态` | 对不可暂停的状态调了暂停 |
| `不允许设置未空!` / `不允许被重复设置!` | 加载器被重复赋值 |

## 4 有声音但位置不对

这是最容易误判的一条。

非配置方式的 3D 播放（`Play3DAudio` 传资源名）内部把 `SpatialBlend` 设成了 0，实际仍是 2D 混音，只是位置跟着 `Transform` 走。

**要真 3D 衰减，必须走配置方式**：`isConfig: true`，由配置表里的 `SpatialBlend` 与 `DistanceMin` / `DistanceMax` 决定。

先确认调用方式属于哪一种，再决定要不要改配置。

## 5 响的次数比预期多

一次配置播放的实际片段数量由 `PlayNumMin` / `PlayNumMax` 决定。这两个值算出 N 时，内部取片段的循环会多取一个，实际播放 N+1 个。

只在「播放数量不为 1，或候选片段不止一个」时才会触发。要做精确计数，把配置里的数量区间设成确定值并留出余量。

## 6 参数复用带来的残留

`AudioDataParams` 走对象池，归还后会被复用。它的重置逻辑里有一个字段写了两遍，导致 `DistanceMin` 保留着上一轮的值。

表现：同样的调用，衰减距离时好时坏。**每次 `Fetch` 之后显式把要用的字段都写一遍**，不要依赖默认值。

## 7 配置读不到

配置查询的 Handler 里有一处按编译宏分岔：宏开启走实体上的单例，否则走静态实例。

排查「配置读不到」时先确认这个宏的状态，再看 `GroupId` 在不在 `Luban/Config/Datas/Audio/Audio.yml` 里。

新增音频键要同时改定义文件里的枚举和 yml 数据，并且**必须重新编译**——有两处工具靠反射读枚举，没编译就看不到新键。

## 8 播放不再推进

`AudioMgr.Update()` 每帧驱动全部状态机。它所在对象被禁用、销毁，或提前退出了销毁流程，播放就会停在半路：声音停不下来、新的播放不开始。

`AudioMgr` 与全局 `AudioListener` 都做了常驻，正常运行时不会乱换。出现这类现象时先确认场景切换过程中它们的生命周期。

## 真源

- **前置校验与状态机日志**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioEmitterController.cs`
- **引用计数与延迟释放**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioClipController.cs`
- **参数重置逻辑**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioDataParams.cs`
- **返回 0 的分支与配置覆盖**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioMgr.cs`

## 源码落点

- **资源加载失败处理**<br>`Runtime/Audio/AudioClipLoader.cs`
- **编辑器资源校验**<br>`Scripts/HotfixView/Client/YIUIInvokeLoadAudioClipHandler.cs`
- **配置分支的宏判断**<br>`Scripts/HotfixView/Client/YIUIInvokeGetAudioConfigHandler.cs`
- **界面绑定组件的收尾**<br>`Runtime/Bind/Music/UIDataBindBGM.cs` · `UIDataBindMusic.cs`

## 下一步

→ [UGUI 特效](../effect/)
