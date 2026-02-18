# Audio 声音 - BGM管理

## 目录

4. [音频配置](./04-音频配置.md)
5. [播放控制](./05-播放控制.md)
6. [BGM管理](./06-BGM管理.md) - 本文件
7. [音效管理](./07-音效管理.md)
8. [3D音效](./08-3D音效.md)
9. [音量控制](./09-音量控制.md)

---

## 6. BGM管理

### 场景 BGM

```csharp
// 登录 BGM
PlayBGM("login");

// 主城 BGM
PlayBGM("city");

// 战斗 BGM
PlayBGM("battle");

// 副本 BGM
PlayBGM("dungeon");
```

### BGM 切换

```csharp
// 切换 BGM（淡入淡出）
SwitchBGM("new_bgm", fadeTime: 2f);

// 立即切换
SwitchBGMImmediate("new_bgm");
```

### BGM 状态

```csharp
// 暂停 BGM
PauseBGM();

// 恢复 BGM
ResumeBGM();

// 停止 BGM
StopBGM();
```

### 音乐管理器

```csharp
// 统一管理
AudioManager.PlayBGM(name);
AudioManager.StopBGM();
AudioManager.PauseBGM();
```
