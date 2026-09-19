---
title: 组件表快捷添加
et9: true
---

# 组件表快捷添加

[Component Table](/et9/cde-table/component)

全系功能

任意组件上右键表头 即可弹出快捷按钮

点击自动添加到 上层组件表中

![](/images/et9/img/ObqSbiFZnokTvyxLPxecBjX8ndb.png)

GIF演示 中间的组件表只是为了演示改变效果 实际已经不需要同时开多个Inspector了

![](/images/et9/img/NA3DbG0croah1OxEpVVcHX7Knod.gif)

## 要求

1. 上层必须有CDE表

   - 必须保证属于同一个预制 不能跨预制
2. 自动添加为自动命名

   - 了解自动命名规则
   - 选好自动命名设置
3. 如果命名冲突会添加失败

   - 失败原因看日志 或 断点
