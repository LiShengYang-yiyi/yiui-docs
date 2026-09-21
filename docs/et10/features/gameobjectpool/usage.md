---
title: 怎么用
---

# 怎么用

> 只有两个动作：取、还。其余交给自动回收。

**关键词**：Get · Put · YIUIGameObjectPoolAutoRelease · YIUIGameObjectPoolTrigger · 自动回收

## 1 取与还

```csharp
// 取
var go = await YIUIGameObjectPool.Inst.Get(resName, parent);

// 还
YIUIGameObjectPool.Inst?.Put(go);
```

真实签名：

```csharp
public async ETTask<GameObject> Get(string resName, Transform parent = null);
public bool Put(GameObject obj);
public IYIUIGameObjectPoolSettingsConfig GetSettings(string resName);
```

要点：

| 点 | 说明 |
|---|---|
| `Get` 是异步的 | 池里没有可用实例时会走实例化，必然跨帧 |
| `Get` 可能返回 null | 资源加载失败时打 Error 后返回 null，**调用方必须判空** |
| `parent` 传了会重置变换 | 自动把 `localPosition` 归零、`localRotation` 复位、`localScale` 归一 |
| `Put` 返回 bool | `false` 不代表对象还在，见下一节 |

## 2 `Put` 返回值的含义

`Put` 有三种结果，都返回 `bool`，但含义不同：

| 情况 | 返回 | 对象实际状态 |
|---|---|---|
| 正常归还 | `true` | 进池，之后可复用 |
| 传空对象 | `false` | 什么都没发生 |
| 不是这个池里的对象 | `false` | **被直接销毁了** |
| 游戏正在退出 | `true` | 没归还，也没销毁 |

所以**不能靠返回值判断对象是否还活着**。业务侧的正确做法是「还完就当引用失效」，不要再持有。

## 3 自动回收组件

池在实例化对象后会自动给它挂一个 `YIUIGameObjectPoolAutoRelease`。这个组件不需要手动加，也不出现在 AddComponent 菜单里。

它的作用只有一个：**对象被外部直接销毁时，通知池把归属记录清掉，并通知加载层释放**。

含义：

- 你 `Destroy` 一个池对象不会让池错乱
- 但也不推荐这么做 —— 该走 `Put`

## 4 组件式用法

不想写代码取放时，可以在预制体上挂 `YIUIGameObjectPoolTrigger`：

| 时机 | 行为 |
|---|---|
| `OnEnable` | 取一个对象 |
| `OnDisable` | 延时一帧归还 |
| `OnDestroy` | 立即归还 |

另外支持位置、旋转、缩放的偏移配置。

约束：资源名字段是只读的，**运行时只能通过 `ResetRes(resName)` 写入**。所以在编辑器里配好才是常规用法。

## 5 谁在用它

| 使用方 | 场景 |
|---|---|
| 红点动态绑定 | 动态红点对象（`RedDotMgr_Dynamic.cs`） |
| 技能表现 | 技能特效的创建与回收 |

红点那处是最典型的用法：按 `showType` 查出资源名 → `Get` → 挂到父节点 → 用完 `Put`；父节点中途丢了、或对象缺少必要的控制组件时立刻 `Put` 回滚。

**循环列表不用这个池。** 它的 Item 复用靠自带的 Item 池，两套机制独立。

## 6 典型写法

```csharp
var go = await YIUIGameObjectPool.Inst.Get(resName, parent);
if (go == null)
{
    // 资源没加载到，池已经打过日志
    return;
}

// ... 使用 go ...

YIUIGameObjectPool.Inst?.Put(go);
// 之后不要再持有 go 的引用
```

需要在多处共享同一个池对象时，**引用计数要业务自己做**。池只管「借出去的还没还」，不判断「还有没有别人在用」。

## 7 什么时候该用这个池

| 场景 | 建议 |
|---|---|
| 同一个小物件被反复创建销毁 | 用，配好 `Timeout` |
| 红点这类动态挂件 | 用，配合动态绑定 |
| 一次性、生命周期很长的对象 | 不用，池只会多一层间接 |
| 列表项 | 不用，走循环列表自带的池 |
| 界面本体 | 不用，走 UIMgr |

判据：**「同一个资源名会被反复取用」才值得进池**。只用一次的对象进池只是徒增开销。

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPool.cs` | `Get` / `Put` 实现 |
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPoolTrigger.cs` | 组件式取放 |
| `Packages/cn.etetet.yiuigameobjectpool/Runtime/GameObjectPool/YIUIGameObjectPoolAutoRelease.cs` | 销毁兜底 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 取对象的完整分支 | `Runtime/GameObjectPool/YIUIAutoRecycleAsyncObjectPool.cs` 的 `Get` |
| 归还的三种结果 | 同文件的 `Put` |
| 红点的真实调用 | `Packages/cn.etetet.yiuireddot/Runtime/Mgr/RedDotMgr_Dynamic.cs` |
| 技能特效的真实调用 | `Packages/cn.etetet.statesync/Scripts/HotfixView/Client/YIUIBTSkill/Presentation/` |
| 配置生成类 | `CodeMode/Model/Client/LubanGen/Config/GameObjectPoolSettingsConfig.cs` |

## 下一步

→ [排查](./troubleshooting)
