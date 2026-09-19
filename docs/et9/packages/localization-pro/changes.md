---
title: 修改记录
et9: true
---

# 修改记录

- [x] 与配置Luban 关联

经常需要填写多语言Key 的地方

如果直接填写字符串 将无法做到提前检查

所以需要包装结构 达到提前检查的目的

优化各种多语言快捷方式

- [x] 多语言包将作为独立包  不会安装 YIUIState时默认安装了 需要的手动安装

- [x] 导出数据带Luban结构可提前检查

- [x] Model 需要多语言Key

- [x] 导出拆分

I2Terms 到 Model

I2Localize 到 ModelView

- [x] 字符串改为引用 支持多组

![](/images/et9/img/RrnIbXNiqo0a2mxrSZtcJFEjnMg.png)

- [x] Client  Model 获取多语言内容

![](/images/et9/img/G1hvbDBEloEDR1xSL3Qc3biKnvd.png)

![](/images/et9/img/Br3obMWpGoC7sSxiP9fcp1LlnJc.png)

![](/images/et9/img/Is4ZbY3Hfo9tOoxLlz4csavzngg.png)

- [x] 修改模版 程序可提前看到多语言内容 方便写代码时判断是否正确

特别是有字符串填充那种

如果是空的就是没有配置'

新增配置使用X语言注释  注意 注释的内容会吧原版的 \n 换行都替换成 " " 空格
因为需要在一行显示注释 否则会报错  如果想多行显示 可修改源码实现

![](/images/et9/img/GG8zbrMyKoKvTOxp9BHcWt9Xnkh.png)

![](/images/et9/img/Yvs2bQOKKok31SxZ3S1cYHmhnpb.png)

![](/images/et9/img/B0gdbhcVYo33osxswCWc0SLZnTc.png)

- [x] 源文件改为Xlsx  不用CSV

优点 策划用起来更简单 还能注释 保留格式 颜色等等..

缺点 放弃Unity添加多语言功能 只能表添加

因为本次修改就是面向商业化的  哪里能让你随便Unity里面快捷加多语言

正常开发流程都是 程序找策划要多语言ID的 不会随随便便扩展的

但是插件可以在Unity添加Key的功能还是保留的 如果需要可以手动导出覆盖现有配置来实现

## 修改

1.可以在model 获取到多语言Key

![](/images/et9/img/OQYzbBWnhoDnGbxn5DccWqPXnUg.png)

2.可以在model 使用API 直接获取到多语言内容

![](/images/et9/img/QxdGb6pOFoHRAHxoD0pcvUPEnnf.png)

- [x] 多语言的文本 支持拼接

之前的只能强制吧 某个多语言作为format 的形式才能用这个绑定

现在可以自由拼接  自定义传入format

![](/images/et9/img/SdTibBFd3oU59pxUjyLcN5Nyn8c.png)
