---
title: UniTask DOTweenAsyncExtensions
et9: true
---

# UniTask DOTweenAsyncExtensions

(通用版)在框架中默认使用UniTask 作为异步扩展

ET中有自带的ETTask异步方案

其中Dotween 插件的动画也可以被异步 所以框架中有用到

UniTask本身也是支持Dotween的 但是需要手动开启

原生插件是自带扩展的 但是需要手动开启后才能使用

![](/images/et9/img/VsC8bpiXEo6vTfxjPo2cvcNqnKc.png)

方法一:

添加宏  UNITASK_DOTWEEN_SUPPORT

因为这个自带的扩展是用宏限制的 要打开需要自己手动添加这个宏

![](/images/et9/img/K6JZbRE4xotHRLxgFGycPooYnje.png)

方法二:

如果觉得宏添加麻烦 可以直接改这个源码 吧宏限制直接删除了

或者在宏上面添加 #define UNITASK_DOTWEEN_SUPPORT

![](/images/et9/img/UFcLb9WlzoxcekxzCiXc4HQsnbf.png)
