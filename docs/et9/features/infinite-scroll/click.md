---
title: 点击
et9: true
---

# 点击

假设 我们需要在一个列表中做选中逻辑  选中时有一个选中框

### 预设配置

#### Select

datatable中添加选中数据

![](/images/et9/img/X1B3bIDiIo3aCuxo3Y0cHP5Vnke.png)

关联选中的图 当数据 =true时 亮起选中

![](/images/et9/img/HS9cbRcGroMRVHxMggzc42slnhg.png)

#### Click

添加一个UI可以触发点击的  注意根据你的需求调整他的层级 这里是案例 所以放这里

![](/images/et9/img/DMqwb77uLoL6USx2haCcHOvenqh.png)

添加一个点击方法 用于触发点击  注意只能添加同步无参的点击方法

同步无参的点击方法

同步无参的点击方法

同步无参的点击方法

同步无参的点击方法

这个方法全名 = 循环列表中注册时的点击名称 所以要记住咯

![](/images/et9/img/ZYB7bLr77ofLa5x810mcim4en1i.png)

关联点击事件

![](/images/et9/img/LIU1bwyXJojs4mxMeWPcS6Swnvb.png)

**注意 生成代码**

### 初始化点击

![](/images/et9/img/YUvZbjuQJouiqaxANtPcHw3cnOd.png)

在初始化你的loopscroll过后  调用 SetOnClickInfo

参数1 :  对应的那个item的点击事件全名

参数2 :  点击回调方法

### 案例回调

我们使用日志来了解一下这个回调的触发时机 如何使用

![](/images/et9/img/BqVqboiA2oh9qaxVGqZcxDLXnwd.png)

点击流程 1: 点击了第1个Item

结果: item 索引0 被点击  select =true  所以这个item被选中了

![](/images/et9/img/ZmfNbyL3DoqeRBxVXnvcAS6fnSe.png)

点击流程 2: 点击了第2个Item

结果: 后面2条是点击第二个来的日志

所以你会得到上一个item 索引0 被取消选中 select = false

再来告诉你选中了 item 索引1 select = true

![](/images/et9/img/K5PjbTwPxozEohxTkJLcI9ZrnSH.png)

点击流程 3: 点击了第3个Item

结果: 后面2条是点击第二个来的日志

所以你会得到上一个item 索引1 被取消选中 select = false

再来告诉你选中了 item 索引2 select = true

![](/images/et9/img/XWmUbrzGyo3k2Jx8RGrc3UjmnqY.png)

结论:

如果之前有选中过目标 会先通知你上一个目标被取消了

接着通知你当前被选中了

多选时  当选中数量>=可选中数量时 会先取消 最早的那个 然后选中当前

注意:

这里选中仅仅是触发了回调而已 并不会触发你的 选中框亮起

这个需要自己处理 接下来我们看看具体处理案例

### 选中逻辑

在刚刚的item中添加 选中方法 由列表调用触发

![](/images/et9/img/HLpAbPZX4odGGRxjcOncv1Avnhb.png)

或者 直接写在触发列表 这里也不是不行  推荐写在对应的item中

![](/images/et9/img/HVPxbVa99olzLBx6lpccbmFrn8d.png)

案例测试:  这个时候 点击后你就会发现  选中后框就亮起来了  切换时也可以同步

![](/images/et9/img/DhoJbs9Jyo39kYxP1Jbca1grnKb.png)

![](/images/et9/img/GkJrbsQgsoSQvoxIkCMcTqvznDg.png)

### 注意

由于列表是无限循环的  假设当前选中1   然后滚动到后面 触发了对象池 你会发现  没有被选中的亮了起来

是因为对象池的原因 所以你需要处理 刷新选中

所以在我们之前的刷新方法中给到的选中参数就有作用了在这里你需要根据需求初始化你的选中

![](/images/et9/img/KUZlbSfDuoGyK9xBkklcDSn0nrb.png)

### 默认选中

在列表中提供了2个方法  可以设置默认的选中  可以传1个也可以传多个 对应多选

使用 SetDataRefresh的方法中提供了默认选中

![](/images/et9/img/GTjKbNpZuonPAfxBedOcIpEUncc.png)

案例 假设我们刷新时 默认让她选中 索引1的

可以看到 并没有点击 初始化后默认选中了 索引1的item

![](/images/et9/img/TXjUbNG2To75MmxBNM6cDhzhnPf.png)

![](/images/et9/img/FQOKbU2x1orX9wx0DBRc5JrPn8c.png)

注意这个选中 不是由ClickEvent触发的 而是刷新触发的

所以如果有什么特殊处理需要注意 点击触发与刷新了触发调用的地方不一样

![](/images/et9/img/YSqub1FoKoImaCxYtffcp4qjnkQ.png)

### 代码调用选中

调用这个API

这个API触发的是ClickEvent

![](/images/et9/img/HmZJbYvcBoae3PxVqP5cGlF8nvb.png)

### 多选

在MONO脚本中有多选数量的控制

![](/images/et9/img/ELFxbDfTlof9E9x5xc2c6SvunBg.png)

也可以使用代码动态的改变多选数量

![](/images/et9/img/JCaQbfmonoXqY5xM6HNcUnQxnDf.png)
