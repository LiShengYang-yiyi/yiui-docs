---
title: 如何自定义启服配置
et9: true
---

# 如何自定义启服配置

![](/images/et9/img/CYfrb9IRCoA4MyxMXmDc3z9Wnzh.png)

已知当前配置默认有2个

分别是,  Localhost, Release

修改想必是没什么难度的

如果扩展出其他呢?

## 建议

不明白的 新手 才入门的不建议考虑这么多

就在现有基础上改就可以了

## 案例

扩展一个 Develop 的起服配置

![](/images/et9/img/FPpXbKvPjoBQ5HxEJD5cnlxrnrh.png)

### 复制 Localhost / Release 改名 得到一份全新的配置

### 根据自己的需求 修改Excel中的内容

注意: 所有起服配置的表头必须全部相同 如果你想扩展新字段 必须所有都要改保持一致

### 修改.bat (对应的都要修改 这里只是用bat举例)

![](/images/et9/img/KU4Wb2Gb3ofAOzxtsfdcNX3onle.png)

新增相关导出 (拷贝上面的参照改 就是改个路径就好了)

![](/images/et9/img/Ioc9b4AZRoOHsSxIAtLcAyPJn1b.png)

### 导出配置

Excel >> ExcelExporter

![](/images/et9/img/GGL8bfn6eo6uFgxpdTLcBVi5nuc.png)

![](/images/et9/img/VL4hbcwW3oGDEQxv3MNcufiSnL9.png)

或 ET >> Luban 配置工具 >> 导出

![](/images/et9/img/A5v8b8osPodcudxK3nycxaDAnNh.png)

![](/images/et9/img/LahZbDlUmocDoFxz4a3cejDLn8e.png)

### 起服配置选择

以客户端启动服务器为例 (其他方式启动服务器请参考其他相关教程)

![](/images/et9/img/MVVfbsjuZo7KZsx0fJTceOtjnnc.png)

在起服列表选择中就会增加对应的选项了

![](/images/et9/img/IxHNbLJTwor6yCxDTLZc2rwqnwb.png)
