---
title: 红点 UI 绑定
---

# 红点 UI 绑定

> 表现层把红点挂到具体节点上的两种方式：预制体静态绑定、运行时动态绑定。绑定只负责显示，不负责计算业务红点。

**关键词**：RedDotBind · RedDotTextBind · RedDotTmpBind · ChangeBind · BindDynamicRedDotByKey · BindDynamicRedDotManual · ERadDotShowType · ERedDotAnchor · IDynamicRedDotControl

## 1 静态绑定：三个参考预制体

目录：`Packages/cn.etetet.yiuireddot/Assets/GameRes/YIUI/RedDot/Bind/`

| 预制体 | 核心脚本 | 特征 |
|---|---|---|
| `RedDot.prefab` | `RedDotBind` | 基于 `MonoBehaviour`；绑定 key 后自动监听红点变化；只负责显示/隐藏；**不显示具体数字** |
| `RedDot_Text.prefab` | `RedDotTextBind` | 继承自 `RedDotBind`；增加数字显示；文本用 UGUI 原生文本 |
| `RedDot_TMP.prefab` | `RedDotTmpBind` | 功能同 `RedDotTextBind`，区别是文本用 TMP |

共同点：挂上去后在 Inspector 里选择要监听的 red dot key，运行时会自动监听该 key 的变化，自己处理显示/隐藏或数字刷新。

**这三个预制体是包内参考实现，不是直接拿来当正式业务资源用的。**

原因有两个：

1. 它们定位就是包内参考——告诉你脚本怎么挂、红点怎么绑、有数字和无数字两种表现怎么做
2. 它们在包目录里，后续包升级、同步、替换时有被覆盖的风险

正确做法：

1. 参考这三个预制体的绑定方式
2. 在**自己的业务资源目录**里创建对应的通用预制体
3. 业务界面使用自己创建的那份

包里的预制体是样板，项目里的预制体才是正式资源。

## 2 运行时换绑：ChangeBind

绑定脚本不要求把 key 在 prefab 上预先选死，支持运行时修改绑定的 key。

```csharp
public void ChangeBind(int key, bool force = false)
```

文件：`Packages/cn.etetet.yiuireddot/Runtime/Bind/RedDotBind.cs`

行为规则：

| 当前状态 | 行为 |
|---|---|
| 当前还没绑定 key（`m_Key <= 0`） | 直接切到新 key |
| 当前已绑定同一个 key | 直接返回，不重复处理 |
| 当前已绑定别的 key，`force = false` | **报错并拒绝修改** |
| 当前已绑定别的 key，`force = true` | 先解绑旧监听，再绑定到新 key |

适用场景：同一个通用 UI 组件被复用到不同入口、列表项或页签运行时才知道该监听哪个 key、同一个红点节点需要在不同状态下切换绑定目标。

推荐做法：

1. 预制体初始 key 设为无
2. 在业务初始化或数据刷新时调用 `ChangeBind`
3. 节点会被复用到不同 key 时，切换时显式传 `force = true`

```csharp
redDotBind.ChangeBind(targetKey, true);
```

注意：动态换绑解决的是「表现层监听哪个 key」，**不是**让你在 UI 层顺手创建业务红点逻辑。

## 3 动态绑定：不改 prefab 挂红点

动态红点解决的场景：

- AI 只改代码，不方便进 prefab 手动挂脚本
- 某个节点是运行时动态创建的
- 循环列表里某一项临时要显示红点
- 只想给某个 UI 节点快速挂一个红点，不想改原 prefab

它**不走** YIUI 的动态 Component / CDE 实例化链。真实流程：

1. 调用侧传入目标 `Transform`、`ERadDotShowType`、红点 key 或手动数量
2. `RedDotMgr` 根据 `ERadDotShowType` 找到对应的动态红点 prefab 资源名
3. `RedDotMgr` 调用 `YIUIGameObjectPool.Inst.Get(resName, parent)` 从对象池取红点对象
4. 红点对象挂到传入的 `parent` 下
5. `RedDotMgr` 设置九宫格锚点
6. `RedDotMgr` 从对象上获取 `IDynamicRedDotControl`
7. key 模式调用 `BindKey(key)`，手动模式调用 `SetManualCount(count)`
8. 不需要显示时，调用 `RemoveDynamicRedDot(gameObject)` 主动回收

职责边界：

| 谁 | 负责 |
|---|---|
| `RedDotMgr` | 动态加载、设置锚点、设置红点控制状态 |
| `YIUIGameObjectPool` | 对象池复用与自动回收 |
| 红点 prefab 自己的脚本 | 具体显示效果 |
| 业务层 | 计算红点数量 |

API 文件：`Packages/cn.etetet.yiuireddot/Runtime/Mgr/RedDotMgr_Dynamic.cs`

### 按稳定 key 动态绑定

```csharp
public async ETTask<GameObject> BindDynamicRedDotByKey(
    Transform parent,
    ERadDotShowType showType,
    int key,
    ERedDotAnchor anchor = ERedDotAnchor.RightTop)
```

适用：目标节点对应的是稳定红点 key，数量由红点系统按 key 自动监听刷新，只是希望运行时挂上去。

```csharp
RedDotMgr.Inst.BindDynamicRedDotByKey(
    self.u_ComPassRectTransform,
    ERadDotShowType.RedDotAnim,
    ERedDotKeyType.Key1002).Coroutine();
```

需要主动回收时保留返回的 `GameObject`：

```csharp
var redDotGo = await RedDotMgr.Inst.BindDynamicRedDotByKey(
    self.u_ComPassRectTransform,
    ERadDotShowType.RedDotAnim,
    ERedDotKeyType.Key1002,
    ERedDotAnchor.RightTop);
```

注意：

- `ERedDotKeyType` 是静态常量类，不是 C# enum，所以 API 参数是 `int key`，传 `ERedDotKeyType.Key1002` 合法
- `key <= 0` 会直接报错并返回 `null`

### 手动数量动态绑定

```csharp
public async ETTask<GameObject> BindDynamicRedDotManual(
    Transform parent,
    ERadDotShowType showType,
    int count,
    ERedDotAnchor anchor = ERedDotAnchor.RightTop)
```

适用：具体某条任务、某封邮件、某个列表项、某个格子——这类动态末级对象不适合进入稳定红点 key 树。

```csharp
var redDotGo = await RedDotMgr.Inst.BindDynamicRedDotManual(
    itemRectTransform,
    ERadDotShowType.RedDot,
    1);
```

```csharp
var redDotGo = await RedDotMgr.Inst.BindDynamicRedDotManual(
    itemRectTransform,
    ERadDotShowType.RedDotTMP,
    rewardCount,
    ERedDotAnchor.RightTop);
```

注意：

- `count >= 1` 才有显示意义，`count <= 0` 会报错并返回 `null`
- 无文本红点通常只关心 `count > 0` 显示、`count <= 0` 不创建或回收
- 手动模式的数量由业务层算好，红点系统不负责推导

### 主动回收

```csharp
public bool RemoveDynamicRedDot(GameObject gameObject)
```

```csharp
RedDotMgr.Inst.RemoveDynamicRedDot(redDotGo);
```

内部流程：先调用 `IDynamicRedDotControl.ResetState()`，再调用 `YIUIGameObjectPool.Inst.Put(gameObject)` 回收到对象池。

- 传 `null` 返回 `false`
- 传入的对象不是红点对象时会打错误日志

对象池边界：红点系统不维护 `handleId`、不维护动态实例表、不额外挂生命周期守卫脚本。常规 UI 生命周期下对象池能自动处理一部分回收；业务明确知道不需要时应主动调用 `RemoveDynamicRedDot`，避免界面频繁开关时残留到下一次复用。

## 4 ERadDotShowType：显示样式配置

动态红点 prefab 不在调用代码里直接写资源名，通过 `ERadDotShowType` 关联。

| 文件 | 作用 |
|---|---|
| `Runtime/Data/ERadDotShowType.cs` | 枚举，由 YIUI 红点工具自动生成，勿手改 |
| `Assets/GameRes/RedDot/RedDotShowAsset.asset` | 配置资源 |
| `Runtime/Show/RedDotShowData.cs` | 配置数据 |
| YIUI 红点工具 → `红点动态预制关联` 页签 | 编辑器入口 |

枚举值示例：

```csharp
ERadDotShowType.RedDot
ERadDotShowType.RedDotText
ERadDotShowType.RedDotTMP
ERadDotShowType.RedDotAnim
```

配置字段：

| 字段 | 含义 |
|---|---|
| `EnumName` | 枚举名，也是运行时查找键，必须唯一 |
| `Des` | 描述，会生成到 `ERadDotShowType` 的 `LabelText` |
| `ResName` | 预制体资源名，运行时用它从 `YIUIGameObjectPool` 加载 |

配置规则：

- 不需要写 ID
- `EnumName` 必须全英文、大驼峰、唯一
- 关联 prefab 的资源名必须全局唯一
- 编辑器里可以拖 prefab，但实际存储的是 prefab 名称；重开工具时按 `ResName` 反查，找不到说明资源丢失

调用侧只允许知道 `ERadDotShowType`，不要直接写 prefab 名。

## 5 锚点：ERedDotAnchor

控制动态红点挂到父节点后的锚点位置，支持九宫格：

`Center` · `LeftTop` · `Top` · `RightTop` · `Left` · `Right` · `LeftBottom` · `Bottom` · `RightBottom`

默认值：`RightTop`。

加载完成后统一设置：

- `anchorMin` / `anchorMax` —— 按 `ERedDotAnchor` 设置
- `pivot` —— 固定 `0.5, 0.5`
- `anchoredPosition` —— 固定 `Vector2.zero`

当前**没有 offset**。位置不合适时优先调整：父节点的 RectTransform、红点 prefab 自身尺寸与中心点、选择更合适的锚点。不要随便扩展无限偏移参数。

## 6 IDynamicRedDotControl

动态红点 prefab 必须能提供统一控制入口。

```csharp
public interface IDynamicRedDotControl
{
    void BindKey(int key);
    void SetManualCount(int count);
    void ResetState();
    GameObject GetOwnerGameObject();
}
```

要求：

- 动态加载出来的对象必须能获取到 `IDynamicRedDotControl`
- 获取不到会报错，并把对象放回对象池
- 当前基础实现是 `RedDotBind`，它已经实现了这个接口

## 7 静态绑定 vs 动态绑定

**静态绑定**

做法：prefab 上提前放红点节点，挂 `RedDotBind` / `RedDotTextBind` / `RedDot_TMP`，Inspector 里选 key。

- 优点：UI 配置直观；非程序也可以调整位置、样式、绑定对象；长期稳定 UI 更容易维护
- 缺点：需要修改 prefab；AI 不便直接介入；动态列表项不便提前配置

**动态绑定**

做法：代码里调 `BindDynamicRedDotByKey` / `BindDynamicRedDotManual`。

- 优点：AI 能介入，加一行代码即可挂红点；不需要提前改 prefab；适合动态节点、循环列表项
- 缺点：UI 灵活性差；位置样式主要依赖程序参数；需要主动回收的场景要自己留引用

结论：

- 稳定 UI 优先静态绑定
- 动态 UI、AI 自动落代码、循环列表项优先动态绑定

## 8 动态绑定的失败条件

`ERadDotShowType` 没有配置对应 prefab 时，动态绑定一定失败。常见原因：

- 枚举生成了，但 `RedDotShowAsset` 没有对应数据
- 配置里存的 `ResName` 对应 prefab 被改名或删除
- prefab 名不是全局唯一
- prefab 上没有实现 `IDynamicRedDotControl` 的脚本

## 真源

- **三个参考预制体、ChangeBind 行为、落地方式**<br>`Packages/cn.etetet.yiuireddot/Desc/06-红点UI绑定与预制体规范.md`
- **动态绑定完整 API、锚点、选型对比**<br>`Packages/cn.etetet.yiuireddot/Desc/07-动态红点绑定.md`

## 源码落点

- **三个绑定脚本**<br>`Packages/cn.etetet.yiuireddot/Runtime/Bind/*.cs`
- **动态绑定 API**<br>`Packages/cn.etetet.yiuireddot/Runtime/Mgr/RedDotMgr_Dynamic.cs`
- **管理入口**<br>`Packages/cn.etetet.yiuireddot/Runtime/Mgr/RedDotMgr.cs`
- **显示类型枚举与锚点**<br>`Packages/cn.etetet.yiuireddot/Runtime/Data/ERadDotShowType.cs` · `ERedDotAnchor.cs`
- **参考预制体**<br>`Packages/cn.etetet.yiuireddot/Assets/GameRes/YIUI/RedDot/Bind/*.prefab`

## 下一步

→ [红点排查](./troubleshooting)
