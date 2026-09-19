---
title: Xlsx 导入数据
et9: true
---

# Xlsx 导入数据

结果:可用

![](/images/et9/img/UwvIbkCKzo0XwKxvJ7FctjdQnVc.png)

![](/images/et9/img/KJOBbjvRbo6JV8xR7boc5MRGnGg.png)

## 重复检查

![](/images/et9/img/JdDgbDprkopsQ4xS6q8cHI1Ineg.png)

![](/images/et9/img/MO7YbYTjbodyhUx1FeccYVfXnSc.png)

## 默认填写与检查

语言很多的时候可能会遇到没有填内容的情况

这里会默认使用指定语言  比如 默认中文  如果 有日文但是没有填 会默认日文这里填上中文

如果中文也没有填会找其他有值的比如英文

如果全部都没有填则会报错

为什么要自动填充

因为不填 切换语言时可能导致报错

所以开发期间自动填充  如果想强制比如填 也可以小改源码实现

扩展可选参数

![](/images/et9/img/WLytbyXIUonJYVx2tL3cd7DUnUe.png)

自动填充 & 自动填充的加填充

![](/images/et9/img/LszabDLsNo4933x3gpqc07fQnqO.png)

如果空则报错

![](/images/et9/img/LmFmbRT49ov6H6xhGbQcv8Cknge.png)

## 配合Luban 检查Key 是否存在

防止其他配置多语言的地方 配错Key

这个key 在运行时其实是用不到的 那么会额外增加配置大小

所以在这里测试了一下

## 1000条数据测试

Key 长度 15 - 20 个字符串

源文件Json 大约30KB

(这个不进打包的 所以这个大小没什么意义)

![](/images/et9/img/NtCGbaWXJoapCYx2te0crotLnSe.png)

Luban 读取的文件 Json 类型 大约55KB

![](/images/et9/img/UJG5bRG4ao0mjUxqYTRcs6Kunzc.png)

Luban 读取的文件 Bytes 类型 大约25KB

(打包一般都用bytes)

![](/images/et9/img/HgEObLNPBoQ0mMxWy2ucjyzEnCc.png)

结果:

1K  = 25KB

1W = 250KB

10W = 2500KB = 2M

假设10W 也不到3M 可能还不如你去优化一张大图

所以自己根据实际需求

可以上线后可以关闭这个检查 就可以节约这个内存大小

## 一键生成 全流程自动化

原版如果改了多语言

1. 导入  (假设是修改的配置表)
2. 导出 (生成运行时数据)
3. 生成程序用的代码Key

现在一键整个所有功能

修改完表过后 直接生成就可以了

一键生成后需要同步的文件

![](/images/et9/img/Und6bteveo094kxP5xMca1bUnTg.png)

各有优缺点 自己看取舍

分离后 基本不需要关心I2原生插件怎么使用了

![](/images/et9/img/IVzWbkGCOoGTVdxZPj3cPaYWn0b.png)

需要增加多语言就改表

改完点导出就完事了

程序方面  使用多语言只需要知道对应几个API 怎么调用就可以了

可以降低入门门槛

## 关联检查

初始定义 这里的key = string

![](/images/et9/img/LucPbRpV4oKOmWxMxyCc75ORnKh.png)

需要检查改为  string#ref=LocalizationCheckConfigCategory

![](/images/et9/img/Pon6bUNxaoNLuexsxOLcuUobn7d.png)

修改后则启用检查功能
其他地方使用I2 结构时 如果key不存在则会导出失败

这也是之前提到的 1000条多语言检查会占用配置 25KB 的问题

如果不想要相关检查可以对应的修改功能

## YooAsset 设置

之前是YIUI默认关联的

新修改后 手动添加一下这个关联

![](/images/et9/img/KmJrbPv02oWtW2xv2qDcguTnnxd.png)

## 多语言启动流程

具体看源码 I2LocalizeMgr
