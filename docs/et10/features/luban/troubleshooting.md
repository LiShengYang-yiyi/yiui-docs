---
title: 排查
---

# 排查

> 配置问题分三段：导出失败、导出成功但读不到、读到了但值不对。三段的原因完全不同，别混着查。

**关键词**：导出失败 · 回滚 · 读表返回空 · 生成物未提交 · CodeMode · Assets/Refresh

## 1 导出失败

导出器的每一类失败都有明确文案：

| 文案 | 原因 |
|---|---|
| 无效项目根目录 | `--project` 参数不对 |
| 未找到可导出的 Collection | 分类目录不存在或没有定义 |
| 已经存在这个分类的 luban.conf | 同一分类下有多份导出配置 |
| 源文件 luban.conf 不存在 / 不是有效 JSON | 导出配置缺失或被改坏 |
| 找不到 Luban 脚本 | 配置同目录下没有任何生成脚本 |
| 某个脚本导出失败 | 脚本退出码非 0，或标准错误非空 |
| 复制 / 删除文件失败 | 生成目录被占用 |

**最后一条是最常见的**：IDE 正在索引 `CodeMode` 生成目录时会锁住文件，导出反复重试后失败。关掉索引或稍后重试即可。

备份失败会自动回滚，所以失败后目录不会处于半成品状态。

## 2 导出流程本身的问题

| 现象 | 原因 |
|---|---|
| 提示正在导出中 | 上一次导出还没结束，编排器有互斥 |
| 导出超时 | 超过时限（180 秒）未结束 |
| 导出结果解析失败 / 没有返回结果 | 命令行输出不是合法 JSON |
| 编辑模式下才能导出 | 运行中调用被拒绝 |

## 3 导出成功但读不到

| 症状 | 原因 |
|---|---|
| 编辑器里能读，打包后读不到 | 生成的数据没被资源收集器收进去 |
| 编译不过 | 生成代码没提交，或代码模式的程序集引用没重建 |
| 类型报错「数据类型错误」 | 表访问类没有实现配置接口，被跳过注册 |
| 整表为空 | 数据文件路径写错，扫不到数据 |

## 4 读到了但值不对

| 症状 | 原因 |
|---|---|
| 键不存在，返回空 | `Get` 找不到键**不抛异常**，只打日志并返回默认值 |
| 改了表不生效 | 生成物没重新导出，或资源没刷新 |
| 编辑器助手读出来引用字段是空 | 编辑器只读助手**不解析跨表引用** |
| 重载后旧引用看不到新值 | 重载是替换单例实例，旧引用仍指向老对象 |
| 服务端读不到某张表 | 该表的 `group` 不包含服务端 |

第一条要特别注意：`Get` 的失败是**静默的**。要判空用 `GetOrDefault`，或先查是否存在。

## 5 改表不生效的排查顺序

1. 数据文件改了吗
2. 定义里 `input` 路径能扫到吗
3. 导出跑了吗，跑成功了吗
4. 生成物有变化吗（代码与二进制）
5. 资源刷新了吗
6. 编辑器缓存清了没（编辑器只读助手有静态缓存，导出前才清）
7. 服务端是否需要重载或重启

## 6 几个容易踩的点

| 点 | 说明 |
|---|---|
| 一个分类只能一份导出配置 | 多份直接中止，不合并 |
| 生成脚本的静默失败 | 标准错误有任何输出都算失败 |
| 外部类型构造函数 | 缺了会在生成代码处编译失败 |
| 表管理器类 | 模板为空，永远不生成，入口只有各表单例 |
| 历史生成目录 | 包内自带的 `LubanGen` 目录未必是当前产物，以导出配置为准 |

## 7 提交前的自检

| 检查 | 期望 |
|---|---|
| 定义文件 | 已提交 |
| 数据文件 | 已提交 |
| 导出配置 | 已提交（含定义清单变化） |
| 生成代码 | 已提交 |
| 生成数据 | 已提交 |
| 代码模式 | 若变更，引用文件已重建并提交 |

## 真源

| 路径 | 内容 |
|---|---|
| `Packages/cn.etetet.yiuiluban/Editor/Window/LubanTools_Gen.cs` | 导出编排与全部失败文案 |
| `Packages/cn.etetet.yiuiluban/DotNet~/ET.YIUI.Luban.Export/` | 扫描、重写、备份回滚 |
| `Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanConfigLoader.cs` | 加载与注册分支 |
| `Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanLog.cs` | 读表错误日志 |

## 源码落点

| 想看什么 | 打开 |
|---|---|
| 客户端字节来源 | `Packages/cn.etetet.yiuilubangen/Scripts/HotfixView/Client/LubanClientLoaderInvoker.cs` |
| 服务端字节来源 | `Packages/cn.etetet.yiuilubangen/Scripts/Hotfix/Server/LubanServerLoaderInvoker.cs` |
| 编辑器只读助手 | `Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanEditorHelper.cs` |
| 重载命令 | `Packages/cn.etetet.console/Scripts/Hotfix/Server/ReloadConfigConsoleHandler.cs` |
| 导出的路径常量 | `Packages/cn.etetet.yiuiluban/Scripts/Model/Share/Config/LubanHelper.cs` |

## 下一步

→ [返回界面与配套能力](../)
