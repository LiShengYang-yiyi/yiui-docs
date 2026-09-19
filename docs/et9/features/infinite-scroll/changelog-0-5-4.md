---
title: 无限循环列表 0.5.4+ 更新日志
et9: true
---

# 无限循环列表 0.5.4+ 更新日志

## 案例对比

未设置间隔创建  一次性大量时会有明显卡顿

设置后会更加流畅

![](/images/et9/img/TXe3bnB8uoSVKExsG8Ucvs8on3c.gif)

![](/images/et9/img/HSBTbtPN6o7c1lxDlfXcpSqJnof.gif)

## 新增 创建 间隔限制

X秒之内只能创建1个对象

可以预制体上设置

也可以用代码动态设置

![](/images/et9/img/VpIGbnq9FoqY1HxtWKgckB3nngb.png)

## 0.6.0

新增

![](/images/et9/img/Es43b4n5No2xWfx3ckgcbNzUnsd.png)

![](/images/et9/img/T7n2bHcDXoDyZZxv7JKcCRG0nKg.png)

### 滚动时使用创建间隔

默认关闭 不建议开启 刷新加载时会有创建间隔 滚动的时候就没有了

### 刷新可操作

默认关闭 不建议开启 刷新的时候是不能操作的会屏蔽UI  刷新的时候一定要屏蔽操作

## 需求

比如 背包 虽然也是用的无限循环列表 但是一次打开时 实例化还是会卡的

就可以设置刷新间隔  就可以一个一个加载出来 防止实例化卡顿

## 案例

假设1秒只能创建1个

![](/images/et9/img/QFpvb1dWnovyvCxH0Tqc8sDAnZc.png)

![](/images/et9/img/PrezbAZ3Jo2PFqx3xr3cdO7rnSb.gif)

就会看到预制是每1秒才会出现1个

## 缺点

1.

目前不支持 实例化过程摧毁目标 这样会有报错

必须等待完成

如有这种需求 请考虑通过其他方式解决 比如 UI可以关闭但是没摧毁 后台依然在加载

加载完毕后判断是否要摧毁  在进行摧毁操作

不能加载中摧毁

1.

加载过程中 最好屏蔽玩家操作等待全部加载完毕后才可以滑动 防止出现各种问题
