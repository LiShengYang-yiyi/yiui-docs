---
title: 怎么播放
---

# 怎么播放

> 简单播放用 `Play2DAudio` / `Play3DAudio` / `PlayMusic` 三个入口；需要循环、跟随、延迟、回调时改用 `AudioDataParams` 全参数入口。

**关键词**：Play2DAudio · Play3DAudio · PlayMusic · PlaySoundByParams · AudioDataParams · UIDataBindPlay2DAudio · NextTimeMin

## 1 三个快捷入口

```csharp
// 2D 音效：资源名直接播
int key = AudioMgr.Inst.Play2DAudio("Audio_Click");

// 2D 音效：延迟一段时间再播（等待型）
await AudioMgr.Inst.Play2DAudioWait(0.2f, "Audio_Click");

// 3D 音效：挂在某个 Transform 上
int key = AudioMgr.Inst.Play3DAudio("Audio_Skill", weaponTrans);

// 背景音乐：带优先级
AudioMgr.Inst.PlayMusic("Audio_Login_BGM", priority: 1);
AudioMgr.Inst.StopMusic("Audio_Login_BGM", priority: 1);
```

第三个参数传 `isConfig: true` 时，第一个参数就从资源名变成 Luban 音频表的 `GroupId`，一次调用按配置拉起多个片段。

## 2 全参数入口

需要循环、跟随、偏移、播放完成回调时，用参数字包：

```csharp
using var p = AudioDataParams.Fetch();

p.SoundType      = (int)EAudioType.Sound;
p.SoundKey       = "skill_fire";
p.AudioClipNames.Add("Audio_Skill_Fire");
p.LoopTimes      = 1;                 // -1 表示无限循环
p.SoundVolume    = 0.8f;
p.AudioSyncRootTrans = muzzleTrans;   // 3D 跟随目标
p.OffsetPosition = new Vector3(0, 1, 0);
p.OnOneCompleted = (id, clip) => { /* 单个片段播完 */ };
p.OnStopped      = id => { /* 整组停止 */ };

int key = AudioMgr.Inst.PlaySoundByParams(p);
```

`AudioDataParams` 本身走对象池，`Fetch` 拿、`using` 归还。

四个回调：

| 回调 | 触发时机 |
|---|---|
| `OnStarted` | 整组开始播放 |
| `OnStopped` | 整组停止 |
| `OnOneStarted` | 单个片段开始 |
| `OnOneCompleted` | 单个片段播完 |

## 3 配置方式播放

`isConfig: true` 时全部参数来自 Luban 音频表，调用方只给 `GroupId`：

| 字段 | 含义 |
|---|---|
| `GroupId` | 组键 |
| `AudioNames` | 候选片段列表，运行时随机取 |
| `Volume` | 本条音量 |
| `PlayNumMin` / `PlayNumMax` | 一次播几个片段 |
| `SpatialBlend` | 0 是 2D，1 是 3D |
| `DistanceMin` / `DistanceMax` | 衰减范围 |
| `IntervalTimeMin` / `IntervalTimeMax` | 首次延迟 |
| `NextTimeMin` / `NextTimeMax` | 后续播放的间隔 |

配置表在 `Luban/Config/Datas/Audio/Audio.yml`，枚举键在 `Luban/Config/Base/Defines/Audio.xml`。

配置类由 Luban 生成后再经 `AudioConfig_Extend` 实现成 `IAudioConfig` —— 业务读的是接口，不是生成类。

## 4 界面上的声音

`Runtime/Bind/Music/` 下有一组数据绑定组件，预制体上标好就不用写代码：

| 组件 | 作用 |
|---|---|
| `UIDataBindPlay2DAudio` | 数据变化时播一次 2D 音效 |
| `UIDataBindPlay2DAudioAuto` | 延迟播放版 |
| `UIDataBindPlay2DAudioSwitch` | 按值在两条音效之间切 |
| `UIDataBindPlay2DAudioUp` / `Down` | 值变大 / 变小时各播一条 |
| `UIDataBindBGM` / `UIDataBindMusic` | 跟随界面播放背景音乐 |

`UIDataBindBGM` 与 `UIDataBindMusic` 在 `OnDisable` / `OnDestroy` 时收尾。**排查「切界面后 BGM 还在响」时先看这两个组件有没有被禁用。**

## 5 一次播放的完整链路

1. 调用 `Play2DAudio` → 取一个 `AudioDataParams`
2. 校验 `SoundKey` 与片段列表非空，分配播放 id
3. 从 `AudioEmitterPool` 取 `AudioSource`，按参数设置循环、衰减、混音组、音量
4. 向 `AudioClipController` 申请 clip，引用计数加一；未加载过就异步加载
5. clip 到位后设给 `AudioSource` 并播放，记录播放时间
6. 每帧 `Update` 推进：播放时间递减、到期回收 `AudioSource`、clip 引用计数减一

## 6 增量播放与延迟

配置里 `PlayNumMin` / `PlayNumMax` 与 `IntervalTimeMin` / `NextTimeMin` 两组参数配合，能做「一次响几声、每声隔多久」。不配就是一声。

延迟播放走 `Play2DAudioWait`，返回 `ETTask`，可以 `await`。界面上的延迟播放用 `UIDataBindPlay2DAudioAuto`。

## 真源

- **全部对外播放 API**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioMgr.cs`
- **参数字段与回收**<br>`Packages/cn.etetet.yiuiaudio/Runtime/Audio/AudioDataParams.cs`
- **配置查询 Handler**<br>`Packages/cn.etetet.yiuiaudio/Scripts/HotfixView/Client/YIUIInvokeGetAudioConfigHandler.cs`
- **配置到接口的适配**<br>`Packages/cn.etetet.yiuiaudio/CodeMode/Model/Client/ConfigExtend/AudioConfig_Extend.cs`
- **音频表数据**<br>`Packages/cn.etetet.yiuiaudio/Luban/Config/Datas/Audio/Audio.yml`

## 源码落点

- **参数默认值与配置覆盖**<br>`Runtime/Audio/AudioMgr.cs` 里的 `SetSoundDataParamsByConfig`
- **随机取片段**<br>`Runtime/Audio/AudioMgr.cs` 里的 `RandomList`
- **界面绑定组件实现**<br>`Runtime/Bind/Music/`
- **音频事件结构体**<br>`Runtime/Audio/AudioEvent.cs`

## 下一步

→ [排查](./troubleshooting)
