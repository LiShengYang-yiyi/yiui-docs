---
title: 多语言
et9: true
---

# 多语言

## [案例视频](https://www.bilibili.com/video/BV1cz4y1s7QS?p=15)

[B 站视频 BV1cz4y1s7QS](https://www.bilibili.com/video/BV1cz4y1s7QS)

## ETPackage包:[cn.etetet.yiuilocalization](https://github.com/ET-Packages/cn.etetet.yiuilocalization)

## ET9 [多语言](/et9/features/builtin/localization)

Unity 6000 版本API 有改动多语言会报错以下是修改方法

![](/images/et9/img/M3NvbVeZso1eVbxDf90csQCPn5f.png)

#if UNITY_6000_0_OR_NEWER

var info = typeof(EditorGUI).GetProperty("s_RecycledEditor", BindingFlags.NonPublic | BindingFlags.Static);

#else

var info = typeof(EditorGUI).GetField("s_RecycledEditor", BindingFlags.NonPublic | BindingFlags.Static);

#endif

---

## [多语言 Pro](/et9/packages/localization-pro/)

更适合团队使用的多语言Pro
