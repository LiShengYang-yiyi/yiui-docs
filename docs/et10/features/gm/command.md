---
title: 写一条命令
---

# 写一条命令

> 一条 GM 命令 = 一个标了命令特性的类 + 实现命令接口。参数在接口方法里声明，面板按类型自动生成对应控件。

**关键词**：GMAttribute · IGMCommand · GMParamInfo · EGMParamType · ParamVo · EGMType · TryToValue

## 1 最小形态

```csharp
[GM(EGMType.Tips, 1, "弹窗测试-消息弹窗")]
public class GM_TipsTest : IGMCommand
{
    public List<GMParamInfo> GetParams()
    {
        return new List<GMParamInfo>
        {
            new GMParamInfo(EGMParamType.String, "消息内容", "测试消息内容")
        };
    }

    public async ETTask<bool> Run(Scene clientScene, ParamVo paramVo)
    {
        string content = paramVo.Get<string>();
        TipsHelper.OpenSync<TipsMessageViewComponent>(clientScene, content);
        await ETTask.CompletedTask;
        return true;
    }
}
```

四个要点：

1. 特性四个参数依次是：分类、等级、显示名、描述
2. 必须实现接口
3. **必须有无参构造函数**——命令实例是反射创建的
4. `Run` 返回值决定执行完关不关面板：`true` 关，`false` 不关

## 2 声明参数

`GMParamInfo` 的构造参数依次是：类型、显示名、默认值。枚举类型还要多给一个**枚举全名**。

```csharp
new GMParamInfo(EGMParamType.Enum,   "参数0 枚举",   "Bool", "ET.Client.EGMParamType"),
new GMParamInfo(EGMParamType.String, "参数1 字符串", "字符串"),
new GMParamInfo(EGMParamType.Bool,   "参数2 布尔",   "true"),
new GMParamInfo(EGMParamType.Float,  "参数3 小数",   "0.0125"),
new GMParamInfo(EGMParamType.Int,    "参数4 整数",   "123"),
new GMParamInfo(EGMParamType.Long,   "参数5 64整数", "456"),
```

**枚举参数一定要写全名**，否则下拉框拉不出来，值也转不出来。

面板按类型渲染控件：

| 类型 | 控件 |
|---|---|
| `String` | 输入框 |
| `Int` / `Long` / `Float` | 输入框 |
| `Bool` | 开关 |
| `Enum` | 下拉框 |

## 3 在命令里取参数

`Run` 收到的 `paramVo` 按**声明顺序**取值，索引从 0 开始：

```csharp
var enumValue = paramVo.Get<EGMParamType>(0);
var content   = paramVo.Get<string>(1);
var count     = paramVo.Get<int>(2);
```

单个参数时可以不写索引。

**取不到不会抛异常**：类型转换失败或索引越界都返回该类型的默认值。所以命令内部必须自己校验参数合法性，否则会拿着 0 或空串继续跑。

## 4 加一个分类

分类常量定义在**自己的包里**，不要去改框架那份文件。

```csharp
public static partial class EGMType
{
    [GMGroup("提示窗口")]
    public const int Tips = PackageType.YIUI * 1302 + 1;
}
```

取值算法是「包级基数 × 固定数字 + 序号」，同一组里序号递增。重复的常量会让整个分类被丢掉。

## 5 真实用例

工程里各包都是同一套写法：

| 命令 | 做的事 |
|---|---|
| `GM_Command_Tips` | 弹一条提示 |
| `GM_Command_WaitTips` | 弹一条带等待的提示 |
| `GM_Command_RedDot` | 改红点数量 |
| `GM_Command_3DDisplay` | 操作 UI 内 3D 显示 |
| `GM_Command_DamageTips` | 触发伤害飘字 |
| `GM_Command_SuperScroll` | 操作循环列表 |
| `GM_Command_Box2D` | 物理相关调试 |

红点那条是个好样板：它先校验红点是否合法，不合法就打日志直接返回 `true`，合法才发布改变事件。

**命令失败时返回 `true` 还是 `false` 要想清楚**：`true` 表示「这次交互结束，关面板」，不代表成功。

## 6 三条硬约束

- 特性与接口**两个都要有**，缺一个就收集不到。
- 命令类的完整类名重复时**后面的静默覆盖前面的**，不报错。不同命名空间同名类是合法的，但会互相覆盖。
- 参数签名与历史记录强绑定：参数的类型、显示名、枚举全名任一变化，历史里对应那条就失效。改文案前先想清楚。

## 真源

- **特性定义与参数说明**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMAttribute.cs`
- **参数描述**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/GMParamInfo.cs`
- **参数类型与转换**<br>`Packages/cn.etetet.yiuigm/Scripts/ModelView/Client/GM/EGMParamType.cs`
- **官方示例模板**<br>`Packages/cn.etetet.yiuigm/Scripts/HotfixView/Client/GM/GM_Command_Test.cs`

## 源码落点

- **参数解析与执行**<br>`Scripts/HotfixView/Client/GM/GMCommandComponentSystem.cs`
- **分类常量基类**<br>`Scripts/ModelView/Client/GM/EGMType_GM.cs`
- **现成的命令样板**<br>`Packages/cn.etetet.yiuitips/Scripts/HotfixView/Client/GM/`
- **红点命令样板**<br>`Packages/cn.etetet.yiuireddot/Scripts/HotfixView/Client/GM/`
- **参数控件的交互回写**<br>`Scripts/HotfixView/Client/YIUISystem/GM/GMParamItemComponentSystem.cs`

## 下一步

→ [面板与执行](./usage)
