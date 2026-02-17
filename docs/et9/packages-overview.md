# YIUI ET9 包功能速查文档

> 本文档供 AI 开发使用，按功能分组整理 YIUI 相关包

---

## 📦 资源系统 (Resource)

### 1. cn.etetet.loader - 加载器

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 32 |
| 描述 | 客户端代码加载器，支持热更新 |

**核心功能:**
- `CodeLoader` - 代码加载与热更新
- `GlobalConfig` - 全局配置管理
- `HttpClientHelper` - HTTP 请求辅助
- 支持 Editor 和 Runtime模式

**目录 双结构:**
```
cn.etetet.loader/
├── CodeMode/Loader/Server/     # 服务端加载器
├── Editor/                    # 编辑器工具
├── Scripts/Loader/Client/     # 客户端加载
├── Scripts/Loader/Share/      # 共享代码
├── Scripts/Model/Server/     # 服务端模型
└── Scripts/ModelView/        # 模型视图
```

---

### 2. cn.etetet.packagemanager - 包管理

| 属性 | 值 |
|------|-----|
| Namespace | ET.PackageManager.Editor |
| 文件数 | 52 |
| 描述 | Unity 包管理器编辑器扩展 |

**核心功能:**
- 包依赖管理
- 包版本控制
- 编辑器集成

---

### 3. cn.etetet.yooassets - YooAssets 资源系统

| 属性 | 值 |
|------|-----|
| Namespace | YooAsset.Editor / YooAsset |
| 文件数 | 379 |
| 描述 | 强大的 Unity 资源管理系统 |

**核心功能:**
- 资源打包 (AssetBundle)
- 资源加载与缓存
- 资源更新与下载
- 资源分析与报告
- 远程调试

**子系统:**
| 模块 | 功能 |
|------|------|
| AssetBundleBuilder | 资源打包构建 |
| AssetBundleCollector | 资源收集规则 |
| AssetBundleReporter | 资源报告分析 |
| AssetBundleDebugger | 运行时调试 |
| DownloadSystem | 下载系统 |
| FileSystem | 文件系统抽象 |
| ResourceManager | 资源管理器 |

**使用示例:**
```csharp
// 初始化
await YooAssets.InitializeAsync();

// 加载资源
var handle = YooAssets.LoadAssetAsync<Texture>("Sprite");
await handle.Task;
var texture = handle.AssetObject as Texture;
```

---

### 4. cn.etetet.yiuiyooassets - YIUI 资源扩展

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor |
| 文件数 | 15 |
| 描述 | YIUI 框架的 YooAssets 集成扩展 |

**核心功能:**
- YIUI 资源加载扩展
- 编辑器资源管理

---

## 🛠️ 配置工具 (Config)

### 5. cn.etetet.yiuiluban - Luban 配置

| 属性 | 值 |
|------|-----|
| Namespace | ET.YIUITest |
| 文件数 | 101 |
| 描述 | Luban 配置系统客户端代码 |

**核心功能:**
- 配置数据加载
- 配置表生成
- 客户端配置扩展

**配置类型:**
- `YIUIClientConfig` - 客户端配置
- `YIUIClientServerConfig` - 客户端服务器配置
- `YIUIItemConfig` - 物品配置
- `YIUIShape` / `YIUIRectangle` / `YIUICircle` - 形状配置

---

### 6. cn.etetet.yiuilubangen - Luban 生成器

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 99 |
| 描述 | Luban 配置代码生成工具 |

**核心功能:**
- 从配置生成 C# 代码
- 配置表结构生成

---

### 7. cn.etetet.excel - Excel

| 属性 | 值 |
|------|-----|
| Namespace | (待分析) |
| 文件数 | (待分析) |
| 描述 | Excel 导入导出工具 |

---

### 8. cn.etetet.db - 数据库

| 属性 | 值 |
|------|-----|
| Namespace | ET.Server |
| 文件数 | 7 |
| 描述 | MongoDB 数据库组件 |

**核心功能:**
- `DBComponent` - MongoDB 数据库组件
- `DBManagerComponent` - 数据库管理器
- 支持异步数据库操作

**使用示例:**
```csharp
// MongoDB 连接
public MongoClient mongoClient;
public IMongoDatabase database;
public HashSet<string> CollectionDic;
```

---

## 🎮 其他功能 (Other)

### 9. cn.etetet.mathematics - 数学

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 1 |
| 描述 | 数学扩展库 |

---

### 10. cn.etetet.numeric - 数值系统

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 7 |
| 描述 | 数值计算系统 |

---

### 11. cn.etetet.memorypack - 内存打包

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 1 |
| 描述 | MemoryPack 序列化 |

---

### 12. cn.etetet.login - 登录

| 属性 | 值 |
|------|-----|
| Namespace | ET.Client |
| 文件数 | 55 |
| 描述 | 登录系统 |

---

### 13. cn.etetet.wow - WOW

| 属性 | 值 |
|------|-----|
| Namespace | (待分析) |
| 文件数 | (待分析) |
| 描述 | WOW 魔兽世界相关功能 |

---

### 14. cn.etetet.startconfig - 启动配置

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 5 |
| 描述 | 启动配置管理 |

---

### 15. cn.etetet.test - 测试

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 15 |
| 描述 | 测试框架集成 |

---

### 16. cn.etetet.console - 控制台

| 属性 | 值 |
|------|-----|
| Namespace | ET.Server |
| 文件数 | 9 |
| 描述 | 服务端控制台 |

---

### 17. cn.etetet.robot - 机器人

| 属性 | 值 |
|------|-----|
| Namespace | ET.Client |
| 文件数 | 11 |
| 描述 | 机器人/AI 控制 |

---

### 18. cn.etetet.aspire -  aspirations

| 属性 | 值 |
|------|-----|
| Namespace | ET.Server |
| 文件数 | 2 |
| 描述 | 服务器 aspirations |

---

### 19. cn.etetet.yiuigameobjectpool - 对象池

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | (Runtime + Scripts) |
| 描述 | GameObject 对象池系统 |

**核心类:**
- `YIUIGameObjectPool` - 对象池管理器 (单例)
- `YIUIGameObjectPoolInfo` - 对象池信息
- `YIUIGameObjectPoolTrigger` - 对象池触发器
- `YIUIAutoRecycleAsyncObjectPool` - 异步回收对象池

**功能:**
- 自动回收
- 自动释放
- 异步对象获取

---

### 20. cn.etetet.yiuigm - GM 工具

| 属性 | 值 |
|------|-----|
| Namespace | ET.Client |
| 文件数 | 32 |
| 描述 | 游戏 GM 命令工具 |

---

### 21. cn.etetet.yiuilocalizationpro - 本地化

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 124 |
| 描述 | 国际化/本地化系统 |

**功能:**
- 多语言支持
- 文本本地化
- 动态文本替换

---

### 22. cn.etetet.yiuiloopscrollrectasync - 循环滚动

| 属性 | 值 |
|------|-----|
| Namespace | (待分析) |
| 文件数 | (待分析) |
| 描述 | 异步循环滚动列表 |

---

### 23. cn.etetet.yiuimountpoint - 挂载点

| 属性 | 值 |
|------|-----|
| Namespace | ET.Client |
| 文件数 | 4 |
| 描述 | 3D 骨骼挂载点系统 |

---

### 24. cn.etetet.yiuinino - NINO

| 属性 | 值 |
|------|-----|
| Namespace | (待分析) |
| 文件数 | (待分析) |
| 描述 | NINO 框架集成 |

---

### 25. cn.etetet.yiuipsd2ui - PSD 转 UI

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor.PSD2UI |
| 文件数 | 52 |
| 描述 | Photoshop PSD 转 Unity UI |

**功能:**
- PSD 分层解析
- 自动生成 UI
- 资源导出

---

### 26. cn.etetet.yiuireddot - 红点系统

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor |
| 文件数 | 45 |
| 描述 | 通知红点/角标系统 |

**核心类:**
- `RedDotKeyAsset` - 红点键配置
- `RedDotConfigAsset` - 红点配置
- `RedDotData` - 红点数据
- `RedDotBind` - 红点绑定

**功能:**
- DAG 依赖图
- 多平台支持 (iOS/Android)
- 自动更新

---

### 27. cn.etetet.yiuitips - 提示

| 属性 | 值 |
|------|-----|
| Namespace | ET.Client |
| 文件数 | 21 |
| 描述 | UI 提示/Toast 系统 |

---

### 28. cn.etetet.yiuiunit - 单位

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 72 |
| 描述 | 游戏单位/实体系统 |

---

### 29. cn.etetet.yiui3ddisplay - 3D 显示

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor |
| 文件数 | 26 |
| 描述 | 3D 模型展示组件 |

---

### 30. cn.etetet.yiuianimancer - 动画

| 属性 | 值 |
|------|-----|
| Namespace | Animancer |
| 文件数 | 285 |
| 描述 | Animancer 动画系统 |

**描述:** 高性能 Unity 动画系统，替代 Mecanim

---

### 31. cn.etetet.yiuiaudio - 音频

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 32 |
| 描述 | 音频管理系统 |

---

### 32. cn.etetet.yiuicodeanalysis - 代码分析

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor |
| 文件数 | (待分析) |
| 描述 | 静态代码分析 |

---

### 33. cn.etetet.yiuimcp - MCP

| 属性 | 值 |
|------|-----|
| Namespace | YIUIFramework.Editor.MCP |
| 文件数 | 37 |
| 描述 | MCP (Model Context Protocol) 集成 |

---

### 34. cn.etetet.yiuizstring - 字符串

| 属性 | 值 |
|------|-----|
| Namespace | Cysharp.Text |
| 文件数 | 47 |
| 描述 | ZString 高性能字符串库 |

---

### 35. cn.etetet.yiuibox2d - Box2D

| 属性 | 值 |
|------|-----|
| Namespace | ET |
| 文件数 | 180 |
| 描述 | Box2D 物理引擎集成 |

---

### 36. cn.etetet.yiuibehave - 行为

| 属性 | 值 |
|------|-----|
| Namespace | YIUIBehave |
| 文件数 | 633 |
| 描述 | YIUI 行为树系统 |

**描述:** YIUI 行为树编辑器与运行时，数量庞大

---

### 37. cn.etetet.yiuieffect - 特效

| 属性 | 值 |
|------|-----|
| Namespace | Coffee.UIEffects.Editors |
| 文件数 | 52 |
| 描述 | UI 特效系统 (Coffee UIEffects) |

---

## 📊 包汇总表

| 序号 | 包名 | 功能组 | Namespace | 复杂度 |
|------|------|--------|-----------|--------|
| 1 | cn.etetet.loader | Resource | ET | ⭐⭐ |
| 2 | cn.etetet.packagemanager | Resource | ET.PackageManager.Editor | ⭐⭐ |
| 3 | cn.etetet.yooassets | Resource | YooAsset | ⭐⭐⭐⭐⭐ |
| 4 | cn.etetet.yiuiyooassets | Resource | YIUIFramework.Editor | ⭐ |
| 5 | cn.etetet.yiuiluban | Config | ET.YIUITest | ⭐⭐⭐ |
| 6 | cn.etetet.yiuilubangen | Config | ET | ⭐⭐⭐ |
| 7 | cn.etetet.excel | Config | - | ⭐ |
| 8 | cn.etetet.db | Config | ET.Server | ⭐⭐ |
| 9 | cn.etetet.mathematics | Other | ET | ⭐ |
| 10 | cn.etetet.numeric | Other | ET | ⭐ |
| 11 | cn.etetet.memorypack | Other | ET | ⭐ |
| 12 | cn.etetet.login | Other | ET.Client | ⭐⭐⭐ |
| 13 | cn.etetet.wow | Other | - | ⭐⭐⭐ |
| 14 | cn.etetet.startconfig | Other | ET | ⭐ |
| 15 | cn.etetet.test | Other | ET | ⭐⭐ |
| 16 | cn.etetet.console | Other | ET.Server | ⭐ |
| 17 | cn.etetet.robot | Other | ET.Client | ⭐ |
| 18 | cn.etetet.aspire | Other | ET.Server | ⭐ |
| 19 | cn.etetet.yiuigameobjectpool | Other | ET | ⭐⭐⭐ |
| 20 | cn.etetet.yiuigm | Other | ET.Client | ⭐⭐ |
| 21 | cn.etetet.yiuilocalizationpro | Other | ET | ⭐⭐⭐ |
| 22 | cn.etetet.yiuiloopscrollrectasync | Other | - | ⭐⭐ |
| 23 | cn.etetet.yiuimountpoint | Other | ET.Client | ⭐ |
| 24 | cn.etetet.yiuinino | Other | - | ⭐⭐ |
| 25 | cn.etetet.yiuipsd2ui | Other | YIUIFramework.Editor.PSD2UI | ⭐⭐⭐ |
| 26 | cn.etetet.yiuireddot | Other | YIUIFramework.Editor | ⭐⭐⭐ |
| 27 | cn.etetet.yiuitips | Other | ET.Client | ⭐⭐ |
| 28 | cn.etetet.yiuiunit | Other | ET | ⭐⭐⭐ |
| 29 | cn.etetet.yiui3ddisplay | Other | YIUIFramework.Editor | ⭐⭐ |
| 30 | cn.etetet.yiuianimancer | Other | Animancer | ⭐⭐⭐⭐ |
| 31 | cn.etetet.yiuiaudio | Other | ET | ⭐⭐ |
| 32 | cn.etetet.yiuicodeanalysis | Other | YIUIFramework.Editor | ⭐⭐ |
| 33 | cn.etetet.yiuimcp | Other | YIUIFramework.Editor.MCP | ⭐⭐ |
| 34 | cn.etetet.yiuizstring | Other | Cysharp.Text | ⭐⭐ |
| 35 | cn.etetet.yiuibox2d | Other | ET | ⭐⭐⭐ |
| 36 | cn.etetet.yiuibehave | Other | YIUIBehave | ⭐⭐⭐⭐⭐ |
| 37 | cn.etetet.yiuieffect | Other | Coffee.UIEffects | ⭐⭐⭐ |

---

## 🔗 依赖关系

```
yooassets (核心资源)
    └── yiuiyooassets (YIUI扩展)
    
luban (配置)
    └── lubangen (代码生成)
    
db (数据存储)
    └── loader (加载)

yiui (UI框架)
    ├── yiui3ddisplay
    ├── yiuipsd2ui
    ├── yiuireddot
    ├── yiuitips
    ├── yiuianimancer
    ├── yiuiaudio
    ├── yiuibehave
    ├── yiuieffect
    └── yiuilocalizationpro
```

---

*文档生成时间: 2026-02-17*
