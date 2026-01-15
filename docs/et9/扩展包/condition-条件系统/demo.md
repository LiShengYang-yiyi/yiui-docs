# Demo

**URL**: https://ai.feishu.cn/wiki/ITgBwiMBUiGFpukAEGrcOSxTnUH

**Parent**: Condition 条件系统

**Depth**: 4

---
Demo
输入“/”快速插入内容
Demo
亦亦
实现条件特性
已知EConditionType
每个条件类型都要有一个实现 如果未实现会报错
以demo为例
代码块
C#
namespace ET.Client
{
[Condition(EConditionType.Demo, true, typeof(ConditionCheckLevel))]
public class Condition_Demo : ICondition
{
public async ETTask<(bool result, string errorTips)> Check(Scene scene, ConditionConfig conditionConfig, ConditionCheckValue checkValue)
{
await ETTask.CompletedTask;
var result     = false;
var checkLevel = ((ConditionCheckLevel)checkValue).Level;
var demoComponent = scene?.GetComponent&lt;CondititonDemoComponent&gt;();
if (demoComponent != null)
{
var demoValue = demoComponent.DemoValue;
switch (conditionConfig.CompareType)
{
case ECompareType.Equal:
result = demoValue == checkLevel;
break;
case ECompareType.NotEqual:
result = demoValue != checkLevel;
break;
case ECompareType.Less:
result = demoValue < checkLevel;
break;
case ECompareType.LessEqual:
result = demoValue <= checkLevel;
break;
case ECompareType.Greater:
result = demoValue > checkLevel;
break;
case ECompareType.GreaterEqual:
result = demoValue >= checkLevel;
break;
default:
result = false;
Log.Error($"没有这个比较类型：{conditionConfig.CompareType}");
break;
}
}
return result ? (true, "") : (false, string.Format(conditionConfig.Tips, checkLevel));
}
}
}