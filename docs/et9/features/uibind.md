---
title: UIBind 自动生成
et9: true
---

# UIBind 自动生成

## 将改变打包流程

取消反射 取消反射替代 方案由SG 自动生成

![](/images/et9/img/KVKKbXYCMoXWlbxb8Ebc2NLMnBh.png)

## 实装

- [x] ET 8.1

- [x] ET 9.0

- [x] ET 7.2

- [ ] ~~通用  无此功能~~

## 实装后 流程变化

1. 将取消 生成替代反射代码功能

以后不用点一下了相当于已经实时动态生成了 功能其实还是一样的

![](/images/et9/img/MDiJbQ2Nmo8PooxsGzOc8xPdndf.png)

1. YIUIBindHelper 将直接使用SG生成的数据作为源数据不用考虑ET什么版本 DLL名称不一样导致拿不到数据等等操作YIUIBind 这个文档中的内容都可以无视了

1. 发布流程

不需要发布了 打包发布 可无视

1. 会提示脚本重复 YIUIBindProvider

手动删除本地之前的脚本  使用自动生成的脚本

相关联方案将被弃用

---

## 独立SGDLL

- [x] 独立SGDLL

优点

防止ET官方改SG带来的影响

因为独立所以不需要出对应的文档说明 免得错了不知道怎么改

缺点

因为需要提前编译DLL 如果你没有源码或者不会改源码的情况下

那么你就不能改这个生成器依赖的部分

比如我的UI框架的命名空间是 YIUIFramework
但是你全局把这个命名空间给替换了 那么肯定就无法生成了

如果你会改源码那不存在这个问题

如果你不打算改命名空间那就无所谓了

## DLL.meta 设置

不会的请拷贝demo的meta 不要自动生成

![](/images/et9/img/LfW2bj3PtogEEDxXUGTcyUcRngd.png)

## 注意DLL的meta文件需要分析器标签

需要为其设置 **RoslynAnalyzer** 标签。这个标签的作用是告诉 Unity 编译系统，

该 DLL 文件是一个 Roslyn 分析器或源代码生成器

![](/images/et9/img/CQvWbv8hIo7VGoxn8i4cDQConHb.png)

其他人自己接的自动生成的meta文件是没有这个的 所以需要手动调整

或者直接拷贝YIUI的分析器meta文件

## 报错

UIBindHelper.InternalGameGetUIBindVoFunc = YIUICodeGenerated.UIBindProvider.Get;

这个会报错，找不到YIUICodeGenerated

参考上面的meta设置问题
