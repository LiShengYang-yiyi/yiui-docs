# InvokeListenerCommon 4.0

**URL**: https://ai.feishu.cn/wiki/F2ycwpS0nidIXKkGqJycx6NInJF

**Parent**: Invoke

**Depth**: 4

---
InvokeListenerCommon 4.0
输入“/”快速插入内容
InvokeListenerCommon 4.0
亦亦
TODO
通用监听
全局监听 监听任意
假设打点. 有100个按钮
难道真的要对应写100个监听?
所以用监听来实现打点是不太合适的
代码块
TypeScript
namespace ET.Client
{
public static class YIUIParamVoListenerInvokeHandler
{
[EnableClass]
public class YIUIParamVoInvokeReturnTest : YIUIInvokeCommonHandler<Entity, object, object, object, object, object, ETTask>
{
protected override void InvokeParams(Entity self, params object[] paramVo)
{
Log.Error($"触发任意Invoke事件  this.InvokeType: {this.InvokeType}");
}
protected override async ETTask InvokeReturnParams(Entity self, params object[] paramVo)
{
await ETTask.CompletedTask;
Log.Error($"触发任意Invoke事件  this.InvokeType: {this.InvokeType}");
}
}
}
}