# cn.etetet.yiuifrframework - YIUI 框架主包

## 包说明

**name**: cn.etetet.yiuifrframework  
**version**: 4.0.0 (根据 packages-lock.json)  
**status**: ⚠️ 需要同步

## 状态

**⚠️ 警告**: 该包目录当前为空或未正确同步

根据 `packages-lock.json` 显示：
```
"cn.etetet.yiuifrframework": {
    "version": "file:cn.etetet.yiuifrframework"
}
```

这是一个本地文件协议的包，但目录内容为空。

## 解决方案

### 方案 1: 同步包

在 Unity 中打开包管理器，点击同步或刷新按钮。

### 方案 2: 检查 git 仓库

该包可能托管在 Git 仓库中，需要正确克隆：

```
URL: https://github.com/ET-Packages/cn.etetet.yiuifrframework
或者
URL: https://github.com/LiShengYang-yiyi/YIUI/tree/YIUI-ET9.0
```

## 预期功能

根据 YIUI 框架架构，cn.etetet.yiuifrframework 应该包含：

### 核心功能模块

| 模块 | 说明 |
|------|------|
| YIUIManager | UI 管理器 |
| YIUIPanel | 面板基类 |
| YIUIComponent | 实体 UI 组件 |
| YIUIAction | UI 动作系统 |
| YIUIBinder | 数据绑定 |
| YIUIView | 视图系统 |

### 预期目录结构

```
cn.etetet.yiuifrframework/
├── Scripts/
│   ├── Model/
│   │   └── Share/
│   │       ├── YIUIManager.cs
│   │       ├── YIUIPanel.cs
│   │       ├── YIUIComponent.cs
│   │       └── ...
│   ├── ModelView/
│   │   └── Client/
│   │       └── YIUI/
│   │           └── ...
│   └── Hotfix/
│       └── ...
├── Runtime/
│   └── ...
├── Editor/
│   └── ...
└── package.json
```

## 依赖关系

预期依赖：
```json
{
    "dependencies": {
        "cn.etetet.core": "4.0.0",
        "cn.etetet.yiui": "0.0.0"
    }
}
```

## 修复步骤

### 如果你是项目维护者

1. 检查 Unity Package Manager
2. 确保包已正确同步
3. 或者手动克隆仓库到正确位置

### 如果你是开发者

1. 联系项目维护者同步此包
2. 或者查看是否有本地路径配置问题

## 临时解决方案

在包同步完成前，可以：
1. 查看其他 YIUI 相关包（如 cn.etetet.yiuigm）
2. 参考 YIUI 文档：https://lib9kmxvq7k.feishu.cn/wiki/ES7Gwz4EAiVGKSkotY5cRbTznuh
