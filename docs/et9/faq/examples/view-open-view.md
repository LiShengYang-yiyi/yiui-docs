---
title: Panel下的View如何打开另外一个View
et9: true
---

# Panel下的View如何打开另外一个View

常见会问到的一个问题这里做一个统一案例说明

![](/images/et9/img/MQaBb6Wy2oY14Rx0kXHcGLcSn4f.png)

## 结构

这里有一个Panel  然后有多个view

## 问题

先打开了其中一个view  如何 在view 内部让panel 打开另外一个view

为什么会有这个问题 因为view没有panel的实例 所以调用不到panel.openview方法

## 方案一

(不建议)

如果你确定你的view不存在其他任何地方使用 强关联此Panel

你可以强行拿到Panel实例

![](/images/et9/img/MAJXb3Gx7okGqWxG8jzcpknOnrg.png)

熟悉YIUI结构 所以view的2次parent就是panel的实例

但是不是PanelComponent  这个只是DemoPanel

所以你需要3层拿到最高级的

ET9中为了这个特意扩展了快捷方法 但是不推荐使用 只是想告诉你有这么个方式

(其他版本请抄下面自己实现)

```C#
//标准view(Panel下的view)(非独立View)
//可快捷获取panel实例 (不推荐使用)!!!
//这里只是告诉你有这么个方式
public static T GetPanel<T>(this YIUIViewComponent self) where T : IYIUIOpen
{
    if (self?.Parent?.Parent is T panel)
    {
        return panel;
    }

    Log.Error($"获取失败 {self.GetType().Name} 没有找到父级 {typeof(T).Name} 请检查结构");
    return default;
}

//同上 需要标准View
//这里拿到的不是panel 而是panel同级的YIUIPanelComponent
public static YIUIPanelComponent GetPanelComponent(this YIUIViewComponent self)
{
    if (self?.Parent?.Parent?.Parent is YIUIChild uiBase)
    {
        return uiBase.GetComponent<YIUIPanelComponent>();
    }

    Log.Error($"获取失败 {self.GetType().Name} 没有找到 YIUIPanelComponent 请检查结构");
    return default;
}
```

### 实现

从AView中 打开BView

![](/images/et9/img/CP75bzxg6oP1iHxQ0BWcxXyBn0d.png)

## 方案二

### 事件

这里就不写案例了 动态事件即可实现

方法发送动态事件打开BView

Panel监听这个动态事件 然后自己处理实现打开View

## 方案三

扩展打开方法

这是无参的

![](/images/et9/img/VHOFbxUYcorpb8x4nsacWstlnpg.png)

如果你要问 如果我打开每个View 还有不同的参数时怎么办呢?

请参考TipsHelper 这里就不介绍了

实现枚举打开方法

![](/images/et9/img/W5hOb119doM7B4x7zuUcE3NinQf.png)

### 实现

```C#
private static async ETTask OpenBView(this DemoAViewComponent self)
{
    await YIUIMgrComponent.Inst.Root.OpenPanelAsync
          <DemoPanelComponent, EDemoPanelViewEnum>(EDemoPanelViewEnum.DemoBView);
}
```
