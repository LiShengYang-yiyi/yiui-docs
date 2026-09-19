---
title: 快速入门
et9: true
---

# 快速入门

## 先安装 cn.etetet.yiuicodeanalysis 这个包

::: tip 👍

## 升级指南 / 报错提示

如果是从普通升级的

:::

## YIUI配置

![](/images/et9/img/KwzQbLbhqo7fnLxgXyGc1390nTf.png)

## 原数据

![](/images/et9/img/LMa2bAkhloB8Q6xFR7ccsvyynQd.png)

![](/images/et9/img/RATqb5p8KooPUYxRapdc3aRNnGh.png)

## I2配置

在Luban中已经定义类型为   **I2**

对应需要多语言的地方 类型填  **I2**

![](/images/et9/img/HJi9bXYjmo2yOLx1yvfcdC5Nnwd.png)

## 导出

方式1:

![](/images/et9/img/Vh9QbXVMiojODLxxyNLcnEygnNd.png)

方式2:

![](/images/et9/img/F0Ufb1x4to4gbJxIoCwcZRawn0f.png)

## Yooasset 设置

运行时读取的源文件内容

平时开发是直接读取的本地全数据

打包后才会使用这个内容 , 也可以开发时模拟打包加载流程

更多启动切换相关流程参考源码

![](/images/et9/img/PbaZbFSgsoeV9nxThDGcXkvJndg.png)

::: tip 🌏 使用
:::

## 静态

(不会动态变化的)

(静态多语言会随着语言切换自动切换)

(动态的需要重新调用一次代码刷新)

使用I2Localize 脚本

选择需要的Key  可以下拉选择

也可以在下面输入Key的名称来选择

![](/images/et9/img/G6L3bmeqfoAGmKxXolscozgrnEe.png)

(视频里面文字是 口口 是因为没有字体)

## 动态

### 预制体上使用YIUI绑定

![](/images/et9/img/ZCZpbboFpopRCQxeGOzc8vtxn2d.png)

![](/images/et9/img/Nk2ybDYlSoiLFmxmnU8c1DqZn0S.png)

### 代码

- **直接调用**

(表现层)

通过静态类I2Localize  直接.对应的key 可直接获取到当前语言的内容

![](/images/et9/img/KMAtbDylZo6VUQxs5RHc0Llvn0A.png)

(逻辑层)

通过静态类 I2Terms 可以获取到对应的Key  但是无法直接获取到多语言内容

![](/images/et9/img/SarvbCgN9owRGhxn9SDcIkOxn3d.png)

I2LocalizeHelper 通过静态助手传入Key 通过消息到表现层 可获取到多语言内容

![](/images/et9/img/N1MIbO347ogJMHxOXYtcFKnknCf.png)

![](/images/et9/img/Qu4gbYIKjomvsmxy7mpckNd6nPf.png)

- **通过配置**

已知配置 类型为I2

则拿到配置的I2类型时 可直接用扩展方法获取到对应的多语言内容

(表现层 逻辑层 都可以) 扩展方法相同 区别在命名空间

![](/images/et9/img/XRJgbFxEpoHvcQxaaEycAOgcnDe.png)

## 运行时 动态切换多语言

I2LocalizeMgr.Inst.SetLanguage();

![](/images/et9/img/QOsVbNdigoutnfxG5gHcC7i1nRd.png)

EventView_ChangeLanguage

可监听切换消息对应的UI做表现或刷新

如果是挂在的静态多语言的会自动刷新 代码的多语言需要监听消息做刷新

![](/images/et9/img/KOKAb2E4uozIGKxFwfocBZ0jnY3.png)
