---
title: INumericHandlerDynamic
et9: true
---

# INumericHandlerDynamic

## 方案二 动态监听

会直接发送对监听者的实体组件方法中

避免了查找等频繁复杂的操作

案例:

1. 需要监听的组件 Component : INumericHandlerDynamic<Unit, NumericChange>

泛型1: 数值组件挂在谁身上

泛型2: 固定NumericChange  写其他的无效

(固定了为什么还要写一下能不能省略)  (没办法省略 设计上需要)

1. 组件上实现System代表动态监听目标数值变化会把变化的消息直接发往对应的监听者中泛型1 = 监听的那个类 比如某个UI的component  消息来了就会直接发到这个实体类泛型2 = 数值系统挂载的父级是谁   一般是unit  player这种泛型3 = 固定NumericChange  写其他的无效当触发时 就会直接调用到对应的实例中一般用于UI刷新 等等

```C#

[ComponentOf(typeof(Unit))]
public class NumericHandlerDynamicDemoComponent : Entity, IAwake, INumericHandlerDynamic<Unit, NumericChange>
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
```

![](/images/et9/img/NiDebBmejoL6OAxUfuWcfCa5nmd.png)

## ~~精准响应~~

动态监听 精准响应重构

---

~~上述已经了解到 虽然已经动态发送到指定监听的实体中~~

~~但是无法确定这个对象是不是你要监听的对象 需要进一步判断~~

~~所以这里提供动态响应中的 精准响应~~

~~特殊举例: Unit 挂了数值组件  还挂了一个 UI对应的UI血条组件 >> UnitHPComponent 显示层的UI~~

~~此时数值组件响应了  所以NumericChange中的_ChangeEntity; //NumericComponent.Parent = 这个Unit~~

~~[NumericHandlerDynamic(SceneType.Current, NumericType.HP0, 1)]~~

~~[FriendOf(typeof(Unit))]~~

~~public class UnitHPComponent_UnitNumericChangeEventHandler_Diamond0 : NumericHandlerDynamicSystem<UnitHPComponent, Unit>~~

~~{~~

~~protected override async ETTask Run(UnitHPComponent self, Unit entity, NumericChange data)~~

~~{~~

~~await ETTask.CompletedTask;~~

~~}~~

~~}~~

~~解读上述案例:~~

~~NumericHandlerDynamicSystem其实就是全局的静态事件监听写在哪里都可以的推荐还是写到对应的CompentSystem里面~~

~~泛型1 = 响应事件的具体实体  肯定是存在的~~

~~泛型2 = 那个数值组件的父级是谁    //NumericComponent.Parent = 这个Unit~~

~~那就是这个System注册了数值改变事件 也就是当数值组件的父级是Unit时会触发~~

~~当InvakeParentLayerCount <= 0时 代表无需检查父级 就是不需要精准响应~~

~~任何Unit的数值改变都会来 则实现中需要自己对unit进行判断处理~~

~~如果你满足结构 你的响应实体是挂在Unit下的 那么相对来说UnitHPComponent的Parent就是Unit 那么就有1层Parent~~

~~如果你特性填 InvakeParentLayerCount = 1~~

~~那么此消息就无需检查到底是哪个Unit的血量改变了一定是你的 好处我就不用判断这个血量改变是不是我的Unit才刷新了会少很多次响应~~

~~(这个少响应很关键 首先是异步响应WaitAll 假设有非常多Unit单位 比如1W个 其中一个血量变了 这里就需要创建1W个Task 其中9999都是 if(是不是我这个Unit)然后retun)~~

~~(那么这多余的都是消耗掉的 如果有这个精准响应者可以减少非常多的麻烦 所以能使用精准响应时一定要用)~~

~~前提就是 UnitHPComponent的Parent就是Unit 或者parent.parent.parent 都可以只要在一条线上 填对应的parent层数即可 一般都是1~~

~~(尽可能的把这种响应与数值组件挂在同一条线上)~~

```C#

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
```
