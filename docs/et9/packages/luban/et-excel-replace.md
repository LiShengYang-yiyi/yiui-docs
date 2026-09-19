---
title: ET.Excel 替换
et9: true
---

# ET.Excel 替换

![](/images/et9/img/ULq3bcs8toa1MDxO8WRcM22HnBh.png)

详细讲解替换操作都干了什么

如果你更新操作导致ET.Excel 又重新生成导致报错

可以重新点这个按钮一键替换

1. 删除excel包

不能全删 因为被其他包引用

也不能改其他包引用 因为其他包升级就又还原了

所以这里除了package 相关文件 其他全删除

![](/images/et9/img/ATQ8bnnjWoTJTPxiMYTcFV6pnuh.png)

1. InitHelper.cs

因为删除了excel包 所以这里报错

这里替换为 EditorApplication.ExecuteMenuItem("ET/Excel/ExcelExporter");

功能不变

![](/images/et9/img/J8W4bDOs9ocrRyxqvcKcs8pAnfb.png)

![](/images/et9/img/WEY2bQ1iwoYMWZxVNCfcuIpEnPe.png)

1. ServerCommandLineEditor.cs因为变包了所以路径变了 需要对应修改为正确路径Packages/cn.etetet.yiuilubangen/Assets/Config/Bin/Server/StartConfig

![](/images/et9/img/CqSfbbc9Co9oJWxRBTXcaDtrnGh.png)

以上就是Luban包所有的源码修改操作

如果相关报错 请先手动修改
