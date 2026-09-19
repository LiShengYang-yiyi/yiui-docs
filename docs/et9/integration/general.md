---
title: 通用 接入
et9: true
---

# 通用 接入

> ## [安装视频介绍](https://www.bilibili.com/video/BV1cz4y1s7QS?p=2)

::: tip 🌟
点赞支持 一键三连
:::

## 视频中的某些内容可能与现在版本有差别

正常毕竟视频更新频率不如文档  请以文档,Demo作为参考

[B 站视频 BV1cz4y1s7QS](https://www.bilibili.com/video/BV1cz4y1s7QS)

::: tip 🎉
预览Demo版本的时候 注意Unity版本需要安装URP 否则会提示错误 自己从头接入不需要
:::

## 安装

#### YIUIFramework 框架

#### 必备其他插件

Odin

UniTask

DOTween

注意UniTask 需要开启对 Dotween的支持 具体参考下面链接: (YooAsset同理)

[UniTask DOTweenAsyncExtensions](/et9/faq/unitask-dotween)

#### 修改安装目录设置

![](/images/et9/img/T4r0btRC2ofTOsxxQUdcvOrunnd.png)

找到 UIStaticHelper 类 对需要的进行修改

以上为默认设置 如果你吧框架放在 Assets/Plugins 目录下

根据需求 修改对应的设置

#### 使用 UI 工具

##### 打开

![](/images/et9/img/OxsCbipnWop68pxCw6PczhcTncH.png)

##### 全局设置

![](/images/et9/img/UlF0bSiGrosl4JxPh6PcRGh3nld.png)

设置你的名称  用于生成脚本时写上你的大名

这里可以看到你设置的各种路径 名称...

这里都是只读的

没有开放 在这里修改 是因为 这个全局设置 一生就设置一次 担心会有人该错 或者其他问题发生 所以 直接在代码中修改 不在这里修改

##### 初始化项目

![](/images/et9/img/LYeSbtYlHo6YVnxmYvBcoVOHnMc.png)

1 将自动为你生成你的第一个包 Common 公共包

![](/images/et9/img/YX8lbg7Juoe8RkxDd3hcsSCyn0b.png)

###### Atlas

图集文件夹  此文件夹中的文件会自动生成

###### Prefabs

当前包 所有预制体

###### Source

当前包的 所有源文件

###### Sprites

Atlas1

自定义的第一个图集

Atlas2

自定义的第二个图集

AtlasIgnore

被忽略的文件夹  此文件夹下的所有精灵不会被打成图集

名称随意 但是建议这样 AtlasX

###### GlobalSpriteAtlasSettings

全局的图集设置

在 UI 工具 全局图集设置被修改后会自动保存

会自动拷贝 YIUIRoot 预制体

此预制体就是字面意思了 会自动打开时加载

也可手动放到场景中  会自动判断是否存在

可修改此预制体 各种设置 为项目的详细设置

会自动生成第一个公共面板源文件 作为参考  也可删除  后续详细介绍各种资源的创建

##### 全局图集设置

设置图

![](/images/et9/img/WlkDbNHEZoVOzDxh8PWcwovAnCZ.png)

就是字面意思上的设置  根据需求设置图集

下面的平台设置根据需求设定即可

::: tip 🏆
奥丁版本请保持当前Unity可用的最新版本
:::

#### 奥丁提示

由于官方出了预制件嵌套功能后  奥丁的序列化出现了问题 需要正确的使用

否则就会出现数据丢失的问题

提示

![](/images/et9/img/Jk52bZJpYoiXqDxpnLIckWIunmb.png)

翻译 1

Odin 的定制序列化协议稳定且快速。最重要的是，它是快速、可靠和有弹性的。\*注意事项\*然而，需要注意的是，Unity 选择如此有限的序列化协议是有原因的。它使事情变得简单和易于管理，并限制了您可以在数据结构中引入多少复杂性。当所有的限制突然消失时，你很容易忘乎所以，搬起石头砸自己的脚，因此我们提出了这个警告。撇开警告不谈，使用更强大的序列化协议（如 Odin 的协议）当然是有正当理由的。然而，我们建议您明智地使用它并保持克制。毕竟，权力越大，责任越大！

翻译 2

在 2018.3，Unity 引入了一个新的预制工作流程，这样做，改变了所有预制件的基本工作方式。尽管我们尽了最大的努力，但到目前为止，我们还无法在新的预制工作流中实现对预制实例和变体的 odin 序列化预制修改的稳定实现。这与 Odin 序列化器本身无关，它仍然坚如磐石。odin 序列化的 ScriptableObjects 和非预制组件/行为仍然非常稳定——你看到这个消息只是因为这是一个 odin 序列化的预制资产或实例。在 2018.3 及以上版本中使用预制件与 Odin 序列化被认为是一个“已弃用的功能”，并且正式不支持。简而言之，如果您无视这条信息，然后遇到问题，我们将无法帮助或支持您。请记住这一切，如果你想继续使用奥丁序列化预制件。

::: tip 🏖️
#### 所以在整个 UI 框架使用过程中请严格按照约定规则来使用
:::
