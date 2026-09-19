---
title: 无限循环列表
et9: true
---

# 无限循环列表

## ETPackage包:[cn.etetet.yiuiloopscrollrectasync](https://github.com/ET-Packages/cn.etetet.yiuiloopscrollrectasync)

https://github.com/qiankanglai/LoopScrollRect

基于Git开源项目 LoopScrollRect 上做的扩展

##### **基础知识 与使用请参考Github地址**

::: tip 💡

此插件 基本可以适应绝大部分循环列表需求!  但并不能满足任何需求!

如果你有 不规则列表 或者 过程中动态变化大小 树形 等等 非常复杂需求时  建议换个其他方案

[SuperScroll 循环列表](/et9/packages/superscroll)

[其他循环列表插件推荐](/et9/features/infinite-scroll/other-scroll-plugins)

:::

YIUI中的扩展用法请参考下面:

## [案例视频](https://www.bilibili.com/video/BV1cz4y1s7QS?p=11)

[B 站视频 BV1cz4y1s7QS](https://www.bilibili.com/video/BV1cz4y1s7QS)

## 常见问题

这个无限循环列表的刷新对象 必须有Layout  组件

![](/images/et9/img/DQKDbGlCboBtYExCoQrcrQbOnrh.png)

YIUI默认提供了6种 默认快捷创建

![](/images/et9/img/DpOnbfA6xoenthxi31Ec6QbLnNc.png)

在没有很了解的情况下  创建后什么锚点都不要改 只能改大小 否则也会错

不要问为什么有这些限制 这个插件就是这么设计的 具体请看源码

::: info 📌
**在没彻底了解的情况下 不要修改任何布局设置 都有可能导致各种问题**
:::

建议在最基础的情况下 不修改任何布局 来初始化你的LoopScroll

如果当前发生各种问题 什么刷新数据 长度不一致 需要拖动一下 才能看到正确结果 等等...

都请重新通过工具 创建一个全新的干净的测试

如果还有什么问题 请https://github.com/qiankanglai/LoopScrollRect 详细了解

::: tip 🌟 更多功能API 请查看源码 有任何疑问欢迎咨询
:::

::: tip 🌰 详细案例代码 查看  YIUI全量Demo  商店模块
:::

---

[点击](/et9/features/infinite-scroll/click)  如何在列表中实现点击回调

[异步 无限循环列表](/et9/features/infinite-scroll/async) 异步需求
