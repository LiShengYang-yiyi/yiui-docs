# Invoke 2.0

# Invoke 2.0

 
![Image](/images/CB5ewIAQZiBf1Ykp2DDcMj22nHb_0_81cbc665.png)
 用户7857 🏕️ 原因 
 由猫大提出的关联问题 
 
 ❤️ 重构 
 注意必须所有UI重新生成 重新修改 
 新用户可无视重构相关内容 
 
 
 UI  定义了一个事件 
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_1_be89ba80.png)
 
 代码 
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_2_fb5da4c5.png)
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_3_6a1ed0b5.png)
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_4_37c1340f.png)
 从1-6个步骤 就是整个事件的关联流程 
 但 3 与 4  因为是字符串  所以无法直接关联  虽然逻辑上是通的 
 在查看代码上就变成了魔法 找不到实现 关联不上 
 由此提出解决方案 实现关联性 
 
 修改 
 
 自动生成Const 
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_5_732a3dd2.png)
 (类名.事件名)(增加了唯一性 有其他作用) 
 
 关联使用Const 
 
![Image](/images/BywGwyrBti21gPkVtYBcoXrtnUd_6_c1a02631.png)