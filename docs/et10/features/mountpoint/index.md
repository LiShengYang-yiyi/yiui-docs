---
title: UI 挂点
---

# UI 挂点

> 挂点把预制体里的关键节点用一个字符串键登记起来，运行时按键取到 `Transform`。位置跟着名字走，改层级、改节点名都不影响查找。

**关键词**：yiuimountpoint · MountPointCollector · MountPointMark · MountPointCollectorComponent · MountPointPresetCatalog · TryGet

## 1 定位与边界

管两件事：

- 在预制体上标记「这是一个挂点」，并给每个挂点一个稳定键
- 运行时按键取到 `Transform`，用来挂特效、挂模型、挂飘字

不管两件事：

- 挂上去之后的事情 —— 挂点只交还 `Transform`，不负责内容
- 坐标换算 —— 世界坐标还是局部坐标由调用方决定

**和普通子节点定位的差别**：普通写法靠层级路径、字段引用或索引找节点，节点改名、改层级、改顺序就失效。挂点用字符串键查找，节点叫什么、排第几都不影响。

作用范围由**最近的父级收集器**决定。也就是说一个预制体里可以有多个收集器，各管一片。

## 2 两个组件配对使用

| 组件 | 挂在哪 | 作用 |
|---|---|---|
| `MountPointCollector` | 根节点 | 收集器，持有键到 `Transform` 的表 |
| `MountPointMark` | 每个挂点节点 | 标记，`Awake` 时把自己登记到父级收集器 |

菜单路径是 `ET/YIUI/挂点标记` 与 `ET/YIUI/挂点收集器`。

标记节点上如果没填键，就用**节点自己的名字**当键。首次读取时会把这个名字写回去，之后改名不会再跟着变。**建议显式填键，不要依赖节点名。**

## 3 键是怎么定的

两种输入模式，组件上用工具条切换：

| 模式 | 键从哪来 |
|---|---|
| 预设（默认） | 从挂点预置目录里选，最终键是 `前缀_编号` |
| 自定义 | 直接填字符串 |

预置目录是一个 `MountPointPresetCatalog` 资产，里面维护若干条目：每条有一个局部键和一个显示名。同一个资产还有一个全局键前缀。

预置模式的键 = `{资产前缀}_{条目局部键}`。好处是同一个资产被多个预制体引用时，键天然不会乱。

**键在写入和查询两侧都会做归一**：去掉空格、转小写。所以 `Head` 和 `head` 查到的是同一个挂点。别把它当命名规范使——那只是一层容错。

## 4 取挂点

Unity 侧直接找收集器：

```csharp
if (collector.TryGet("head", out var mountPoint, false))
{
    effect.SetParent(mountPoint, false);
}
```

实体侧用组件扩展：

```csharp
var collector = entity.GetComponent<MountPointCollectorComponent>();
if (collector == null) return;

if (!collector.TryGet("head", out var mountPoint, false))
{
    // 取不到
}
```

坐标语义由调用方定，两种都行：

- 世界坐标：`position = mountPoint.position;`
- 跟随挂点：`transform.SetParent(mountPoint, false);` 再设局部坐标

## 5 取不到会返回什么

**取不到键时，`out` 参数拿到的是收集器根节点，不是 `null`。**

这是最容易踩的一条：只判断 `mountPoint != null` 会静默降级到根节点，特效出现在整个模型的原点，而不是报错。

正确做法是**判断返回值**：

```csharp
if (!collector.TryGet(key, out var mountPoint, false)) { /* 真的取不到 */ }
```

第三个参数控制要不要打错误日志。批量取挂点时把它设为 `false`，避免日志刷屏；排查阶段设成 `true` 更直观。

## 6 实体侧组件做什么

`MountPointCollectorComponent` 是挂点和 ET 实体之间的桥：

| 成员 | 作用 |
|---|---|
| `TryGet` | 按键取 `Transform` |
| `ResetMountPoint(root)` | 换一个根节点 |
| `RefreshMountPoint()` | 按当前根节点重新找收集器 |

它挂在有表现物体的实体上，创建时自动找到根节点的收集器并缓存。

**`ResetMountPoint` / `RefreshMountPoint` 只重绑引用，不重建键表。** 动态换模之后，新根节点必须自带配置好的收集器。

## 7 硬约束

- 标记必须处于某个收集器的子树下。不在的话运行时报错，且这个标记不登记。
- **同一个收集器下键不能重复。** 重复时保留先注册的那个，后来的被丢弃并打错误日志。
- 一个标记不能同时绑到两个收集器，出现这种情况会报错并切换绑定。
- 嵌套收集器时，内层收集器扫描到不属于自己的标记会直接终止整轮扫描。
- 收集器上的键表在进入播放时构建。**运行时新增的标记不会自动登记**，运行中补出来的收集器也拿不到已经初始化过的标记。

## 真源

- **键表、查找与全部错误日志**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointCollector.cs`
- **标记登记逻辑**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointMark.cs`
- **预置目录与代码生成**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointPresetCatalog.cs`
- **实体侧扩展方法**<br>`Packages/cn.etetet.yiuimountpoint/Scripts/HotfixView/Client/MountPointCollectorComponentSystem.cs`
- **实体侧组件**<br>`Packages/cn.etetet.yiuimountpoint/Scripts/ModelView/Client/MountPointCollectorComponent.cs`

## 源码落点

- **键的归一化规则**<br>`Runtime/MountPoint/MountPointCollector.cs` 里的 `KeyToLower`
- **预设键的拼装**<br>`Runtime/MountPoint/MountPointPresetCatalog.cs` 里的索引重建
- **生成代码的落点**<br>生成目录固定为 `Scripts/ModelView/Client/Generated/MountPoint/`
- **编辑器工具入口**<br>`Editor/YIUIAutoTool/UIMountPointModule.cs`
- **键字段的 Inspector 绘制**<br>`Editor/MountPoint/MountPointKeyAttributeDrawer.cs`

## 下一步

→ [怎么用](./usage)
