# INumericHandlerDynamic

**URL**: https://ai.feishu.cn/wiki/CsmywtNPKihPY5kuyuecCkSsnMc

**Parent**: 监听

**Depth**: 5

---
INumericHandlerDynamic
输入“/”快速插入内容
INumericHandlerDynamic
亦亦
方案二 动态监听
会直接发送对监听者的实体组件方法中
避免了查找等频繁复杂的操作
案例:
1.
需要监听的组件 Component : INumericHandlerDynamic`<Unit, NumericChange>`
泛型1: 数值组件挂在谁身上
泛型2: 固定NumericChange  写其他的无效
(固定了为什么还要写一下能不能省略)  (没办法省略 设计上需要)
2.
组件上实现System
代表动态监听目标数值变化
会把变化的消息直接发往对应的监听者中
泛型1 = 监听的那个类 比如某个UI的component  消息来了就会直接发到这个实体类
泛型2 = 数值系统挂载的父级是谁   一般是unit  player这种
泛型3 = 固定NumericChange  写其他的无效
当触发时 就会直接调用到对应的实例中
一般用于UI刷新 等等
代码块
C#
[ComponentOf(typeof(Unit))]
public class NumericHandlerDynamicDemoComponent : Entity, IAwake, INumericHandlerDynamic`<Unit, NumericChange>`
{
}
[NumericHandlerDynamic(SceneType.Current, NumericType.AOI0)]
[FriendOf(typeof(NumericHandlerDynamicDemoComponent))]
public class UnitNumericChangeEventHandler_AOI0 : NumericHandlerDynamicSystem<NumericHandlerDynamicDemoComponent, Unit, NumericChange>
{
protected override async ETTask Run(NumericHandlerDynamicDemoComponent self, Unit entity, NumericChange data)
{
//注意这里来的动态消息是 任意Unit 都会来
//如果你想要监听指定的某个Unit
//1 提前存一下然后判断2个是不是相同 如果是则XX
//2 使用动态监听中的定向监听功能
Log.Error($"收到动态数值监听: {self.TestValue} {data.GetNumericTypeEnum()} {data.GetAsFloat()}");
await ETTask.CompletedTask;
}
}
//监听0 则代表任意数值的变化都监听
//后触发监听 数值0的所有监听 0 = 所有数值
//注意监听所有数据类型的 仅适合做刷新等操作 不适合做存储什么的操作
//反正注意与监听指定数值类型的不要冲突
[NumericHandlerDynamic(SceneType.Current, 0)]