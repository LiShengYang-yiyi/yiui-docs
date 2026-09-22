---
title: 资源接入 YooAssets
---

# 资源接入 YooAssets

> YIUI 框架把资源加载抽象成四个委托；这个包用 YooAsset 把四个委托实现掉，界面、图集、音频、视频全部落进同一个资源包。

**关键词**：yiuiyooassets · YIUILoadDI · YIUIYooAssetsLoadComponent · ResourcePackage · DefaultPackage · PlayMode · 引用计数

## 1 定位与边界

分工一句话：**框架定义「怎么要资源」，这个包回答「从哪拿」。**

框架侧只声明四个静态委托：

| 委托 | 职责 |
|---|---|
| 加载 | 按资源名取对象并给出句柄号 |
| 校验有效性 | 资源名在资源包里是否存在 |
| 释放单个 | 按句柄号归还 |
| 全部释放 | 整批归还 |

这个包在初始化时把四个委托一次性注入，之后框架里所有走资源的路径都自动经过 YooAsset。

它不管的事：资源怎么打、包怎么分、版本怎么定 —— 全部交给 YooAsset 与它的构建管线。

## 2 两条并存的加载链路

工程里同时存在两条链路，**句柄表互不可见**：

| 链路 | 组件 | 谁在用 |
|---|---|---|
| ET 侧 | `ResourcesLoaderComponent` | 通用资源加载 |
| YIUI 侧 | `YIUIYooAssetsLoadComponent` | 界面、图集、音频、视频 |

两者共用同一个 `ResourcePackage` 实例，但各自记账。「谁加载谁释放」必须成对，跨链路混用会造成引用计数失衡。

## 3 初始化时机与顺序

启动链是固定顺序，任一环失败都会导致后续界面初始化失败：

1. 启动流程里创建资源组件并建包
2. 建包过程：YooAssets 初始化 → 创建包 → 设为默认包 → 按 PlayMode 初始化 → 请求包版本 → 更新清单
3. 热更入口启动 → 客户端 Fiber 初始化完成
4. 界面管理器初始化 → 资源加载组件初始化 → **本包初始化**
5. 本包注入四个委托 → 发布「资源就绪」事件
6. 监听方加载图集数据 → 后续界面才开始加载资源

第 5 步的事件是**其它组件开始用资源的信号**，早于它去加载会拿到空。

## 4 资源包与运行模式

| 项 | 工程当前取值 |
|---|---|
| 包名 | 默认包，全工程只建这一个 |
| 运行模式 | 编辑器模拟模式 |
| 宿主地址 | 来自配置文件，按平台拼路径 |

模式取值的含义：

| 模式 | 资源从哪来 |
|---|---|
| 编辑器模拟 | 直接读工程资源目录，不进 Bundle |
| 离线模式 | 只读随包内容 |
| 宿主模式 | 从远端服务器下载更新 |
| Web 模式 | WebGL 平台专用路径 |

宿主地址按平台分流：PC、安卓、iOS 各走各自目录，WebGL 走流式资源目录。**版本段是代码里的常量**，改版本号要改代码。

## 5 加载与释放

| 动作 | 入口 |
|---|---|
| 加载资源 | 按资源名异步加载，返回对象与句柄号 |
| 加载并实例化 | 界面与预制体专用，实例自带释放标记 |
| 校验资源名 | 校验通过才继续 |
| 释放单个 | 按句柄号归还 |
| 整批释放 | 组件销毁时执行 |

引用计数是两层：

- YooAsset 内部按句柄数计数
- YIUI 侧按「包名 + 资源名」分组计数，归零时才真正归还底层句柄

所以同一资源被多处取用是安全的，只要引用成对。

## 6 音频、视频、图集都走这里

| 资源类型 | 经过的环节 |
|---|---|
| 界面预制体 | 界面工厂 → 加载并实例化 |
| 图集精灵 | 数据绑定组件 → 加载精灵请求 → 图集组件 |
| 原始贴图 | 数据绑定组件 → 加载贴图请求 |
| 音频剪辑 | 音频包的处理器 → 按资源名加载剪辑 |
| 视频 | 数据绑定组件 → 通用加载 |
| 框架常量文件 | 界面常量加载 → 文本资源 |

**跑不出这张表的就是绕过了本包**，需要单独确认加载路径。

## 真源

- **四个委托的实现与句柄表**<br>`Packages/cn.etetet.yiuiyooassets/Scripts/HotfixView/Client/System/YIUIYooAssetsLoadComponentSystem.cs`
- **资源组件与句柄字典**<br>`Packages/cn.etetet.yiuiyooassets/Scripts/ModelView/Client/Component/YIUIYooAssetsLoadComponent.cs`
- **框架侧的四个委托定义**<br>`Packages/cn.etetet.yiuiframework/Scripts/ModelView/Client/YIUILoad/YIUILoadDI.cs`
- **运行模式与宿主地址**<br>`Packages/cn.etetet.yooassets/Resources/YooConfig.asset`

## 源码落点

- **建包与模式分支**<br>`Packages/cn.etetet.yooassets/Runtime/ET/ResourcesComponent.cs`
- **YooAssets 本体**<br>`Packages/cn.etetet.yooassets/Runtime/YooAssets.cs`
- **包对象与句柄**<br>`Packages/cn.etetet.yooassets/Runtime/ResourcePackage/`
- **单名重载（不带包名）**<br>`Scripts/HotfixView/Client/System/YIUILoadComponentSystem_YooAsset.cs`
- **初始化完成事件**<br>`Scripts/ModelView/Client/Event/YIUIYooAssetsEvent.cs`

## 下一步

→ [加载与图集](./usage)
