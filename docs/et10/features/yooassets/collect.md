---
title: 资源收集与构建
---

# 资源收集与构建

> 打什么、怎么打由 YooAsset 的收集器决定。本包提供六个针对 YIUI 目录结构的过滤规则，另外负责把散图打进图集。

**关键词**：IFilterRule · 收集器设置 · 图集生成 · SpriteAtlas · YIUIAtlasData · Addressable

## 1 六个过滤规则

本包给构建管线提供六个规则，覆盖 YIUI 资源目录的常见组合：

| 规则 | 收集范围 |
|---|---|
| 预制体 + 所有图片 | 预制体与其引用的全部图片 |
| 根文件 | 目录根下的文件 |
| 预制体 | 只要预制体 |
| 图片 | 所有图片 |
| 图集 | 图集资源文件 |
| 没有图集的图片 | 未被任何图集收录的散图 |

最后一条靠**目录名后缀匹配**判断某张图是否已被图集收录 —— 也就是说，这套规则强依赖资源目录的命名约定。目录改名会导致误判。

规则程序集只参与编辑器编译，不进构建产物。

## 2 收集器怎么配

生效的收集器设置放在启动相关包的设置目录里，针对哪个包、用什么地址、打什么包都写在这里。

关键几条约定：

- **地址按文件名** —— 所以资源名就是文件名（不含扩展名）
- **打包按目录**
- 已开启可寻址模式 → **地址必须全局唯一**

推论：**两个不同目录下的同名资源会冲突**。工程里也明确写了「不需要检查是否有重复的，因为开了可寻址必须是唯一的」，所以命名冲突要自己保证。

## 3 必须被显式收集的两个文件

| 文件 | 作用 |
|---|---|
| 界面常量文件 | 界面根节点名、资源根路径、项目资源路径等 |
| 图集数据资源 | 精灵名 → 图集名 映射 |

漏掉任一个，运行时会出现「资源加载不到」或「图集数据为空」—— **这两个文件不走目录扫描，必须显式列出**。

## 4 图集怎么生成

图集不是自动的，要手动触发一次生成：

1. 对当前构建目标执行图集打包
2. 扫描项目资源路径下的图集资源
3. 把结果写成图集数据资源，供运行时加载

生成后得到的就是启动时读的那份映射表。**新增散图后不重跑生成，运行时查不到映射，会退化成单图加载并报错。**

## 5 构建产物结构

| 产物 | 位置约定 |
|---|---|
| 资源包目录 | 以打包平台命名的子目录下，按包名再分一层 |
| 清单文件 | 可自定义文件名 |
| 内容根目录 | 默认随包存放 |

版本号运行时从远端请求得到，而宿主地址里的版本段是**代码常量** —— 两者不是同一处配置，排查版本问题时注意区分。

## 6 加一个资源的标准动作

1. 把资源放进项目资源路径下
2. 确认所在目录能被某个过滤规则覆盖
3. 如果用了图集，重跑一次图集生成
4. 资源名按文件名引用，确保全局唯一
5. 需要跨平台差异时，确认打包目录已加入收集器

## 真源

- **六个过滤规则**<br>`Packages/cn.etetet.yiuiyooassets/Editor/YooAssetExtension/YIUIYooAssetExtension.cs`
- **图集生成与图集数据写出**<br>`Packages/cn.etetet.yiuiyooassets/Editor/YIUIEditor/YIUIAtlasModule.cs`
- **生效的收集器设置**<br>`Packages/cn.etetet.statesync/Settings/AssetBundleCollectorSetting.asset`
- **清单文件名与内容根目录**<br>`Packages/cn.etetet.yooassets/Resources/YooAssetSettings.asset`

## 源码落点

- **图集数据结构**<br>`Packages/cn.etetet.yiuiyooassets/Runtime/Atlas/YIUIAtlasData.cs`
- **图集相关常量**<br>`Packages/cn.etetet.yiuiyooassets/Runtime/Atlas/YIUIConstAsset_Atlas.cs`
- **界面常量字段**<br>`Packages/cn.etetet.yiuiframework/Runtime/Core/YIUIBase/Asset/YIUIConstAsset.cs`
- **常量文件位置**<br>`Packages/cn.etetet.yiuiframework/Runtime/Core/YIUIBase/Asset/YIUIConstHelper.cs`
- **清单与包设置**<br>`Packages/cn.etetet.yooassets/Resources/`

## 下一步

→ [排查](./troubleshooting)
