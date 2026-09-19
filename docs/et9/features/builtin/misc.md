---
title: 小功能
et9: true
---

# 小功能

## 0.6.0

### GM

- GM命令添加常量 快捷打开按键设置

None 可以关闭快捷键

(这里只是切换快速响应的快捷键 并不是关闭GM)

![](/images/et9/img/DKU6b2gVboMn6sxgpLocdtuAnBT.png)

- 会保存上一次选的页签 下次重开会选上一次的页签

- 彻底关闭GM功能

![](/images/et9/img/RmPKbfTzXo4B9Dx3FAfc8Kw1nId.png)

启动时会 添加 GMCommandComponent  内部会启动GM功能

如果不想要这个GM功能 根据需求 可注释 可根据不同环境,情况 添加 等操作

- 新增配置关闭GM功能

![](/images/et9/img/YUBWbZNFDo4Y4KxIUmqcaj3xnrh.png)

![](/images/et9/img/XLW1bkAX5oxeAsxqI9fcZUTnnjg.png)

这样就有2种判断

通过常规的可关闭, 也可以根据需求增加2级判断

这样就方便每个人本地修改,不用改代码

### 公共关闭UI组件

同时也作为公共组件案例

#### 问题!

不管是Panel 还是 View  都会涉及到关闭操作

那是不是每个对应的都需要定义一个close事件?

然后对应close方法还要写 xx.close

大多数情况下都没有额外操作 就是单纯的关闭

#### 解决!

所以针对这种单纯的关闭提供公共组件一键设置

![](/images/et9/img/YSkkbV7N8ozQx9xmHWycH8Ufn1c.png)

框架中增加了相关代码与预制供参考

GM 3D 循环列表的关闭都已经改为了关闭组件

![](/images/et9/img/L7CHbqi9QobH5kx2lwPcHREfnZe.png)

![](/images/et9/img/QO5ubnliso5q27xp7lScXwYjnsg.png)

![](/images/et9/img/LyHHb6FYuohjdsxIch9crhMUnvb.png)

这样就不需要定义关闭事件了

![](/images/et9/img/NNE5bUAYWoDHZcxUQNqcBP8ynkM.png)

![](/images/et9/img/V1wvbH8DuoZ62WxATcAcXtXWn8e.png)

---

## 0.5.3

[无限循环列表 0.5.4+ 更新日志](/et9/features/infinite-scroll/changelog-0-5-4)

## 0.5.0

### 新增 Tips 可以不缓存直接摧毁

tips功能 可以使用

![](/images/et9/img/HDWvbCeMjolDzJxxHgXcWGOYnHd.png)

来关闭一个tips直接回收

如果马上打开这个界面 使用的是之前的UI

可能会涉及到还原 等多种情况

如果你不想缓存 现在可以调用摧毁达到目的

![](/images/et9/img/MNpAbhsjPotjuLxVel2c1SbTnVb.png)

## 0.4.5

![](/images/et9/img/IQ5pbmR7roLXV3xsz7rc492Mnlc.png)

### 重置子预制

脚本检查 还原所有更改 防止跨预制修改

相当于所有CDE预制都点了一次 Revert All

### 保存选中

编辑状态跳转到预制体位置 方便生成

项目大了过后编辑当前预制后 就找到位置了 可以快捷保存跳转 方便生成

## 0.0.0

之前更多的功能 就不统计了
