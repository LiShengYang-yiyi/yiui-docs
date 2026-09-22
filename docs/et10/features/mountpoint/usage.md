---
title: 怎么用
---

# 怎么用

> 三步：预制体上挂收集器和标记、生成键常量、运行时按键取 `Transform`。

**关键词**：MountPointCollector · MountPointMark · MountPointPresetCatalog · MountPointKeys · TryGetViewTransform · ResetMountPoint

## 1 预制体上布置

1. 在**根节点**挂 `MountPointCollector`
2. 每个要当挂点的节点挂 `MountPointMark`，填好键

一个预制体只挂一个收集器时，键表覆盖整棵子树。分片管理时可以在子节点再挂一个收集器，内层优先。

标记节点上的键有两种填法：直接用工具条切到「自定义」手填，或切到「预设」从目录里选。**不填的话组件会取节点名当键**，并在首次读取时写回——之后改名就不会跟着变了。

## 2 用预设目录统一管键

预设目录是一份 `MountPointPresetCatalog` 资产，创建入口在 `ET/YIUI/挂点预置目录` 菜单。

资产上配三样：所属包、键前缀、菜单分类，然后逐条加预置挂点。每条一个局部键加一个显示名，最终键是 `前缀_局部键`。

保存时资产会校验，下面的情况会直接拒绝保存：

| 校验项 | 要求 |
|---|---|
| 所属包 | 不能为空 |
| 键前缀 | 非空，只能用 小写字母 / 数字 / 下划线，且必须以字母开头 |
| 键前缀 | 不能和其他目录重复 |
| 菜单分类 | 不能为空 |
| 条目局部键 | 非空，且同目录内不重复 |
| 条目显示名 | 不能为空 |

校验不过的目录**整份不生成代码**，日志会指出是哪个字段。

## 3 生成键常量

保存目录时自动生成，产物是固定位置的 `MountPointKeys.g.cs`，里面是一个静态类，字段名就是条目局部键，值就是完整键。

同一个包里多个目录会合并进同一个文件。生成目录固定是 `Scripts/ModelView/Client/Generated/MountPoint/`，由所属包的根目录决定。

生成代码的作用是让键可以被编译期检查——**键的常量值要和运行时收集器里的键完全对应**，也就是「用预设模式时，预制体上的标记也要从同一个目录里选」。

## 4 取挂点

Unity 侧：

```csharp
if (collector.TryGet(MountPointKeys.weapon, out var mountPoint, false))
{
    effectRoot.SetParent(mountPoint, false);
    effectRoot.localPosition = Vector3.zero;
}
```

实体侧：

```csharp
public static bool TryGetViewTransform(Unit target, string key, out Transform transform)
{
    transform = null;
    var go = target.GetComponent<GameObjectComponent>()?.GameObject;
    if (go == null) return false;

    var collector = target.GetComponent<MountPointCollectorComponent>()
                    ?? target.AddComponent<MountPointCollectorComponent>();

    return collector.TryGet(key, out transform, false);
}
```

工程内已有的技能特效链路就是这么写的：先从表现物体上拿收集器组件，按键取挂点，再决定把特效放在世界坐标还是挂到挂点下面。

## 5 挂上去之后的两种摆法

| 摆法 | 写法 | 适用 |
|---|---|---|
| 世界坐标定位 | 取 `mountPoint.position` 后直接设世界位置 | 特效播完就散，不需要跟着动 |
| 跟随挂点 | `SetParent(mountPoint, false)` 再设局部坐标 | 需要一直贴在角色身上，比如武器拖尾 |

第二种要记得设 `worldPositionStays: false`，否则缩放和位置会被 Unity 重新换算一遍。

## 6 动态换模

换表现物体后，挂点得重新绑：

```csharp
collector.ResetMountPoint(newRoot);
```

**它只换根节点引用，不重建键表。** 新根节点必须自带配好的收集器，且其子标记在 `Awake` 时已经登记过。手工拼出来的节点不会自动登记。

## 7 编辑器工具

挂点在 YIUI 工具菜单下有一项，用来管理预置目录。

键字段在 Inspector 里用下拉选，选到不在目录里的值时会有校验提示——这是用来挡手填错误的。

## 真源

- **标记与键的读写**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointMark.cs`
- **收集与查找**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointCollector.cs`
- **目录资产与代码生成**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointPresetCatalog.cs`
- **实体侧三个扩展方法**<br>`Packages/cn.etetet.yiuimountpoint/Scripts/HotfixView/Client/MountPointCollectorComponentSystem.cs`

## 源码落点

- **一套真实的挂点配置**<br>`Assets/GameRes/LOLHero/LOL_Hero_001.prefab` 起的几个角色预制体
- **真实调用链**<br>`Packages/cn.etetet.statesync/Scripts/HotfixView/Client/YIUIBTSkill/Presentation/YIUIBTSkillEffectTransformHelper.cs`
- **挂点枚举常量**<br>`Packages/cn.etetet.statesync/Scripts/ModelView/Client/YIUIBTSkill/Action/Presentation/YIUIBTSkillEffectCreateAction.cs`
- **键字段的特性定义**<br>`Scripts/Core/Share/MountPointKeyAttribute.cs`

## 下一步

→ [排查](./troubleshooting)
