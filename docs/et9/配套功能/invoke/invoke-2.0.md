# Invoke 2.0

**URL**: https://ai.feishu.cn/wiki/BywGwyrBti21gPkVtYBcoXrtnUd

**Parent**: Invoke

**Depth**: 4

---
Invoke 2.0
输入“/”快速插入内容
Invoke 2.0
亦亦
🏕️
原因
由猫大提出的关联问题
❤️
重构
注意必须所有UI重新生成 重新修改
新用户可无视重构相关内容
UI  定义了一个事件
代码
从1-6个步骤 就是整个事件的关联流程
但 3 与 4  因为是字符串  所以无法直接关联  虽然逻辑上是通的
在查看代码上就变成了魔法 找不到实现 关联不上
由此提出解决方案 实现关联性
修改
自动生成Const
(类名.事件名)(增加了唯一性 有其他作用)
关联使用Const