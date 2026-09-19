---
title: Demo
et9: true
---

# Demo

## 实现条件特性

已知EConditionType

![](/images/et9/img/M5nsb5m9eoeEeFxOYZ4cMbC8nYb.png)

## 每个条件类型都要有一个实现 如果未实现会报错

以demo为例

```C#
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

            var demoComponent = scene?.GetComponent<CondititonDemoComponent>();
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
```

## ConditionAttribute

```C#
using System;

namespace ET
{
    /// <summary>
    /// 条件特性
    /// </summary>
    public class ConditionAttribute : BaseAttribute
    {
        //条件类型
        public EConditionType ConditionType;

        //这个条件是有变化通知的
        public bool Listener;

        //条件所需参数类型
        public Type CheckValueType;

        public ConditionAttribute(EConditionType conditionType, bool listener, Type checkValueType)
        {
            this.ConditionType  = conditionType;
            this.Listener       = listener;
            this.CheckValueType = checkValueType;
        }
    }
}
```

## 特性

[Condition(EConditionType.Demo, true, typeof(ConditionCheckLevel))]

全局唯一 一个条件类型只允许存在一个

如果你想实现多个可以考虑换个类型就好了

## Demo 条件监听

```C#
using System;
using System.Collections.Generic;

namespace ET.Client
{
    /// <summary>
    /// Desc    条件测试
    /// </summary>
    [FriendOf(typeof(CondititonDemoComponent))]
    [EntitySystemOf(typeof(CondititonDemoComponent))]
    public static partial class CondititonDemoComponentSystem
    {
        #region ObjectSystem

        [EntitySystem]
        private static void Awake(this CondititonDemoComponent self)
        {
            ConditionMgr.Instance.AddCheckConditionGroupListener(self, "ConditionResult", 1);
            self.m_TimerId = self.Root().GetComponent<TimerComponent>().NewRepeatedTimer(2000, ConditionDemoTimerInvokeType.ConditionDemoTimerInvoke, self);
        }

        [YIUIInvoke]
        private static void ConditionResult(this CondititonDemoComponent self, bool arg1, string arg2)
        {
            Log.Error($"条件判断: 结果:{arg1}  失败原因:{arg2}");
        }

        [EntitySystem]
        private static void Destroy(this CondititonDemoComponent self)
        {
            self?.Root()?.GetComponent<TimerComponent>()?.Remove(ref self.m_TimerId);
        }

        [Invoke(ConditionDemoTimerInvokeType.ConditionDemoTimerInvoke)]
        public class TimerInvoke_ConditionDemo : ATimer<CondititonDemoComponent>
        {
            protected override void Run(CondititonDemoComponent self)
            {
                self.DemoValue = (self.DemoValue + 1) % 3;
                Log.Info($"条件demo改变测试:  {self.DemoValue}");
                ConditionMgr.Instance.TriggerListener(EConditionType.Demo);
            }
        }

        #endregion
    }
}
```

使用的是YIUIInvoke

非委托 所以可热重载

想具体了解的看 [Invoke](/et9/features/builtin/invoke/)

这里的监听参数是

1. 条件的结果
2. 如果失败原因是什么
