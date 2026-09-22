---
title: 怎么调用
---

# 怎么调用

> 全部入口都是 `DamageTipsHelper` 上的静态方法，按「3D / UI」和「锚点是单位 / 坐标 / 控件」两组维度组合。

**关键词**：Show3D · ShowUIByScreenPoint · ShowUIByRectTransform · ShowUIByWorldPoint · follow · Get

## 1 六个入口

### 3D —— 挂在单位头顶

```csharp
await DamageTipsHelper.Show3D(scene, prefabName, unit, damage);          // 只显示数字
await DamageTipsHelper.Show3D(scene, prefabName, unit, "闪避", false);   // 只显示文本
```

`follow` 默认为真，飘字会跟随单位移动。

### 3D —— 挂在世界坐标

```csharp
await DamageTipsHelper.Show3D(scene, prefabName, worldPos, damage);
```

可额外传跟随目标，让飘字跟着某个 `Transform` 走。

### UI —— 三种锚点

```csharp
await DamageTipsHelper.ShowUIByScreenPoint(scene, prefabName, screenPoint, damage);
await DamageTipsHelper.ShowUIByRectTransform(scene, prefabName, rect, damage);
await DamageTipsHelper.ShowUIByWorldPoint(scene, prefabName, worldPoint, damage);
```

| 入口 | 锚点来源 | 换算方式 |
|---|---|---|
| 屏幕点 | 屏幕像素坐标 | 屏幕点 → 面板父矩形的局部坐标 |
| 控件 | 某个 `RectTransform` 的位置 | 取其屏幕位置再换算 |
| 世界点 | 世界坐标 | 先经主相机转屏幕点，再换算 |

### 自取实例

需要自己再做设置时，`Get(scene, prefabName)` 直接从池里取一个实例。

## 2 四种参数语义

| 参数 | 说明 |
|---|---|
| 数值 | 浮点数，写入飘字并自动开启数字显示 |
| 文本 | 传字符串时**关闭数字显示**，只显示这段文本 |
| 位置 | 3D 用世界坐标；UI 用屏幕坐标或控件位置 |
| 跟随 | 真时绑定目标 `Transform` |

**`Show3D` 传文本的重载会关掉数字** —— 不要指望文本和数字同时出现，需要合成请改预制体的前缀后缀配置。

## 3 跟随是怎么实现的

设置跟随目标时做三件事：打开跟随开关、记下目标 `Transform`、把目标的实例 id 并入「同源分组」。

同源分组影响叠层与聚合行为。目标被销毁时跟随会静默复位 —— 飘字停在最后位置，不报错。

## 4 坐标换算的两个相机

| 场景 | 用的相机 |
|---|---|
| 世界点 → 屏幕点 | 主相机 |
| 屏幕点 → 面板局部坐标 | 界面管理器持有的 UI 相机 |

换算基准是**飘字父节点的父矩形**。所以预制体里池父节点的层级挂错，UI 飘字就会出现在错误位置。

## 5 换一种飘字样式

不改代码，做三件事：

1. 复制一个示例预制体到自己的资源目录
2. 改配置：前缀文本、颜色、运动轨迹、寿命、淡入淡出
3. 把新的资源名传给 `prefabName`

| 想做的效果 | 改哪一组配置 |
|---|---|
| 上浮回落 | 速度 + 重力 |
| 左右散开 | 随机翻转 + 速度横向范围 |
| 抖动 | 抖动开关与频率幅度 |
| 按数值变色 | 区间取色开关 + 渐变 |
| 长期停留 | 寿命或常驻开关 |
| 穿透显示 | 穿墙开关 |

数字格式在数字设置里：小数位、千分位分隔、单位缩写与最大位数。

## 6 真实调用范例

```csharp
// 遍历场景单位，每个飘一次
foreach (var unit in units)
{
    await DamageTipsHelper.Show3D(clientScene, prefabName, unit, Random.Range(1, 100));
}

// UI 飘在屏幕中心
Vector2 screenPoint = new(Screen.width / 2, Screen.height / 2);
DamageTipsHelper.ShowUIByScreenPoint(clientScene, prefabName, screenPoint, damage).NoContext();
```

第二种用了 `NoContext()` —— 调用方不等结果时用它避免编译器警告。

## 真源

- **六个入口与坐标换算**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/Damage/DamageTipsHelper.cs`
- **两类飘字的真实调用写法**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/GM/GM_Command_DamageTips.cs`
- **3D 飘字配置项全貌**<br>`Packages/cn.etetet.yiuidamagetips/Assets/GameRes/Damage/3D/Damage_3D_SawNeon.prefab`
- **UI 飘字配置项全貌**<br>`Packages/cn.etetet.yiuidamagetips/Assets/GameRes/Damage/UI/Damage_UI_PixelHeal.prefab`

## 源码落点

- **池的创建与并发锁**<br>`Scripts/HotfixView/Client/YIUISystem/DamageTips/DamageTipsPanelComponentSystem.cs`
- **面板懒打开逻辑**<br>`Scripts/HotfixView/Client/Damage/DamageTipsHelper.cs`
- **飘字脚本本体**<br>`Plugins/DamageNumbersPro/Scripts/Internal/DamageNumber.cs`
- **数字格式与文本合成**<br>`Plugins/DamageNumbersPro/Scripts/Internal/DamageNumber_Extend.cs`

## 下一步

→ [排查](./troubleshooting)
