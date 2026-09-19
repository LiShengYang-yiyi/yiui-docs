---
title: 数值配置
et9: true
---

# 数值配置

同样考虑到包的更新 尽可能的减少更新冲突带来的问题

最大的考虑分离设计

所以数值系统的包分了2个

一个原始包  cn.etetet.yiuinumeric

一个配置包  cn.etetet.yiuinumericconfig

配置包的更新频率绝对远低于主包

更新上也会更多的考虑兼容问题尽可能的不更新配置包

但是无法保证一定不更新

虽然无法达到完美

至少可以减少部分操作

## 自动生成

配置包由原始包提供的方法

![](/images/et9/img/NeW6byxczoHij0xsNnNcQj83npe.png)

![](/images/et9/img/UU1NbU7hMo9Ca1xaapkcZ26Ente.png)

会自动生成包

![](/images/et9/img/CjrMb5Z9PoWrP6xPUlGcjkaDn3g.png)

这个包由本地管理  这样你自己扩展配置里的数值 增加配置都可以

代码扩展请参考ET的官方方案  自己建个包引用相同DLL 然后使用扩展方法 扩展代码

## 版本不一致时

2个包中都有一个configversions

以本包为准  当本包与配置包版本ID对不上的时候就会有提示

这个时候你需要先备份现在的包

重新点上面的按钮 覆盖配置包

最后根据实际更新内容 调整你的配置

[更新日志](/et9/packages/numeric/changelog) 先看更新日志 看为什么改动配置包
如果只是一些其他改动就可以把备份的直接拷贝回来就可以用了

如果有改动也会详细教学 怎么修改配置

## 配置表

打开配置表

![](/images/et9/img/PsFtbIPv3o7rPNxxMgkchSbpnGf.png)

![](/images/et9/img/P6kbbwvxmoVlFdxXE3bc54Qlnzh.png)

## 自定义数值类型

以下表格为临时配置演示 不需要可自行删除

![](/images/et9/img/P3ebbPloToLW1JxPofLctPM8nph.png)

只需要定义基础 也就是 0

其他的如果是成长类型会自动生成 1-6

### ID

基础类型支持99W个

最小ID = 100000,(10W)

最大ID = 1000000,(100W)

ID不可重复

### 名称

命名规则(大驼峰)

所有名字不能重复

### 类型

Int,  整数32位int  ± 2147483647  (10位长度)

Long, 整数64位long ± 9223372036854775807 (19位长度)

Bool, =0时=false 其他都=true

Float, 小数 (精度 万分比)

注意填写都是大写

### 别名

luban配置使用

可以用在其他配置表时类型是 ENumericType 时可以直接填中文

都用luban了不要填魔法数字

比如: 你填个100001 请问是个撒 过2天你就忘记了

![](/images/et9/img/RicibIijloONQJxBtAFcdL8Ln9b.png)

填写方法:  别名 + \_(下划线) + (0-6)

成长数值只能配置: 1-6  配0会报错 如: 速度_1

非成长: 只能配置0  如: 等级_0

所以配置档可以根据数值需求投放 0-6

另外别名也会在没有本地配置时作为临时名称

### 非成长

比如:

当前血量和最大血量

某些数值他会被某些数值所限制的数值

他依赖于其他数值

自身无法成长

只有0 允许修改0

其他成长是不允许修改0的

Bool 类型不能成长

## 生成配置

修改配置后保存 关闭后使用导出功能

![](/images/et9/img/AoVHbst6zoLBHjxYWKXc184Nnee.png)
