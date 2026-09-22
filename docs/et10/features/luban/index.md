---
title: Luban 配置底座
---

# Luban 配置底座

> 工程里所有配置表的通用管线：表定义散落在各个包里，导出时被收集到一处，编译成 C# 配置类与二进制数据，启动时整体装进内存。

**关键词**：yiuiluban · yiuilubangen · luban.conf · schemaFiles · ConfigLoader · ConfigCategory · Singleton

## 1 定位与边界

Luban 在整个工程里的角色：**把表格变成代码和数据。**

| 输入 | 输出 |
|---|---|
| 表结构定义（枚举 / bean / table） | C# 配置类与表访问入口 |
| 表数据（yml / xlsx） | 二进制数据与 JSON |

然后 ET 侧的配置加载框架把这些数据反序列化成单例，业务通过 `XxxConfigCategory.Instance` 读表。

它不管的事：资源怎么加载（由资源包负责，只负责把 bytes 交进来）、表里配什么业务语义。

## 2 两个包的分工

| 包 | 角色 | 内容 |
|---|---|---|
| 工具包 | 工具链 + 运行时框架 | Luban 本体、代码模板、导出器、编辑器菜单、配置加载框架 |
| 产物包 | 产物 + 加载实现 | 导出配置、导出脚本、生成的代码、生成的数据、把数据读进内存的实现 |

依赖是单向的：**产物包依赖工具包，反向不依赖。**

两包真正的程序集归属都由引用文件决定，包内自带的程序集定义默认不参与编译。

## 3 目录结构

| 内容 | 位置 |
|---|---|
| 导出配置 | 产物包的 `Luban/Config/Base/luban.conf` |
| 表定义 | 各包自己的 `Luban/Config/Base/Defines/` |
| 表数据 | 各包自己的 `Luban/Config/Datas/` |
| 导出脚本 | 产物包的 `Luban/Config/Base/` 下的生成脚本 |
| Luban 工具 | 工具包的 `.Tools/Luban/` |
| 代码模板 | 工具包的 `.ToolsGen/Custom/` |
| 生成代码 | 产物包与各包的 `CodeMode/Model/*/LubanGen/` |
| 生成数据 | 产物包与各包的 `Assets/LubanGen/` |

**表定义与数据是分布式的** —— 每个功能包管自己的表，导出时由扫描器按分类收集。

## 4 分类与收集

导出按「分类」组织，每个分类对应一个目录名（例如默认配置类、各环境的启动配置类）。

收集规则：

1. 扫描所有包下的分类目录
2. 同一分类的所有表定义合并成一个集合
3. 把算出的定义文件列表写回导出配置
4. **一个分类只允许一份导出配置** —— 多份会直接中止并报重复

导出前会备份并清空已有的生成代码目录，失败时回滚。

## 5 生成产物形态

| 产物 | 特征 |
|---|---|
| 表访问类 | 单例，实现配置接口，带按 id 取值的方法 |
| 记录类 | 只读字段 + 反序列化构造 + 类型 id |
| 枚举 | 带编辑器显示名，注释取自别名 |

主键类型决定访问方式：整数主键得到 `Get(id)`，字符串主键同样按 key 取。都提供 `GetOrDefault` 与整表访问。

**表访问类不是 `Tables` 管理器** —— 管理器模板是空的，不产生任何类。入口只有各 `XxxConfigCategory` 单例。

业务读一张表：

```csharp
HeroConfig hero = HeroConfigCategory.Instance.Get(heroId);
foreach (var pair in MapConfigCategory.Instance.GetAll()) { ... }
```

## 6 运行时加载

加载时机在热更入口：

1. 热更入口启动
2. 创建配置加载器单例并异步加载
3. 逐个表反序列化
4. 注册进全局单例表
5. 解析跨表引用
6. 执行各表的自定义初始化

字节来源按环境分流：

| 环境 | 来源 |
|---|---|
| 编辑器 | 直接读生成目录下的文件 |
| 客户端真机 | 按资源名从资源包加载文本资源 |
| 服务端 | 读固定目录（服务端固定用服务端那一份） |

## 7 热重载

服务端支持单表重载：

- 控制台命令按表名重载
- API 按类型重载

重载会**替换单例实例**，而不是原地改数据。所以持有旧引用的代码看不到新值。

编辑器侧另有一套只读助手，直接读文件构造实例，**不解析跨表引用** —— 用它读带引用的字段会得到空。

## 8 与 YIUI 的关系

YIUI 没有独立的表系统。与界面相关的那几张表（例如界面功能图谱）同样走 Luban，只是定义散在各自的包里。

两套生成产物要分清：

| 生成方 | 目录 | 特征 |
|---|---|---|
| Luban | `CodeMode/Model/*/LubanGen/` | 配置类、单例、`BeanBase`、`ByteBuf` |
| YIUI 工具 | `Scripts/*/Client/YIUIGen/` | 界面组件类，文件头标注由工具自动生成 |

**目录不同、命名不同、互不干涉。** 少数 YIUIGen 文件是多语言预处理器的副产物，同样与 Luban 无关。

## 真源

- **导出配置与定义文件清单**<br>`Packages/cn.etetet.yiuilubangen/Luban/Config/Base/luban.conf`
- **运行时加载框架**<br>`Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanConfigLoader.cs`
- **生成产物的路径常量**<br>`Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanHelper.cs`
- **客户端字节来源**<br>`Packages/cn.etetet.yiuilubangen/Scripts/HotfixView/Client/LubanClientLoaderInvoker.cs`

## 源码落点

- **导出菜单与超时**<br>`Packages/cn.etetet.yiuiluban/Editor/Window/LubanTools_Gen.cs`
- **表编辑器窗口**<br>`Packages/cn.etetet.yiuiluban/Editor/Window/LubanToolsWindow.cs`
- **导出器源码**<br>`Packages/cn.etetet.yiuiluban/DotNet~/ET.YIUI.Luban.Export/`
- **加载时机**<br>`Packages/cn.etetet.statesync/Scripts/Hotfix/Share/Entry.cs`
- **反序列化实现**<br>`Packages/cn.etetet.yiuilubangen/Scripts/Hotfix/Share/LubanConfigDeserialize.cs`
- **服务端重载命令**<br>`Packages/cn.etetet.console/Scripts/Hotfix/Server/ReloadConfigConsoleHandler.cs`

## 下一步

→ [表定义与新增表](./table)
