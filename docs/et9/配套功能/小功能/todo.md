# TODO

**URL**: https://ai.feishu.cn/wiki/DBkZwmtq6iUHxTklTn4czOq5nzf

**Parent**: 小功能

**Depth**: 4

---
TODO
输入“/”快速插入内容
TODO
亦亦
GetComponent&lt;XXX&gt; 针对高频访问时
还是建议封装一个属性
如果做成分析器呢  会不会更方便
代码块
C#
namespace ET
{
public partial class Unit
{
//TODO 以后这里做成分析器
//给高频使用的组件Component上添加一个特性
//[自动属性] (之类的) 然后就自动生成下面的代码
//并且以后Unit GetXXX 就报错 提示已经扩展了特性
//直接使用.XXX 就行了
//TODO 胆子再大一点 以后取消GetComponent
//直接用.XXX 根据现在有的
//[Component(typeof(XXXComponent))]
//[Child(typeof(XXXComponent))]
//分析器自动生成下面的代码 所有Get 都没了
//缺点肯定是内存会变高 如果能解决这个就更完美了
#region 数值组件的封装 因为使用频率很高
private EntityRef&lt;NumericDataComponent&gt; m_Numeric;
private NumericDataComponent            m_NumericComponent => m_Numeric;
public NumericDataComponent NumericComponent
{
get
{
if (m_NumericComponent == null)
{
m_Numeric = GetComponent&lt;NumericDataComponent&gt;();
}
return m_NumericComponent;
}
}
#endregion
#region 阵营组件的封装 因为使用频率很高
private EntityRef&lt;CampComponent&gt; m_Camp;
private CampComponent            m_CampComponent => m_Camp;
public CampComponent CampComponent
{
get
{
if (m_CampComponent == null)
{
m_Camp = GetComponent&lt;CampComponent&gt;();
}
return m_CampComponent;
}
}
#endregion
}
}