---
title: YIUI
et9: true
outline: false
aside: false
---

# YIUI

YIUI 是基于 UGUI 的 Unity UI 框架，以 **UI 数据事件绑定**为核心：视图只负责显示数据，逻辑只负责改数据，两边互不感知。它支持分层设计与分块加载，登录、加载、主界面、商店这些界面之间的跳转与回退由框架接管。

YIUI 是 ET 官方默认 UI 框架。它和 ET 遵循同一套设计原则与编码风格，所以 ET 项目接入后代码风格是连续的——多语言、无限循环列表、红点、GM 界面这些能力都已经内置。

## 支持的 ET 版本

| ET 版本 | 状态 |
| --- | --- |
| 7.2 | 可用 |
| 8.1 | 可用 |
| 9 | 本目录即对应此版本 |
| 10 | 大部分与 ET9 一致，差异单独说明 |

8.0 分支已废弃，不建议新项目使用。

## 从这里开始

- [快速入门](/et9/start/quick-start/) —— 装包、初始化，打开第一个界面。
- [通用接入](/et9/integration/general) —— 把 YIUI 接进已有工程。
- [ET 接入](/et9/integration/et) —— 在 ET 工程里完成接入。
- [ET9 运行指南](/et9/integration/run-guide) —— 接入之后还要配哪些东西。

## 主要功能

[配套功能](/et9/features/) 一节完整收录，常用的几个：

- [GM 命令](/et9/features/gm-command) —— 运行时调试入口。
- [红点系统](/et9/features/red-dot/) —— 树状红点与自动刷新。
- [无限循环列表](/et9/features/infinite-scroll/) —— 列表项复用，撑住大数据量。
- [多语言](/et9/features/localization) —— 文案从表格导入，运行时切语言。
- [UI 上显示 3D 模型](/et9/features/ui-3d-model/) —— 把模型渲染到界面层。

遇到问题先去 [常见问题](/et9/faq/) 找。

## 依赖

[Odin Inspector](https://assetstore.unity.com/packages/tools/utilities/odin-inspector-and-serializer-89041)。YIUI 用它做编辑器扩展与序列化，工程里必须先装上。

## 视频教程

- [YIUI 框架入门（4 小时）](https://www.bilibili.com/video/BV1cz4y1s7QS) —— 从安装到主界面、商店、无限循环列表、多语言，逐段走一遍。
- [ET 接入 YIUI](https://www.bilibili.com/video/BV1s44y1F7aZ) —— 专门讲 ET 工程的接入步骤。

## 源码与社区

- YIUI 源码：[LiShengYang-yiyi/YIUI](https://github.com/LiShengYang-yiyi/YIUI)
- 包目录：[YIUI 所有包](/et9/framework/package-list/)
- 全部仓库：[ET-Packages / yiui](https://github.com/orgs/ET-Packages/repositories?q=yiui&type=all)
- Demo 包：[cn.etetet.yiuistatesync](https://github.com/ET-Packages/cn.etetet.yiuistatesync)
- 交流群：833479762

YIUI 取自「亦」字——亦（yi）（易），一个用起来容易、上手简单的框架。
