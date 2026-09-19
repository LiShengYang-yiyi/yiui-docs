---
title: 插件库
et9: true
---

# 插件库

![](/images/et9/img/ENP3bUcq8oKnGgxbv9ScDSeGnRd.png)

会自动获取到现在ET所有可用的Package

显示包括 作者,累计下载,描述,版本情况

未安装时

![](/images/et9/img/MFUnbBFvBoWhVWxuZgfc1NeCn8b.png)

可以使用安装按钮一键安装

![](/images/et9/img/M262bzYqhoid5uxnAnxckov2nSg.png)

更新功能 重新请求当前包的数据  (部分功能需要关闭功能后重开才生效)

![](/images/et9/img/I3ZRbU2ohozH5Yxf6KPcWFKmnle.png)

同上 刷新当前所有包信息

![](/images/et9/img/PyMAbUmAQoFFAIxiHmDcHaF7nEe.png)

卸载包功能   红的表示可卸载  灰的表示无法卸载  因为这个包有依赖

如果与当前状态不一致  可能是因为没有同步到版本管理导致的  如果你想要这个功能准确

你可以先打开一次版本管理 然后重新到这里同步一次

![](/images/et9/img/Cw6jbFfyCodJ8CxPlBpc1lYnnqc.png)

跳转

![](/images/et9/img/WVvfbQkSCofk4TxN0A1cVgO7nLd.png)

分别对应2个跳转

主要url连接需要写全 http...

## 分类

![](/images/et9/img/W3c9bR1LAo30pTxPwjicA9ADnyn.png)

在package.json配置文件中有category 配置

规则 AA/BB/CC...

会根据分类 / 分割 进行文件夹划分

目前分类未做任何限制 只要写了就会在对应分类中出现 且无限层 (建议最多配置3层)

如果未配置 则统一归纳到Other中

以网上的打包版本为准 如果网上版本没有分类则会读取本地包分类 (本地有分类如果未生效需要重启Unity)

### 多级分类

竖线分割 "|"

![](/images/et9/img/LkDwb6484oOG2xxWtrGc6xYjnZV.png)

如: 则表示 会在Demo 分类中  也会出现在 UI分类中
