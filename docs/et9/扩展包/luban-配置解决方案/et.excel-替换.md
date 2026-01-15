# ET.Excel 替换

 
![Image](/images/A5Ktw8ITdi9LaIkCH8BcmeCQnwh_1_21d066d0.png)
 
 详细讲解替换操作都干了什么 
 如果你更新操作导致ET.Excel 又重新生成导致报错 
 可以重新点这个按钮一键替换 
 
 1. 删除excel包 
 不能全删 因为被其他包引用 
 也不能改其他包引用 因为其他包升级就又还原了 
 所以这里除了package 相关文件 其他全删除 
 
![Image](/images/A5Ktw8ITdi9LaIkCH8BcmeCQnwh_2_4c27ea33.png)
 
 2. InitHelper.cs 
 因为删除了excel包 所以这里报错 
 这里替换为 EditorApplication.ExecuteMenuItem("ET/Excel/ExcelExporter"); 
 功能不变 
 
![Image](/images/A5Ktw8ITdi9LaIkCH8BcmeCQnwh_3_d19bc43d.png)
 29% 
![Image](/images/A5Ktw8ITdi9LaIkCH8BcmeCQnwh_4_e4a2f27f.png)
 
 71% 
 3. ServerCommandLineEditor.cs 
 因为变包了所以路径变了 需要对应修改为正确路径 
 Packages/cn.etetet.yiuilubangen/Assets/Config/Bin/Server/StartConfig 
 
![Image](/images/A5Ktw8ITdi9LaIkCH8BcmeCQnwh_5_dddfd612.png)
 
 
 以上就是Luban包所有的源码修改操作 
 如果相关报错 请先手动修改