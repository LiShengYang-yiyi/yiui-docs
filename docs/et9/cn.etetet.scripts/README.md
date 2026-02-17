# cn.etetet.scripts - ET 脚本基础包

## 包说明

**name**: cn.etetet.scripts  
**version**: 4.0.0  
**unity**: 2022.3  
**description**: ET Scripts 基础包

## 状态

⚠️ **这是一个基础定义包**

该包仅包含最基础的脚本类型定义，主要用于标识 ET 脚本包的类型。

## 目录结构

```
Scripts/
└── Model/
    └── Share/
        └── PackageType.cs        # 包类型定义
```

## 核心定义

### PackageType.cs

**文件**: `Scripts/Model/Share/PackageType.cs`

**用途**: 定义 ET 包的类型标识

**定义**:
```csharp
namespace ET
{
    public static partial class PackageType
    {
        public const int Scripts = 42;
    }
}
```

## 使用说明

### 用途

`PackageType.Scripts` 用于标识当前脚本属于 ET Scripts 类型。

**使用场景**:
```csharp
// 在配置或反射中使用
if (packageType == PackageType.Scripts)
{
    // 处理 Scripts 包
}
```

### 依赖关系

该包是纯定义包，没有运行时依赖：
```json
"dependencies": {}
```

## ET 包类型系统

ET 框架使用包类型系统来区分不同的功能包：

| 常量 | 值 | 说明 |
|------|-----|------|
| PackageType.Scripts | 42 | 脚本基础包 |

其他包类型定义在各自包的 PackageType 类中。

## 与其他包的关系

cn.etetet.scripts 是最基础的包之一，其他包可以依赖它：

- 客户端/服务端逻辑包通常需要引用
- 用于代码生成和类型识别

## AI 开发注意事项

1. **不需要直接引用**: 开发时通常不需要直接使用此包
2. **类型标识**: 主要用于框架内部类型识别
3. **扩展**: 如需定义新的包类型，可在其他包的 PackageType 中添加
