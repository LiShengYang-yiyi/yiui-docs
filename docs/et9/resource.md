# Resource 资源系统

> 资源加载与管理相关包

## 包列表

| 包名 | 功能 | 文件数 |
|------|------|--------|
| cn.etetet.loader | 加载器 | 32 |
| cn.etetet.packagemanager | 包管理 | 52 |
| cn.etetet.yooassets | YooAssets 资源系统 | 379 |
| cn.etetet.yiuiyooassets | YIUI 资源扩展 | 15 |

---

## 1. cn.etetet.loader - 代码加载器

### 功能概述
- **热更新**: 支持运行时代码更新
- **全局配置**: 启动配置管理
- **HTTP 辅助**: 网络请求工具

### 核心文件

```
cn.etetet.loader/
├── CodeMode/Loader/Server/
│   ├── CodeLoader.cs        # 代码加载器
│   ├── Init.cs             # 初始化
│   └── NLogger.cs          # 日志
├── Editor/
│   ├── BuildEditor.cs      # 构建编辑器
│   ├── BuildHelper.cs      # 构建辅助
│   └── LoaderEditor.cs     # 加载器编辑器
├── Scripts/Loader/Client/
│   ├── CodeLoader.cs       # 客户端代码加载
│   ├── GlobalConfig.cs     # 全局配置
│   └── Init.cs            # 初始化
└── Scripts/Loader/Share/
    ├── Define.cs           # 定义
    └── HttpClientHelper.cs # HTTP 辅助
```

### 使用示例

```csharp
// 初始化
await CodeLoader.Instance.LoadAsync();

// 全局配置
var config = GlobalConfig.Instance;
```

---

## 2. cn.etetet.packagemanager - 包管理

### 功能概述
- Unity 包管理编辑器扩展
- 包依赖解析
- 版本管理

---

## 3. cn.etetet.yooassets - 资源系统 (核心)

> ⭐⭐⭐⭐⭐ 最重要的资源管理系统

### 功能概述
- **资源打包**: AssetBundle 构建
- **资源加载**: 异步资源加载
- **热更新**: 资源增量更新
- **缓存管理**: 资源缓存与释放
- **调试工具**: 运行时资源监控

### 架构

```
YooAssets
├── Editor          # 编辑器工具
│   ├── AssetBundleBuilder    # 打包构建
│   ├── AssetBundleCollector # 资源收集
│   ├── AssetBundleReporter  # 资源报告
│   └── AssetBundleDebugger # 调试器
└── Runtime        # 运行时
    ├── ResourceManager      # 资源管理
    ├── DownloadSystem       # 下载系统
    ├── FileSystem          # 文件系统
    └── OperationSystem     # 异步操作
```

### 初始化

```csharp
// 初始化 YooAssets
public async ETTask InitializeAsync()
{
    var parameters = new InitializeParameters
    {
        LocationSystem = location,
        // ...
    };
    await YooAssets.InitializeAsync(parameters);
}
```

### 资源加载

```csharp
// 加载资源
var handle = YooAssets.LoadAssetAsync<Texture>("Sprite");
await handle.Task;
var asset = handle.AssetObject;

// 加载场景
var sceneHandle = YooAssets.LoadSceneAsync("SceneName");
await sceneHandle.Task;

// 卸载资源
handle.Release();
```

### Play Modes

| 模式 | 描述 |
|------|------|
| EditorSimulateMode | 编辑器模拟模式 |
| OfflinePlayMode | 离线模式 |
| HostPlayMode | 远程模式 |

---

## 4. cn.etetet.yiuiyooassets - YIUI 资源扩展

### 功能概述
- YIUI 框架的 YooAssets 集成
- UI 资源特定优化
- 编辑器扩展

---

## ET 集成

### ResourcesComponent

YooAssets 与 ET 的集成组件：

```csharp
// ResourcesComponent.cs
public class ResourcesComponent: Entity
{
    // 资源加载
    public async ETTask<T> LoadAssetAsync<T>(string location) where T: UnityEngine.Object;
    
    // 场景加载
    public async ETTask LoadSceneAsync(string location);
    
    // 卸载
    public void Unload(string location);
}
```

---

*文档生成时间: 2026-02-17*
