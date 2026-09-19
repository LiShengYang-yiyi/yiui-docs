---
title: Event Table
et9: true
---

# Event Table

## 事件表

### 定义

名称 与 事件 之间的映射表

我们不再关心 UI 上的那个按钮触发什么事件

只需要设定好事件即可 无需关心是什么触发的

由 UI 其他可响应事件进行绑定

### 命名

为了跟自己写的其他方法不要重叠

OnEventXXX

### 预览

::: tip 🌟
非最终效果 还在不断完善
:::

![](/images/et9/img/Xl2tbNoj5oZjpnxZtYKcdaypnef.png)

![](/images/et9/img/VGalbf98comQ8qxdKKQcnCQsnfb.png)

### 重大升级

::: tip ⚽
升级 事件参数改为 ParamVo 封装类
   1. 原本事件参数采用的是 params object[]
但是会发生接收事件 触发消息方法 还需要解析参数 各种 太麻烦了
2 封装了一个类 ParamVo
这样拿到的参数就可以用 get<> 泛型获取到你想要的数据
缺点： 需要已知别人传入的参数类型 否则会解析错误 对 UI 绑定上面需要人工筛查
升级  事件参数改为 最大支持 5 个的任意泛型参数
这个就很重要了 这样我们所有的绑定事件 都可以确定参数了  抛弃了中间层解析
监听层  发送层 都更明确目标了
:::

::: tip ❤️

事件支持同步事件与异步事件

:::

![](/images/et9/img/CQr1b91bAowus6xMgmMcogpMn7d.png)

### 异步事件的区别

- 异步事件默认响应中会屏蔽所有UI操作 (可开关选择,默认开启)

![](/images/et9/img/ObgVbNsDKoihG2xDgcAcxTTHnMg.png)

- 方便  (如果用同步事件调用其他异步方法还需要自己开协程 或 封装一个方法来调用)

(有操作时间的都建议用异步事件)

同步事件搜索: UIEvent

异步事件搜索: UITask

(异步事件目前只有点击 有需要的参考点击自行扩展)

![](/images/et9/img/FDXMbgMz7ocLRtx5aZ6clE1qnKd.png)

![](/images/et9/img/LpTwb0kBKo7vfdxwniacIwNbnbd.png)

::: tip 💡

事件参数

某些事件是要求参数的 你创建的事件不满足要求时则会提示无可用事件

:::

添加事件参数操作流程

![](/images/et9/img/LydKb81ifobY1IxHWCAcduQ6nmR.png)

### 确定事件类型 ( 同步/异步 )

### 确定参数是否正确

## 修改事件

事件创建后就 无法修改类型 无法修改参数 只能删了重新定义

事件前面可以看到当前事件是什么类型

![](/images/et9/img/NpHObnr9go13XsxKOUfcWlWJnQe.png)

## 功能归纳

::: tip 🌰
部分功能
:::

### Active 显隐

当前物体被显隐修改时

![](/images/et9/img/TDEhb9ZfPo96ZSxR0eQcE72mnNd.png)

问题 如果需要 Component 的 enabled 怎么办

首先有 databind 对应的 component 组件

自己调代码的不管 那应该自己处理

他被改变时是有消息的 所以可以配合 Event ChangeData 消息来同步

缺点 这个消息是没有参数的  无法准确的知道是那个组件被修改了

解决方案  这个 change 属性只绑定一个不要使用多个的  由人为绑定确定对象

另外可以监听某个 data 值改变的事件 实现

参考 UIDATA 高级用法

### Click 点击事件

任意可以被点击的 UI 都可以触发此事件

![](/images/et9/img/NLnJbMQF7ooJtExBKMwcbwoCnZb.png)

无参数

一般常用这个

UIEventBindClickPointerEventData

![](/images/et9/img/CTiubgqpko1OxQxJLnIcxOzWn1b.png)

带一个 OBJ 参数 本质是 PointerEventData

这样可以知道点击的一些信息 比如点击的坐标在哪里呀什么的

### 进入 退出 按下 抬起 等各种事件都可以参考 click 扩展

### ChangeData 数据改变事件

配合数据表 Change 使用 当触发数据改变时就会触发对应的事件

![](/images/et9/img/GH89bt6b3ow4GtxEtmBclJvYnud.png)

### Dorpdown 下拉菜单

监听了下拉菜单的改变事件

![](/images/et9/img/LvDIbfcNtof87hxuoZncTXEWnPb.png)

改变后会触发事件  参数 1  改变的索引

### InputField 输入栏

输入栏的试试改变事件

![](/images/et9/img/VZXabsmYbo0XzFx6mTrciaY1nic.png)

结束时的事件

![](/images/et9/img/AdW0bcUXJospbzxKtK1cv01VnEe.png)

### Scrollbar 滚动条

![](/images/et9/img/Ww6NbKY3voP22IxceU5cVXcanKf.png)

### Slider 滑动条

![](/images/et9/img/Ej2mbdBzLofhU4xAqjPci10Mnz5.png)

### Toggle 开关

![](/images/et9/img/GwDubWu7molrb5xx6UDcUSc3nee.png)

::: tip 🍞 更多功能持续扩展中
:::
