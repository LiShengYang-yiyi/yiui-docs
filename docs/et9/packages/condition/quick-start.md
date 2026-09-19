---
title: 快速入门
et9: true
---

# 快速入门

依赖  Luban   [Luban 配置解决方案](/et9/packages/luban/)

依赖  Invoke  [Invoke](/et9/features/builtin/invoke/)

请确保有依赖 且可运行环境

下载cn.etetet.yiuicondition包

确保在Packages目录  否则移动包到Packages目录

![](/images/et9/img/UlzBbovkyotQc8xCQK4cN2nanif.png)

找到.Template文件夹

![](/images/et9/img/WzfsbNLB3okZCjxbI4AclNRynyb.png)

包含config包(必装) 与 demo包(选装)

复制需要的包 到 Packages目录

重新加载刷新   CTRL+R

## 挂载组件

客户端/服务器 挂载自己的唯一组件

```C#
root.AddComponent<ConditionMgr>();
```

挂载的scene = 最后的响应场景  建议挂根目录

## 判断

AddCheckConditionGroupListener

CheckCondition

## 具体实例参考 [Demo](/et9/packages/condition/demo)
