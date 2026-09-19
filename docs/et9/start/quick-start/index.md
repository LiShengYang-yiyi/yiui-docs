---
title: 快速入门
et9: true
---

# 快速入门

## [🌟 ET9 YIUI框架：入门视频教程 🌟](/et9/framework/video-tutorial/)

::: warning 🔔
以下为老版本文档 可能与最新代码有小部分差异, 文档无法做到及时更新
以最新版本为准 遇到任何问题欢迎群里讨论
:::

## 自定义 包/模块

打开 UI 工具 创建一个新的模块

![](/images/et9/img/LOqvbbhh9o5iS9xli2acaWpBnNd.png)

创建第一个 Main 模块

将会自动在路径下创建一个目标包的文件结构  自动创建一个 panel 源文件

![](/images/et9/img/RKPxbwroqoENouxiGeCcFCUSnib.png)

::: tip 🚅 !!! 警告 禁止 把预设拖到外面 然后编辑 ！！！
把预设拖出来 放到场景下
拖出去编辑完成后 点这个 apply all
适用于 所有 UI 框架用到的所有预制体  都只能双击进入编辑模式编辑
:::

![](/images/et9/img/WM5lbN2Ntow5M2xO1H7cHJNknEb.png)

![](/images/et9/img/PidsbOcFGocipVxPOjpcLMc5nJh.png)

## 编辑面板源文件

双击 MainPanelSource 进入到预制体编辑模式

![](/images/et9/img/BWSsb6a4hofHTUxHpGHce20BnFd.png)

熟悉源文件结构

![](/images/et9/img/RIGSbiMPBoZCJSxovAbciao1n7c.png)

XXPanelSource

之后在拆分存储后会变成 XXPanel

AllViewParent

所有大的界面

AllPopupViewParent

所有弹窗

## 创建一个 View

### 我们分了 3 种 View

![](/images/et9/img/MwTSb8m9pow01exETE2co42Vncg.png)

#### 通用界面

##### 不创建的

##### 动态创建的

(所有通用界面只能同时显示1个,内部有View管理,内置自动开关)

#### 弹窗界面

##### 动态创建的

(弹窗可以存在多个,且可以和通用叠加,需要自行控制开关)

## 快速入门我们每个 UI 都创建一个

### 1 在 AllViewParent 右键 创建一个 View

![](/images/et9/img/S7aZbbqdwom9dpx5oZ5cg2Urnve.png)

创建后 会自动加入到通用组件下

![](/images/et9/img/S3yBb5F88opccbxtsGUcYZcUnGd.png)

### 2 修改 View 名称

![](/images/et9/img/Xmh6bVKgioGWzExKrkScEfq3n77.png)

这里举例 修改名称为 Main1ViewParent

命名规则 大写字母开头 结尾 Parent

子类可以不管 之后会自动修改为 Main1View

修改完成后点击 检查拆分数据

![](/images/et9/img/Mh6wbBnf2oQ3ubxAno3cCsh6nPe.png)

你会发现名字已经自动同步了

![](/images/et9/img/Fzxfbmvh2oN33YxRRxycpBponQd.png)

### 3 以上往复 在创建一个 2 并且在弹窗下创建一个 3

![](/images/et9/img/EVRTbzYvIorKadxqCpAcwJmInBh.png)

### 4 通用界面

创建时 都是默认设置为 动态创建的 UI  这里我们学会手动设置 默认 UI 不动态创建

![](/images/et9/img/PEM5bZIgUo7tExx0UpwcdaOlnNg.png)

1  把 1 删掉

2  从左边重新吧 1 拖到不创建列表上

### 5 至此 我们的一个 MainPanel 基础设置就完成了 他包含了 3 个 View 其中 2 个 被调用时才会动态创建

里面的内容我们稍后丰富  大致结构已经有了

此结构就对应  比如一个 装备功能下  有 锻造功能  强化功能  萃取功能  等等

装备对应的是一个大而全的功能  他就是我们的 Panel

这个 Panel 打开后会有各个子功能   对应就是我们的页签 我们的 View

之所以要动态创建就是  因为我们打开一个 UI 的时候不可能吧 上述功能的 View 都创建出来吧  他们很有可能都不会被玩家点击用到 何必加载呢  这就天然的使用了分层的结果 动态创建

弹窗也是一样的 根据需求调用自动打开

### View 的层级

这里提一下层级  2View 1View 的层级就是在 源文件中修改的 根据需求设定

原则上 我们是不会在代码中修改各个 Parent 的层级顺序的  你在源文件中的编辑循序就是他们之后的层级

一般来说  常驻的 UI 都在最下面一般是公共功能

其他动态 View 也不会存在层级问题 因为他们只会同时存在一个

## 源文件生成 拆分

点击源文件生成

错误的生成 （点击编辑窗口中的预制体）

![](/images/et9/img/SlCLb6AUyo2UbdxUgXoc3VHfngh.png)

不要点击编辑界面上的源文件  你是生成不了的 会有错误提示

正常的生成

保存后 退出编辑模式 选择资源文件的预设 点击生成

得到自动生成后的文件

![](/images/et9/img/FVWgbwXFQoy8fTxrHYOcmDfnn8e.png)

其实这个时候源文件也发生了改变

重新进入到 源文件下 我们会看到 View 已经自动关联上

![](/images/et9/img/KrNgbOHPFoHepTxJh7Ccs7chnth.png)

后续扩展编辑

如果你有 增加/删除 Panel 结构的情况  才需要编辑源文件    步骤跟之前一样就可以了'

如果你只是修改文件中的内容 可以直接在生成的 对应 View 中进行

## 进入到生成的 Panel View 中增加一些组件 进行标识

### MainPanel

![](/images/et9/img/DT1ibdtD5olSyKxqOFqcFHqcnrb.png)

我们会发现只有 1View 是存在的 其他 2 个都不存在了  是因为其他 2 个我们是动态生成的 所以是会被删除的  他会自动加载

一般来说我们是不会在 Panel 上做一些实际功能的   主要功能都会到 View 中去实现                最常见的是在 Panel 上有一个公共的关闭按钮

加一个关闭按钮  且增加关闭事件

需要了解 [CDE 功能](/et9/cde-table/)

不了解的先跟着步骤 之后了解

#### 关闭按钮创建

![](/images/et9/img/B3QobOYSrorB8Sxf6agcRWvanqc.png)

样式就不多介绍了 随意

##### 1 添加事件表

![](/images/et9/img/DrGtbUXryoOP38xEyODcLVZ3ncg.png)

##### 2 添加一个关闭事件

![](/images/et9/img/OnSsbgSUeoNlujxVQOgc9ofZnjb.png)

自动生成的名称会是 u_EventXXX

![](/images/et9/img/TY0gbjZmOopbs1xaZsYc84LcnEP.png)

##### 3 按钮绑定事件

![](/images/et9/img/EGjSbwCdxo95WixJuZqcKkN6ndf.png)

选中刚刚添加的事件 进行关联

![](/images/et9/img/WIFUbFQjpoIRRdxoKavcFnZRnGf.png)

因为 View 1 自动打开的 我们在加一个按钮 打开 View 2

### View1

这个 View 是自动打开的 就修改一下背景颜色 标识一下就好了

![](/images/et9/img/VuGmbK0GcoXfakxwc6sc5uyYn5g.png)

### View2

2 添加一个背景  1 个按钮 用来关闭 2

![](/images/et9/img/WHTkbhp7roGJ5PxVDNUcF3POnwd.png)

弹窗 就不介绍了一样的

## 快速生成模块所有

使用 UI 工具 一键发布所有 （适合大量修改时）

![](/images/et9/img/YlQeb28VJoX5NfxQY3Uc3nxon5P.png)

选择到 发布 >> Main >> 发布当前模块

可以看到 工具自动已经收集到当前的信息 有 4 个预设需要被发布

当然你也可以在 UI 源文件上一个一个的点发布  （适合小修改）

发布完毕提示       等待编译

![](/images/et9/img/SBo4bEiAioXux8xnIBMcgc4ynve.png)

![](/images/et9/img/EWfKbLtaionJvrxUucac0sO2ntd.png)

## 生成代码 认识

生成后的结构

![](/images/et9/img/SMvAbDOjsoyrzqxJ5B6cIp79n5c.png)

YIUIGeneration

这个是生成的基类  不要手动修改里面的数据  他会在每次自动生成时覆盖

YIUI

此文件下的才是我们真正写代码的地方

MainPanel

会有各种生命周期 还有我们之前定义的事件

![](/images/et9/img/Nym2b1aVYodWwmx7ctRcrFoRnDb.png)

关闭事件 打开 view 2

![](/images/et9/img/UXKObXSpkobixNxAZDMcCH80nPf.png)

View1

View2

![](/images/et9/img/XX2KbD9lXosyShxScZHctf6rnHb.png)

## 打开 UI

如：找个场景 找个 mono 脚本

![](/images/et9/img/IBGkbYo4ZoXn3AxNecQcXLVYnWc.png)

需要告诉框架 同步与异步加载方法

初始化 PanelMgr

之后任意地方调用打开某个 UI 即可

## 验证

UI 被打开   日志可以看到各个的生命周期情况

![](/images/et9/img/WeV7bHecGoqCgnxicdmcijnPnwc.png)

点击按钮 打开 View 2

![](/images/et9/img/YpVibJ8NPojU3wx1wSzckqeanPg.png)

关闭 2

![](/images/et9/img/YvoObfLE3ogwwhxnQCLc4wdVnFb.png)
