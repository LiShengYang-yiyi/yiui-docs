# Demo

 
已知EConditionType 
 
![Image](/images/ITgBwiMBUiGFpukAEGrcOSxTnUH_1_c9b9e238.png)
 每个条件类型都要有一个实现 如果未实现会报错 
 以demo为例 
 代码块 
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