---
title: 公共组件Common
et9: true
---

# 公共组件Common

## 定义

如:有一个货币组件   在主界面也会显示这个货币组件    在其他界面比如 商店 也会显示这个货币组件

这种通用 会被复用的组件 统称为公共组件

## 创建

不管你是要动态创建一个公共组件 还是 这个公共组件提前放到某个组件内

都需要先有这个公共组件的声明 要先有这么个类(预制体)

### 手动创建

跟平时一样 通用的预制体相同  只需要在根节点挂载 CDE 脚本 则这个预制体就是YIUI公共组件

### 自动创建

任意节点下 右键创建 Common

![](/images/et9/img/SHTHbHZJ7oMlZExsAq9c5n7hnyh.png)

修改创建的obj 名称  建议: XX Item, XX Common, XX Cell

然后拖入到对应文件夹 创建成为预制体

::: tip 😊
公共节点使用view也是可以的  不过公共的view 无法自动触发open 生命周期
所以建议 公共组件 使用 Common
:::

### 总结要求

::: tip 😊
1: 是一个预制体
2: 名称不能是 XX Panel   (XX View 是可以的 但是无法自动触发Open生命周期)
3: 然后这个预制体的根节点有 CDE脚本  自动生成即可
:::

view的open生命周期是由Panel自动调用的

当然你如果使用一个公共界面用View做想调用Open生命周期也是可以的

需要手动调用 参考panel中的自己发送消息就可以了

这里只是说明一下可以调用到 万一你的这个view在某个panel中还想公共呢

也不是不可以做到   不了解的情况下还是不建议搞这么复杂

### 生成

创建完毕后 对应的公共组件点击生成   生成对应的类(脚本)

## 静态公共组件

### 关联

举例:

有个名为BattleSkillItem的公共组件

![](/images/et9/img/SWLRb44F7omRnbxgQ5kcoiHKnWe.png)

拖入到目标预制体下

比如当前这个预制体是 BattleUnitInfoItem  又关联了这个BattleSkillItem

![](/images/et9/img/PsS4bmn14ofHLxxhA8uccwclndd.png)

这里的名称不一定要叫做 BattleSkillItem (预制体嵌套的预制体名称可以不与源文件名称相同)

可以是你自定义的任意名称 这个名称最后就是类中会声明的名称 如下

![](/images/et9/img/Hq2JbZ7DMoNl1zxicphcHORcnRe.png)

::: info 📌
**规则: 所有公共组件 不能同名  这个同名不是预制体的名称 而是拖入到关联里的自定义的名称**
:::

u_UI  = 就是所有公共组件的前缀名称

u_Com = 组件

u_Data = 数据

u_Evene = 事件

### 生成

关联好过后 点生成 就会看到

编辑器时 所有公共组件 会搜集到目标组件

![](/images/et9/img/Xgf8bqQFgoR4JlxRVuZcDKc4nqg.png)

### 使用

关联好生成过后 会自动赋值 就可以直接使用了

![](/images/et9/img/KxT3blyRUowVzEx7ykEcUMaPnOg.png)

::: tip ❤️
可以组件嵌套组件嵌套...
一个组件可以有多个公共组件  也可以有多个同类型公共组件
更多公共组件与当前组件的生命周期关系 等等 请看源码 或提问
:::

## 动态公共组件

使用代码动态创建一个YIUI

使用 YIUIFactory 中的方法 动态创建

![](/images/et9/img/KlfCbpI2uoCA3rx8NGBcVluwnyf.png)

### 创建

更多API 请查看源码

提供丰富的 根据各种参数动态创建YIUI组件的方法

```C#
public static async ETTask<T> InstantiateAsync<T>(Entity parentEntity, RectTransform parent = null) where T : Entity
{
    ...
}

public static async ETTask<T> InstantiateAsync<T>(YIUIBindVo vo, Entity parentEntity, RectTransform parent = null) where T : Entity
{
    ...
}

public static async ETTask<Entity> InstantiateAsync(YIUIBindVo vo, Entity parentEntity, RectTransform parent = null)
{
    ...
}

public static async ETTask<Entity> InstantiateAsync(Type uiType, Entity parentEntity, RectTransform parent = null)
{
    ...
}
```

### 案例

动态创建了一个 ItemComponent 组件

创建时传入父级对象 使用的是 self 当前组件

拿到这个对象可以根据自己需求使用

```C#

var component = await YIUIFactory.InstantiateAsync<ItemComponent>(self);
//var 动态创建的组件 = await YIUIFactory.InstantiateAsync<动态组件的泛型类型>(父级entity);

```

### 动态组件的摧毁

#### ET

##### 跟随父级自动移除

因为创建组件时 必须有父级entity  所以可以跟随父级摧毁时一同摧毁

(比如在一个大的Panel下你动态创建了一个item

不去维护他的摧毁 当panel被摧毁时 这个动态创建的Item 也会被摧毁)

##### 手动移除

item.UIBase.Dispose();

千万不要直接 item.Dispose(); 这个释放的只是当前的UI组件 并非Obj

具体原因请了解YIUI组件结构就知道为什么了

##### GameObject.Destroy()

不推荐

如果你通过某种方式拿到了动态创建的 gameObject对象

直接使用unity的destroy  也是可以移除组件的

因为unity的Destroy与entity的Dispose 有相互绑定

但是不推荐这样使用

#### 通用

##### GameObject.Destroy()

UnityEngine.Object.Destroy(ui.OwnerGameObject);
