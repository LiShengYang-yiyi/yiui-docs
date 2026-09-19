---
title: 定点数
et9: true
---

# 定点数

数值系统内部算法是

((((a+b)\*c)+d)\*e)+f

其中  a,b,c,d,e,f 均为long类型整数

c , e 作为倍数 在实际存储时 放大了10000倍

需求: 计算结果向零截断

((((基础值 + 附加值) \* 百分比因子) + 最终附加) \* 最终百分比因子) + 结果附加

```C#

var valueBasAdd        = self.GetByKey(bas) + self.GetByKey(add);
var valueAfterPct      = valueBasAdd * (NumericConst.IntRate + self.GetByKey(pct)) / NumericConst.IntRate;
var valueAfterFinalAdd = valueAfterPct + self.GetByKey(finalAdd);
var valueAfterFinalPct = valueAfterFinalAdd * (NumericConst.IntRate + self.GetByKey(finalPct)) / NumericConst.IntRate;
var finalResult        = valueAfterFinalPct + self.GetByKey(resultAdd);
self.ChangeValue(final, finalResult, isPushEvent, false);

var result = (long)
(
    (
        (
            (

                // 1 + 2
                self.GetByKey(bas) + self.GetByKey(add)
            )

            // * 3
          * (NumericConst.IntRate + self.GetByKey(pct)) / NumericConst.IntRate

            // + 4
          + self.GetByKey(finalAdd)
        )

        // * 5
      * (NumericConst.IntRate + self.GetByKey(finalPct)) / NumericConst.IntRate
    )

    // + 6
  + self.GetByKey(resultAdd)
);

//最终值 使用覆盖
self.ChangeValue(final, result, isPushEvent, false);
```

#### **关键结论**

放大 10000 倍的方法本质上是**一种定点数算法的简化实现**，但能否保证跨平台一致性取决于**运算规则的设计**。以下是详细分析：

---

#### **1. 为什么放大 10000 倍也是一种定点数算法？**

- **核心思想**：定点数的本质是通过整数运算模拟小数，通过固定缩放因子（如 10000）隐式定义小数点的位置。例如：

  - 放大 10000 倍等价于使用 **Q格式的** `Qm.n`，其中 `n` 是小数位数（`n=4`，因为 `10^4=10000`）。
  - 例如：`3.6` → `36000`（`Qm.4`，假设整数部分 `m` 足够大）。
- **与 Q48.16 的区别**：

::: info 内嵌表格
此处在飞书原文中是一张内嵌表格，暂未迁移。可在飞书文档中查看。
:::

---

#### **2. 能否保证跨平台一致性？**

##### **条件1：整数运算规则一致**

- **加/减/乘**：所有平台的整数运算（包括溢出行为）必须一致。

  - 例如：C# 的 `long` 在溢出时会抛出异常（使用 `checked`），而其他语言（如 C/C++）可能静默溢出。
- **除法**：必须统一舍入方式（如向零截断或四舍五入）。

  - 示例：`47500 / 10000` 在 C# 中结果为 `4`（向零截断），但若某平台默认四舍五入则为 `5`。

##### **条件2：缩放规则严格一致**

- 缩放因子（如 10000）和四舍五入逻辑必须完全一致。

  - 示例：若某平台在除法时使用 `Math.Round` 而非手动四舍五入，结果可能不同。

##### **条件3：数据范围可控**

- 中间结果必须在 `long` 的范围内（±9e18）。

  - 示例：若 `a=1e18`, `c=1e18`，则 `a*c` 会溢出 `long`（1e36 > 9e18）。

---

#### **3. 如何确保跨平台一致性？**

##### **方案1：使用放大10000倍的简化版**

- **适用场景**：精度要求低（4位小数），且输入范围可控。
- **代码一致性**：
- csharp

```C#
// 显式统一运算规则（四舍五入 + 向零截断）
long step2 = (a * c + 5000) / 10000; // 所有平台必须实现相同的四舍五入
```

- **优点**：实现简单，适合对精度要求不高的场景（如游戏金币计算）。

##### **方案2：使用 Q48.16 格式**

- **适用场景**：需要高精度（16位小数）或极大整数范围。
- **代码一致性**：
- csharp

```C#
// 使用位移和位掩码明确对齐小数点
long product = (a * b) >> 16; // Q48.16 乘法
```

- **优点**：精度高，范围大，适合科学计算或金融系统。

---

#### **4. 两种方案的对比示例**

##### **场景：计算** **`a=2, c=3.6`（放大后** **`c=36000`）**

- **放大10000倍**：
- csharp

```C#
long result = (2 * 36000 + 5000) / 10000; // (72000 + 5000)/10000 = 7.7 → 7（截断）
```

- **Q48.16**：
- csharp

```C#
long a_q16 = 2 << 16;     // Q48.16 的 2.0
long c_q16 = 3.6 * 65536; // Q48.16 的 3.6
long product = (a_q16 * c_q16) >> 16; // 精确结果为 7.2
```

---

#### **5. 最终建议**

- **选择放大10000倍**：如果满足以下条件：

  - 小数精度要求 ≤ 4 位。
  - 所有目标平台保证一致的整数运算和舍入规则。
  - 输入范围可控（避免中间溢出）。
- **选择 Q48.16**：如果：

  - 需要更高精度或更大数值范围。
  - 跨平台位移运算规则一致（如所有平台使用算术右移）。

---

#### **总结**

放大 10000 倍是一种简化的定点数算法，​**只要严格统一运算规则和缩放逻辑，可以保证跨平台一致性**。但若需要更高精度或更安全的范围控制，Q48.16 等标准格式更优。
