---
title: YIUI事件分析器
et9: true
---

# YIUI事件分析器

## 0.7.0+版本

::: tip ❤️
有YIUI相关事件接口
但是System未实现时报错提示
:::

![](/images/et9/img/P6yJbd6gZo5PLZxSeCPclZapnsg.png)

可Alt + Enter 使用自动生成相关System

![](/images/et9/img/Nm7Yb6ErnovUL8xd4G3ctRfmnlg.png)

自动生成演示

![](/images/et9/img/OGQabbElBoPcB8xFS0PczXphnhf.gif)

## 注意DLL的meta文件需要分析器标签

需要为其设置 **RoslynAnalyzer** 标签。这个标签的作用是告诉 Unity 编译系统，

该 DLL 文件是一个 Roslyn 分析器或源代码生成器

![](/images/et9/img/ZAOWbpBO1otetZxfu1Rcvuwmn8d.png)

其他人自己接的自动生成的meta文件是没有这个的 所以需要手动调整

或者直接拷贝YIUI的分析器meta文件
