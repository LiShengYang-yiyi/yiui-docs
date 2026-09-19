---
title: InvokeListenerCommon 4.0
et9: true
---

# InvokeListenerCommon 4.0

## TODO

## 通用监听

全局监听 监听任意

假设打点. 有100个按钮

难道真的要对应写100个监听?

所以用监听来实现打点是不太合适的

![](/images/et9/img/Mu97bqFqKocTdex9Mw9ceMSZn0S.png)

![](/images/et9/img/YcPNbUhyNoY8Cwx9TXbcnwuMnVb.png)

```TypeScript
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
```
