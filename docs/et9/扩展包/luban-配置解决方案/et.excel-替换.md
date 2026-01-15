# ET.Excel 替换

**URL**: https://ai.feishu.cn/wiki/A5Ktw8ITdi9LaIkCH8BcmeCQnwh

**Parent**: Luban 配置解决方案

**Depth**: 4

---
ET.Excel 替换
输入“/”快速插入内容
ET.Excel 替换
亦亦
详细讲解替换操作都干了什么
如果你更新操作导致ET.Excel 又重新生成导致报错
可以重新点这个按钮一键替换
1.
删除excel包
不能全删 因为被其他包引用
也不能改其他包引用 因为其他包升级就又还原了
所以这里除了package 相关文件 其他全删除
2.
InitHelper.cs
因为删除了excel包 所以这里报错
这里替换为 EditorApplication.ExecuteMenuItem("ET/Excel/ExcelExporter");
功能不变
29%
71%
3.
ServerCommandLineEditor.cs
因为变包了所以路径变了 需要对应修改为正确路径
Packages/cn.etetet.yiuilubangen/Assets/Config/Bin/Server/StartConfig
以上就是Luban包所有的源码修改操作
如果相关报错 请先手动修改