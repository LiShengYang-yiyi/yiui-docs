---
title: 快速入门
et9: true
---

# 快速入门

## 环境

首先一个干净的环境 最好从头开始

一个可运行的新的 干净的工程

最好使用 状态同步demo

完全可运行的情况下执行后续操作

如果你不是原生工程 已经有自己的其他配置表

后续请参考 [ET.Excel 转 Luban.Excel](/et9/packages/luban/et-excel-to-luban)

另外请确保本地电脑已安装.net8+

Dotnet sdk 8+: https://dotnet.microsoft.com/zh-cn/download/dotnet/8.0

## 加入luban包

加入方法请 [联系 熊猫](/et9/packages/luban/contact)

## 使用流程

Unity的PackageManager

![](/images/et9/img/CeDIbES9LoN2AMx3ORLcNSaRn1b.png)

+号 添加 Luban包  cn.etetet.yiuiluban

![](/images/et9/img/JQrXbVtHOoJm6OxELqDcBdjbn1f.png)

加入后请注意一定要保证luban包处于Package目录 而不是缓存目录

![](/images/et9/img/RJxYbQu7oo6mhpxveYBcIeLVnab.png)

可通过此命令移动 如果无法移动请尝试手动移动 或 重启编辑器后重试

## 没有编译报错过后就可以看到 Luban 配置工具的按钮了

## 生成lubangen包

配置工具功能Unity菜单栏 >>  ET >> Luban 配置工具 >> 创建 LubanGen包

![](/images/et9/img/H9N7bLKXzozM3MxL26FcM5kpnph.png)

![](/images/et9/img/WX3QbKQ6wo6e7XxO1rxcVWCSn2d.png)

(如果没有这个菜单 重启Unity) (或者Reimport All)

![](/images/et9/img/VTL8bjOeNoEqvsxuJJwcLsndnqh.png)

没有初始化时 只有这一个按钮  初始化后会就看到其他功能了

这个创建gen包会执行

删除 ET.Excel 包里面的内容

只保留package信息  如果删除时报错 请手动自行删除

比如你这个包里面有保护的文件 无法删除就会报错 比如 .git

![](/images/et9/img/RYCPbdl0IooYTNxhdaRc89nInlc.png)

创建后有报错 是因为把excel的代码删除了 所以没了配置 只需要重新生成一次配置即可

![](/images/et9/img/Mn4Ib44LTonxG4xza5QcCpydnWd.png)

如果以后ET.Excel包报错 可使用一键替换解决报错 [ET.Excel 替换](/et9/packages/luban/et-excel-replace)

## 生成配置

Luban配置工具 打开 使用 导出功能

![](/images/et9/img/Xjd4blpW9oUeYAxspbBcFwkWn4g.png)

不报错了过后 以后可以用 ET的Excel 生成方法  已经替换成 Luban了

![](/images/et9/img/UVr6bjYJGojGyHxnsy7cXzggnsd.png)

2个方法都可以导出 看你喜欢用那个

以后有需要还可以扩展一个快捷键导出

## Yooasset 设置

如果你现在用的其他资源管理器 请参考

![](/images/et9/img/UHkjbr4X4o2EsUxHcYwcp32knAh.png)

Config 原文件已删除  连接新的文件夹

选择 yiuilubangen\Assets\Config\Binary\Client

![](/images/et9/img/T4Znbx4VGoyxVUx09pXctLnGn2b.png)

## 编译IDE

重新编译整个ET

回到IDE发现有2个文件加载失败 正常这2个属于et.excel 换 Luban所以需要去掉

这里手动删除即可 不影响功能

![](/images/et9/img/EfJfb6U5losrDAx9uLxcoQ8DnJb.png)

## 启动游戏

配置已经全替换Luban了 正常启动

## 进阶

启用可视化配置工具

[配置表可视化工具](/et9/packages/luban/config-visual-tool)

![](/images/et9/img/O7vnbLa3oo9zUSxNPmXcUb8Cnu3.png)
