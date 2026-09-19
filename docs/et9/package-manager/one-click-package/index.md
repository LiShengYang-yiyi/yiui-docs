---
title: 一键包生成
et9: true
---

# 一键包生成

ET9中推荐用自己包进行开发

每个人都需要做自己的包 如果每个人都手动其实要求还是蛮高的

这里提供一键生成  只需要给个名字 然后提供一些选项 最后就自动生成 文件夹程序集等各种操作

![](/images/et9/img/Fdo3bZdlHocnbCxwGv8cLfDmnVd.png)

## 默认生成的包版本 = 0.0.0

0的版本可跳过包管理的其他功能 如更新检查 出现在版本管理等等...

0版本为本地私人使用版本 不影响任何包功能

如果要打包发布时请升级版本

## 案例

![](/images/et9/img/EPOMbghs4oSHhbxivZrcD7AOnde.png)

## 自动生成文件结构

![](/images/et9/img/OONbba86GopzOVx9Vlkcpu6ZnGh.png)

## 模块选择

![](/images/et9/img/KQfgb2QMzoXFKbxX3BtcfZ4jndb.png)

### 生成类型

对应需要创建的几大类

根据需求选择

### Runtime引用类型

对应你的程序集会被引导到ET的那个程序集中  则对应程序集就可以使用你的东西了

### CodeMode类型

![](/images/et9/img/K2PCbLxqooMQZAxpq2SczNEFnJc.png)

对应在Hotfix Model 时需要创建的文件夹

然后会根据当前模式生成对应RefDLL

## 参数介绍

### 模块名称

最后文件夹名称会以 cn.etetet.{0} 命名

![](/images/et9/img/HuCBbjhoCoT6vzxkb46cGPWYnSb.png)

### 模块ID

模块ID 用于区分模块 1000以下为ET官方保有ID 其他ID请向ET官方申请

没有就先用默认

如果你不上传到官方分享 这个ID暂时可以无视

### 显示名称

对应在Unity中的显示名称

![](/images/et9/img/TQYEbKMMAowt9xxPPLtcEsdin7d.png)

## 程序集名称

当你需要生成 runtime / editor 时会要求输入

![](/images/et9/img/Nq2bbzUINoWnMUx1o7yc0QiCnKg.png)

对应会生成指定程序集

### 描述

字面意思

### 强制创建

如果当前包已存在的情况下是无法创建的 √上则会覆盖

所以一定要注意别搞错了

## 更多

会跟随ET包的结构持续更新

或有其他的意见建议随时采纳 请联系我...
