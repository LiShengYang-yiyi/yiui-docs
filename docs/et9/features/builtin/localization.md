---
title: 多语言
et9: true
---

# 多语言

## [多语言 Pro](/et9/packages/localization-pro/)

## 动态

### 生成脚本

![](/images/et9/img/Zk4kbqm5WoIEDYxY0Ivcn5gDnqe.png)

![](/images/et9/img/W3mdbugBqo7ij1xyGOMcI30Hnwe.png)

代码中就不要写魔法代码了

请使用生成的代码 就可以获取到当前多语言的值

### 只有key时动态调用API

LocalizationManager.GetTranslation("key")

## 静态

挂载**Localize 脚本**

选择需要的key

![](/images/et9/img/NEaQbDnWQopqyBxETWFcvgAfnBb.png)

## 需要填充时

如案例 已知有这样一个多语言K  填充用

对应文本组件添加

使用跟以前的填充用法一样 这里填充写入的是多语言的Key

![](/images/et9/img/NNQsblgibod2Q8xDp4fciRAGnVg.png)
![](/images/et9/img/HBv3bi63noPc8dxL7g8cGC79naf.png)

![](/images/et9/img/M62tbDxehojLzfxIPhycyw8Knac.png)

## 不需要填充

跟以前的文本设置相同只需要使用 对应代码获取到多语言文本设置即可

## 图片多语言

![](/images/et9/img/BGppbQEYZoo1maxnEKBcPDJFn9b.png)

建议以后缀区分

以前的该怎么样还是怎么样

这样只需要加一个Key

如:  Image 然后多语言就设置为

中文: {0}\_CN

英文: {0}\_EN

然后图片多语言 统一用这一个就可以了

有多语言需求的图片就根据需求美术出对应后缀的图即可

## [多语言 Pro](/et9/packages/localization-pro/)
