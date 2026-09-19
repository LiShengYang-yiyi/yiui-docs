---
title: Invoke
et9: true
---

# Invoke

## [YIUIInvoke]

特性

在任意类的System中标记静态方法则可生成对应的System类

## 要求

必须是Entity的System类中

这个类必须是部类 partial

![](/images/et9/img/B6H8b3TN5oBWJax4vkTcIYIZnib.png)

## 案例

总结: 支持最多5个参数 1个返回值 的任意System的任意方法

```C#
//无返回值 无参数
[YIUIInvoke]
private static void OpenGMView(this GMPanelComponent self)
{
}

//无返回值 有参数
[YIUIInvoke]
private static void OpenGMView2(this GMPanelComponent self,bool a)
{
}

//有返回值 无参数
[YIUIInvoke]
private static bool OpenGMView3(this GMPanelComponent self)
{
    return true;
}

//有返回值 有参数
[YIUIInvoke]
private static int OpenGMView4(this GMPanelComponent self, bool a)
{
    return 1;
}

//异步 无返回值 无参数
[YIUIInvoke]
private static async ETTask CloseGMView(this GMPanelComponent self)
{
    await ETTask.CompletedTask;
}

//异步 有返回值 无参数
[YIUIInvoke]
private static async ETTask<bool> CloseGMView2(this GMPanelComponent self)
{
    await ETTask.CompletedTask;
    return true;
}

//异步 无返回值 有参数
[YIUIInvoke]
private static async ETTask CloseGMView3(this GMPanelComponent self,string a)
{
    await ETTask.CompletedTask;
}

//异步 有返回值 有参数
[YIUIInvoke]
private static async ETTask<bool> CloseGMView4(this GMPanelComponent self, int a)
{
    await ETTask.CompletedTask;
    return true;
}
```

详细使用参考所有UI的事件关联

案例:

```C#
//假设有这么个事件
[YIUIInvoke]
private static void OpenGMViewA(this GMPanelComponent self)
{
}

[YIUIInvoke]
private static void OpenGMViewB(this GMPanelComponent self)
{
}

//调用
{

    //Trigger = GMPanelComponent 实体
    //调用的事件名称 = 定义事件时的方法名称
    //注意调用时 参数 返回值 等都要对应上才行 否则会提示报错

    //传入A方法名称即可触发A方法
    YIUIInvokeSystem.Instance.Invoke(Trigger, "OpenGMViewA");

    //传入B方法名称即可触发B方法
    YIUIInvokeSystem.Instance.Invoke(Trigger, "OpenGMViewB");

    //其他有泛型参数 有返回使用同理
    //目前是YIUI的所有UI事件在使用
    //但是他还有其他应用场景 就看你能否想到了
    //跟ET的原生 Invoke 是有本质区别的别搞混了
}
```
