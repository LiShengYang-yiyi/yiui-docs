---
title: Invoke 2.0
et9: true
---

# Invoke 2.0

::: tip 🏕️ 原因
由猫大提出的关联问题
:::

::: tip ❤️ 重构
注意必须所有UI重新生成 重新修改
新用户可无视重构相关内容
:::

### UI 定义了一个事件

![](/images/et9/img/UoCub7oofod2iKxNZGOcAwDDncc.png)

### 代码

![](/images/et9/img/UGfvb84Iuo5VZTxRVbvcqw4hn9c.png)

![](/images/et9/img/S12bbnd8LoCfAqx6Yjncw2Xencb.png)

![](/images/et9/img/GcMabqygLokk5nx2B2PcAZT4nDd.png)

从1-6个步骤 就是整个事件的关联流程

但 3 与 4  因为是字符串  所以无法直接关联  虽然逻辑上是通的

在查看代码上就变成了魔法 找不到实现 关联不上

由此提出解决方案 实现关联性

## 修改

自动生成Const

![](/images/et9/img/OSnSbMPhNoESUOxAfwXcQXmFngb.png)

(类名.事件名)(增加了唯一性 有其他作用)

关联使用Const

![](/images/et9/img/WJkpb3987ov5ytxQweYcZlxQnfe.png)

Invoke 可填入Const参数

![](/images/et9/img/Q6ylb87PhoMevZxWO7RcrdRwnUc.png)

自动生成的类使用Const

![](/images/et9/img/FtIJbhYxWoHkGvxWK7dceLnUnQb.png)

这样整个步骤实现就关联上了

## 如果移除了之前定义的事件

老:  无法知道  需要手动删除之前定义的方法

新:  因为用const关联了  移除后const就没了  实现的方法上面的const就会报错

![](/images/et9/img/SHUob0dQpo3cjfx09p6cVvjKnub.png)

::: tip 📚
这样也算一个优化 可以知道目前已经没有这个事件了
可以给到你一个提示 以前的方法是否还需要保留
:::

要保留你可以把方法上的Invoke特性删掉就好了

## 兼容

不与老数据兼容 必须重新生成

![](/images/et9/img/SdFObSwZ7om4h2x91LdctKiTnyd.png)

为什么不强制必须Const

因为Invoke是一个通用功能 不光是UI事件自动生成用

其他地方有可能根据方法名自动生成会更方便

目前UI用Const方便是因为 这个Const是自动生成的 有自动生成是很方便

如果没有自动生成就相对来说不太方便

所以保留以前的功能 不冲突 各有优缺点

不用Const 可能就比较魔法 不知道怎么关联上的

如果想关联上就需要定义Const

::: tip ❤️
### 当前预制
所有UI重新生成 必须修改 YIUIInvoke 的实现
(注意你重新生成了代码 不会有提示 需要手动修改)
:::

1. 工具  全部发布

则所有UI的事件都会修改为Const

但是System的事件Invoke 不会自动写上Const  需要手动修改

![](/images/et9/img/XZVsb7REro5XKdxcB1Sc6rlAnLf.png)

1. YIUIInvokeAttribute 中的默认构造函数

![](/images/et9/img/HQcTbb4Sxo6LFgx3NQIccj4Kntd.png)

注释也可以 根据引用一个一个改也可以 反正就是找到以前所有UI自动生成相关的全部改一次

(如果是注释的改完过后要改回来哈)

使用默认生成时 = 类名.方法名 (如果想自动生成的 那你出入的字符串名称要注意是拼写的保证唯一性)

如: 条件系统案例写法

![](/images/et9/img/QUhpb2xsAoVx7KxzdkMcOCmbn9e.png)

---

## SG优化

::: tip ❤️
所有生成的SG 每个方法都生成一个部类 这个太多了
优化 所有SG只生成一个类 把事件集合到一个SG类里面
:::

减少了Invoke生成的类
Awake 生命周期那些是ET的SG生成的  打算提交一个PR一起优化

![](/images/et9/img/Bx5lbCSo8o2NZhx4GuucWYsPnqd.png)

数量显著下降

截图中的类 之前的多的3个合并成了1个

Awake 相关的SG 还有4个 也合成1个 就完美了 (已PR合并)

![](/images/et9/img/IlmBbn3y3oUw6ixhyhpcFLzRnNb.png)

![](/images/et9/img/Z0CpbUefDolWrVxQtfjcN6ZEnod.png)

## Invoke 事件合并到一个类

![](/images/et9/img/HRvCbpB2LoGNk2xpDGRcpOnrnYc.png)

## 已PR官方SG EntitySystem 也合并到一个类中了

![](/images/et9/img/Kn93bZU2voYbduxd1HUcCIqLn9c.png)

![](/images/et9/img/Sc1lbSafNosQ5Dx6W3mcSzEGn9d.png)
