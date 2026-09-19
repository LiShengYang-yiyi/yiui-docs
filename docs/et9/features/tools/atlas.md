---
title: 图集
et9: true
---

# 图集

::: tip 💡

## Unity的图集功能 具体请自行了解

图集怎么加载的 怎么打包的 等等问题...

图片在不同平台下的压缩格式 不够清晰 等等...

你要来问我 我也只能让你百度,AI...

不了解的情况下可以考虑不用图集 无非就是**Draw Call高 内存大而已...**

:::

## 文件夹结构

![](/images/et9/img/KOFqbNRjRop6wjx2hujc0kwgn2g.png)

每一个YIUI模块都会生成这样的文件夹结构

其中 Sprites 文件夹对应精灵文件夹  也就是放所有图片文件的

## 文件夹规则

### 生成图集

AtlasX  => 代表图集名称  名称可以任意命名 并没有特殊要求

![](/images/et9/img/JPtDblahFo5F1nxyPWRc82Pgn7f.png)

最后生成时就会以文件夹名称生成对应的图集

### 忽略图集

AtlasIgnore

此名称代表 忽略图集 这个文件夹下的所有图片不会打图集

## 图集设置

在YIUI工具中 全局设置包涵了 全局图集设置

Unity顶部菜单栏 >> Tools >> YIUI自动化工具 >> 全局设置

![](/images/et9/img/EU5IbEqRIoOo7wxjwalcI7z3n2g.png)

自动生成图集时 会采用的公共设置

### 指定图集能否独立设置

目前没有这个功能

如果你有图集想自定义设置不采用全局设置  又怕自动设置时覆盖你之前的设置

请额外建立一个文件夹  把对应的精灵文件夹移动到另外一个文件夹下 自行维护即可

或 扩展本工具等.....

## 生成图集

Unity顶部菜单栏 >> Tools >> YIUI自动化工具

发布 >> 找到指定模块 >> 更新图集

![](/images/et9/img/Y0YQbfkIcoahLmx6dRcc7iywnWg.png)

### 全模块全部图集更新功能

![](/images/et9/img/YcjSbkv4zoeGIXxNyqec6B5Onjc.png)

这里只有全发布 如果你想扩展一个按钮 就是更新全部图集  请参考全发布自行实现

![](/images/et9/img/RrYTbiIKEouJS0xcIu9cBIcJnDd.png)
