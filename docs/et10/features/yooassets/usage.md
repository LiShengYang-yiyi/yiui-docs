---
title: 加载与图集
---

# 加载与图集

> 业务侧几乎不直接调这个包 —— 界面、图集、音频都通过框架的加载门面走。要自己加载时，用两种重载：带包名和不带包名。

**关键词**：LoadAssetAsync · InstantiateGameObjectAsync · LoadAtlasAsync · GetSpriteAsync · ReleaseSprite · GetAssetInfo · VerifyAssetValidity

## 1 业务侧怎么拿到资源

绝大多数情况不需要写加载代码：

```csharp
// 加载并实例化一个界面/预制体
GameObject go = await YIUIFactory.InstantiateGameObjectAsync(scene, "SOME_RES");

// 按类型加载一个资源
MyAsset asset = await yiuiLoad.LoadAssetAsync<MyAsset>("SOME_RES");
```

框架里各处的对应关系：

| 使用者 | 走的方法 |
|---|---|
| 界面工厂 | 加载并实例化 |
| 图片绑定 | 加载精灵 |
| 原始图绑定 | 加载贴图 |
| 音频 | 加载剪辑 |
| 视频 | 通用加载 |

## 2 两种重载的区别

| 重载 | 传入 | 实际行为 |
|---|---|---|
| 带包名 | 包名 + 资源名 | ⭐ **包名参数当前被忽略**，一律用默认包 |
| 不带包名 | 只传资源名 | 内部把包名填空串，等价于用默认包 |

**结论：现在只有默认包一条路。** 要支持多包必须改实现，光传包名不生效。

## 3 校验资源名

校验委托落到 YooAsset 的「地址是否存在」判断。

⚠️ **只有编辑器里才会走校验** —— 非编辑器构建下，资源名写错不会在入口处报错，而是拿到空对象。所以资源名错误在真机上的表现通常是「静默不显示」。

## 4 图集与精灵

图集不是按需建的，是**启动时整份加载**：

```csharp
await spriteComponent.LoadAtlasAsync();          // 读图集数据，建立 图集名→精灵名 映射
Sprite sprite = await spriteComponent.GetSpriteAsync("SOME_SPRITE");
spriteComponent.ReleaseSprite(sprite);
```

| 方法 | 作用 |
|---|---|
| `LoadAtlasAsync` | 加载图集数据资源，建立映射表 |
| `GetSpriteAtlasPath` | 查某个精灵属于哪张图集 |
| `GetSpriteAsync` | 取精灵，命中图集则加载图集 |
| `ReleaseSprite` | 释放 |

两个实现细节：

1. **实际持有的是图集对象，不是单个精灵** —— 取精灵时会加载它所属的整张图集并登记
2. **精灵名的后缀被去掉过** —— 生成映射表时清掉了克隆后缀，所以按资源名查是干净的

映射表为空时会退化成单图加载并报错，说明图集数据没有重新生成。

## 5 信息查询与释放

```csharp
ResourcePackage pkg = component.GetPackage();
AssetInfo info = component.GetAssetInfo("SOME_RES", typeof(Texture2D));
AssetInfo byGuid = component.GetAssetInfoByGUID("GUID...");
```

释放有两条路：

| 入口 | 行为 |
|---|---|
| 按句柄号释放 | 单个归还 |
| 整批释放 | 组件销毁时逐个归还并清空句柄表 |

加载并实例化得到的实例会**自动挂释放标记**，节点销毁时归还自身的资源 —— 业务通常不用手动释放。

## 6 与调用系统的接合

框架侧对资源的调用都走 `YIUIInvoke`，这个包注册了对应的实现：

| 实现类 | 处理什么 |
|---|---|
| 资源包相关 Handler | 初始化与资源包获取 |
| 加载 Handler | 通用加载、贴图、精灵 |
| 释放 Handler | 精灵释放 |
| 资源就绪监听 | 初始化完成后加载图集 |

直接改加载行为时，改这几个 Handler 比改框架代码更合适。

## 7 异步与实体安全

包内所有异步方法统一用「引用重取」的写法：

```
EntityRef<组件类型> selfRef = self;   // 先存引用
... await ...
self = selfRef;                       // await 之后重取
```

自己写扩展时要沿用这个模式，否则 await 之后访问的可能是已销毁的实体。

## 真源

- **图集与精灵逻辑**<br>`Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/System/YIUIYooAssetsSpriteComponentSystem.cs`
- **加载类 Handler**<br>`Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/Event/YIUIInvokeLoadHandler.cs`
- **预制体实例化入口**<br>`Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/Helper/YIUIFactory_YooAsset.cs`
- **框架加载门面与句柄计数**<br>`Packages/cn.etetet.yiuiframework/Scripts/HotfixView/Client/YIUILoad/`

## 源码落点

- **加载主流程与句柄登记**<br>`Scripts/HotfixView/Client/System/YIUIYooAssetsLoadComponentSystem.cs`
- **图集数据结构**<br>`Runtime/Atlas/YIUIAtlasData.cs`
- **图集常量**<br>`Runtime/Atlas/YIUIConstAsset_Atlas.cs`
- **释放 Handler**<br>`Scripts/HotfixView/Client/Event/YIUIInvokeReleaseHandler.cs`
- **单名重载**<br>`Scripts/HotfixView/Client/System/YIUILoadComponentSystem_YooAsset.cs`

## 下一步

→ [资源收集与构建](./collect)
