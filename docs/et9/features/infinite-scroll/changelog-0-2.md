---
title: 无限循环列表 0.2.+ 更新日志
et9: true
---

# 无限循环列表 0.2.+ 更新日志

## 老的 0.1.+ 版本

```C#

//只需要一个泛型取消了刷新类型 <数据类型>
public YIUILoopScroll<GMParamInfo> GMParamLoop;

//New
self.GMParamLoop =
new YIUILoopScroll<GMParamInfo>
//第三个参数改为 刷新类型
(self, self.u_ComParamLoop, typeof(GMParamItemComponent));

//扩展
//第四个参数可以传入以前的点击方法名称则可实现点击
//如:(self, self.u_ComGMTypeLoop, typeof(GMTypeItemComponent), "u_EventSelect");

//现在的分发 替代委托
[YIUILoopRenderer]
public class GMCommandItemComponentLoopRendererSystem :
//3个泛型确定分发类型 <当前实体,刷新实体,数据>
YIUILoopRendererSystem<GMCommandItemComponent, GMParamItemComponent, GMParamInfo>
{
    //刷新方法
    protected override void Renderer(GMCommandItemComponent self, int index, GMParamItemComponent item, GMParamInfo data, bool select)
    {

    }

    //你还可以手动重写Click 这样就有了Click方法
    protected override void Click(GMViewComponent self, int index, GMTypeItemComponent item, int data, bool select)
    {

    }
}
```

## 新的 0.2.+ 版本

## YIUILoopScroll 泛型类 改为组件 YIUILoopScrollChild

## System 自动生成

```C#
//参考GMViewComponent

//申明
public EntityRef<YIUILoopScrollChild> m_GMTypeLoop;
public YIUILoopScrollChild            GMTypeLoop => m_GMTypeLoop;

//添加组件
self.m_GMTypeLoop = self.AddChild<YIUILoopScrollChild, LoopScrollRect, Type, string>
                    (self.u_ComGMTypeLoop, typeof(GMTypeItemComponent), "u_EventSelect");

//有多个Awake 重载 也可以不使用参数自己调用 Initialize 与 SetOnClick

//使用自动生成 只需要写实现即可
[EntitySystem]
private static void YIUILoopRenderer(this GMViewComponent self, GMTypeItemComponent item, int data, int index, bool select)
{
    ...
}

[EntitySystem]
private static void YIUILoopOnClick(this GMViewComponent self, GMTypeItemComponent item, int data, int index, bool select)
{
    ...
}

```
