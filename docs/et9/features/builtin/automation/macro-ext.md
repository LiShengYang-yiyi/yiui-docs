---
title: 宏 扩展
et9: true
---

# 宏 扩展

![](/images/et9/img/UH3BbQQgDo4hPvxULZccZ0EDnsh.png)

![](/images/et9/img/Byh3bkFezoShCMxxLXccPI20n1c.png)

任意枚举 最好使用long

1 [Flags]  旗标标记

2 [LabelText("名称")] 显示名称

3 [YIUIEnumUnityMacro] 标记到目标特性   还有一个 [YIUIEnumETMacro]

4 实现自己宏

```C#
[Flags]
[LabelText("ET")]
[YIUIEnumUnityMacro]
public enum EYIUIETMacroType : long
{
    [LabelText("所有")]
    ALL = -1,  //必须有

    [LabelText("无")]
    NONE = 0, //必须有

    //以下自定义
    [LabelText("可视化")] //显示名称
    ENABLE_VIEW = 1, //值

    //值使用 位
    1 << 1
    1 << 2
    1 << 3
    ...
    因为是long 所以最高64 根据自己需求设置 多了就开个新的枚举就是了
}
```

满足以上 就会在打开宏窗口时自动初始化到对应可选

## ET宏 [YIUIEnumETMacro] TODO
