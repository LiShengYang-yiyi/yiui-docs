# Video 视频 - AI 指导

> 本指南帮助你如何向 AI 助手咨询视频播放相关问题

## 包信息

- **对应包**: `cn.etetet.yiuivideo`
- **依赖**: YIUI 框架、Luban 配置解决方案、AVPro Video

## 常见 AI 咨询场景

### 1. 安装配置

**可以这样问 AI:**
- "如何安装 AV Pro Video？"
- "如何安装 YIUI Video 扩展？"
- "如何在 ET 项目中添加运行时？"

### 2. 基础使用

**如何问 AI:**
- "如何在 UI 上播放视频？"
- "如何控制视频播放/暂停？"
- "如何获取视频播放状态？"

### 3. 进阶功能

**可以这样问 AI:**
- "如何实现视频与 UI 交互？"
- "如何处理视频加载完成事件？"
- "如何实现视频预加载？"

### 4. 注意事项

**可以这样问 AI:**
- "HarmonyOS 不支持怎么办？"
- "XR 平台报错怎么解决？"
- "视频格式有哪些要求？"

## 常用代码模式

```csharp
// 播放视频
var videoPlayer = entity.GetComponent<YIUIVideoComponent>();
videoPlayer.Play(videoPath);

// 暂停/停止
videoPlayer.Pause();
videoPlayer.Stop();
```

## 相关文档

- [快速入门](./快速入门/index.md)
- [案例](./案例.md)
- [注意: HarmonyOS 不支持](./注意-harmonyos-鸿蒙-不支持.md)
