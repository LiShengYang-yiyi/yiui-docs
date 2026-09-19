---
title: 一键创建Luban模版
et9: true
---

# 一键创建Luban模版

已知 本luban包 可以把对应配置放到对应的包中

无需全部都放到一起

这样的好处是 如果对应的包我不需要了

你把包删除后 重新导出配置 则自动更新

无需手动一个一个的删除不要的配置 等等操作

所以建议与本包相关的配置放到对应包中

不要一把梭 全部都放到Gen包中

设计时需要主要 配置与配置之间不能直接引用

不能相互夸包 Gen就是共用包  防止删除某个包后有依赖

## 快捷功能

![](/images/et9/img/WdOTbJKI3oG1wSxi9nWc2NIZnYg.png)

使用后会弹出文件夹  请选择一个ET包 作为你想生成的目录

![](/images/et9/img/Agaibur16o6urtxO9y7c0Hjsnod.png)

选择后会自动在对应包中创建默认配置

![](/images/et9/img/LzOxbH2JAoAkcDxEE1GcxR1Qnbd.png)

![](/images/et9/img/HkBvbMSVnolb1PxfkYVc8bFLnbe.png)

最后就可以根据实际需求具体配置

配置完成后导出即可

配置方式请参考非Gen包配置方式 [基础配置](/et9/packages/luban/basic-config)
