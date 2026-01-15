# YIUIChild 事件扩展

**URL**: https://ai.feishu.cn/wiki/Q2dLwzJdBiLb3AkvNU8c9GlKn8d

**Parent**: 小功能

**Depth**: 4

---
YIUIChild 事件扩展
输入“/”快速插入内容
YIUIChild 事件扩展
亦亦
事件扩展 可快速调用子类的事件
常见需求
有一个主界面
下面有10个View界面
假设这10个View 都需要打开时调用一个初始化方法
但是又不能在默认的YIUIInitialize中初始化 因为有些数据可能没有
常规做法 就是 每个界面都自己造了一个初始化方法
然后在主界面open方法里面 逐个的调用对应界面的初始化方法
这样行不行呢  当然是可以的
但是不优雅  每新增 或者 修改 删除 就需要来改这里的代码
而且每次都要自己造个方法不方便
针对这种情况 进行了扩展
使用
await self.UIBase.OpenAllChild()
则主界面打开后会调用所有子类
详情查看更新代码  YIUIChildSystem_Event
注
并非只有界面才可以调用
任意YIUI 都可以调用自己子类的任意方法
具体更多的使用场景根据具体案例分析