---
title: InvokeListener 3.0
et9: true
---

# InvokeListener 3.0

## 快速监听

Invoke 相同Key只允许同时存在一个

通过快速监听可实现对任意Invoke事件 前后进行处理

一般常规功能需求可能都用不上

如果需要时就会很方便的功能

## 传统做法

可以在当前invoke中 直接实现 额外抛消息处理即可

但是会破坏当前方法的具体实现

比如常见的功能 打点记录

最简单的传统做法肯定是到对应的方法里面 加上打点的代码

但是这样就破坏了当前方法的实现还要去改别人的代码

(这种案例还是很多的就不一一举例了)

现在可以通过快速监听实现 在其他任意位置 事件触发前后额外处理

不破坏原有代码 也不需要自己额外定义事件 从而达到目的

## 使用

实现 YIUIListenerInvokeSystem 特性

包含优先级 (默认0 在Invoke之后执行)

![](/images/et9/img/YmIXbMpWEo6tPZxqBCZcbGcjnQx.png)

## 要求

::: tip ❤️
### 监听必须保持一致
### 参数保持一致
:::

## 案例

有个登录方法  我需要在其他地方监听 不改变源码的情况下实现方法的扩展

![](/images/et9/img/KyNVbCSynocFbPxWWGncMXTenhf.png)

### 手写

实现 YIUIListenerInvokeSystem 特性

#### 默认之后

这里没有填优先级所以默认是0 将会在Invoke之后执行

![](/images/et9/img/TxHmbCGlXocBE3xzzAwc73xkndf.png)

测试日志

![](/images/et9/img/DKgabrk2nolChsxyToccJbyQnmc.png)

#### 修改优先级 改为之前

<0 则在事件之前执行

![](/images/et9/img/DYy6bPe5GoZzQmxLMb8chofunIb.png)

![](/images/et9/img/AodMb6Hd6oQKlixrbNNc7Fx1nFc.png)

### 自动生成

找到任意system类 写上这个就行

1. YIUIListenerInvoke 特性
2. 需要监听的类型
3. 可选优先级

![](/images/et9/img/KBpAbloq4oVGtQxZKKXcwCF6nyb.png)

![](/images/et9/img/WBI4bUWknoDzFxxxlQ1cM7mEnKg.png)

#### 日志

相同优先级无法保证循序

不同优先级小的先执行

结果达到预期 完全正确

![](/images/et9/img/ZdQSb9EGEoHYGSxaXoTc0xLvnie.png)

## 自动生成建议

直接找到要监听的那个事件拷贝一个一样的

1. 特性 改为  YIUIListenerInvoke
2. 根据需求改一下优先级
3. 如果放到其他类方法名称都不用改
4. 改下实现内容

![](/images/et9/img/X4okb242RodIaYxbsaBczV4Wnh9.png)

![](/images/et9/img/C2ZKbRSMQo8MfDxDj20cYhGonZb.png)
