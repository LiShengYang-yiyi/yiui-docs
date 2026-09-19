---
title: UI打开关闭动画
et9: true
---

# UI打开关闭动画

## [案例视频](https://www.bilibili.com/video/BV1KC4y1d7NZ)

[B 站视频 BV1KC4y1d7NZ](https://www.bilibili.com/video/BV1KC4y1d7NZ)

打开关闭动画 适用于 Panel / View

### 通用版

不管是BasePanel 还是 BaseView

都可以重写这个方法 则可实现自己的动画逻辑

```C#
protected override async UniTask OnOpenTween()
{

}

protected override async UniTask OnCloseTween()
{

}

protected override void OnOpenTweenStart()
{

}

protected override void OnOpenTweenEnd()
{

}

protected override void OnCloseTweenStart()
{

}

protected override void OnCloseTweenEnd()
{

}
```

### ET

[YIUI事件 生命周期](/et9/features/event-lifecycle)

IYIUIOpenTween

IYIUICloseTween

实现对应事件即可

对应还有动画结束事件

IYIUIOpenTweenEnd

IYIUICloseTweenEnd
