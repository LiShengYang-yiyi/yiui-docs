# 层级 Layer

**URL**: https://ai.feishu.cn/wiki/Nxd0wfYogitBGokjsdec321onzg

**Parent**: 快速入门

**Depth**: 2

---
层级 Layer
输入“/”快速插入内容
层级 Layer
亦亦
YIUI会自动生成层级  EPanelLayer
遵循UGUI规则 在前的先渲染
代码块
C#
using Sirenix.OdinInspector;
namespace YIUIFramework
{
//不要修改值 否则已存在的界面会错误
//只能新增 不允许修改
/// &lt;summary&gt;
/// 层级类型
/// &lt;/summary&gt;
[LabelText("层级类型")]
public enum EPanelLayer
{
/// &lt;summary&gt;
/// 最高层
/// 一般新手引导之类的
/// &lt;/summary&gt;
[LabelText("最高层")]
Top = 0,
/// &lt;summary&gt;
/// 提示层
/// 一般 提示飘字 确认弹窗  跑马灯之类的
/// &lt;/summary&gt;
[LabelText("提示层")]
Tips = 1,
/// &lt;summary&gt;
/// 弹窗层
/// 一般是非全屏界面,可同时存在的
/// &lt;/summary&gt;
[LabelText("弹窗层")]
Popup = 2,
/// &lt;summary&gt;
/// 普通面板层
/// 全屏界面 所有Panel打开关闭受回退功能影响
/// &lt;/summary&gt;
[LabelText("面板层")]
Panel = 3,
/// &lt;summary&gt;
/// 场景层
/// 比如 血条飘字不是做在3D时 用2D实现时的层
/// 比如 头像 ...
/// &lt;/summary&gt;
[LabelText("场景层")]
Scene = 4,
/// &lt;summary&gt;
/// 最低层
/// 要显示的这个就是最低的层级
/// &lt;/summary&gt;
[LabelText("最低层")]
Bottom = 5,
/// &lt;summary&gt;
/// 缓存层 需要缓存的暂存的丢这里
/// 这个界面不做显示 会被强制隐藏的
/// &lt;/summary&gt;
[LabelText("")]
Cache = 6,
/// &lt;summary&gt;
/// 只是用来记录数量，不可用
/// &lt;/summary&gt;
[LabelText("")]
Count = 7,
/// &lt;summary&gt;
/// 所有层，不可用
/// &lt;/summary&gt;
[LabelText("")]
Any = 8,
}
}