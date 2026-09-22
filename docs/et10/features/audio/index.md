---
title: 声音
---

# 声音

> 声音包用一组可复用的 `AudioSource` 统一管理 2D 音效、3D 音效和带优先级的背景音乐，一次调用对应一个播放句柄，回收、淡入淡出、音量分组都在包内完成。

**关键词**：yiuiaudio · AudioMgr · AudioEmitterController · AudioDataParams · AudioSystem · AudioClipController · EAudioType

## 1 定位与边界

管四件事：

- 播放 2D / 3D 音效，返回一个播放句柄
- 播放与切换背景音乐，按优先级决定谁在响
- 分组音量与播放中实时改音量
- `AudioSource` 复用、`AudioClip` 引用计数与延迟释放

不管两件事：

- 音频资源从哪来 —— 走 YIUI 资源加载
- 音频配置表怎么填 —— 走 Luban

底座是 Unity 原生的 `AudioSource` / `AudioListener` / `AudioMixerGroup`，**没有**引入 FMOD、Wwise 之类第三方音频库。

包的对外入口只有一个：`AudioMgr.Inst`。其余类要么是内部实现，要么由管理器驱动。

## 2 关键类

| 类 | 角色 |
|---|---|
| `AudioMgr` | 唯一对外管理器，YIUI 单例 |
| `AudioEmitterController` | 播放调度核心：分配播放 id、驱动状态机 |
| `AudioEmitter` | 播放句柄，持有一个 `AudioSource`（内部类型） |
| `AudioEmitterPool` | `AudioSource` 复用池，默认保留 10 个 |
| `AudioEmitterFollow` | 3D 音效跟随物体，目标丢失可自动停止 |
| `AudioClipController` | `AudioClip` 引用计数与延迟释放 |
| `AudioBackgroundMusicPlayer` | BGM 优先级栈与淡入淡出 |
| `AudioSystem` | 分组音量表与音量变化事件 |
| `AudioDataParams` | 全参数调用用的参数字包，走对象池 |

`AudioEmitter` 与 `AudioEmitterPool` 是 `internal`——业务侧拿不到，也不需要拿。

## 3 一次播放对应一个句柄

```csharp
int audioKey = AudioMgr.Inst.Play2DAudio("click");
// 之后
AudioMgr.Inst.StopAudio(audioKey);
```

`audioKey` 是**一组播放**的编号，不是单个 `AudioSource` 的编号。配置里一次播放可能触发多个并发片段，`StopAudio(audioKey)` 会把这一组全停掉。

句柄在 1 到 1000000 之间轮转，用完回绕到 1 重新发。

**播放 id 为 0 表示这次播放没发生。** `PlaySound` 的前置校验不通过时静默返回 0，没有日志——排查「调了没声音」时先看返回值。

## 4 音量模型

音量分两层，最终音量是两层相乘：

```
最终音量 = AudioSystem.GetVolume(类型, 1.0) × 单条播放的 Volume
```

`AudioSystem.SetVolume(类型, 音量)` 改的是组音量。这层改完，**只在播中的、类型匹配的片段**会立刻跟着变。

包里**没有**独立的静音开关，要静音就把那一组的音量设成 0。

## 5 声音从哪来

两种寻址方式，由 `isConfig` 决定：

| `isConfig` | `soundKey` 的含义 |
|---|---|
| `false` | 直接是 `AudioClip` 的资源名 |
| `true` | 是 Luban 音频表里的 `GroupId` |

资源加载走 `YIUIInvoke` → YIUI 资源加载器，取到的 clip 由 `AudioClipController` 按资源名做引用计数。

**引用计数归零后不会立刻卸载**：先标记为待释放，等 `KeepAliveTime`（默认 5 秒）到期才真正卸载。频繁播放同一个音效时，这层延迟能避免反复加载。

## 6 硬约束

- `AudioMgr.Update()` 每帧驱动全部状态机。它所在的对象被禁用或销毁，播放会停在加载中或播放中不再推进。
- 引用计数必须配平。多次释放会报「存在多次释放音效的情况，导致加载数量和释放数量不配对」。
- 资源加载器只允许设置一次，重复设置或设为空都会失败。
- 跟随脚本 `SetFollow` 在正在播放时报「当前声音跟随脚本正在播放音乐中，不能执行方法」。
- 暂停只对「播放中」或「已暂停」状态有效，其他状态会报错。

## 真源

- **对外 API 与每帧驱动**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioMgr.cs`
- **播放调度与状态机**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioEmitterController.cs`
- **全参数调用的参数结构**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioDataParams.cs`
- **分组音量**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioSystem.cs`
- **配置读取接口**<br>`Packages/cn.etetet.yiuiaudio/Scripts/Core/Share/IAudioConfig.cs`

## 源码落点

- **`AudioSource` 池与跟随**<br>`Runtime/Audio/AudioEmitterPool.cs` · `Runtime/Audio/AudioEmitterFollow.cs`
- **BGM 优先级与淡入淡出**<br>`Runtime/Audio/AudioBackgroundMusicPlayer.cs`
- **clip 引用计数**<br>`Runtime/Audio/AudioClipController.cs`
- **资源加载桥**<br>`Runtime/Audio/AudioClipLoader.cs` · `Scripts/HotfixView/Client/YIUIInvokeLoadAudioClipHandler.cs`
- **音频类型枚举**<br>`Runtime/Audio/EAudioType.cs`

## 下一步

→ [怎么播放](./usage)
