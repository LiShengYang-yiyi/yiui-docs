---
title: 安全范围
et9: true
---

# 安全范围

代码中并未使用checked 检查溢出

就算溢出了也没用只是知道溢出报错了而已

在不使用 `checked` 的情况下，要确保 `long` 类型的运算不会溢出，需严格限制输入值的范围。以下是算法步骤的 **安全范围分析** 和 **具体约束条件**：

---

#### **安全范围约束（假设** **`IntRate = 10000`）​**

##### **1. 输入参数范围**

所有输入参数（`bas, add, pct, finalAdd, finalPct, resultAdd`）必须满足以下条件：

::: info 内嵌表格
此处在飞书原文中是一张内嵌表格，暂未迁移。可在飞书文档中查看。
:::

---

#### **2. 分步骤安全范围**

##### **步骤1：`valueBasAdd = bas + add`**

- **溢出条件**：`bas + add > long.MaxValue` 或 `bas + add < long.MinValue`
- **安全范围**：
- plaintext

```Plain Text
bas ∈ [long.MinValue + add, long.MaxValue - add]
add ∈ [long.MinValue + bas, long.MaxValue - bas]
```

##### **步骤2：`valueAfterPct = valueBasAdd * (IntRate + pct) / IntRate`**

- **溢出条件**：`valueBasAdd * (IntRate + pct)` 超过 `long` 范围。
- **安全范围**：
- plaintext

```Plain Text
|valueBasAdd| ≤ long.MaxValue / (IntRate + pct)
由于 pct ∈ [0, IntRate]，最坏情况为 pct = IntRate → 分母为 2 * IntRate：
|valueBasAdd| ≤ long.MaxValue / (2 * IntRate)
```

##### **步骤3：`valueAfterFinalAdd = valueAfterPct + finalAdd`**

- **溢出条件**：同步骤1。
- **安全范围**：
- plaintext

```Plain Text
finalAdd ∈ [long.MinValue - valueAfterPct, long.MaxValue - valueAfterPct]
```

##### **步骤4：`valueAfterFinalPct = valueAfterFinalAdd * (IntRate + finalPct) / IntRate`**

- **溢出条件**：同步骤2。
- **安全范围**：
- plaintext

```Plain Text
|valueAfterFinalAdd| ≤ long.MaxValue / (IntRate + finalPct)
最坏情况：finalPct = IntRate → |valueAfterFinalAdd| ≤ long.MaxValue / (2 * IntRate) ≈ 4.6e14
```

##### **步骤5：`finalResult = valueAfterFinalPct + resultAdd`**

- **溢出条件**：同步骤1。
- **安全范围**：
- plaintext

```Plain Text
resultAdd ∈ [long.MinValue - valueAfterFinalPct, long.MaxValue - valueAfterFinalPct]
```

---

#### **3. 全局安全范围（简化版）​**

若希望所有步骤绝对安全，需满足以下统一约束：

plaintext

```Plain Text
|bas|, |add|, |finalAdd|, |resultAdd| ≤ long.MaxValue / (2 * IntRate)
且
pct, finalPct ∈ [0, IntRate]
```

- **示例（**`IntRate = 10000`**）​**：
- plaintext

```Plain Text
所有参数的绝对值必须 ≤ 4.6e14（即 460,000,000,000,000）
```

---

#### **4. 验证工具**

可通过以下代码静态检查输入值是否安全：

csharp

```C#
bool IsInputSafe(
    long bas, long add, long pct,
    long finalAdd, long finalPct, long resultAdd
) {
    const long IntRate = 10000;
    const long MaxStep2Value = long.MaxValue / (2 * IntRate);
    // 检查 pct 和 finalPct 范围
    if (pct < 0 || pct > IntRate || finalPct < 0 || finalPct > IntRate)
        return false;
    // 检查步骤1：bas + add
    if (bas > 0 && add > long.MaxValue - bas) return false;
    if (bas < 0 && add < long.MinValue - bas) return false;
    // 检查步骤2：valueBasAdd 的绝对值是否 ≤ MaxStep2Value
    long valueBasAdd = bas + add;
    if (Math.Abs(valueBasAdd) > MaxStep2Value) return false;
    // 检查步骤3：valueAfterFinalAdd = valueAfterPct + finalAdd
    long valueAfterPct = valueBasAdd * (IntRate + pct) / IntRate;
    if (valueAfterPct > 0 && finalAdd > long.MaxValue - valueAfterPct) return false;
    if (valueAfterPct < 0 && finalAdd < long.MinValue - valueAfterPct) return false;
    // 检查步骤4：valueAfterFinalAdd 的绝对值是否 ≤ MaxStep2Value
    long valueAfterFinalAdd = valueAfterPct + finalAdd;
    if (Math.Abs(valueAfterFinalAdd) > MaxStep2Value) return false;
    // 检查步骤5：valueAfterFinalPct + resultAdd
    long valueAfterFinalPct = valueAfterFinalAdd * (IntRate + finalPct) / IntRate;
    if (valueAfterFinalPct > 0 && resultAdd > long.MaxValue - valueAfterFinalPct) return false;
    if (valueAfterFinalPct < 0 && resultAdd < long.MinValue - valueAfterFinalPct) return false;
    return true;
}
```

---

#### **总结**

- **安全范围**：所有输入参数的绝对值需控制在 **\~4.6e14** 以内（若 `IntRate = 10000`）。
- **约束条件**：百分比参数（`pct, finalPct`）需在 `[0, IntRate]` 范围内。
- **实践建议**：

  - 在数据输入层（如配置、网络反序列化）添加范围校验。
  - 对超出安全范围的值进行钳制（Clamp）或抛出错误。
