---
title: 配置与规则
---

# 配置与规则

> 数值类型的 id、是否成长、是否保存、上下限、影响关系、公式、显示名全部在配置里。新增一个属性等于同时改表与枚举。

**关键词**：ENumericType · NumericValueCheck · NumericValueLimit · NumericValueAffect · NumericFormula · 数值类型创建窗口

## 1 两个包的分工

| 包 | 负责 |
|---|---|
| 逻辑包 | 运行时行为：数据体、API、校验、影响、派发、显示、编辑器工具 |
| 配置包 | 类型枚举与全部配置表定义、影响公式实现 |

配置包提供定义，逻辑包消费定义。两者互相引用，改动配置要两个包一起看。

## 2 五张表

| 表 | 作用 |
|---|---|
| 检查表 | 每个数值的校验信息：别名、描述、是否成长、是否保存、通知类型、公式 id |
| 上下限表 | 每个数值的重置值、最小值、最大值、优先级 |
| 影响表 | 一个数值变化时连带影响哪些数值 |
| 公式表 | 最终值怎么由基础值与成长项算出来 |
| 显示表 | 名称、描述、图标、格式串 |

上下限的取值支持多种来源：固定数、另一个数值、公式、多个数值相加。**但只有前两种在运行时被实现**，配成公式或多值累加会被静默忽略并落到默认极值。

## 3 id 编码规则

| 范围 | 含义 |
|---|---|
| 基础区间 | 最终值 id 的合法区间 |
| 成长区间 | 成长项 id 的合法区间 |
| 个位 | 成长项序号，取值 1~限定值 |

基础 id 按业务分块，**并不连续** —— 分块之间留空是正常的，不要按连续假设去遍历。

## 4 校验规则

写值时会做四层检查：

| 检查 | 不通过时 |
|---|---|
| 最终值禁止直接改（除非该类型标记为不成长） | 报错并拒绝 |
| 成长项 id 必须落在合法区间 | 报错并拒绝 |
| 成长项个位必须在限定范围内 | 报错并拒绝 |
| 类型在检查表里必须存在 | 视作非成长并报错 |

⚠️ **这整套校验只在编辑器里生效。** 构建产物里校验代码不参与编译，非法 id 与错误的读写类型都不再报错。

## 5 上下限的钳制

改完值之后按配置钳制：

- 有上限表 → 先应用重置规则，再做区间钳制
- 无上限表 → 不做钳制

钳制用的是通用区间函数，**最小值和最大值配反时底层会直接抛异常** —— 例如把最大值配成「另一个数值」而那个数值当前为 0，同时最小值是个固定正数。

## 6 影响关系

一个数值变化可以连带改另一个数值：

1. 改值 → 写库
2. 查影响表
3. 对每个受影响的数值，按生成的唯一 id 派发影响调用
4. 拿到新值后**递归改**受影响数值

唯一 id 由「数值 id 左移 + 影响类型」拼成，用于定位具体的计算公式。

三条硬约束：

- **影响表里配了关系，就必须有对应的调用实现** —— 缺少实现时调用会直接抛异常
- **没有环检测** —— A 影响 B、B 影响 A 会互相递归
- 递归改值同样会派发变化事件

## 7 公式与最终值

成长项的最终值由公式算出：

1. 改基础值或成长项
2. 判断是否为成长类型
3. 按公式 id 取公式，传入自己的数值 id
4. 算出结果后写入「最终值」那个 id

生成的公式实现形如「基础值 + 加成 1，乘以百分比，再叠加终值加成与结果加成」。

**公式是代码文本生成进 C# 的**，所以公式里出现除法而分母为 0 时没有运行时保护。

## 8 新增一个数值类型

```csharp
// 1) 用编辑器窗口创建：填 id、名称、别名、类型、是否成长、是否保存、描述、公式 id
// 2) 执行生成，得到枚举与配置
// 3) 业务侧直接使用
numeric.Set(ENumericType.NewType0, 100f);
```

创建窗口的校验项：id 是否在区间内、id 是否重复、名称是否重复、别名是否重复、别名是否为空、类型是否合法。

## 9 配置文件的落点

| 内容 | 位置 |
|---|---|
| 表定义（枚举 / bean / table） | 配置包的 `Luban/Config/Base/Defines/` |
| 数据文件 | 配置包的 `Luban/Config/Datas/Numeric/` |
| 策划录入源表 | 配置包的 `Luban/Config/Other/` |
| 生成的枚举与配置类 | 配置包的 `CodeMode/Model/*/LubanGen/Config/` |

## 真源

- **全部类型定义**<br>`Packages/cn.etetet.yiuinumericconfig/Luban/Config/Base/Defines/Numeric.xml`
- **检查、上下限、影响、公式、显示数据**<br>`Packages/cn.etetet.yiuinumericconfig/Luban/Config/Datas/Numeric/`
- **类型录入源表**<br>`Packages/cn.etetet.yiuinumericconfig/Luban/Config/Other/NumericType.xlsx`
- **校验实现**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericCheck.cs`

## 源码落点

- **上下限读取**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Data/NumericDataExtend_Limit.cs`
- **影响唯一 id 生成**<br>`Packages/cn.etetet.yiuinumericconfig/Scripts/Model/Share/Config/NumericValueAffectConfig_Extend.cs`
- **影响公式实现**<br>`Packages/cn.etetet.yiuinumericconfig/Scripts/Hotfix/Share/Affect/NumericAffectSystem.cs`
- **公式生成产物**<br>`Packages/cn.etetet.yiuinumeric/Scripts/Hotfix/Share/Formula/On_Invoke_NumericFormula_Handler.cs`
- **类型创建窗口**<br>`Packages/cn.etetet.yiuinumeric/Editor/Window/CreateNumeric.cs`
- **数值工具菜单**<br>`Packages/cn.etetet.yiuinumeric/Editor/Window/NumericMenu.cs`

## 下一步

→ [排查](./troubleshooting)
