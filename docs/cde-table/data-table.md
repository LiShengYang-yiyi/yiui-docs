# Data Table

**URL**: https://ai.feishu.cn/wiki/H2wjwqphgiQNb3kgfpdcz97Cnvb

**Parent**: CDE Table

**Depth**: 2

---
Data Table
输入“/”快速插入内容
Data Table
亦亦
数据表
定义
设定各种变量        名称 与 变量 之间的映射表
通过修改变量数据来修改 UI 上的各种数据表现
我们并不需要知道 我们要操作的组件是什么  我们只关心变量数据  达到解绑的目的
预览
✍️
非最终效果 还在不断完善
命名
因为设计需求  无法把这几个值拆分
主要还是 unity 序列化问题
所以要从名字上就能看出类型
m_  + 类型 + 自定义
m_StringXXX
m_IntegerXXX
m_BoolXXX
u_Data+自定义
功能
绑定一个变量时  变量表可以动态看到那些对象绑定了这个变量
修改值时
对应绑定的动态变化
修改名称时
对应绑定的动态变化
删除变量时
对应绑定的动态变化
实现