# Luban Invoke实现

**URL**: https://ai.feishu.cn/wiki/EAkQwKPQkiuK1lkSO6Zcggewnnu

**Parent**: Luban 配置解决方案

**Depth**: 4

---
Luban Invoke实现
输入“/”快速插入内容
Luban Invoke实现
亦亦
在ConfigLoader中
有2个Invoke事件 需要实现
Luban包 在Gen包中有默认实现
代码块
C#
var configBytes = await EventSystem.Instance.Invoke<LubanGetAllConfigBytes, ETTask<Dictionary<Type, ByteBuf>>>(new LubanGetAllConfigBytes());
var oneConfigBytes = await EventSystem.Instance.Invoke<LubanGetOneConfigBytes, ETTask&lt;ByteBuf&gt;>(getOneConfigBytes);
Luban包 在Gen包中有默认实现
如果你使用的是官方源生提供的资源管理器 那不需要修改任何代码
如果你的项目有自己实现的资源管理器则需要自行实现
具体可以参考脚本 也可在此基础上直接修改
一个客户端用,一个服务器用
49%
51%
主要因为客户端使用了 官方 ResourcesComponent 进行加载
官方的ResourcesComponent 属于yooasset资源管理器
如果你自己的项目有自己资源管理器则需要对应修改
本来最开始时 这2个脚本是在luban包中的
考虑到通用性 有人的项目可能使用的不是官方资源管理器
所以吧这2个脚本移动到了gen包中 方便自定义修改
自定义同步
因为分包的特殊性 又因为以后我只能更新luban包
所以这里会提供一个同步按钮 你更新过后可以根据需求同步一次invoke