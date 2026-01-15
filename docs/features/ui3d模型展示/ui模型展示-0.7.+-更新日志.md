# UI模型展示 0.7.+ 更新日志

**URL**: https://ai.feishu.cn/wiki/BuplwDvgli9pUQkiD2Hc0f30n4f

**Parent**: UI3D模型展示

**Depth**: 3

---
UI模型展示 0.7.+ 更新日志
输入“/”快速插入内容
UI模型展示 0.7.+ 更新日志
亦亦
点击事件重构
不使用Invoke 改为 EntitySystem
由
Invoke 2.0
修改引起的优化
前: 之前的点击事件是Invoke实现的 需要提前设置点击的事件名称
一个组件下多个3D模型的点击  可以通过实现多个不同的事件来区分
后: 改为事件  开启点击改为 bool 传入是否要开启点击即可
一个组件下多个3D模型的点击  通过display来区分