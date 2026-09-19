---
title: 层级 Layer
et9: true
---

# 层级 Layer

![](/images/et9/img/Z03Vb0OEYo3SJHxrfqkc6R61nkg.png)

YIUI会自动生成层级  EPanelLayer

遵循UGUI规则 在前的先渲染

```C#
using Sirenix.OdinInspector;

namespace YIUIFramework
{
    //不要修改值 否则已存在的界面会错误
    //只能新增 不允许修改
    /// <summary>
    /// 层级类型
    /// </summary>
    [LabelText("层级类型")]
    public enum EPanelLayer
    {
        /// <summary>
        /// 最高层
        /// 一般新手引导之类的
        /// </summary>
        [LabelText("最高层")]
        Top = 0,

        /// <summary>
        /// 提示层
        /// 一般 提示飘字 确认弹窗  跑马灯之类的
        /// </summary>
        [LabelText("提示层")]
        Tips = 1,

        /// <summary>
        /// 弹窗层
        /// 一般是非全屏界面,可同时存在的
        /// </summary>
        [LabelText("弹窗层")]
        Popup = 2,

        /// <summary>
        /// 普通面板层
        /// 全屏界面 所有Panel打开关闭受回退功能影响
        /// </summary>
        [LabelText("面板层")]
        Panel = 3,

        /// <summary>
        /// 场景层
        /// 比如 血条飘字不是做在3D时 用2D实现时的层
        /// 比如 头像 ...
        /// </summary>
        [LabelText("场景层")]
        Scene = 4,

        /// <summary>
        /// 最低层
        /// 要显示的这个就是最低的层级
        /// </summary>
        [LabelText("最低层")]
        Bottom = 5,

        /// <summary>
        /// 缓存层 需要缓存的暂存的丢这里
        /// 这个界面不做显示 会被强制隐藏的
        /// </summary>
        [LabelText("")]
        Cache = 6,

        /// <summary>
        /// 只是用来记录数量，不可用
        /// </summary>
        [LabelText("")]
        Count = 7,

        /// <summary>
        /// 所有层，不可用
        /// </summary>
        [LabelText("")]
        Any = 8,
    }
}
```

0-6 可用

每个层级就是字面意思

根据需求把自己的UI设置在不同的层级

自动创建时默认 = 面板层

![](/images/et9/img/MYhmbHWbQorToYxKfFfcRwADn7v.png)

## Panel层

普通面板层

1. Panel层同时只能显示一个Panel  其他层级不影响自行管理

1. Panel层受堆栈管理

打开新的时上一个就会被隐藏  当前被关闭时会打开上一个

1. HomePanel 可快捷回退

### 如果你想同时显示多个UI

1. 这个UI设置在不同的层级
2. 做成View 包装在同一个UI下
