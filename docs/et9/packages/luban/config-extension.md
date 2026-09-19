---
title: 配置扩展
et9: true
---

# 配置扩展

以LubanDemo包为案例

需要的可先安装导出后查看具体源码

## ET.YIUITest.YIUIItem 相关配置为案例

已知生成文件

![](/images/et9/img/I4GGbR5Y3oRUclxg5WZc6D5DnRe.png)

这个文件是自动生成的所以不能直接在这个文件上修改 否则下次生成时会被覆盖

扩展要知道你这个配置是生成在那个模式下的需要到对应的文件夹扩展

你只想在客户端扩展那你就写到Client文件夹下

这种ET基础就不详细展开了 请根据需求自行设定

不管是config 还是 ConfigCategory  都可以

## 字段

扩展一个指定的字段 不是配置表上的

部类扩展 生成的配置都是部类 所以我们用部类进行扩展

![](/images/et9/img/TyHJbBbxLoc8g8xriGMcKjo7ncc.png)

## EndInit

将会在配置初始化完毕后调用

切记这个时候 其他表并未Init完毕 不可在这里进行读取其他表的操作

注意写法这里是重写方法

![](/images/et9/img/STIWbSNKioNj9sxc0tecw1hQnBf.png)

## EndRef

此功能为Luban官方功能当配置中有ref会自动生成对应字段的ref

所有表都初始化完毕 自身的ref完毕后调用

切记这个时候 其他表并未Ref完毕 不可在这里进行读取其他表跟Ref相关的操作

注意写法这里是实现部类方法

![](/images/et9/img/JBrPbSuJKoynE9xgEtCchcmtngc.png)

## ILubanConfigSystem

解决为了在hotfix扩展

提供了一个可以让你初始化就能调用到hotfix  API的方法

如果你要扩展一个 自定义的结构

但是这个结构的字段的实现方法在hotfix

将如何自动化的实现 初始化

而不是手动的调用

ConfigCategory 可用

时序问题 这里你不可以处理其他在同类方法中实现的功能

![](/images/et9/img/ZNJ8bmG5ToJAAGxwWKccWE51nmh.png)

## ConfigProcessAttribute

ET的功能

跟LubanConfigSystem 很像但是不一样

这个功能是独立开了一个单例给你用

所有配置初始完毕后   /   有单个配置被热重载时创建

就可以根据自己的需求重新建一个新配置的概念

也可以在这个时候去获取其他配置 构建一个新配置

由于时序问题 这里你不能去获取其他的ConfigProcessAttribute

与 CodeProcessAttribute 的区别

1. 触发时机不一样  目前先触发 CodeProcessAttribute
然后才触发ConfigLoader 中触发 ConfigProcessAttribute
2. CodeProcessAttribute 会在热重载时重新创建一个新的也就是会动态更新

demo案例:

![](/images/et9/img/S6hEbE9p7o36ikxP3CfciAX2nOR.png)

## 扩展执行循序日志Demo案例

![](/images/et9/img/RwE8bF7BOoErR4xeaLfcFU62nze.png)

## 上述扩展参考Demo源码

![](/images/et9/img/AoZybVo9YovDizxbP7mcJaeNnsc.png)
