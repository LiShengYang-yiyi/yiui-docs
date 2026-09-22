---
title: 排查
---

# 排查

> 挂点排查只有一个核心判断：**看返回值，不要看 `out` 参数是不是 null。** 取不到键时它返回的是根节点。

**关键词**：返回根节点 · 没有找到挂点 · 已收集 · 请检查挂点标记 · 键重复

## 1 第一步永远是看返回值

```csharp
// 错误写法：取不到时也会进分支
collector.TryGet(key, out var t, false);
if (t != null) { /* 这里会拿着根节点当挂点用 */ }

// 正确写法
if (collector.TryGet(key, out var t, false)) { /* 真的取到了 */ }
```

取不到键时 `out` 拿到的是收集器根节点，所以 `t != null` 恒成立。**只判断 null 会让特效静默出现在模型原点**，看上去像「挂点位置不对」，实际是根本没命中。

## 2 判定到底是哪一类

| 现象 | 大概率原因 |
|---|---|
| 特效出现在模型原点 | 键没命中，降级到了根节点 |
| 日志报「请检查挂点标记」 | 标记不在任何收集器下 |
| 日志报「已收集」 | 同一个键注册了两次 |
| 换模之后全失效 | 新根节点没带收集器，或标记没登记 |
| 明明填了却取不到 | 键被归一化改变，或大小写 / 空格不一致 |
| 组件为 null | 实体上没挂 `MountPointCollectorComponent` |

## 3 常用日志对照

| 日志 | 含义 |
|---|---|
| `没有找到挂点:[{key}], 将默认返回根节点` | 键没命中 |
| `没有找到挂点: 因为传了一个空的字符串, 将默认返回根节点` | 键为空 |
| `请检查挂点标记 {name} 是否在挂点收集器下 上层必须有 MountPointCollector` | 标记没有父级收集器 |
| `挂点：[{name}] 关节键 [{key}] [已收集：{x}] 尝试改为:对象[{y}]的挂点，请检查并修复！` | 键重复，保留先注册者 |
| `已经有挂点标记 已绑定到收集器 ... 尝试切换到其他绑定 ...` | 一个标记绑到了两个收集器 |
| `刷新失败 目标 没有找到GameObject` | 实体侧没有表现物体 |

排查阶段把 `TryGet` 的第三个参数设成 `true`，这些日志才会打出来。批量取的时候关掉，避免刷屏。

## 4 键重复

收集器的键表以**先注册的为准**。同一个键被两个标记注册时，后来的被丢弃并打错误日志，不会覆盖。

日志里会同时给出两边的节点名，照着改命名即可。最容易出现的场景是复制粘贴节点后忘改键，或两个子收集器盖到了同一片区域。

## 5 归一化掩盖了不一致

键在写入和查询两侧都会做「去空格 + 转小写」。所以：

- `Head`、`head`、`he ad` 在查询时是同一个键
- **但在预置目录的生成代码里，常量是按规范名生成的**

如果预制体上的标记用的是手填的 `Head`，而代码里用的是生成常量 `hero_head`，两者归一化后依然对不上。表现就是「都写对了却取不到」。

排查时把两边都打印出来对比一次，别只看归一化后的结果。

## 6 换模后失效

`ResetMountPoint` / `RefreshMountPoint` 只重绑根节点引用：

- 新根节点必须自带 `MountPointCollector`
- 新根节点下的标记必须在 `Awake` 时已经登记
- 运行中补出来的收集器**不会**收到已经初始化过的标记

动态拼出来的表现物体最容易踩这条。要么保证预制体上就配好了收集器，要么换模后重建整个表现物体而不是只换根。

## 7 嵌套收集器

内层收集器扫描时遇到不属于自己的标记会**直接终止整轮扫描**。也就是说外层的标记如果被内层扫到，外层这轮就停了。

层级设计上尽量让收集器边界和节点的实际归属对齐，不要出现「一个收集器管着另一个收集器的一部分子树」。

## 8 生成代码失败

保存预置目录时报错时，是字段校验没过：

```
保存挂点目录失败：目录存在无效字段，目录={path}
```

按提示逐条对第 2 节里的校验清单。另外所属包识别是靠从资产路径往上找最近的 `package.json`，找不到会报「未找到资源所属包」。

## 真源

- **查找失败与重复键的全部日志**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointCollector.cs`
- **标记注册与绑定冲突**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointMark.cs`
- **目录校验与生成失败**<br>`Packages/cn.etetet.yiuimountpoint/Runtime/MountPoint/MountPointPresetCatalog.cs`
- **实体侧刷新失败处理**<br>`Packages/cn.etetet.yiuimountpoint/Scripts/HotfixView/Client/MountPointCollectorComponentSystem.cs`

## 源码落点

- **键的归一化规则**<br>`Runtime/MountPoint/MountPointCollector.cs`
- **收集器重建键表的时机**<br>`Runtime/MountPoint/MountPointCollector.cs` 里的 `RefreshMark`
- **实体侧组件的生命周期**<br>`Scripts/ModelView/Client/MountPointCollectorComponent.cs`

## 下一步

→ [GM 面板](../gm/)
