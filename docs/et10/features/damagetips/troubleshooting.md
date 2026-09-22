---
title: 排查
---

# 排查

> 飘字不出、位置不对、不跟随，三类问题各有固定的检查顺序。先看错误日志，它基本都指向具体参数。

**关键词**：目标为空 · 没有 GameObjectComponent · 挂错父节点 · 不跟随 · 池取空

## 1 错误日志对照

| 日志 | 含义 | 处置 |
|---|---|---|
| 目标为空 | 传了空的单位 | 调用前判空 |
| 目标没有 GameObjectComponent 组件 | 单位上缺组件 | 该单位类型不支持 3D 飘字 |
| 目标没有 GameObject 实体 | 单位已销毁 | 调用前判断存活 |
| 目标必须挂载 DamageNumber脚本 | 预制体没挂飘字脚本 | 检查预制体；内部会自动补挂但不保证正确 |
| 没有得到一个正确的对象 | 池里没取到实例 | 查预制体资源名是否能被加载 |
| 不需要开对象池功能 | 预制体上开了插件自带的对象池 | 关掉它，本包自己管池 |

最后一条要特别注意：插件自带的对象池开关与本包的池**不能同时用**。

## 2 飘字完全不出现

按顺序查：

1. **资源名能不能命中** —— `prefabName` 是直接当资源名加载的，写错不会报错，只会得到一个空实例
2. **面板有没有被创建** —— 场景已销毁时整条链路直接返回
3. **预制体根节点类型对不对** —— 3D 飘字根节点必须不是 `RectTransform`，UI 飘字必须带 `RectTransform`
4. **父节点挂对没有** —— 3D 走常驻节点，UI 走面板内的池父节点

第 3 条写错的后果不是报错，是**挂到错误的父节点下**，通常表现为飘在屏幕外或完全看不见。

## 3 位置不对

| 症状 | 原因 |
|---|---|
| UI 飘字整体偏移 | 池父节点的层级挂错，换算基准不是预期的矩形 |
| 3D 飘字跟着界面缩放变大变小 | 父节点不是常驻的世界空间节点 |
| 屏幕点换算后落在界面外 | 换了 UI 相机，但换算仍按旧相机 |
| 世界点漂移 | 主相机不是当前生效的渲染相机 |

UI 飘字的位置完全由「父矩形 + 屏幕点」决定，所以**先确认父节点，再怀疑坐标**。

## 4 不跟随

跟随不生效只有两种可能：

- 调用时 `follow` 传了假
- 跟随目标已被销毁 —— 这时会静默复位，不会报错

目标销毁后飘字停在最后位置，这是设计行为，不是 bug。

## 5 编辑器下的干扰项

池在编辑器里刻意留了一个「取不到就重取」的分支，方便手动删掉池对象做调试。

如果你在编辑器里手动销毁过池中的对象，可能看到异常的重复创建。**排查池问题时优先用运行时环境**。

## 6 同帧大量飘字

驱动是统一更新器按固定间隔批量推进，不是每帧逐个更新。

| 现象 | 说明 |
|---|---|
| 同一时刻出现很多飘字 | 会共享同一个更新节奏，观感整齐 |
| 想让它聚合（叠层显示倍率） | 用同源分组 + 聚合配置，本包示例预制体没开聚合 |
| 想按预设分流 | 不同 `prefabName` 各走各的池，互不影响 |

## 7 面板层级的注意点

飘字面板是**常驻面板**：自动打开后不会随业务界面关闭。

调试时如果发现面板关不掉或提前消失，先确认是不是业务自己把它当普通界面管理了 —— 它由飘字链路按需创建与持有。

## 真源

- **参数校验与错误分支**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/Damage/DamageTipsHelper.cs`
- **池创建、父节点选择、编辑器重取分支**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/YIUISystem/DamageTips/DamageTipsPanelComponentSystem.cs`
- **跟随与寿命判定**<br>`Packages/cn.etetet.yiuidamagetips/Plugins/DamageNumbersPro/Scripts/Internal/DamageNumber.cs`

## 源码落点

- **目标校验与错误文案**<br>`Scripts/HotfixView/Client/Damage/DamageTipsHelper.cs`
- **面板绑定节点**<br>`Assets/GameRes/YIUI/DamageTips/Prefabs/DamageTipsPanel.prefab`
- **插件更新器**<br>`Plugins/DamageNumbersPro/Scripts/Internal/DNPUpdater.cs`
- **GM 命令入口**<br>`Scripts/HotfixView/Client/GM/GM_Command_DamageTips.cs`

## 下一步

→ [资源接入 YooAssets](../yooassets/)
