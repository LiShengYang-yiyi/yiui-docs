---
title: 快速入门
et9: true
---

# 快速入门

## 依赖YIUI框架

## 依赖[Luban 配置解决方案](/et9/packages/luban/)

## cn.etetet.yiuigameobjectpool

下载包

如果出现问题 Unity看包里面没东西 但是看文件夹又有

使用 Reimport All 刷新一下

![](/images/et9/img/ELsRb6NaWoTWxSxNITPczHhMnQd.png)

![](/images/et9/img/LxY5bk4vJoCbEtxZtCNcx535nMc.png)

![](/images/et9/img/FfQ1bC5uyoYpwmxQOr1czzKqnhk.png)

## 初次安装报错

![](/images/et9/img/SruIbxH8NoOGzFxFbHvcBOrFndc.png)

点一下这个刷新

![](/images/et9/img/AX8ibnNdZohvy3x1pBGcQm7inAh.png)

## 设计思维导图

![](/images/et9/img/MhqlbHgQ8oYan8x4tFKcTOruncc.png)

## YIUIGameObjectPool

单例 全局可调用

Get  获取一个对象

Put  回收一个对象

![](/images/et9/img/GdjCbdx41ouGwVxxCh8cbA3OnWf.png)

## 对象池

![](/images/et9/img/QThtbtObroQ6vMx6kKNcgks9nGf.png)

这个对象池的根节点 默认是隐藏的 平时是看不到的

( 这里能看到是因为演示 把隐藏代码屏蔽了 所以才能看到 )

## **YIUIGameObjectPoolTrigger**

对象池触发器 可自动加载与回收对象

适用于UI的特效 技能的特效 等等 自动加载与回收

![](/images/et9/img/FVVvbw89KobhlZxfBkuchhKyneg.png)

## 触发器

目前只有一个触发器 由显隐时控制自动加载与回收

![](/images/et9/img/KyiYbKzcPooSfzx4YY5cTih1nJd.png)

新版有修改样式

![](/images/et9/img/VEwfbfWCZoeu1Exy13BcrQNbnHc.png)

[更新日志](/et9/packages/gameobject-pool/changelog)

## 扩展

请参考上述触发器 自行扩展更多的触发器

## **YIUIGameObjectPoolInfo**

缓存信息  挂了就有扩展的东西

自动回收 自动释放 限制大小 等操作

![](/images/et9/img/R83DbxEwDogEFqxmuGJcTz5UnOg.png)

## GameObjectPoolSettings

![](/images/et9/img/PniGbMcetoyfFGx2vTlc2ZG7nYg.png)

新增配置  可以从配置读取  2套一起用

配置 > 挂的脚本信息

## 对象池信息

![](/images/et9/img/Q95fbhz9eoq0caxUAqrcbPkEn3c.png)

使用对象池的目标 可以额外挂载 缓存信息组件 来扩展对象池

可以不挂载  不挂载 默认全部0 没有任何限制

当你想对一个对象做限制时挂载 缓存信息

::: tip 🍉
[LabelText("最大显示时间 <=0 表示永不过期")]
public float **Timeout**;
:::

你想自动回收一个对象时  比如放了一个特效 持续5秒 5秒后自动回收

这里的超时时间就是  出对象池  显示持续X秒后 自动回收

::: tip 🍉
[LabelText("同时显示的最大数量 <=0 表示不限制")]
public int **MaxCacheCount**;
:::

游戏里的技能特效 需要控制上限时  比如同时只能有 2 个显示

这里可以填2  那么这个特效只会同时看到2个  其他的都是空的 达到底层优化的目的

使用的地方完全可以无视

::: tip 🍉
[LabelText("缓存池中保留的时间 <=0 表示永久保留")]
public float **CacheTime**;
:::

回到缓存中时 开始倒计时 超过时间后就摧毁 当然会保留最低的缓存数量

::: tip 🍉
[LabelText("缓存池中的最大数量 <0 表示不限制")]
public int **MinCacheCount**;
:::

因为对象池的特性是 每次获取都会创建一个新的 其他没有回收的情况下

如果在一瞬间的需求特别高  假设要100个  但是全局游戏下可能就那么一次

但是不能真的把100个都放在缓存池里面 就浪费了

所以我们需要对缓存时做出上限限制   假设 这里设置的是20个

当超过100个时 回收就会触发最低缓存判断

多的都会丢弃掉

![](/images/et9/img/F5D1bgZrKosVVBxxLOuczWgpngg.png)

::: tip 🍉
[LabelText("超过最大显示时 返回一个新的资源")]
private string **MaxCacheCountNewResName**;
:::

如果 有最大显示>0 这里必须配置

否则会强制吧 最大限制改为无限

为什么超过限制要创建一个不一样的 前面的备注已经提到了

这里要注意这个新的主要目的是降低渲染 内存压力 所以这个新的一般是一个空节点

不是空对象哈   还是有的只是什么都没有而已

对于一个通用的 就是这个预制程序不会拿到过后做什么事情的 可以做一个通用的预制就好了

如果这个预制程序拿到是需要获取里面组件 有操作的 那么要保证 与原预制 有相同效果不能有报错

这种处理一般就是把原预制拿过来 吧里面的跟渲染跟内容不需要的 全部删除即可 其他的留下

合理的设定缓存信息 可以达到更好的优化
