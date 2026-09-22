---
title: 伤害提示
---

# 伤害提示

> 战斗飘字：一次调用同时支持「3D 世界里从单位头顶冒出来」和「UI 层某个位置冒出来」，样式靠换预制体，实例全部池化复用。

**关键词**：yiuidamagetips · DamageTipsHelper · DamageTipsPanelComponent · DamageNumber · 3D 飘字 · UI 飘字 · ObjAsyncCache

## 1 定位与边界

管一件事：**把数值与文本变成屏幕上会动、会淡出的飘字**。

与普通提示弹窗的差别：

| 维度 | 伤害飘字 | 提示弹窗 |
|---|---|---|
| 生命周期 | 短，播完自回收 | 由业务决定何时关 |
| 位置 | 跟随世界坐标或 UI 坐标 | 固定位置 |
| 跟随目标 | 支持 | 不支持 |
| 样式 | 每种样式一个预制体 | 一套界面 |

它不管的事：数值怎么算出来的、该不该飘（判断逻辑都在业务侧）、飘字的视觉设计（配置在预制体上）。

底层用第三方飘字插件做渲染与动画，本包做的是 **ET 分层封装 + 池化 + 统一入口**。

## 2 两类飘字

| 类型 | 适用场景 | 根节点 | 渲染方式 |
|---|---|---|---|
| 3D 飘字 | 世界里单位头顶 | 普通 `Transform` | 网格版，跟随世界坐标 |
| UI 飘字 | 界面上某个控件旁 | `RectTransform` | GUI 版，跟随屏幕坐标 |

**区分方式是按根节点上有没有 `RectTransform`** —— 预制体根节点类型写错会挂到错误的父节点下。

两种飘字各自的内部结构也不同：3D 版走网格复制，UI 版走双份文本叠层。样式改在预制体里，代码不参与。

## 3 面板与池

所有飘字都由一个常驻面板统一管理：

| 成员 | 作用 |
|---|---|
| 原型字典 | 每种预制体的原型对象，名字去掉 `(Clone)` 后改名为 `(Original)` |
| 池字典 | 按预制体名分桶的实例池 |
| 池父节点 | 池中对象的挂载点 |

- **3D 飘字**的池父节点是一个不随场景销毁的常驻节点 —— 世界坐标飘字必须活在场景切换之外
- **UI 飘字**的池父节点是面板自己的一个子节点

首次用到某预制体时才创建：加并发锁防重复创建 → 实例化 → 确保挂了飘字脚本 → 按类型挂到对应父节点 → 入池。

回收是**回收不是销毁**：播完把对象 `SetActive(false)` 放回池。只有面板销毁时才真正清理。

## 4 自动打开

调用飘字时不需要先手动打开面板。内部逻辑：

1. 场景已销毁 → 直接返回空
2. 管理器里已有该面板 → 直接用
3. 没有 → 异步打开面板，再继续

面板层级与配置在预制体上（本包的示例面板挂在面板层）。

## 5 样式与数值合成

**「伤害类型」不是一个枚举参数，而是靠换预制体区分。**

| 想变什么 | 怎么变 |
|---|---|
| 整体观感 | 换预制体 |
| 前缀符号 | 预制体上的左文本，例如治疗用 `+`、伤害用 `-` |
| 数字格式 | 小数位、千分位、K/M/B 缩写、最大位数 |
| 颜色 | 固定色、渐变、随机色、或按数值区间取色 |

文本由三段拼成：前缀（顶部文本 + 左文本）+ 数字 + 后缀（右文本 + 底部文本）。

数字本身是文本渲染，不是数字位图 —— 所以显示格式完全由配置决定。

## 6 驱动与生命周期

动画由一个统一的更新器驱动，按固定间隔批量推进所有存活飘字，而不是每个飘字各自 Update。

| 阶段 | 行为 |
|---|---|
| 生成 | 注册进更新器，复位寿命计时 |
| 运动 | 速度、插值、跟随、抖动、旋转、缩放按配置叠加 |
| 淡出 | 透明度递减到 0 |
| 结束 | 交给池回收 |

默认寿命 2 秒。轨迹、速度、重力、随机散开方向全部来自预制体配置。

## 真源

- **静态调用入口**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/Damage/DamageTipsHelper.cs`
- **面板池与创建回收**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/HotfixView/Client/YIUISystem/DamageTips/DamageTipsPanelComponentSystem.cs`
- **面板数据字段**<br>`Packages/cn.etetet.yiuidamagetips/Scripts/ModelView/Client/YIUIComponent/DamageTips/DamageTipsPanelComponent.cs`
- **面板预制体与池父节点绑定**<br>`Packages/cn.etetet.yiuidamagetips/Assets/GameRes/YIUI/DamageTips/Prefabs/DamageTipsPanel.prefab`

## 源码落点

- **3D 与 UI 飘字的分支判定**<br>`Scripts/HotfixView/Client/YIUISystem/DamageTips/DamageTipsPanelComponentSystem.cs`
- **示例 3D 飘字**<br>`Assets/GameRes/Damage/3D/Damage_3D_SawNeon.prefab`
- **示例 UI 飘字**<br>`Assets/GameRes/Damage/UI/Damage_UI_PixelHeal.prefab`
- **飘字插件本体**<br>`Plugins/DamageNumbersPro/Scripts/`
- **GM 验证命令**<br>`Scripts/HotfixView/Client/GM/GM_Command_DamageTips.cs`

## 下一步

→ [怎么调用](./usage)
