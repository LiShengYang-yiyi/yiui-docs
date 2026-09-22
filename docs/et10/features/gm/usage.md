---
title: 面板与执行
---

# 面板与执行

> 面板常驻，靠一个可拖拽的按钮打开命令列表；执行命令期间会锁住界面层级，命令返回才解锁。

**关键词**：GMPanelComponent · GMViewComponent · OpenGMViewKey · 层级锁 · 历史记录 · YIUI_GM_HistoryData · IntPrefs

## 1 打开面板

两条入口：

| 入口 | 说明 |
|---|---|
| GM 按钮 | 面板自带，可拖拽，位置记在本地存档里 |
| 快捷键 | 由 `OpenGMViewKey` 决定，填 `None` 即禁用 |

快捷键是**开关式**的：没打开就打开，已经打开就关掉当前视图。工程当前配置为禁用，只能点按钮。

面板打开后默认落在哪个页签由 `OpenGMViewFirstType` 决定，之后会记住上次的选择。

## 2 页签与列表

页签数据是两部分拼起来的：

- 一个固定的「历史记录」页签
- 全部命令分类，按键值升序排列

列表复用循环列表组件，所以大数量命令不会一次性铺满节点。

页签切换时重新取数据：

| 页签 | 数据来源 |
|---|---|
| 历史记录 | 从本地存档里还原，并顺手清理失效条目 |
| 普通分类 | 该分类下的命令表 |

命令条目按参数声明渲染控件，用户在控件上的输入会回写到参数描述里，点执行时再统一取值。

## 3 执行一次命令

1. 点条目上的执行按钮
2. 逐参数做类型转换，装进参数对象
3. **锁住界面层级**，防止执行期间误点其他界面
4. 调用命令的 `Run`，把当前场景和参数交给它
5. 记录一条历史
6. 命令返回 `true` 就关掉列表视图
7. 无论成败都归还参数对象、**解锁层级**

第 3 步和第 7 步是配对的。**命令的 `Run` 什么时候返回，决定面板什么时候解锁。** 一个长时间不返回的命令会让界面一直点不动。

命令内部抛异常会被捕获，只打一条错误日志，面板本身不会崩。

## 4 历史记录

执行成功后会记一条：命令的完整类名 + 各组参数的值。

存在本地存档里，键是 `YIUI_GM_HistoryData`，上限 20 条，结构带版本号——版本对不上就整份丢弃重建。

可用的操作：载入历史（把参数填回控件）、删除单条、置顶单条。

**历史项会失效。** 还原时的校验条件比较严：

- 命令类必须存在
- 参数个数一致
- 每个参数的类型、显示名、枚举全名都一致
- 枚举值必须是定义过的

任一条不满足，这条历史就被静默剔除。所以**改参数显示名会导致旧历史全部失效**。

## 5 层级锁

执行期间会调用一次「永久禁用层级点击」，结束后用返回的编号解锁。

这条锁是全层级的，不只是 GM 面板。所以：

- 命令里如果有 `await` 长时间等待，界面会一直锁着
- 给命令加上超时或明确的分段返回更稳妥
- 排查「界面点不动」时，先看有没有一个 GM 命令还挂在那儿

## 6 列表高度

命令条目里嵌了参数控件，属于嵌套布局。刷新后布局不会立刻重算，**必须在渲染回调返回前强制重建一次布局**，否则循环列表读到的是旧高度，表现为条目重叠或高度错位。

这是已知的实现细节，写自定义 GM 条目时要照做。

## 真源

- **按钮与快捷键入口**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/YIUISystem/GM/GMPanelComponentSystem.cs`
- **页签与列表**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/YIUISystem/GM/GMViewComponentSystem.cs`
- **执行流程与层级锁**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMCommandComponentSystem.cs`
- **历史读写**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMHistoryComponentSystem.cs`
- **历史数据结构与存储键**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMHistoryData.cs`

## 源码落点

- **条目的参数控件回写**<br>`Scripts/HotfixView/Client/YIUISystem/GM/GMParamItemComponentSystem.cs`
- **命令条目渲染**<br>`Scripts/HotfixView/Client/YIUISystem/GM/GMCommandItemComponentSystem.cs`
- **分类条目渲染**<br>`Scripts/HotfixView/Client/YIUISystem/GM/GMTypeItemComponentSystem.cs`
- **面板预制体**<br>`Assets/GameRes/YIUI/GM/Prefabs/GMPanel.prefab`

## 下一步

→ [排查](./troubleshooting)
