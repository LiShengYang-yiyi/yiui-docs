---
title: Data Table
et9: true
---

# Data Table

## 数据表

### 定义

设定各种变量        名称 与 变量 之间的映射表

通过修改变量数据来修改 UI 上的各种数据表现

我们并不需要知道 我们要操作的组件是什么  我们只关心变量数据  达到解绑的目的

预览

::: tip ✍️
非最终效果 还在不断完善
:::

![](/images/et9/img/JnqdbpLnRo1R1lxIAYjcL2u8nTh.png)

![](/images/et9/img/SKFrb2nHAozj0FxCdaQc5lexnaf.png)

### 命名

~~因为设计需求  无法把这几个值拆分~~

~~主要还是 unity 序列化问题~~

~~所以要从名字上就能看出类型~~

~~m\_  + 类型 + 自定义~~

~~m_StringXXX~~

~~m_IntegerXXX~~

~~m_BoolXXX~~

u_Data+自定义

### 功能

绑定一个变量时  变量表可以动态看到那些对象绑定了这个变量

![](/images/et9/img/OKcYbtZQBopLSFxtZVdcvQPTnlf.png)

修改值时

对应绑定的动态变化

修改名称时

对应绑定的动态变化

删除变量时

对应绑定的动态变化

### 实现

#### 文本

![](/images/et9/img/U1kwbcM1qogsn3xSgVxcm18pnbb.png)

添加 移除变量

frmate

变量发生任何变化时

![](/images/et9/img/EMygbGF4ZoNUP5xAnTCc1y9On7g.png)

文本会及时更新

#### Active 布尔类型

Active

![](/images/et9/img/XxCXb4EQbom5O2xeBktcqIZbn4g.png)

各类脚本的激活

#### Slider

![](/images/et9/img/COEJb0yJ1oNlPbxV5s3cytu7nth.png)

修改这个值

#### 修改图片

#### 置灰

#### 等等....

#### 修改颜色

#### 组件上跟数值有关的所有都能做

![](/images/et9/img/Ym21b6CaPozLTQxG99UcWWDmnuc.png)

大小

宽高

缩放

### 重大升级

::: tip 🌟
使用泛型类型
一开始的版本是吧所有可能会用到的数据穷举了出来
缺点也是显而易见的
扩展麻烦
占用大 因为会有很多冗余数据
:::

![](/images/et9/img/IMkLbLMufomXebxiem4cj5FHnmg.png)

## API

### UIData

#### 值改变 事件添加与移除

##### AddValueChangeAction

![](/images/et9/img/N7CTbEPLNoOUU7xYrs7ck1tvnhe.png)

##### RemoveValueChangeAction

![](/images/et9/img/XitGb6fWsob1XRxOf3vcC4nWnRh.png)

#### GetValue

![](/images/et9/img/XGzUbE9ewoS5bhxKPOActRldn1g.png)

泛型获取值

扩展参数 可带默认值

![](/images/et9/img/HGWqbxkr9oiV7vxogUdcIZyfnnc.png)

#### Set

![](/images/et9/img/UHj5bGQsZoFl8jxLHxnc0KdJnDc.png)

设置值 可强行刷新  会触发回调 否则相同值是不会触发回调的

#### SetValueFrom

![](/images/et9/img/TjKPbZiBVoj34bxUYyVc7uvYnfh.png)

设置值由另外 datavalue 的值  必定会触发回调

#### GetValueToString

![](/images/et9/img/KDhtbXOTFoikm3xq7RZc58kjnfc.png)

每个泛型类型都已经重写了 tostring  可以得到字符串值  用于一些描述呀什么的

#### GetValueObject

![](/images/et9/img/QywubUNC8oaC7rx6Om9czsP9npg.png)

返回值的 obj 类型 需要自己转  应用于一些公共方法时

新版 以上都改为了 静态扩展

### 添加新类型

#### 添加枚举

![](/images/et9/img/BapbbGiCfoJDUbxQ1a3cmWt5nZe.png)

EUIBindDataType

#### 创建类

![](/images/et9/img/UgXObILWgo7FBAxfUHocCbFbntb.png)

##### 注意命名

##### 泛型继承 类型

##### Tostring 方法的重写 特别一些引用类型呀什么的 tostring 方法要好好写 方便表现

![](/images/et9/img/OzNhbfbcWoThhixtRFZc6WvFnbb.png)

##### 重写枚举类型

![](/images/et9/img/UDabb2UTRozzfzx9PgVcWe5qnig.png)

##### 初始化 如果有特殊需求可以自定义

![](/images/et9/img/D8Xfb3Om5oaNG6xyzWpcqgtwnTb.png)

##### 类型返回重写

![](/images/et9/img/CmDWbhhLeo6eruxh5HqcgBulnCb.png)

##### 对比函数 这个里面就很多了 要仔细写 根据实际需求来 更多的可以参考其他的

![](/images/et9/img/GoCUbT5vPompeLxlk9xcUMJznHn.png)

特别注意一些无法对比的类

#### 写 tostring 方法

![](/images/et9/img/WIbzb62UNo69b7xEEbJcKSEZnBe.png)

UIDataHelper

## 扩展规则

### 命名

![](/images/et9/img/C9HYbonuYoojKCxpSRsc1OKgnpf.png)

UIDataBind+XXX（功能）

### 类

#### 继承 根据需求继承

![](/images/et9/img/NaxJb2XksoenktxstFIcLelfnBe.png)

常用基类 UIDataBindSelectBase

#### 表头

如：

![](/images/et9/img/R6wCbVRmKorvrWxSR0ic22Z5nmf.png)

InfoBox

提示信息

DetailedInfoBox

可折叠的提示信息  东西很多的时候

LabelText

描述作用 方便在绑定关联的地方提升辨识度

RequireComponent

根据需求 一些数据需要关联的脚本

AddComponentMenu

![](/images/et9/img/EP9vbCEIao0C0MxZrm3cHgEnnLA.png)

UIBind/Data/脚本名称 + 中文注释

UIBind/Event/ ... 就是事件的

其他 ....

#### Mask

![](/images/et9/img/FDQLbMgR3oGmMbxakYAcxBg5nJf.png)

这个是点开筛选的时候 可以看到的数据列表的过滤器

返回 -1  则可以选择任何

#### SelectMax

可以选择变量的最大个数  默认是无限

#### OnRefreshData

初始化时被调用

editor 下 OnValidate 被调用

注意 重写此方法 主要要调用基类 否则会有其他问题

![](/images/et9/img/TSvcb2s6WoxaVwx7FF9cgmP4nYd.png)

## 功能归纳

::: tip 🌰
部分功能
:::

### Change 改变数据

::: info 📌
重要进阶功能 类似于 FGUI 的控制器 运用得当可以实现非常多的功能
:::

#### 实现

主动触发 吧目标数据改变成设定的数据  改变后触发事件

支持同时触发多个

目前只支持由 UI 上点击后触发

如果获取到目标手动触发也不是不可以 可以把这个方法公开  但是建议不要

![](/images/et9/img/YG8Ibs8PVoE2wmxIGnXcGdwfnMe.png)

内置事件

![](/images/et9/img/VrR4bbS7XoAwwyxJiVbceBuqnIb.png)

通过调用添加事件  可以

![](/images/et9/img/ExMIbpPj8oc8o6xAwcLcxcLznpb.png)

同时记得移除时调用移除事件

![](/images/et9/img/QpGbbxc0goI6XNxjzdWceK3Fn8b.png)

##### 案例

![](/images/et9/img/JTj0bY8G2oH4tMxgDG0cLzWxn5b.png)

这里设定了 2 个数据

1 是个 string 类型  名称：字符串 原生值=123

2 是个 int 类型 名称：INT 数值 原始值=0

点击响应后会变更

就会把你输入的值作为修改值 修改这个变量

![](/images/et9/img/BYGLb0UwmovJgOx9UK1cAKv6nJb.png)

可以看到原生数据也是同步修改的

![](/images/et9/img/Ybs2bCM2UoEzw2xo9mjc3tVKnhg.png)

#### 扩展

通过这个基础功能我们就可以拓展非常多的功能出来

数据改变后触发一个事件 由 event 实现

![](/images/et9/img/POtZbo9hQojdw5xXVZKcpYEKnnc.png)

类似于 FGUI 的控制器                        显隐切换  比如一个 Int 数值的数据

有 2 个 BindChange 比如页签

1 = int = 1

2 = int =2

然后配合 Active 显隐

这样在一行代码没写的情况下就可以触发对应的显隐切换了

改变图片

同理因为修改了图片的数据 所以有引用这个数据的图片就会被自动修改

改变透明度

.....

全部都基于其他的数据绑定 这样就可以全链接

### Active 显隐/激活

GameObject

Component

还有集合 支持 1 个 或者 多个

概要

![](/images/et9/img/GR7hboWR4o6fOlxtzqZcCxX0njB.png)

active 只能是当前 谁挂就是谁

其他的 3 个都需要手动拖动 进行自定义

### Text 文本

文本 原生 UGUI 的 Text

如果需要 TMP 的自行扩展

支持 4 种类型显示文本

![](/images/et9/img/JXWCbqcEfoXdKlxZ7xJcvh52nje.png)

会把对应的数据转换为字符串显示  且实时同步

### Color 颜色同步

任意有图片可以改颜色的都可以

![](/images/et9/img/OCbPbF0MGoqGiOxDEjkc9Aein0c.png)

则修改颜色可以直接拿到数据类型 直接赋值即可

### Gray 置灰

![](/images/et9/img/GReYb9UUMoKAeQxnjAHcjGbXntf.png)

### Rect 系列

位置

![](/images/et9/img/Ok9dbfDatoiFWWxnmBIcr14vnxe.png)

V2 V3 2 种都已支持

旋转

![](/images/et9/img/SNo2bgtBRoQSR4xHji4cqqiWnch.png)

单一轴旋转 或者整体 V3  都支持

缩放

![](/images/et9/img/HLkHbBJUdouGStxti8dcgWb8nMf.png)

单一缩放 或 整体缩放

大小

![](/images/et9/img/RKgxbTM4ZoARSMxGOAKcgwIWnD5.png)

### Slider 滑动组件

![](/images/et9/img/FK85bmHD8oYSPsxV5sicZgixnyg.png)

### Scrollber 滚动条

![](/images/et9/img/YQyfbvojZouMiHxZ966cB1HHn8b.png)

### Toggle

![](/images/et9/img/JPLpbSoTQocAVUxjrvFc1IHenAg.png)

### Selectable 交互/所有可选择

![](/images/et9/img/GMLYbT7eNorAlSxtcoLc8fsknIe.png)

改变是否可触摸 Toggle / inputField / button / dropdown 这些都可以用

在某些情况下不允许点击时  灰色点击那种 就可以用这个 因为他们都继承 Selectable

### Dropdown 下拉菜单

![](/images/et9/img/YHCDb3kezoopPaxVOGUcBjrZnTg.png)

### 动画

#### Animation

老动画系统 简单的动画更简单方便

目前有 2 个扩展  根据需求选择

##### string

![](/images/et9/img/CPgabIxaQoGANtxOygBcgnYQn03.png)

![](/images/et9/img/OObKbWjn8oumH7xzrfLcHmClnPd.png)

##### bool

![](/images/et9/img/JT5EbPNoloZjBCxSaG8cpyN2nwh.png)

![](/images/et9/img/IDAbbeN0YoruIjxdMZ4c2gqinGb.png)

#### Animator

新动画系统

对于 UI 上简单的动画 这个新的就多余了 所以选择用的老动画 会简单很多

当然你也可以扩展一个支持此动画的

### Image 图片

需要配合 资源管理工具  当前用的 yooasset

传入字符串 修改图片

::: tip 🍞 更多功能持续扩展中
:::
