---
title: Demo
et9: true
---

# Demo

![](/images/et9/img/SHOTbLf7wo6yAzxm9SCcFcvxnCc.png)

创建与删除

![](/images/et9/img/XGpFbK6V7o5kDKxf0rPc7HXwnxg.png)

![](/images/et9/img/PZDxbaonUo6NVhxNdGpcirXTnCg.png)

根据需求 安装Demo包  看完不需要就可以删除了

## GM的监听案例

```C#
namespace ET
{
    /// <summary>
    /// GM命令监听
    /// 服务器的修改也可以响应 测试用
    /// </summary>
    [Event(SceneType.All)]
    public partial class NumericGMChangeEvent : AEvent<Scene, NumericGMChange>
    {
        protected override async ETTask Run(Scene scene, NumericGMChange args)
        {
            if (args.OwnerEntity == null || args.OwnerEntity.IsDisposed)
            {
                Log.Info($"NumericGMChange: 无目标 或已摧毁");
                return;
            }

            /*
            这里只是演示 使用的强制修改数值 实际使用时需要根据实际情况修改
            比如:  GM命令 通知修改 客户端发一个对应的修改协议到服务器 服务器收到协议后修改数值
            服务器修改过后 正式流程中的数值同步来更新客户端  而不是自己更新自己
            等等...
             */

            if (args.OwnerEntity is NumericComponent numericComponent)
            {
                numericComponent.Set(args.NumericType, args.New);
            }
            else
            {
                Log.Error($"NumericGMChange: 消息错误 OwnerEntity != NumericComponent {args.OwnerEntity.GetType()}");
            }

            await ETTask.CompletedTask;
        }
    }
}
```

## 其他监听案例

```C#
namespace ET
{
    [NumericHandler(SceneType.Current, 0)]
    public class UnitNumericChangeEventHandler_Client_All : NumericHandlerSystem<Unit>
    {
        protected override async ETTask Run(Unit self, NumericChange data)
        {
            //因为是任意值 所以你无法确定目标是什么类型的数值 这里只能获取原生值
            //如果想获取准确值可以判断后获取
            Log.Info($"客户端: 监听任意数值的改变 ID:[{self.Id}] [{data.GetNumericType()}] Odl:[{data.GetSourceValueOld()}] New:[{data.GetSourceValue()}]");
            await ETTask.CompletedTask;
        }
    }

    [NumericHandler(SceneType.Current, NumericType.Speed0)]
    public class UnitNumericChangeEventHandler_Client_Speed0 : NumericHandlerSystem<Unit>
    {
        protected override async ETTask Run(Unit self, NumericChange data)
        {
            Log.Error($"客户端: 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");

            {
                //案例 只是想说 任意Entity都可以监听到数值变化
                //下面的 NumericHandlerSystem<Scene> 就可以监听到变化
                var numeric = self.Scene().GetComponent<NumericComponent>();
                if (numeric == null)
                {
                    numeric = self.Scene().AddComponent<NumericComponent>();
                }

                numeric.Set(NumericType.Speed1, data.GetAsFloat());
            }

            await ETTask.CompletedTask;
        }
    }

    [NumericHandler(SceneType.Current, NumericType.Speed0)]
    public class UnitNumericChangeEventHandler_Scene_Speed0 : NumericHandlerSystem<Scene>
    {
        protected override async ETTask Run(Scene self, NumericChange data)
        {
            Log.Error($"客户端:场景的数值变化 监听到{self.Id} 的速度变化为{data.GetAsFloat()}");
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

## 动态监听案例

```C#
namespace ET.Client
{
    [Event(SceneType.Current)]
    public class AfterUnitCreate_HandlerDynamicDemo : AEvent<Scene, AfterUnitCreate>
    {
        protected override async ETTask Run(Scene scene, AfterUnitCreate args)
        {
            Unit unit = args.Unit;
            unit.AddComponent<NumericHandlerDynamicDemoComponent>();
            await ETTask.CompletedTask;
        }
    }

    [EntitySystemOf(typeof(NumericHandlerDynamicDemoComponent))]
    [FriendOf(typeof(NumericHandlerDynamicDemoComponent))]
    public static partial class NumericHandlerDynamicDemoComponentSystem
    {
        [EntitySystem]
        private static void Awake(this ET.NumericHandlerDynamicDemoComponent self)
        {
            self.TestValue = "测试流程 动态数值监听";
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

        [NumericHandlerDynamic(SceneType.Current, NumericType.AOI0, 1)]
        [FriendOf(typeof(NumericHandlerDynamicDemoComponent))]
        public class UnitNumericChangeEventHandler_ParentAOI0 : NumericHandlerDynamicSystem<NumericHandlerDynamicDemoComponent, Unit, NumericChange>
        {
            protected override async ETTask Run(NumericHandlerDynamicDemoComponent self, Unit entity, NumericChange data)
            {
                //精准响应
                //NumericHandlerDynamic 特性中的第三个参数 = 这个Unit是我这个componet的多少级Parent
                //则只有这个Unit改变了才会有事件通知
                //测试场景中如果有多个Unit 你就能体会出 这个监听与上面那个监听有什么不同了
                Log.Error($"收到动态数值精准监听: {self.TestValue} {data.GetNumericTypeEnum()} {data.GetAsFloat()}");
                await ETTask.CompletedTask;
            }
        }
    }
}
```

## Domo 中的 配置扩展

[案例](/et9/packages/numeric/config/examples)
