---
title: 动态 消息/事件
et9: true
---

# 动态 消息/事件

## [案例视频](https://www.bilibili.com/video/BV1KC4y1d7NZ)

[B 站视频 BV1KC4y1d7NZ](https://www.bilibili.com/video/BV1KC4y1d7NZ)

::: tip 🍉
通用框架中没有这个功能  自行接入自己的消息系统
:::

这个是ET框架中的UI消息

## YIUI消息

消息都是属于动态消息 直接发送到指定的实体中

也可以根据场景类型发送给指定场景的实体中

(ET9 已移除这个方式)

## UI消息

::: tip 🍉
**IYIUIEvent<>**
:::

此消息写在UI框架中 所以只能 view层使用

在表现层相互发消息时 建议使用此消息

### 案例:

```C#
// 消息结构定义
public struct LoadingProgressChanged
{
    public float Progress;
}

// 监听 继承 IYIUIEvent<消息类型>
public partial class LoadingPanelComponent : IYIUIEvent<LoadingProgressChanged>
{
    //Loading 面板 监听了一个动态消息 LoadingProgressChanged
}

// 接收 实现 YIUIEventSystem<监听者, 消息类型>
[ObjectSystem]
public class LoadingPanelComponentLoadingProgressChangedSystem : YIUIEventSystem<LoadingPanelComponent, LoadingProgressChanged>
{
    //在Loading System 中实现YIUIEventSystem<LoadingPanelComponent, LoadingProgressChanged>
    protected override async ETTask YIUIEvent(LoadingPanelComponent self, LoadingProgressChanged message)
    {
        //当有消息发送时 这里就会被触发
        await ETTask.CompletedTask;
    }
}

// 发送
await YIUIEventSystem.Event(new LoadingProgressChanged() { Progress = 0.3f });
//跟ET传统事件不同不需要传入场景 是因为这个消息会发送给所有场景
//如果有需要发送给指定的场景 可以参考动态消息这么写的自定义扩展

```

## 动态消息

::: tip 🍉
**IDynamicEvent<>**
:::

如果你需要在model层发送消息到view层可以使用此消息

当前也可以model之间发送使用

### 案例

```C#
//与UI消息写法是一样的 只是名字不同
//他们的触发环境不同

// 监听 继承 IDynamicEvent<消息类型>
// 接收 实现 DynamicEventSystem<监听者, 消息类型>

// 发送

-- ET 7.2
1: await EventSystem.Instance.DynamicEvent(new 事件);  //发送给任意场景
2: await EventSystem.Instance.DynamicEvent(场景, new 事件); //发送给指定场景
... 带场景参数的还有多个扩展 最终都是取场景

-- ET 8+
因为有纤程 所以只能在对应纤程中发送

1: await 任意Entity.DynamicEvent(new 事件); //在指定的entity的纤程中发送事件给任意场景
2: await 任意Entity.DynamicEvent(场景, new 事件); //在指定的entity的纤程中发送事件给指定场景
... 带场景参数的还有多个扩展 最终都是取场景

```

先有 **IYIUIEvent 后有 IDynamicEvent**

所以你会发现其实全程都用 **IDynamicEvent 也是可以实现的**

但是建议纯表现层的动态消息使用 **IYIUIEvent**

逻辑层的动态消息 或者 需要逻辑层发送到表现层时 才使用 **IDynamicEvent**

另外尽可能的使用ET原生消息 不要滥用动态消息

## ET9

动态消息统一合并为DynamicEventSystem

使用方法参考8.1 一样的 就是取消了UI独立的 YIUIEventSystem.Event
