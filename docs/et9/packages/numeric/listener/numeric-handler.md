---
title: INumericHandler
et9: true
---

# INumericHandler

## 方案一 全局监听

注意区分发送方与监听方的 SceneType 要对应
具体请参考ET 事件系统

```C#
namespace ET
{
    [NumericHandler(SceneType.Current, NumericType.Speed0)]
    public class UnitNumericChangeEventHandler_Speed0 : NumericHandlerSystem<Unit>
    {
        protected override async ETTask Run(Unit self, NumericChange data)
        {
            Log.Error($"客户端: 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
            await ETTask.CompletedTask;
        }
    }

    [NumericHandler(SceneType.Map, NumericType.Speed0)]
    public class UnitNumericChangeEventHandler_Server_Speed0 : NumericHandlerSystem<Unit>
    {
        protected override async ETTask Run(Unit self, NumericChange data)
        {
            Log.Error($"服务器: 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
            await ETTask.CompletedTask;
        }
    }
}
```

![](/images/et9/img/A8ixbVR7royQemxv7wycJ3lbnpb.png)

## 扩展

ET原生方案  原生只能使用Unit

本版本 可把数值组件挂在任意组件上

则任意组件都可拥有数值的功能

可监听任意组件

假设你的数值组件挂在场景上  则 场景的数值被修改时就会有消息

```C#
[NumericHandler(SceneType.Current, NumericType.Speed0)]
public class UnitNumericChangeEventHandler_Scene_Speed0 : NumericHandlerSystem<Scene>
{
    protected override async ETTask Run(Scene self, NumericChange data)
    {
        Log.Error($"客户端:场景的数值变化 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
        await ETTask.CompletedTask;
    }
}
```

![](/images/et9/img/OgOMb5hfLow4NYxVrfvcNqdgnPh.png)

![](/images/et9/img/QbIfbXhIGoVJPkxttnncjYU8nnd.png)

## ALL

额外提供 所有监听的功能

监听ID = 0 = 监听任意数值的改变

触发循序 先触发指定 然后触发所有

```C#
[NumericHandler(SceneType.Current, 0)]
public class UnitNumericChangeEventHandler_Client_All : NumericHandlerSystem<Unit>
{
    protected override async ETTask Run(Unit self, NumericChange data)
    {
        Log.Error($"客户端: 监听任意数值的改变 ID:[{self.Id}] [{data.GetNumericType()}] Odl:[{data.GetAsFloatOld()}] New:[{data.GetAsFloat()}]");
        await ETTask.CompletedTask;
    }
}
```

注意识别ID  因为 小ID的改变 必定会导致结果的改变 所以通常成长型数值的全监听每次都是触发2次

ID是不同的注意识别 别说是BUG.....

![](/images/et9/img/Og1dbeDbCovvZ7xZQS3c19nSnoT.png)
