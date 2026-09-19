---
title: CDE Table
et9: true
---

# CDE Table

> ## [视频介绍](https://www.bilibili.com/video/BV1cz4y1s7QS?p=7)

::: tip 🌟
点赞支持 一键三连
:::

> 本段内容同步自：[通用 接入](/et9/integration/general)

[B 站视频 BV1cz4y1s7QS](https://www.bilibili.com/video/BV1cz4y1s7QS)

## **CDE 是什么**

### C = [Component Table](/et9/cde-table/component)

### D = [Data Table](/et9/cde-table/data)

### E = [Event Table](/et9/cde-table/event)

### 目的

写 UI 逻辑时  尽可能少的去关注 UI 是什么 我需要操作那个 UI

我们更多的应该注重逻辑 而不关心 UI 具体绑定了什么

比如在给一个文本 修改文字时   我们不需要去 get 这个组件然后知道他修改文本的 API  因为这些都是固定的操作 我们应该注重于 直接修改字符串数据   对应的文本自动更新  我完全不关心你把这个字符串拿去干什么

还有一对多功能

点击事件同理  我只需要注册 XX 事件 回调是什么  至于你在哪里调用我这个事件 我并不需要关心

抛弃找各种点击的组件  然后在给组件添加对应的事件这样的流程

我只关心我需要操作的数据 与 回调

最终达到  数据 与 UI 分离的目的

某种意义上的 因为分离 所以 数据 可以一对多 等等各种好处

例子：

文本绑定的 Text 改 TMP 并不需要改代码

只需要扩展对应的 TMP  修改绑定即可

> ### [Component](/et9/cde-table/component)

UI 各种组件的收集器

因为直接使用的是 Unity.Component

使用 Unity 预制体 序列化

所以可以直接访问到对应的组件且没有 get 消耗 提升性能

> ### [Data](/et9/cde-table/data)

在整个 UI 逻辑中 我们会定义各种字段

int

float

bool

等等 各种常见字段

将提供 整套 数据支持

支持  自定义各种数据扩展

1 一些常用数据 字段 我们不用定义了数据将与 UI 进行绑定

我们可以不必知道 我们要操作的 UI 是什么了

2 以后直接操作数据  而不需要关心 UI 是什么

根据具体参考详细介绍

> ### [Event](/et9/cde-table/event)

各种点击  拖拽 等常规操作的绑定

提前定义事件

事件与各种操作进行绑定

逻辑时 我们只需要关心事件回调

并不需要 过多的关注到底是那个 UI 来的事件 进行分离

::: tip 🌟
**重点 所有相关操作 都要到预制件里面操作 不能外部操作**
**双击预制体 进入预制体编辑界面进行编辑**
**绝对不能把预制体拖到场景中编辑完过后点击保存 这个是无法生效的**
:::
