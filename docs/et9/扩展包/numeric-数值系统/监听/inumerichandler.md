# INumericHandler

**URL**: https://ai.feishu.cn/wiki/KZuDwdrl9iAvGdkftixcKolpnBe

**Parent**: 监听

**Depth**: 5

---
INumericHandler
输入“/”快速插入内容
INumericHandler
亦亦
方案一 全局监听
注意区分发送方与监听方的 SceneType 要对应
具体请参考ET 事件系统
代码块
C#
namespace ET
{
[NumericHandler(SceneType.Current, NumericType.Speed0)]
public class UnitNumericChangeEventHandler_Speed0 : NumericHandlerSystem&lt;Unit&gt;
{
protected override async ETTask Run(Unit self, NumericChange data)
{
Log.Error($"客户端: 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
await ETTask.CompletedTask;
}
}
[NumericHandler(SceneType.Map, NumericType.Speed0)]
public class UnitNumericChangeEventHandler_Server_Speed0 : NumericHandlerSystem&lt;Unit&gt;
{
protected override async ETTask Run(Unit self, NumericChange data)
{
Log.Error($"服务器: 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
await ETTask.CompletedTask;
}
}
}
扩展
ET原生方案  原生只能使用Unit
本版本 可把数值组件挂在任意组件上
则任意组件都可拥有数值的功能
可监听任意组件
假设你的数值组件挂在场景上  则 场景的数值被修改时就会有消息
代码块
C#
[NumericHandler(SceneType.Current, NumericType.Speed0)]
public class UnitNumericChangeEventHandler_Scene_Speed0 : NumericHandlerSystem&lt;Scene&gt;
{
protected override async ETTask Run(Scene self, NumericChange data)
{
Log.Error($"客户端:场景的数值变化 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
await ETTask.CompletedTask;
}
}