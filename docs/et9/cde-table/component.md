---
title: Component Table
et9: true
---

# Component Table

## 组件表

### 定义

通过 设定的名称 直接找到对应的预设组件

名称 与 组件 之间的映射表

### 预览

::: tip ⛱️
非最终效果 还在不断完善
:::

![](/images/et9/img/Py8XbDPSnopzUJxCWE3cawAInkc.png)

![](/images/et9/img/RewFbXCOboVCz4xO8mnc2Tvunhg.png)

### 命名

自动命名规则

~~m\_ + 类型 + 自定义~~

~~m_ButtonXXX~~

~~m_TextXXX~~

~~m_InputXXX~~

u_Com+自定义

## 使用

### 创建

添加一个数据 new 一个新的数据 这个数据是编辑时的数据

![](/images/et9/img/GgOVbBljzob1lbxTXxtcpE4InMf.gif)

找到组件表  点击 + 号 创建一个 UIBindPairData

![](/images/et9/img/RopYbSf3xodQNlxbrqhcp10ZnMg.png)

### 关联

拖入想要的组件

如果直接拖 Hierarchy 面板中的对象 那得到的就是对应的  Transform 组件

想要获得挂载的其他组件 需要 打开第二个Inspector 拖入对应的组件

![](/images/et9/img/AyI0bgm8xojEAWxvcjEcEMSnnRb.gif)

![](/images/et9/img/XjeKb4eY3o5Xf6xbvKmchjTmnFb.png)

选中ComponentTasble对应的组件  然后Inspector 锁定 (因为接下来我们要选择其他的对象 不锁定这里会变)

选中需要注册的组件对象 (Hierarchy 面板中的对象)

打开第二个Inspector 面板

找到需要注册的具体组件类型 (所以组件表可以关联任意组件)

输入自定义名称 (也可以空白自动生成 有2个自动生成选项)

然后点击自动检查 导出到最终使用的数据

## 2024-8-20 新功能

[组件表快捷添加](/et9/features/tools/component-table-shortcut)

### 最终数据

![](/images/et9/img/Mu88beWTwoAaGzxjIU0couTonAg.png)

黄色框中 属于编辑数据  并不是运行时使用的数据

红色框中的 不可编辑的数据 才是最终运行时的数据

所以一切以 红色款中的数据为准

::: tip 🍉
如果出现什么引用丢失 名称对不上之类的 请查看红色框中的数据是否正确
修改黄色框中的数据  重新自动检查 为准
:::

注意 key 有修改 要记得导出代码

![](/images/et9/img/OUOqbInIEoVjsNx1P6uckiyBnIe.png)
