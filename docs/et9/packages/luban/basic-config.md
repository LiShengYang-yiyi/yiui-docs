---
title: 基础配置
et9: true
---

# 基础配置

官方文档:https://luban.doc.code-philosophy.com/docs/intro

请至少了解官方的基础内容后阅读本文档

LubanGen 包将作为基础 [特意设计的]

以后生成的代码 配置都会在这个包中

这个包是本地生成的所以不会因为Luban包升级给你带来影响

(为什么不直接生成在luban包中?)

(因为luban包会升级会改BUG优化等等.. ET9升级包代价很高)

(所以需要独立一个本地包 防止升级带来的影响)

## 结构

### Config 文件夹

![](/images/et9/img/QBQab6VgLor7btx7SAtcVe5Xnob.png)

主要存放生成后的配置文件 用于运行时读取配置

Bin + Json

Bin运行时  Json就是拿来看的没有什么用

所以加载不用考虑Json的事情

其他时候是不需要Json文件的也不用打包

## 读取

客户端:

Editor时  不管当前是什么都直接用路径读取文件

运行时  只读取Client目录的文件 (所以yooasset 资源管理器收集这个文件夹)

服务器:

永远只读 Server的

### Luban 文件夹

![](/images/et9/img/GT2sb6lz7ohVkSxaRbTcklbYnIb.png)

Gen包中的基础配置文件夹

### CodeMode Scripts 文件夹

所有生成脚本的源码文件夹 会根据模式自动切换

![](/images/et9/img/D696bDv96o7FPZxp9vkcJOXSnPf.png)

## Luban

\_\_beans\_\_,\_\_enums\_\_,\_\_tables\_\_,luban.conf,Defines

请从官方了解具体用途

配置方式请参考

![](/images/et9/img/IWGIbH3veoEP7kxYNx0czc5Wnce.png)

建议采用Excel自动填充功能 (自行实现) 或手动填写

![](/images/et9/img/He4Ab8HzuoO25Ax5BQWc5lsTnse.gif)

由于ET包结构特殊性 不支持官方的 自动导入table 功能

### full_name

建议: XXConfigCategory

### value_type

建议: XXConfig

## output

导出的文件名称要与FullName相同

因为代码设置是用TypeName 读取的

![](/images/et9/img/UlPVbIblkoVkLpxFI8BcRSTbnwh.png)

## 非Gen包的配置

请参考demo包配置方式

![](/images/et9/img/KBRzbn6CSoJywGxxtNxcx5egnkc.png)

## 只有一点不同

其他包的\_\_table\_\_ 中的 input 路径填写时需要加上前缀

![](/images/et9/img/Ksh0b0EehoBYsOxvtcDcgVMxnuf.png)

::: tip 🌟
### ..\\..\\..\\..\\..\cn.etetet.{包名}\Assets\Editor\Luban\Datas
5个[..\\] 根据项目结构路径变化
:::
