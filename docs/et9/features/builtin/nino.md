---
title: NINO 序列化
et9: true
---

# NINO 序列化

## ET9 Package包

已加入ET9包 使用ET9的可以直接下载

也可以自行根据官网提示下载

## cn.etetet.yiuinino

---

## 需求

本人的技能系统需要一个高效稳定的序列化工具

需要支持继承,泛型,多态 复杂的数据结构

目前遇到一个极为严重的问题 MemoryPack 在32位手机会出现序列化崩溃的问题

因为:MemoryPack不支持32位

无奈本人对这个并不擅长也没办法修改源码来解决 只能另寻他法

![](/images/et9/img/P8cJbRBHPoXlnfxY0fQcPfl9nEf.png)

在TOP 100机型中 有 6款32位手机

目标测试区 有 15%的32位手机

国内要找32位手机可能是很少了 不过海外量还是很大的

所以这个32位支持是很有必要的 具体还是要看各位的需求了

## 推荐

[https://github.com/JasonXuDeveloper/Nino](https://github.com/JasonXuDeveloper/Nino)

中文文档:https://nino.xgamedev.net/zh/doc/start

英文文档:https://nino.xgamedev.net/en/doc/start

个人一句话总结:支持32位,效率吊打MP等一众序列化,使用简单

::: tip 🍰 本人项目已亲测32位真机通过
## 效率,使用体验,均高于MemoryPack
:::

## 强烈推荐

(官方效率对比)https://nino.xgamedev.net/zh/perf/micro

![](/images/et9/img/FHrYbvOSWoIEogxRHaxcgi4snfc.png)

![](/images/et9/img/PeNGbd0R4oagajxWPWJcaboUn7b.png)

![](/images/et9/img/KD5VbaKDAoHCjKxEdwXcWFt1nLh.png)

![](/images/et9/img/QNzcbBveHoPRtHxlHeIcREVinjh.png)

## 本人项目数据对比

不用官方数据 用自己的真实数据对比说话

在原有用MemoryPack开的新分支使用Nino进行对比

除了序列化工具不同其他都相同

序列化源数据相同,对导出的持久化数据,运行时反序列化进行对比

### bytes大小

按大小排序对比 NINO的数据量明显小于MemoryPack

不过这个数据量看上去也不是很大 所以仅供参考

从大到小排序

![](/images/et9/img/MNjDb9ApYo6PuTxY8CecUSBxn6e.png)

![](/images/et9/img/Q6gObFZWjopKeyx66i1cXyqanAb.png)

按名称排序

![](/images/et9/img/SO6ybS7tnoJWbNxn0nlc1hhHn22.png)

![](/images/et9/img/B6RubbAzMo2VxKxzycuc73isnEe.png)

总结: 简单数据基本看不出差距,但是复杂的结构特别是继承,泛型复杂的情况下有明显差距

所以这个大小差距在一般情况下可能自己测试还不太好测试 得有这种实际需求的结构复杂又量大的可能才看的出来

---

这个是目前找到的最大的一个技能的样子

mostskill_1002
之后以这个数据为准 来对比序列化效率

![](/images/et9/img/RaZOb7EEaoGFk3xaq8ccCUIQndg.png)

大小有差距是因为序列化出来的数据就是差这么多

如果要问为什么差这么多那还要看数据结构 以及对应工具的源码实现

通过现象看目前就是这样的

::: info 内嵌表格
此处在飞书原文中是一张内嵌表格，暂未迁移。可在飞书文档中查看。
:::

## MemoryPack

**10000 (1万次)**

![](/images/et9/img/ETRVbubwnohf4UxFy9AcUoXqnVs.png)

**1000(1千次)**

![](/images/et9/img/Jyh2bIvNTo8lEVxr1VzccgFlnC2.png)

**100(1百次)**

![](/images/et9/img/Kw9BbRmOZoyBmbxYmMVcRqoPn5f.png)

## NINO

**10000 (1万次)**

![](/images/et9/img/KvNtbkbAeobPlgx4nc3ct59GnOd.png)

**1000(1千次)**

![](/images/et9/img/OhIMbj5L5okVx9xF4OjcfFM6nee.png)

**100(1百次)**

![](/images/et9/img/TvwYbkFYKoih19xlKAAcTf2AnRe.png)

以上测试只是单一的复杂结构的测试

不代表所有都是这个结果 但是能肯定的是比MP快

简单的耗时测试  以后空了增加更多的测试 不过意义不大

从官方数据,以及我对部分数据的测试已经足够证明效率比MP高了

越复杂的差距越大

#### 叠甲: 以上数据为本人项目测试所得仅供参考 信则有

---

## 复杂结构 更简单

### MemoryPack

需要提前标记

有新增时都需要来修改

(不要说可以用那个自动的,正式项目是肯定不能用那个自动的)
(因为自动的会变顺序会导致之前的保存的持久序列化数据,反序列化时错误 因为顺序变了)

![](/images/et9/img/F2UGbuUHYoMKJvx9oSccZsbknDh.png)

## NINO

只需要标记

![](/images/et9/img/RoNlbeeBkoTjhRxYiq9cREvTnJf.png)

不管多少层的继承,还是泛型 都只需要标记这个

就算有新增的也不用管

不要看这个小小的优化

对于需要保存持久化, 且要热更的数据来说非常重要

必须保证就算新增也不会破坏以前的结构

否则就要自己写工具来支持

在MP那边我就专门写了生成工具 用了NINO过后这些都可以去掉了

整个工作流减少一个环节,省事省心

---

## 分析器

NINO 有大量分析器 可以提前告诉你序列化情况

1. 一个字段是否可以序列化

否则你标记了一个未知的类型 你都不知道他根本不能给你序列化出来

最后又花时间去断点一个一个看对比最后才发现 哦,原来这个不能序列化

1. 标记顺序检查

自定义标记时 需要写上ID  1,2,3
有时候多了 真有写重复ID的时候 分析器能直接告诉你重复了

而不是你运行时跑起来才告诉你 有重复ID

等等,很多...  真轻松很多,可以无脑用

关键底子在这里,以后你想加其他自定义的分析器是不是也可以随便加

---

## MemoryPack 换 NINO 建议

1. 换命名空间: using MemoryPack >> using Nino.Core
2. Type特性: [MemoryPackable] >> [NinoType]

[NinoType] = 自动标记

[NinoType(false)] = 手动标记

1. 顺序特性: [MemoryPackOrder(1)] >> [NinoMember(1)]
2. 忽略特性: [MemoryPackIgnore] >> [NinoIgnore]
3. 构造器特性: [MemoryPackConstructor] >> [NinoConstructor]
4. 删除不需要的特性:  (nino不需要标记这些)

[MemoryPackUnion(1,x)]

全局一键替换 几分钟就搞定了 无压力

根据具体请参考官方中文文档:https://nino.xgamedev.net/zh/doc/start

---

## 总结:

1. Nino 可以解决我32位需求的问题 (就这一点就没得选了)
2. Nino 对复杂结构使用更简单 不需要继承标记

(减少这个标记, 可以减少相关工作流程, 以及配套自动化工具, 提升巨大)

1. Nino 序列化,反序列化效率比MemoryPack 更快,更好

综上所述: 就算你没有32位需求  使用更简单,更效率上也是强烈推荐的

---
