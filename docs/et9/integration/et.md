---
title: ET 接入
et9: true
---

# ET 接入

> ### [ET 接入 YIUI 视频教程](https://www.bilibili.com/video/BV1s44y1F7aZ)

::: tip 🌟
点赞支持 一键三连
:::

> 本段内容同步自：[通用 接入](/et9/integration/general)

[B 站视频 BV1s44y1F7aZ](https://www.bilibili.com/video/BV1s44y1F7aZ)

## **准备工作**

1  rider 2023.3.2+

2  ET8.1 框架

3  Unity 2022.3.X+  一定要安装打包环境

根据运行手册 吧 8.1 运行起来  包括在 et.sln 中编译全部通过

### 1 先在 Unity 中 接入 YIUI 框架

保证有 TMP 放到插件目录

导入整个 yiui 框架到 插件目录 这个时候就会又很多报错了

Dotween   adin

![](/images/et9/img/CE5UbnY39oIDL5xceREc42BenPh.png)

### UI 新增 动态事件

InstanceQueueIndex

![](/images/et9/img/InYabiC81ootTox8O1BceLMDnQd.png)

### 协程锁类型

CoroutineLockType

![](/images/et9/img/SBXgbjkkeoTcY3xfLhCcChM2nIg.png)

### 添加 YIUI 的扩展文件到 ET 的 Core 文件中

EntitySystem 类 改为 partial

主要是 添加 Queues 属性 可以让 YIUI 框架调用到

以及扩展了一个 ET 用的动态事件

![](/images/et9/img/Phd2bcnX5o6jqnxyN3ucSy8znIh.png)

还有就是 entity 扩展的一些方法 方便使用

目的尽可能的少修改 ET 源码所以使用的扩展文件的方式

除非实在不能扩展了 才会考虑直接改源码

以上就完成了基本操作 不会有报错了

### 修改基础配置

根据需求修改 建议不熟悉的情况下不要改 等以后熟悉了再说

![](/images/et9/img/K5tWbMlbioIX2PxnPevcDGf8nze.png)

### 提示 第一次使用添加 YIUI3DLayer 层

![](/images/et9/img/Xyj8bcPnKoQIl7xgbqxcJy9sntb.png)

自己随便找一个空的层建一个就可以了 看命名就知道这个是给 3DUI 用的

YIUI3DLayer

### 打开工具 修改用户名

![](/images/et9/img/JZ0eb9T0OoyowkxCytgcYbe3nkc.png)

### 初始化项目

![](/images/et9/img/H0FQbxylzomqgRxT1QCcxRsHn5g.png)

![](/images/et9/img/NmGrbSoaVoIPqkxItPIcSIIwnif.png)

根据需求自己可以设置其他功能 如全局图集等等

点开红点页签 初始化红点功能  用不用都无所谓主要是初始化一下

![](/images/et9/img/WAd8bcEMvoS2wjxTH3aczYYVn3e.png)

动态创建或者直接手动创建 root

框架中的 root 是原生文件 就是你点击初始化项目时就是从这里拷贝出去的

实际使用的是 RES 下的 ROOT  所以你要修改这个 ROOT 根据自己的设置

![](/images/et9/img/XfOXbFchCoJJP1xCIrRcg2SUn2f.png)

根据自己的需求 修改配置 还有部分配置在代码中

![](/images/et9/img/CZPkbER8johM1HxK1Ltc2HNynwd.png)

宽高 等各种信息  YIUIMgrComponent_Root 具体看这个类

![](/images/et9/img/CFk1bF3bio59pOxa1wxctb3Gnme.png)

## **自动生成器**

protected override $returnType$ \$methodName\$(\$argsTypesVars\$)

![](/images/et9/img/IgmabqziNosTiPx8ptMc8tLOnUh.png)

![](/images/et9/img/UDMLbIhoHokRxixLWeYcmcHZndb.png)

拷贝这 2 个类就可以了

![](/images/et9/img/UBwWbHLiZogxwFxoKjtcUS3Fnfd.png)

构建 DLL

替换插件目录中的 dll

## 分析器Ref 报错

在8.1 某版本中加入了一条分析器  大致意思 不能直接定义或持有 Entity对象 应该使用 EntityRef<>

这个分析器的目的是怕有人拿到对象引用干一些骚操作

在YIUI中有一个循环列表 **LoopScrollRect**

针对性的做了一个扩展 定义时 使用的是  YIUILoopScroll<TData, TItemRenderer>

其中TItemRenderer 就是具体的entity 对象

所以在声明时会触发这个分析器提示错误

解决方案:

AnalyzerHelper 类中 IsEntityRefOrEntityWeakRef 方法 增加对 YIUILoopScroll 的忽略

![](/images/et9/img/QhqCbdb0poNtrAxNg2Tcrp1Nncb.png)

首先 YIUI并不是就这里屏蔽了一下而已  在 YIUILoopScroll 内部还是使用的EntityRef<>

所以内部是有按照官方解决方案改造的

![](/images/et9/img/YQ7dbU7Y9oGDj5xAUb5c6FXEnwe.png)

但是这外面声明确实没有找到更好的办法规避

看完源码后既然官方是通过 屏蔽 EntityRefType EntityWeakRefType 来达到的目标为什么我不能加一个我的REF

只要我也能保证是使用REF 不错就行了

所以最后决定在这里扩展YIUI的REF

其实对于YIUI中的循环列表 内部也是做了ref处理的 所以可以达到同样的目的

疑问: 为什么直接写字符串 没有像官方那样 定义一个 const string

![](/images/et9/img/TeVibptHXoIo57x6KQGcksGjnmf.png)

因为这样简单... 知道具体改哪里为什么要改 至于想改成什么样子都可以

## **程序集**

"Unity.TextMeshPro",

"YIUIFramework"

### ModeView HotifxView Loader 3 个都要加上 yiui

![](/images/et9/img/A5tNbCSLsotkRExQCgzcL9hYnWL.png)

![](/images/et9/img/IH9rbKNPeo92soxQ2oQcL5VknPe.png)

### INIT 场景 默认关闭 ET 的原生 UI 与 EventSystem

![](/images/et9/img/GLHgbwo49owuvtxu713cgxFDn7b.png)

这个是 ET 原生的 UI  禁用也好删除也好 用不上了

自己创建了一个 MainPanel  自动生成脚本 成功无报错

但是这个时候 F6 刷新还会有提示错误

![](/images/et9/img/VhI0bRmuLoMITFxH77IclPlin3g.png)

![](/images/et9/img/JrytbttSjoPP55x7WrMcwBRSneg.png)

## **初始化多语言**

### 添加需要的语种

![](/images/et9/img/K70tbTs69owCFCxNOyecaLnxnBH.png)

### 导出多语言

![](/images/et9/img/WmXCbEraXo6El5xhZSDcjkxxnVh.png)

## YOOAsset

### 添加 UI 用的收集器

![](/images/et9/img/L8brbHx30oUCztxnd2XcrUuynmb.png)

### 开启可寻址 唯一包名

![](/images/et9/img/LhpkbcjDdoiWXmxkquHc9M3Gn5b.png)

使用可寻址有非常多的好处 具体请自查

如果自己项目不能可寻址 请自行实现加载器中的实例

YIUI在加载时都会返回A,B 在YIUI Demo中使用的是Yoo可寻址方案 所以不需要A

如果你是A,B的 请自己实现路径拼接

添加 YIUI 资源 收集器选择 YIUI

![](/images/et9/img/XDS6bHUuZoGNsux99MOcSGUVnig.png)

红点  多语言 等等都使用类似的操作

收集器就可以根据需求使用了 一般使用默认的就可以了

![](/images/et9/img/UycFbZwz8onkyExdSkXcXgwTntb.png)

## CodeLoader

### 添加 YIUI 程序集的收集

![](/images/et9/img/Py1tbla1LoO9BGx7KMmcnVqonqe.png)

其他准备工作 YIUI 自带的一些功能 根据需求选用

## TMP 字体 方便显示

![](/images/et9/img/WgnhbjanxothEUxjymqcW011nlh.png)

GM 功能 红点 TIPS 等等    登录以及大厅 是替换 ET 的界面用的

![](/images/et9/img/VpJlbBpr9oQ4HVxWtt4c2j9kn3c.png)

## 接入 ET 流程 每个地方需要写的方法

初始化 UI  GM 面板..

![](/images/et9/img/Kl1zbTgVAoHXHjxM6LacW8c4nNc.png)

登录 >> 大厅 >> 主界面

初始化 UI GM

打开登录面板

![](/images/et9/img/VR4ibdA06oVIlyxjtb6cdWwtnhc.png)

登录成功关闭 登录面板

![](/images/et9/img/KpETbtcgmoyaxDxRz9dcI3einLe.png)

打开大厅

大厅的关闭是在他自己内部关闭的  就是登录地图过后

![](/images/et9/img/NDn1bx4ETosCqIx8Cc5cVj38nIh.png)

打开主界面

![](/images/et9/img/Myy5bBJCSodx10xggTDcpRzEnUd.png)

## 启动 UI 准备

关掉 ET 自带的相机 事件

UI 不能关掉会报错  临时就不去处理他的代码了

有需要的自己处理掉代码后就可以吧对应的都删掉了

相机需要添加 YIUI 相机

![](/images/et9/img/LhAAbp3OZo6Uqfx3DJsc8abfnL4.png)

GM 命令看不到字都是 口口 是字体引用的问题 可以自行设置

![](/images/et9/img/CFiFbrc4So5RQAxcogRcQCLynvd.png)

## **打包**

补充 AOT

![](/images/et9/img/ScN4bNRAwocevAx6rAkcf2e8nh3.png)

~~生成反射替代代码~~

[UIBind 自动生成](/et9/features/uibind) 最新版本已经取消了这个流程

![最新版本已经取消了这个流程](/images/et9/img/HL7ZbE7pPoPDiHxDduqcRAv3nFe.png)

![最新版本已经取消了这个流程](/images/et9/img/XrZVbjvq3oemiQxDERpc9LG0nKg.png)

记得要有地方调用这个代码 一般就在初始化 UI 的地方

![](/images/et9/img/TEVUbE68loRbGUxruK4cBH1unxf.png)

重新编译生成  F6

根据 ET 手册打包

![](/images/et9/img/Hoo3bTOEso14LGxsbieceuphnKc.png)

StreamingAsset 记得手动创建一个文件夹
