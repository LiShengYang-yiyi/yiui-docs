# cn.etetet.yiui - YIUI 空包

## 包说明

**name**: cn.etetet.yiui  
**version**: 0.0.0  
**description**: YIUI 框架  
**category**: UI/YIUI  
**文档**: https://lib9kmxvq7k.feishu.cn/wiki/ES7Gwz4EAiVGKSkotY5cRbTznuh

## 状态

⚠️ **这是一个空包/占位符包**

该包仅包含占位符结构，没有实际的实现代码。实际的 YIUI 功能分散在其他 YIUI 相关包中。

## 目录结构

```
Scripts/
├── Model/
│   └── Share/
│       └── YIUIGen/
│           └── I2Terms/
│               └── I2Terms.cs        # 本地化术语 (生成)
├── ModelView/
│   └── Client/
│       └── YIUIGen/
│           └── I2Localize/
│               └── I2Localize.cs    # 本地化 (生成)
├── Assets/                            # Unity 资源目录
├── Ignore.ET.YIUI.asmdef             # 忽略文件
├── package.json
├── packagegit.json
└── README.md
```

## 依赖关系

该包目前没有依赖任何其他包：
```json
"dependencies": {}
```

## 实际 YIUI 包列表

YIUI 的实际功能分散在以下包中：

| 包名 | 说明 |
|------|------|
| cn.etetet.yiuifrframework | YIUI 框架主包 |
| cn.etetet.yiuiaudio | YIUI 音频系统 |
| cn.etetet.yiuianimancer | YIUI 动画系统 |
| cn.etetet.yiuiautobattle | YIUI 自动战斗 |
| cn.etetet.yiuibehave | YIUI 行为树 |
| cn.etetet.yiuibox2d | YIUI Box2D 物理 |
| cn.etetet.yiuicondition | YIUI 条件系统 |
| cn.etetet.yiuieffect | YIUI 特效系统 |
| cn.etetet.yiuigm | YIUI 游戏管理 |
| cn.etetet.yiuiinvoke | YIUI 调用系统 |
| cn.etetet.yiuilocalizationpro | YIUI 本地化 |
| cn.etetet.yiuinumeric | YIUI 数值系统 |
| cn.etetet.yiuireddot | YIUI 红点系统 |
| cn.etetet.yiuiskill | YIUI 技能系统 |
| cn.etetet.yiuitips | YIUI 提示系统 |
| cn.etetet.yiuiunit | YIUI 单位系统 |
| cn.etetet.yiui3ddisplay | YIUI 3D 显示 |

## 架构说明

YIUI 采用模块化设计，cn.etetet.yiui 作为入口/基础包，实际功能由各子包实现。

### 使用方式

在实际开发中，应该引用需要的 YIUI 子包：
```csharp
// 引用 YIUI 组件
using ET.YIUI;

// 使用 YIUI 功能
var yiuiComponent = entity.GetComponent<YIUIComponent>();
```

### 生成系统

cn.etetet.yiui 包含 YIUIGen 目录，用于代码生成：
- `I2Terms` - 本地化术语生成
- `I2Localize` - 本地化文本生成

这些通常由编辑器工具自动生成。
