---
title: 排查
---

# 排查

> GM 面板的问题基本在「命令没被收集到」和「参数取值不对」这两类。前者看编译和特性，后者看类型转换。

**关键词**：重新编译 · GMKey重复 · GM 执行错误 · TryToValue · ParamVo.Get · 层级锁

## 1 先按现象分岔

| 现象 | 往哪查 |
|---|---|
| 命令没出现在面板里 | 特性 / 接口缺失、没编译、分类重复 |
| 整个面板都不在 | 模块开关关着 |
| 面板在但快捷键没用 | `OpenGMViewKey` 没配 |
| 点了执行没反应 | 命令内部抛异常被吞，或参数取值不对 |
| 参数值不是输入的 | 类型转换失败，静默返回默认值 |
| 枚举下拉是空的 | 参数没写枚举全名 |
| 界面点不动 | 有命令还挂着没返回，层级锁没解 |
| 历史记录少了 | 参数签名变了 |

## 2 命令没被收集到

按顺序检查：

1. 类是不是同时具备了命令特性和命令接口 —— **两个都要有**
2. 有没有无参构造函数 —— 反射创建实例时失败
3. **重新编译过没有** —— 命令表是运行时反射生成的，改了不编译读到的还是旧表
4. 分类常量有没有重复
5. 模块开关是不是关着

第 3 条是最常被忽略的。分类页签和命令都用反射读程序集，源码改了但没编译，运行态看到的完全是旧的。

## 3 常用日志对照

| 日志 | 含义 |
|---|---|
| `GMKey重复: {key}` | 分类常量重复，该分类被丢弃 |
| `没有找到ET.ModelView程序集` | 程序集缺失，返回空列表 |
| `没有找到ET.Client.EGMType类型` | 分类常量类找不到，返回空列表 |
| `GM 执行错误 {e}` | 命令内部抛异常，被吞掉 |
| `参数转换失败 ...` | 参数类型不匹配，返回默认值 |
| `没有实现这个类型 请检查 {type}` | 参数类型不在支持列表里 |
| `不存在红点ID: {id}` 之类 | 命令自己写的业务校验日志 |

## 4 参数取不到预期值

参数转换失败**不会抛异常**，只打一条日志然后返回该类型的零值：

- 数字解析失败 → 0
- 布尔 → false（空串、`0`、`false` 都算 false）
- 枚举找不到 → `null`

然后 `paramVo.Get<T>` 再转换一次，失败同样静默返回默认值，索引越界也是默认值。

所以**命令内部必须自己校验**。看到一个「参数总是 0」的现象，先查参数转换日志，再看控件有没有把值回写成功。

布尔参数有个细节：UI 上的开关写的是 `"1"` / `"0"`，而布尔解析把空串、`0`、`false` 当假，**其他任何字符串都当真**。所以默认值建议写 `"true"` 或 `"false"`，别写别的。

## 5 枚举下拉是空的

枚举参数必须在 `GMParamInfo` 里给出**枚举的全名**，比如 `ET.Client.EGMParamType`。

只写枚举类型名、不写命名空间，下拉框会静默拉不出来，值也转不出来。

## 6 界面点不动

执行命令时会锁住整个界面层级，命令返回才解锁。

排查顺序：

1. 有没有一个 GM 命令正在 `await` 一个不会返回的东西
2. 命令里是不是卡在某个异步等待上
3. 是不是命令返回了但面板没关，导致看起来「还锁着」

命令返回的时机决定窗口关闭时机，也决定解锁时机——这是同一步。写命令时让 `Run` 尽早返回。

## 7 历史记录少了

历史项的还原校验包含参数的类型、显示名、枚举全名。**改任何一个，旧历史就失效。**

表现为「历史列表自己变短了」，实际是启动时清理掉的。改参数文案前先想清楚这个代价。

## 8 命令之间的互相覆盖

命令类的完整类名重复时，**后面的静默覆盖前面的**，没有任何日志。

不同命名空间下的同名类属于合法写法，但会互相覆盖。命名时带上业务前缀能避免这个问题。

## 9 命令失败要返回什么

`Run` 的返回值表示「这次交互是否结束」，不是「执行是否成功」。

- 返回 `true` → 关掉列表视图
- 返回 `false` → 保持打开，方便连续调参

所以不该无脑 `return true`：交互式调试的命令返回 `false` 更顺手，一次性命令返回 `true` 更省事。

## 真源

- **执行与异常捕获**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMCommandComponentSystem.cs`
- **分类反射与重复检测**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMKeyHelper.cs`
- **参数类型转换**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/EGMParamType.cs`
- **历史失效判定**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GMHistoryComponentSystem.cs`

## 源码落点

- **面板开关判断**<br>`Scripts/HotfixView/Client/GM/YIUIEventInitializeAfterGMHandler.cs`
- **层级锁实现**<br>`Scripts/HotfixView/Client/GM/GMCommandComponentSystem.cs`
- **参数控件渲染分支**<br>`Scripts/HotfixView/Client/YIUISystem/GM/GMParamItemComponentSystem.cs`
- **历史结构版本**<br>`Scripts/ModelView/Client/GM/GMHistoryData.cs`

## 下一步

→ [返回界面与配套能力](../)
