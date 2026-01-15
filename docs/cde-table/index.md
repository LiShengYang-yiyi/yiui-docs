# CDE Table

**URL**: https://ai.feishu.cn/wiki/NiigwanvviFiSjkweU5cvvkOnFc

**Parent**: YIUI

**Depth**: 1

---
CDE Table
输入“/”快速插入内容
CDE Table
亦亦
视频介绍
🌟
点赞支持 一键三连
CDE 是什么
C  =
Component Table
D  =
Data Table
E  =
Event Table
目的
写 UI 逻辑时  尽可能少的去关注 UI 是什么 我需要操作那个 UI
我们更多的应该注重逻辑 而不关心 UI 具体绑定了什么
比如在给一个文本 修改文字时   我们不需要去 get 这个组件然后知道他修改文本的 API  因为这些都是固定的操作 我们应该注重于 直接修改字符串数据   对应的文本自动更新  我完全不关心你把这个字符串拿去干什么
还有一对多功能
点击事件同理  我只需要注册 XX 事件 回调是什么  至于你在哪里调用我这个事件 我并不需要关心
抛弃找各种点击的组件  然后在给组件添加对应的事件这样的流程
我只关心我需要操作的数据 与 回调
最终达到  数据 与 UI 分离的目的
某种意义上的 因为分离 所以 数据 可以一对多 等等各种好处
例子：
文本绑定的 Text 改 TMP 并不需要改代码
只需要扩展对应的 TMP  修改绑定即可
Component
UI 各种组件的收集器
因为直接使用的是 Unity.Component
使用 Unity 预制体 序列化
所以可以直接访问到对应的组件且没有 get 消耗 提升性能
Data
在整个 UI 逻辑中 我们会定义各种字段
int
float
bool