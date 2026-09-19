---
title: 无限循环列表 0.3.+ 更新日志
et9: true
---

# 无限循环列表 0.3.+ 更新日志

ET9 最新引入 可热重载无限循环列表方法 从而导致的写法改变

IYIUILoopRenderer

IYIUILoopOnClick

具体使用案例可参考  GMViewComponentSystem

已知LoopScroll 已经改为组件

## 申明引用

![](/images/et9/img/YcQebKPEno6PGGxKEUHcFFNpnTf.png)

## 添加组件

```C#
self.m_GMTypeLoop = self.AddChild<YIUILoopScrollChild, LoopScrollRect, Type, string>(self.u_ComGMTypeLoop, typeof(GMTypeItemComponent), "u_EventSelect");

self.m_GMCommandLoop = self.AddChild<YIUILoopScrollChild, LoopScrollRect, Type>(self.u_ComGMCommandLoop, typeof(GMCommandItemComponent));
```

分别对应2种初始化方式   最后的string 就是以前的点击方法

参数1: LoopScrollRect Mono 组件 由UIComponentTable 添加

参数2: 循环列表需要创建的实体类型

参数3: 如果可以被点击的点击方法名称

## 渲染方法

以前都是写的委托 回调...

现在需要手动定义 内部会自动调用

GMTypeLoop举例

已知初始化时定义

![](/images/et9/img/FmqbbOXGxoyuQXxRJc0c4e5ennb.png)

所以这个方法的Item类型必须是 GMTypeItemComponent

![](/images/et9/img/HW2dbyW46oL3fLxWtmPcGbMRnGd.png)

已知刷新方法传入的是 List 所以Data 数据类型为 Int

### 定义

1. this 为自身
2. item = GMTypeItemComponent
3. data = int

![](/images/et9/img/MOGYbXBTEovuvcxTb6pcrcpVnPc.png)

[EntitySystem] 标记特性

方法名称必须是 YIUILoopRenderer

因为初始化时有点击方法 所以还需要定义一个点击

![](/images/et9/img/UxJKbvgtiocdjmxvoejc0ROBn9c.png)

[EntitySystem] 标记特性

方法名称必须是 YIUILoopOnClick

### 注意: 点击事件必须是同步事件
