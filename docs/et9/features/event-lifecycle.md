---
title: YIUI事件 生命周期
et9: true
---

# YIUI事件 生命周期

![](/images/et9/img/ARAvbqD9coBhvIx2lyScjrzvndc.png)

---

## Invoke

所有的Invoke事件

![](/images/et9/img/Ba5tbmz7doIKWRxXgkecQkHXn10.png)

详细的内容 自行了解  多数都是框架内部使用消息

---

## Publish

所有的Publish事件

![](/images/et9/img/J6crbJJUMoNConxpA1PcP8Szn1b.png)

### 初始化

#### YIUIEventInitializeAfter

```C#

public static async ETTask<bool> Initialize(this YIUIMgrComponent self)
{
    ...

    //其他模块各自初始化
    await EventSystem.Instance.PublishAsync(self.Scene(), new YIUIEventInitializeAfter());
}

//YIUI初始化过后的事件 其他模块各自初始化
public struct YIUIEventInitializeAfter
{
    //ET9 拆分模块后将会有统一发出此消息
    //各自模块自己监听 初始化自己
}

//案例 比如GM模块
[Event(SceneType.All)]
public class YIUIEventInitializeAfterGMHandler : AEvent<Scene, YIUIEventInitializeAfter>
{
    protected override async ETTask Run(Scene scene, YIUIEventInitializeAfter arg)
    {
        //根据需求自行处理 在editor下自动打开  也可以根据各种外围配置 或者 GM等级打开
        //if (Define.IsEditor) //这里默认都打开
        {
            scene.AddComponent<GMCommandComponent>();
        }

        await ETTask.CompletedTask;
    }
}
```

### 开关

#### YIUIEventPanelOpenBefore

```C#
//UI消息  有UI被打开之前 (有人调用了打开XXpanel 但是还未加载UI之前)
public struct YIUIEventPanelOpenBefore
{
    public string      UIPkgName;       //所在包名
    public string      UIResName;       //资源名称
    public string      UIComponentName; //组件名称
    public bool        StackOption;     //是否是堆栈操作来的消息
    public EPanelLayer PanelLayer;      //所在层级
}
```

#### YIUIEventPanelOpenAfter

```C#
//UI消息  有UI被打开之后 (已经完成了所有加载包括动画后)
public struct YIUIEventPanelOpenAfter
{
    public bool        Success;         //最终是打开成功还是打开失败
    public string      UIPkgName;       //所在包名
    public string      UIResName;       //资源名称
    public string      UIComponentName; //组件名称
    public bool        StackOption;     //是否是堆栈操作来的消息
    public EPanelLayer PanelLayer;      //所在层级
}
```

#### YIUIEventPanelCloseBefore

```C#
//UI消息  有UI被关闭之前 (有人调用了关闭XXpanel时)
public struct YIUIEventPanelCloseBefore
{
    public string      UIPkgName;       //所在包名
    public string      UIResName;       //资源名称
    public string      UIComponentName; //组件名称
    public bool        StackOption;     //是否是堆栈操作来的消息
    public EPanelLayer PanelLayer;      //所在层级
}
```

#### YIUIEventPanelCloseAfter

```C#
//UI消息  有UI被关闭之后 (已经完成了所有加载包括动画后) 被摧毁前
public struct YIUIEventPanelCloseAfter
{
    public string      UIPkgName;       //所在包名
    public string      UIResName;       //资源名称
    public string      UIComponentName; //组件名称
    public bool        StackOption;     //是否是堆栈操作来的消息
    public EPanelLayer PanelLayer;      //所在层级
}
```

#### YIUIEventPanelDestroy

```C#
//UI消息  被摧毁
public struct YIUIEventPanelDestroy
{
    public string      UIPkgName;       //所在包名
    public string      UIResName;       //资源名称
    public string      UIComponentName; //组件名称
    public EPanelLayer PanelLayer;      //所在层级
}
```

---

## System

所有事件都在SystemEvent目录下

UI的各种生命周期事件

开关 堆栈 显隐 动画 ...

![](/images/et9/img/NDtKbR5E8ovIb2xTCFqccFP7n3f.png)

---

::: tip ✏️ Back
Panel层级下的UI 堆栈操作相关事件
:::

### 堆栈回退

#### IYIUIBackOpen

被添加触发 (有其他界面关闭 当前界面被打开) 自己被打开

#### IYIUIBackClose

被关闭触发 (有界面打开 当前界面被关闭) 自己被关闭

#### Home

home被触发时也会触发back事件

![](/images/et9/img/DkV5bulQTopVGnxKljgc0c1ZnWw.png)

在窗口基础设置有跳过HomeBack选项

默认 = false 则home时会触发back事件

##### IYIUIBackHomeClose

HomeClose触发 (有其他界面打开 当前界面被关闭) 自己被关闭

##### IYIUIBackHomeOpen

HomeOpen触发 (当前界面home打开 其他全部关闭) 自己被打开

---

::: tip ✏️ 开关
:::

### 开关

#### IYIUIOpen

打开事件 如果没有则算成功

UI的可扩展方法 可以没有

最高支持5个泛型参数

打开失败则会关闭UI

ET 中的Awake 只是UI被创建 并没有被初始化

实际逻辑应该写在 Open 之后

Awake 与 Open 有时序区别 与参数区别

UI打开状态下继续调用Open 会反复触发

#### IYIUIClose

关闭事件 如果没有则算成功

代表UI正在关闭中  在关闭前来的消息 可以根据实际需求使用

因为是异步的 所以在过程中注意屏蔽玩家操作之类的

防止玩家的操作打断你的异步关闭准备工作

大概率不需要使用这个

UI被关闭

与OnDisable 不同  Disable 只是显隐操作不代表被关闭

与OnDestroy 不同  Destroy 是摧毁 但是因为有缓存界面的原因 当被缓存时 OnDestroy是不会来的

这个时候你想要知道是不是被关闭了就必须通过OnClose

true = 界面可以被关闭 (99%的情况都返回true)

false = 界面不允许关闭 需要自行处理各种突发情况 (false 可能会遇到各种界面未关闭的情况)

这个事件建议没有特殊情况不要用

#### IYIUIWindowClose

ET9功能

> 本段内容同步自：[0.3.0](/et9/changelog/v0-3-0)

---

::: tip ✏️ 显隐
这个是Unity的显隐事件转发的 所以建议不要在这上面写功能
你所想的 自己被打开了 关闭了 跳转 一定都有其他方式知道
当然这个也可作为一把梭也会简单 但是你得做到各种判断
:::

### 显隐

完全同步mono的生命周期

所以打开某个Panel时你会发现Enable被触发了2次

因为被加载出来一瞬间就是激活的 然后被隐藏了

接着走打开逻辑动画又被激活了  这个流程是真实的mono生命周期

设计时就是为了同步mono的  有很多其他生命周期 没特殊需求不建议用这个

如果你实在要用这个 又只想一次激活 请自行修改源码实现

#### IYIUIDisable

被隐藏时事件

#### IYIUIEnable

激活时事件

---

::: tip ✏️ Tween
所有动画事件
打开/关闭
开始/结束
:::

### 动画

#### IYIUIOpenTween

打开动画消息

#### IYIUIOpenTweenEnd

打开动画结束消息

#### IYIUICloseTween

关闭动画消息

#### IYIUICloseTweenEnd

关闭动画结束消息

---

::: tip ✏️ 特殊
(大多数时候都用不上的功能)
:::

### 特殊

#### DisClose

当一个界面 EPanelOption.DisClose 时 (禁止关闭)

且又被调用时 则会触发 可根据需求使用

根据需求返回 是否可以被关闭

返回true 就是可以被关闭

---

::: tip ✏️ 内部 生命周期
(事件无需关心 内部都是封装好的 了解即可)
:::

### 内部 生命周期

#### Initialize

初始化事件 与Awake不同 awake是没有初始化UI信息的

在UI体系中ET的awake 你只能当做构造器的调用 只是知道被new了而已

你要知道是不是序列化完成了要使用这个事件

#### Bind

绑定事件 也可以理解为UI的初始化前

::: tip 👓 预加载
:::

### 预加载

#### IYIUIPreLoad

Panel预加载
