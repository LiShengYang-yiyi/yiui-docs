---
title: ET9 生成/源文件
et9: true
---

# ET9 生成/源文件

## 弱化源文件功能 扩展其他重构方式

~~因为有很多人用不明白~~

以前的功能都还在

### 改变

1. 依然保留了源文件重构功能 但是不建议使用了 建议用Panel直接重构
2. 源文件就是个一次性的生成工具  使用一次后会默认摧毁
3. 需要预览时可逆向 相当于逆向功能=预览 不要再用逆向的生成

## 新增可直接操作Panel

1. 以后需要重构结构时 不需要逆向了
2. 重新生成也不怕关联掉了

## 源文件Source

### 生成

1. 通过工具一键创建包括文件结构

![](/images/et9/img/IxqhbRTdJopDxHxvDV9c2HfbnOe.png)

初始化推荐方式

![](/images/et9/img/LY42bbTSaotlhvxALPXcWBtNnae.png)

主要是会自动生成一个基础包所需的基础文件夹结构

其他方式也可以创建但是文件夹里就要自己生成 还得满足条件

所以当你是一个新包时推荐以这种方式初始化

1. 右键生成

![](/images/et9/img/UPObbtNAZoIAmhxgcsvcrXWPnsb.png)

限制只有Source 文件夹才可以生成源文件 其他文件夹会报错无法生成

![](/images/et9/img/KkNHbdWaVoLnoTx6M4RcKYeznDb.png)

默认生成的源文件是默认名称  请手动修改命名  XxxPanelSource

![](/images/et9/img/Z9hBbloD6oMqyIxCYpCcWYbHnKc.png)

### 结构

源文件默认生成 AllView / AllPopup

相关功能请从其他文档了解

::: tip 🍰

AllView / AllPopup 现在不是必须的

如果界面没有需求可以删除

:::

![](/images/et9/img/ZDMUbkjHuok59cxER2tcImDUnSf.png)

::: tip ✏️

手动添加 AllView / AllPopup 方式

:::

已屏蔽拖拽复制操作 且强制检查父级

要添加必须通过 根节点右键添加

如果有什么特殊情况错误 可考虑手动删除重新添加解决

![](/images/et9/img/EZ7Yb3P9Ao4PNyxPhD2cFaO1nxu.png)

### 添加View

::: tip 🎲

AllView / AllPopup 组件下右键添加

:::

![](/images/et9/img/Ih9RbFmMKoxJXBxuaVkcZtlqnWe.png)

创建名称为默认名称

请手动修改命名 XxxViewParent (必须保证全局唯一)

建议命名格式以 模块+功能+View 防止有重名

子物体不需要修改会自动命名

会自动加入到对应列表中

![](/images/et9/img/DtvObbOlPoJoVyxAsjQczY15nzg.png)

(如果因为格式等不满足条件会被从列表移除)

![](/images/et9/img/VrZ9bjYzGoutxJxGfmdcxkrTnee.png)

无需手动添加 如果你满足要求会自动收集

(如果是通用界面 不创建的 需要自动收集完成后 手动调整)

手动调整  设置为通用界面 或 调整循序

这个循序决定了生成的枚举顺序

UI上的循序 与 列表中的顺序没有关联

UI上的顺序决定了渲染先后 根据需求设定

列表中的顺序决定生成的枚举顺序

![](/images/et9/img/NJocbTD6uoTtlvxEcATcCeDtnOf.png)

### 通用界面 与 需要被创建界面 的区别

唯一区别就是 通用界面是与Panel一起加载的

默认与Panel加载出来后是隐藏的

创建界面被打开时才会动态加载

其他的用法相同 通用界面也是要调用打开才会打开的

没有特殊需求基本都是用创建界面

> 本段内容同步自：ET9 生成/源文件

### 拆分生成

### 全局常量设置

![](/images/et9/img/Hoj3bWCfJoKHQYxh8HkcU13vnLd.png)

会根据刚才源文件设置的结构自动生成

默认拆分后不保留源文件  所以会直接删除源文件

如果需要保留 修改常量 建议不保留

源文件拆分后就没用了  如果需要修改 请参考Panel生成相关

![](/images/et9/img/Xaj1blXrso02LsxzXRncbMGGngc.png)

### 逆向源数据

::: tip 💡
### 此时的源数据只有一个作用 就是 预览
不要在此源数据基础上 进行其他任何操作
预览完毕删了也可以
:::

为什么需要预览?

因为复杂的UI 可能由多个View 重叠才能看到最终效果

如果你要实现预览 就得手动操作

此时逆向数据 会加载出所有View 可以达到同时预览的目的

### 对Panel 使用 可逆向源数据

![](/images/et9/img/D3kzbyQUroYqMCxIK8IcA10mnIg.png)

## Panel

### 创建

在基础结构上可右键直接创建 Panel

这个基础结构可以手动创建 也可以使用工具生成

适用于一个模块增加其他Panle  如果是初始化操作建议使用Source

![](/images/et9/img/NHu3b7w2IoldiWxUZ4Xc2A5xn5f.png)

创建名称为默认名称

请手动修改命名 XxxPanel (必须保证全局唯一)

### 改完后检查一次

![](/images/et9/img/JoiebeNOco5Togxo0QZcorLMnyg.png)

假设有同名会检查报错

注意修改

#### 区别

手动创建的Panel 默认没有 AllView / AllPopup 如果需要请手动创建

### 添加View

与源文件中的操作相同

> 本段内容同步自：ET9 生成/源文件

### 生成

根据需求创建好View

修改View的命名  (注意命名必须全局唯一)

![](/images/et9/img/Nn1Vb07QKo1x9Exe2S4cs7zenZe.png)

会根据设定自动检查

如果这个预制不存在则会创建

::: tip 💡

AllView / AllPopup 子物体要求与限制

:::

所有指定的XXViewParent 生成后

如果这个通用类型 则不能有任何子物体 否则会被强制删除

如果是通用界面 必须是通用界面的预制 否则会被强制替换

### 修改 / 重构

修改通用 / 顺序 / 删除

添加就参考上面的添加流程一样的

所以现在修改一个Panel结构时 可直接在Panel上操作

注意: 删除的View结构并不会自动删除对应的预制体 有需求请自行手动操作
