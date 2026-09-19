---
title: ET.Excel 转 Luban.Excel
et9: true
---

# ET.Excel 转 Luban.Excel

ET源生配置文件转Luban的配置文件案例参考

## ET.Excel

AI包中的配置

![](/images/et9/img/Hc7Obw2WLoxUrnxNXykcSkNEngg.png)

### 页签

![](/images/et9/img/JmkObNyEvoz5XexQgu7cyUYLnkh.png)

经常容易遗漏的位置  先看这个表有多少页签 别转的时候少了

### 使用

具体参考ET.配置工具使用方法

![](/images/et9/img/J2cLbq7CqoOvA7xQrwucZCFxnLe.png)

| **区域 1** | **区域 2** | **区域 3** | **区域 4** | **区域 5** |
| --- | --- | --- | --- | --- |
| 描述 | 配置区域 | 整个表的作用范围 | 配置的作用范围 | 字段的作用范围 |
| 字段名 |  |  |  |  |
| 字段类型 |  |  |  |  |

## Luban.Excel

参考: https://luban.doc.code-philosophy.com/docs/manual/excel

### 页签

相同的功能  Luban配置表如果没有特别指定某个页签时 默认导出全部页签

### 使用

![](/images/et9/img/OKoib87CcopWkkx3n3YcXNfAnQd.png)

| **区域 1** | **区域 2** | **区域 3** | **区域 4** |  |
| --- | --- | --- | --- | --- |
| 没有固定顺序可任意指定 | 配置区域 | 标题头行格式 | 配置的作用范围 | Luban没有区域5 |
| **可快速理解**
##type = 类型
##var = 字段名称
### = 描述 |  |  | 有组概念+

### = 注释配置 | 代替的是  在字段名上面

#+名字 = 注释这一行不导出
或者没有名字 = 不导出 |

### 组

![](/images/et9/img/XHJubBdXCoWf78xWGHucnjcTnAb.png)

Group 组概念

使用##group 设置组设置

如果有则按照指定组导出

可以没有 默认全导出

## 整表组

整表导出组设置在 table.xlsx 表格中

参考官方文档 分组

## TODO

画饼 未来还会出自动转表工具

指定ET的表 直接生成一个luban表
