# Other 其他功能

> YIUI 其他功能模块汇总

## 包列表

| 包名 | 功能 | 复杂度 |
|------|------|--------|
| cn.etetet.mathematics | 数学库 | ⭐ |
| cn.etetet.numeric | 数值系统 | ⭐ |
| cn.etetet.memorypack | 内存序列化 | ⭐ |
| cn.etetet.login | 登录系统 | ⭐⭐⭐ |
| cn.etetet.wow | WOW 功能 | ⭐⭐⭐ |
| cn.etetet.startconfig | 启动配置 | ⭐ |
| cn.etetet.test | 测试框架 | ⭐⭐ |
| cn.etetet.console | 服务端控制台 | ⭐ |
| cn.etetet.robot | 机器人 | ⭐ |
| cn.etetet.aspire | aspirations | ⭐ |
| cn.etetet.yiuigameobjectpool | 对象池 | ⭐⭐⭐ |
| cn.etetet.yiuigm | GM 工具 | ⭐⭐ |
| cn.etetet.yiuilocalizationpro | 本地化 | ⭐⭐⭐ |
| cn.etetet.yiuiloopscrollrectasync | 循环滚动 | ⭐⭐ |
| cn.etetet.yiuimountpoint | 挂载点 | ⭐ |
| cn.etetet.yiuinino | NINO | ⭐⭐ |
| cn.etetet.yiuipsd2ui | PSD 转 UI | ⭐⭐⭐ |
| cn.etetet.yiuireddot | 红点系统 | ⭐⭐⭐ |
| cn.etetet.yiuitips | 提示/Toast | ⭐⭐ |
| cn.etetet.yiuiunit | 单位系统 | ⭐⭐⭐ |
| cn.etetet.yiui3ddisplay | 3D 显示 | ⭐⭐ |
| cn.etetet.yiuianimancer | 动画系统 | ⭐⭐⭐⭐ |
| cn.etetet.yiuiaudio | 音频系统 | ⭐⭐ |
| cn.etetet.yiuicodeanalysis | 代码分析 | ⭐⭐ |
| cn.etetet.yiuimcp | MCP 集成 | ⭐⭐ |
| cn.etetet.yiuizstring | 字符串库 | ⭐⭐ |
| cn.etetet.yiuibox2d | Box2D 物理 | ⭐⭐⭐ |
| cn.etetet.yiuibehave | 行为树 | ⭐⭐⭐⭐⭐ |
| cn.etetet.yiuieffect | UI 特效 | ⭐⭐⭐ |

---

## 核心功能模块

### UI 系统

| 包名 | 功能 |
|------|------|
| yiuireddot | 红点/角标通知 |
| yiuitips | 提示消息/Toast |
| yiuiloopscrollrectasync | 虚拟滚动列表 |
| yiuipsd2ui | PSD 设计稿转 UI |
| yiuieffect | UI 特效 (发光/模糊等) |

### 3D/渲染

| 包名 | 功能 |
|------|------|
| yiui3ddisplay | 3D 模型展示 |
| yiuianimancer | Animancer 动画系统 |
| yiuimountpoint | 骨骼挂载点 |

### 物理

| 包名 | 功能 |
|------|------|
| yiuibox2d | Box2D 物理引擎 |

### 工具库

| 包名 | 功能 |
|------|------|
| yiuiunit | 游戏单位实体 |
| mathematics | 数学扩展 |
| memorypack | 高性能序列化 |
| yiuizstring | ZString 字符串 |
| numeric | 数值计算 |

### 游戏功能

| 包名 | 功能 |
|------|------|
| login | 登录系统 |
| yiuiGm | GM 命令工具 |
| robot | 机器人控制 |
| yiuiautobattle | 自动战斗 |

### 编辑器/开发工具

| 包名 | 功能 |
|------|------|
| yiuipsd2ui | PSD 转 UI |
| yiuicodeanalysis | 代码静态分析 |
| yiuimcp | Unity MCP 集成 |
| yiuireddot | 红点编辑器 |

### 本地化

| 包名 | 功能 |
|------|------|
| yiuilocalizationpro | 多语言本地化 |

### 性能优化

| 包名 | 功能 |
|------|------|
| yiuigameobjectpool | 对象池系统 |

---

## 重点模块详解

### 1. yiuigameobjectpool - 对象池

```csharp
// 获取对象
var go = await YIUIGameObjectPool.Instance.GetAsync("PrefabPath");

// 回收对象
YIUIGameObjectPool.Instance.Recycle(go);
```

### 2. yiuireddot - 红点系统

```csharp
// 设置红点
RedDotHelper.SetRedDot(key, count);

// 绑定红点
RedDotBind.Bind(gameObject, "MainMenu");
```

### 3. yiuilocalizationpro - 本地化

```csharp
// 获取本地化文本
var text = LocalizationHelper.GetText(key, language);

// 切换语言
LocalizationHelper.SwitchLanguage(lang);
```

### 4. yiuipsd2ui - PSD 转 UI

**功能:**
- PSD 分层解析
- 自动生成 UI 组件
- 资源导出

### 5. yiuianimancer - 动画系统

基于 Animancer 的高性能动画系统：
- 混合树
- 动画事件
- 动画层管理

### 6. yiuibehave - 行为树

> 633 个文件的大型系统

功能:
- 行为树编辑器
- 节点库
- 运行时执行

---

## 依赖关系图

```
yiui (核心)
    ├── yiuiframework (UI 框架)
    │     ├── yiuitips (提示)
    │     ├── yiuireddot (红点)
    │     ├── yiuiloopscrollrectasync (滚动)
    │     └── yiuieffect (特效)
    ├── yiuipsd2ui (PSD 转 UI)
    ├── yiui3ddisplay (3D 显示)
    ├── yiuianimancer (动画)
    └── yiuilocalizationpro (本地化)

et.core ├── yi (核心)
   uiGm (GM 工具)
    ├── login (登录)
    ├── yiuiunit (单位)
    ├── yiuibox2d (物理)
    └── yiuibehave (行为树)

yiuigameobjectpool (对象池)
```

---

*文档生成时间: 2026-02-17*
